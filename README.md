# SheildGuard AI Security Shield 🛡️

SheildGuard is an all-in-one AI-powered security platform that protects your digital assets from phishing, spam, and algorithmic risks. Built with Next.js, TypeScript/Express, and Superfluid streaming payments, it also includes a waitlist sign-up for the next-wave X analytics module.

## Features

### 🔗 Link Scanner
- Detects malicious URLs and phishing attempts
- Analyzes suspicious patterns in links
- Real-time threat assessment

### 📧 Email Guard
- AI-powered phishing detection
- Identifies social engineering attempts
- Keyword-based threat analysis

### 🐦 X Account Risk Assessment (Coming Soon)
- Monitors account health
- Detects automated behavior patterns
- Suspension risk analysis
- Early access via the SheildGuard waitlist — sign up on the landing page when the module opens.

### 💰 Superfluid Streaming Payments
- Subscribe with crypto streaming payments ($0.10/month for testing)
- Support for multiple chains (Ethereum, BSC, Base, Arbitrum, Sepolia, BSC Testnet)
- Real-time subscription verification

### 📝 Waitlist
- The X Account Risk module is arriving soon—use the waitlist form on the landing page to receive a beta invite.
- The first wave is capped at 2,000 seats; the UI now reports the live count so you can watch availability in real time.
- Backend submissions persist in `backend/data/waitlist.db` and are handled by the Express/TypeScript server in `backend/ts-scan`.
- Use `npx ts-node backend/scripts/populate_waitlist.ts` (after installing `better-sqlite3`, `ts-node`, and `@types/node`) to reseed the waitlist with realistic pilot users.
- A unified TypeScript Express backend lives in `backend/ts-scan`. Run `npm install` there and use `npm run dev` (port 9191) to serve both the scan and waitlist routes with the translated heuristics.

## Tech Stack

### Frontend
- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS 4
- **Web3**: Wagmi v2, RainbowKit, ethers.js
- **Payments**: Superfluid SDK
- **TypeScript**: Full type safety

### Backend
- **Framework**: Express with TypeScript
- **AI Service**: Heuristic-first detection (with optional AI hooks via OpenRouter/VirusTotal)
- **Database**: `better-sqlite3` + SQLite for waitlist storage
- **CORS**: Enabled for development

> 💡 **NEW**: Enhanced AI mode with FREE APIs! See `API_SETUP.md` for 5-minute setup.


## Project Structure

```
sheildguard/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/              # Next.js API routes
│   │   │   ├── dashboard/        # Dashboard page
│   │   │   ├── page.tsx          # Landing page
│   │   │   ├── layout.tsx        # Root layout
│   │   │   └── globals.css       # Global styles
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── WalletConnectButton.tsx
│   │   │   ├── SubscribeButton.tsx
│   │   │   └── ChainSelector.tsx
│   │   └── lib/
│   │       ├── wagmiConfig.ts    # Wagmi configuration
│   │       └── chains.ts         # Supported chains
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.ts
├── backend/
│   ├── data/
│   │   ├── waitlist.db
│   │   └── waitlist.csv
│   ├── scripts/
│   │   ├── populate_waitlist.ts
│   │   └── types/
│   │       └── better-sqlite3.d.ts
│   ├── ts-scan/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       └── index.ts
│   ├── .env.example
└── TODO.md
```

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Git

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

1. Navigate to the TypeScript server:
```bash
cd backend/ts-scan
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The backend will be available at `http://localhost:9191`

## Usage

### 1. Connect Your Wallet
- Click "Launch App" or "Login" to go to the dashboard
- Connect your Web3 wallet using RainbowKit
- Select your preferred chain from the dropdown

### 2. Use Security Features

#### Link Scanner
1. Select the "Link Scanner" tab
2. Enter a suspicious URL
3. Click "Run Scan" to analyze the link
4. View the risk assessment and recommendations

#### Email Guard
1. Select the "Email Guard" tab
2. Paste the email content
3. Click "Run Scan" to detect phishing patterns
4. Review detected keywords and risk level

#### X Account Risk
1. Select the "X Account Risk" tab
2. Enter an X (Twitter) handle (without @)
3. Click "Run Scan" to assess suspension risk
4. View risk factors and recommendations

### 3. Subscribe (Optional)
- Navigate to the subscription page
- Connect your wallet
- Click "Subscribe $0.10/month" to start a Superfluid stream
- For testing, this simulates the transaction without actual blockchain interaction

## Configuration

### Supported Chains
- **Mainnets**: Ethereum, BSC, Base, Arbitrum
- **Testnets**: Sepolia, BSC Testnet

### Environment Variables
Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

Get your WalletConnect Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/)

## API Endpoints

### Backend (Express/TypeScript)

#### Scans
- `POST /api/scans/link` - Scan a URL for threats
- `POST /api/scans/email` - Analyze email content
- `POST /api/scans/x-risk` - Assess X account risk

#### Waitlist
- `POST /api/waitlist/join` - Add an email to the capped 2,000-person queue
- `GET /api/waitlist/status` - Read the current waitlist count and capacity

### Frontend (Next.js API Routes)
- `POST /api/subscription/check` - Proxy to backend (if you keep the Superfluid service)
- `POST /api/subscription/test-subscribe` - Proxy to backend

## Development

### Code Fixes Implemented
✅ Fixed TypeScript configuration for Next.js compatibility  
✅ Removed deprecated testnet chains (baseGoerli, arbitrumGoerli)  
✅ Added Next.js API routes for backend communication  
✅ Added Python module structure (__init__.py files)  
✅ Configured webpack for blockchain libraries  
✅ Updated Superfluid service for active chains only  

### Testing
1. Start both frontend and backend servers
2. Test each scanning feature with sample data
3. Verify wallet connection works
4. Test subscription flow (simulated for development)

## Troubleshooting

### Frontend Issues
- **Module not found errors**: Run `npm install` to ensure all dependencies are installed
- **Build errors**: Check that Node.js version is 18 or higher
- **Wallet connection issues**: Verify WalletConnect Project ID is set

### Backend Issues
- **Import errors**: Ensure virtual environment is activated and dependencies are installed
- **CORS errors**: Backend is configured to allow all origins in development
- **Port conflicts**: Change port in uvicorn command if 8000 is in use

## Future Enhancements
- [ ] Integrate real AI models (GPT-4, Claude) for advanced threat detection
- [ ] Add VirusTotal and Google Safe Browsing API integration
- [ ] Implement real-time monitoring dashboard
- [ ] Add Telegram bot integration
- [ ] Enhance UI with more animations and interactions
- [ ] Add user authentication and history tracking
- [ ] Deploy to production (Vercel + Render/Railway)

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
MIT License - feel free to use this project for your own purposes.

## Support
For issues or questions, please open an issue on GitHub.

 ---

 Built with ❤️ using Next.js, TypeScript/Express, and Superfluid
