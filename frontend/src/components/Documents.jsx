import React, { useState, useEffect } from "react";
import {
   PlusOutlined,
   DeleteOutlined,
   SearchOutlined,
   GlobalOutlined,
   MoreOutlined,
} from "@ant-design/icons";
import { Upload, Image, message, Button, Modal, Dropdown, Menu } from "antd";
import { pdfjs } from "react-pdf";
import { apiFetch } from "../utils/api";
import "../styles/Documents.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ACCEPTED_TYPES = ["image/", "application/pdf"];

const generatePdfThumbnail = async (url) => {
   try {
      const pdf = await pdfjs.getDocument(url).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: canvas.getContext("2d"), viewport })
         .promise;
      return canvas.toDataURL();
   } catch {
      return "/pdf-fallback.png";
   }
};

const handleAnalyse = async (filename) => {
   try {
      const res = await apiFetch(
         `/api/documents/analyse/${encodeURIComponent(filename)}`,
         {
            method: "POST",
         }
      );
      if (!res) throw new Error("Analyse échouée");
      message.success(`Analyse de ${filename} terminée !`);
   } catch {
      message.error("Erreur lors de l'analyse du document");
   }
};

const handleTranslate = async (filename) => {
   try {
      const res = await apiFetch(
         `/api/documents/traduire/${encodeURIComponent(filename)}`,
         {
            method: "POST",
         }
      );
      if (!res) throw new Error("Traduction échouée");
      message.success(`Traduction de ${filename} terminée !`);
   } catch {
      message.error("Erreur lors de la traduction du document");
   }
};

const GestionDocuments = () => {
   const [fileList, setFileList] = useState([]);
   const [previewOpen, setPreviewOpen] = useState(false);
   const [previewContent, setPreviewContent] = useState("");
   const [isPdf, setIsPdf] = useState(false);
   const { Dragger } = Upload;

   const fetchDocuments = async () => {
      try {
         const res = await apiFetch("/api/documents");
         if (!res) return;
         const data = await res.json();

         const list = await Promise.all(
            data.map(async (doc) => {
               const url = `/api/documents/uploads/${encodeURIComponent(
                  doc.filename
               )}`;
               const fileRes = await apiFetch(url);
               const blob = await fileRes.blob();
               const objectUrl = URL.createObjectURL(blob);

               let thumbUrl = objectUrl;
               if (doc.fileType.startsWith("application/pdf"))
                  thumbUrl = await generatePdfThumbnail(objectUrl);

               return {
                  uid: doc.filename,
                  name: doc.filename,
                  contentType: doc.fileType,
                  url: objectUrl,
                  thumbUrl,
                  uploadedAt: doc.uploadedAt
                     ? new Date(doc.uploadedAt)
                     : new Date(),
               };
            })
         );

         // Tri par date du plus récent au plus ancien
         list.sort((a, b) => b.uploadedAt - a.uploadedAt);

         setFileList(list);
      } catch {
         message.error("Erreur lors de la récupération des documents");
      }
   };

   useEffect(() => {
      fetchDocuments();
   }, []);

   const handlePreview = (file) => {
      setIsPdf(file.contentType.startsWith("application/pdf"));
      setPreviewContent(file.url);
      setPreviewOpen(true);
   };

   const handleCustomUpload = async ({ file, onSuccess, onError }) => {
      if (!ACCEPTED_TYPES.some((type) => file.type.startsWith(type))) {
         message.error("Type de fichier non autorisé !");
         return onError(new Error("Type non autorisé"));
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
         const res = await apiFetch("/api/documents/upload", {
            method: "POST",
            body: formData,
         });
         if (!res) throw new Error("Upload failed");
         onSuccess(null);
         fetchDocuments();
         message.success(`${file.name} uploadé avec succès !`);
      } catch (err) {
         onError(err);
         message.error(`${file.name} upload échoué.`);
      }
   };

   const handleDelete = async (filename) => {
      try {
         await apiFetch(`/api/documents/${encodeURIComponent(filename)}`, {
            method: "DELETE",
         });
         message.success("Document supprimé !");
         fetchDocuments();
      } catch {
         message.error("Erreur lors de la suppression");
      }
   };

   return (
      <div className="documents-container">
         {/* Upload drag & drop */}
         <Dragger
            customRequest={handleCustomUpload}
            multiple
            accept=".png,.jpg,.jpeg,.pdf"
            showUploadList={false}
            style={{ marginBottom: 20 }}
         >
            <p className="ant-upload-drag-icon">
               <PlusOutlined />
            </p>
            <p className="ant-upload-text">
               Glissez-déposez vos fichiers ici ou cliquez pour ajouter
            </p>
         </Dragger>

         {/* Liste des documents */}
         <div className="documents-grid">
            {fileList.map((file) => (
               <div key={file.uid} className="document-item">
                  <img
                     src={file.thumbUrl}
                     alt={file.name}
                     className="document-thumb"
                     onClick={() => handlePreview(file)}
                  />

                  <div className="button-group">
                     <Button
                        className="action-button"
                        icon={<DeleteOutlined />}
                        onClick={(e) => {
                           e.stopPropagation();
                           handleDelete(file.uid);
                        }}
                     />
                     <Button
                        className="action-button"
                        icon={<SearchOutlined />}
                        onClick={(e) => {
                           e.stopPropagation();
                           handleAnalyse(file.uid);
                        }}
                     />
                     <Button
                        className="action-button"
                        icon={<GlobalOutlined />}
                        onClick={(e) => {
                           e.stopPropagation();
                           handleTranslate(file.uid);
                        }}
                     />
                     {/* Bouton 3 points */}
                     <Dropdown
                        overlay={
                           <Menu>
                              <Menu.Item key="name">
                                 Nom : {file.name}
                              </Menu.Item>
                              <Menu.Item key="date">
                                 Date :{" "}
                                 {file.uploadedAt.toLocaleString("fr-FR")}
                              </Menu.Item>
                           </Menu>
                        }
                        trigger={["click"]}
                     >
                        <Button
                           className="action-button"
                           icon={<MoreOutlined />}
                           onClick={(e) => e.stopPropagation()}
                        />
                     </Dropdown>
                  </div>
               </div>
            ))}
         </div>

         {/* Modal aperçu */}
         <Modal
            open={previewOpen}
            footer={null}
            onCancel={() => setPreviewOpen(false)}
            width="80%"
            style={{ top: 20 }}
         >
            {isPdf ? (
               <iframe
                  src={previewContent}
                  title="PDF Preview"
                  width="100%"
                  height="600px"
                  style={{ border: "none" }}
               />
            ) : (
               <Image src={previewContent} alt="preview" preview={false} />
            )}
         </Modal>
      </div>
   );
};

export default GestionDocuments;
