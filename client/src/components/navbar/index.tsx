import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import { FC } from 'react';

export const NavBar: FC = () => {
  return (
    <AppBar sx={{ height: '60px' }}>
      <Toolbar
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Typography>Welbex</Typography>
        <Button variant='text' sx={{ color: 'white' }}>
          войти
        </Button>
      </Toolbar>
    </AppBar>
  );
};
