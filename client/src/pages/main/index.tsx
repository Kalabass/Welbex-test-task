import { PostCard } from '@/pages/main/postCard';

import { Box, Container, Stack } from '@mui/material';
import { FC } from 'react';
import { usePostsQuery } from '../../utils/queries/usePosts.query';
import { CreatePostButton } from './CreatePostButton';

export const MainPage: FC = () => {
  const { data } = usePostsQuery();

  return (
    <Container sx={{ marginTop: '60px' }} maxWidth='md'>
      <Box sx={{ paddingBlock: 5 }}>
        <Stack gap={3}>
          <CreatePostButton />
          {data?.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </Stack>
      </Box>
    </Container>
  );
};
