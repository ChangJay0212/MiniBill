package com.minibill.catalog.service;

import com.minibill.catalog.dto.CatalogUpdateRequest;
import com.minibill.catalog.model.Catalog;
import com.minibill.catalog.repository.CatalogRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CatalogService {

    private final CatalogRepository catalogRepository;
    
    public CatalogService(CatalogRepository catalogRepository) {
        this.catalogRepository = catalogRepository;
    }

    public Catalog updateItemFields(UUID id, CatalogUpdateRequest request) {
        Catalog existing = catalogRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("商品不存在"));

        if (request.getName() != null) {
            existing.setName(request.getName());
        }
        if (request.getDescription() != null) {
            existing.setDescription(request.getDescription());
        }
        if (request.getPrice() > 0) {  // 價格必須大於 0 才更新
            existing.setPrice(request.getPrice());
        }
        if (request.getActive() != null) {
            existing.setActive(request.getActive());
        }

        return catalogRepository.save(existing);
    }

    public Catalog addItem(Catalog item) {
        return catalogRepository.save(item);
    }

    public List<Catalog> getActiveItems() {
        return catalogRepository.findByActiveTrue();
    }

    public Catalog updateItem(UUID id, Catalog updated) {
        return catalogRepository.findById(id).map(item -> {
            item.setName(updated.getName());
            item.setDescription(updated.getDescription());
            item.setPrice(updated.getPrice());
            return catalogRepository.save(item);
        }).orElseThrow(() -> new RuntimeException("找不到商品"));
    }

    public void deactivateItem(UUID id) {
        catalogRepository.findById(id).ifPresent(item -> {
            item.setActive(false);
            catalogRepository.save(item);
        });
    }
}
