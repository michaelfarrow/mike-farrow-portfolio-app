import { ReactNode, createContext, useContext } from 'react';

type StegaContextType = boolean;

export const StegaContext = createContext<StegaContextType>(true);

export function DisableStega({ children }: { children: ReactNode }) {
  return (
    <StegaContext.Provider value={false}>{children}</StegaContext.Provider>
  );
}

export const useStega = () => useContext(StegaContext);
