
import React, { useRef, useEffect, useState } from 'react';
import { domToPng } from 'modern-screenshot';
import { Platform } from '../types';
import { Download, AlertCircle, Maximize2 } from 'lucide-react';

interface PreviewSectionProps {
  html: string | null;
  platform: Platform;
  isLoading: boolean;
}

// Standard HD dimensions
const BASE_WIDTH = 1080;
const RATIO_WECHAT = 2.35;
const RATIO_XHS = 3 / 4;

const PreviewSection: React.FC<PreviewSectionProps> = ({ html, platform, isLoading }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const renderRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);

  const targetHeight = platform === Platform.WeChat
    ? BASE_WIDTH / RATIO_WECHAT
    : BASE_WIDTH / RATIO_XHS;

  // Auto-scale calculation
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const parentWidth = containerRef.current.clientWidth;
        const parentHeight = containerRef.current.clientHeight;

        if (parentWidth === 0 || parentHeight === 0) return;

        const scaleX = parentWidth / BASE_WIDTH;
        const scaleY = parentHeight / targetHeight;
        const newScale = Math.min(scaleX, scaleY) * 0.95;

        setScale(newScale);
      }
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [platform, targetHeight, html]);

  const handleDownload = async () => {
    if (!html || isDownloading) return;
    setIsDownloading(true);

    // Store original styles
    const originalTransform = renderRef.current?.style.transform || '';

    try {
      // Wait for fonts
      await document.fonts.ready;

      // Temporarily remove scale for full-resolution capture
      if (renderRef.current) {
        renderRef.current.style.transform = 'none';
      }

      // Wait for repaint
      await new Promise(resolve => requestAnimationFrame(() => resolve(undefined)));
      await new Promise(resolve => setTimeout(resolve, 200));

      // Get the AI-generated element
      const targetElement = renderRef.current?.firstElementChild as HTMLElement;
      if (!targetElement) {
        throw new Error('No content to capture');
      }

      // Capture with modern-screenshot
      const dataUrl = await domToPng(targetElement, {
        scale: 2,
        backgroundColor: null,
      });

      // Download
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `gudong-cover-${platform === Platform.WeChat ? 'wechat' : 'xhs'}-${Date.now()}.png`;
      link.click();

    } catch (error) {
      console.error('Download failed:', error);
      alert('下载失败：' + (error as Error).message);
    } finally {
      // Restore transform
      if (renderRef.current) {
        renderRef.current.style.transform = originalTransform;
      }
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 px-1">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          设计预览
          <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full hidden sm:inline-block">
            {BASE_WIDTH}px × {Math.round(targetHeight)}px
          </span>
        </h2>
        {html && (
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className={`flex items-center gap-2 text-sm bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95 ${
              isDownloading ? 'opacity-70 cursor-wait' : ''
            }`}
          >
            {isDownloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                处理中...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                下载高清 PNG
              </>
            )}
          </button>
        )}
      </div>

      {/* Preview Area */}
      <div
        className="flex-grow bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-center p-4 md:p-8 overflow-hidden relative shadow-inner"
        style={{ maxHeight: 'calc(100vh - 280px)', minHeight: '400px' }}
      >
        {/* Loading */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-50 rounded-2xl">
            <div className="flex flex-col items-center">
              <div className="animate-spin h-10 w-10 border-4 border-slate-900 border-t-transparent rounded-full mb-4" />
              <p className="text-slate-900 font-bold animate-pulse">AI 正在设计中...</p>
            </div>
          </div>
        )}

        {/* Empty */}
        {!html && !isLoading && (
          <div className="text-center text-slate-400 z-10">
            <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Maximize2 className="w-8 h-8 opacity-40" />
            </div>
            <p className="text-xl font-bold text-slate-500">等待生成...</p>
            <p className="text-sm opacity-70 mt-2">
              适配 {platform === Platform.WeChat ? '微信公众号 (2.35:1)' : '小红书 (3:4)'}
            </p>
          </div>
        )}

        {/* Render */}
        <div
          ref={containerRef}
          className={`w-full h-full items-center justify-center relative ${html ? 'flex' : 'hidden'}`}
        >
          {html && (
            <div
              ref={renderRef}
              style={{
                width: BASE_WIDTH,
                height: targetHeight,
                transform: `scale(${scale})`,
                transformOrigin: 'center center',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              }}
              className="transition-transform duration-200 flex-shrink-0"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
        </div>
      </div>

      {/* Footer Info */}
      {html && (
        <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-xs rounded-xl flex gap-3 items-start border border-blue-100">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="leading-relaxed opacity-90">
            <strong>预览已自适应缩放。</strong> 下载时将输出 {BASE_WIDTH}px × {Math.round(targetHeight)}px 原始高清图。
          </div>
        </div>
      )}

    </div>
  );
};

export default PreviewSection;
