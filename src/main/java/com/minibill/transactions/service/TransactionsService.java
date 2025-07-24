package com.minibill.transactions.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.minibill.catalog.model.Catalog;
import com.minibill.catalog.repository.CatalogRepository;
import com.minibill.transactions.dto.TransactionDTO;
import com.minibill.transactions.model.Transactions;
import com.minibill.transactions.repository.TransactionsRepository;
import com.minibill.user.model.User;
import com.minibill.user.repository.UserRepository;

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

    // === 修改交易 ===
    @Transactional
    public TransactionDTO updateTransaction(UUID id, UUID catalogId, Double amount, Boolean isPaid) {
        Transactions transaction = transactionsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("交易紀錄不存在"));
        
        // 更新商品資訊（如果提供）
        if (catalogId != null) {
            Catalog catalog = catalogRepository.findById(catalogId)
                    .orElseThrow(() -> new RuntimeException("找不到商品"));
            transaction.setCatalog(catalog);
        }
        
        // 更新金額（如果提供）
        if (amount != null) {
            transaction.setAmount(amount);
        }
        
        // 更新付款狀態（如果提供）
        if (isPaid != null) {
            transaction.setIsPaid(isPaid);
        }
        
        Transactions updatedTransaction = transactionsRepository.save(transaction);
        return convertToDTO(updatedTransaction);
    }
    
    // === 轉換為 DTO ===
    private TransactionDTO convertToDTO(Transactions transaction) {
        return new TransactionDTO(
            transaction.getUuid(),
            transaction.getUser().getUuid(),
            transaction.getUser().getName(),
            transaction.getUser().getAccount(),
            transaction.getCatalog().getUuid(),
            transaction.getCatalog().getName(),
            transaction.getCatalog().getDescription(),
            transaction.getCatalog().getPrice(),
            transaction.getAmount(),
            transaction.getCreatedAt(),
            transaction.getDateline(),
            transaction.getIsPaid()
        );
    }
    
    public List<TransactionDTO> getAllTransactions() {
        return transactionsRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TransactionDTO> getTransactionsByUser(UUID userId) {
        return transactionsRepository.findByUserUuid(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public TransactionDTO getTransactionById(UUID id) {
        Transactions transaction = transactionsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("交易紀錄不存在"));
        return convertToDTO(transaction);
    }
}
