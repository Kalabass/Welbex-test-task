import { PostModal } from '@/components/postModal';
import { Post } from '@/types/post';
import { useDeletePostMutation } from '@/utils/mutations/useDeletePost.mutation';
import { useUpdatePostMutation } from '@/utils/mutations/useUpdatePostMutation';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { FC, useState } from 'react';

const DropDownMenu: FC<{ post: Post }> = ({ post }) => {
  const { id: postId } = post;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const deletePostMutation = useDeletePostMutation();

  const queryClient = useQueryClient();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    deletePostMutation.mutate(postId, {
      onSuccess: () => {
        queryClient.invalidateQueries();
      },
    });
  };
  const handleUpdate = () => {
    setIsModalOpen(true);
  };

  const updatePostMutation = useUpdatePostMutation();

  return (
    <>
      <PostModal
        isOpen={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        post={post}
        title='Обновление поста'
        submitButtonText='Обновить'
        onSubmit={async (formData) => {
          await updatePostMutation.mutateAsync({ postId, formData });
        }}
      />
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleDelete}>удалить</MenuItem>
        <MenuItem onClick={handleUpdate}>редактировать</MenuItem>
      </Menu>
    </>
  );
};

export { DropDownMenu };
