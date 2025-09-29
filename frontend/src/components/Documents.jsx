import React, { useState, useEffect } from "react";
import {
   DeleteOutlined,
   SearchOutlined,
   GlobalOutlined,
   FileTextOutlined,
   EyeOutlined,
   CloudUploadOutlined,
   HeartOutlined,
   MedicineBoxOutlined,
} from "@ant-design/icons";
import {
   Upload,
   message,
   Button,
   Modal,
   Select,
   Card,
   Typography,
   Tag,
   Tooltip,
   Space,
} from "antd";
import { pdfjs } from "react-pdf";
import { apiFetch, getEmailFromToken } from "../utils/api";
import "../styles/Documents.css";
import { Document as PdfDocument, Page } from "react-pdf";

// Dashboard palette
const PRIMARY = "#1A8BB7";
const SECONDARY = "#1ABC9C";
const BG_LIGHT = "#F8FAFC";
const BG_CARD = "#fff";
const SIDEBAR_BORDER = "#E3E8EF";
const TEXT_DARK = "#22313F";
const TEXT_MEDIUM = "#4B5C6B";
const GREY = "#B0B8C1";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const { Title, Text } = Typography;
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
      const email = getEmailFromToken();
      const res = await apiFetch(
         `/api/documents/analyse/${encodeURIComponent(
            filename
         )}?email=${encodeURIComponent(email)}`,
         { method: "POST" }
      );
      if (!res) throw new Error("Analyse failed");
      message.success(`Analyse de ${filename} terminée !`);
   } catch {
      message.error("Erreur lors de l'analyse du document");
   }
};

const handleTranslate = async (filename) => {
   try {
      const email = getEmailFromToken();
      const res = await apiFetch(
         `/api/documents/traduire/${encodeURIComponent(
            filename
         )}?email=${encodeURIComponent(email)}`,
         { method: "POST" }
      );
      if (!res) throw new Error("Translation failed");
      message.success(`Traduction de ${filename} terminée !`);
   } catch {
      message.error("Erreur lors de la traduction du document");
   }
};

const getFileTypeTag = (contentType) => {
   if (contentType.startsWith("application/pdf"))
      return (
         <Tag
            color={PRIMARY}
            style={{
               borderRadius: "12px",
               fontWeight: 600,
               background: "rgba(26,139,183,0.10)",
               color: PRIMARY,
               border: "none",
            }}
         >
            PDF
         </Tag>
      );
   if (contentType.startsWith("image/"))
      return (
         <Tag
            color={SECONDARY}
            style={{
               borderRadius: "12px",
               fontWeight: 600,
               background: "rgba(26,188,156,0.10)",
               color: SECONDARY,
               border: "none",
            }}
         >
            IMAGE
         </Tag>
      );
   return (
      <Tag
         color={GREY}
         style={{
            borderRadius: "12px",
            fontWeight: 600,
            background: "rgba(176,184,193,0.10)",
            color: GREY,
            border: "none",
         }}
      >
         FILE
      </Tag>
   );
};

