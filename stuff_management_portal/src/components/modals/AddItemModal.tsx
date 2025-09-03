'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid,
  Typography,
  Paper,
  IconButton
} from '@mui/material';
import { CloudUpload as CloudUploadIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Item, CreateItemRequest, categoryService, itemService, Category } from '../../services';
import { useI18n } from '../../components/i18n/I18nProvider';
import ImagePreviewModal from './ImagePreviewModal';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (item: Item) => void;
}

export default function AddItemModal({ isOpen, onClose, onSuccess }: AddItemModalProps) {
  const { t, language } = useI18n();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [formData, setFormData] = useState<CreateItemRequest>({
    name: '',
    quantity: 1,
    imageUrl: '',
    categoryId: undefined,
    location: '',
    price: undefined
  });
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [previewInitialIndex, setPreviewInitialIndex] = useState(0);

  // 获取分类列表
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('error fetching categories:', err);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  // 重置表单
  const resetForm = () => {
    setFormData({
      name: '',
      quantity: 1,
      imageUrl: '',
      categoryId: undefined,
      location: '',
      price: undefined
    });
    setSelectedFiles([]);
    setPreviewUrls([]);
  };

  // 处理文件选择
  const handleFileSelect = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      // 限制最多10张图片
      const maxFiles = 10;
      const filesToAdd = imageFiles.slice(0, maxFiles - selectedFiles.length);
      
      if (filesToAdd.length > 0) {
        setSelectedFiles(prev => [...prev, ...filesToAdd]);
        const newUrls = filesToAdd.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newUrls]);
        setFormData(prev => ({ 
          ...prev, 
          imageUrl: prev.imageUrl || newUrls[0] 
        }));
      }
    }
  }, [selectedFiles.length]);

  // 处理拖拽
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // 处理拖拽放下
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [handleFileSelect]);

  // 处理文件输入
  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files);
    }
  }, [handleFileSelect]);

  // 删除图片
  const handleDeleteImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({ 
      ...prev, 
      imageUrl: previewUrls.length > 1 ? previewUrls[0] : '' 
    }));
  };

  // 打开图片预览
  const openImagePreview = (index: number) => {
    setPreviewInitialIndex(index);
    setImagePreviewOpen(true);
  };

  // 关闭图片预览
  const closeImagePreview = () => {
    setImagePreviewOpen(false);
  };

  // 上传图片到服务器
  const uploadImage = async (file: File): Promise<string> => {
    try {
      const result = await itemService.uploadImage(file);
      if (result.success) {
        return result.imageUrl;
      } else {
        throw new Error('上传失败');
      }
    } catch (error) {
      console.error('上传图片失败:', error);
      throw error;
    }
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert(t('please_enter_item_name'));
      return;
    }

    try {
      setLoading(true);
      
      // 如果有选择的文件，先上传
      let finalImageUrl = formData.imageUrl;
      if (selectedFiles.length > 0) {
        setUploading(true);
        try {
          // 批量上传图片
          const result = await itemService.uploadMultipleImages(selectedFiles);
          if (result.success && result.imageUrls.length > 0) {
            finalImageUrl = result.imageUrls.join(',');
          }
        } catch (err) {
          console.error('upload images failed:', err);
          alert(t('upload_image_failed') || '图片上传失败');
          return;
        } finally {
          setUploading(false);
        }
      }

      const submitData = {
        ...formData,
        imageUrl: finalImageUrl
      };
      
      const newItem = await itemService.createItem(submitData);
      
      onSuccess(newItem);
      resetForm();
      onClose();
    } catch (err) {
      console.error('create item failed:', err);
      alert(t('create_item_failed'));
    } finally {
      setLoading(false);
    }
  };

  // 处理输入变化
  const handleInputChange = (field: keyof CreateItemRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {t('add_item')}
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* 名称 */}
            <TextField
              fullWidth
              label={t('item_name')}
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder={t('please_enter_item_name')}
              required
              variant="outlined"
            />

            {/* 数量和价格 */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label={t('quantity')}
                type="number"
                inputProps={{ min: 1 }}
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value))}
                variant="outlined"
              />

              <TextField
                fullWidth
                label={t('price')}
                type="number"
                inputProps={{ step: 0.01 }}
                value={formData.price || ''}
                onChange={(e) => handleInputChange('price', e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder={t('price')}
                variant="outlined"
              />
            </Box>

            {/* 分类 */}
            <FormControl fullWidth variant="outlined">
              <InputLabel>{t('category')}</InputLabel>
              <Select
                value={formData.categoryId ?? ''}
                onChange={(e) => handleInputChange('categoryId', String(e.target.value) === '' ? undefined : Number(e.target.value))}
                label={t('category')}
              >
                <MenuItem value="">
                  <em>{t('select_category')}</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.categoryId} value={category.categoryId}>
                    {language === 'en'
                      ? category.enName || category.name
                      : category.zhName || category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* 位置 */}
            <TextField
              fullWidth
              label={t('location')}
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder={t('location')}
              variant="outlined"
            />

            {/* 图片上传 */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                {t('item_image')}
              </Typography>
              
              {previewUrls.length > 0 ? (
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {previewUrls.map((url, index) => (
                    <Box
                      key={index}
                      sx={{ position: 'relative', display: 'inline-block' }}
                    >
                      <Box
                        component="img"
                        src={url}
                        alt={`Preview ${index + 1}`}
                        onClick={() => openImagePreview(index)}
                        sx={{
                          width: 120,
                          height: 120,
                          objectFit: 'cover',
                          borderRadius: 1,
                          border: '1px solid #e0e0e0',
                          cursor: 'pointer',
                          transition: 'transform 0.2s ease',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                          }
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteImage(index);
                        }}
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          backgroundColor: 'error.main',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'error.dark'
                          }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Paper
                  variant="outlined"
                  sx={{
                    border: dragActive ? '2px dashed #1976d2' : '2px dashed #e0e0e0',
                    borderRadius: 1,
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: dragActive ? '#f3f8ff' : '#fafafa',
                    transition: 'all 0.2s ease'
                  }}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileInput}
                    style={{ display: 'none' }}
                  />
                  <CloudUploadIcon sx={{ fontSize: 48, color: '#666', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {dragActive ? t('drop_images_here') || '拖拽图片到这里' : t('click_or_drag_images') || '点击或拖拽上传图片'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('supported_formats_multiple') || '支持多张 JPG, PNG, GIF 格式图片，最多10张'}
                  </Typography>
                </Paper>
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="inherit">
            {t('cancel')}
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading || uploading}
          >
            {uploading ? t('uploading') || '上传中...' : 
             loading ? t('creating') : t('create_item')}
          </Button>
        </DialogActions>
      </form>

      {/* 图片预览对话框 */}
      <ImagePreviewModal
        isOpen={imagePreviewOpen}
        onClose={closeImagePreview}
        images={previewUrls}
        initialIndex={previewInitialIndex}
        title="图片预览"
      />
    </Dialog>
  );
} 