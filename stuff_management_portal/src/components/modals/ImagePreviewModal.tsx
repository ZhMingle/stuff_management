'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Button
} from '@mui/material';
import {
  Close as CloseIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
  title?: string;
}

export default function ImagePreviewModal({ 
  isOpen, 
  onClose, 
  images, 
  initialIndex = 0,
  title = '图片预览'
}: ImagePreviewModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // 当对话框打开时，重置当前索引
  React.useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft':
        handlePrevious();
        break;
      case 'ArrowRight':
        handleNext();
        break;
      case 'Escape':
        onClose();
        break;
    }
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      onKeyDown={handleKeyDown}
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          color: 'white'
        }
      }}
    >
      <DialogContent sx={{ p: 0, position: 'relative' }}>
        {/* 关闭按钮 */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.7)'
            }
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* 标题和计数器 */}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            px: 2,
            py: 1,
            borderRadius: 1
          }}
        >
          <Typography variant="body2">
            {title} ({currentIndex + 1} / {images.length})
          </Typography>
        </Box>

        {/* 图片容器 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            position: 'relative'
          }}
        >
          {/* 上一张按钮 */}
          {images.length > 1 && (
            <IconButton
              onClick={handlePrevious}
              sx={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)'
                }
              }}
            >
              <NavigateBeforeIcon />
            </IconButton>
          )}

          {/* 图片 */}
          <Box
            component="img"
            src={images[currentIndex]}
            alt={`${title} ${currentIndex + 1}`}
            sx={{
              maxWidth: '100%',
              maxHeight: '80vh',
              objectFit: 'contain',
              borderRadius: 1
            }}
          />

          {/* 下一张按钮 */}
          {images.length > 1 && (
            <IconButton
              onClick={handleNext}
              sx={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)'
                }
              }}
            >
              <NavigateNextIcon />
            </IconButton>
          )}
        </Box>

        {/* 缩略图导航 */}
        {images.length > 1 && (
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              justifyContent: 'center',
              p: 2,
              overflowX: 'auto',
              backgroundColor: 'rgba(0, 0, 0, 0.3)'
            }}
          >
            {images.map((image, index) => (
              <Box
                key={index}
                component="img"
                src={image}
                alt={`缩略图 ${index + 1}`}
                onClick={() => setCurrentIndex(index)}
                sx={{
                  width: 60,
                  height: 60,
                  objectFit: 'cover',
                  borderRadius: 1,
                  cursor: 'pointer',
                  border: index === currentIndex ? '2px solid #1976d2' : '2px solid transparent',
                  opacity: index === currentIndex ? 1 : 0.7,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    opacity: 1,
                    transform: 'scale(1.05)'
                  }
                }}
              />
            ))}
          </Box>
        )}

        {/* 键盘提示 */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            px: 2,
            py: 1,
            borderRadius: 1
          }}
        >
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            使用 ← → 键切换图片，ESC 键关闭
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
