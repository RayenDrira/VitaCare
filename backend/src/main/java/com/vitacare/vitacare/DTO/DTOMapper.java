package com.vitacare.vitacare.DTO;

import com.vitacare.vitacare.Model.Document;
import com.vitacare.vitacare.Model.Tag;
import com.vitacare.vitacare.Model.User;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class DTOMapper {

    // User Entity to DTO
    public UserDTO toUserDTO(User user) {
        if (user == null) return null;
        
        UserDTO dto = new UserDTO(
            user.getId(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getProfilePictureUrl(),
            user.getDateOfBirth(),
            user.getGender(),
            user.getPhoneNumber(),
            user.getCreatedAt(),
            user.getUpdatedAt(),
            user.getWeight(),
            user.getHeight(),
            user.getBloodType(),
            user.getAllergies(),
            user.getChronicConditions()
        );
        
        // Set document IDs if available
        if (user.getDocuments() != null) {
            dto.setDocumentIds(user.getDocuments().stream()
                .map(Document::getId)
                .collect(Collectors.toList()));
        }
        
        // Set tag IDs if available
        if (user.getTags() != null) {
            dto.setTagIds(user.getTags().stream()
                .map(Tag::getId)
                .collect(Collectors.toList()));
        }
        
        return dto;
    }

    // Document Entity to DTO
    public DocumentDTO toDocumentDTO(Document document) {
        if (document == null) return null;
        
        User user = document.getUser();
        DocumentDTO dto = new DocumentDTO(
            document.getId(),
            document.getFilename(),
            document.getFileType(),
            document.getFileSize(),
            document.getFilePath(),
            document.getUploadedAt(),
            user != null ? user.getId() : null,
            user != null ? user.getFirstName() : null,
            user != null ? user.getLastName() : null
        );

        // Set tag information if available
        if (document.getTags() != null && !document.getTags().isEmpty()) {
            dto.setTagIds(document.getTags().stream()
                .map(Tag::getId)
                .collect(Collectors.toList()));
            dto.setTagNames(document.getTags().stream()
                .map(Tag::getName)
                .collect(Collectors.toList()));
        }

        return dto;
    }

    // Tag Entity to DTO
    public TagDTO toTagDTO(Tag tag) {
        if (tag == null) return null;
        
        User user = tag.getUser();
        TagDTO dto = new TagDTO(
            tag.getId(),
            tag.getName(),
            tag.getDescription(),
            tag.getColor(),
            tag.getCreatedAt(),
            user != null ? user.getId() : null,
            user != null ? user.getFirstName() : null
        );

        // Set document information if available
        if (tag.getDocuments() != null && !tag.getDocuments().isEmpty()) {
            dto.setDocumentIds(tag.getDocuments().stream()
                .map(Document::getId)
                .collect(Collectors.toList()));
            dto.setDocumentNames(tag.getDocuments().stream()
                .map(Document::getFilename)
                .collect(Collectors.toList()));
        }

        return dto;
    }

    // List converters
    public List<UserDTO> toUserDTOList(List<User> users) {
        return users.stream()
            .map(this::toUserDTO)
            .collect(Collectors.toList());
    }

    public List<DocumentDTO> toDocumentDTOList(List<Document> documents) {
        return documents.stream()
            .map(this::toDocumentDTO)
            .collect(Collectors.toList());
    }

    public List<TagDTO> toTagDTOList(List<Tag> tags) {
        return tags.stream()
            .map(this::toTagDTO)
            .collect(Collectors.toList());
    }

    // Basic user info for other DTOs
    public UserDTO toBasicUserDTO(User user) {
        if (user == null) return null;
        
        return new UserDTO(
            user.getId(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getProfilePictureUrl(),
            user.getDateOfBirth(),
            user.getGender(),
            user.getPhoneNumber(),
            user.getCreatedAt(),
            user.getUpdatedAt(),
            user.getWeight(),
            user.getHeight(),
            user.getBloodType(),
            user.getAllergies(),
            user.getChronicConditions()
        );
    }
}
