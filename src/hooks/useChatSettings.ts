
import { useState, useEffect } from 'react';

interface ChatSettings {
  temperature: number;
  maxTokens: number;
  model: string;
  isDarkMode: boolean;
}

const defaultSettings: ChatSettings = {
  temperature: 0.7,
  maxTokens: 2048,
  model: 'gpt-3.5-turbo',
  isDarkMode: true,
};

export const useChatSettings = () => {
  const [settings, setSettings] = useState<ChatSettings>(defaultSettings);

  useEffect(() => {
    const savedSettings = localStorage.getItem('chat_settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to parse chat settings:', error);
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<ChatSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('chat_settings', JSON.stringify(updatedSettings));
  };

  return { settings, updateSettings };
};
