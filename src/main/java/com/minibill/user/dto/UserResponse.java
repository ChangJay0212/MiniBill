package com.minibill.user.dto;

import java.sql.Timestamp;
import java.util.UUID;

public class UserResponse {
    private UUID uuid;
    private String account;
    private String name;
    private String email;
    private Boolean active;
    private Timestamp createdAt;
    private Timestamp lastLoginAt;

    // Getter / Setter
    public UUID getUuid() { return uuid; }
    public void setUuid(UUID uuid) { this.uuid = uuid; }

    public String getAccount() { return account; }
    public void setAccount(String account) { this.account = account; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public Timestamp getLastLoginAt() { return lastLoginAt; }
    public void setLastLoginAt(Timestamp lastLoginAt) { this.lastLoginAt = lastLoginAt; }
}
