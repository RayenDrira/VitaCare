package com.vitacare.vitacare.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocumentDTO {
    private Long id;
    private String filename;
    private String fileType;
    private Long fileSize;
    private String filePath;
    private LocalDateTime uploadedAt;
    
    // User information (basic info only)
    private Long userId;
    private String userFirstName;
    private String userLastName;
    
    // Tag information (IDs and names only)
    private List<Long> tagIds;
    private List<String> tagNames;
    
    // Constructor for basic document info
    public DocumentDTO(Long id, String filename, String fileType, Long fileSize, 
                      String filePath, LocalDateTime uploadedAt, Long userId, 
                      String userFirstName, String userLastName) {
        this.id = id;
        this.filename = filename;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this.filePath = filePath;
        this.uploadedAt = uploadedAt;
        this.userId = userId;
        this.userFirstName = userFirstName;
        this.userLastName = userLastName;
    }
}
