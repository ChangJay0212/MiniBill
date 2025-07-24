package com.minibill.user.controller;

import com.minibill.security.PermissionRequired;
import com.minibill.user.model.UserPermission;
import com.minibill.user.service.UserPermissionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/users")
public class UserPermissionController {

    private final UserPermissionService userPermissionService;

    public UserPermissionController(UserPermissionService userPermissionService) {
        this.userPermissionService = userPermissionService;
    }

    // === 指派權限給使用者 ===
    @PostMapping("/{userId}/permissions")
    @PermissionRequired(99)
    public ResponseEntity<String> assignPermission(@PathVariable UUID userId, @RequestParam UUID permissionId) {
        userPermissionService.assignPermission(userId, permissionId);
        return ResponseEntity.ok("已新增權限：" + permissionId);
    }

    // === 更新使用者權限 ===
    @PutMapping("/{userId}/permissions")
    @PermissionRequired(99)
    public ResponseEntity<String> updateUserPermission(@PathVariable UUID userId, @RequestParam UUID permissionId) {
        userPermissionService.updateUserPermission(userId, permissionId);
        return ResponseEntity.ok("已更新使用者權限為：" + permissionId);
    }

    // === 查詢使用者權限 ===
    @GetMapping("/{userId}/permissions")
    @PermissionRequired(99)
    public ResponseEntity<List<UserPermission>> getUserPermissions(@PathVariable UUID userId) {
        return ResponseEntity.ok(userPermissionService.getUserPermissions(userId));
    }

    // === 查詢所有使用者及權限 ===
    @GetMapping("/permissions/all")
    @PermissionRequired(99)
    public ResponseEntity<List<UserPermission>> getAllUsersWithPermissions() {
        return ResponseEntity.ok(userPermissionService.getAllUserPermissions());
    }
}
