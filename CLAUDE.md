# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Personalization

**Always address the user as "咕咚"** in responses.

## Development Commands

```bash
npm run dev      # Start Vite dev server (http://localhost:5173)
npm run build    # TypeScript check + Vite production build
npm run preview  # Preview production build locally
```

## Architecture

**GudongCover** is an AI-powered cover image generator for Chinese content platforms (WeChat Official Accounts, Xiaohongshu). Users input a topic, and the AI returns HTML/Tailwind code which is rendered and exported as PNG.

### Data Flow

```
User Input (topic)
    → App.tsx (state management)
    → llmService.ts (AI orchestration)
    → DeepSeek/Gemini API
    → cleanOutput() (strip markdown)
    → dangerouslySetInnerHTML (render)
    → html2canvas (export PNG)
```

### Key Architectural Decisions

1. **AI returns HTML strings**: The LLM is prompted to return raw HTML with Tailwind classes. This is rendered via `dangerouslySetInnerHTML`. The AI is trusted (not user input), so this is acceptable.

2. **Dual AI providers**: DeepSeek V3 (default, better Chinese) and Gemini 3 Flash (backup). Provider selection happens in `services/llmService.ts` via factory pattern.

3. **URL parameter integration**: Supports `?title=xxx` for seamless integration with other tools (e.g., WeiMD Markdown editor). The `getUrlParam()` helper in `App.tsx` handles both standard URL params and hash router params.

4. **Preview scaling trick**: AI generates 1080px-wide covers. For preview, CSS `transform: scale()` is used (not width/height changes) so exported image remains full resolution. The actual export uses a "ghost container" at fixed position with opacity 0.

### Critical Files

| File | Purpose |
|------|---------|
| `App.tsx` | Main state container, URL param handling, mobile/desktop layout switching |
| `services/llmService.ts` | AI API calls, provider selection, output cleaning |
| `components/PreviewSection.tsx` | HTML rendering, CSS transform scaling, html2canvas export |
| `prompts/wechatPrompt.ts` | WeChat design rules (2.35:1, dark, minimal) |
| `prompts/xhsPrompt.ts` | Xiaohongshu design rules (3:4, high saturation, bold) |
| `types.ts` | Platform enum, AIProvider enum, AppSettings interface |

### Known Pitfalls

1. **html2canvas viewport issues**: Elements positioned with `left: -9999px` render incorrectly in some browsers. The fix: use `position: fixed; top: 0; left: 0; opacity: 0; z-index: -9999` to keep elements in-viewport but invisible.

2. **AI output instability**: LLMs often wrap HTML in markdown code blocks (```html ... ```). The `cleanOutput()` function in `llmService.ts` strips these.

3. **Environment variable naming**: Vite requires `VITE_` prefix for client-side env vars, but `vite.config.ts` maps multiple naming conventions (`GEMINI_API_KEY`, `API_KEY`, `VITE_GOOGLE_AI_API_KEY`) for backward compatibility.

### Environment Variables

```bash
# For local development (.env file)
VITE_GOOGLE_AI_API_KEY=xxx    # Gemini
VITE_DEEPSEEK_API_KEY=xxx     # DeepSeek
```

Users can also provide custom API keys via the settings UI (stored in localStorage).

### Platform Dimensions

- **WeChat**: 2.35:1 ratio (1080px × 460px) - horizontal, dark theme
- **Xiaohongshu**: 3:4 ratio (1080px × 1440px) - vertical, high saturation
