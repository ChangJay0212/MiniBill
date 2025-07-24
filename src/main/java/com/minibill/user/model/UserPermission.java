package com.minibill.user.model;
import com.minibill.catalog.model.Catalog;
import com.minibill.user.model.Permission;
import com.minibill.user.model.User;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.util.UUID;

@Entity
@Table(name = "user_permission")
public class UserPermission {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(updatable = false, nullable = false)
    private UUID uuid;

    @ManyToOne
    @JoinColumn(name = "user_uuid", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "permission_uuid", nullable = false)
    private Permission permission;

    public User getUser() {
        return user;
    }
    public Permission getPermission() {
        return permission;  
    }
    public void setUser(User user) {
        this.user = user;
    }
    public void setPermission(Permission permission) {
        this.permission = permission;
    }

}

    


