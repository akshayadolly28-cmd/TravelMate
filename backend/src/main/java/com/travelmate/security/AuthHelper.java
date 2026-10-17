package com.travelmate.security;

import com.travelmate.entity.User;
import com.travelmate.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class AuthHelper {

    private final UserRepository userRepository;

    public AuthHelper(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return Optional.empty();
        }

        String email;
        if (auth.getPrincipal() instanceof UserDetails userDetails) {
            email = userDetails.getUsername();
        } else if (auth.getPrincipal() instanceof String principalString) {
            email = principalString;
        } else {
            return Optional.empty();
        }

        if (email == null || "anonymousUser".equalsIgnoreCase(email)) {
            return Optional.empty();
        }

        return userRepository.findByEmail(email);
    }

    public User getRequiredCurrentUser() {
        return getCurrentUser().orElseThrow(() -> new RuntimeException("User not authenticated"));
    }
}
