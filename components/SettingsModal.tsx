import React, { useEffect, useState } from 'react';
import { Settings, X, Key, CheckCircle2, AlertCircle } from 'lucide-react';
import { AIProvider, AppSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [showSuccess, setShowSuccess] = useState(false);

  // Sync prop changes to local state
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings, isOpen]);

  const handleSave = () => {
    onSave(localSettings);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-500" />
            系统设置
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Provider Selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 block">
              AI 模型提供商
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setLocalSettings({ ...localSettings, provider: AIProvider.Gemini })}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                  localSettings.provider === AIProvider.Gemini
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-100 hover:border-slate-200 text-slate-600'
                }`}
              >
                <span className="font-bold text-sm">Google Gemini</span>
                <span className="text-[10px] opacity-70 mt-1">速度快 / 免费额度高</span>
              </button>
              
              <button
                onClick={() => setLocalSettings({ ...localSettings, provider: AIProvider.DeepSeek })}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                  localSettings.provider === AIProvider.DeepSeek
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-slate-100 hover:border-slate-200 text-slate-600'
                }`}
              >
                <span className="font-bold text-sm">DeepSeek</span>
                <span className="text-[10px] opacity-70 mt-1">代码能力强 / 中文优</span>
              </button>
            </div>
          </div>

          {/* API Key Input */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 flex items-center justify-between">
              API Key配置
              {localSettings.provider === AIProvider.Gemini && (
                <span className="text-xs font-normal text-slate-400">
                  如未填则使用默认 Key
                </span>
              )}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="password"
                value={localSettings.apiKey}
                onChange={(e) => setLocalSettings({ ...localSettings, apiKey: e.target.value })}
                placeholder={localSettings.provider === AIProvider.Gemini ? "默认使用系统内置 Key" : "请输入 sk- 开头的 Key"}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm font-mono text-slate-700 transition-all placeholder:text-slate-400"
              />
            </div>
            
            <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg text-xs text-slate-500">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
              <p>
                {localSettings.provider === AIProvider.Gemini 
                  ? "Gemini 3 Flash 速度极快。您可以去 Google AI Studio 免费申请 Key。" 
                  : "DeepSeek API 兼容 OpenAI 格式。模型使用 deepseek-chat (V3)。"}
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white transition-all transform active:scale-95 ${
              showSuccess ? 'bg-green-500' : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            {showSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                已保存
              </>
            ) : (
              "保存设置"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;