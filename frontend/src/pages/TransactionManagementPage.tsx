import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Box, CircularProgress, Alert,
  Card, CardContent, CardHeader, TextField, Button,
  Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { Receipt, Add, Person, ShoppingCart } from '@mui/icons-material';
import { 
  apiGetAllUsers, 
  apiGetCatalog,
  apiCreateTransaction
} from '../services/api';

interface User {
  uuid: string;
  account: string;
  name: string;
  email: string;
  active: boolean;
}

interface Catalog {
  uuid: string;
  name: string;
  description: string;
  price: number;
  active: boolean;
}

const TransactionManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 新增交易相關狀態
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedCatalogId, setSelectedCatalogId] = useState<string>('');
  const [transactionAmount, setTransactionAmount] = useState<number>(1);
  const [transactionLoading, setTransactionLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 並行獲取使用者列表和產品目錄
      const [usersData, catalogData] = await Promise.all([
        apiGetAllUsers(),
        apiGetCatalog()
      ]);
      
      setUsers(usersData);
      setCatalogs(catalogData.filter((catalog: Catalog) => catalog.active)); // 只顯示啟用的產品
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 獲取選中產品的價格
  const getSelectedCatalogPrice = () => {
    const catalog = catalogs.find(c => c.uuid === selectedCatalogId);
    return catalog ? catalog.price : 0;
  };

  // 計算總金額
  const getTotalAmount = () => {
    return getSelectedCatalogPrice() * transactionAmount;
  };

  // 新增交易處理函數
  const handleCreateTransaction = async () => {
    if (!selectedUserId) {
      setError('請選擇使用者');
      return;
    }

    if (!selectedCatalogId) {
      setError('請選擇產品');
      return;
    }

    if (transactionAmount <= 0) {
      setError('交易數量必須大於 0');
      return;
    }

    setTransactionLoading(true);
    setError(null);
    try {
      // 使用產品價格乘以數量作為總金額
      const totalAmount = getTotalAmount();
      await apiCreateTransaction(selectedCatalogId, totalAmount, selectedUserId);
      
      setSuccess(`為 ${users.find(u => u.uuid === selectedUserId)?.name} 新增交易成功！總金額：$${totalAmount}`);
      
      // 重置表單
      setSelectedUserId('');
      setSelectedCatalogId('');
      setTransactionAmount(1);
      
      // 清除成功訊息
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      setError(err.message || '新增交易失敗');
    } finally {
      setTransactionLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Receipt sx={{ mr: 2, fontSize: 32 }} />
        <Typography variant="h4" component="h1">
          交易管理
        </Typography>
      </Box>

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

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* 新增交易表單 */}
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardHeader 
              title={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Add sx={{ mr: 1 }} />
                  新增交易
                </Box>
              }
            />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* 選擇使用者 */}
                <FormControl fullWidth>
                  <InputLabel>選擇使用者</InputLabel>
                  <Select
                    value={selectedUserId}
                    label="選擇使用者"
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    disabled={transactionLoading}
                  >
                    {users.map((user) => (
                      <MenuItem key={user.uuid} value={user.uuid}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Person sx={{ mr: 1, color: 'action.active' }} />
                          {user.name} ({user.account})
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* 選擇產品 */}
                <FormControl fullWidth>
                  <InputLabel>選擇產品</InputLabel>
                  <Select
                    value={selectedCatalogId}
                    label="選擇產品"
                    onChange={(e) => setSelectedCatalogId(e.target.value)}
                    disabled={transactionLoading}
                  >
                    {catalogs.map((catalog) => (
                      <MenuItem key={catalog.uuid} value={catalog.uuid}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ShoppingCart sx={{ mr: 1, color: 'action.active' }} />
                          {catalog.name} - ${catalog.price}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* 交易數量 */}
                <TextField
                  label="交易數量"
                  type="number"
                  value={transactionAmount}
                  onChange={(e) => setTransactionAmount(parseInt(e.target.value) || 1)}
                  inputProps={{ min: 1 }}
                  disabled={transactionLoading}
                  fullWidth
                />

                {/* 總金額顯示 */}
                {selectedCatalogId && (
                  <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      單價：${getSelectedCatalogPrice()}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      總金額：${getTotalAmount()}
                    </Typography>
                  </Box>
                )}

                {/* 新增按鈕 */}
                <Button 
                  variant="contained" 
                  size="large"
                  startIcon={transactionLoading ? <CircularProgress size={20} /> : <Add />}
                  onClick={handleCreateTransaction}
                  disabled={transactionLoading || !selectedUserId || !selectedCatalogId}
                  fullWidth
                >
                  {transactionLoading ? '新增中...' : '新增交易'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* 說明區塊 */}
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardHeader 
              title="操作說明"
            />
            <CardContent>
              <Typography variant="body1" paragraph>
                <strong>新增交易功能說明：</strong>
              </Typography>
              <Typography variant="body2" component="div">
                <ul>
                  <li>選擇要為哪位使用者新增交易記錄</li>
                  <li>選擇產品，價格會自動顯示</li>
                  <li>設定交易數量（必須大於 0）</li>
                  <li>總金額 = 產品單價 × 交易數量</li>
                  <li>只有管理員權限才能使用此功能</li>
                </ul>
              </Typography>
              
              <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                <Typography variant="body2" color="info.contrastText">
                  💡 提示：交易金額會根據所選產品的價格自動計算，無需手動輸入金額。
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default TransactionManagementPage;
