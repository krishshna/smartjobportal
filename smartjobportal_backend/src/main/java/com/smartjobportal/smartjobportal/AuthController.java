package com.smartjobportal.smartjobportal;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "https://smartjobportal-chi.vercel.app")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          AuthenticationManager authManager,
                          JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already registered."));
        }
        User user = new User(req.getFullName(), req.getEmail(),
                              passwordEncoder.encode(req.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Registered successfully!"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
            UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
            String token = jwtUtil.generateToken(userDetails.getUsername(),
                    userDetails.getAuthorities().iterator().next().getAuthority());
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "email", userDetails.getUsername(),
                    "name", userDetails.getFullName(),
                    "role", userDetails.getAuthorities().iterator().next().getAuthority()
            ));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials."));
        }
    }
}