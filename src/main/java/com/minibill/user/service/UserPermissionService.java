package com.minibill.user.service;

import com.minibill.user.repository.PermissionRepository;
import com.minibill.user.repository.UserPermissionRepository;
import com.minibill.user.repository.UserRepository;
import com.minibill.user.model.Permission;
import com.minibill.user.model.User;
import com.minibill.user.model.UserPermission;

import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.UUID;

@Service
public class UserPermissionService {

    private final UserRepository userRepository;
    private final PermissionRepository permissionRepository;
    private final UserPermissionRepository userPermissionRepository;

    public UserPermissionService(UserRepository userRepository,
                                 PermissionRepository permissionRepository,
                                 UserPermissionRepository userPermissionRepository) {
        this.userRepository = userRepository;
        this.permissionRepository = permissionRepository;
        this.userPermissionRepository = userPermissionRepository;
    }

    @Transactional
    public void assignPermission(UUID userId, Integer level) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("找不到使用者"));
        Permission permission = permissionRepository.findByPermissionLevel(level).orElseThrow(() -> new RuntimeException("找不到權限"));

        // 避免重複
        if (userPermissionRepository.findByUserUuid(userId).stream()
                .anyMatch(up -> up.getPermission().getPermissionLevel().equals(level))) {
            return;
        }

        UserPermission up = new UserPermission();
        up.setUser(user);
        up.setPermission(permission);
        userPermissionRepository.save(up);
    }

    public List<UserPermission> getUserPermissions(UUID userId) {
        return userPermissionRepository.findByUserUuid(userId);
    }

    public Permission createPermission(Integer level) {
        if (permissionRepository.findByPermissionLevel(level).isPresent()) {
            throw new RuntimeException("權限已存在");
        }
        Permission p = new Permission();
        p.setPermissionLevel(level);
        return permissionRepository.save(p);
    }
}
