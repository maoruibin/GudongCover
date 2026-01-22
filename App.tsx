import React, { useState, useEffect } from 'react';
import { Platform, AIProvider, AppSettings } from './types';
import { generateCoverHtml } from './services/llmService';
import InputSection from './components/InputSection';
import PreviewSection from './components/PreviewSection';
import SettingsModal from './components/SettingsModal';
import AboutModal from './components/AboutModal';
import DonateModal from './components/DonateModal';
import { Palette, Github, Settings as SettingsIcon, User, Gift } from 'lucide-react';

const DEFAULT_SETTINGS: AppSettings = {
  provider: AIProvider.DeepSeek,
  apiKey: ''
};

const App: React.FC = () => {
  const [platform, setPlatform] = useState<Platform>(Platform.WeChat);
  const [topic, setTopic] = useState<string>('');
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // About State
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Donate State
  const [isDonateOpen, setIsDonateOpen] = useState(false);

  // Load settings from local storage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('gudong_cover_settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem('gudong_cover_settings', JSON.stringify(newSettings));
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setIsLoading(true);
    setGeneratedHtml(null); // Clear previous result while loading

    try {
      const html = await generateCoverHtml(topic, platform, settings);
      setGeneratedHtml(html);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "生成封面时出错，请检查 API Key 设置。");
      // If error might be due to missing key, open settings
      if (error.message && (error.message.includes("API Key") || error.message.includes("401"))) {
         setIsSettingsOpen(true);
      }
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
          <div className="flex items-center gap-1 md:gap-2">

             {/* Donate Button - Added here */}
             <button 
              onClick={() => setIsDonateOpen(true)}
              className="p-2 text-rose-500 hover:bg-rose-50 rounded-full transition-colors relative group"
              title="请作者喝咖啡"
            >
              <Gift className="w-5 h-5" />
            </button>
             
             {/* About Button - Updated to User icon, smaller size */}
             <button 
              onClick={() => setIsAboutOpen(true)}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
              title="关于作者"
            >
              <User className="w-5 h-5" />
            </button>

             {/* Github Link */}
             <a 
              href="https://github.com/maoruibin/GudongCover" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
              title="View Source on GitHub"
            >
              <Github className="w-5 h-5" />
            </a>

             {/* Settings Button */}
             <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative group"
              title="设置 API Key"
            >
              <SettingsIcon className="w-5 h-5" />
              {/* Dot indicator if custom key is set */}
              {settings.apiKey && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></span>
              )}
            </button>

            {/* Model Indicator - Moved to far right */}
            <div className="hidden md:flex items-center gap-2 text-xs font-medium bg-slate-100 px-3 py-1.5 rounded-full text-slate-500 border border-slate-200 ml-2">
              <span>Model:</span>
              <span className={settings.provider === AIProvider.DeepSeek ? "text-indigo-600 font-bold" : "text-blue-600 font-bold"}>
                {settings.provider === AIProvider.DeepSeek ? 'DeepSeek V3' : 'Gemini 3 Flash'}
              </span>
            </div>

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
              usingCustomKey={!!settings.apiKey}
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

      {/* Modals */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
      />
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
      <DonateModal 
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
      />
    </div>
  );
};

export default App;