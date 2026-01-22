import React from 'react';
import { Platform } from '../types';
import { Layout, Smartphone, Wand2, AlertTriangle } from 'lucide-react';

interface InputSectionProps {
  topic: string;
  setTopic: (topic: string) => void;
  platform: Platform;
  setPlatform: (platform: Platform) => void;
  onGenerate: () => void;
  isLoading: boolean;
  usingCustomKey: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({
  topic,
  setTopic,
  platform,
  setPlatform,
  onGenerate,
  isLoading,
  usingCustomKey,
}) => {
  const charCount = topic.length;
  // Threshold for warning about length
  const MAX_FREE_CHARS = 800;
  // Only show the warning box if not using a custom key AND text is long
  const showWarningBox = !usingCustomKey && charCount > MAX_FREE_CHARS;
  // Always highlight count if long
  const isLong = charCount > MAX_FREE_CHARS;

  // Wrapper for generate to add haptic feedback
  const handleGenerate = () => {
    if (navigator.vibrate) {
        navigator.vibrate(15); // Light tap feedback
    }
    onGenerate();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 flex flex-col gap-6 h-full border border-slate-100 relative">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
          <Wand2 className="w-6 h-6 text-purple-600" />
          内容设置
        </h2>
        <p className="text-slate-500 text-sm">
          输入您的文章主题或粘贴内容摘要，AI 将为您生成匹配的封面。
        </p>
      </div>

      {/* Platform Toggle */}
      <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-xl">
        <button
          onClick={() => setPlatform(Platform.WeChat)}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
            platform === Platform.WeChat
              ? 'bg-white text-green-700 shadow-sm ring-1 ring-black/5'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Layout className="w-4 h-4" />
          微信公众号
        </button>
        <button
          onClick={() => setPlatform(Platform.Xiaohongshu)}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
            platform === Platform.Xiaohongshu
              ? 'bg-white text-rose-600 shadow-sm ring-1 ring-black/5'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          小红书
        </button>
      </div>

      {/* Text Input */}
      <div className="flex-grow flex flex-col min-h-0">
        <div className="flex justify-between items-center mb-2">
           <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
             文章主题 / 标题
           </label>
           {/* Character Count */}
           <span className={`text-xs transition-colors ${isLong ? 'text-orange-500 font-bold' : 'text-slate-300'}`}>
             {charCount} 字
           </span>
        </div>
        
        <div className="relative flex-grow flex flex-col">
            <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="例如：适合程序员的5个远程办公技巧..."
            // Increased min-height to 300px for better visibility on both mobile and desktop
            className={`w-full flex-1 min-h-[300px] lg:min-h-0 p-4 rounded-xl border ${isLong ? 'border-orange-300 focus:ring-orange-200' : 'border-slate-200 focus:ring-purple-500'} bg-slate-50 focus:bg-white focus:ring-2 focus:border-transparent outline-none resize-none text-slate-700 transition-all text-base leading-relaxed`}
            />
        </div>

        {/* Token Warning (Only for default key users) */}
        {showWarningBox && (
            <div className="mt-2 p-3 bg-orange-50 border border-orange-100 rounded-lg flex items-start gap-2 animate-in fade-in slide-in-from-top-1">
                <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <div className="text-xs text-orange-700 leading-relaxed">
                    <p className="font-bold">内容较长</p>
                    <p className="opacity-90 mt-0.5">
                        公共 Token 额度有限，长文本可能导致生成失败。建议精简内容，或在设置中<span className="underline decoration-dashed cursor-help" title="配置自定义 Key 后将不再提示此警告">配置您的 API Key</span>。
                    </p>
                </div>
            </div>
        )}
      </div>

      {/* Mobile Spacer: Prevents content from being hidden behind the fixed button */}
      <div className="h-24 md:hidden shrink-0"></div>

      {/* Generate Button: Sticky Bottom on Mobile, Static on Desktop */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-6 bg-white/80 backdrop-blur-xl border-t border-slate-200 z-50 md:static md:bg-transparent md:p-0 md:border-0 md:z-auto transition-all">
        <div className="max-w-7xl mx-auto md:max-w-none w-full">
            <button
            onClick={handleGenerate}
            disabled={isLoading || !topic.trim()}
            className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] ${
                isLoading || !topic.trim()
                ? 'bg-slate-300 cursor-not-allowed'
                : platform === Platform.WeChat
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-green-200 hover:from-green-600 hover:to-emerald-700'
                : 'bg-gradient-to-r from-rose-500 to-pink-600 hover:shadow-rose-200 hover:from-rose-600 hover:to-pink-700'
            }`}
            >
            {isLoading ? (
                <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                生成中...
                </>
            ) : (
                <>
                <Wand2 className="w-5 h-5" />
                生成封面
                </>
            )}
            </button>
        </div>
      </div>

    </div>
  );
};

export default InputSection;