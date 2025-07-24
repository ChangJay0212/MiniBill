package com.minibill.user.repository;

import com.minibill.user.model.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface PermissionRepository extends JpaRepository<Permission, UUID> {
    Optional<Permission> findByPermissionLevel(Integer permissionLevel);
}
