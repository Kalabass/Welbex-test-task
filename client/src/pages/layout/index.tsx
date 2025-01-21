import { NavBar } from '@/components/navbar';
import { FC } from 'react';
import { Outlet } from 'react-router';

export const Layout: FC = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};
