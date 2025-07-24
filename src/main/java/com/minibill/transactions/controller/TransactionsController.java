package com.minibill.transactions.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.minibill.security.PermissionRequired;
import com.minibill.transactions.dto.TransactionDTO;
import com.minibill.transactions.model.Transactions;
import com.minibill.transactions.service.TransactionsService;
import com.minibill.user.model.User;
import com.minibill.user.repository.UserRepository;

@RestController
@RequestMapping("/transactions")
public class TransactionsController {

    private final TransactionsService transactionsService;
    private final UserRepository userRepository;

    public TransactionsController(TransactionsService transactionsService, UserRepository userRepository) {
        this.transactionsService = transactionsService;
        this.userRepository = userRepository;
    }

    // === 建立交易 ===
    @PostMapping
    public ResponseEntity<Transactions> createTransaction(@RequestParam UUID catalogId,
                                                          @RequestParam double amount,
                                                          @RequestParam(required = false) UUID userId) {
        UUID targetUserId;
        
        if (userId != null) {
            // 管理員為其他使用者新增交易，需要最高權限
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if ((Integer) auth.getDetails() < 99) {
                return ResponseEntity.status(403).build();
            }
            targetUserId = userId;
        } else {
            // 一般使用者為自己新增交易
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String account = auth.getName();
            User user = userRepository.findByAccount(account)
                    .orElseThrow(() -> new RuntimeException("使用者不存在"));
            targetUserId = user.getUuid();
        }

        // 呼叫 Service
        return ResponseEntity.ok(transactionsService.createTransaction(targetUserId, catalogId, amount));
    }

    // === 刪除交易 (僅最高權限可用) ===
    @DeleteMapping("/{id}")
    @PermissionRequired(99)
    public ResponseEntity<String> deleteTransaction(@PathVariable UUID id) {
        transactionsService.deleteTransaction(id);
        return ResponseEntity.ok("交易紀錄已刪除");
    }

    // === 修改交易 ===
    @PutMapping("/{id}")
    public ResponseEntity<TransactionDTO> updateTransaction(@PathVariable UUID id,
                                                           @RequestParam(required = false) UUID catalogId,
                                                           @RequestParam(required = false) Double amount,
                                                           @RequestParam(required = false) Boolean isPaid) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        // 檢查權限：只有最高權限者可以修改交易
        boolean isAdmin = (Integer) auth.getDetails() >= 99;
        
        if (!isAdmin) {
            return ResponseEntity.status(403).build();
        }
        
        TransactionDTO updatedTransaction = transactionsService.updateTransaction(id, catalogId, amount, isPaid);
        return ResponseEntity.ok(updatedTransaction);
    }

    // === 查詢所有交易 (僅最高權限可用) ===
    @GetMapping
    @PermissionRequired(99)
    public ResponseEntity<List<TransactionDTO>> getAllTransactions() {
        return ResponseEntity.ok(transactionsService.getAllTransactions());
    }

    // === 查詢登入者自己的所有交易 ===
    @GetMapping("/my")
    public ResponseEntity<List<TransactionDTO>> getMyTransactions() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String account = auth.getName();
        User user = userRepository.findByAccount(account)
                .orElseThrow(() -> new RuntimeException("使用者不存在"));
        return ResponseEntity.ok(transactionsService.getTransactionsByUser(user.getUuid()));
    }

    // === 查詢單筆交易 ===
    @GetMapping("/{id}")
    public ResponseEntity<TransactionDTO> getTransactionById(@PathVariable UUID id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String account = auth.getName();
        User user = userRepository.findByAccount(account)
                .orElseThrow(() -> new RuntimeException("使用者不存在"));

        TransactionDTO transaction = transactionsService.getTransactionById(id);

        // 檢查是否為最高權限或自己的交易
        if (!transaction.getUserUuid().equals(user.getUuid()) && (Integer) auth.getDetails() < 99) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(transaction);
    }
}
