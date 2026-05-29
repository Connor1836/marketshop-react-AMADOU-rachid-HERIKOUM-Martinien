import React, { createContext, useContext, useState, useCallback } from 'react';
import { getProfile, updateProfile, clearAllData } from '../data/db/database';

const ProfileContext = createContext(null);

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState({
    name: 'Utilisateur',
    email: 'utilisateur@email.com',
    phone: '',
    dark_mode: false,
  });

  const loadProfile = useCallback(async () => {
    const data = await getProfile();
    if (data) {
      setProfile({
        name: data.name,
        email: data.email,
        phone: data.phone,
        dark_mode: data.dark_mode === 1,
      });
    }
  }, []);

  const saveProfile = useCallback(async (updates) => {
    const updated = { ...profile, ...updates };
    setProfile(updated);
    await updateProfile({
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      dark_mode: updated.dark_mode,
    });
  }, [profile]);

  const toggleDarkMode = useCallback(async (value) => {
    await saveProfile({ dark_mode: value });
  }, [saveProfile]);

  const resetData = useCallback(async () => {
    await clearAllData();
    setProfile({
      name: 'Utilisateur',
      email: 'utilisateur@email.com',
      phone: '',
      dark_mode: profile.dark_mode,
    });
  }, [profile.dark_mode]);

  return (
    <ProfileContext.Provider
      value={{ profile, loadProfile, saveProfile, toggleDarkMode, resetData }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('useProfile doit être dans ProfileProvider');
  return context;
};
