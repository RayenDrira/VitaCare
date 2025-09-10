package com.vitacare.vitacare.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

@Entity
@Table(name = "documents")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String filename;

    private String fileType;
    private Long fileSize;
    private String filePath;
    private LocalDateTime uploadedAt;
    public Document(String filename, String fileType, Long fileSize, String filePath) {
        this.filename = filename;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this.filePath = filePath;
        // uploadedAt = null → MySQL le remplira automatiquement
    }

}
