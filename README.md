# 💚 G$ Tip Jar - Creator Support Platform

A modern, blockchain-enabled tipping platform built on **Celo** and **GoodDollar (G$)** that empowers content creators to receive direct support from their community. Creators can showcase their profiles, receive tips, and view their complete tipping ledger—all powered by the GoodDollar Universal Basic Income token.

![Celo](https://img.shields.io/badge/Celo-42E100?style=flat-square&logo=celo)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)

---

## 🌟 Features

- **Creator Profiles** - Customize your profile with name, bio, social links (YouTube, Twitter)
- **G$ Tipping System** - Accept tips in GoodDollar tokens with optional custom messages
- **Tipping Ledger** - View complete history of all tips received with sender details and timestamps
- **Embeddable Widget** - Easy-to-embed tip jar widget for your website or blog
- **Real-time Dashboard** - Monitor tips and profile analytics on an interactive dashboard
- **Blockchain Integration** - Powered by Celo/GoodDollar for transparent, peer-to-peer transactions
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

---

## 🏗️ Project Structure

```
celo/
├── backend/                    # Express.js API server
│   ├── server.js              # Main server entry point
│   ├── database.json          # JSON-based persistence layer
│   └── package.json           # Backend dependencies
│
└── frontend/                   # React + Vite application
    ├── src/
    │   ├── App.jsx            # Main app component with routing
    │   ├── main.jsx           # Entry point
    │   ├── App.css            # Global styles
    │   ├── index.css          # Base styles
    │   ├── assets/            # Images and static assets
    │   └── components/
    │       ├── Sidebar.jsx          # Navigation sidebar
    │       ├── DashboardView.jsx    # Creator dashboard & profile editor
    │       └── TipPageView.jsx      # Tipping interface & ledger
    ├── index.html             # HTML template
    ├── vite.config.js         # Vite configuration
    ├── eslint.config.js       # ESLint rules
    ├── package.json           # Frontend dependencies
    └── public/                # Static public assets
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd celo
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start the backend server** (from `backend/` directory)
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5001`

5. **Start the frontend development server** (from `frontend/` directory, in a new terminal)
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173` (or the next available port)

6. **Open your browser**
   Navigate to `http://localhost:5173` to see the application

---

## 📦 Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Next-generation build tool
- **Lucide React** - Icon library
- **CSS3** - Styling and responsive design

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **CORS** - Cross-Origin Resource Sharing
- **JSON File Storage** - Lightweight persistence

### Blockchain
- **Celo** - EVM-compatible blockchain
- **GoodDollar (G$)** - UBI token for tipping

---

## 🔌 API Endpoints

### Creator Profile

**GET /api/profile**
- Retrieve current creator profile information
- Response: `{ name, username, bio, youtube, twitter }`

**POST /api/profile**
- Update creator profile
- Body: `{ name?, username?, bio?, youtube?, twitter? }`
- Response: `{ success: true, profile: {...} }`

### Tips Ledger

**GET /api/tips**
- Retrieve all received tips sorted by date
- Response: Array of tip objects

**POST /api/tips**
- Add a new tip to the ledger
- Body: `{ sender, address?, amount, message?, date? }`
- Response: `{ success: true, tip: {...} }`

### Example Requests

```bash
# Get creator profile
curl http://localhost:5001/api/profile

# Update profile
curl -X POST http://localhost:5001/api/profile \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Name",
    "username": "yourhandle",
    "bio": "Your bio here",
    "youtube": "https://youtube.com/c/yourhandle",
    "twitter": "https://twitter.com/yourhandle"
  }'

# Get all tips
curl http://localhost:5001/api/tips

# Add a tip
curl -X POST http://localhost:5001/api/tips \
  -H "Content-Type: application/json" \
  -d '{
    "sender": "Fan Name",
    "address": "0x123abc...",
    "amount": 50,
    "message": "Love your content!"
  }'
```

---

## 🎨 Application Views

### Dashboard View
- Edit and manage your creator profile
- View profile preview
- Access account settings
- See tip statistics and summary

### Tip Page View
- Browse tipping options (preset amounts: 25, 50, 100 G$)
- Set custom tip amounts
- Add personalized messages
- View complete tipping ledger with sender details
- Copy wallet address and QR code

### Sidebar Navigation
- Quick navigation between views
- Profile shortcuts
- How-it-works guide

---

## 📋 Sample Data

The backend initializes with sample creator data (Nuwayama - Ugandan food recipe creator):

```json
{
  "creator": {
    "name": "Nuwayama",
    "username": "nuwayama",
    "bio": "Sharing authentic Ugandan food recipes from Kampala. Your G$ tips help buy fresh local ingredients!",
    "youtube": "https://youtube.com/c/nuwayama",
    "twitter": "https://twitter.com/nuwayama"
  },
  "tips": [
    {
      "sender": "Alice K.",
      "address": "0x321a...d93e",
      "amount": 25,
      "message": "The Rolex (street food) recipe was incredible! 🔥",
      "date": "Jun 5, 2026, 10:15 AM"
    }
  ]
}
```

---

## 🛠️ Development

### Frontend Development
```bash
cd frontend

# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm lint
```

### Backend Development
```bash
cd backend

# Start with auto-reload (nodemon)
npm run dev

# Start production server
npm start
```

### Environment Variables

Create a `.env` file in the `backend/` directory (optional):
```env
PORT=5001
NODE_ENV=development
```

Create a `.env` file in the `frontend/` directory (optional):
```env
VITE_API_URL=http://localhost:5001
```

---

## 📱 Widget Embedding

The tip jar can be embedded on external websites. Include the widget in your HTML:

```html
<div id="tip-jar-widget"></div>
<script src="https://your-domain.com/widget.js"></script>
```

The TipPageView component supports an `isWidget` prop for iframe-embedded usage.

---

## 🚢 Deployment

### Frontend Deployment (Vercel, Netlify, GitHub Pages)

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy the `dist/` folder to your hosting service

3. Configure your hosting to redirect all routes to `index.html` (for SPA routing)

### Backend Deployment (Heroku, Railway, Render)

1. Ensure `Procfile` exists or configure start command to `npm start`

2. Deploy to your hosting service

3. Set `BACKEND_URL` in frontend `.env` to your production backend URL

### Environment Configuration

Update `BACKEND_URL` in [src/App.jsx](frontend/src/App.jsx) for production:
```javascript
const BACKEND_URL = 'https://your-backend-url.com';
```

---

## 🔐 Security Considerations

- **CORS** is enabled for local development. Configure appropriately for production
- **Database** is JSON-file based. For production, migrate to MongoDB, PostgreSQL, etc.
- **Input Validation** should be added to API endpoints
- **Authentication** should be implemented for profile updates
- **Rate Limiting** should protect against abuse

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📚 Resources

- [Celo Documentation](https://docs.celo.org/)
- [GoodDollar](https://www.gooddollar.org/)
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [Vite Guide](https://vitejs.dev/)

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙋 Support & Contact

For questions, issues, or suggestions:
- Open an issue on GitHub
- Contact the maintainers

---

## 🎯 Roadmap

- [ ] Wallet integration (Web3 integration for on-chain tipping)
- [ ] User authentication & multiple creator profiles
- [ ] Advanced analytics and reporting
- [ ] Notification system (email/SMS for new tips)
- [ ] Payment processing integration
- [ ] Localization (multi-language support)
- [ ] Mobile native app
- [ ] Creator marketplace

---

**Made with ❤️ for the Celo community**
