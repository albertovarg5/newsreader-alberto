import { createContext, useContext } from 'react';

export const ArticlesContext = createContext();

export const useArticles = () => {
  const context = useContext(ArticlesContext);
  if (!context) {
    throw new Error('useArticles must be used within ArticlesProvider');
  }
  return context;
};
