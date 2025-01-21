import { router } from '@/pages';
import { FC } from 'react';
import { RouterProvider } from 'react-router-dom';
import './styles/cssReset.css';
import './styles/main.css';

const App: FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
