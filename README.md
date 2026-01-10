# 🚀 OpenCode Configuration

My personal OpenCode AI configuration with multi-provider support, MCP servers, and custom skills.

![OpenCode](https://img.shields.io/badge/OpenCode-AI%20Coding-blue?style=for-the-badge&logo=ai)
![Models](https://img.shields.io/badge/20+-Models-green?style=for-the-badge)
![Security](https://img.shields.io/badge/Gitleaks-Scanning-red?style=for-the-badge)

---

## ✨ Features

### 🔐 Multi-Provider Authentication

| Provider | Models | Auth |
|----------|--------|------|
| **Google (Antigravity)** | Gemini 3 Pro, Claude 4.5 | OAuth |
| **OpenAI (Codex)** | GPT 5.2 series | OAuth |
| **Z.AI** | GLM-4.7 (Coding Plan) | API Key |
| **Minimax** | Via OpenRouter BYOD | API Key |

### 🤖 Available Models

#### Google (Antigravity + CLI)
```
🤖 Thinking Models
├── antigravity-gemini-3-pro-low      (1M ctx / 64K out)
├── antigravity-gemini-3-pro-high     (1M ctx / 64K out)
├── antigravity-claude-sonnet-4-5     (200K ctx / 64K out)
├── antigravity-claude-opus-4-5       (200K ctx / 64K out)
└── Thinking variants (low/medium/high)

⚡ Fast Models
├── antigravity-gemini-3-flash        (1M ctx / 64K out)
├── gemini-3-pro-preview              (1M ctx / 64K out)
└── gemini-3-flash-preview            (1M ctx / 64K out)
```

#### OpenAI (Codex OAuth)
```
🎯 GPT 5.2 Series
├── gpt-5.2-none/medium/high/xhigh    (272K ctx / 128K out)
├── gpt-5.2-codex-low/medium/high     (272K ctx / 128K out)
└── Reasoning effort: none → xhigh
```

#### Coding Plans (Z.AI + OpenRouter)

| Provider | Plan | Route | Notes |
|----------|------|-------|-------|
| **Z.AI** | GLM-4.7 Coding Plan | Direct API | OpenRouter BYOK charges API cost, not coding plan |
| **OpenRouter** | Minimax BYOK | Via OpenRouter | Uses Minimax coding plan API key |

> **Why Mixed Setup?** We use OpenRouter BYOK to save on provider setup, allowing both Minimax and GLM through one provider. However, Z.AI's OpenRouter BYOK endpoint points to their API billing (not coding plan), so we use Z.AI directly for GLM models and Minimax via OpenRouter BYOK.

### 🔧 MCP Servers

| Server | Type | Purpose |
|--------|------|---------|
| **Context7** | Remote | Documentation search for any library/framework |
| **Chrome DevTools** | Local | Browser automation with Chromium |

### 🧠 Skills

| Skill | Purpose |
|-------|---------|
| **github** | GitHub workflow best practices using `gh` CLI |

---

## 📁 Structure

```
~/.config/opencode/
├── opencode.jsonc          # Main configuration
├── AGENTS.md               # Agent instructions
├── skill/
│   └── github/            # GitHub workflow skill
├── tool/
├── .github/
│   └── workflows/
│       └── gitleaks.yml   # Secret scanning
└── providers/             # Provider configs
```

---

## 🔒 Security

### Gitleaks Secret Scanning

This repo includes a GitHub Actions workflow that:

- ✅ Scans every push/PR for secrets
- ✅ Detects API keys, tokens, passwords
- ✅ Blocks commits with exposed secrets
- ✅ Creates security issues when found

---

## 🚀 Quick Start

### 1. Install OpenCode

```bash
# Using Bun (recommended)
bun install -g opencode

# Or via npm
npm install -g opencode
```

### 2. Clone This Config

```bash
git clone https://github.com/MichaelFisher1997/opencode-config.git ~/.config/opencode
```

### 3. Authenticate

```bash
# Google (Antigravity) - OAuth
opencode auth login

# OpenAI (Codex) - OAuth
opencode auth login

# ZhiPuAI - API Key
export ZHIPUAI_API_KEY="your-key"
```

### 4. Start Coding

```bash
opencode
```

---

## 💡 Usage Examples

### Use Specific Models

```bash
# Thinking model for complex tasks
opencode --model google/antigravity-claude-opus-4-5-thinking-high "Design a system"

# Fast model for quick tasks
opencode --model google/antigravity-gemini-3-flash "Fix this typo"

# Codex for coding tasks
opencode --model openai/gpt-5.2-codex-high "Write unit tests"
```

### Browser Automation

```bash
# OpenCode with Chrome DevTools
# MCP server automatically enabled for browser tasks
```

---

## ⚙️ Configuration

### Models

Configure models in `opencode.jsonc`:

```jsonc
{
  "model": "zai-coding-plan/glm-4.7",
  "small_model": "zai-coding-plan/glm-4.6v-flash",
  "provider": {
    "google": {
      "models": {
        "antigravity-gemini-3-pro-high": {
          "name": "Gemini 3 Pro High (Antigravity)",
          "thinking": true,
          "attachment": true
        }
      }
    }
  }
}
```

### MCP Servers

```jsonc
{
  "mcp": {
    "context7": {
      "type": "remote",
      "url": "https://mcp.context7.com/mcp"
    }
  }
}
```

---

## 🔧 Troubleshooting

### Authentication Issues

```bash
# Re-authenticate
opencode auth logout
opencode auth login

# Check credentials
opencode auth list
```

### Model Not Found

- Verify model name in `opencode.jsonc`
- Check plugin is loaded: `opencode models`
- Ensure authentication is complete

### MCP Server Issues

```bash
# Check MCP status
opencode mcp list

# Restart MCP servers
opencode mcp restart
```

---

## 📚 Resources

- [OpenCode Docs](https://opencode.ai/docs/)
- [Context7 MCP](https://mcp.context7.com/)
- [Gitleaks](https://github.com/gitleaks/gitleaks)
- [Antigravity Auth](https://github.com/NoeFabris/opencode-antigravity-auth)
- [Codex Auth](https://github.com/numman-ali/opencode-openai-codex-auth)

---

## 🤝 Contributing

This is a personal configuration, but feel free to:

- Fork and adapt for your needs
- Suggest improvements via issues
- Share your own OpenCode configs

---

## 📝 License

This configuration is personal and not licensed for distribution.

OpenCode and related projects have their own licenses.

---

<div align="center">

**Built with ❤️ using OpenCode**

[Star](https://github.com/MichaelFisher1997/opencode-config) • [Issues](https://github.com/MichaelFisher1997/opencode-config/issues)

</div>
