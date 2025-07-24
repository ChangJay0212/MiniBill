
import React, { useEffect, useState } from 'react';
import { 
  Container, Typography, Box, CircularProgress, Alert, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Chip
} from '@mui/material';
import { 
  Receipt, ShoppingCart, MonetizationOn, AttachMoney, 
  DateRange, AccessTime, Payment 
} from '@mui/icons-material';
import { apiGetMyTransactions } from '../services/api';

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

const MyTransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await apiGetMyTransactions();
        setTransactions(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch transactions.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

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
        我的交易記錄
      </Typography>

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
          <Table sx={{ minWidth: 1030 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '120px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Receipt color="primary" />
                    <Typography variant="subtitle2" fontWeight="bold">交易編號</Typography>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default MyTransactionsPage;
