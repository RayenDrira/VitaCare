package com.vitacare.vitacare.Service;

import com.vitacare.vitacare.Model.Document;
import com.vitacare.vitacare.Repository.DocumentRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final String uploadDir = "uploads/"; // dossier local pour stocker les fichiers

    public DocumentService(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
        // créer le dossier si n'existe pas
        new File(uploadDir).mkdirs();
    }

    // Upload d'un fichier
    public Document uploadFile(MultipartFile file) throws IOException {
        String filePath = uploadDir + file.getOriginalFilename();
        File dest = new File(filePath);
        file.transferTo(dest);

        Document document = new Document(
                file.getOriginalFilename(),
                file.getContentType(),
                file.getSize(),
                filePath
        );
        return documentRepository.save(document);
    }

    // Lister tous les fichiers
    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    // Supprimer un fichier
    public void deleteDocument(Long id) {
        Document doc = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document non trouvé"));

        // Supprimer le fichier physique
        File file = new File(doc.getFilePath());
        if(file.exists()) file.delete();

        // Supprimer les métadonnées en DB
        documentRepository.deleteById(id);
    }
}
