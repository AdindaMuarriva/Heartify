// PERBAIKAN: Impor dipisahkan. 'useState', 'createContext', 'useContext' adalah nilai.
import { createContext, useState, useContext } from 'react'; 
// 'ReactNode' adalah tipe, jadi kita impor dengan 'import type'.
import type { ReactNode } from 'react';

// --- Sisanya sama persis ---

// 1. Definisikan bentuk data pengguna
interface User {
  name: string;
  email: string;
  phone: string;
}

// 2. Definisikan apa saja yang akan disediakan oleh Context
interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

// 3. Buat Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. Buat "Provider" yang akan membungkus aplikasi kita
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 5. Buat custom hook agar mudah digunakan di komponen lain
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};