package com.vitacare.vitacare.Repository;

import com.vitacare.vitacare.Model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfilesRepository extends JpaRepository<Profile, Long> {
    Profile findByUserId(Long userId);
}
