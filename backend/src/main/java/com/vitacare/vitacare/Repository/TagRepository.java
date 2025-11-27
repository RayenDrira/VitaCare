package com.vitacare.vitacare.Repository;

import com.vitacare.vitacare.Model.Tag;
import com.vitacare.vitacare.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {

    // Find all tags for a specific user
    List<Tag> findByUserOrderByCreatedAtDesc(User user);

    // Find tag by name and user (case-insensitive)
    Optional<Tag> findByNameIgnoreCaseAndUser(String name, User user);

    // Find tag by name and user (exact match)
    Optional<Tag> findByNameAndUser(String name, User user);

    // Search tags by name containing search term (case-insensitive)
    List<Tag> findByUserAndNameContainingIgnoreCase(User user, String searchTerm);

    // Find tags by user
    List<Tag> findByUser(User user);

    // Check if tag exists for user
    boolean existsByNameIgnoreCaseAndUser(String name, User user);

    // Count tags for a user
    long countByUser(User user);

    // Find tags by document ID
    @Query("SELECT t FROM Tag t JOIN t.documents d WHERE d.id = :documentId")
    List<Tag> findByDocumentId(@Param("documentId") Long documentId);

    // Find tags by document ID and user (for security)
    @Query("SELECT t FROM Tag t JOIN t.documents d WHERE d.id = :documentId AND t.user = :user")
    List<Tag> findByDocumentIdAndUser(@Param("documentId") Long documentId, @Param("user") User user);
}