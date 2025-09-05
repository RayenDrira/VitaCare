package com.vitacare.vitacare.Service;

import com.vitacare.vitacare.Model.User;
import com.vitacare.vitacare.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

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
        if (updatedData.getProfilePictureUrl() != null) user.setProfilePictureUrl(updatedData.getProfilePictureUrl());

        return userRepository.save(user);
    }

    // Télécharger ou remplacer la photo
    public User uploadPhoto(Long userId, MultipartFile file) throws IOException {
        User user = getProfile(userId);

        if (file != null && !file.isEmpty()) {
            // Générer un nom de fichier unique pour éviter les collisions
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get("uploads/" + fileName);
            Files.createDirectories(filePath.getParent());
            Files.write(filePath, file.getBytes(), StandardOpenOption.CREATE);

            // Supprimer l'ancienne photo si existante
            if (user.getProfilePictureUrl() != null) {
                Files.deleteIfExists(Paths.get(user.getProfilePictureUrl()));
            }

            user.setProfilePictureUrl(filePath.toString());
            userRepository.save(user);
        }

        return user;
    }

    // Supprimer la photo
    public User deletePhoto(Long userId) throws IOException {
        User user = getProfile(userId);

        if (user.getProfilePictureUrl() != null) {
            Files.deleteIfExists(Paths.get(user.getProfilePictureUrl()));
            user.setProfilePictureUrl(null);
            userRepository.save(user);
        }

        return user;
    }
}
