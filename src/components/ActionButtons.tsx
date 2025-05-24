
import { ImagePlus, FileText, BarChart2, Code, HelpCircle } from "lucide-react";

interface ActionButtonsProps {
  onActionClick: (template: string) => void;
}

const ActionButtons = ({ onActionClick }: ActionButtonsProps) => {
  const actions = [
    { 
      icon: <ImagePlus className="h-4 w-4 text-purple-400" />, 
      label: "Create image",
      template: "Create an image of: "
    },
    { 
      icon: <FileText className="h-4 w-4 text-blue-400" />, 
      label: "Summarize text",
      template: "Please summarize the following text: "
    },
    { 
      icon: <BarChart2 className="h-4 w-4 text-green-400" />, 
      label: "Analyze data",
      template: "Please analyze this data and provide insights: "
    },
    { 
      icon: <Code className="h-4 w-4 text-yellow-400" />, 
      label: "Code",
      template: "Help me write code for: "
    },
    { 
      icon: <HelpCircle className="h-4 w-4 text-red-400" />, 
      label: "Get advice",
      template: "I need advice about: "
    },
  ];

  return (
    <div className="flex gap-2 flex-wrap justify-center mt-4">
      {actions.map((action) => (
        <button 
          key={action.label} 
          onClick={() => onActionClick(action.template)}
          className="relative flex h-[42px] items-center gap-1.5 rounded-full border border-[#383737] px-3 py-2 text-start text-[13px] shadow-xxs transition enabled:hover:bg-token-main-surface-secondary disabled:cursor-not-allowed xl:gap-2 xl:text-[14px] hover:bg-white/10"
        >
          {action.icon}
          {action.label}
        </button>
      ))}
    </div>
  );
};

export default ActionButtons;
