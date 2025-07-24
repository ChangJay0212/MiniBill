package com.minibill.auth.service;

import com.minibill.user.model.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {
    private final String secret = "MiniBillSecretKey"; // TODO: 放到 application.properties
    private final long expiration = 1000 * 60 * 60; // 1 小時

    public String generateToken(User user, Integer permissionLevel) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("permissionLevel", permissionLevel);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getAccount())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(SignatureAlgorithm.HS256, secret)
                .compact();
    }
    // 開發模式用：快速生成 admin Token
    public String generateAdminToken() {
        Map<String, Object> claims = new HashMap<>();
        claims.put("permissionLevel", 99); // 超級管理員權限
        return Jwts.builder()
                .setClaims(claims)
                .setSubject("admin")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + (1000L * 60 * 60 * 24 * 7))) // 7 天有效
                .signWith(SignatureAlgorithm.HS256, secret)
                .compact();
    }
    public io.jsonwebtoken.Claims parseToken(String token) {
        return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
    }
}
