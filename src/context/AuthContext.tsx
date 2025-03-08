import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Check for redirect result on mount
    getRedirectResult(auth).then((result) => {
      if (result?.user) {
        handleGoogleAuthSuccess(result.user);
      }
    }).catch((error) => {
      if (error.code !== 'auth/unauthorized-domain') {
        console.error('Redirect sign-in error:', error);
      }
    });

    return unsubscribe;
  }, []);

  const handleGoogleAuthSuccess = async (user: User) => {
    try {
      // Create/update user profile in Firestore
      await setDoc(doc(db, 'userprofiles', user.uid), {
        email: user.email,
        name: user.displayName,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    await setDoc(doc(db, 'userprofiles', userCredential.user.uid), {
      email,
      createdAt: new Date().toISOString()
    });
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    try {
      // First try popup
      const result = await signInWithPopup(auth, provider);
      await handleGoogleAuthSuccess(result.user);
    } catch (error: any) {
      if (error.code === 'auth/popup-blocked') {
        // If popup is blocked, fallback to redirect
        await signInWithRedirect(auth, provider);
      } else if (error.code === 'auth/unauthorized-domain') {
        throw new Error('This domain is not authorized for authentication. Please contact support.');
      } else {
        throw error;
      }
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateUserProfile = async (displayName: string) => {
    if (!auth.currentUser) return;
    
    await updateProfile(auth.currentUser, { displayName });
    await setDoc(doc(db, 'userprofiles', auth.currentUser.uid), {
      name: displayName,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signInWithGoogle,
      resetPassword,
      updateUserProfile,
      logout
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};