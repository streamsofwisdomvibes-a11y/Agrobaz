# Agrobaz Frontend

A modern Next.js 14 frontend for the Agrobaz agricultural marketplace with Redux state management, Tailwind CSS styling, and seamless backend integration.

## Features

- ✅ Next.js 14 with App Router
- ✅ Redux state management
- ✅ Tailwind CSS + responsive design
- ✅ Dark/Light theme toggle
- ✅ Authentication (JWT tokens)
- ✅ Product marketplace with filtering
- ✅ Seller & Affiliate dashboards
- ✅ Shopping cart
- ✅ Order management
- ✅ Vercel deployment ready

## Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Run Development Server
```bash
npm run dev
```

App runs on `http://localhost:3000`

## Project Structure

```
frontend/
├── app/                 # Next.js app directory
│   ├── (auth)/         # Auth pages
│   ├── (dashboard)/    # Dashboard pages
│   ├── (marketplace)/  # Marketplace pages
│   ├── page.jsx        # Home page
│   └── layout.jsx      # Root layout
├── components/         # Reusable components
├── store/             # Redux store & slices
├── lib/               # Utilities (API, auth)
├── public/            # Static assets
├── globals.css        # Global styles
├── tailwind.config.js
├── next.config.js
└── package.json
```

## Key Components

### Redux Store
- **auth**: User authentication & session
- **products**: Product listing & filtering
- **orders**: Order management
- **cart**: Shopping cart state

### Pages
- `/` - Home/Landing
- `/marketplace` - Product marketplace
- `/signin` - Authentication (register/login)
- `/dashboard/seller` - Seller dashboard
- `/dashboard/affiliate` - Affiliate dashboard
- `/product/:id` - Product details
- `/checkout` - Checkout flow

### API Integration
All API calls go through `/lib/api.js` which handles:
- JWT token injection
- Request/response interceptors
- Base URL configuration
- Error handling

## Authentication Flow

1. User selects role (buyer/seller/affiliate)
2. Register or login with email/password
3. Token saved in cookies & Redux store
4. Automatic token injection in API headers
5. Logout clears auth state

## Building & Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deploy on Vercel

1. Push to GitHub
2. Connect repo to Vercel
3. Set environment variables
4. Deploy with one click

Vercel will automatically:
- Build the Next.js app
- Optimize for production
- Deploy on edge network

## Styling

- **Tailwind CSS** for utility-first styling
- **Dark mode** support with `data-theme` attribute
- **Responsive design** with mobile-first approach
- **Custom utilities** in `globals.css`

## State Management with Redux

### Example: Dispatching Actions

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '@/store/slices/authSlice';

const MyComponent = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector(state => state.auth);

  const handleLogin = async (credentials) => {
    const response = await authAPI.login(credentials.email, credentials.password);
    dispatch(loginSuccess(response.data));
  };
};
```

## API Integration

### Example: Fetching Products

```javascript
import { productAPI } from '@/lib/api';

const products = await productAPI.getAll({ 
  category: 'fresh-crops',
  minPrice: 100,
  maxPrice: 1000
});
```

## Development Tips

- Hot reload on file changes
- Redux DevTools integration (install extension)
- TypeScript support (optional, configure in `tsconfig.json`)
- ESLint for code quality

## Common Issues

**Q: API not connecting?**
A: Check `NEXT_PUBLIC_API_URL` in `.env.local`

**Q: Dark mode not working?**
A: Ensure `document.body.setAttribute('data-theme', 'dark')` is called

**Q: Redux state not persisting?**
A: Add Redux Persist or use cookies (like auth tokens)

## Next Steps

1. Add product detail page
2. Implement checkout flow
3. Add order history
4. Add seller inventory management
5. Add affiliate referral tracking
6. Implement payment gateway (Stripe)
7. Add email notifications
8. Add analytics

## License

MIT
