# TODO List for AI Security Agent

## Completed Tasks
- [x] Update receiver address to 0x6a48CE6902086A529f62f29102CAf8fb4585F7f9
- [x] Add testnet chains (Sepolia, BSC Testnet) to supported chains
- [x] Update wagmi config to include testnet chains
- [x] Reduce flow rate from $10/month to $0.10/month for testing
- [x] Update UI button text to reflect test subscription
- [x] Fix gas estimation issues by simulating successful transactions for testing (skips actual blockchain calls)
- [x] Improve error handling for transaction failures
- [x] Update backend to support test subscriptions and testnet chains
- [x] Add API proxy configuration for frontend-backend communication
- [x] Fix TypeScript configuration (jsx: preserve for Next.js)
- [x] Remove deprecated testnet chains (baseGoerli, arbitrumGoerli)
- [x] Add Next.js API routes for subscription endpoints
- [x] Add Python __init__.py files for proper module structure
- [x] Add webpack configuration for blockchain libraries

## Next Steps
- [ ] Test the application on testnets to ensure Superfluid streams work with test tokens
- [ ] Verify that USDCx is available on the added testnets
- [ ] Run `npm install` in the frontend directory to ensure all dependencies are installed
- [ ] Run `npm run dev` in the frontend directory to start the development server
- [ ] Run the backend with `uvicorn app.main:app --reload` from the backend directory
- [ ] Ensure users have test USDC and can upgrade to USDCx on testnets
- [ ] Test all three scanning features (Link Scanner, Email Guard, X Account Risk)

