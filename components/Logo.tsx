import React from 'react';

interface LogoProps {
  className?: string;
  withText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "w-8 h-8", withText = false }) => {
  return (
    <div className="flex items-center gap-2">
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-lg shadow-violet-200 text-white overflow-hidden ${className}`}>
        {/* Subtle inner gloss/noise texture */}
        <div className="absolute inset-0 bg-white opacity-[0.08] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 0% 0%, white 0%, transparent 60%)' }}></div>
        
        {/* The Icon: A stylized 'G' forming a frame, completed by a sparkle */}
        <svg 
          viewBox="0 0 512 512" 
          className="w-[65%] h-[65%] fill-none drop-shadow-md"
        >
          {/* The G Frame Path - Matches the branding assets */}
          <path 
            d="M340 130H160C121.34 130 90 161.34 90 200V312C90 350.66 121.34 382 160 382H320C358.66 382 390 350.66 390 312V256H290" 
            stroke="currentColor" 
            strokeWidth="48" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
            
          {/* The Sparkle (Yellow/Gold) */}
          <path 
            d="M430 96C430 96 440 130 440 130C440 130 474 140 474 140C474 140 440 150 440 150C440 150 430 184 430 184C430 184 420 150 420 150C420 150 386 140 386 140C386 140 420 130 420 130C420 130 430 96 430 96Z" 
            fill="#FDE047"
            className="animate-pulse"
          />
        </svg>
      </div>
      
      {withText && (
        <h1 className="font-bold text-lg md:text-xl tracking-tight text-slate-900">
          Gudong <span className="text-violet-600 font-normal">Cover</span>
        </h1>
      )}
    </div>
  );
};

export default Logo;