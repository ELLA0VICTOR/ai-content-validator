# AI Content Validator

A decentralized AI-powered content validation platform built with GenLayer Intelligent Contracts. Submit text content and receive comprehensive quality analysis including grammar, readability, and originality scores - all stored on-chain.

![AI Content Validator](https://via.placeholder.com/800x400/1A2332/E94560?text=AI+Content+Validator)

## 🌟 Features

- **AI-Powered Analysis**: Advanced language models evaluate content across multiple dimensions
- **Blockchain Storage**: Validation results permanently stored using GenLayer Intelligent Contracts
- **Real-time Feedback**: Instant scoring with detailed feedback and recommendations
- **Validation History**: Track all past validations with filtering and statistics
- **Beautiful UI**: Modern, animated interface with Sunset Dashboard aesthetic
- **Decentralized**: Leverages blockchain consensus for unbiased results

## 🎯 Scoring Criteria

Content is evaluated on a 100-point scale:

- **Grammar & Spelling (40 points)**: Language quality, proper punctuation, error detection
- **Readability & Clarity (30 points)**: Flow, structure, ease of understanding
- **Originality & Value (30 points)**: Uniqueness and usefulness of information

**Passing Score**: 70 or above

## 🛠 Tech Stack

### Smart Contract
- Python (GenLayer Intelligent Contracts)
- GenLayer SDK (`py-genlayer:test`)
- AI Integration via `gl.exec_prompt()`

### Frontend
- React 19
- Vite
- Tailwind CSS 3
- shadcn/ui components
- GenLayerJS SDK
- Lucide React icons

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- GenLayer CLI (`npm install -g genlayer`)

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd ai-content-validator
```

2. **Install dependencies**
```bash
npm install
cd frontend
npm install
```

3. **Start GenLayer Studio**
```bash
genlayer init
genlayer up
```

Visit http://localhost:8080 to access GenLayer Studio.

4. **Deploy Smart Contract**

- Open GenLayer Studio (http://localhost:8080)
- Upload `contract/ContentValidator.py`
- Click "Deploy Contract"
- No constructor arguments needed
- Copy the deployed contract address

5. **Configure Frontend**

Create `frontend/.env`:
```bash
VITE_CONTRACT_ADDRESS=your_deployed_contract_address_here
VITE_GENLAYER_RPC=http://localhost:8080
```

6. **Start Development Server**
```bash
cd frontend
npm run dev
```

Visit http://localhost:3000

## 🚀 Usage

### Submitting Content

1. Paste or type your content in the text area (max 2000 characters)
2. Set minimum word count requirement
3. Click "Validate Content"
4. Wait for AI analysis (typically 10-30 seconds)
5. View your validation results

### Understanding Results

- **Score**: 0-100 quality rating
- **Status**: PASSED (≥70) or FAILED (<70)
- **Feedback**: AI-generated explanation of the score
- **Word Count**: Total words in submitted content
- **Timestamp**: Blockchain block number of validation

### Viewing History

- All your validations are displayed in the History section
- Filter by status (All, Passed, Failed)
- View statistics including average score
- Click any validation to see full details

## 📁 Project Structure

```
ai-content-validator/
├── contract/
│   └── ContentValidator.py          # Intelligent Contract
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                  # shadcn components
│   │   │   ├── ContentSubmission.jsx
│   │   │   ├── ValidationResult.jsx
│   │   │   ├── ValidationHistory.jsx
│   │   │   └── HowItWorks.jsx
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
│   └── tailwind.config.js
├── docs/
│   ├── DEPLOYMENT.md
│   └── TESTING.md
├── package.json
└── README.md
```

## 🧪 Testing

### Manual Testing Checklist

**Contract Tests:**
- ✅ Deploy contract successfully
- ✅ Submit content below minimum words (should fail)
- ✅ Submit valid content (should receive score)
- ✅ Retrieve validation by ID
- ✅ Get user validation history
- ✅ Check validation count increments

**Frontend Tests:**
- ✅ Form validation (empty content, word count, character limit)
- ✅ Submit content and receive results
- ✅ Display validation results correctly
- ✅ Load and display validation history
- ✅ Filter history by status
- ✅ Error handling for failed transactions

### Example Test Content

**Good Quality (Should Pass):**
```
Artificial intelligence has revolutionized modern technology by enabling 
machines to learn from experience and perform human-like tasks. Through 
sophisticated algorithms and neural networks, AI systems can analyze vast 
amounts of data, recognize patterns, and make intelligent decisions. This 
breakthrough technology continues to transform industries ranging from 
healthcare and finance to transportation and entertainment, creating new 
possibilities for innovation and efficiency.
```

**Poor Quality (Should Fail):**
```
ai is good it helps alot many thing are done by ai its very useful 
and we use it everyday for many stuff
```

## 🎨 Design System

**Color Palette (Sunset Dashboard):**
- Background: `#1A1A2E` (Deep navy)
- Secondary: `#16213E` (Rich navy)
- Primary: `#E94560` (Coral red)
- Accent: `#F7DC6F` (Golden yellow)

**Typography:**
- Headings: Outfit (Google Fonts)
- Code/Mono: Fira Code (Google Fonts)

**Animations:**
- Fade-in on page load
- Staggered delays for sequential elements
- Smooth transitions on state changes
- Hover effects on interactive elements

## 🔧 Configuration

### Contract Configuration

Edit `contract/ContentValidator.py` to customize:
- Validation criteria weights
- AI prompt structure
- Score calculation logic
- Passing threshold

### Frontend Configuration

Edit `frontend/src/config/genlayer.js`:
```javascript
export const VALIDATION_CONFIG = {
  MIN_WORDS_DEFAULT: 50,
  MAX_CHARS: 2000,
  PASSING_SCORE: 70,
};
```

## 🐛 Troubleshooting

### Contract won't deploy
- Ensure GenLayer Studio is running (`genlayer up`)
- Check syntax in ContentValidator.py
- Verify all type annotations are present

### Frontend can't connect
- Verify contract address in `.env`
- Check GenLayer RPC is accessible
- Ensure contract is deployed
- Try refreshing the page

### Transaction fails
- Wait longer for transaction confirmation
- Check GenLayer Studio logs
- Verify account has sufficient balance
- Ensure content meets minimum requirements

## 📚 Learn More

- [GenLayer Documentation](https://docs.genlayer.com)
- [Intelligent Contracts Guide](https://docs.genlayer.com/contracts)
- [GenLayerJS SDK](https://docs.genlayer.com/sdk)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Built with [GenLayer](https://genlayer.com)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons by [Lucide](https://lucide.dev)

---

**Made by Victor using GenLayer Intelligent Contracts**