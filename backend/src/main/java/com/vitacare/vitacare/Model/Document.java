package com.vitacare.vitacare.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "documents")
@Getter
@Setter
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

    @Column(name = "uploaded_at",
            updatable = false,
            insertable = false)
    private LocalDateTime uploadedAt;

    // --- Relationship to User ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore // prevents infinite loop
    private User user;

    // --- Many-to-Many with Tags (Inverse side) ---
    @ManyToMany(mappedBy = "documents", fetch = FetchType.LAZY)
    @JsonIgnore // Prevent serialization issues
    @ToString.Exclude // Prevent toString loops
    @EqualsAndHashCode.Exclude // Prevent equals/hashCode loops
    private Set<Tag> tags = new HashSet<>();

    public Document(String filename, String fileType, Long fileSize, String filePath, User user) {
        this.filename = filename;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this.filePath = filePath;
        this.user = user;
        // uploadedAt = null → MySQL will fill automatically
    }
}
