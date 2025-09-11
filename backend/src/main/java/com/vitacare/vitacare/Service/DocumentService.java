package com.vitacare.vitacare.Service;

import com.vitacare.vitacare.Model.Document;
import com.vitacare.vitacare.Model.User;
import com.vitacare.vitacare.Repository.DocumentRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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

    // Upload a file and associate with a user
    public Document uploadFile(MultipartFile file, User user) throws IOException {
        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadDir.resolve(filename);
        file.transferTo(filePath);

        Document document = new Document();
        document.setFilename(filename);
        document.setFileType(file.getContentType());
        document.setFileSize(file.getSize());
        document.setFilePath(filePath.toString());
        document.setUser(user);
        document.setUploadedAt(LocalDateTime.now());

        return documentRepository.save(document);
    }

    // List documents for a specific user
    public List<Document> getDocumentsByUser(User user) {
        return documentRepository.findByUserId(user.getId());
    }

    // Delete a document, only if it belongs to the user
    public void deleteDocument(User user, String filename) throws IOException {
        Document doc = documentRepository.findByFilenameAndUserId(filename, user.getId())
                .orElseThrow(() -> new RuntimeException("Document not found or access denied"));

        Path filePath = Paths.get(doc.getFilePath());
        if (Files.exists(filePath)) {
            Files.delete(filePath);
        }

        documentRepository.delete(doc);
    }

    // Get a file resource for download
    public Path getDocumentPath(User user, String filename) {
        Document doc = documentRepository.findByFilenameAndUserId(filename, user.getId())
                .orElseThrow(() -> new RuntimeException("Document not found or access denied"));

        return Paths.get(doc.getFilePath());
    }
}
