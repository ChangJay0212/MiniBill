package com.minibill.security;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class PermissionAspect {

    @Before("@annotation(permissionRequired)")
    public void checkPermission(PermissionRequired permissionRequired) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getDetails() == null) {
            throw new RuntimeException("未授權");
        }
        int userLevel = (int) auth.getDetails();
        if (userLevel < permissionRequired.value()) {
            throw new RuntimeException("權限不足");
        }
    }
}
