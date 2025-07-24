package com.minibill.transactions.repository;

import com.minibill.transactions.model.Transactions;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface TransactionsRepository extends JpaRepository<Transactions, UUID> {
}
