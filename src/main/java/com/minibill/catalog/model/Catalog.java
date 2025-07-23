package com.minibill.catalog.model;


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
@Table(name = "catalog")
public class Catalog { 
    
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(updatable = false, nullable = false)
    private UUID uuid;

   
    @Column(nullable = false, unique = false)
    private String name;

     private String description;
     

    @Column(nullable = false, unique = false)
    private double price;


    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private Timestamp createdAt;

    @Column(name = "is_active")
    private Boolean active;

    public UUID getUuid() {
        return uuid;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public double getPrice() {
        return price;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }
    
    public Boolean isActive() {
        return active;
    }   
    public void setName(String name) {
        this.name = name;
    }

    public void setPrice(double price) {
        this.price = price;
    }
    public void setDescription(String description) {
        this.description = description;
    }


    public void setActive(Boolean active) { this.active = active; }

}
