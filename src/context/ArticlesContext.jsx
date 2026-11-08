import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { ArticlesContext } from './useArticles';

const STORAGE_KEY = 'newsreader_articles';

// Reads { username: [articles] } from localStorage; returns {} if missing or malformed.
function loadArticles() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!data || typeof data !== 'object' || Array.isArray(data)) return {};
    const clean = {};
    for (const [name, list] of Object.entries(data)) {
      if (Array.isArray(list)) {
        clean[name] = list.filter((a) => a && typeof a.url === 'string');
      }
    }
    return clean;
  } catch {
    return {};
  }
}

export function ArticlesProvider({ children }) {
  const { user, isAdmin } = useAuth();
  // { username: [articles] } - each user only gets their own list
  const [articlesByUser, setArticlesByUser] = useState(loadArticles);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(articlesByUser));
    } catch {
      // storage full/unavailable: articles just won't survive a refresh
    }
  }, [articlesByUser]);

  const getUserSavedArticles = () =>
    user ? articlesByUser[user.username] || [] : [];

  // Admin only; everyone else gets an empty object.
  const getAllUserArticles = () => (isAdmin ? articlesByUser : {});

  const saveArticle = (article) => {
    if (!user) return;
    setArticlesByUser((prev) => {
      const mine = prev[user.username] || [];
      if (mine.some((a) => a.url === article.url)) return prev;
      return { ...prev, [user.username]: [...mine, article] };
    });
  };

  const removeArticle = (url) => {
    if (!user) return;
    setArticlesByUser((prev) => ({
      ...prev,
      [user.username]: (prev[user.username] || []).filter((a) => a.url !== url),
    }));
  };

  const isArticleSaved = (url) =>
    getUserSavedArticles().some((a) => a.url === url);

  return (
    <ArticlesContext.Provider
      value={{
        getUserSavedArticles,
        getAllUserArticles,
        saveArticle,
        removeArticle,
        isArticleSaved,
      }}
    >
      {children}
    </ArticlesContext.Provider>
  );
}
