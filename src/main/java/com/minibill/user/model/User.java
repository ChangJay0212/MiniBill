package com.minibill.user.model;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Id;
import javax.persistence.GeneratedValue;
import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User { 
    
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(updatable = false, nullable = false)
    private UUID uuid;

    @Column(nullable = false, unique = true)
    private String account;

    private String name;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false, unique = true)
    private String email;


    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private Timestamp createdAt;

    @Column(name = "last_login_at")
    private Timestamp lastLoginAt;

    @Column(name = "is_active")
    private Boolean active;

    public UUID getUuid() {
        return uuid;
    }
    public String getAccount() {
        return account; 
    }
    public String getName() {
        return name;
    }
    public String getEmail() {
        return email;
    }
    public String getPasswordHash() {
        return passwordHash;
    }
    public Timestamp getCreatedAt() {
        return createdAt;
    }
    public Timestamp lastLoginAt() {
        return lastLoginAt;
    }
    public Boolean isActive() {
        return active;
    }   
    public void setAccount(String account) {
        this.account = account;
    }

    public void setName(String name) {
        this.name = name;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public void setPassword(String passwordHash) {
        this.passwordHash = passwordHash;
    }
    public void setActive(Boolean active) { this.active = active; }

}
