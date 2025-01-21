import { Layout } from '@/pages/layout';
import { MainPage } from '@/pages/main';
import { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';

export const AppRouter: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<MainPage />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
