
import { Input } from "@/components/ui/input";
import { Key } from "lucide-react";
import { toast } from "sonner";

interface ApiKeyInputProps {
  apiKey: string;
  onApiKeyChange: (apiKey: string) => void;
}

export const ApiKeyInput = ({ apiKey, onApiKeyChange }: ApiKeyInputProps) => {
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newApiKey = e.target.value;
    onApiKeyChange(newApiKey);
    toast.success("API Key updated successfully");
  };

  return (
    <div className="p-2 mb-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-2">
        <Key className="h-4 w-4" />
        <span className="text-sm">API Key</span>
      </div>
      <Input
        type="password"
        placeholder="Enter your API key"
        value={apiKey}
        onChange={handleApiKeyChange}
        className="bg-[#2F2F2F] border-none focus:ring-2 focus:ring-white/20 transition-all duration-300 hover:bg-[#3F3F3F]"
      />
    </div>
  );
};
