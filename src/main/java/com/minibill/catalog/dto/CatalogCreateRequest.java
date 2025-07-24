package com.minibill.catalog.dto;

public class CatalogCreateRequest {
    private String name;
    private String description;
    private double price;
    private Boolean active;

    // Getter / Setter
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}
