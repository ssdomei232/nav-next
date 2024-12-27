import { Moon, Sun } from 'lucide-react'

interface DarkModeToggleProps {
  darkMode: boolean
  setDarkMode: (darkMode: boolean) => void
}

export default function DarkModeToggle({ darkMode, setDarkMode }: DarkModeToggleProps) {
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-200"
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? <Sun size={24} /> : <Moon size={24} />}
    </button>
  )
}

