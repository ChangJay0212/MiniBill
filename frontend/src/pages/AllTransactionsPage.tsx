
import React, { useEffect, useState } from 'react';
import { 
  Container, Typography, Box, CircularProgress, Alert, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Chip, IconButton, Dialog, DialogTitle, DialogContent, 
  DialogActions, Button, DialogContentText, Switch, FormControlLabel
} from '@mui/material';
import { 
  Delete, Receipt, Person, ShoppingCart, MonetizationOn, 
  AttachMoney, DateRange, AccessTime, Payment, DeleteOutline, Edit 
} from '@mui/icons-material';
import { apiGetAllTransactions, apiDeleteTransaction, apiUpdateTransaction } from '../services/api';

interface TransactionItem {
  uuid: string;
  userUuid: string;
  userName: string;
  userAccount: string;
  catalogUuid: string;
  catalogName: string;
  catalogDescription: string;
  catalogPrice: number;
  amount: number;
  createdAt: string;
  dateline: string;
  isPaid: boolean;
}

const AllTransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [editingTransaction, setEditingTransaction] = useState<TransactionItem | null>(null);
  const [editIsPaid, setEditIsPaid] = useState<boolean>(false);

  const fetchTransactions = async () => {
    try {
      const data = await apiGetAllTransactions();
      setTransactions(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch all transactions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDeleteClick = (transactionId: string) => {
    setTransactionToDelete(transactionId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!transactionToDelete) return;
    
    try {
      await apiDeleteTransaction(transactionToDelete);
      setSuccess('交易記錄已刪除');
      await fetchTransactions(); // 重新獲取數據
      
      // 清除成功訊息
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || '刪除失敗');
    } finally {
      setDeleteDialogOpen(false);
      setTransactionToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setTransactionToDelete(null);
  };

  const handleEditClick = (transaction: TransactionItem) => {
    setEditingTransaction(transaction);
    setEditIsPaid(transaction.isPaid);
    setEditDialogOpen(true);
  };

  const handleEditConfirm = async () => {
    if (!editingTransaction) return;
    
    try {
      await apiUpdateTransaction(editingTransaction.uuid, {
        isPaid: editIsPaid
      });
      setSuccess('交易記錄已更新');
      await fetchTransactions(); // 重新獲取數據
      
      // 清除成功訊息
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || '更新失敗');
    } finally {
      setEditDialogOpen(false);
      setEditingTransaction(null);
    }
  };

  const handleEditCancel = () => {
    setEditDialogOpen(false);
    setEditingTransaction(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
    );
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        所有交易記錄
      </Typography>

      {/* 成功提示 */}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* 錯誤提示 */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {transactions.length === 0 ? (
        <Typography variant="h6" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
          目前沒有交易記錄
        </Typography>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table sx={{ minWidth: 1270 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '120px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Receipt color="primary" />
                    <Typography variant="subtitle2" fontWeight="bold">交易編號</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ width: '160px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person color="primary" />
                    <Typography variant="subtitle2" fontWeight="bold">使用者</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ width: '280px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ShoppingCart color="primary" />
                    <Typography variant="subtitle2" fontWeight="bold">商品名稱</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ width: '120px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MonetizationOn color="secondary" />
                    <Typography variant="subtitle2" fontWeight="bold">商品價格</Typography>
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ width: '150px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                    <AttachMoney color="success" />
                    <Typography variant="subtitle2" fontWeight="bold">交易總額</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ width: '120px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DateRange color="info" />
                    <Typography variant="subtitle2" fontWeight="bold">到期日</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ width: '140px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTime color="info" />
                    <Typography variant="subtitle2" fontWeight="bold">交易時間</Typography>
                  </Box>
                </TableCell>
                <TableCell align="center" sx={{ width: '100px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <Payment color="warning" />
                    <Typography variant="subtitle2" fontWeight="bold">付款狀態</Typography>
                  </Box>
                </TableCell>
                <TableCell align="center" sx={{ width: '80px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <Edit color="info" />
                    <Typography variant="subtitle2" fontWeight="bold">操作</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.uuid} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {transaction.uuid.substring(0, 8)}...
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
                      {transaction.userName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {transaction.userAccount}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
                      {transaction.catalogName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {transaction.catalogDescription}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      NT$ {transaction.catalogPrice.toFixed(0)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography 
                      variant="h6" 
                      color={transaction.amount === transaction.catalogPrice ? "success" : "primary"}
                      fontWeight="bold"
                    >
                      NT$ {transaction.amount.toFixed(0)}
                    </Typography>
                    {transaction.amount !== transaction.catalogPrice && (
                      <Typography variant="caption" color="text.secondary">
                        {transaction.amount > transaction.catalogPrice ? "含額外費用" : "有折扣"}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(transaction.dateline).toLocaleDateString('zh-TW')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {formatDate(transaction.createdAt)}
                  </TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={transaction.isPaid ? "已付款" : "未付款"} 
                      color={transaction.isPaid ? "success" : "warning"} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton 
                        color="info" 
                        onClick={() => handleEditClick(transaction)}
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleDeleteClick(transaction.uuid)}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* 編輯對話框 */}
      <Dialog open={editDialogOpen} onClose={handleEditCancel}>
        <DialogTitle>編輯交易記錄</DialogTitle>
        <DialogContent>
          {editingTransaction && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="body1" gutterBottom>
                交易編號：{editingTransaction.uuid.substring(0, 8)}...
              </Typography>
              <Typography variant="body1" gutterBottom>
                使用者：{editingTransaction.userName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                商品：{editingTransaction.catalogName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                金額：NT$ {editingTransaction.amount.toFixed(0)}
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={editIsPaid}
                    onChange={(e) => setEditIsPaid(e.target.checked)}
                    color="success"
                  />
                }
                label="已付款"
                sx={{ mt: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditCancel}>取消</Button>
          <Button onClick={handleEditConfirm} variant="contained" color="primary">
            確認更新
          </Button>
        </DialogActions>
      </Dialog>

      {/* 刪除確認對話框 */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>確認刪除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            您確定要刪除這筆交易記錄嗎？此操作無法復原。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>取消</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            刪除
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AllTransactionsPage;
