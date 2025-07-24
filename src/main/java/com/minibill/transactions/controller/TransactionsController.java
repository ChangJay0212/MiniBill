package com.minibill.transactions.controller;

import com.minibill.transactions.model.Transactions;
import com.minibill.transactions.service.TransactionsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/transactions")
public class TransactionsController {

    private final TransactionsService transactionsService;

    public TransactionsController(TransactionsService transactionsService) {
        this.transactionsService = transactionsService;
    }

    @PostMapping
    public ResponseEntity<Transactions> createTransaction(@RequestParam UUID userId,
                                                          @RequestParam UUID catalogId,
                                                          @RequestParam double amount) {
        return ResponseEntity.ok(transactionsService.createTransaction(userId, catalogId, amount));
    }
}
