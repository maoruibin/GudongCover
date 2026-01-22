import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { Platform } from '../types';
import { Download, Share2, AlertCircle } from 'lucide-react';

interface PreviewSectionProps {
  html: string | null;
  platform: Platform;
  isLoading: boolean;
}

const PreviewSection: React.FC<PreviewSectionProps> = ({ html, platform, isLoading }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!containerRef.current || !html) return;

    try {
      // We need to capture the specific child div that contains the design
      // containerRef points to the wrapper that has the aspect ratio.
      const elementToCapture = containerRef.current;

      const canvas = await html2canvas(elementToCapture, {
        useCORS: true,
        scale: 3, // Higher scale for better quality
        backgroundColor: null, 
        logging: false,
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      // Updated filename to match branding
      link.download = `gudong-cover-${platform === Platform.WeChat ? 'wechat' : 'xhs'}-${Date.now()}.png`;
      link.click();
    } catch (error) {
      console.error('Download failed:', error);
      alert('生成图片失败，请重试。');
    }
  };

  // WeChat: 2.35:1
  // XHS: 3:4
  const containerClass = platform === Platform.WeChat 
    ? 'aspect-[2.35/1] max-w-full' 
    : 'aspect-[3/4] max-w-[400px] mx-auto'; 

  return (
    <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
             <h2 className="text-xl font-bold text-slate-800">设计预览</h2>
             {html && (
                <button 
                    onClick={handleDownload}
                    className="flex items-center gap-2 text-sm bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900 transition-colors shadow-md"
                >
                    <Download className="w-4 h-4" />
                    下载 PNG
                </button>
             )}
        </div>

      <div className="flex-grow bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-center p-4 md:p-8 overflow-hidden relative shadow-inner">
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-20 rounded-2xl">
            <div className="flex flex-col items-center">
                <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mb-3"></div>
                <p className="text-purple-700 font-medium animate-pulse">AI 正在设计中...</p>
            </div>
          </div>
        )}

        {!html && !isLoading && (
          <div className="text-center text-slate-400">
            <Share2 className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">输入主题后，点击生成</p>
            <p className="text-sm opacity-70 mt-1">AI 将为您创建独特的设计</p>
          </div>
        )}

        {html && (
          <div className={`w-full shadow-2xl transition-all duration-500 bg-white ${containerClass}`}>
            {/* The ref is here to capture exactly this box */}
            <div
              ref={containerRef}
              className="w-full h-full text-slate-900" 
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        )}
      </div>
      
      {html && (
          <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-xs rounded-lg flex gap-2 items-start border border-blue-100">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>
                预览图根据屏幕宽度自适应。下载时会生成高清图片 (WeChat ~900px+, 小红书 ~1200px+)。
            </p>
          </div>
      )}
    </div>
  );
};

export default PreviewSection;