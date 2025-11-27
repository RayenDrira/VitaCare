package com.vitacare.vitacare.Service;

import com.vitacare.vitacare.DTO.DTOMapper;
import com.vitacare.vitacare.DTO.DocumentDTO;
import com.vitacare.vitacare.Model.Document;
import com.vitacare.vitacare.Model.Tag;
import com.vitacare.vitacare.Model.User;
import com.vitacare.vitacare.Repository.DocumentRepository;
import com.vitacare.vitacare.Repository.TagRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final TagRepository tagRepository;
    private final DTOMapper dtoMapper;
    private final Path uploadDir = Paths.get("uploads");

    public DocumentService(DocumentRepository documentRepository, TagRepository tagRepository, 
                          DTOMapper dtoMapper) throws IOException {
        this.documentRepository = documentRepository;
        this.tagRepository = tagRepository;
        this.dtoMapper = dtoMapper;
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

    // Get documents as DTOs (includes tag information)
    public List<DocumentDTO> getDocumentDTOsByUser(User user) {
        List<Document> documents = documentRepository.findByUserId(user.getId());
        return documents.stream()
                .map(dtoMapper::toDocumentDTO)
                .collect(Collectors.toList());
    }

    // Update document tags
    public DocumentDTO updateDocumentTags(User user, String filename, List<String> tagNames) {
        Document document = documentRepository.findByFilenameAndUserId(filename, user.getId())
                .orElseThrow(() -> new RuntimeException("Document not found or access denied"));

        // Clear existing tags
        document.getTags().clear();

        // Add new tags (create if they don't exist)
        if (tagNames != null && !tagNames.isEmpty()) {
            for (String tagName : tagNames) {
                Tag tag = tagRepository.findByNameAndUser(tagName, user)
                        .orElseGet(() -> {
                            // Create new tag if it doesn't exist
                            Tag newTag = new Tag();
                            newTag.setName(tagName);
                            newTag.setDescription("Auto-generated tag");
                            newTag.setColor(generateRandomColor());
                            newTag.setUser(user);
                            return tagRepository.save(newTag);
                        });
                
                tag.addDocument(document);
            }
        }

        documentRepository.save(document);
        return dtoMapper.toDocumentDTO(document);
    }

    // Get document by filename with tag information
    public DocumentDTO getDocumentDTOByFilename(User user, String filename) {
        Document document = documentRepository.findByFilenameAndUserId(filename, user.getId())
                .orElseThrow(() -> new RuntimeException("Document not found or access denied"));
        return dtoMapper.toDocumentDTO(document);
    }

    // Helper method to generate random colors for tags
    private String generateRandomColor() {
        String[] colors = {
            "#1ABC9C", "#3498DB", "#9B59B6", "#E74C3C", "#F39C12",
            "#16A085", "#2980B9", "#8E44AD", "#C0392B", "#D68910",
            "#27AE60", "#2C3E50", "#E67E22", "#95A5A6", "#34495E"
        };
        int randomIndex = (int) (Math.random() * colors.length);
        return colors[randomIndex];
    }
}
