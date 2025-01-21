import '@/assets/style/cssReset.css';
import '@/assets/style/main.css';

import muiTheme from '@/assets/style/muiTheme';
import { ThemeProvider } from '@mui/material';
import { FC } from 'react';

import { AppRouter } from './AppRouter';

const App: FC = () => {
  return (
    <ThemeProvider theme={muiTheme}>
      <AppRouter />
    </ThemeProvider>
  );
};

export default App;
