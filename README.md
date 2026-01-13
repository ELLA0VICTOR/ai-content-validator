# AI Content Validator

A decentralized AI-powered content validation platform built with GenLayer Intelligent Contracts. Submit text content and receive comprehensive quality analysis including grammar, readability, and originality scores, all stored immutably on-chain.

## Overview

The AI Content Validator leverages blockchain consensus and large language models to provide objective, tamper-proof content quality assessments. Unlike traditional centralized validation systems, results are verified by multiple validators and permanently stored on the GenLayer blockchain, ensuring transparency and reliability.

## Features

- **AI-Powered Analysis**: Advanced language models evaluate content across multiple quality dimensions
- **Blockchain Storage**: Validation results are permanently stored using GenLayer Intelligent Contracts
- **Real-time Feedback**: Instant scoring with detailed explanations and recommendations
- **Validation History**: Comprehensive tracking of past validations with filtering and statistics
- **Decentralized Consensus**: Multiple validators ensure unbiased, tamper-proof results
- **MetaMask Integration**: Connect with your Ethereum wallet for secure transactions

## Scoring Criteria

Content is evaluated on a 100-point scale across three dimensions:

- **Grammar & Spelling (40 points)**: Language quality, proper punctuation, and error detection
- **Readability & Clarity (30 points)**: Flow, structure, and ease of understanding
- **Originality & Value (30 points)**: Uniqueness and usefulness of information

**Passing Threshold**: 70 points or above

## Technology Stack

### Smart Contract
- Python (GenLayer Intelligent Contracts)
- GenLayer SDK (`py-genlayer:test`)
- AI Integration via `gl.nondet.exec_prompt()`
- Custom equivalence principle for structured data validation

### Frontend
- React 19
- Vite
- Tailwind CSS 3
- shadcn/ui component library
- GenLayerJS SDK
- Lucide React icons
- MetaMask wallet integration

## Installation

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- GenLayer CLI: `npm install -g genlayer`
- MetaMask browser extension (for wallet connection)

### Setup Instructions

**1. Clone the repository**
```bash
git clone <repository-url>
cd ai-content-validator
```

**2. Install dependencies**
```bash
npm install
cd frontend
npm install
```

**3. Start GenLayer Studio**
```bash
genlayer init
genlayer up
```

Access GenLayer Studio at http://localhost:8080

**4. Deploy the Smart Contract**

- Open GenLayer Studio in your browser
- Upload `contract/ContentValidator.py`
- Click "Deploy Contract"
- Constructor requires no arguments
- Copy the deployed contract address from the response

**5. Configure the Frontend**

Create `frontend/.env` with the following:
```bash
VITE_CONTRACT_ADDRESS=your_deployed_contract_address_here
VITE_GENLAYER_RPC=http://localhost:8080
```

**6. Start the Development Server**
```bash
cd frontend
npm run dev
```

Access the application at http://localhost:3000

## Project Structure

```
ai-content-validator/
├── contract/
│   ├── ContentValidator.py          # Main Intelligent Contract
│   └── genlayer.pyi                 # Type hints for IDE support
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                  # shadcn/ui base components
│   │   │   ├── ContentSubmission.jsx
│   │   │   ├── ValidationResult.jsx
│   │   │   ├── ValidationHistory.jsx
│   │   │   ├── HowItWorks.jsx
│   │   │   └── WalletButton.jsx     # MetaMask connection UI
│   │   ├── contexts/
│   │   │   └── WalletContext.jsx    # Wallet state management
│   │   ├── hooks/
│   │   │   └── useContentValidator.js
│   │   ├── config/
│   │   │   └── genlayer.js
│   │   ├── lib/
│   │   │   └── utils.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env
├── docs/
│   ├── TROUBLESHOOTING.md
│   └── DEPLOYMENT.md
├── package.json
└── README.md
```

## Usage Guide

### Submitting Content for Validation

1. Connect your MetaMask wallet using the "Connect Wallet" button
2. Paste or type your content in the text area (maximum 2000 characters)
3. Set the minimum word count requirement (default: 50 words)
4. Click "Validate Content"
5. Wait for AI analysis and blockchain confirmation (typically 30-60 seconds)
6. Review your validation results

### Understanding Results

Each validation provides:

- **Quality Score**: Numerical rating from 0-100
- **Pass/Fail Status**: Based on 70-point threshold
- **AI Feedback**: Detailed explanation of the score
- **Word Count**: Total words in submitted content
- **Timestamp**: Blockchain block number of validation
- **Validation ID**: Unique identifier for the validation

