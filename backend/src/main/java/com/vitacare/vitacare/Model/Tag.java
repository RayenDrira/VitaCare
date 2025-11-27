package com.vitacare.vitacare.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "tags")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(name = "color")
    private String color; // Hex color code for UI

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // --- Relationship to User ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    // --- Many-to-Many with Documents ---
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "document_tags",
        joinColumns = @JoinColumn(name = "tag_id"),
        inverseJoinColumns = @JoinColumn(name = "document_id")
    )
    @JsonIgnore // Prevent serialization issues
    @ToString.Exclude // Prevent toString loops
    @EqualsAndHashCode.Exclude // Prevent equals/hashCode loops
    private Set<Document> documents = new HashSet<>();

    // Constructor for creating new tags
    public Tag(String name, String description, String color, User user) {
        this.name = name;
        this.description = description;
        this.color = color;
        this.user = user;
    }

    // Helper methods for managing document relationships
    public void addDocument(Document document) {
        this.documents.add(document);
        document.getTags().add(this);
    }

    public void removeDocument(Document document) {
        this.documents.remove(document);
        document.getTags().remove(this);
    }
}
