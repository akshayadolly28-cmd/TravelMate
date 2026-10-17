package com.travelmate.controller;

import com.travelmate.dto.AuthDto.*;
import com.travelmate.entity.User;
import com.travelmate.repository.FavoriteRepository;
import com.travelmate.repository.TripRepository;
import com.travelmate.repository.UserRepository;
import com.travelmate.security.AuthHelper;
import com.travelmate.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthHelper authHelper;
    private final TripRepository tripRepository;
    private final FavoriteRepository favoriteRepository;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthHelper authHelper,
            TripRepository tripRepository,
            FavoriteRepository favoriteRepository
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authHelper = authHelper;
        this.tripRepository = tripRepository;
        this.favoriteRepository = favoriteRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is already registered."));
        }

        User user = new User();
        user.setName(req.name().trim());
        user.setEmail(req.email().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(req.password()));
        user.setRole("USER");
        userRepository.save(user);

        String token = jwtService.generate(user.getEmail());
        UserDto userDto = new UserDto(user.getId(), user.getName(), user.getEmail(), user.getRole(), 0, 0);

        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(token, userDto, "Registration successful!"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        return userRepository.findByEmail(req.email().trim().toLowerCase())
                .filter(u -> passwordEncoder.matches(req.password(), u.getPassword()))
                .map(u -> {
                    String token = jwtService.generate(u.getEmail());
                    long trips = tripRepository.countByUserId(u.getId());
                    long favs = favoriteRepository.countByUserId(u.getId());
                    UserDto userDto = new UserDto(u.getId(), u.getName(), u.getEmail(), u.getRole(), trips, favs);
                    return ResponseEntity.ok(new AuthResponse(token, userDto, "Login successful!"));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new AuthResponse(null, null, "Invalid email or password.")));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        return authHelper.getCurrentUser()
                .map(u -> {
                    long trips = tripRepository.countByUserId(u.getId());
                    long favs = favoriteRepository.countByUserId(u.getId());
                    UserDto userDto = new UserDto(u.getId(), u.getName(), u.getEmail(), u.getRole(), trips, favs);
                    return ResponseEntity.ok(userDto);
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }
}
