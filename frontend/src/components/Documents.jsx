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

// Dashboard palette
const PRIMARY = "#1A8BB7";
const SECONDARY = "#1ABC9C";
const BG_LIGHT = "#F8FAFC";
const BG_CARD = "#fff";
const SIDEBAR_BORDER = "#E3E8EF";
const TEXT_DARK = "#22313F";
const TEXT_MEDIUM = "#4B5C6B";
const GREY = "#B0B8C1";

// Translation language options
const LANGUAGE_OPTIONS = [
   { value: "auto", label: "🔍 Auto-détection", flag: "🔍" },
   { value: "en", label: "🇺🇸 Anglais", flag: "🇺🇸" },
   { value: "fr", label: "🇫🇷 Français", flag: "🇫🇷" },
   { value: "es", label: "🇪🇸 Espagnol", flag: "🇪🇸" },
   { value: "de", label: "🇩🇪 Allemand", flag: "🇩🇪" },
   { value: "it", label: "🇮🇹 Italien", flag: "🇮🇹" },
   { value: "pt", label: "🇵🇹 Portugais", flag: "🇵🇹" },
   { value: "ar", label: "🇸🇦 Arabe", flag: "🇸🇦" },
   { value: "zh", label: "🇨🇳 Chinois", flag: "🇨🇳" },
];

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

