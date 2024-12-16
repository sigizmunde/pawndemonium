'use client';

import Builder from '@/components/builder';
import Login from '@/components/login';
import '../page.scss';

export default function Home() {
  return (
    <>
      <Login />
      <Builder />
    </>
  );
}
