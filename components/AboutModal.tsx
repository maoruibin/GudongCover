import React from 'react';
import { X, Github, Twitter, ExternalLink, Smartphone, BookOpen, User, Heart, PanelRight, Layers, ArrowRight } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const projects = [
  {
    name: "inBox 笔记",
    desc: "极简本地笔记应用，Local-First",
    url: "https://doc.gudong.site/inbox/",
    icon: <Smartphone className="w-4 h-4 text-blue-500" />
  },
  {
    name: "WeiMD",
    desc: "公众号 Markdown 排版工具",
    url: "https://weimd.gudong.site/",
    icon: <BookOpen className="w-4 h-4 text-green-500" />
  },
  {
    name: "SlideNote",
    desc: "Chrome 浏览器侧边栏笔记插件",
    url: "https://github.com/maoruibin/SlideNote",
    icon: <PanelRight className="w-4 h-4 text-orange-500" />
  },
  {
    name: "inBox Card",
    desc: "开源卡片笔记共建项目",
    url: "https://github.com/maoruibin/inBoxCard",
    icon: <Layers className="w-4 h-4 text-purple-500" />
  }
];

const socials = [
  { name: "Blog", url: "https://blog.gudong.site", icon: <User className="w-4 h-4" /> },
  { name: "GitHub", url: "https://github.com/maoruibin", icon: <Github className="w-4 h-4" /> },
  { name: "Twitter", url: "https://x.com/dxgudong", icon: <Twitter className="w-4 h-4" /> },
  { name: "即刻", url: "https://web.okjike.com/u/3f000c6d-bd82-4695-a404-f184652e622e", icon: <span className="font-bold text-xs">J</span> },
  { name: "微博", url: "https://weibo.com/u/1874136301", icon: <span className="font-bold text-xs">WB</span> },
  { name: "小红书", url: "https://www.xiaohongshu.com/user/profile/6690863b000000001e00e6a4", icon: <span className="font-bold text-xs">RED</span> },
];

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header Background - Changed from colorful gradient to clean dark slate */}
        <div className="h-32 bg-slate-800 relative">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-1.5 rounded-full transition-colors backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Section */}
        <div className="px-8 pb-8 -mt-12 relative">
            <div className="flex justify-between items-end">
                <div className="bg-white p-1.5 rounded-2xl shadow-lg inline-block">
                    <img 
                        src="https://blog.gudong.site/assets/profile/gudong_2023.png" 
                        alt="Gudong" 
                        className="w-20 h-20 rounded-xl object-cover"
                    />
                </div>
                <div className="flex gap-2 mb-2">
                    {socials.slice(0, 3).map((social, idx) => (
                        <a 
                            key={idx}
                            href={social.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                            title={social.name}
                        >
                            {social.icon}
                        </a>
                    ))}
                </div>
            </div>
            
            <div className="mt-4">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    咕咚 (Gudong)
                </h2>
                <p className="text-sm font-medium text-blue-600 mt-1">
                    10年+ Android 工程师 / 独立开发者
                </p>
                <p className="text-slate-600 mt-3 text-sm leading-relaxed">
                    坚持 Local-First，推崇 Vibe Coding。
                    我是一名爱折腾、爱分享的程序员，致力于开发简单、好用的工具。
                    Gudong Cover 坚持开源，如果觉得好用，欢迎关注我的公众号。
                </p>
            </div>

            {/* WeChat Official Account CTA */}
            <div className="mt-6 relative group">
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-20">
                    <div className="bg-white p-3 rounded-xl shadow-xl border border-slate-100 w-48 text-center">
                        <img 
                            src="https://blog.gudong.site/assets/profile/gongzhonghao.jpg" 
                            alt="公众号二维码" 
                            className="w-full rounded-lg mb-2"
                        />
                        <p className="text-xs text-slate-500">扫码关注「咕咚同学」</p>
                    </div>
                    {/* Arrow */}
                    <div className="w-4 h-4 bg-white transform rotate-45 absolute -bottom-2 left-1/2 -translate-x-1/2 border-b border-r border-slate-100"></div>
                </div>

                <button className="w-full py-3 bg-[#07C160] hover:bg-[#06ad56] text-white rounded-xl font-bold shadow-lg shadow-green-100 transition-all flex items-center justify-center gap-2 group-hover:shadow-green-200">
                    <Smartphone className="w-5 h-5" />
                    <span>关注公众号：咕咚同学</span>
                </button>
                <p className="text-center text-xs text-slate-400 mt-2">
                    👆 鼠标悬停或长按查看二维码
                </p>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100 my-6"></div>

            {/* Projects */}
            <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                    精选独立开发作品
                </h3>
                <div className="grid gap-3">
                    {projects.map((project, idx) => (
                        <a 
                            key={idx}
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                {project.icon}
                            </div>
                            <div className="ml-3 flex-1">
                                <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-700">
                                    {project.name}
                                </h4>
                                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                                    {project.desc}
                                </p>
                            </div>
                            <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-blue-400" />
                        </a>
                    ))}
                </div>
                
                {/* View All Projects Link */}
                <a 
                  href="https://doc.gudong.site/"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-1 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors py-2 group"
                >
                  查看更多作品
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
            </div>

            {/* More Socials */}
            <div className="mt-4 pt-6 border-t border-slate-100">
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                    社交媒体
                </h3>
                <div className="flex flex-wrap gap-3">
                     {socials.slice(3).map((social, idx) => (
                        <a 
                            key={idx}
                            href={social.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-xs font-medium text-slate-600 transition-colors"
                        >
                            {social.icon}
                            {social.name}
                        </a>
                    ))}
                </div>
            </div>
            
             <div className="mt-8 text-center">
                <p className="text-xs text-slate-300 flex items-center justify-center gap-1">
                    Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> by Gudong
                </p>
            </div>

        </div>
      </div>
    </div>
  );
};

export default AboutModal;