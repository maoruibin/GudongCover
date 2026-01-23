
import React, { useRef, useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import { Platform } from '../types';
import { Download, Share2, AlertCircle, Maximize2 } from 'lucide-react';

interface PreviewSectionProps {
  html: string | null;
  platform: Platform;
  isLoading: boolean;
}

// Standard HD dimensions for the AI to target
const BASE_WIDTH = 1080;
const RATIO_WECHAT = 2.35;
const RATIO_XHS = 3 / 4;

const PreviewSection: React.FC<PreviewSectionProps> = ({ html, platform, isLoading }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Calculate the target height based on platform
  const targetHeight = platform === Platform.WeChat 
    ? BASE_WIDTH / RATIO_WECHAT 
    : BASE_WIDTH / RATIO_XHS;

  // Handle auto-scaling of the canvas to fit the parent container
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const parentWidth = containerRef.current.clientWidth;
        // Calculate scale needed to fit 1080px into the current parent width
        const newScale = parentWidth / BASE_WIDTH;
        setScale(newScale);
      }
    };

    // Initial calculation
    updateScale();

    // Listen for resize
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [platform]); // Re-run if platform changes (though width is main factor)

  const handleDownload = async () => {
    if (!contentRef.current || !html) return;

    try {
      // Capture the scaled element, but we tell html2canvas to treat it as if it's full size
      // We explicitly capture the contentRef which has the 1080px width
      const canvas = await html2canvas(contentRef.current, {
        useCORS: true,
        scale: 2, // 2x output for ultra HD (2160px width)
        backgroundColor: null,
        logging: false,
        // Critical: Ignore the transform scale during capture so we get full res
        onclone: (clonedDoc, element) => {
            element.style.transform = 'none';
        }
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `gudong-cover-${platform === Platform.WeChat ? 'wechat' : 'xhs'}-${Date.now()}.png`;
      link.click();
    } catch (error) {
      console.error('Download failed:', error);
      alert('生成图片失败，请重试。');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 px-1">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          设计预览
          <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full hidden sm:inline-block">
            Canvas: {BASE_WIDTH}px
          </span>
        </h2>
        {html && (
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 text-sm bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95"
          >
            <Download className="w-4 h-4" />
            下载高清 PNG
          </button>
        )}
      </div>

      {/* Main Preview Area */}
      <div 
        className="flex-grow bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-center p-4 md:p-8 overflow-hidden relative shadow-inner isolate"
      >
        {/* Loading State Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-50 rounded-2xl">
            <div className="flex flex-col items-center">
              <div className="animate-spin h-10 w-10 border-4 border-slate-900 border-t-transparent rounded-full mb-4"></div>
              <p className="text-slate-900 font-bold animate-pulse">AI 正在疯狂设计中...</p>
              <p className="text-xs text-slate-500 mt-2">Gemini 3 Flash 正在思考布局</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!html && !isLoading && (
          <div className="text-center text-slate-400 z-10 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Maximize2 className="w-8 h-8 opacity-40" />
            </div>
            <p className="text-xl font-bold text-slate-500">等待生成...</p>
            <p className="text-sm opacity-70 mt-2 max-w-xs mx-auto leading-relaxed">
              在左侧输入主题，AI 将自动为您生成适配 <br/>
              <span className="font-semibold text-slate-600">{platform === Platform.WeChat ? '微信公众号 (2.35:1)' : '小红书 (3:4)'}</span> 的高清封面。
            </p>
          </div>
        )}

        {/* Render Container - Hidden when no HTML to prevent layout shifting/centering issues */}
        <div 
            ref={containerRef} 
            className={`w-full h-full items-center justify-center relative ${html ? 'flex' : 'hidden'}`}
            style={{ 
                // Force container to match aspect ratio structure roughly to avoid huge jumps
                aspectRatio: platform === Platform.WeChat ? '2.35/1' : 'auto' 
            }}
        >
          {html && (
            // TRANSFORM WRAPPER: This scales the huge content down to fit the screen
            <div
                style={{
                    width: BASE_WIDTH,
                    height: targetHeight,
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center',
                    // Optional: add a shadow to the canvas itself
                    boxShadow: '0 20px 50px -12px rgba(0, 0, 0, 0.25)' 
                }}
                className="transition-transform duration-200 ease-out"
            >
                {/* CONTENT: This is the actual 1080px element */}
                <div
                    ref={contentRef}
                    className="w-full h-full bg-white text-slate-900 overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      {html && (
        <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-xs rounded-xl flex gap-3 items-start border border-blue-100 animate-in slide-in-from-bottom-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="leading-relaxed opacity-90">
            <strong>预览已自适应缩放。</strong> 下载时将输出宽 {BASE_WIDTH}px 的原始高清图。
            {platform === Platform.WeChat && " 完美适配微信公众号封面尺寸 (2.35:1)。"}
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewSection;
