package com.minibill.transactions.controller;

import com.minibill.security.PermissionRequired;
import com.minibill.transactions.model.Transactions;
import com.minibill.transactions.service.TransactionsService;
import com.minibill.user.model.User;
import com.minibill.user.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

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
                                                          @RequestParam double amount) {
        // 從 SecurityContext 取得登入帳號
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String account = auth.getName();

        // 查詢 user
        User user = userRepository.findByAccount(account)
                .orElseThrow(() -> new RuntimeException("使用者不存在"));

        // 呼叫 Service
        return ResponseEntity.ok(transactionsService.createTransaction(user.getUuid(), catalogId, amount));
    }

    // === 刪除交易 (僅最高權限可用) ===
    @DeleteMapping("/{id}")
    @PermissionRequired(99)
    public ResponseEntity<String> deleteTransaction(@PathVariable UUID id) {
        transactionsService.deleteTransaction(id);
        return ResponseEntity.ok("交易紀錄已刪除");
    }

    // === 查詢所有交易 (僅最高權限可用) ===
    @GetMapping
    @PermissionRequired(99)
    public ResponseEntity<List<Transactions>> getAllTransactions() {
        return ResponseEntity.ok(transactionsService.getAllTransactions());
    }

    // === 查詢登入者自己的所有交易 ===
    @GetMapping("/my")
    public ResponseEntity<List<Transactions>> getMyTransactions() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String account = auth.getName();
        User user = userRepository.findByAccount(account)
                .orElseThrow(() -> new RuntimeException("使用者不存在"));
        return ResponseEntity.ok(transactionsService.getTransactionsByUser(user.getUuid()));
    }

    // === 查詢單筆交易 ===
    @GetMapping("/{id}")
    public ResponseEntity<Transactions> getTransactionById(@PathVariable UUID id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String account = auth.getName();
        User user = userRepository.findByAccount(account)
                .orElseThrow(() -> new RuntimeException("使用者不存在"));

        Transactions transaction = transactionsService.getTransactionById(id);

        // 檢查是否為最高權限或自己的交易
        if (!transaction.getUser().getUuid().equals(user.getUuid()) && (Integer) auth.getDetails() < 99) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(transaction);
    }
}
