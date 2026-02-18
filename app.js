// Sui Configuration
const PACKAGE_ID = "0xf3aedf517b9edff4c3a07e2a31e724ceb1fac7aadd39979c7625687917280168";
const MODULE_NAME = "main";
const FUNCTION_NAME = "open_box";
const RANDOM_OBJECT_ID = "0x8";

const RPC_URL = "https://testnet-rpc.sui.io";

// DOM Elements
const connectBtn = document.getElementById("connectBtn");
const disconnectBtn = document.getElementById("disconnectBtn");
const openBtn = document.getElementById("openBtn");
const walletInfo = document.getElementById("walletInfo");
const walletAddress = document.getElementById("walletAddress");
const resultDiv = document.getElementById("result");
const loadingDiv = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const errorText = document.getElementById("errorText");
const lootboxBox = document.getElementById("lootboxBox");
const rarityDisplay = document.getElementById("rarityDisplay");
const itemId = document.getElementById("itemId");
const txDigest = document.getElementById("txDigest");

let currentAccount = null;
let suiClient = null;

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    connectBtn.addEventListener("click", connectWallet);
    disconnectBtn.addEventListener("click", disconnectWallet);
    openBtn.addEventListener("click", openLootbox);
    checkWalletConnection();
});

async function checkWalletConnection() {
    try {
        if (typeof window !== "undefined" && window.$suiWallet) {
            const accounts = await window.$suiWallet.getAccounts();
            if (accounts.length > 0) {
                currentAccount = accounts[0];
                updateWalletUI();
            }
        }
    } catch (err) {
        console.log("No wallet connected");
    }
}

async function connectWallet() {
    try {
        // Check for Sui Wallet extension
        if (!window.$suiWallet) {
            alert("Please install Sui Wallet extension: https://chrome.google.com/webstore");
            return;
        }

        // Request connection
        const result = await window.$suiWallet.requestPermissions();
        const accounts = await window.$suiWallet.getAccounts();
        
        if (accounts.length > 0) {
            currentAccount = accounts[0];
            updateWalletUI();
            showError(null);
        }
    } catch (err) {
        console.error("Wallet connection error:", err);
        showError("Failed to connect wallet: " + err.message);
    }
}

function disconnectWallet() {
    currentAccount = null;
    updateWalletUI();
    resultDiv.classList.add("hidden");
}

function updateWalletUI() {
    if (currentAccount) {
        connectBtn.style.display = "none";
        walletInfo.classList.remove("hidden");
        walletAddress.textContent = currentAccount.address.substring(0, 10) + "...";
        openBtn.disabled = false;
    } else {
        connectBtn.style.display = "block";
        walletInfo.classList.add("hidden");
        openBtn.disabled = true;
    }
}

async function openLootbox() {
    if (!currentAccount) {
        showError("Please connect your wallet first");
        return;
    }

    try {
        loadingDiv.classList.remove("hidden");
        resultDiv.classList.add("hidden");
        errorDiv.classList.add("hidden");
        openBtn.disabled = true;

        // Animate box
        lootboxBox.classList.add("open");

        // Create Sui client
        const suiClient = new (await import("@mysten/sui.js")).SuiClient({
            url: RPC_URL,
        });

        // Get transaction data
        const txBlock = new (await import("@mysten/sui.js")).TransactionBlock();
        txBlock.moveCall({
            target: `${PACKAGE_ID}::${MODULE_NAME}::${FUNCTION_NAME}`,
            arguments: [txBlock.object(RANDOM_OBJECT_ID)],
        });

        // Sign and execute
        const result = await window.$suiWallet.signAndExecuteTransactionBlock({
            transactionBlock: txBlock,
            options: {
                showEffects: true,
                showInput: true,
                showObjectChanges: true,
            },
        });

        // Extract rarity from events
        let rarityValue = parseLootboxResult(result);

        // Display result
        displayResult(rarityValue, result.digest);

        loadingDiv.classList.add("hidden");
        resultDiv.classList.remove("hidden");
    } catch (err) {
        console.error("Error opening lootbox:", err);
        showError("Failed to open lootbox: " + err.message);
        loadingDiv.classList.add("hidden");
        lootboxBox.classList.remove("open");
    } finally {
        openBtn.disabled = false;
    }
}

function parseLootboxResult(result) {
    try {
        // Look for ItemOpened event in the events array
        if (result.events) {
            for (const event of result.events) {
                if (
                    event.type.includes("ItemOpened") &&
                    event.parsedJson
                ) {
                    return event.parsedJson.rarity || parseFloat(event.parsedJson.rarity);
                }
            }
        }

        // Fallback: check transaction effects
        if (result.effects && result.effects.status === "success") {
            // Try to extract from return values
            if (result.effects.created && result.effects.created.length > 0) {
                // We got items created, success
                return 1; // default to common if we can't parse
            }
        }

        return 1; // default
    } catch (err) {
        console.error("Error parsing result:", err);
        return 1;
    }
}

function displayResult(rarity, digest) {
    // Map rarity to display
    let rarityText = "";
    let rarityEmoji = "";
    let rarityClass = "";

    if (rarity === 3) {
        rarityText = "LEGENDARY ✨";
        rarityEmoji = "⭐";
        rarityClass = "rarity-legendary";
    } else if (rarity === 2) {
        rarityText = "RARE 💎";
        rarityEmoji = "🔷";
        rarityClass = "rarity-rare";
    } else {
        rarityText = "COMMON 📦";
        rarityEmoji = "🟩";
        rarityClass = "rarity-common";
    }

    rarityDisplay.innerHTML = `<div class="${rarityClass}">${rarityEmoji} ${rarityText}</div>`;
    txDigest.textContent = digest;
    itemId.textContent = "View transaction for item details";
}

function showError(message) {
    if (message) {
        errorText.textContent = message;
        errorDiv.classList.remove("hidden");
    } else {
        errorDiv.classList.add("hidden");
    }
}
