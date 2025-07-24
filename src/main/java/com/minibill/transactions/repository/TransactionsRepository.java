package com.minibill.transactions.repository;

import com.minibill.transactions.model.Transactions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;
import java.util.List;
public interface TransactionsRepository extends JpaRepository<Transactions, UUID> {
   
    @Query("SELECT t FROM Transactions t WHERE t.user.uuid = :userUuid")
    List<Transactions> findByUserUuid(@Param("userUuid") UUID userUuid);

}
