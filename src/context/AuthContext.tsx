import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

export interface PhoneUser {
  id: string;
  name: string;
  phone: string;
  planName: string;
  durationLabel: string;
  durationDays: number;
  priceDisplay: string;
  startDate: string;
  endDate: string;
  signedInAt: string;
}

interface AuthContextType {
  currentUser: User | null;
  phoneUser: PhoneUser | null;
  loading: boolean;
  isAdmin: boolean;
  adminPasskeyUnlocked: boolean;
  unlockWithPasskey: (password: string) => boolean;
  lockAdmin: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithPhone: (user: PhoneUser) => void;
  updatePhoneUser: (user: PhoneUser) => void;
  signOutPhone: () => void;
  logout: () => Promise<void>;
  toggleDevAdminMode: () => void;
  devAdminMode: boolean;
}

const ADMIN_SECRET_KEY = 'Bounceadmin123';

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  phoneUser: null,
  loading: true,
  isAdmin: false,
  adminPasskeyUnlocked: false,
  unlockWithPasskey: () => false,
  lockAdmin: () => {},
  signInWithGoogle: async () => {},
  signInWithPhone: () => {},
  updatePhoneUser: () => {},
  signOutPhone: () => {},
  logout: async () => {},
  toggleDevAdminMode: () => {},
  devAdminMode: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [phoneUser, setPhoneUser] = useState<PhoneUser | null>(() => {
    try {
      const saved = localStorage.getItem('bounce_phone_user_v2');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [devAdminMode, setDevAdminMode] = useState<boolean>(() => {
    return localStorage.getItem('bounce_dev_admin_mode') === 'true';
  });
  const [adminPasskeyUnlocked, setAdminPasskeyUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('bounce_admin_unlocked') === 'true';
    } catch {
      return false;
    }
  });

  const ADMIN_EMAIL = 'harishmugulavally@gmail.com';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const unlockWithPasskey = (password: string): boolean => {
    if (password === ADMIN_SECRET_KEY) {
      setAdminPasskeyUnlocked(true);
      try {
        sessionStorage.setItem('bounce_admin_unlocked', 'true');
      } catch (e) {
        console.warn('Could not save session', e);
      }
      return true;
    }
    return false;
  };

  const lockAdmin = () => {
    setAdminPasskeyUnlocked(false);
    try {
      sessionStorage.removeItem('bounce_admin_unlocked');
    } catch (e) {
      console.warn('Could not clear session', e);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const signInWithPhone = (user: PhoneUser) => {
    setPhoneUser(user);
    try {
      localStorage.setItem('bounce_phone_user_v2', JSON.stringify(user));
    } catch (e) {
      console.warn('Could not save phone user to localStorage', e);
    }
  };

  const updatePhoneUser = (user: PhoneUser) => {
    setPhoneUser(user);
    try {
      localStorage.setItem('bounce_phone_user_v2', JSON.stringify(user));
    } catch (e) {
      console.warn('Could not update phone user in localStorage', e);
    }
  };

  const signOutPhone = () => {
    setPhoneUser(null);
    try {
      localStorage.removeItem('bounce_phone_user_v2');
      localStorage.removeItem('bounce_phone_user');
    } catch (e) {
      console.warn('Could not remove phone user from localStorage', e);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setDevAdminMode(false);
      setAdminPasskeyUnlocked(false);
      localStorage.removeItem('bounce_dev_admin_mode');
      sessionStorage.removeItem('bounce_admin_unlocked');
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  const toggleDevAdminMode = () => {
    const nextVal = !devAdminMode;
    setDevAdminMode(nextVal);
    localStorage.setItem('bounce_dev_admin_mode', String(nextVal));
  };

  const isUserAdmin = Boolean(
    devAdminMode ||
    adminPasskeyUnlocked ||
    (currentUser && currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase())
  );

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        phoneUser,
        loading,
        isAdmin: isUserAdmin,
        adminPasskeyUnlocked,
        unlockWithPasskey,
        lockAdmin,
        signInWithGoogle,
        signInWithPhone,
        updatePhoneUser,
        signOutPhone,
        logout,
        toggleDevAdminMode,
        devAdminMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
