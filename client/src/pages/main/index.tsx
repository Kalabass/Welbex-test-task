import { PostCard } from '@/pages/main/postCard';
import { Box, CircularProgress, Container, Stack } from '@mui/material';
import { FC } from 'react';
import { usePostsQuery } from '../../utils/queries/usePosts.query';
import { CreatePostButton } from './CreatePostButton';

export const MainPage: FC = () => {
  const { data, isLoading } = usePostsQuery();

  return (
    <Container sx={{ marginTop: '60px' }} maxWidth='md'>
      <Box sx={{ paddingBlock: 5 }}>
        <Stack gap={3}>
          <CreatePostButton />
          {isLoading ? (
            <Box
              sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}
            >
              <CircularProgress />
            </Box>
          ) : (
            data?.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </Stack>
      </Box>
    </Container>
  );
};
