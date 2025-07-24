package com.minibill.user.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.minibill.security.PermissionRequired;
import com.minibill.user.dto.UserPermissionDTO;
import com.minibill.user.model.User;
import com.minibill.user.model.UserPermission;
import com.minibill.user.repository.UserRepository;
import com.minibill.user.service.UserPermissionService;

@RestController
@RequestMapping("/users")
public class UserPermissionController {

    private final UserPermissionService userPermissionService;
    private final UserRepository userRepository;

    public UserPermissionController(UserPermissionService userPermissionService, UserRepository userRepository) {
        this.userPermissionService = userPermissionService;
        this.userRepository = userRepository;
    }

    // === 指派權限給使用者 ===
    @PostMapping("/{userId}/permissions")
    @PermissionRequired(99)
    public ResponseEntity<String> assignPermission(@PathVariable UUID userId, @RequestParam UUID permissionId) {
        // 防止管理員修改自己的權限
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String account = auth.getName();
        User currentUser = userRepository.findByAccount(account)
                .orElseThrow(() -> new RuntimeException("使用者不存在"));
        
        if (currentUser.getUuid().equals(userId)) {
            return ResponseEntity.status(403).body("不能修改自己的權限");
        }
        
        userPermissionService.assignPermission(userId, permissionId);
        return ResponseEntity.ok("已新增權限：" + permissionId);
    }

    // === 更新使用者權限 ===
    @PutMapping("/{userId}/permissions")
    @PermissionRequired(99)
    public ResponseEntity<String> updateUserPermission(@PathVariable UUID userId, @RequestParam UUID permissionId) {
        // 防止管理員修改自己的權限
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String account = auth.getName();
        User currentUser = userRepository.findByAccount(account)
                .orElseThrow(() -> new RuntimeException("使用者不存在"));
        
        if (currentUser.getUuid().equals(userId)) {
            return ResponseEntity.status(403).body("不能修改自己的權限");
        }
        
        userPermissionService.updateUserPermission(userId, permissionId);
        return ResponseEntity.ok("已更新使用者權限為：" + permissionId);
    }

    // === 查詢使用者權限 ===
    @GetMapping("/{userId}/permissions")
    @PermissionRequired(99)
    public ResponseEntity<List<UserPermission>> getUserPermissions(@PathVariable UUID userId) {
        return ResponseEntity.ok(userPermissionService.getUserPermissions(userId));
    }

    // === 刪除使用者權限 ===
    @DeleteMapping("/{userId}/permissions")
    @PermissionRequired(99)
    public ResponseEntity<String> removeUserPermission(@PathVariable UUID userId) {
        // 防止管理員刪除自己的權限
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String account = auth.getName();
        User currentUser = userRepository.findByAccount(account)
                .orElseThrow(() -> new RuntimeException("使用者不存在"));
        
        if (currentUser.getUuid().equals(userId)) {
            return ResponseEntity.status(403).body("不能刪除自己的權限");
        }
        
        userPermissionService.removeUserPermission(userId);
        return ResponseEntity.ok("已移除使用者權限");
    }

    // === 查詢所有使用者及權限 ===
    @GetMapping("/permissions/all")
    @PermissionRequired(99)
    public ResponseEntity<List<UserPermissionDTO>> getAllUsersWithPermissions() {
        // 獲取當前登入的使用者資訊
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String account = auth.getName();
        User currentUser = userRepository.findByAccount(account)
                .orElseThrow(() -> new RuntimeException("使用者不存在"));
        
        // 傳遞當前使用者ID，排除自己不能修改自己的權限
        return ResponseEntity.ok(userPermissionService.getAllUserPermissions(currentUser.getUuid()));
    }
}
