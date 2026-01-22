<p align="center">
  <img src="https://gudong.s3.bitiful.net/images/gudong-cover-banner.png" width="800" alt="Gudong Cover Banner">
  <!-- TODO: 请替换为你实际的项目 Banner 图片链接，建议是生成的封面拼图 -->
</p>

<h1 align="center">Gudong Cover 咕咚封面</h1>

<p align="center">
  <strong>Focus on writing, let AI handle the face</strong><br>
  专注写作，门面交给 AI
</p>

<p align="center">
  双平台 AI 封面生成器 | 微信公众号 & 小红书 | Gemini 3 Flash 驱动
</p>

<p align="center">
  <img alt="GitHub version" src="https://img.shields.io/badge/version-1.0.0-purple">
  <a href="https://github.com/maoruibin/GudongCover/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-green"></a>
  <img alt="Powered by Gemini" src="https://img.shields.io/badge/Powered%20by-Gemini%203%20Flash-blue">
</p>

---

## 📖 简介

**Gudong Cover** 是一款专为内容创作者打造的极简封面生成工具。

作为一名写了十几年代码和文章的开发者，我深知“写作心流”被打断的痛苦。当你写完一篇干货满满的文章，却因为找不到一张合适的封面图而陷入半小时的“找图焦虑”时，表达的摩擦力就产生了。

Gudong Cover 的使命是**消除这最后三公里的摩擦力**。你只需要输入文章主题，剩下的排版、配色、文案提炼，全部交给 AI。

👉 **[阅读设计背后的故事：我为什么要造这个工具？](doc/marketing_launch.md)**

---

## ✨ 核心特性

- **🤖 智能文案提炼** — 无论你输入多长的一段话，AI 自动提炼核心主标题和副标题。
- **🎨 双模式切换** — 针对不同平台优化：
    - **公众号模式 (2.35:1)**：极简、深色、强调效率与专业感。
    - **小红书模式 (3:4)**：高饱和、大字报、强调情绪与点击欲。
- **⚡️ 极速生成** — 基于 Google Gemini 3 Flash 模型，平均生成时间 < 2 秒。
- **🖼️ 纯前端渲染** — 使用 React + Tailwind CSS 实时绘制，所见即所得。
- **💾 一键导出** — 自动生成高分辨率 PNG 图片，即下即用。

---

## 🎯 场景对比

| 模式 | 微信公众号 (WeChat) | 小红书 (Xiaohongshu) |
|------|-------------------|-------------------|
| **比例** | 2.35 : 1 (横屏) | 3 : 4 (竖屏) |
| **风格** | 极简、商务、极客 | 杂志感、高饱和、标题党 |
| **布局** | 左文右图，留白呼吸感 | 上下结构，大字报冲击力 |
| **适用** | 技术文章、深度观点、干货 | 生活方式、种草、经验分享 |
| **核心逻辑** | `降噪`：提炼 4-8 字核心词 | `爆款`：制造情绪与视觉张力 |

---

## 🛠️ 技术栈

本项目基于 **Vibe Coding** 理念构建，强调代码的简洁与美感。

- **Framework**: [React 19](https://react.dev/) (Vite)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI Model**: [Google Gemini 3 Flash](https://ai.google.dev/)
- **Iconography**: [Lucide React](https://lucide.dev/)
- **Export**: [html2canvas](https://html2canvas.hertzen.com/)

---

## 📦 快速开始

### 前置要求
你需要一个 Google Gemini API Key。可以从 [Google AI Studio](https://aistudio.google.com/) 免费获取。

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/maoruibin/GudongCover.git
   cd GudongCover
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   在项目根目录创建 `.env` 文件，填入你的 API Key：
   ```env
   # 必须以 VITE_ 开头
   VITE_GOOGLE_AI_API_KEY=your_api_key_here
   ```
   *(注：在代码中我们使用 `process.env.API_KEY` 是为了配合 WebContainer 环境，本地开发请使用 Vite 的环境变量规则)*

4. **启动项目**
   ```bash
   npm run dev
   ```

---

## 📮 关注作者

<p align="center">
  我是咕咚，一个喜欢写代码、写文章的独立开发者。
  <br>
  扫码关注公众号，围观我的独立开发之路。
</p>

<p align="center">
  <img src="https://blog.gudong.site/assets/profile/gongzhonghao.jpg" width="180" alt="公众号二维码">
</p>

---

## 💖 支持项目

如果 Gudong Cover 帮你节省了找封面的时间，欢迎请我喝杯咖啡 ☕️，这将支持我开发更多好玩的工具。

<table align="center">
  <tr>
    <td align="center">
      <img src="https://doc.gudong.site/assets/img/wechat-donate.5e615ccb.jpg" width="180" alt="微信打赏"/>
    </td>
    <td align="center">
      <img src="https://doc.gudong.site/assets/img/alipay-donate.7ec06101.jpg" width="180" alt="支付宝打赏"/>
    </td>
  </tr>
</table>

---

## 🌟 更多作品

- **[SlideNote 侧边笔记](https://github.com/maoruibin/SlideNote)**: Chrome 浏览器侧边栏笔记插件，跨设备自动同步。
- **博客**: [blog.gudong.site](https://blog.gudong.site/)

---

## 📄 开源协议

[MIT License](LICENSE)

---

> **Make your ideas visible.**
>
> 让观点被看见。
