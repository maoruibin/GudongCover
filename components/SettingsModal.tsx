import React, { useEffect, useState } from 'react';
import { Settings, X, CheckCircle2, KeyRound } from 'lucide-react';
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
             <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-slate-400" />
                自定义 API Key <span className="text-slate-400 font-normal text-xs">(可选)</span>
             </label>
             <input
                type="password"
                value={localSettings.apiKey || ''}
                onChange={(e) => setLocalSettings({ ...localSettings, apiKey: e.target.value })}
                placeholder={localSettings.provider === AIProvider.DeepSeek ? "sk-..." : "AIza..."}
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm font-mono text-slate-600 placeholder:text-slate-300"
             />
             <div className="text-xs text-slate-400 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p>💡 <strong>提示：</strong></p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>如果您留空，将尝试使用系统内置的免费 Key (可能不稳定)。</li>
                    <li>建议填入您自己的 Key 以获得最佳速度和稳定性。</li>
                    <li>Key 仅存储在本地浏览器，不会上传服务器。</li>
                </ul>
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