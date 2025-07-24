package com.minibill.transactions.model;
import com.minibill.user.model.User;
import com.minibill.catalog.model.Catalog;
import javax.persistence.Table;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;

import javax.persistence.*;
import java.time.LocalDate;
import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Table(name = "user_permission")
public class Transactions {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(updatable = false, nullable = false)
    private UUID uuid;

    @ManyToOne
    @JoinColumn(name = "user_uuid", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "catalog_uuid", nullable = false)
    private Catalog catalog;

    private double amount;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private Timestamp createdAt;

    private LocalDate dateline;

    @Column(name = "is_paid")
    private Boolean isPaid;

    @Transient
    private static int defaultDatelineDays = 7;

    // 預設 dateline
    @PrePersist
    public void prePersist() {
        if (dateline == null) {
            this.dateline = LocalDate.now().plusDays(defaultDatelineDays);
        }
    }

    // Getter / Setter
    public static void setDefaultDatelineDays(int days) {
        defaultDatelineDays = days;
    }

    public UUID getUuid() {
        return uuid;
    }
    public User getUser() {
        return user;
    }
    public Catalog getCatalog() {
        return catalog;
    }
    public double getAmount() {
        return amount;
    }
    public LocalDate getDateline() {
        return dateline;
    }
    public Timestamp getCreatedAt() {
        return createdAt;
    }
    public Boolean getIsPaid() {
        return isPaid;
    }
    public void setUser(User user) {
        this.user = user;
    }
    public void setCatalog(Catalog catalog) {
        this.catalog = catalog;
    }
    public void setAmount(double amount) {
        this.amount = amount;
    }
    public void setDateline(LocalDate dateline) {
        this.dateline = dateline;
    }
    public void setIsPaid(Boolean isPaid) {
        this.isPaid = isPaid;
    }

}

    


