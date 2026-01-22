import React, { useState } from 'react';
import { X, Heart, Coffee } from 'lucide-react';

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PaymentMethod = 'wechat' | 'alipay' | null;

const DonateModal: React.FC<DonateModalProps> = ({ isOpen, onClose }) => {
  const [method, setMethod] = useState<PaymentMethod>(null);

  if (!isOpen) return null;

  const wechatQr = "https://gudong.s3.bitiful.net/img/20260122170410597.png";
  const alipayQr = "https://gudong.s3.bitiful.net/img/20260122170410586.jpg";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Content */}
        <div className="pt-8 px-6 text-center">
          <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-rose-100 transform rotate-3">
             <Heart className="w-8 h-8 text-rose-500 fill-rose-500 animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">支持开发者</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Gudong Cover 是一个免费开源项目。<br/>
            如果它帮你节省了时间，<br/>
            欢迎请我喝杯咖啡，这将是我更新的动力 ☕️
          </p>
        </div>

        {/* Payment Selection */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => setMethod('wechat')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all border ${
                method === 'wechat'
                  ? 'bg-[#07C160] border-[#07C160] text-white shadow-lg shadow-green-100 ring-2 ring-green-100'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-[#07C160] hover:text-[#07C160]'
              }`}
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M8.5,14c-4.1,0-7.5-2.9-7.5-6.5S4.4,1,8.5,1c4.1,0,7.5,2.9,7.5,6.5S12.6,14,8.5,14z M17,14c0-0.4-0.1-0.8-0.2-1.2 c1.7-0.7,2.7-2.1,2.7-3.6c0-0.2,0-0.4-0.1-0.6c1.3,1.2,2.1,2.8,2.1,4.6c0,3.6-3.4,6.5-7.5,6.5c-0.8,0-1.6-0.1-2.4-0.3 c-2.2,1.2-4.5,1.2-4.5,1.2c0.6-0.8,0.7-1.8,0.6-2.5C6.1,17.4,4.5,15.8,4.5,14H17z" />
              </svg>
              微信
            </button>
            <button
              onClick={() => setMethod('alipay')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all border ${
                method === 'alipay'
                  ? 'bg-[#1677FF] border-[#1677FF] text-white shadow-lg shadow-blue-100 ring-2 ring-blue-100'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-[#1677FF] hover:text-[#1677FF]'
              }`}
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 1024 1024">
                <path d="M876.16 237.952c-15.616-6.08-164.864-58.496-164.864-58.496-80.128-29.184-219.008 41.6-219.008 41.6L443.52 79.36 348.16 79.36l0 200.704c-63.552 20.352-126.976 43.136-126.976 43.136 0 0 10.112 70.4 121.856 34.048 0 0 0.896 166.4-89.984 225.024 -90.88 58.624-184.32 23.936-184.32 23.936 0 0-48.512 119.296 122.368 153.6 170.88 34.304 316.416-95.232 316.416-95.232l-1.024 286.72 96.256 0 0-333.312c140.8-63.488 238.08-144.384 238.08-144.384l13.312-70.144c0 0-104.96 66.56-239.104 117.76l0-149.376 256 94.72L876.16 237.952zM369.664 532.48c-44.032-26.624-51.2-69.632-51.2-69.632 64 0 108.032 6.656 126.976 13.312L369.664 532.48z" />
              </svg>
              支付宝
            </button>
          </div>

          {/* QR Code Display Area */}
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${method ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center">
              {method && (
                 <img 
                 src={method === 'wechat' ? wechatQr : alipayQr} 
                 alt={`${method} QR Code`}
                 className="w-64 h-64 rounded-xl object-contain mix-blend-multiply"
               />
              )}
              <p className="text-xs text-slate-400 mt-3 font-medium">
                {method === 'wechat' ? '打开微信扫一扫' : '打开支付宝扫一扫'}
              </p>
            </div>
          </div>
          
          {!method && (
            <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
               <Coffee className="w-8 h-8 text-slate-300 mx-auto mb-2" />
               <p className="text-xs text-slate-400">点击上方按钮选择支付方式</p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-slate-50 py-3 text-center border-t border-slate-100">
             <p className="text-[10px] text-slate-400">Thanks for your support ❤️</p>
        </div>

      </div>
    </div>
  );
};

export default DonateModal;