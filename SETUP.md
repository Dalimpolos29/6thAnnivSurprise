# Den & Anna - Setup Guide

A private chat application for Dennis and Anna with real-time messaging, photo gallery, and anniversary counter.

## Features

- **Private Chat**: Real-time messaging between Dennis and Anna only
- **Photo Gallery**: Beautiful gallery with 87+ memories
- **Anniversary Counter**: Live counter showing time together
- **PWA**: Install as app on mobile devices
- **Offline Support**: Works offline with service worker caching
- **Dark Mode**: Toggle between light and dark themes
- **Beautiful Animations**: GSAP-powered smooth animations

## Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Animations**: GSAP (GreenSock)
- **Backend**: Supabase (Realtime, Database, Auth)
- **Hosting**: Vercel (recommended)

---

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Enter project details:
   - Name: `den-anna` (or any name)
   - Database Password: (save this securely)
   - Region: Choose closest to you
4. Wait for project to be created (~2 minutes)

### 2. Set Up Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the contents of `supabase-schema.sql`
4. Click "Run" to execute
5. You should see "Success" message

### 3. Get Your API Keys

1. Go to **Settings** > **API**
2. Copy these values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

### 4. Configure the App

1. Open `js/config.js`
2. Replace the placeholder values:

```javascript
const SUPABASE_CONFIG = {
  url: 'YOUR_SUPABASE_URL',        // Replace with your Project URL
  anonKey: 'YOUR_SUPABASE_ANON_KEY' // Replace with your anon public key
};
```

### 5. Enable Realtime

1. Go to **Database** > **Replication**
2. Under "Supabase Realtime", click on "0 tables"
3. Enable realtime for:
   - `messages` table
   - `users` table

---

## Deployment to Vercel

### Option 1: Deploy via GitHub

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Click "Deploy"
6. Your site will be live at `your-project.vercel.app`

### Option 2: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts
```

---

## Local Development

To run locally, you can use any static server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (npx)
npx serve

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

---

## Login Credentials

| User | Username | Password |
|------|----------|----------|
| Dennis | `Dennis` | `Deanna_0502` |
| Anna | `Anna` | `Deanna_0502` |

---

## PWA Installation

### On Mobile (iOS/Android):
1. Open the site in your browser
2. Tap "Share" button
3. Select "Add to Home Screen"
4. The app will now appear on your home screen

### On Desktop (Chrome/Edge):
1. Look for the install icon in the address bar
2. Click "Install"
3. The app will open in its own window

---

## Customization

### Change Anniversary Date
Edit `js/config.js`:
```javascript
anniversaryDate: new Date('2018-05-02T00:00:00')
```

### Change Password
Edit `js/config.js`:
```javascript
password: 'your_new_password'
```

### Change User Avatars
Edit `js/config.js`:
```javascript
users: {
  dennis: {
    avatar: 'photos/YourPhoto.jpg',
    // ...
  },
  anna: {
    avatar: 'photos/YourPhoto.jpg',
    // ...
  }
}
```

### Change Colors
Edit `css/variables.css` to modify the color scheme.

---

## PWA Icons

For a complete PWA experience, create icons in these sizes in the `images/` folder:
- icon-72.png
- icon-96.png
- icon-128.png
- icon-144.png
- icon-152.png
- icon-192.png
- icon-384.png
- icon-512.png

You can use tools like [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator) to create these from a single image.

---

## Troubleshooting

### Messages not syncing in real-time?
1. Check Supabase Realtime is enabled for the `messages` table
2. Check browser console for errors
3. Verify API keys are correct

### Can't login?
1. Make sure you're using the correct username (case-sensitive)
2. Check password is exactly `Deanna_0502`

### PWA not installing?
1. Site must be served over HTTPS (Vercel provides this)
2. manifest.json must be valid
3. Service worker must be registered

---

## Support

This is a private project for Dennis and Anna. For questions, contact the developer.

Made with ❤️ for Den & Anna
