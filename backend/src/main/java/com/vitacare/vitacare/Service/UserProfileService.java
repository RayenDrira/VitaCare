package com.vitacare.vitacare.Service;

import com.vitacare.vitacare.Model.User;
import com.vitacare.vitacare.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;

@Service
public class UserProfileService {

    @Autowired
    private UserRepository userRepository;

    // Récupérer le profil
    public User getProfile(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'id : " + userId));
    }

    // Mettre à jour ou supprimer un ou plusieurs champs
    public User updateProfile(Long userId, User updatedData) {
        User user = getProfile(userId);

        // Mise à jour uniquement si la valeur envoyée n'est pas nulle
        if (updatedData.getFirstName() != null) user.setFirstName(updatedData.getFirstName());
        if (updatedData.getLastName() != null) user.setLastName(updatedData.getLastName());
        if (updatedData.getEmail() != null) user.setEmail(updatedData.getEmail());
        if (updatedData.getPhoneNumber() != null) user.setPhoneNumber(updatedData.getPhoneNumber());
        if (updatedData.getDateOfBirth() != null) user.setDateOfBirth(updatedData.getDateOfBirth());
        if (updatedData.getGender() != null) user.setGender(updatedData.getGender());

        // --- New Health Fields ---
        if (updatedData.getWeight() != null) user.setWeight(updatedData.getWeight());
        if (updatedData.getHeight() != null) user.setHeight(updatedData.getHeight());
        if (updatedData.getBloodType() != null) user.setBloodType(updatedData.getBloodType());
        if (updatedData.getAllergies() != null) user.setAllergies(updatedData.getAllergies());
        if (updatedData.getChronicConditions() != null) user.setChronicConditions(updatedData.getChronicConditions());
        if (updatedData.getMedications() != null) user.setMedications(updatedData.getMedications());

        return userRepository.save(user);
    }

    // Télécharger ou remplacer la photo
    public User uploadPhoto(Long userId, MultipartFile file) throws IOException {
        User user = getProfile(userId);

        if (file != null && !file.isEmpty()) {
            Path uploadDir = Paths.get("uploads");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = uploadDir.resolve(filename);

            file.transferTo(filePath);

            // Supprimer l'ancienne photo si elle existe
            if (user.getProfilePictureUrl() != null) {
                Path oldPhotoPath = uploadDir.resolve(Paths.get(user.getProfilePictureUrl()).getFileName());
                Files.deleteIfExists(oldPhotoPath);
            }

            user.setProfilePictureUrl(filename);
            userRepository.save(user);
        }

        return user;
    }

    // Supprimer la photo
    public User deletePhoto(Long userId) throws IOException {
        User user = getProfile(userId);

        if (user.getProfilePictureUrl() != null) {
            Path uploadDir = Paths.get("uploads");
            Path photoPath = uploadDir.resolve(Paths.get(user.getProfilePictureUrl()).getFileName());
            Files.deleteIfExists(photoPath);

            user.setProfilePictureUrl(null);
            userRepository.save(user);
        }

        return user;
    }
}
