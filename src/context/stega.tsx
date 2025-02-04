'use client';

import { ReactNode, createContext } from 'react';

type StegaContextType = boolean;

export const StegaContext = createContext<StegaContextType>(true);

export function DisableStega({ children }: { children: ReactNode }) {
  return (
    <StegaContext.Provider value={false}>{children}</StegaContext.Provider>
  );
}

export function Stega({
  children,
  enabled = true,
}: {
  children: ReactNode;
  enabled?: boolean;
}) {
  return (
    <StegaContext.Provider value={enabled}>{children}</StegaContext.Provider>
  );
}
