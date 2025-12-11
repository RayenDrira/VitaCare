package com.vitacare.vitacare.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.util.List;
import java.util.ArrayList;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
@EntityListeners(AuditingEntityListener.class)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    private String password;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "profile_picture_url")
    private String profilePictureUrl;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth; // Date de naissance

    @Column(name = "gender")
    @Enumerated(EnumType.STRING)
    private Gender gender; // Sexe de l'utilisateur

    @Column(name = "phone_number")
    private String phoneNumber; // Numéro de téléphone

    @Column(name = "provider")
    @Enumerated(EnumType.STRING)
    private AuthProvider provider = AuthProvider.LOCAL;

    @Column(name = "provider_id")
    private String providerId;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // --- New Health Fields ---
    private Double weight; // in kg
    private Double height; // in cm

    @Column(name = "blood_type")
    private String bloodType; // e.g., A+, O-, etc.

    private String allergies; // optional, comma-separated

    @Column(name = "chronic_conditions")
    private String chronicConditions; // optional, comma-separated

    private String medications; // optional, comma-separated

    @JsonIgnore // prevents infinite loop
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Document> documents = new ArrayList<>();

    @JsonIgnore // prevents infinite loop
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Tag> tags = new ArrayList<>();


    // --- Enums ---
    public enum AuthProvider {
        LOCAL,
        GOOGLE
    }

    public enum Gender {
        MALE,
        FEMALE,

    }
}
