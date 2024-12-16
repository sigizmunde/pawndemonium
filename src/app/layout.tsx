import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserContextProvider } from '@/components/userContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'pawndemonium',
  description: 'chess arcade',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleOAuthProvider
          clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID || ''}
        >
          <UserContextProvider>{children}</UserContextProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
