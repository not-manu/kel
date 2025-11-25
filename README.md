# Kel — The AI Agent that lives in your computer

[![Watch the Demo](public/thumbnail-with-yt.png)](https://www.youtube.com/watch?v=MteKGo_oHxo)

> **🏆 Winner of the Anthropic AI Hackathon in Toronto!**

Kel is an AI agent desktop application that lives on your computer. Access it instantly with a keyboard shortcut (`Control+K`) — it appears as a sleek sidebar window, ready to assist you with anything you need.

![Kel's Interface](public/kel-interface-screenshots.png)

## Features

- **Always Accessible**: Toggle Kel with `Control+K` from anywhere on your system
- **Sidebar Experience**: Clean, distraction-free interface that docks to the edge of your screen
- **Persistent Conversations**: All your chats are saved locally in a SQLite database
- **Privacy-First**: Everything runs locally on your machine — your data never leaves your computer
- **Multi-Model Support**: Powered by OpenRouter, giving you access to multiple AI models

<!-- ## Installation

### Prerequisites

- **macOS** (Windows and Linux support coming soon)
- **OpenRouter API Key**: Sign up at [OpenRouter](https://openrouter.ai) to get your API key
- **Screen Recording Permission**: The app may request screen capture permissions to run properly

### Download

1. Download the latest release for your platform from the [Releases](https://github.com/not-manu/kel/releases) page
2. Open the downloaded `.dmg` file (macOS)
3. Drag Kel to your Applications folder
4. Launch Kel and grant necessary permissions when prompted

### First-Time Setup

1. Launch Kel (it will appear in your system tray)
2. Press `Control+K` to open the sidebar
3. Navigate to Settings
4. Enter your OpenRouter API key
5. Select your preferred AI model
6. Start chatting!

## Usage

### Keyboard Shortcuts

- `Control+K` — Show/hide Kel
- `Control+J` — Switch sidebar position (left/right edge)

### Supported API Providers

Currently, Kel supports:

- **OpenRouter** (required) — Access to multiple AI models including Claude, GPT-4, and more

_Note: Direct Anthropic API support is planned for future releases._ -->

## Development

Want to contribute or build from source? Check out the development setup below.

### Prerequisites

- Node.js 18+ (or compatible version)
- pnpm package manager

### Setup

```bash
# Clone the repository
git clone https://github.com/not-manu/kel.git
cd kel

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Run in development mode
pnpm dev
```

### Available Scripts

```bash
pnpm dev              # Start development server with hot reload
pnpm build            # Build for production
pnpm build:mac        # Build and package for macOS
pnpm build:win        # Build and package for Windows
pnpm build:linux      # Build and package for Linux

pnpm typecheck        # Run TypeScript type checking
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier

pnpm db:generate      # Generate database migrations
pnpm db:push          # Push schema changes to database
pnpm db:studio        # Open Drizzle Studio (database GUI)
```

## Tech Stack

- **Framework**: Electron (multi-process architecture)
- **Frontend**: React 19 with TypeScript
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v4
- **Database**: SQLite with Drizzle ORM
- **AI Integration**: Vercel AI SDK + OpenRouter
- **UI Components**: Radix UI primitives
- **Forms**: React Hook Form with Zod validation
- **State Management**: TanStack Query (React Query)

## Project Structure

```
src/
├── main/          # Electron main process (Node.js backend)
│   ├── api/       # IPC handlers for renderer communication
│   ├── db/        # Database schema and configuration
│   └── lib/       # Utilities and OpenRouter integration
├── preload/       # Electron preload script (security bridge)
└── renderer/      # React frontend
    └── src/
        ├── components/  # UI components
        ├── hooks/       # React hooks for API calls
        ├── routes/      # Page components and routing
        └── lib/         # Frontend utilities
```

## Architecture

Kel follows standard Electron best practices:

1. **Main Process**: Manages windows, global shortcuts, database, and system tray
2. **Preload Script**: Securely exposes APIs to the renderer via `contextBridge`
3. **Renderer Process**: React application for the user interface

Communication between processes uses IPC (Inter-Process Communication) with a handler-based architecture for type-safe API calls.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

**🏆 Winner of the Anthropic AI Hackathon in Toronto**

Special thanks to:

- Anthropic for hosting the hackathon and recognizing this project
- The open source community for the amazing tools and libraries

## Author

Made with ❤️ by [@not-manu](https://github.com/not-manu)

---

**Need help?** Open an issue on [GitHub](https://github.com/not-manu/kel/issues)

![Kel Poster](public/kel-poster.png)
