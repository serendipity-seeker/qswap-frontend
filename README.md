# QSwap - Modern DEX Interface

A beautiful, modern decentralized exchange (DEX) interface built with React, TypeScript, TailwindCSS, and Framer Motion. Inspired by Raydium and Uniswap with stunning animations and a polished user experience.

## ✨ Features

- 🔄 **Token Swap Interface** - Intuitive swap UI with real-time calculations
- 💧 **Liquidity Management** - Add/remove liquidity with ease
- 📊 **Price Charts** - Visual price tracking and analytics
- 🎨 **Beautiful Design** - Glass morphism effects, gradients, and smooth animations
- 📱 **Fully Responsive** - Works perfectly on mobile, tablet, and desktop
- 🌓 **Dark Mode** - Built-in theme support
- ⚡ **Lightning Fast** - Optimized performance with React 19
- 🔐 **Wallet Connect** - Ready for Qubic Connect integration
- 🎯 **Custom Components** - Unique UI components with special styling
- ✨ **Advanced Animations** - Framer Motion powered interactions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Yarn or npm

### Installation

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview
```

## 📁 Project Structure

```
src/
├── pages/                    # Main application pages
│   ├── home/                # Landing page with hero section
│   ├── swap/                # Token swap interface
│   ├── liquidity/           # Liquidity management
│   └── components-showcase/ # Custom components demo
├── components/
│   ├── custom/              # 🌟 Unique QSwap components
│   │   ├── Button.tsx      # Advanced button with 6 variants
│   │   ├── Input.tsx       # Animated input with validation
│   │   ├── Modal.tsx       # Beautiful modal with blur
│   │   ├── AppLoader.tsx   # Sophisticated loader
│   │   ├── Header.tsx      # Custom header with effects
│   │   └── Footer.tsx      # Feature-rich footer
│   ├── composed/            # Feature components
│   └── ui/                  # Base shadcn components
├── layouts/                 # Layout wrapper
└── index.css               # Global styles & animations
```

## 🎨 Design System

### Custom Components Library 🌟
QSwap features a **completely custom component library** with unique styling:

- **6 Custom Components**: Button, Input, Modal, AppLoader, Header, Footer
- **15+ Variants**: Multiple styles for different use cases
- **30+ Animations**: Sophisticated Framer Motion effects
- **Unique Features**:
  - Shimmer sweep effect on buttons
  - Orbiting particle loader
  - Glass morphism throughout
  - Gradient borders and backgrounds
  - Custom branded scrollbar
  - Advanced micro-interactions

### Design Tokens
- **Font**: Inter (Google Fonts) - Weights 300-900
- **Colors**: Cyan/Turquoise gradient (`#61f0fe` → `#03c1db`)
- **Animations**: Spring physics, easing curves, GPU acceleration
- **Effects**: Glass morphism, multi-stop gradients, glow shadows

## 📚 Pages

### Home (`/`)
- Hero section with gradient text and CTAs
- Platform statistics (TVL, Volume, Users)
- Feature highlights with animated cards

### Swap (`/swap`)
- Token input with balance and USD values
- Token selector modal with search
- Swap settings (slippage tolerance)
- Live price chart
- Top pools statistics
- Real-time swap calculations

### Liquidity (`/liquidity`)
- Add/Remove liquidity modes
- Token pair selection
- Pool share calculations
- Your liquidity positions
- Liquidity pool statistics

### Components Showcase (`/components`) 🌟
- **NEW!** Interactive demo of all custom components
- Button variants and sizes
- Input states (error, success, validation)
- Modal examples
- Loader demonstrations
- Color palette showcase

## 🔧 Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **TailwindCSS v4** - Styling
- **Framer Motion** - Animations
- **Vite** - Build tool
- **React Router** - Routing
- **Jotai** - State management
- **Lucide React** - Icons

## 📝 Note

This is a **mock UI implementation** without real smart contract integration. Perfect for:
- UI/UX demonstrations
- Frontend development
- Design presentations
- Prototyping

To integrate with real smart contracts, replace mock data with API calls and connect swap/liquidity functions.

## 📖 Documentation

- **[QSWAP_UI_GUIDE.md](./QSWAP_UI_GUIDE.md)** - Overall UI implementation guide
- **[CUSTOM_COMPONENTS_GUIDE.md](./CUSTOM_COMPONENTS_GUIDE.md)** - 🌟 Custom components API & usage
- **[CUSTOM_COMPONENTS_SUMMARY.md](./CUSTOM_COMPONENTS_SUMMARY.md)** - Components implementation summary
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Complete project summary

## 🤝 Contributing

Built for the QSwap project by the Qraffle Team.

## 📄 License

Private - QSwap Project
