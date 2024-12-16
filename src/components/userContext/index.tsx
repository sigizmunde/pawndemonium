'use client';

import { createContext, useState } from 'react';

export const UserContext = createContext<TUserContextValue>({
  user: null,
  setUser: () => {},
});

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
  );
};

export type TUserInfo = {
  id: string;
  email: string;
  verified_email?: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  locale?: string;
};

export type TUserContextValue = {
  user: TUserInfo | null;
  setUser: Function;
};