// PDF text extraction function
const extractTextFromPdf = async (pdfBlob) => {
   try {
      const pdf = await pdfjs.getDocument(URL.createObjectURL(pdfBlob)).promise;
      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
         const page = await pdf.getPage(i);
         const textContent = await page.getTextContent();
         const pageText = textContent.items.map((item) => item.str).join(" ");
         fullText += pageText + "\n";
      }

      return fullText.trim();
   } catch (error) {
      throw new Error("Impossible d'extraire le texte du PDF");
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

   // Translation modal states
   const [translationOpen, setTranslationOpen] = useState(false);
   const [translating, setTranslating] = useState(false);
   const [currentFile, setCurrentFile] = useState(null);
   const [translationResult, setTranslationResult] = useState("");
   const [sourceLanguage, setSourceLanguage] = useState("auto"); // Auto-detect by default
   const [targetLanguage, setTargetLanguage] = useState("fr");
   const [sourceText, setSourceText] = useState("");

   // Helper function to split text into chunks
   const chunkText = (text, maxLength = 350) => {
      // Handle empty or very short text
      if (!text || text.length <= maxLength) {
         return text ? [text] : [];
      }

      const chunks = [];
      let currentPosition = 0;

      while (currentPosition < text.length) {
         let endPosition = currentPosition + maxLength;

         // If we're at the end of the text, take the rest
         if (endPosition >= text.length) {
            chunks.push(text.substring(currentPosition));
            break;
         }

         // Find the best place to split - look for sentence endings first
         let splitPosition = endPosition;
         const sentenceEnders = /[.!?؟。！？]/g;
         const segment = text.substring(currentPosition, endPosition);
         let lastSentenceEnd = -1;
         let match;

         while ((match = sentenceEnders.exec(segment)) !== null) {
            lastSentenceEnd = match.index;
         }

         if (lastSentenceEnd > maxLength * 0.3) {
            // Only use if it's not too early in the chunk
            splitPosition = currentPosition + lastSentenceEnd + 1;
         } else {
            // Look for word boundaries (spaces, commas, etc.)
            const wordBoundaries = /[\s,،;；:：\-\u200B]/g;
            let lastWordBoundary = -1;
            wordBoundaries.lastIndex = 0;

            while ((match = wordBoundaries.exec(segment)) !== null) {
               if (match.index > maxLength * 0.7) break; // Don't split too late
               lastWordBoundary = match.index;
            }

            if (lastWordBoundary > maxLength * 0.3) {
               splitPosition = currentPosition + lastWordBoundary + 1;
            } else {
               // Force split at maxLength if no good boundary found
               splitPosition = endPosition;
            }
         }

         const chunk = text.substring(currentPosition, splitPosition).trim();
         if (chunk) {
            chunks.push(chunk);
         }

         currentPosition = splitPosition;
      }

      return chunks.filter((chunk) => chunk.length > 0);
   };

   // Language detection function
   const detectLanguage = async (text) => {
      try {
         // Use a sample of the text for detection (first 500 chars)
         const sample = text.substring(0, 500);

         // Try LibreTranslate detection first
         const response = await fetch("https://libretranslate.de/detect", {
            method: "POST",
            body: JSON.stringify({ q: sample }),
            headers: { "Content-Type": "application/json" },
         });

         if (response.ok) {
            const data = await response.json();
            const detectedLang = data[0]?.language;
            if (detectedLang && detectedLang !== "auto") {
               console.log(`Detected language: ${detectedLang}`);
               return detectedLang;
            }
         }

         // Fallback: simple pattern-based detection
         const patterns = {
            en: /\b(the|and|is|are|in|on|at|to|for|of|with|by)\b/gi,
            fr: /\b(le|la|les|et|est|sont|dans|sur|à|pour|de|avec|par)\b/gi,
            es: /\b(el|la|los|las|y|es|son|en|sobre|para|de|con|por)\b/gi,
            de: /\b(der|die|das|und|ist|sind|in|auf|zu|für|von|mit)\b/gi,
            it: /\b(il|la|i|le|e|è|sono|in|su|a|per|di|con)\b/gi,
         };

         let bestMatch = { lang: "en", score: 0 };

         for (const [lang, pattern] of Object.entries(patterns)) {
            const matches = sample.match(pattern) || [];
            const score = matches.length;
            if (score > bestMatch.score) {
               bestMatch = { lang, score };
            }
         }

         console.log(`Pattern-detected language: ${bestMatch.lang}`);
         return bestMatch.lang;
      } catch (error) {
         console.warn(
            "Language detection failed, defaulting to English:",
            error
         );
         return "en";
      }
   };

   // Translation API function with chunking
   const translateText = async (text, sourceLang, targetLang) => {
      try {
         // Handle auto-detection
         let actualSourceLang = sourceLang;
         if (sourceLang === "auto") {
            actualSourceLang = await detectLanguage(text);
         }

         // Prevent same language translation
         if (actualSourceLang === targetLang) {
            return `[Même langue détectée: ${actualSourceLang.toUpperCase()}]\n\n${text}`;
         }
         const chunks = chunkText(text, 350); // Keep under 500 char limit
         const translatedChunks = [];

         for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];

            try {
               // Using LibreTranslate API - more reliable than MyMemory
               const response = await fetch(
                  "https://libretranslate.de/translate",
                  {
                     method: "POST",
                     body: JSON.stringify({
                        q: chunk,
                        source: actualSourceLang,
                        target: targetLang,
                        format: "text",
                     }),
                     headers: {
                        "Content-Type": "application/json",
                     },
                  }
               );

               if (!response.ok) throw new Error("Translation failed");

               const data = await response.json();
               const translatedChunk = data.translatedText || chunk;
               translatedChunks.push(translatedChunk);

               // Add small delay between requests to avoid rate limiting
               if (i < chunks.length - 1) {
                  await new Promise((resolve) => setTimeout(resolve, 100));
               }
            } catch (error) {
               console.warn(
                  `LibreTranslate failed for chunk ${
                     i + 1
                  }, trying Google Translate:`,
                  error
               );

               // Fallback to Google Translate API (free tier)
               try {
                  const googleResponse = await fetch(
                     `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${actualSourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(
                        chunk
                     )}`
                  );

                  if (googleResponse.ok) {
                     const googleData = await googleResponse.json();
                     const translatedChunk = googleData[0]?.[0]?.[0] || chunk;
                     translatedChunks.push(translatedChunk);
                  } else {
                     translatedChunks.push(chunk);
                  }
               } catch (googleError) {
                  console.warn(
                     `Google Translate also failed for chunk ${i + 1}:`,
                     googleError
                  );
                  translatedChunks.push(chunk); // Keep original text if both fail
               }
            }
         }

         return translatedChunks.join(" ");
      } catch (error) {
         return `[Traduction vers ${targetLang.toUpperCase()}]\n\n${text}`;
      }
   };

   const performTranslation = async () => {
      if (!sourceText.trim()) {
         message.error("Aucun texte à traduire");
         return;
      }

      // Prevent same language translation (but allow auto-detect)
      if (sourceLanguage === targetLanguage && sourceLanguage !== "auto") {
         message.error("Veuillez sélectionner des langues différentes");
         return;
      }

      setTranslating(true);
      setTranslationResult(""); // Clear previous results

      try {
         // Show progress for large texts
         const chunks = chunkText(sourceText, 350);
         if (chunks.length > 1) {
            message.loading(
               `Traduction en cours... (${chunks.length} segments)`,
               0
            );
         }

         const translated = await translateText(
            sourceText,
            sourceLanguage,
            targetLanguage
         );
         message.destroy();
         setTranslationResult(translated);
         message.success("Traduction terminée !");
      } catch (error) {
         message.destroy();
         message.error("Erreur lors de la traduction");
         console.error("Translation error:", error);
      } finally {
         setTranslating(false);
      }
   };

   const handleTranslate = async (filename) => {
      const file = fileList.find((f) => f.uid === filename);
      if (!file) {
         message.error("Fichier non trouvé");
         return;
      }

      if (!file.contentType.startsWith("application/pdf")) {
         message.error(
            "La traduction n'est disponible que pour les fichiers PDF"
         );
         return;
      }

      setCurrentFile(file);
      setTranslationOpen(true);
      setTranslationResult("");
      setSourceText("");

      try {
         message.loading("Extraction du texte du PDF...", 0);
         const text = await extractTextFromPdf(file.blob);
         setSourceText(text);
         message.destroy();

         if (!text.trim()) {
            message.warning("Aucun texte extractible trouvé dans ce PDF");
            return;
         }
      } catch (error) {
         message.destroy();
         message.error(error.message);
      }
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

         {/* Translation Modal */}
         <Modal
            open={translationOpen}
            title={
               <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <GlobalOutlined style={{ color: SECONDARY, fontSize: 24 }} />
                  <span
                     style={{ color: TEXT_DARK, fontWeight: 600, fontSize: 18 }}
                  >
                     Traduction PDF - {currentFile?.name}
                  </span>
               </div>
            }
            onCancel={() => setTranslationOpen(false)}
            centered
            width="90%"
            style={{ maxWidth: "1400px" }}
            footer={[
               <Button key="close" onClick={() => setTranslationOpen(false)}>
                  Fermer
               </Button>,
               <Button
                  key="translate"
                  type="primary"
                  icon={<GlobalOutlined />}
                  loading={translating}
                  onClick={performTranslation}
                  disabled={!sourceText.trim()}
                  style={{
                     background: SECONDARY,
                     borderColor: SECONDARY,
                  }}
               >
                  Traduire
               </Button>,
            ]}
         >
            <div
               style={{
                  marginBottom: 20,
                  display: "flex",
                  gap: 30,
                  alignItems: "center",
                  flexWrap: "wrap",
               }}
            >
               <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Text strong>Langue source:</Text>
                  <Select
                     value={sourceLanguage}
                     onChange={setSourceLanguage}
                     style={{ width: 180 }}
                     size="large"
                  >
                     {LANGUAGE_OPTIONS.map((lang) => (
                        <Select.Option key={lang.value} value={lang.value}>
                           {lang.label}
                        </Select.Option>
                     ))}
                  </Select>
               </div>

               <div style={{ fontSize: 20, color: SECONDARY }}>→</div>

               <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Text strong>Langue cible:</Text>
                  <Select
                     value={targetLanguage}
                     onChange={setTargetLanguage}
                     style={{ width: 180 }}
                     size="large"
                  >
                     {LANGUAGE_OPTIONS.map((lang) => (
                        <Select.Option
                           key={lang.value}
                           value={lang.value}
                           disabled={
                              lang.value === sourceLanguage ||
                              lang.value === "auto"
                           }
                        >
                           {lang.label}
                        </Select.Option>
                     ))}
                  </Select>
               </div>
            </div>

            <div style={{ display: "flex", gap: 20, height: "60vh" }}>
               {/* Source Text */}
               <div style={{ flex: 1 }}>
                  <Title level={4} style={{ color: PRIMARY, marginBottom: 12 }}>
                     📄 Texte original
                  </Title>
                  <div
                     style={{
                        height: "100%",
                        border: `2px solid ${SIDEBAR_BORDER}`,
                        borderRadius: 12,
                        padding: 16,
                        background: BG_LIGHT,
                        overflow: "auto",
                        whiteSpace: "pre-wrap",
                        fontFamily: "monospace",
                        fontSize: 14,
                        lineHeight: 1.6,
                     }}
                  >
                     {sourceText || "Extraction du texte en cours..."}
                  </div>
               </div>

               {/* Translation Result */}
               <div style={{ flex: 1 }}>
                  <Title
                     level={4}
                     style={{ color: SECONDARY, marginBottom: 12 }}
                  >
                     🌐 Traduction{" "}
                     {
                        LANGUAGE_OPTIONS.find((l) => l.value === targetLanguage)
                           ?.flag
                     }
                  </Title>
                  <div
                     style={{
                        height: "100%",
                        border: `2px solid ${
                           translationResult ? SECONDARY + "40" : SIDEBAR_BORDER
                        }`,
                        borderRadius: 12,
                        padding: 16,
                        background: translationResult
                           ? SECONDARY + "05"
                           : BG_CARD,
                        overflow: "auto",
                        whiteSpace: "pre-wrap",
                        fontFamily: "monospace",
                        fontSize: 14,
                        lineHeight: 1.6,
                     }}
                  >
                     {translating ? (
                        <div style={{ textAlign: "center", padding: 40 }}>
                           <GlobalOutlined
                              style={{
                                 fontSize: 48,
                                 color: SECONDARY,
                                 animation: "spin 2s linear infinite",
                              }}
                           />
                           <div style={{ marginTop: 16, color: TEXT_MEDIUM }}>
                              Traduction en cours...
                           </div>
                        </div>
                     ) : translationResult ? (
                        translationResult
                     ) : (
                        <div
                           style={{
                              textAlign: "center",
                              padding: 40,
                              color: GREY,
                           }}
                        >
                           Cliquez sur "Traduire" pour commencer
                        </div>
                     )}
                  </div>
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
            @keyframes spin {
               from {
                  transform: rotate(0deg);
               }
               to {
                  transform: rotate(360deg);
               }
            }
         `}</style>
      </div>
   );
};

export default GestionDocuments;
