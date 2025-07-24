package com.minibill.transactions.dto;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.UUID;

public class TransactionDTO {
    private UUID uuid;
    private UUID userUuid;
    private String userName;
    private String userAccount;
    private UUID catalogUuid;
    private String catalogName;
    private String catalogDescription;
    private Double catalogPrice;
    private Double amount;
    private Timestamp createdAt;
    private LocalDate dateline;
    private Boolean isPaid;

    // Constructors
    public TransactionDTO() {}

    public TransactionDTO(UUID uuid, UUID userUuid, String userName, String userAccount,
                         UUID catalogUuid, String catalogName, String catalogDescription, 
                         Double catalogPrice, Double amount, Timestamp createdAt, 
                         LocalDate dateline, Boolean isPaid) {
        this.uuid = uuid;
        this.userUuid = userUuid;
        this.userName = userName;
        this.userAccount = userAccount;
        this.catalogUuid = catalogUuid;
        this.catalogName = catalogName;
        this.catalogDescription = catalogDescription;
        this.catalogPrice = catalogPrice;
        this.amount = amount;
        this.createdAt = createdAt;
        this.dateline = dateline;
        this.isPaid = isPaid;
    }

    // Getters and Setters
    public UUID getUuid() {
        return uuid;
    }

    public void setUuid(UUID uuid) {
        this.uuid = uuid;
    }

    public UUID getUserUuid() {
        return userUuid;
    }

    public void setUserUuid(UUID userUuid) {
        this.userUuid = userUuid;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserAccount() {
        return userAccount;
    }

    public void setUserAccount(String userAccount) {
        this.userAccount = userAccount;
    }

    public UUID getCatalogUuid() {
        return catalogUuid;
    }

    public void setCatalogUuid(UUID catalogUuid) {
        this.catalogUuid = catalogUuid;
    }

    public String getCatalogName() {
        return catalogName;
    }

    public void setCatalogName(String catalogName) {
        this.catalogName = catalogName;
    }

    public String getCatalogDescription() {
        return catalogDescription;
    }

    public void setCatalogDescription(String catalogDescription) {
        this.catalogDescription = catalogDescription;
    }

    public Double getCatalogPrice() {
        return catalogPrice;
    }

    public void setCatalogPrice(Double catalogPrice) {
        this.catalogPrice = catalogPrice;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDate getDateline() {
        return dateline;
    }

    public void setDateline(LocalDate dateline) {
        this.dateline = dateline;
    }

    public Boolean getIsPaid() {
        return isPaid;
    }

    public void setIsPaid(Boolean isPaid) {
        this.isPaid = isPaid;
    }
}
