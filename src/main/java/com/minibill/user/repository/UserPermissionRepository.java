package com.minibill.user.repository;

import com.minibill.user.model.User;
import com.minibill.user.model.UserPermission;
import com.minibill.user.model.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserPermissionRepository extends JpaRepository<UserPermission, UUID> {

    // 查詢某個使用者的所有權限
    List<UserPermission> findByUserUuid(UUID userUuid);

    // 查詢某個使用者是否有權限記錄
    Optional<UserPermission> findByUser(User user);

    @Query("SELECT up FROM UserPermission up WHERE up.user.uuid = :userUuid")
    List<UserPermission> findPermissionLevelByUserUuid(@Param("userUuid") UUID userUuid);
    @Query("SELECT p.permissionLevel " +
        "FROM UserPermission up JOIN up.permission p " +
        "WHERE up.user = :user")
    Integer findPermissionLevelByUser(@Param("user") User user);
    // 如果要檢查使用者是否已擁有某個權限
    boolean existsByUserUuidAndPermissionUuid(UUID userUuid, UUID permissionUuid);
    void deleteByUser(User user);
    boolean existsByUserAndPermission(User user, Permission permission);
}
