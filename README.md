# 🎁 My Lootbox Web - Sui Dapp

A web interface for opening lootboxes on the Sui blockchain!

## Features

- ✅ Connect Sui Wallet
- ✅ Open lootboxes with on-chain randomness
- ✅ Beautiful UI with rarity display
- ✅ Real-time transaction tracking
- ✅ Mobile responsive

## Requirements

- **Sui Wallet** browser extension ([Install here](https://chrome.google.com/webstore))
- Some SUI on **testnet** for gas fees

## Local Development

### 1. Run locally
```bash
# Options:
# Option A: Using http-server (simple)
npx http-server -p 8000

# Option B: Using Python
python -m http.server 8000

# Option C: Using Node
npm install
npm start
```

Then open http://localhost:8000 in your browser

### 2. Test the app
- Click "Connect Wallet"
- Approve the connection in Sui Wallet
- Click "Open Lootbox"
- Confirm the transaction in your wallet

## Deploy to Netlify

### Method 1: Drag & Drop (Fastest)
1. Go to [Netlify.com](https://netlify.com)
2. Sign in or create account
3. Drag & drop the `lootbox-web` folder directly onto Netlify
4. Done! Your site is live 🎉

### Method 2: Git Deploy
1. Push this folder to GitHub
2. Go to [Netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Deploy!

### Method 3: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

## Configuration

To use a different package ID:
- Edit `app.js` line 1-5:
```javascript
const PACKAGE_ID = "0xyour_package_id";
const RANDOM_OBJECT_ID = "0x8";
const FUNCTION_NAME = "open_box";
```

## File Structure

```
lootbox-web/
├── index.html      # Main HTML
├── styles.css      # Styling
├── app.js          # Sui integration
├── package.json    # Dependencies
└── README.md       # This file
```

## Troubleshooting

**"Please install Sui Wallet extension"**
- Install from Chrome Web Store: https://chrome.google.com/webstore
- Make sure it's enabled in Extensions

**"Failed to open lootbox"**
- Make sure you're on Sui **testnet** (not mainnet)
- Check you have some SUI for gas

**Wallet not connecting**
- Refresh the page
- Check wallet is unlocked
- Try disconnecting and reconnecting

## Gas Costs

- Per box: ~0.00236 SUI
- Very cheap! 🎁

## Need Help?

- Sui Docs: https://docs.sui.io
- Sui Wallet: https://mystenlabs.com/products/wallet

---

Enjoy opening boxes! 🎲✨
