import React, { useState } from 'react';
import { Platform } from './types';
import { generateCoverHtml } from './services/geminiService';
import InputSection from './components/InputSection';
import PreviewSection from './components/PreviewSection';
import { Palette, Github } from 'lucide-react';

const App: React.FC = () => {
  const [platform, setPlatform] = useState<Platform>(Platform.WeChat);
  const [topic, setTopic] = useState<string>('');
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setIsLoading(true);
    setGeneratedHtml(null); // Clear previous result while loading

    try {
      const html = await generateCoverHtml(topic, platform);
      setGeneratedHtml(html);
    } catch (error) {
      console.error(error);
      alert("生成封面时出错，请确保您的 API Key 配置正确。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-purple-100 selection:text-purple-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center text-white shadow-md">
              <Palette className="w-5 h-5" />
            </div>
            <h1 className="font-bold text-lg md:text-xl tracking-tight text-slate-900">
              Gudong <span className="text-purple-600 font-normal">Cover</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-xs font-medium bg-slate-100 px-3 py-1 rounded-full text-slate-500">
              由 Gemini 3 Flash 驱动
            </div>
            <a 
              href="https://github.com/maoruibin/GudongCover" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-800 transition-colors"
              title="View Source on GitHub"
            >
              <Github className="w-6 h-6" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid lg:grid-cols-12 gap-8 lg:h-[calc(100vh-160px)] min-h-[600px]">
          
          {/* Left: Input */}
          <div className="lg:col-span-4 h-full">
            <InputSection
              topic={topic}
              setTopic={setTopic}
              platform={platform}
              setPlatform={setPlatform}
              onGenerate={handleGenerate}
              isLoading={isLoading}
            />
          </div>

          {/* Right: Preview */}
          <div className="lg:col-span-8 h-full">
             <PreviewSection 
                html={generatedHtml} 
                platform={platform} 
                isLoading={isLoading}
             />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;