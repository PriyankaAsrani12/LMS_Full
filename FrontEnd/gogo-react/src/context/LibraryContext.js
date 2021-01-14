import React, { useState, createContext, useEffect } from 'react';

export const LibraryContext = createContext();

export const LibraryContextProvider = ({ children }) => {
  const [reloadTable, setReloadTable] = useState(false);

  const handleReloadTable = () => {
    console.log('reloading table');
    setReloadTable(!reloadTable);
  };

  useEffect(() => console.log('library context useffect called'));

  return (
    <LibraryContext.Provider value={[handleReloadTable]}>
      {children}
    </LibraryContext.Provider>
  );
};
