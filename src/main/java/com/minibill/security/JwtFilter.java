package com.minibill.security;

import com.minibill.auth.service.JwtService;
import io.jsonwebtoken.Claims;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    public JwtFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");

        // 開發環境無 Token → 自動套用 admin Token
        if ((authHeader == null || !authHeader.startsWith("Bearer ")) && "dev".equals(activeProfile)) {
            authHeader = "Bearer " + jwtService.generateAdminToken();
            System.out.println("JwtFilter executed, Authorization: " + authHeader);
        }

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                Claims claims = jwtService.parseToken(token);
                String username = claims.getSubject();
                Integer permissionLevel = (Integer) claims.get("permissionLevel");

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(username, null, Collections.emptyList());
                authentication.setDetails(permissionLevel);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (Exception e) {
                // Token 無效，忽略
            }
        }

        chain.doFilter(request, response);
    }
}
