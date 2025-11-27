package com.vitacare.vitacare.Controller;

import com.vitacare.vitacare.DTO.DocumentDTO;
import com.vitacare.vitacare.Model.Document;
import com.vitacare.vitacare.Model.User;
import com.vitacare.vitacare.Repository.UserRepository;
import com.vitacare.vitacare.Service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @Autowired
    private UserRepository userRepository;

    // Example method to get the current user
    private User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }

    // Upload a file for current user
    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file,
                                             @RequestParam("email") String email) throws Exception {
        User user = getCurrentUser(email);
        Document doc = documentService.uploadFile(file, user);
        return ResponseEntity.ok(doc.getFilename());
    }

    // List documents of the current user (with tags)
    @GetMapping
    public ResponseEntity<List<DocumentDTO>> getUserDocuments(@RequestParam("email") String email) {
        User user = getCurrentUser(email);
        List<DocumentDTO> docs = documentService.getDocumentDTOsByUser(user);
        return ResponseEntity.ok(docs);
    }

    // Download a document (only if belongs to user)
    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> getFile(@PathVariable String filename,
                                            @RequestParam("email") String email) throws Exception {
        User user = getCurrentUser(email);
        Path filePath = documentService.getDocumentPath(user, filename);
        Resource resource = new UrlResource(filePath.toUri());
        if (!resource.exists()) throw new RuntimeException("File not found");

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    // Delete a document
    @DeleteMapping("/{filename:.+}")
    public ResponseEntity<Void> deleteFile(@PathVariable String filename,
                                           @RequestParam("email") String email) throws Exception {
        User user = getCurrentUser(email);
        documentService.deleteDocument(user, filename);
        return ResponseEntity.ok().build();
    }

    // Update document tags
    @PutMapping("/{filename:.+}/tags")
    public ResponseEntity<DocumentDTO> updateDocumentTags(
            @PathVariable String filename,
            @RequestParam("email") String email,
            @RequestBody Map<String, List<String>> request) {
        try {
            User user = getCurrentUser(email);
            List<String> tags = request.get("tags");
            DocumentDTO updatedDoc = documentService.updateDocumentTags(user, filename, tags);
            return ResponseEntity.ok(updatedDoc);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get document with tags
    @GetMapping("/{filename:.+}/details")
    public ResponseEntity<DocumentDTO> getDocumentDetails(
            @PathVariable String filename,
            @RequestParam("email") String email) {
        try {
            User user = getCurrentUser(email);
            DocumentDTO doc = documentService.getDocumentDTOByFilename(user, filename);
            return ResponseEntity.ok(doc);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
