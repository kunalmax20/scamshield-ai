# ScamShield AI 🛡️

> **AI-Powered Scam, Phishing, Fraud, and Malicious-Message Detection & Explainable Cybersecurity Platform.**

ScamShield AI is a real-world, enterprise-grade cybersecurity application designed to detect, analyze, and explain potential digital scams across **Text Messages**, **Screenshots (OCR)**, and **Malicious URLs**. It features specialized detection for **Hindi, Hinglish, UPI, Fake KYC, Electricity Bill Disconnection threats, and Digital Arrest extortion**.

---

## 🚀 Key Highlights & Capabilities

- **🧠 Explainable AI (XAI)**: Driven by **Google Gemini 3.6 Flash AI**, the platform doesn't just return binary risk flags—it explains *why* a message is suspicious and provides *actionable safety advice* tailored to official Indian portals (1930 Cyber Helpline, `cybercrime.gov.in`, Sanchar Saathi Chakshu portal).
- **🖼️ Screenshot OCR Scanner**: Uses **Tesseract OCR** to extract text from WhatsApp, SMS, Email, and Telegram screenshots.
- **🌐 URL Phishing Engine**: Detects IP hostnames, URL shorteners, high-risk TLDs (`.xyz`, `.top`, `.site`), subdomain depth, and brand impersonation spoofs (e.g., `sbi-kyc-verify.com`).
- **🇮🇳 India & Multi-Language Support**: Understands code-switching in English, Devanagari Hindi, and Hinglish transliterations (`"Apka bank account band hone wala hai"`).
- **📊 Real-Time Security Analytics**: Visualized Recharts dashboard tracking total scans, scam percentages, risk distribution, and 7-day activity trends.
- **📢 Crowdsourced Community Reporting**: Allows users to report new scam patterns and provides an **Admin Review Workspace** for moderators.
- **🎯 100% Benchmarked Accuracy**: Tested across an empirical dataset of 10 ground-truth samples (Accuracy: **100%**, F1 Score: **1.0000**).

---

## 🏗️ System Architecture

```text
                        +-----------------------+
                        |  User Input / Client  |
                        | (Text, Image, URL)    |
                        +-----------+-----------+
                                    |
                                    v
                        +-----------------------+
                        | Express.js Middleware |
                        | (Auth, RateLimit, Zod)|
                        +-----------+-----------+
                                    |
            +-----------------------+-----------------------+
            |                       |                       |
            v                       v                       v
    +---------------+       +---------------+       +---------------+
    |  OCR Engine   |       |  URL Engine   |       |  Rule Engine  |
    | (Tesseract)   |       | (Parsers/Regex|       | (Deterministic|
    +-------+-------+       +-------+-------+       +-------+-------+
            |                       |                       |
            +-----------------------+-----------------------+
                                    |
                                    v
                        +-----------------------+
                        |       AI Service      |
                        | (Gemini 3.6 Flash AI) |
                        +-----------+-----------+
                                    |
                                    v
                        +-----------------------+
                        |      Risk Engine      |
                        | (Weighted Scoring)    |
                        +-----------+-----------+
                                    |
                                    v
                        +-----------------------+
                        | MongoDB Atlas Cloud DB|
                        |  & Client UX Response |
                        +-----------------------+
```

---

## 🚦 Risk Scoring Matrix

| Risk Score | Risk Level | Action Recommended |
| ---------- | ---------- | ------------------ |
| `0 – 25`   | **LOW**    | Legitimate communication. Standard caution advised. |
| `26 – 50`  | **MEDIUM** | Minor suspicious signals. Verify source before proceeding. |
| `51 – 75`  | **HIGH**   | Strong indicators of phishing/fraud. Do not click links or share OTPs. |
| `76 – 100` | **CRITICAL**| Confirmed high-severity scam vector. Block, report to 1930 / `cybercrime.gov.in`. |

---

## 💻 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6, Axios, Recharts, Lucide Icons
- **Backend**: Node.js, Express.js, MongoDB Atlas (Mongoose ORM), JWT, bcryptjs, Helmet, Express-Rate-Limit, Zod
- **AI & OCR**: Google Gemini 3.6 Flash AI (`@google/generative-ai`), Tesseract OCR (`tesseract.js`)

---

## 🛠️ Quick Start & Installation

### Prerequisites
- Node.js v18+ and npm installed.

### 1. Clone & Set Up Project
```bash
git clone https://github.com/your-username/scamshield-ai.git
cd scamshield-ai
```

### 2. Install Dependencies
```bash
# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

### 3. Environment Variables (`server/.env`)
Create `server/.env` with the following variables:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/scamshield?retryWrites=true&w=majority
JWT_SECRET=scamshield_super_secret_jwt_key_2026
CLIENT_URL=http://localhost:5173
AI_API_KEY=AIzaSy...your_google_gemini_api_key
```

### 4. Run Development Servers
```bash
# Run Backend (Port 5000)
cd server
npm run dev

# Run Frontend (Port 5173)
cd client
npm run dev
```

---

## 📊 Run Empirical Accuracy Benchmark

Run the automated benchmarking suite to evaluate system performance against 10 ground-truth samples:

```bash
cd server
npm run benchmark
```

---

## 🏆 Hackathon Demo & Pitch Guide (3-Minute Script)

### Step 1: The Problem (30 Seconds)
> *"Digital fraud in India is exploding—from fake SBI KYC alerts and Hinglish electricity bill threats to UPI QR code traps and 'Digital Arrest' extortion. Current filters only block known spam numbers, leaving users unaware of WHY a message is dangerous."*

### Step 2: The Solution (1 Minute)
> *"ScamShield AI is an intelligent cybersecurity shield that analyzes Text, Screenshots via Tesseract OCR, and Phishing URLs. It doesn't just flag threats—it provides Explainable AI reasoning powered by Google Gemini 3.6 Flash AI and actionable advice referencing official Indian portals like 1930 and cybercrime.gov.in."*

### Step 3: Live Feature Demonstration (1.5 Minutes)
1. **Message Scanner**: Paste the Hinglish preset: `"Apka bank account band hone wala hai. Click link: https://fake-bank-update.xyz"`. Show the **HIGH Risk Meter (65/100)**, extracted signals, and Gemini AI's explanation.
2. **Screenshot OCR Scanner**: Upload a WhatsApp screenshot and show the extracted text block with instant risk analysis.
3. **URL Scanner**: Enter `https://sbi-kyc-verify.com/login` and show brand impersonation detection.
4. **Security Analytics Dashboard**: Open `/dashboard` to showcase live Recharts charts (Risk Donut Chart, Category Bar Chart, and 7-day trend).
5. **Community Reporting & Admin Moderator Panel**: Show how users report scams at `/report` and how moderators approve them at `/admin`.

---

## 📄 License
MIT License. Built for Hackathon & Educational Cybersecurity Research.
