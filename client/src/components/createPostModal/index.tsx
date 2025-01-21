import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

export const CreatePostModal = ({
  isOpen,
  handleClose,
}: {
  isOpen: boolean;
  handleClose: () => void;
}) => {
  const [media, setMedia] = useState<string[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newMedia = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setMedia((prevMedia) => [...prevMedia, ...newMedia]);
    }
  };

  const handleRemoveMedia = (index: number) => {
    setMedia((prevMedia) => prevMedia.filter((_, i) => i !== index));
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 550,
          height: 690,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Stack gap={2}>
          <Typography>Новый пост</Typography>
          <Box
            sx={{
              width: '100%',
              height: '300px',
              border: '1px dashed',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              alignItems: 'center',
              justifyContent: 'center',
              overflowY: 'auto',
              position: 'relative',
              cursor: 'pointer',
            }}
            onClick={() => document.getElementById('media-upload')?.click()}
          >
            {media.length > 0 ? (
              media.map((item, index) => (
                <Box key={index} sx={{ position: 'relative' }}>
                  {item.endsWith('.mp4') ||
                  item.endsWith('.webm') ||
                  item.endsWith('.ogg') ? (
                    <video src={item} controls width='100' height='100' />
                  ) : (
                    <img
                      src={item}
                      alt='Preview'
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                      }}
                    />
                  )}
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveMedia(index);
                    }}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      bgcolor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              ))
            ) : (
              <Typography>
                Нажмите, чтобы выбрать изображения или видео
              </Typography>
            )}
          </Box>
          <input
            type='file'
            accept='image/*,video/*'
            onChange={handleFileChange}
            multiple
            style={{ display: 'none' }}
            id='media-upload'
          />
          <TextField multiline placeholder='Введите текст поста...' />
          <Button variant='contained'>Создать</Button>
        </Stack>
      </Box>
    </Modal>
  );
};
