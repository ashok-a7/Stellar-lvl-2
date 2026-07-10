# 🚀 Decentralized To-Do List (Soroban + Stellar)
## 📌 Project Overview

A decentralized and permissionless To-Do List application built using Soroban smart contracts on the Stellar blockchain.
This project enables users to create, manage, and track tasks securely without relying on any central authority, ensuring transparency, immutability, and ownership of data.

## 📌 Add screenshots of your app here
(UI, task creation, blockchain interaction, etc.)

<img width="1278" height="697" alt="image" src="https://github.com/user-attachments/assets/a989940a-2bf0-48e0-8c77-a28d9156b047" />

## 📜 Smart Contract Address
CDJVMAX34YRCQ5JFC6SIOQOVSUY6XWEFYJOLF3SBCKU7CMI3IAP6HPWN

https://lab.stellar.org/smart-contracts/contract-explorer?$=network$id=testnet&label=Testnet&horizonUrl=https:////horizon-testnet.stellar.org&rpcUrl=https:////soroban-testnet.stellar.org&passphrase=Test%20SDF%20Network%20/;%20September%202015;&smartContracts$explorer$contractId=CDJVMAX34YRCQ5JFC6SIOQOVSUY6XWEFYJOLF3SBCKU7CMI3IAP6HPWN

<img width="1913" height="881" alt="image" src="https://github.com/user-attachments/assets/161d91ff-7157-469a-aa75-10ad406c5d2b" />

## ✨ Features

📝 Create Tasks – Add new tasks directly on-chain
✅ Mark as Complete – Update task status securely
❌ Delete Tasks – Remove tasks permanently
🔐 Decentralized Ownership – Each user controls their own data
🌐 Permissionless Access – No login or central server required
⚡ Fast & Low Cost – Powered by Stellar’s efficient network
## 🧠 How It Works

The application uses Soroban smart contracts to store and manage tasks on the blockchain.
Each user interacts with the contract using their wallet/account.
Tasks are stored in a decentralized state, ensuring:
No data tampering
Full transparency
High reliability

## 🏗️ Tech Stack

Blockchain: Stellar

Smart Contracts: Soroban (Rust)

Frontend: (Add your frontend tech here — e.g., React)

Backend: Not required (fully decentralized)

## 📂 Project Structure
├── contracts/          # Soroban smart contract code
├── src/                # Frontend source code
├── scripts/            # Deployment scripts
├── README.md           # Project documentation
⚙️ Setup & Installation
1️⃣ Clone the Repository
git clone https://github.com/your-username/decentralized-todo.git
cd decentralized-todo
2️⃣ Build the Smart Contract
cargo build --target wasm32v1-none --release
3️⃣ Deploy to Stellar Testnet
stellar contract deploy \
  --wasm target/wasm32v1-none/release/your_contract.wasm \
  --source-account YOUR_ACCOUNT \
  --network testnet \
  --alias todo_contract
📸 Demo / Screenshots

## 📌 Add screenshots of your app here
(UI, task creation, blockchain interaction, etc.)

<img width="1278" height="697" alt="image" src="https://github.com/user-attachments/assets/a989940a-2bf0-48e0-8c77-a28d9156b047" />

## 📜 Smart Contract Address
CDJVMAX34YRCQ5JFC6SIOQOVSUY6XWEFYJOLF3SBCKU7CMI3IAP6HPWN

https://lab.stellar.org/smart-contracts/contract-explorer?$=network$id=testnet&label=Testnet&horizonUrl=https:////horizon-testnet.stellar.org&rpcUrl=https:////soroban-testnet.stellar.org&passphrase=Test%20SDF%20Network%20/;%20September%202015;&smartContracts$explorer$contractId=CDJVMAX34YRCQ5JFC6SIOQOVSUY6XWEFYJOLF3SBCKU7CMI3IAP6HPWN

<img width="1913" height="881" alt="image" src="https://github.com/user-attachments/assets/161d91ff-7157-469a-aa75-10ad406c5d2b" />

🚧 Future Improvements

📱 Mobile-friendly UI

🔔 Task reminders & notifications

🧑‍🤝‍🧑 Shared task lists (multi-user)

📊 Analytics dashboard

🔐 Wallet integration improvements

🤝 Contributing

Contributions are welcome!

Fork the repo

Create a new branch

Make your changes

Submit a pull request

📄 License

This project is licensed under the MIT License.

💡 Inspiration

This project demonstrates how blockchain can replace traditional backend systems, enabling trustless and decentralized applications for everyday use cases.
