import React, { createContext, useContext, useState, useEffect } from 'react';

type NetworkContextType = {
  isTestnet: boolean;
  setIsTestnet: (val: boolean) => void;
};

const NetworkContext = createContext<NetworkContextType>({
  isTestnet: true,
  setIsTestnet: () => {},
});

export const useNetwork = () => useContext(NetworkContext);

export const NetworkProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isTestnet, setIsTestnet] = useState(() => {
    const saved = localStorage.getItem('vaulta_isTestnet');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('vaulta_isTestnet', JSON.stringify(isTestnet));
  }, [isTestnet]);

  return (
    <NetworkContext.Provider value={{ isTestnet, setIsTestnet }}>
      {children}
    </NetworkContext.Provider>
  );
};
