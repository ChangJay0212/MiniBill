package com.minibill.user.model;
import javax.persistence.Table;
import javax.persistence.Column;
import javax.persistence.Entity;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import javax.persistence.Id;
import javax.persistence.GeneratedValue;
import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Table(name = "permission")
public class Permission {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(updatable = false, nullable = false)
    private UUID uuid;

    private Integer level;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private Timestamp createdAt;

    public UUID getUuid() {
        return uuid;
    }
    public Integer getLevel() {
        return level;
    }
    public Timestamp getCreatedAt() {
        return createdAt;   
    }

}
