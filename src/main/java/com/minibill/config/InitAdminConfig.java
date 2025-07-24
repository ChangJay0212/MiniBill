package com.minibill.config;

import com.minibill.user.repository.UserRepository;
import com.minibill.user.repository.PermissionRepository;
import com.minibill.user.repository.UserPermissionRepository;
import com.minibill.user.model.User;
import com.minibill.user.model.Permission;
import com.minibill.user.model.UserPermission;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class InitAdminConfig {

    @Bean
    CommandLineRunner initAdmin(UserRepository userRepository,
                                PermissionRepository permissionRepository,
                                UserPermissionRepository userPermissionRepository,
                                PasswordEncoder passwordEncoder) {
        return args -> {
            // 1. 建立 ADMIN 權限（如果不存在）
            Permission adminPermission = permissionRepository.findByPermissionLevel(99)
                    .orElseGet(() -> {
                        Permission p = new Permission();
                        p.setPermissionLevel(99); // 最高權限用 99
                        return permissionRepository.save(p);
                    });

            // 3. 建立 admin 帳號
            User admin = userRepository.findByAccount("admin").orElseGet(() -> {
                User newAdmin = new User();
                newAdmin.setAccount("admin");
                newAdmin.setEmail("admin@minibill.local");
                newAdmin.setPassword(passwordEncoder.encode("1234")); // 用 Bcrypt 存
                newAdmin.setName("Administrator");
                newAdmin.setActive(true);
                return userRepository.save(newAdmin);
            });

            // 4. 綁定 admin 的最高權限（如果還沒綁過）
            boolean hasAdmin = userPermissionRepository.existsByUserUuidAndPermissionUuid(admin.getUuid(), adminPermission.getUuid());
            if (!hasAdmin) {
                UserPermission up = new UserPermission();
                up.setUser(admin);
                up.setPermission(adminPermission);
                userPermissionRepository.save(up);
                System.out.println(">>> 已為 admin 帳號指派最高權限");
            }

            System.out.println(">>> 預設帳號 admin/1234 已建立，並擁有最高權限");
        };
    }
}
