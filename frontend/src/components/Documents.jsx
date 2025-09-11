import React, { useState, useEffect } from "react";
import {
   DeleteOutlined,
   SearchOutlined,
   GlobalOutlined,
   FileTextOutlined,
   EyeOutlined,
   CloudUploadOutlined,
} from "@ant-design/icons";
import {
   Upload,
   message,
   Button,
   Modal,
   Card,
   Typography,
   Tag,
   Tooltip,
} from "antd";
import { pdfjs } from "react-pdf";
import { apiFetch, getEmailFromToken } from "../utils/api";
import "../styles/Documents.css";

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
      return "/pdf-fallback.png"; // fallback if PDF is corrupted
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
      message.success(`Analyse of ${filename} completed!`);
   } catch {
      message.error("Error during document analysis");
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
      message.success(`Translation of ${filename} completed!`);
   } catch {
      message.error("Error during document translation");
   }
};

const getFileTypeTag = (contentType) => {
   if (contentType.startsWith("application/pdf"))
      return <Tag color="red">PDF</Tag>;
   if (contentType.startsWith("image/")) return <Tag color="green">IMAGE</Tag>;
   return <Tag color="blue">FILE</Tag>;
};

const GestionDocuments = () => {
   const [fileList, setFileList] = useState([]);
   const [previewOpen, setPreviewOpen] = useState(false);
   const [previewContent, setPreviewContent] = useState("");
   const [isPdf, setIsPdf] = useState(false);
   const [uploading, setUploading] = useState(false);
   const { Dragger } = Upload;

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
               const objectUrl = URL.createObjectURL(blob);

               let thumbUrl = objectUrl;
               if (doc.fileType?.startsWith("application/pdf")) {
                  thumbUrl = await generatePdfThumbnail(objectUrl);
               }

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

         list.sort((a, b) => b.uploadedAt - a.uploadedAt);
         setFileList(list);
      } catch {
         message.error("Error fetching documents");
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
         message.error("File type not allowed!");
         return onError(new Error("Unauthorized type"));
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
         message.success(`${file.name} uploaded successfully!`);
      } catch (err) {
         onError(err);
         message.error(`${file.name} upload failed.`);
      } finally {
         setUploading(false);
      }
   };

   const handleDelete = (filename) => {
      const email = getEmailFromToken();

      Modal.confirm({
         title: "Are you sure you want to delete this document?",
         content: `${filename} will be permanently removed.`,
         okText: "Yes, delete",
         okType: "danger",
         cancelText: "Cancel",
         onOk: async () => {
            try {
               await apiFetch(
                  `/api/documents/${encodeURIComponent(
                     filename
                  )}?email=${encodeURIComponent(email)}`,
                  { method: "DELETE" }
               );
               message.success("Document deleted!");
               fetchDocuments();
            } catch {
               message.error("Error deleting document");
            }
         },
      });
   };

   return (
      <div style={{ width: "100%" }}>
         {/* Upload Area */}
         <Card
            style={{
               border: "none",
               borderRadius: "24px",
               marginBottom: "32px",
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
                  background: "rgba(255, 255, 255, 0.95)",
                  border: "2px dashed rgba(245, 87, 108, 0.3)",
                  borderRadius: "20px",
                  margin: "16px",
                  backdropFilter: "blur(10px)",
                  width: "calc(100% - 32px)",
               }}
            >
               <div style={{ padding: "48px 24px", textAlign: "center" }}>
                  <div
                     style={{
                        background:
                           "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 24px",
                        boxShadow: "0 8px 32px rgba(99, 102, 241, 0.3)",
                     }}
                  >
                     <CloudUploadOutlined
                        style={{ fontSize: 36, color: "#ffffff" }}
                     />
                  </div>
                  <Title
                     level={3}
                     style={{ color: "#1a202c", marginBottom: "8px" }}
                  >
                     {uploading ? "Uploading..." : "Drag your files here"}
                  </Title>
                  <Text style={{ color: "#64748b", fontSize: "16px" }}>
                     or click to select files
                  </Text>
               </div>
            </Dragger>
         </Card>

         {/* Documents Grid */}
         <div
            style={{
               display: "grid",
               gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
               gap: "24px",
               marginTop: "32px",
            }}
         >
            {fileList.map((file) => (
               <Card
                  key={file.uid}
                  hoverable
                  style={{
                     borderRadius: "20px",
                     border: "1px solid rgba(0,0,0,0.08)",
                     boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                     overflow: "hidden",
                     background: "#ffffff",
                     transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  bodyStyle={{ padding: 0 }}
                  onMouseEnter={(e) => {
                     e.currentTarget.style.transform = "translateY(-4px)";
                     e.currentTarget.style.boxShadow =
                        "0 12px 40px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                     e.currentTarget.style.transform = "translateY(0)";
                     e.currentTarget.style.boxShadow =
                        "0 4px 24px rgba(0,0,0,0.06)";
                  }}
               >
                  {/* Document Preview */}
                  <div
                     style={{
                        position: "relative",
                        height: "200px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        overflow: "hidden",
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
                           background: "rgba(0,0,0,0.4)",
                           display: "flex",
                           alignItems: "center",
                           justifyContent: "center",
                           opacity: 0,
                           transition: "opacity 0.3s ease",
                        }}
                        className="document-overlay"
                     >
                        <Button
                           type="primary"
                           icon={<EyeOutlined />}
                           size="large"
                           style={{
                              background: "rgba(255, 255, 255, 0.9)",
                              color: "#1a202c",
                              border: "none",
                              borderRadius: "12px",
                              fontWeight: 600,
                           }}
                        >
                           Preview
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
                  <div style={{ padding: "20px" }}>
                     <div style={{ marginBottom: "16px" }}>
                        <Text
                           strong
                           style={{
                              fontSize: "16px",
                              color: "#1a202c",
                              display: "block",
                              marginBottom: "4px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                           }}
                        >
                           {file.name}
                        </Text>
                        <Text style={{ color: "#64748b", fontSize: "14px" }}>
                           {file.uploadedAt.toLocaleDateString("fr-FR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                           })}
                        </Text>
                     </div>

                     {/* Action Buttons */}
                     <div
                        style={{
                           display: "flex",
                           gap: "8px",
                           flexWrap: "wrap",
                        }}
                     >
                        <Tooltip title="Delete">
                           <Button
                              danger
                              icon={<DeleteOutlined />}
                              size="small"
                              style={{
                                 borderRadius: "8px",
                                 background: "#fef2f2",
                                 border: "1px solid #fecaca",
                                 color: "#dc2626",
                              }}
                              onClick={(e) => {
                                 e.stopPropagation();
                                 handleDelete(file.uid);
                              }}
                           />
                        </Tooltip>

                        <Tooltip title="Analyse">
                           <Button
                              icon={<SearchOutlined />}
                              size="small"
                              style={{
                                 borderRadius: "8px",
                                 background: "#f0f9ff",
                                 border: "1px solid #bae6fd",
                                 color: "#0369a1",
                              }}
                              onClick={(e) => {
                                 e.stopPropagation();
                                 handleAnalyse(file.uid);
                              }}
                           />
                        </Tooltip>

                        <Tooltip title="Translate">
                           <Button
                              icon={<GlobalOutlined />}
                              size="small"
                              style={{
                                 borderRadius: "8px",
                                 background: "#f0fdf4",
                                 border: "1px solid #bbf7d0",
                                 color: "#166534",
                              }}
                              onClick={(e) => {
                                 e.stopPropagation();
                                 handleTranslate(file.uid);
                              }}
                           />
                        </Tooltip>
                     </div>
                  </div>
               </Card>
            ))}
         </div>

         {/* Empty State */}
         {fileList.length === 0 && !uploading && (
            <Card
               style={{
                  borderRadius: "20px",
                  border: "2px dashed #e2e8f0",
                  background: "#f8fafc",
                  textAlign: "center",
                  padding: "60px 40px",
                  marginTop: "32px",
               }}
            >
               <div
                  style={{
                     background:
                        "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                     width: "80px",
                     height: "80px",
                     borderRadius: "50%",
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                     margin: "0 auto 24px",
                     opacity: 0.8,
                  }}
               >
                  <FileTextOutlined
                     style={{ fontSize: 36, color: "#ffffff" }}
                  />
               </div>
               <Title
                  level={3}
                  style={{ color: "#64748b", marginBottom: "8px" }}
               >
                  No documents
               </Title>
               <Text style={{ color: "#94a3b8", fontSize: "16px" }}>
                  Start by uploading your first medical document
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
               background: "#f8fafc",
               borderRadius: "16px",
               overflow: "hidden",
            }}
            closable={false}
         >
            <div
               style={{
                  position: "relative",
                  width: "100%",
                  background: "#ffffff",
                  borderRadius: "16px",
                  overflow: "hidden",
               }}
            >
               <div
                  style={{
                     background:
                        "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                     color: "#ffffff",
                     padding: "16px 24px",
                     display: "flex",
                     justifyContent: "space-between",
                     alignItems: "center",
                  }}
               >
                  <Title level={4} style={{ color: "#ffffff", margin: 0 }}>
                     Document Preview
                  </Title>
                  <Button
                     type="text"
                     style={{ color: "#ffffff" }}
                     onClick={() => setPreviewOpen(false)}
                  >
                     ✕
                  </Button>
               </div>
               <div style={{ padding: "24px" }}>
                  {isPdf ? (
                     <iframe
                        src={previewContent}
                        title="PDF Preview"
                        style={{
                           border: "none",
                           width: "100%",
                           minHeight: "70vh",
                           borderRadius: "12px",
                           boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                        }}
                     />
                  ) : (
                     <div style={{ textAlign: "center" }}>
                        <img
                           src={previewContent}
                           alt="preview"
                           style={{
                              maxWidth: "100%",
                              maxHeight: "70vh",
                              borderRadius: "12px",
                              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
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
         `}</style>
      </div>
   );
};

export default GestionDocuments;
