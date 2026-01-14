
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeMode = 'light' | 'dark';
type PrimaryColor = 'blue' | 'purple' | 'emerald' | 'rose';

interface ThemeContextType {
  mode: ThemeMode;
  toggleMode: () => void;
  primaryColor: PrimaryColor;
  setPrimaryColor: (color: PrimaryColor) => void;
  chatBackground: string;
  setChatBackground: (url: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => (localStorage.getItem('mesp_theme_mode') as ThemeMode) || 'light');
  const [primaryColor, setPrimaryColorState] = useState<PrimaryColor>(() => (localStorage.getItem('mesp_theme_color') as PrimaryColor) || 'blue');
  const [chatBackground, setChatBackgroundState] = useState(() => localStorage.getItem('mesp_chat_bg') || 'https://www.transparenttextures.com/patterns/subtle-white-feathers.png');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(mode);
    localStorage.setItem('mesp_theme_mode', mode);
  }, [mode]);

  useEffect(() => {
    const root = window.document.documentElement;
    const colors = {
        blue: '#2563eb',
        purple: '#9333ea',
        emerald: '#059669',
        rose: '#e11d48'
    };
    root.style.setProperty('--color-primary', colors[primaryColor]);
    localStorage.setItem('mesp_theme_color', primaryColor);
  }, [primaryColor]);

  const toggleMode = () => setMode(prev => prev === 'light' ? 'dark' : 'light');
  const setPrimaryColor = (color: PrimaryColor) => setPrimaryColorState(color);
  const setChatBackground = (url: string) => {
      setChatBackgroundState(url);
      localStorage.setItem('mesp_chat_bg', url);
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleMode, primaryColor, setPrimaryColor, chatBackground, setChatBackground }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
