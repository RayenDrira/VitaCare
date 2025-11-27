package com.vitacare.vitacare.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TagDTO {
    private Long id;
    private String name;
    private String description;
    private String color; // For UI visualization
    private LocalDateTime createdAt;
    
    // User information
    private Long userId;
    private String userFirstName;
    
    // Document information (IDs and names only)
    private List<Long> documentIds;
    private List<String> documentNames;
    
    // Constructor for basic tag info
    public TagDTO(Long id, String name, String description, String color, 
                  LocalDateTime createdAt, Long userId, String userFirstName) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.color = color;
        this.createdAt = createdAt;
        this.userId = userId;
        this.userFirstName = userFirstName;
    }
}
