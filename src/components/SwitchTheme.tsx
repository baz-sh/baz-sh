import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const THEME_KEY = 'theme';
const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';

export default function SwitchTheme() {
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? DARK_THEME : LIGHT_THEME);
    
    applyTheme(initialTheme);
    setTheme(initialTheme);
  }, []);

  const applyTheme = (newTheme: string) => {
    const root = document.documentElement;
    if (newTheme === DARK_THEME) {
      root.classList.add(DARK_THEME);
      root.classList.remove(LIGHT_THEME);
    } else {
      root.classList.add(LIGHT_THEME);
      root.classList.remove(DARK_THEME);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
    setTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    applyTheme(newTheme);
  };

  if (theme === null) {
    return null;
  }

  return (
    <button
      onClick={toggleTheme}
      className="fixed z-50 bottom-6 right-6 p-3 rounded-full border transition-all duration-200 hover:scale-110"
      style={{
        background: 'var(--color-bg-elevated)',
        borderColor: 'var(--color-border)',
        color: 'var(--color-text-secondary)',
      }}
      aria-label={`Switch to ${theme === DARK_THEME ? 'light' : 'dark'} theme`}
    >
      {theme === DARK_THEME ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}
