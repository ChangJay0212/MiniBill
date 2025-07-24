package com.minibill.user.controller;

import com.minibill.security.PermissionRequired;
import com.minibill.user.dto.UserUpdateRequest;
import com.minibill.user.model.User;
import com.minibill.user.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // === 查詢所有使用者（僅最高權限） ===
    @GetMapping
    @PermissionRequired(99)
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // === 查詢單一使用者（自己或最高權限） ===
    @GetMapping("/{userId}")
    public ResponseEntity<User> getUser(@PathVariable UUID userId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String account = auth.getName();
        User currentUser = userRepository.findByAccount(account)
                .orElseThrow(() -> new RuntimeException("使用者不存在"));

        if (!currentUser.getUuid().equals(userId) && (Integer) auth.getDetails() != 99) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("使用者不存在")));
    }

    // === 修改使用者（自己或最高權限） ===
    @PutMapping("/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable UUID userId, @RequestBody UserUpdateRequest updatedUser) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String account = auth.getName();
        User currentUser = userRepository.findByAccount(account)
                .orElseThrow(() -> new RuntimeException("使用者不存在"));

        if (!currentUser.getUuid().equals(userId) && (Integer) auth.getDetails() != 99) {
            return ResponseEntity.status(403).build();
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("使用者不存在"));

        if (updatedUser.getName() != null) user.setName(updatedUser.getName());
        if (updatedUser.getEmail() != null) user.setEmail(updatedUser.getEmail());
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }

        return ResponseEntity.ok(userRepository.save(user));
    }

    // === 刪除使用者（僅最高權限） ===
    @DeleteMapping("/{userId}")
    @PermissionRequired(99)
    public ResponseEntity<String> deleteUser(@PathVariable UUID userId) {
        userRepository.deleteById(userId);
        return ResponseEntity.ok("使用者已刪除");
    }
}
