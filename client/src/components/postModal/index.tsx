import { Post, PostCreateData } from '@/types/post';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

interface PostModalProps {
  isOpen: boolean;
  handleClose: () => void;
  post?: Post;
  onSubmit: (formdata: FormData) => Promise<void>;
  title: string;
  submitButtonText: string;
}

export const PostModal = ({
  isOpen,
  handleClose,
  post,
  onSubmit,
  title,
  submitButtonText,
}: PostModalProps) => {
  const { handleSubmit, control } = useForm<PostCreateData>();
  const queryClient = useQueryClient();
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>(
    post?.media.map(
      (media) => import.meta.env.VITE_INSTANCE_BASE_URL + media.url
    ) || []
  );
  const [isUploading, setIsUploading] = useState(false);
  const [deletedMediaIds, setDeletedMediaIds] = useState<number[]>([]);
  const [urlToFileIndex, setUrlToFileIndex] = useState<Record<string, number>>(
    {}
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setMediaFiles((prev) => [...prev, ...files]);

    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);

    const newUrlToFileIndex: Record<string, number> = {};
    previewUrls.forEach((url, index) => {
      if (
        index >=
        (
          post?.media.map(
            (media) => import.meta.env.VITE_INSTANCE_BASE_URL + media.url
          ) || []
        ).length
      ) {
        newUrlToFileIndex[url] =
          index -
          (
            post?.media.map(
              (media) => import.meta.env.VITE_INSTANCE_BASE_URL + media.url
            ) || []
          ).length;
      }
    });
    setUrlToFileIndex((prev) => ({ ...prev, ...newUrlToFileIndex }));
  };

  const handleDeleteMedia = async (url: string) => {
    const fileIndexToDelete = urlToFileIndex[url];

    setPreviewUrls((prev) => prev.filter((previewUrl) => previewUrl !== url));

    if (fileIndexToDelete !== undefined) {
      setMediaFiles((prev) =>
        prev.filter((_, index) => index !== fileIndexToDelete)
      );
      const newUrlToFileIndex = { ...urlToFileIndex };
      delete newUrlToFileIndex[url];
      setUrlToFileIndex(newUrlToFileIndex);
      return;
    }

    const mediaId = post?.media.find(
      (media) => import.meta.env.VITE_INSTANCE_BASE_URL + media.url === url
    )?.id;
    if (mediaId) {
      setDeletedMediaIds((prev) => [...prev, mediaId]);
    }
  };

  const onSubmitHandler: SubmitHandler<PostCreateData> = async (data) => {
    const formData = new FormData();
    formData.append('message', data.message);
    mediaFiles.forEach((file) => formData.append('media', file));
    formData.append('deletedMediaIds', JSON.stringify(deletedMediaIds));

    setIsUploading(true);
    try {
      await onSubmit(formData);
      handleClose();
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    } catch (error) {
      console.error('Error submitting post:', error);
    } finally {
      setIsUploading(false);
      setMediaFiles([]);
      setPreviewUrls([]);
      setUrlToFileIndex({});
      setDeletedMediaIds([]);
    }
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <StyledBox>
        <Typography variant='h5' fontWeight={600} color='primary' mb={2}>
          {title}
        </Typography>

        <Stack
          gap={3}
          component='form'
          noValidate
          onSubmit={handleSubmit(onSubmitHandler)}
          width='100%'
        >
          <MediaUploadBox>
            <IconButton color='primary' component='label'>
              <input
                hidden
                accept='image/*,video/*'
                multiple
                type='file'
                onChange={handleFileChange}
              />
              <AddPhotoAlternateIcon sx={{ fontSize: 48 }} />
            </IconButton>
            <Typography variant='body2' color='text.secondary'>
              Добавить изображения или видео
            </Typography>
          </MediaUploadBox>

          <PreviewContainer>
            {previewUrls.map((src, index) => (
              <PreviewMediaWrapper key={index}>
                <PreviewMedia src={src} alt={`preview-${index}`} />
                {post && (
                  <DeleteButton
                    onClick={() => handleDeleteMedia(src)}
                    size='small'
                  >
                    <DeleteIcon fontSize='small' />
                  </DeleteButton>
                )}
              </PreviewMediaWrapper>
            ))}
          </PreviewContainer>

          {isUploading && <Typography color='primary'>Загрузка...</Typography>}

          <Controller
            control={control}
            name='message'
            defaultValue={post?.message || ''}
            rules={{ required: 'Введите текст поста' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                label='Текст поста'
                rows={4}
                multiline
                variant='outlined'
                placeholder='Введите текст поста...'
                error={!!error}
                helperText={error?.message}
                fullWidth
                {...field}
              />
            )}
          />

          <Button
            variant='contained'
            type='submit'
            fullWidth
            disabled={isUploading}
          >
            {isUploading ? 'Сохранение...' : submitButtonText}
          </Button>
        </Stack>
      </StyledBox>
    </Modal>
  );
};

const StyledBox = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 552px;
  padding: 32px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const MediaUploadBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  &:hover {
    border-color: #1976d2;
  }
`;

const PreviewContainer = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const PreviewMediaWrapper = styled(Box)`
  position: relative;
  display: inline-block;
`;

const PreviewMedia = styled('img')`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const DeleteButton = styled(IconButton)`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: white;
  &:hover {
    background-color: white;
  }
`;
