package com.vitacare.vitacare.Service;

import com.vitacare.vitacare.Model.Document;
import com.vitacare.vitacare.Repository.DocumentRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final Path uploadDir = Paths.get("uploads");

    public DocumentService(DocumentRepository documentRepository) throws IOException {
        this.documentRepository = documentRepository;
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }
    }

    // Upload d’un fichier
    public Document uploadFile(MultipartFile file) throws IOException {
        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadDir.resolve(filename);
        file.transferTo(filePath);

        Document document = new Document(
                null,
                filename,
                file.getContentType(),
                file.getSize(),
                filePath.toString(),
                LocalDateTime.now()
        );
        return documentRepository.save(document);
    }

    // Lister tous les fichiers
    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    // Supprimer un fichier
    public void deleteDocument(Long id) throws IOException {
        Document doc = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document non trouvé"));

        Path filePath = Paths.get(doc.getFilePath());
        if (Files.exists(filePath)) {
            Files.delete(filePath);
        }

        documentRepository.delete(doc);
    }
}
