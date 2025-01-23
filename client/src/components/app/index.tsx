import '@/assets/style/cssReset.css';
import '@/assets/style/main.css';

import muiTheme from '@/assets/style/muiTheme';
import { ThemeProvider } from '@mui/material';
import { FC } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRouter } from './AppRouter';

const queryClient = new QueryClient();

const App: FC = () => {
  return (
    <ThemeProvider theme={muiTheme}>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
