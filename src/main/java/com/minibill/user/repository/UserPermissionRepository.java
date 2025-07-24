package com.minibill.user.repository;

import com.minibill.user.model.UserPermission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface UserPermissionRepository extends JpaRepository<UserPermission, UUID> {

    // 查詢某個使用者的所有權限
    List<UserPermission> findByUserUuid(UUID userUuid);

    // 如果要檢查使用者是否已擁有某個權限
    boolean existsByUserUuidAndPermissionUuid(UUID userUuid, UUID permissionUuid);
}
