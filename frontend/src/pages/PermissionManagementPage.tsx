import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Box, CircularProgress, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Select, MenuItem, FormControl, InputLabel, Chip
} from '@mui/material';
import { Security, Person } from '@mui/icons-material';
import { 
  apiGetAllUsers, 
  apiGetAllPermissions, 
  apiGetAllUsersWithPermissions,
  apiAssignUserPermission, 
  apiUpdateUserPermission,
  apiRemoveUserPermission
} from '../services/api';

interface User {
  uuid: string;
  account: string;
  name: string;
  email: string;
  active: boolean;
}

interface Permission {
  uuid: string;
  permissionLevel: number;
}

interface UserPermission {
  userUuid: string;
  account: string;
  name: string;
  email: string;
  permissionLevel: number | null;
  permissionId: string | null;
}

const PermissionManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 獲取權限列表
      const permissionsData = await apiGetAllPermissions();
      setPermissions(permissionsData);
      
      // 獲取所有使用者及其權限資訊
      try {
        const userPermissionsData = await apiGetAllUsersWithPermissions();
        setUserPermissions(userPermissionsData);
        
        // 從 userPermissions 中提取 users 資訊
        const usersFromPermissions = userPermissionsData.map((up: UserPermission) => ({
          uuid: up.userUuid,
          account: up.account,
          name: up.name,
          email: up.email,
          active: true // 假設都是啟用狀態
        }));
        setUsers(usersFromPermissions);
      } catch (err) {
        console.error('Failed to fetch user permissions:', err);
        // 如果權限 API 失敗，嘗試只獲取用戶列表
        const usersData = await apiGetAllUsers();
        setUsers(usersData);
        
        // 建立空的權限對應
        const emptyPermissions = usersData.map((user: User) => ({
          userUuid: user.uuid,
          account: user.account,
          name: user.name,
          email: user.email,
          permissionLevel: null,
          permissionId: null
        }));
        setUserPermissions(emptyPermissions);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePermissionChange = async (userId: string, permissionId: string) => {
    try {
      const currentUserPermission = userPermissions.find(up => up.userUuid === userId);
      
      if (!permissionId) {
        // 移除權限
        if (currentUserPermission?.permissionId) {
          await apiRemoveUserPermission(userId);
          setSuccess('權限已成功移除');
        }
      } else {
        // 設定或更新權限
        if (currentUserPermission?.permissionId) {
          // 更新現有權限
          await apiUpdateUserPermission(userId, permissionId);
          setSuccess('權限已成功更新');
        } else {
          // 新增權限
          await apiAssignUserPermission(userId, permissionId);
          setSuccess('權限已成功賦予');
        }
      }
      
      // 重新獲取資料
      await fetchData();
      
      // 清除成功訊息
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update permission.');
    }
  };

  const getUserPermissionLevel = (userId: string): number | null => {
    const userPermission = userPermissions.find(up => up.userUuid === userId);
    return userPermission?.permissionLevel || null;
  };

  const getUserPermissionId = (userId: string): string | null => {
    const userPermission = userPermissions.find(up => up.userUuid === userId);
    return userPermission?.permissionId || null;
  };

  const getPermissionLevelColor = (level: number | null) => {
    if (level === null) return 'default';
    if (level >= 99) return 'error';
    if (level >= 50) return 'warning';
    return 'info';
  };

  const getPermissionLevelText = (level: number | null) => {
    if (level === null) return '無權限';
    if (level >= 99) return '超級管理員';
    if (level >= 50) return '管理員';
    return `一般用戶 (${level})`;
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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Security sx={{ mr: 2, fontSize: 32 }} />
        <Typography variant="h4" component="h1">
          權限管理
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

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Person sx={{ mr: 1 }} />
                  使用者
                </Box>
              </TableCell>
              <TableCell>帳號</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="center">目前權限</TableCell>
              <TableCell align="center">設定權限</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => {
              const currentPermissionLevel = getUserPermissionLevel(user.uuid);
              const currentPermissionId = getUserPermissionId(user.uuid);
              
              return (
                <TableRow key={user.uuid} hover>
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
                      {user.name}
                    </Typography>
                  </TableCell>
                  <TableCell>{user.account}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={getPermissionLevelText(currentPermissionLevel)}
                      color={getPermissionLevelColor(currentPermissionLevel)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                      <InputLabel>選擇權限</InputLabel>
                      <Select
                        value={currentPermissionId || ''}
                        label="選擇權限"
                        onChange={(e) => handlePermissionChange(user.uuid, e.target.value as string)}
                      >
                        <MenuItem value="">
                          <em>移除權限</em>
                        </MenuItem>
                        {permissions.map((permission) => (
                          <MenuItem key={permission.uuid} value={permission.uuid}>
                            權限等級 {permission.permissionLevel}
                            {permission.permissionLevel >= 99 && ' (超級管理員)'}
                            {permission.permissionLevel >= 50 && permission.permissionLevel < 99 && ' (管理員)'}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {users.length === 0 && !loading && !error && (
        <Typography variant="h6" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
          目前沒有使用者
        </Typography>
      )}
    </Container>
  );
};

export default PermissionManagementPage;
