package com.minibill.user.dto;

import java.util.UUID;

public class UserPermissionDTO {
    private UUID userUuid;
    private String account;
    private String name;
    private String email;
    private Integer permissionLevel;
    private UUID permissionId;

    // Constructors
    public UserPermissionDTO() {}

    public UserPermissionDTO(UUID userUuid, String account, String name, String email, 
                           Integer permissionLevel, UUID permissionId) {
        this.userUuid = userUuid;
        this.account = account;
        this.name = name;
        this.email = email;
        this.permissionLevel = permissionLevel;
        this.permissionId = permissionId;
    }

    // Getters and Setters
    public UUID getUserUuid() {
        return userUuid;
    }

    public void setUserUuid(UUID userUuid) {
        this.userUuid = userUuid;
    }

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getPermissionLevel() {
        return permissionLevel;
    }

    public void setPermissionLevel(Integer permissionLevel) {
        this.permissionLevel = permissionLevel;
    }

    public UUID getPermissionId() {
        return permissionId;
    }

    public void setPermissionId(UUID permissionId) {
        this.permissionId = permissionId;
    }
}
