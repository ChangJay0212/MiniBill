
import React, { useEffect, useState } from 'react';
import { 
  Container, Typography, Box, CircularProgress, Alert, Grid, Card, CardContent, CardMedia,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Switch, FormControlLabel,
  IconButton, Chip
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { apiGetCatalog, apiCreateCatalog, apiUpdateCatalog, apiDeleteCatalog } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface CatalogItem {
  uuid: string;
  name: string;
  description: string;
  price: number;
  active: boolean;
  createdAt: string;
}

interface CatalogFormData {
  name: string;
  description: string;
  price: number;
  active: boolean;
}

const CatalogPage: React.FC = () => {
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [formData, setFormData] = useState<CatalogFormData>({
    name: '',
    description: '',
    price: 0,
    active: true
  });
  
  const { permissionLevel } = useAuth();
  const isAdmin = permissionLevel >= 99;

  useEffect(() => {
    fetchCatalog();
  }, []);

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const data = await apiGetCatalog();
      setCatalog(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch catalog.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (item?: CatalogItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price,
        active: item.active
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        active: true
      });
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      active: true
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingItem) {
        await apiUpdateCatalog(editingItem.uuid, formData);
      } else {
        await apiCreateCatalog(formData);
      }
      await fetchCatalog();
      handleCloseDialog();
    } catch (err: any) {
      setError(err.message || 'Failed to save catalog item.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await apiDeleteCatalog(id);
        await fetchCatalog();
      } catch (err: any) {
        setError(err.message || 'Failed to delete catalog item.');
      }
    }
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          商品目錄
        </Typography>
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            新增商品
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {catalog.map((item) => (
          <Grid key={item.uuid} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="140"
                image="https://via.placeholder.com/300x140"
                alt={item.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography gutterBottom variant="h5" component="div">
                    {item.name}
                  </Typography>
                  <Chip 
                    label={item.active ? '上架中' : '已下架'} 
                    color={item.active ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {item.description}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                  NT$ {item.price.toFixed(0)}
                </Typography>
                
                {isAdmin && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleOpenDialog(item)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDelete(item.uuid)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {catalog.length === 0 && !loading && !error && (
        <Typography variant="h6" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
          目前沒有商品
        </Typography>
      )}

      {/* 新增/編輯對話框 */}
      <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingItem ? '編輯商品' : '新增商品'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="商品名稱"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="商品描述"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="價格"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              />
            }
            label="是否上架"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>取消</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingItem ? '更新' : '新增'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CatalogPage;
