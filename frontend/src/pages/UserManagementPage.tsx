
import React, { useEffect, useState } from 'react';
import { 
  Container, Typography, Box, CircularProgress, Alert, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Switch, FormControlLabel, Snackbar
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { apiGetAllUsers, apiUpdateUser, apiDeleteUser } from '../services/api';

interface UserItem {
  uuid: string;
  account: string;
  name: string;
  email: string;
  active: boolean;
  createdAt: string;
}

interface UserFormData {
  name: string;
  email: string;
  password?: string;
}

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await apiGetAllUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (user: UserItem) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: ''
    });
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: ''
    });
  };

  const handleSubmit = async () => {
    if (!editingUser) return;
    
    try {
      const updateData: any = {
        name: formData.name,
        email: formData.email
      };
      
      // 只有當密碼不為空時才更新密碼
      if (formData.password && formData.password.trim()) {
        updateData.password = formData.password;
      }
      
      await apiUpdateUser(editingUser.uuid, updateData);
      await fetchUsers();
      handleCloseDialog();
      setSuccess('使用者資訊已成功更新');
      // 清除成功訊息
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update user.');
    }
  };

  const handleDelete = async (id: string, account: string) => {
    if (window.confirm(`確定要刪除使用者 "${account}" 嗎？`)) {
      try {
        const response = await apiDeleteUser(id);
        await fetchUsers();
        setSuccess(response?.message || '使用者已成功刪除');
        // 清除成功訊息
        setTimeout(() => setSuccess(null), 3000);
      } catch (err: any) {
        setError(err.message || 'Failed to delete user.');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
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
        使用者管理
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
      
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>帳號</TableCell>
              <TableCell>姓名</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="center">狀態</TableCell>
              <TableCell>註冊時間</TableCell>
              <TableCell align="center">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.uuid} hover>
                <TableCell>
                  <Typography variant="body1" fontWeight="medium">
                    {user.account}
                  </Typography>
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell align="center">
                  <Chip 
                    label={user.active ? '啟用' : '停用'} 
                    color={user.active ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell align="center">
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={() => handleOpenDialog(user)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="error"
                    onClick={() => handleDelete(user.uuid, user.account)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {users.length === 0 && !loading && !error && (
        <Typography variant="h6" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
          目前沒有使用者
        </Typography>
      )}

      {/* 編輯對話框 */}
      <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>編輯使用者</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="姓名"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="新密碼 (留空表示不更改)"
            type="password"
            fullWidth
            variant="outlined"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>取消</Button>
          <Button onClick={handleSubmit} variant="contained">更新</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagementPage;
