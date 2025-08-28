import React, { useState, useEffect } from "react";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { Upload, Image, message, Button, Modal } from "antd";
import { pdfjs } from "react-pdf";
import "./Documents.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const BACKEND_URL = "http://localhost:8081";
const ACCEPTED_TYPES = ["image/", "application/pdf"];

const generatePdfThumbnail = async (url) => {
  try {
    const loadingTask = pdfjs.getDocument(url);
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1 }); // scale plus grand pour meilleure qualité
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
    return canvas.toDataURL();
  } catch (err) {
    console.error("Erreur miniature PDF :", err);
    return "/pdf-fallback.png"; // fallback si erreur
  }
};

const GestionDocuments = () => {
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [isPdf, setIsPdf] = useState(false);

  const fetchDocuments = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/documents`);
      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("Erreur : data n'est pas un tableau", data);
        setFileList([]);
        return;
      }

      const list = await Promise.all(
        data.map(async (doc) => {
          const url = `${BACKEND_URL}/api/documents/uploads/${encodeURIComponent(doc.filename)}`;
          const thumbUrl = doc.contentType.startsWith("image/")
            ? url
            : await generatePdfThumbnail(url);

          return {
            uid: doc.filename,
            name: doc.filename,
            contentType: doc.contentType,
            url,
            thumbUrl,
          };
        })
      );

      setFileList(list.reverse());
    } catch (err) {
      console.error(err);
      message.error("Erreur lors de la récupération des documents");
    }
  };

  useEffect(() => { fetchDocuments(); }, []);

  const handlePreview = (file) => {
    setIsPdf(file.contentType.startsWith("application/pdf"));
    setPreviewContent(file.url);
    setPreviewOpen(true);
  };

  const handleCustomUpload = async ({ file, onSuccess, onError, onProgress }) => {
    if (!ACCEPTED_TYPES.some(type => file.type.startsWith(type))) {
      message.error("Type de fichier non autorisé !");
      return onError(new Error("Type non autorisé"));
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${BACKEND_URL}/api/documents/upload`, {
        method: "POST",
        body: formData,
      });

      // Progress simulation
      let loaded = 0;
      const total = file.size;
      const interval = setInterval(() => {
        loaded += total * 0.1;
        if (loaded > total) loaded = total;
        onProgress({ percent: (loaded / total) * 100 });
        if (loaded === total) clearInterval(interval);
      }, 100);

      const filename = await res.text();
      onSuccess(null);
      fetchDocuments();
      message.success(`${filename} uploadé avec succès !`);
    } catch (err) {
      onError(err);
      message.error(`${file.name} upload échoué.`);
    }
  };

  const handleDelete = async (filename) => {
    try {
      await fetch(`${BACKEND_URL}/api/documents/${encodeURIComponent(filename)}`, { method: "DELETE" });
      message.success("Document supprimé !");
      fetchDocuments();
    } catch {
      message.error("Erreur lors de la suppression");
    }
  };

  const { Dragger } = Upload;

  return (
    <div className="documents-container">
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
        <p className="ant-upload-text">Glissez-déposez vos fichiers ici ou cliquez pour ajouter</p>
      </Dragger>

      <div className="documents-grid">
        {fileList.map(file => (
          <div key={file.uid} className="document-item" onClick={() => handlePreview(file)}>
            <img src={file.thumbUrl} alt={file.name} className="document-thumb" />
            <div className="button-group">
              <Button className="action-button" icon={<DeleteOutlined />}
                onClick={e => { e.stopPropagation(); handleDelete(file.uid); }} />
            </div>
            <div className="document-name">{file.name}</div>
          </div>
        ))}
      </div>

      <Modal open={previewOpen} footer={null} onCancel={() => setPreviewOpen(false)}
             width="80%" style={{ top: 20 }}>
        {isPdf
          ? <iframe src={previewContent} title="PDF Preview" width="100%" height="600px" style={{ border: "none" }} />
          : <Image src={previewContent} alt="preview" preview={false} />}
      </Modal>
    </div>
  );
};

export default GestionDocuments;
