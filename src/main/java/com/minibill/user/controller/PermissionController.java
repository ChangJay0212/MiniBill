package com.minibill.user.controller;

import com.minibill.user.model.Permission;
import com.minibill.user.repository.PermissionRepository;
import com.minibill.security.PermissionRequired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/permissions")
public class PermissionController {

    private final PermissionRepository permissionRepository;

    public PermissionController(PermissionRepository permissionRepository) {
        this.permissionRepository = permissionRepository;
    }

    // === 取得所有權限 ===
    @GetMapping
    @PermissionRequired(99)
    public ResponseEntity<List<Permission>> getAllPermissions() {
        return ResponseEntity.ok(permissionRepository.findAll());
    }

    // === 新增權限 ===
    @PostMapping
    @PermissionRequired(99)
    public ResponseEntity<Permission> createPermission(@RequestParam Integer level) {
        if (permissionRepository.findByPermissionLevel(level).isPresent()) {
            return ResponseEntity.badRequest().build();
        }
        Permission permission = new Permission();
        permission.setPermissionLevel(level);
        return ResponseEntity.ok(permissionRepository.save(permission));
    }

    // === 修改權限 ===
    @PutMapping("/{id}")
    @PermissionRequired(99)
    public ResponseEntity<Permission> updatePermission(@PathVariable UUID id, @RequestParam Integer level) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("權限不存在"));
        permission.setPermissionLevel(level);
        return ResponseEntity.ok(permissionRepository.save(permission));
    }

    // === 刪除權限 ===
    @DeleteMapping("/{id}")
    @PermissionRequired(99)
    public ResponseEntity<String> deletePermission(@PathVariable UUID id) {
        if (!permissionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        permissionRepository.deleteById(id);
        return ResponseEntity.ok("權限已刪除");
    }
}
