import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UseKeyboardShortcutsProps {
  onToggleSidebar: () => void;
  onOpenSettings: () => void;
}

export function useKeyboardShortcuts({ onToggleSidebar, onOpenSettings }: UseKeyboardShortcutsProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts when not typing in input elements
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement) {
        return;
      }

      const isCtrlOrCmd = event.ctrlKey || event.metaKey;

      if (isCtrlOrCmd) {
        switch (event.key) {
          case 'k':
          case 'K':
            event.preventDefault();
            onToggleSidebar();
            break;
          case 'n':
          case 'N':
            event.preventDefault();
            navigate('/chat/new');
            break;
          case ',':
            event.preventDefault();
            onOpenSettings();
            break;
          case '/':
            event.preventDefault();
            // Focus search bar
            const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
            if (searchInput) {
              searchInput.focus();
            }
            break;
        }
      }

      // ESC key to close modals/sidebar
      if (event.key === 'Escape') {
        onToggleSidebar();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate, onToggleSidebar, onOpenSettings]);
}