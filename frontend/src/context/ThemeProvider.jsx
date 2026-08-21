import { useState, useEffect } from 'react';
import { ThemeContext } from './ThemeContext.js';
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });
  const isDark = theme === 'dark';
  const isLight = theme === 'light';
  useEffect(() => {
    try {
      localStorage.setItem('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {
      console.warn('Failed to access localStorage for theme:', e);
    }
  }, [theme]);
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };
  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        isLight,
        dark: isLight, 
        toggleTheme,
        setTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
export default ThemeProvider;
