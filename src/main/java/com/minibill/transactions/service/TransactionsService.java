package com.minibill.transactions.service;

import com.minibill.transactions.model.Transactions;
import com.minibill.transactions.repository.TransactionsRepository;
import com.minibill.user.repository.UserRepository;
import com.minibill.user.model.User;
import com.minibill.catalog.model.Catalog;
import com.minibill.catalog.repository.CatalogRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.UUID;
import java.util.List;

@Service
public class TransactionsService {

    private final TransactionsRepository transactionsRepository;
    private final UserRepository userRepository;
    private final CatalogRepository catalogRepository;

    public TransactionsService(TransactionsRepository transactionsRepository,
                               UserRepository userRepository,
                               CatalogRepository catalogRepository) {
        this.transactionsRepository = transactionsRepository;
        this.userRepository = userRepository;
        this.catalogRepository = catalogRepository;
    }

    @Transactional
    public Transactions createTransaction(UUID userId, UUID catalogId, double amount) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("找不到使用者"));

        Catalog catalog = catalogRepository.findById(catalogId)
                .orElseThrow(() -> new RuntimeException("找不到商品"));

        Transactions transaction = new Transactions();
        transaction.setUser(user);
        transaction.setCatalog(catalog);
        transaction.setAmount(amount);
        transaction.setIsPaid(false); // 預設未付款
        return transactionsRepository.save(transaction);
    }
    // === 刪除交易 ===
    public void deleteTransaction(UUID id) {
        if (!transactionsRepository.existsById(id)) {
            throw new RuntimeException("交易紀錄不存在");
        }
        transactionsRepository.deleteById(id);
    }
    public List<Transactions> getAllTransactions() {
        return transactionsRepository.findAll();
    }

    public List<Transactions> getTransactionsByUser(UUID userId) {
        return transactionsRepository.findByUserUuid(userId);
    }

    public Transactions getTransactionById(UUID id) {
        return transactionsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("交易紀錄不存在"));
    }
}
