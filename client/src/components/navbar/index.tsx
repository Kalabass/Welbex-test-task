import { uesAuthModalStore } from '@/lib/store/authModa.store';
import { useAuthStore } from '@/lib/store/useAuthStore';

import { AppBar, Button, styled, Toolbar, Typography } from '@mui/material';

export const NavBar = () => {
  const { userId, logout } = useAuthStore();
  const { openModal } = uesAuthModalStore();

  const onClickHandler = () => {
    if (userId) {
      logout();
    } else {
      openModal();
    }
  };

  return (
    <AppBar sx={{ height: '60px' }}>
      <StyledToolBar>
        <Typography sx={{ fontWeight: 800, fontSize: '40px' }}>
          Welbex
        </Typography>
        <Button variant='text' sx={{ color: 'white' }} onClick={onClickHandler}>
          {userId ? 'выйти' : 'войти'}
        </Button>
      </StyledToolBar>
    </AppBar>
  );
};

const StyledToolBar = styled(Toolbar)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
