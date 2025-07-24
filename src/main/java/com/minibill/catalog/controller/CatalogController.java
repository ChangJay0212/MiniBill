package com.minibill.catalog.controller;

import com.minibill.catalog.dto.*;
import com.minibill.catalog.model.Catalog;
import com.minibill.catalog.service.CatalogService;
import com.minibill.security.PermissionRequired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/catalog")
public class CatalogController {

    private final CatalogService catalogService;

    public CatalogController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    // === 新增商品 ===
    @PostMapping
    @PermissionRequired(99)
    public ResponseEntity<CatalogResponse> addItem(@RequestBody CatalogCreateRequest request) {
        Catalog item = new Catalog();
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setActive(request.getActive());
        Catalog saved = catalogService.addItem(item);
        return ResponseEntity.ok(toResponse(saved));
    }

    // === 查詢商品 ===
    @GetMapping
    public ResponseEntity<List<CatalogResponse>> getActiveItems() {
        List<Catalog> items = catalogService.getActiveItems();
        return ResponseEntity.ok(items.stream().map(this::toResponse).collect(Collectors.toList()));
    }

    // === 修改商品 ===
    @PutMapping("/{id}")
    @PermissionRequired(99)
    public ResponseEntity<CatalogResponse> updateItem(@PathVariable UUID id, @RequestBody CatalogUpdateRequest request) {
        Catalog updatedItem = catalogService.updateItemFields(id, request);
        return ResponseEntity.ok(toResponse(updatedItem));
    }

    // === 刪除商品 ===
    @DeleteMapping("/{id}")
    @PermissionRequired(99)
    public ResponseEntity<String> deactivateItem(@PathVariable UUID id) {
        catalogService.deactivateItem(id);
        return ResponseEntity.ok("商品已下架");
    }

    // 封裝轉換
    private CatalogResponse toResponse(Catalog catalog) {
        CatalogResponse res = new CatalogResponse();
        res.setUuid(catalog.getUuid());
        res.setName(catalog.getName());
        res.setDescription(catalog.getDescription());
        res.setPrice(catalog.getPrice());
        res.setActive(catalog.isActive());
        res.setCreatedAt(catalog.getCreatedAt());
        return res;
    }
}