### Viewing Validation History

- All validations are displayed in the History section
- Filter results by status: All, Passed, or Failed
- View aggregate statistics including average score
- Click on any validation to expand full details

## Testing

### Contract Testing Checklist

- Deploy contract successfully
- Submit content below minimum words (should reject with error)
- Submit valid content (should receive score and feedback)
- Retrieve validation by ID
- Get user validation history
- Verify validation count increments correctly

### Frontend Testing Checklist

- Form validation (empty content, word count limits, character limits)
- Wallet connection and disconnection
- Submit content and receive results
- Display validation results with correct formatting
- Load and display validation history
- Filter history by different statuses
- Error handling for failed transactions
- Map object conversion for GenLayer data

### Example Test Content

**High Quality (Expected to Pass):**
```
Artificial intelligence has revolutionized modern technology by enabling 
machines to learn from experience and perform human-like tasks. Through 
sophisticated algorithms and neural networks, AI systems can analyze vast 
amounts of data, recognize patterns, and make intelligent decisions. This 
breakthrough technology continues to transform industries ranging from 
healthcare and finance to transportation and entertainment, creating new 
possibilities for innovation and efficiency.
```

**Low Quality (Expected to Fail):**
```
ai is good it helps alot many thing are done by ai its very useful 
and we use it everyday for many stuff
```

## Configuration

### Contract Configuration

Edit `contract/ContentValidator.py` to customize:

- Validation criteria weights
- AI prompt structure and instructions
- Score calculation logic
- Passing score threshold
- Equivalence principle validation rules

### Frontend Configuration

Edit `frontend/src/config/genlayer.js`:

```javascript
export const VALIDATION_CONFIG = {
  MIN_WORDS_DEFAULT: 50,
  MAX_CHARS: 2000,
  PASSING_SCORE: 70,
};

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
export const GENLAYER_RPC = import.meta.env.VITE_GENLAYER_RPC;
```

## Design System

### Color Palette

- **Background**: `#1A1A2E` (Deep navy)
- **Secondary**: `#16213E` (Rich navy)
- **Primary**: `#E94560` (Coral red)
- **Accent**: `#F7DC6F` (Golden yellow)
- **Text**: `#FFFFFF` (White)

### Typography

- **Headings**: Outfit (Google Fonts)
- **Body**: System font stack
- **Code/Monospace**: Fira Code (Google Fonts)

### Animation

- Fade-in transitions on page load
- Staggered delays for sequential elements
- Smooth state change transitions
- Interactive hover effects

## Troubleshooting

### Contract Deployment Issues

**Problem**: Contract won't deploy  
**Solution**: 
- Verify GenLayer Studio is running (`genlayer up`)
- Check syntax in ContentValidator.py
- Ensure all type annotations are present
- Review GenLayer Studio logs for specific errors

### Frontend Connection Issues

**Problem**: Frontend can't connect to contract  
**Solution**:
- Verify contract address in `.env` file
- Confirm GenLayer RPC endpoint is accessible
- Ensure contract is deployed successfully
- Try refreshing the page and reconnecting wallet

### Transaction Failures

**Problem**: Validation transaction fails  
**Solution**:
- Wait longer for transaction confirmation
- Check GenLayer Studio logs for errors
- Verify wallet has sufficient balance
- Ensure content meets minimum word requirements
- Confirm contract address is correct

### State Persistence Issues

**Problem**: Validation count doesn't increment  
**Solution**:
- See `docs/TROUBLESHOOTING.md` for detailed guide
- Verify you're not manually instantiating DynArray or TreeMap
- Check that `__init__` doesn't initialize storage fields
- Ensure you're using correct equivalence principles

## Documentation

- [GenLayer Documentation](https://docs.genlayer.com)
- [Intelligent Contracts Guide](https://docs.genlayer.com/contracts)
- [GenLayerJS SDK Reference](https://docs.genlayer.com/sdk)
- [Troubleshooting Guide](./docs/TROUBLESHOOTING.md)

## Contributing

Contributions are welcome. Please submit pull requests with:

- Clear description of changes
- Updated tests if applicable
- Documentation updates
- Adherence to existing code style

## License

MIT License - see LICENSE file for details

## Acknowledgments

Built with GenLayer Intelligent Contracts  
UI components from shadcn/ui  
Icons by Lucide  

---

**Developed by Victor using GenLayer blockchain technology**