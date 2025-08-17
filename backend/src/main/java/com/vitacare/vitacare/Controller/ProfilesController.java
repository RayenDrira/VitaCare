package com.vitacare.vitacare.Controller;

import com.vitacare.vitacare.Model.Profiles;
import com.vitacare.vitacare.Repository.ProfilesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/profiles")
public class ProfilesController {

    @Autowired
    private ProfilesRepository profilesRepository;

    @GetMapping
    public List<Profiles> getAllProfiles() {
        return profilesRepository.findAll();
    }

    @GetMapping("/{userId}")
    public Profiles getProfileByUserId(@PathVariable Long userId) {
        return profilesRepository.findByUserId(userId);
    }

    @PostMapping
    public Profiles createProfile(@RequestBody Profiles profile) {
        return profilesRepository.save(profile);
    }

    @PutMapping("/{id}")
    public Profiles updateProfile(@PathVariable Long id, @RequestBody Profiles profileDetails) {
        Profiles profile = profilesRepository.findById(id).orElseThrow();
        profile.setFirstName(profileDetails.getFirstName());
        profile.setLastName(profileDetails.getLastName());
        profile.setBirthDate(profileDetails.getBirthDate());
        profile.setPhoneNumber(profileDetails.getPhoneNumber());
        profile.setProfilePhoto(profileDetails.getProfilePhoto());
        profile.setUpdatedAt(java.time.LocalDateTime.now());
        return profilesRepository.save(profile);
    }

    @DeleteMapping("/{id}")
    public void deleteProfile(@PathVariable Long id) {
        profilesRepository.deleteById(id);
    }
}
