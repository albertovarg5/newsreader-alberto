import { useState } from 'react';
import { AuthContext } from './useAuth';

// DEMO ONLY: there is no backend, so accounts and plain-text passwords live in
// the client bundle where anyone can read them.
// shortcut: client-side demo auth, use a real server with hashed passwords and signed sessions in production.
const DEMO_USERS = [
  { username: 'alice', password: 'alice123', role: 'regular' },
  { username: 'bob', password: 'bob123', role: 'regular' },
  { username: 'admin', password: 'admin123', role: 'admin' },
];

const SESSION_KEY = 'newsreader_user';

// Returns the saved session only if it names a real demo account; anything else is ignored.
// Only { username, role } is ever stored, never the password.
function loadSession() {
  try {
    const saved = JSON.parse(localStorage.getItem(SESSION_KEY));
    const account = DEMO_USERS.find((u) => u.username === saved?.username);
    // Role comes from the account list, not from the stored value.
    return account ? { username: account.username, role: account.role } : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadSession); // { username, role } or null

  // Throws on bad credentials (Login.jsx shows the message).
  const login = (username, password) => {
    const found = DEMO_USERS.find(
      (u) => u.username === username.trim() && u.password === password
    );
    if (!found) throw new Error('Invalid username or password');
    const session = { username: found.username, role: found.role };
    setUser(session);
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {
      // storage unavailable: the session just won't survive a refresh
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
