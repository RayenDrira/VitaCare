package com.vitacare.vitacare.DTO;

import com.vitacare.vitacare.Model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String profilePictureUrl;
    private LocalDate dateOfBirth;
    private User.Gender gender;
    private String phoneNumber;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Health Information
    private Double weight;
    private Double height;
    private String bloodType;
    private String allergies;
    private String chronicConditions;
    
    // Related data (IDs only to avoid circular references)
    private List<Long> documentIds;
    private List<Long> tagIds;
    
    // Constructor for basic user info (without relationships)
    public UserDTO(Long id, String email, String firstName, String lastName, 
                   String profilePictureUrl, LocalDate dateOfBirth, User.Gender gender, 
                   String phoneNumber, LocalDateTime createdAt, LocalDateTime updatedAt,
                   Double weight, Double height, String bloodType, String allergies, String chronicConditions) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.profilePictureUrl = profilePictureUrl;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.phoneNumber = phoneNumber;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.weight = weight;
        this.height = height;
        this.bloodType = bloodType;
        this.allergies = allergies;
        this.chronicConditions = chronicConditions;
    }
}
