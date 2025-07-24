package com.minibill.user.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.minibill.user.dto.UserPermissionDTO;
import com.minibill.user.model.Permission;
import com.minibill.user.model.User;
import com.minibill.user.model.UserPermission;
import com.minibill.user.repository.PermissionRepository;
import com.minibill.user.repository.UserPermissionRepository;
import com.minibill.user.repository.UserRepository;

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
    @Transactional
    public void assignPermission(UUID userId, UUID permissionId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("使用者不存在"));

        Permission permission = permissionRepository.findById(permissionId)
                .orElseThrow(() -> new RuntimeException("權限不存在"));

        // 避免重複新增
        if (userPermissionRepository.existsByUserAndPermission(user, permission)) {
            throw new RuntimeException("該使用者已擁有此權限");
        }

        UserPermission userPermission = new UserPermission();
        userPermission.setUser(user);
        userPermission.setPermission(permission);
        userPermissionRepository.save(userPermission);
    }
    @Transactional
    public void updateUserPermission(UUID userId, UUID permissionId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("使用者不存在"));

        Permission permission = permissionRepository.findById(permissionId)
                .orElseThrow(() -> new RuntimeException("權限不存在"));

        // 先刪掉舊的
        userPermissionRepository.deleteByUser(user);

        // 重新建立
        UserPermission userPermission = new UserPermission();
        userPermission.setUser(user);
        userPermission.setPermission(permission);
        userPermissionRepository.save(userPermission);
    }
    public Permission createPermission(Integer level) {
        if (permissionRepository.findByPermissionLevel(level).isPresent()) {
            throw new RuntimeException("權限已存在");
        }
        Permission p = new Permission();
        p.setPermissionLevel(level);
        return permissionRepository.save(p);
    }
    public List<UserPermissionDTO> getAllUserPermissions(UUID currentUserId) {
        // 獲取所有使用者，但排除當前登入的使用者
        List<User> allUsers = userRepository.findAll();
        List<UserPermissionDTO> result = new ArrayList<>();
        
        for (User user : allUsers) {
            // 跳過當前登入的使用者，不允許修改自己的權限
            if (user.getUuid().equals(currentUserId)) {
                continue;
            }
            
            // 查找該使用者的權限
            Optional<UserPermission> existingPermission = userPermissionRepository.findByUser(user);
            
            if (existingPermission.isPresent()) {
                // 如果有權限，建立 DTO 物件
                UserPermission up = existingPermission.get();
                UserPermissionDTO dto = new UserPermissionDTO(
                    user.getUuid(),
                    user.getAccount(),
                    user.getName(),
                    user.getEmail(),
                    up.getPermission().getPermissionLevel(),
                    up.getPermission().getUuid()
                );
                result.add(dto);
            } else {
                // 如果沒有權限，建立一個空的 DTO 物件
                UserPermissionDTO dto = new UserPermissionDTO(
                    user.getUuid(),
                    user.getAccount(),
                    user.getName(),
                    user.getEmail(),
                    null,
                    null
                );
                result.add(dto);
            }
        }
        
        return result;
    }
    
    @Transactional
    public void removeUserPermission(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("使用者不存在"));
        
        // 刪除該使用者的所有權限
        userPermissionRepository.deleteByUser(user);
    }
}
