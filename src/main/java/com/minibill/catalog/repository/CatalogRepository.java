package com.minibill.catalog.repository;

import com.minibill.catalog.model.Catalog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.List;
import java.util.Optional;

public interface CatalogRepository extends JpaRepository<Catalog, UUID> {
    List<Catalog> findByActiveTrue();
    Optional<Catalog> findByName(String name);
}
