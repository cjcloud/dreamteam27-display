# DreamTeam26

A Next.js application for tracking team performance in the 2025/26 season. Built with Next.js, Firebase, and Tailwind CSS.

## Features

- Real-time team and player stats
- League position tracking
- Beautiful UI with animations
- Responsive design for all devices

## Tech Stack

- Next.js 13 with App Router
- Firebase (Realtime Database & Hosting)
- Tailwind CSS
- TypeScript

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your Firebase configuration
4. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment

The app is configured for static exports and Firebase hosting:

```bash
npm run build
firebase deploy --only hosting
```