import { useAuthStore } from '@/lib/store/useAuthStore';
import { Post } from '@/types/post';
import { Box, Card, CardContent, styled, Typography } from '@mui/material';
import { FC } from 'react';
import { Carousel } from './Carousel';
import { DropDownMenu } from './DropDownMenu';

export const PostCard: FC<{ post: Post }> = ({ post }) => {
  const { userId } = useAuthStore();
  const { user, date, media, message } = post;
  return (
    <StyledCard>
      <CardContent>
        <Box maxWidth='600px' margin='0 auto'>
          <StyledBox>
            <Box display='flex' alignItems='center' gap={1}>
              <Typography variant='subtitle1' fontWeight='bold' color='primary'>
                {user.login}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {date}
              </Typography>
            </Box>
            {userId === user.id && <DropDownMenu post={post} />}
          </StyledBox>

          {media.length > 0 && (
            <Box mb={2}>
              <Carousel media={media} />
            </Box>
          )}

          <Typography variant='body1'>{message}</Typography>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

const StyledCard = styled(Card)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  boxShadow: theme.spacing(2),
}));

const StyledBox = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 2,
}));
