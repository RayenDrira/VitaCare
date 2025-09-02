package com.vitacare.vitacare.Controller;

import com.vitacare.vitacare.Model.Document;
import com.vitacare.vitacare.Repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import java.nio.file.*;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class DocumentController {

    private final Path uploadDir = Paths.get("uploads");

    @Autowired
    private DocumentRepository documentRepository;

    // Upload a file and save info to DB
    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        if (!Files.exists(uploadDir)) Files.createDirectories(uploadDir);

        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadDir.resolve(filename);
        file.transferTo(filePath);

        Document doc = new Document(
            null,
            filename,
            file.getContentType(),
            file.getSize(),
            filePath.toString(),
            null // uploadedAt will be set automatically
        );
        documentRepository.save(doc);

        return ResponseEntity.ok(filename);
    }

    // Download a file using DB info
    @GetMapping("/uploads/{filename:.+}")
    @CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
    public ResponseEntity<Resource> getFile(@PathVariable String filename) throws IOException {
        Optional<Document> docOpt = documentRepository.findByFilename(filename);
        if (docOpt.isEmpty()) throw new RuntimeException("File not found: " + filename);

        Document doc = docOpt.get();
        Path filePath = Paths.get(doc.getFilePath());
        Resource resource = new UrlResource(filePath.toUri());
        if (!resource.exists()) throw new RuntimeException("File not found: " + filename);

        String contentType = doc.getFileType();
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType != null ? contentType : "application/octet-stream"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    // Delete a file and remove from DB
    @DeleteMapping("/{filename:.+}")
    public ResponseEntity<Void> deleteFile(@PathVariable String filename) throws IOException {
        Optional<Document> docOpt = documentRepository.findByFilename(filename);
        if (docOpt.isPresent()) {
            Document doc = docOpt.get();
            Path filePath = Paths.get(doc.getFilePath());
            if (Files.exists(filePath)) {
                Files.delete(filePath);
            }
            documentRepository.delete(doc);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // List all documents from DB
    @GetMapping
    public ResponseEntity<List<Document>> getAllDocuments() {
        List<Document> docs = documentRepository.findAll();
        return ResponseEntity.ok(docs);
    }
}
