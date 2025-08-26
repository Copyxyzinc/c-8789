import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

const KeyboardShortcutsHelp = ({ isOpen, onClose }: KeyboardShortcutsHelpProps) => {
  const shortcuts = [
    { key: 'Ctrl + K', description: 'Toggle sidebar' },
    { key: 'Ctrl + N', description: 'New chat' },
    { key: 'Ctrl + ,', description: 'Open settings' },
    { key: 'Ctrl + /', description: 'Focus search' },
    { key: 'Ctrl + Enter', description: 'Send message' },
    { key: 'Esc', description: 'Close sidebar/modals' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-chatgpt-sidebar border-white/10">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm">{shortcut.description}</span>
              <kbd className="bg-white/10 px-2 py-1 rounded text-xs font-mono">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcutsHelp;