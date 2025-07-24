package com.minibill.user.controller;

import com.minibill.user.model.Permission;
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

    // 新增權限
    @PostMapping("/permissions")
    public ResponseEntity<Permission> createPermission(@RequestParam Integer level) {
        return ResponseEntity.ok(userPermissionService.createPermission(level));
    }

    // 指派權限給使用者
    @PostMapping("/{userId}/permissions")
    public ResponseEntity<String> assignPermission(@PathVariable UUID userId, @RequestParam Integer level) {
        userPermissionService.assignPermission(userId, level);
        return ResponseEntity.ok("已新增權限：" + level);
    }

    // 查詢使用者權限
    @GetMapping("/{userId}/permissions")
    public ResponseEntity<List<UserPermission>> getUserPermissions(@PathVariable UUID userId) {
        return ResponseEntity.ok(userPermissionService.getUserPermissions(userId));
    }
}
