import React from 'react';
import { Platform } from '../types';
import { Layout, Smartphone, Wand2 } from 'lucide-react';

interface InputSectionProps {
  topic: string;
  setTopic: (topic: string) => void;
  platform: Platform;
  setPlatform: (platform: Platform) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({
  topic,
  setTopic,
  platform,
  setPlatform,
  onGenerate,
  isLoading,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 flex flex-col gap-6 h-full border border-slate-100">
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
      <div className="flex-grow flex flex-col">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          文章主题 / 标题
        </label>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="例如：适合程序员的5个远程办公技巧..."
          className="w-full h-40 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none text-slate-700 transition-all"
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={onGenerate}
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
  );
};

export default InputSection;