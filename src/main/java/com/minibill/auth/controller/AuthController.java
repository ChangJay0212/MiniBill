package com.minibill.auth.controller;

import com.minibill.auth.dto.LoginRequest;
import com.minibill.auth.dto.LoginResponse;
import com.minibill.auth.dto.SignupRequest;
import com.minibill.auth.dto.SignupResponse;
import com.minibill.user.repository.UserRepository;
import com.minibill.user.model.User;
import com.minibill.auth.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody LoginRequest request) {
        User user = userRepository.findByAccount(request.getAccount())
                .orElseThrow(() -> new RuntimeException("帳號不存在"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(401).body("密碼錯誤");
        }

        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(new LoginResponse(token));
    }
    @PostMapping("/signup")
public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
    // 檢查帳號是否已存在
    if (userRepository.findByAccount(request.getAccount()).isPresent()) {
        return ResponseEntity.badRequest().body("帳號已存在");
    }

    // 建立新使用者
    User newUser = new User();
    newUser.setAccount(request.getAccount());
    newUser.setName(request.getName());
    newUser.setEmail(request.getEmail());
    newUser.setPassword(passwordEncoder.encode(request.getPassword())); // 密碼 Hash
    newUser.setActive(true);

    userRepository.save(newUser);

    return ResponseEntity.ok(new SignupResponse("註冊成功"));
}
}
