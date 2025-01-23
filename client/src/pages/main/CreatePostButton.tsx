import { PostModal } from '@/components/postModal';
import { uesAuthModalStore } from '@/lib/store/authModa.store';
import { getValidToken } from '@/utils/getValidToken';
import { useCreatePostMutation } from '@/utils/mutations/useCreatePost.mutation';
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import { FC, useState } from 'react';
const CreatePostButton: FC = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { openModal } = uesAuthModalStore();
  const createPostMutation = useCreatePostMutation();
  const onClick = async () => {
    const token = await getValidToken();

    if (!token) {
      openModal();
      return;
    }

    handleOpen();
  };
  return (
    <>
      <PostModal
        isOpen={open}
        handleClose={handleClose}
        title='Новый пост'
        submitButtonText='Создать'
        onSubmit={async (formData) => {
          await createPostMutation.mutateAsync(formData);
        }}
      />
      <Button variant='contained' fullWidth onClick={onClick}>
        <AddIcon />
        Создать пост
      </Button>
    </>
  );
};

export { CreatePostButton };