const GestionDocuments = ({ searchQuery = "" }) => {
   const [fileList, setFileList] = useState([]);
   const [previewOpen, setPreviewOpen] = useState(false);
   const [previewContent, setPreviewContent] = useState("");
   const [isPdf, setIsPdf] = useState(false);
   const [uploading, setUploading] = useState(false);
   const { Dragger } = Upload;
   const [sortBy, setSortBy] = useState("latest");
   const [numPages, setNumPages] = useState(null);

   const onPdfLoad = ({ numPages }) => {
      setNumPages(numPages);
   };

   const fetchDocuments = async () => {
      try {
         const email = getEmailFromToken();
         const res = await apiFetch(
            `/api/documents?email=${encodeURIComponent(email)}`
         );
         if (!res) return;
         const data = await res.json();

         const list = await Promise.all(
            data.map(async (doc) => {
               const url = `/api/documents/uploads/${encodeURIComponent(
                  doc.filename
               )}?email=${encodeURIComponent(email)}`;
               const fileRes = await apiFetch(url);
               const blob = await fileRes.blob();
               const contentType = fileRes.headers.get("Content-Type");

               const fixedBlob =
                  contentType?.includes("pdf") &&
                  blob.type !== "application/pdf"
                     ? new Blob([blob], { type: "application/pdf" })
                     : blob;

               const objectUrl = URL.createObjectURL(fixedBlob);

               let thumbUrl = objectUrl;
               if (doc.fileType?.startsWith("application/pdf")) {
                  thumbUrl = await generatePdfThumbnail(objectUrl);
               }

               return {
                  uid: doc.filename,
                  name: doc.filename,
                  contentType: doc.fileType,
                  url: objectUrl,
                  blob: fixedBlob,
                  thumbUrl,
                  uploadedAt: doc.uploadedAt
                     ? new Date(doc.uploadedAt)
                     : new Date(),
               };
            })
         );

         list.sort((a, b) => b.uploadedAt - a.uploadedAt);
         setFileList(list);
      } catch {
         message.error("Erreur lors de la récupération des documents");
      }
   };

   useEffect(() => {
      fetchDocuments();
   }, []);

   const filteredDocs = fileList
      .filter(
         (file) =>
            file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            file.contentType.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
         if (sortBy === "latest") return b.uploadedAt - a.uploadedAt;
         if (sortBy === "alpha") return a.name.localeCompare(b.name);
         if (sortBy === "type")
            return a.contentType.localeCompare(b.contentType);
         return 0;
      });

   const handlePreview = (file) => {
      setIsPdf(file.contentType.startsWith("application/pdf"));

      if (file.contentType.startsWith("application/pdf")) {
         const pdfUrl = URL.createObjectURL(
            new Blob([file.blob], { type: "application/pdf" })
         );
         setPreviewContent(pdfUrl);
      } else {
         setPreviewContent(file.url);
      }

      setPreviewOpen(true);
   };

   const handleCustomUpload = async ({ file, onSuccess, onError }) => {
      if (!ACCEPTED_TYPES.some((type) => file.type.startsWith(type))) {
         message.error("Type de fichier non autorisé!");
         return onError(new Error("Type non autorisé"));
      }

      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
         const email = getEmailFromToken();
         const res = await apiFetch(
            `/api/documents/upload?email=${encodeURIComponent(email)}`,
            {
               method: "POST",
               body: formData,
            }
         );
         if (!res) throw new Error("Upload failed");
         onSuccess(null);
         fetchDocuments();
         message.success(`${file.name} téléchargé avec succès!`);
      } catch (err) {
         onError(err);
         message.error(`Échec du téléchargement de ${file.name}.`);
      } finally {
         setUploading(false);
      }
   };

   const handleDelete = (filename) => {
      const email = getEmailFromToken();

      Modal.confirm({
         title: "Êtes-vous sûr de vouloir supprimer ce document?",
         content: `${filename} sera définitivement supprimé.`,
         okText: "Oui, supprimer",
         okType: "danger",
         cancelText: "Annuler",
         onOk: async () => {
            try {
               await apiFetch(
                  `/api/documents/${encodeURIComponent(
                     filename
                  )}?email=${encodeURIComponent(email)}`,
                  { method: "DELETE" }
               );
               message.success("Document supprimé!");
               fetchDocuments();
            } catch {
               message.error("Erreur lors de la suppression");
            }
         },
      });
   };

   return (
      <div style={{ width: "100%" }}>
         {/* Upload Area */}
         <Card
            style={{
               background: BG_CARD,
               border: `1.5px solid ${SIDEBAR_BORDER}`,
               borderRadius: "20px",
               marginBottom: "32px",
               boxShadow: "0 8px 32px rgba(26,139,183,0.08)",
               overflow: "hidden",
            }}
            bodyStyle={{ padding: 0 }}
         >
            <Dragger
               customRequest={handleCustomUpload}
               multiple
               accept=".png,.jpg,.jpeg,.pdf"
               showUploadList={false}
               disabled={uploading}
               style={{
                  background: "transparent",
                  border: "none",
                  borderRadius: "20px",
                  margin: "16px",
                  width: "calc(100% - 32px)",
               }}
            >
               <div style={{ padding: "48px 24px", textAlign: "center" }}>
                  <div
                     style={{
                        background: PRIMARY,
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 32px",
                        boxShadow: "0 12px 40px rgba(26,139,183,0.15)",
                        transform: uploading ? "scale(1.05)" : "scale(1)",
                        transition: "all 0.3s ease",
                     }}
                  >
                     <CloudUploadOutlined
                        style={{
                           fontSize: 42,
                           color: "#ffffff",
                           animation: uploading ? "pulse 2s infinite" : "none",
                        }}
                     />
                  </div>
                  <Title
                     level={3}
                     style={{
                        color: TEXT_DARK,
                        marginBottom: "12px",
                        fontFamily: "Outfit",
                        fontWeight: 600,
                     }}
                  >
                     {uploading
                        ? "Téléchargement en cours..."
                        : "Glissez vos fichiers ici"}
                  </Title>
                  <Text
                     style={{
                        color: PRIMARY,
                        fontSize: "16px",
                        fontWeight: 500,
                     }}
                  >
                     ou cliquez pour sélectionner des fichiers
                  </Text>
                  <div style={{ marginTop: "16px" }}>
                     <Text
                        style={{
                           color: SECONDARY,
                           fontSize: "14px",
                        }}
                     >
                        Formats supportés: PDF, JPG, PNG
                     </Text>
                  </div>
               </div>
            </Dragger>
         </Card>

         {/* Sort Controls */}
         <div
            style={{
               display: "flex",
               justifyContent: "flex-end",
               marginBottom: "24px",
            }}
         >
            <Select
               value={sortBy}
               onChange={(val) => setSortBy(val)}
               style={{
                  width: 200,
                  borderRadius: "16px",
                  background: BG_CARD,
                  border: `1.5px solid ${SIDEBAR_BORDER}`,
               }}
               size="large"
            >
               <Select.Option value="latest">📅 Plus récents</Select.Option>
               <Select.Option value="alpha">🔤 Alphabétique</Select.Option>
               <Select.Option value="type">📂 Type de fichier</Select.Option>
            </Select>
         </div>

         {/* Documents Grid */}
         <div
            style={{
               display: "grid",
               gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
               gap: "24px",
               marginTop: "32px",
            }}
         >
            {filteredDocs.map((file) => (
               <Card
                  key={file.uid}
                  hoverable
                  style={{
                     borderRadius: "20px",
                     border: `1.5px solid ${SIDEBAR_BORDER}`,
                     boxShadow: "0 8px 32px rgba(26,139,183,0.08)",
                     overflow: "hidden",
                     background: BG_CARD,
                     transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  bodyStyle={{ padding: 0 }}
                  onMouseEnter={(e) => {
                     e.currentTarget.style.transform = "translateY(-6px)";
                     e.currentTarget.style.boxShadow =
                        "0 16px 48px rgba(26,139,183,0.13)";
                  }}
                  onMouseLeave={(e) => {
                     e.currentTarget.style.transform = "translateY(0)";
                     e.currentTarget.style.boxShadow =
                        "0 8px 32px rgba(26,139,183,0.08)";
                  }}
               >
                  {/* Document Preview */}
                  <div
                     className="document-item"
                     style={{
                        position: "relative",
                        height: "200px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        overflow: "hidden",
                        background: BG_LIGHT,
                        borderBottom: `1.5px solid ${SIDEBAR_BORDER}`,
                     }}
                     onClick={() => handlePreview(file)}
                  >
                     <img
                        src={file.thumbUrl}
                        alt={file.name}
                        style={{
                           width: "100%",
                           height: "100%",
                           objectFit: "cover",
                           transition: "transform 0.3s ease",
                        }}
                     />

                     {/* Overlay */}
                     <div
                        style={{
                           position: "absolute",
                           top: 0,
                           left: 0,
                           right: 0,
                           bottom: 0,
                           background: "rgba(26,139,183,0.10)",
                           display: "flex",
                           alignItems: "center",
                           justifyContent: "center",
                           opacity: 0,
                           transition: "opacity 0.3s ease",
                           backdropFilter: "blur(2px)",
                        }}
                        className="document-overlay"
                     >
                        <Button
                           type="primary"
                           icon={<EyeOutlined />}
                           size="large"
                           style={{
                              background: BG_CARD,
                              color: PRIMARY,
                              border: `1.5px solid ${PRIMARY}`,
                              borderRadius: "16px",
                              fontWeight: 600,
                              boxShadow: "0 4px 20px rgba(26,139,183,0.08)",
                           }}
                        >
                           Aperçu
                        </Button>
                     </div>

                     {/* File Type Badge */}
                     <div
                        style={{
                           position: "absolute",
                           top: "12px",
                           right: "12px",
                        }}
                     >
                        {getFileTypeTag(file.contentType)}
                     </div>
                  </div>

                  {/* Document Info */}
                  <div style={{ padding: "24px" }}>
                     <div style={{ marginBottom: "20px" }}>
                        <Text
                           strong
                           style={{
                              fontSize: "16px",
                              color: TEXT_DARK,
                              display: "block",
                              marginBottom: "8px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              fontFamily: "Outfit",
                              fontWeight: 600,
                           }}
                        >
                           {file.name}
                        </Text>
                        <Text
                           style={{
                              color: PRIMARY,
                              fontSize: "14px",
                              fontWeight: 500,
                           }}
                        >
                           {file.uploadedAt.toLocaleDateString("fr-FR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                           })}
                        </Text>
                     </div>

                     {/* Action Buttons */}
                     <Space>
                        <Tooltip title="Supprimer">
                           <Button
                              danger
                              icon={<DeleteOutlined />}
                              size="large"
                              style={{
                                 borderRadius: "12px",
                                 background: "rgba(255, 77, 77, 0.08)",
                                 border: "1.5px solid #ff4d4d22",
                                 color: "#ff4d4d",
                                 fontWeight: 600,
                              }}
                              onClick={(e) => {
                                 e.stopPropagation();
                                 handleDelete(file.uid);
                              }}
                           />
                        </Tooltip>

                        <Tooltip title="Analyser">
                           <Button
                              icon={<SearchOutlined />}
                              size="large"
                              style={{
                                 borderRadius: "12px",
                                 background: "rgba(26,139,183,0.08)",
                                 border: `1.5px solid ${PRIMARY}22`,
                                 color: PRIMARY,
                                 fontWeight: 600,
                              }}
                              onClick={(e) => {
                                 e.stopPropagation();
                                 handleAnalyse(file.uid);
                              }}
                           />
                        </Tooltip>

                        <Tooltip title="Traduire">
                           <Button
                              icon={<GlobalOutlined />}
                              size="large"
                              style={{
                                 borderRadius: "12px",
                                 background: "rgba(26,188,156,0.08)",
                                 border: `1.5px solid ${SECONDARY}22`,
                                 color: SECONDARY,
                                 fontWeight: 600,
                              }}
                              onClick={(e) => {
                                 e.stopPropagation();
                                 handleTranslate(file.uid);
                              }}
                           />
                        </Tooltip>
                     </Space>
                  </div>
               </Card>
            ))}
         </div>

         {/* Empty State */}
         {fileList.length === 0 && !uploading && (
            <Card
               style={{
                  borderRadius: "20px",
                  border: `1.5px dashed ${PRIMARY}33`,
                  background: BG_CARD,
                  textAlign: "center",
                  padding: "60px 40px",
                  marginTop: "32px",
                  boxShadow: "0 8px 32px rgba(26,139,183,0.08)",
               }}
            >
               <div
                  style={{
                     background: PRIMARY,
                     width: "100px",
                     height: "100px",
                     borderRadius: "50%",
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                     margin: "0 auto 32px",
                     boxShadow: "0 12px 40px rgba(26,139,183,0.15)",
                  }}
               >
                  <FileTextOutlined
                     style={{ fontSize: 42, color: "#ffffff" }}
                  />
               </div>
               <Title
                  level={3}
                  style={{
                     color: TEXT_DARK,
                     marginBottom: "12px",
                     fontFamily: "Outfit",
                     fontWeight: 600,
                  }}
               >
                  Aucun document
               </Title>
               <Text
                  style={{
                     color: PRIMARY,
                     fontSize: "16px",
                     fontWeight: 500,
                  }}
               >
                  Commencez par télécharger votre premier document médical
               </Text>
            </Card>
         )}

         {/* Filtered Empty State */}
         {fileList.length > 0 && filteredDocs.length === 0 && (
            <Card
               style={{
                  borderRadius: "20px",
                  border: `1.5px dashed ${PRIMARY}33`,
                  background: BG_CARD,
                  textAlign: "center",
                  padding: "60px 40px",
                  marginTop: "32px",
                  boxShadow: "0 8px 32px rgba(26,139,183,0.08)",
               }}
            >
               <SearchOutlined
                  style={{
                     fontSize: 64,
                     color: PRIMARY,
                     marginBottom: 24,
                  }}
               />
               <Title
                  level={3}
                  style={{
                     color: TEXT_DARK,
                     marginBottom: "12px",
                     fontFamily: "Outfit",
                     fontWeight: 600,
                  }}
               >
                  Aucun document trouvé
               </Title>
               <Text
                  style={{
                     color: PRIMARY,
                     fontSize: "16px",
                     fontWeight: 500,
                  }}
               >
                  Essayez avec d'autres termes de recherche
               </Text>
            </Card>
         )}

         {/* Preview Modal */}
         <Modal
            open={previewOpen}
            footer={null}
            onCancel={() => setPreviewOpen(false)}
            centered
            width={isPdf ? "90%" : "auto"}
            style={{ maxWidth: "1200px" }}
            bodyStyle={{
               padding: 0,
               display: "flex",
               justifyContent: "center",
               background: BG_LIGHT,
               borderRadius: "20px",
               overflow: "hidden",
            }}
            closable={false}
            maskStyle={{
               background: `${PRIMARY}11`,
               backdropFilter: "blur(8px)",
            }}
         >
            <div
               style={{
                  position: "relative",
                  width: "100%",
                  background: BG_CARD,
                  borderRadius: "20px",
                  overflow: "hidden",
                  border: `1.5px solid ${SIDEBAR_BORDER}`,
                  boxShadow: "0 20px 60px rgba(26,139,183,0.10)",
               }}
            >
               <div>
                  {isPdf ? (
                     <iframe
                        src={previewContent}
                        title="Aperçu PDF"
                        width="100%"
                        height="600px"
                        style={{
                           border: "none",
                           width: "100%",
                           minHeight: "600px",
                           borderRadius: "20px",
                        }}
                     />
                  ) : (
                     <div style={{ textAlign: "center", padding: "20px" }}>
                        <img
                           src={previewContent}
                           alt="aperçu"
                           style={{
                              maxWidth: "100%",
                              maxHeight: "70vh",
                              borderRadius: "16px",
                              boxShadow: "0 8px 32px rgba(26,139,183,0.10)",
                           }}
                        />
                     </div>
                  )}
               </div>
            </div>
         </Modal>

         <style jsx>{`
            .document-item:hover .document-overlay {
               opacity: 1 !important;
            }
            .document-item:hover img {
               transform: scale(1.05);
            }
            @keyframes pulse {
               0% {
                  transform: scale(1);
               }
               50% {
                  transform: scale(1.05);
               }
               100% {
                  transform: scale(1);
               }
            }
         `}</style>
      </div>
   );
};

export default GestionDocuments;
