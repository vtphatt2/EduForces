import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';

interface AuthContextType {
  user: { email: string; name: string } | null;
  setUser: React.Dispatch<React.SetStateAction<{ email: string; name: string } | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/user', {
          credentials: 'include', // Include cookies in the request
        });
        if (response.ok) {
            console.log('Response is ok');
            const userData = await response.json();
            console.log('User data:', userData);
            setUser(userData);
          }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};