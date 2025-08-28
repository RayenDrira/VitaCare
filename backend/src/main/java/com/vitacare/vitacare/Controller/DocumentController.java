package com.vitacare.vitacare.Controller;

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

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "http://localhost:3000") // <-- permet l'accès depuis ton frontend
public class DocumentController {

    private final Path uploadDir = Paths.get("uploads");

    // Upload d'un fichier
    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        if (!Files.exists(uploadDir)) Files.createDirectories(uploadDir);

        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadDir.resolve(filename);
        file.transferTo(filePath);

        return ResponseEntity.ok(filename);
    }

    // Télécharger un fichier spécifique
    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> getFile(@PathVariable String filename) throws IOException {
        Path filePath = uploadDir.resolve(filename).normalize();
        Resource resource = new UrlResource(filePath.toUri());
        if (!resource.exists()) throw new RuntimeException("File not found: " + filename);

        String contentType = Files.probeContentType(filePath);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType != null ? contentType : "application/octet-stream"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    // Supprimer un fichier
    @DeleteMapping("/{filename:.+}")
    public ResponseEntity<Void> deleteFile(@PathVariable String filename) throws IOException {
        Path filePath = uploadDir.resolve(filename).normalize();
        if (Files.exists(filePath)) {
            Files.delete(filePath);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Récupérer la liste de tous les fichiers
    @GetMapping
    public ResponseEntity<List<DocumentInfo>> getAllDocuments() throws IOException {
        if (!Files.exists(uploadDir)) Files.createDirectories(uploadDir);

        List<DocumentInfo> docs = Files.list(uploadDir)
                .map(path -> {
                    DocumentInfo info = new DocumentInfo();
                    info.setFilename(path.getFileName().toString());
                    try {
                        info.setContentType(Files.probeContentType(path));
                    } catch (IOException e) {
                        info.setContentType("application/octet-stream");
                    }
                    return info;
                })
                .toList();

        return ResponseEntity.ok(docs);
    }

    // Classe interne pour info document
    public static class DocumentInfo {
        private String filename;
        private String contentType;

        public String getFilename() { return filename; }
        public void setFilename(String filename) { this.filename = filename; }
        public String getContentType() { return contentType; }
        public void setContentType(String contentType) { this.contentType = contentType; }
    }
}
