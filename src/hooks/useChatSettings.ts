
import { useState, useEffect } from 'react';

interface ChatSettings {
  temperature: number;
  maxTokens: number;
  model: string;
  isDarkMode: boolean;
  ragEnabled: boolean;
  ragTopK: number;
  ragMinSimilarity: number;
  ragMaxContext: number;
}

const defaultSettings: ChatSettings = {
  temperature: 0.7,
  maxTokens: 2048,
  model: 'gpt-3.5-turbo',
  isDarkMode: true,
  ragEnabled: false,
  ragTopK: 5,
  ragMinSimilarity: 0.5,
  ragMaxContext: 3000,
};

export const useChatSettings = () => {
  const [settings, setSettings] = useState<ChatSettings>(defaultSettings);

  useEffect(() => {
    const savedSettings = localStorage.getItem('chat_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
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
