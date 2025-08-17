package com.vitacare.vitacare.Repository;

import com.vitacare.vitacare.Model.Profiles;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfilesRepository extends JpaRepository<Profiles, Long> {
    Profiles findByUserId(Long userId);
}
