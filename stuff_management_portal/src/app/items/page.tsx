'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  TextField, 
  Button, 
  Alert, 
  Typography, 
  Box,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Add as AddIcon, 
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  AddPhotoAlternate as AddPhotoIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

import { itemService, Item, categoryService, Category } from '../../services';
import AddItemModal from '../../components/modals/AddItemModal';
import ImagePreviewModal from '../../components/modals/ImagePreviewModal';
import { useI18n } from '../../components/i18n/I18nProvider';

interface EditableItem extends Item {
  isEditing?: boolean;
  editData?: Partial<Item>;
  images?: string[];
}

export default function ItemsPage() {
  const { t } = useI18n();
  const [items, setItems] = useState<EditableItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<EditableItem | null>(null);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [previewInitialIndex, setPreviewInitialIndex] = useState(0);
  const [previewTitle, setPreviewTitle] = useState('');

  // 获取物品列表
  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await itemService.getItems();
      // 为每个物品添加图片数组（支持多张图片，逗号分隔）
      const itemsWithImages = data.map(item => ({
        ...item,
        images: item.imageUrl ? item.imageUrl.split(',').filter(url => url.trim()) : []
      }));
      setItems(itemsWithImages);
      setError(null);
    } catch (err) {
      setError(t('error_fetch_items'));
      console.error('error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  // 获取分类列表
  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('error fetching categories:', err);
    }
  };

  // 搜索物品
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchItems();
      return;
    }

    try {
      setLoading(true);
      const data = await itemService.getItems(undefined, undefined, searchQuery);
      const itemsWithImages = data.map(item => ({
        ...item,
        images: item.imageUrl ? item.imageUrl.split(',').filter(url => url.trim()) : []
      }));
      setItems(itemsWithImages);
      setError(null);
    } catch (err) {
      setError(t('error_search'));
      console.error('search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // 删除物品
  const handleDeleteItem = async (id: number) => {
    if (!confirm(t('confirm_delete_item'))) {
      return;
    }

    try {
      await itemService.deleteItem(id);
      setItems(items.filter(item => item.itemId !== id));
      setError(null);
    } catch (err) {
      setError(t('delete_failed'));
      console.error('delete item failed:', err);
    }
  };

  // 获取分类名称
  const getCategoryName = (categoryId?: number) => {
    if (!categoryId) return t('uncategorized');
    const category = categories.find(cat => cat.categoryId === categoryId);
    return category?.name || t('uncategorized');
  };

  // 处理添加物品成功
  const handleAddItemSuccess = (newItem: Item) => {
    const itemWithImages = {
      ...newItem,
      images: newItem.imageUrl ? newItem.imageUrl.split(',').filter(url => url.trim()) : []
    };
    setItems([itemWithImages, ...items]);
    setError(null);
  };

  // 打开添加物品弹窗
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  // 关闭添加物品弹窗
  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  // 开始编辑
  const startEditing = (item: EditableItem) => {
    setItems(prev => prev.map(i => 
      i.itemId === item.itemId 
        ? { 
            ...i, 
            isEditing: true, 
            editData: { 
              ...i,
              imageUrl: i.imageUrl || '' // 确保imageUrl有值
            } 
          }
        : { ...i, isEditing: false }
    ));
  };

  // 取消编辑
  const cancelEditing = (item: EditableItem) => {
    setItems(prev => prev.map(i => 
      i.itemId === item.itemId 
        ? { ...i, isEditing: false, editData: undefined }
        : i
    ));
  };

  // 保存编辑
  const saveEditing = async (item: EditableItem) => {
    if (!item.editData) return;

    try {
      await itemService.updateItem(item.itemId!, item.editData);
      await fetchItems(); // 保存后重新拉取数据
      setError(null);
    } catch (err) {
      setError(t('update_failed'));
      console.error('update item failed:', err);
    }
  };

  // 处理编辑数据变化
  const handleEditChange = (itemId: number, field: keyof Item, value: any) => {
    setItems(prev => prev.map(item => 
      item.itemId === itemId && item.editData
        ? { ...item, editData: { ...item.editData, [field]: value } }
        : item
    ));
  };

  // 打开图片管理对话框
  const openImageDialog = (item: EditableItem) => {
    setSelectedItem(item);
    setImageDialogOpen(true);
  };

  // 打开图片预览对话框
  const openImagePreview = (images: string[], initialIndex: number = 0, title: string = '图片预览') => {
    setPreviewImages(images);
    setPreviewInitialIndex(initialIndex);
    setPreviewTitle(title);
    setImagePreviewOpen(true);
  };

  // 关闭图片预览对话框
  const closeImagePreview = () => {
    setImagePreviewOpen(false);
  };

  // 关闭图片管理对话框
  const closeImageDialog = () => {
    setImageDialogOpen(false);
    setSelectedItem(null);
  };

  // 上传图片并添加
  const addImage = async (file: File) => {
    if (!selectedItem) return;
    const currentImages = selectedItem.images || [];
    if (currentImages.length >= 10) {
      alert(t('max_images_limit') || '最多只能添加10张图片');
      return;
    }
    try {
      // 使用 itemService.uploadImage，后端接口为 /Item/upload-image
      const result = await itemService.uploadImage(file);
      if (!result.success || !result.imageUrl) throw new Error('未返回图片URL');
      const updatedImages = [...currentImages, result.imageUrl];
      setSelectedItem({ ...selectedItem, images: updatedImages });
    } catch (err) {
      alert(t('upload_failed') || '图片上传失败');
      console.error('upload image failed:', err);
    }
  };

  // 删除图片
  const deleteImage = (index: number) => {
    if (!selectedItem) return;
    
    const updatedImages = selectedItem.images?.filter((_, i) => i !== index) || [];
    setSelectedItem({ ...selectedItem, images: updatedImages });
  };

  // 移动图片位置
  const moveImage = (fromIndex: number, toIndex: number) => {
    if (!selectedItem) return;
    
    const images = Array.from(selectedItem.images || []);
    if (fromIndex >= 0 && fromIndex < images.length && toIndex >= 0 && toIndex < images.length) {
      const [movedImage] = images.splice(fromIndex, 1);
      images.splice(toIndex, 0, movedImage);
      setSelectedItem({ ...selectedItem, images });
    }
  };

  // 保存图片更改
  const saveImageChanges = async () => {
    if (!selectedItem) return;

    try {
      // 找到原 item 数据，合并 imageUrl 字段
      const origin = items.find(i => i.itemId === selectedItem.itemId);
      const imageUrl = selectedItem.images?.join(',') || '';
      let updateData: any = origin ? { ...origin, imageUrl } : { imageUrl };
      // 只在 origin 存在时移除本地字段
      if (origin) {
        delete updateData.isEditing;
        delete updateData.editData;
        delete updateData.images;
      }
      await itemService.updateItem(selectedItem.itemId!, updateData);

      setItems(prev => prev.map(item => 
        item.itemId === selectedItem.itemId 
          ? { ...item, images: selectedItem.images }
          : item
      ));

      closeImageDialog();
      setError(null);
    } catch (err) {
      setError(t('update_failed'));
      console.error('update images failed:', err);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('items_title')}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            placeholder={t('search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            size="small"
            sx={{ width: 300 }}
          />
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
          >
            {t('search')}
          </Button>
        </Box>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={openAddModal}
        >
          {t('add_item')}
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('name')}</TableCell>
              <TableCell>{t('quantity')}</TableCell>
              <TableCell>{t('images')}</TableCell>
              <TableCell>{t('category')}</TableCell>
              <TableCell>{t('location')}</TableCell>
              <TableCell>{t('price')}</TableCell>
              <TableCell>{t('actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography>{t('loading')}</Typography>
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">{t('no_items')}</Typography>
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, index) => (
                <TableRow key={item.itemId ?? index} hover>
                  <TableCell>
                    {item.isEditing ? (
                      <TextField
                        value={item.editData?.name || ''}
                        onChange={(e) => handleEditChange(item.itemId!, 'name', e.target.value)}
                        size="small"
                        fullWidth
                      />
                    ) : (
                      item.name
                    )}
                  </TableCell>
                  <TableCell>
                    {item.isEditing ? (
                      <TextField
                        type="number"
                        value={item.editData?.quantity || 1}
                        onChange={(e) => handleEditChange(item.itemId!, 'quantity', parseInt(e.target.value))}
                        size="small"
                        inputProps={{ min: 1 }}
                      />
                    ) : (
                      item.quantity || 1
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      {(item.isEditing ? item.editData?.imageUrl?.split(',').filter(url => url.trim()) : item.images || [])?.slice(0, 3).map((imageUrl, index) => (
                        <Box
                          key={`${item.itemId}-${index}`}
                          component="img"
                          src={imageUrl}
                          alt={`${item.name} ${index + 1}`}
                          onClick={() => openImagePreview(
                            item.isEditing 
                              ? item.editData?.imageUrl?.split(',').filter(url => url.trim()) || []
                              : item.images || [], 
                            index, 
                            item.name
                          )}
                          sx={{
                            width: 40,
                            height: 40,
                            objectFit: 'cover',
                            borderRadius: 1,
                            border: '1px solid #e0e0e0',
                            cursor: 'pointer',
                            transition: 'transform 0.2s ease',
                            '&:hover': {
                              transform: 'scale(1.1)',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                            }
                          }}
                        />
                      ))}
                      {(item.isEditing ? item.editData?.imageUrl?.split(',').filter(url => url.trim()) : item.images || []) && 
                       ((item.isEditing ? item.editData?.imageUrl?.split(',').filter(url => url.trim()) : item.images) ?? []).length > 3 && (
                        <Box
                          onClick={() => openImagePreview(
                            item.isEditing 
                              ? item.editData?.imageUrl?.split(',').filter(url => url.trim()) || []
                              : item.images || [], 
                            3, 
                            item.name
                          )}
                          sx={{
                            width: 40,
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f5f5f5',
                            borderRadius: 1,
                            border: '1px solid #e0e0e0',
                            fontSize: '12px',
                            color: '#666',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: '#e0e0e0',
                              transform: 'scale(1.1)'
                            }
                          }}
                        >
                          +{((item.isEditing ? item.editData?.imageUrl?.split(',').filter(url => url.trim()) : item.images) ?? []).length - 3}
                        </Box>
                      )}
                      <Tooltip title={t('manage_images') || '管理图片'}>
                        <IconButton
                          size="small"
                          onClick={() => openImageDialog(item)}
                          sx={{ ml: 1 }}
                        >
                          <AddPhotoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {item.isEditing ? (
                      <FormControl size="small" fullWidth>
                        <Select
                          value={item.editData?.categoryId?.toString() || ''}
                          onChange={(e) => handleEditChange(item.itemId!, 'categoryId', e.target.value ? parseInt(e.target.value) : undefined)}
                        >
                          <MenuItem value="">
                            <em>{t('select_category')}</em>
                          </MenuItem>
                          {categories.map((category) => (
                            <MenuItem key={category.categoryId} value={category.categoryId}>
                              {category.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      getCategoryName(item.categoryId)
                    )}
                  </TableCell>
                  <TableCell>
                    {item.isEditing ? (
                      <TextField
                        value={item.editData?.location || ''}
                        onChange={(e) => handleEditChange(item.itemId!, 'location', e.target.value)}
                        size="small"
                        fullWidth
                      />
                    ) : (
                      item.location || '-'
                    )}
                  </TableCell>
                  <TableCell>
                                         {item.isEditing ? (
                       <TextField
                         type="number"
                         inputProps={{ step: 0.01 }}
                         value={item.editData?.price || ''}
                         onChange={(e) => handleEditChange(item.itemId!, 'price', e.target.value ? parseFloat(e.target.value) : undefined)}
                         size="small"
                       />
                     ) : (
                       item.price ? `¥${item.price.toFixed(2)}` : '-'
                     )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {item.isEditing ? (
                        <>
                          <Tooltip title={t('save') || '保存'}>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => saveEditing(item)}
                            >
                              <SaveIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('cancel') || '取消'}>
                            <IconButton
                              size="small"
                              color="inherit"
                              onClick={() => cancelEditing(item)}
                            >
                              <CancelIcon />
                            </IconButton>
                          </Tooltip>
                        </>
                      ) : (
                        <>
                          <Tooltip title={t('edit') || '编辑'}>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => startEditing(item)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('delete') || '删除'}>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => item.itemId && handleDeleteItem(item.itemId)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 添加物品弹窗 */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSuccess={handleAddItemSuccess}
      />

      {/* 图片预览对话框 */}
      <ImagePreviewModal
        isOpen={imagePreviewOpen}
        onClose={closeImagePreview}
        images={previewImages}
        initialIndex={previewInitialIndex}
        title={previewTitle}
      />

      {/* 图片管理对话框 */}
      <Dialog open={imageDialogOpen} onClose={closeImageDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {t('manage_images') || '管理图片'} - {selectedItem?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t('drag_to_reorder') || '拖拽图片重新排序，最多支持10张图片'}
            </Typography>
          </Box>
          
          <ImageList
            sx={{ width: '100%', height: 300 }}
            cols={3}
            rowHeight={200}
          >
            {(selectedItem?.images || []).map((imageUrl, index) => (
              <ImageListItem key={index}>
                <img
                  src={imageUrl}
                  alt={`${selectedItem?.name} ${index + 1}`}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => openImagePreview(selectedItem?.images || [], index, selectedItem?.name || '图片预览')}
                />
                <ImageListItemBar
                  actionIcon={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {index > 0 && (
                        <IconButton
                          size="small"
                          sx={{ color: 'white' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            moveImage(index, index - 1);
                          }}
                        >
                          ↑
                        </IconButton>
                      )}
                      {index < (selectedItem?.images?.length || 0) - 1 && (
                        <IconButton
                          size="small"
                          sx={{ color: 'white' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            moveImage(index, index + 1);
                          }}
                        >
                          ↓
                        </IconButton>
                      )}
                      <IconButton
                        sx={{ color: 'white' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteImage(index);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                  actionPosition="right"
                />
              </ImageListItem>
            ))}
          </ImageList>

          {(selectedItem?.images?.length || 0) < 10 && (
            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                component="label"
              >
                {t('upload_image') || '上传图片'}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      await addImage(file);
                      e.target.value = '';
                    }
                  }}
                />
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeImageDialog} color="inherit">
            {t('cancel')}
          </Button>
          <Button onClick={saveImageChanges} variant="contained">
            {t('save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 