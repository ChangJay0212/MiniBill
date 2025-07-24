package com.minibill.catalog.controller;

import com.minibill.catalog.model.Catalog;
import com.minibill.catalog.service.CatalogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/catalog")
public class CatalogController {

    private final CatalogService catalogService;

    public CatalogController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @PostMapping
    public ResponseEntity<Catalog> addItem(@RequestBody Catalog item) {
        return ResponseEntity.ok(catalogService.addItem(item));
    }

    @GetMapping
    public ResponseEntity<List<Catalog>> getActiveItems() {
        return ResponseEntity.ok(catalogService.getActiveItems());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Catalog> updateItem(@PathVariable UUID id, @RequestBody Catalog updated) {
        return ResponseEntity.ok(catalogService.updateItem(id, updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deactivateItem(@PathVariable UUID id) {
        catalogService.deactivateItem(id);
        return ResponseEntity.ok("商品已下架");
    }
}
