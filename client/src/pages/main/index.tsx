import { AuthModal } from '@/components/authModal';
import { CreatePostModal } from '@/components/createPostModal';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import { FC, useState } from 'react';
import { posts } from './posts.const';

export const MainPage: FC = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <AuthModal />
      <CreatePostModal isOpen={open} handleClose={handleClose} />
      <Container sx={{ marginTop: '60px' }}>
        <Box sx={{ paddingTop: 5 }}>
          <Button variant='contained' fullWidth onClick={handleOpen}>
            + Создать пост
          </Button>
          <Stack gap={3} marginTop={3}>
            {posts.map((post) => (
              <Card sx={{ border: '1px solid #1976d2' }} key={post.id}>
                <CardContent>{post.message}</CardContent>
                <CardActions>
                  <Typography>
                    {post.date}
                    {post.author.name}
                  </Typography>
                </CardActions>
              </Card>
            ))}
          </Stack>
        </Box>
      </Container>
    </>
  );
};
