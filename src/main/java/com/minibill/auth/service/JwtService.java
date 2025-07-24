package com.minibill.auth.service;

import com.minibill.user.model.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtService {
    private final String secret = "MiniBillSecretKey"; // TODO: 放到 application.properties
    private final long expiration = 1000 * 60 * 60; // 1 小時

    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getAccount())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(SignatureAlgorithm.HS256, secret)
                .compact();
    }
}
