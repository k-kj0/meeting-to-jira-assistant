# DesignPro — Product Design Education Platform

A modern, animated React + TypeScript + Vite + Tailwind CSS + Framer Motion landing page for a product design education platform.

## 🚀 Tech Stack

- **React 18** + **TypeScript**
- **Vite** (Build tool)
- **Tailwind CSS** (Styling)
- **Framer Motion** (Animations)
- **Lucide React** (Icons)
- **Inter** (Google Fonts)

## 📁 Project Structure

```
designpro/
├── src/
│   ├── App.tsx              # Main application with all sections
│   ├── main.tsx             # Entry point
│   ├── index.css            # Tailwind directives + base styles
│   └── vite-env.d.ts        # Vite type declarations
├── index.html               # HTML entry (with Google Fonts)
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── tsconfig.node.json       # TS config for Vite
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
├── vercel.json              # Vercel deployment config
├── Dockerfile               # Docker multi-stage build
├── nginx.conf               # Nginx configuration for SPA
├── docker-compose.yml       # Docker Compose setup
├── .dockerignore            # Docker ignore rules
└── .gitignore               # Git ignore rules
```

## 🛠️ Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open http://localhost:5173
```

## 🌐 Deploy to Vercel (Recommended)

### Option A: GitHub + Vercel (Auto-deploy)

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/designpro.git
git push -u origin main
```

2. **Import in Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import from GitHub
   - Select your repository
   - Vercel auto-detects Vite framework
   - Click **Deploy**

3. **Done!** Vercel will:
   - Run `npm run build`
   - Deploy `dist/` folder
   - Handle SPA routing via `vercel.json`
   - Provide HTTPS + CDN automatically

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel login
vercel

# Follow prompts — Vercel auto-detects Vite
```

## 🐳 Docker Deployment

### Build & Run with Docker

```bash
# Build the Docker image
docker build -t designpro .

# Run the container
docker run -d -p 8080:80 --name designpro designpro

# Open http://localhost:8080
```

### Docker Compose (Easier)

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down

# Rebuild after changes
docker-compose up -d --build
```

### Why CSS/Styles Work in Docker

The **multi-stage Dockerfile** ensures styles work:

1. **Stage 1 (Build):** Node.js builds the app → runs `npm run build` → generates `dist/` with compiled CSS
2. **Stage 2 (Production):** Nginx serves only the built `dist/` files (HTML + CSS + JS)

The `nginx.conf` handles:
- ✅ SPA routing (all routes → `index.html`)
- ✅ Gzip compression
- ✅ Static asset caching
- ✅ Security headers

## 🔧 Key Configuration Files Explained

### `vite.config.ts`
- Sets `outDir: 'dist'` (Vercel reads this)
- Code splitting into chunks (vendor, animation, icons)

### `vercel.json`
- Tells Vercel: build command = `npm run build`, output = `dist/`
- SPA rewrite rule: all paths → `index.html`
- Asset caching headers for performance

### `tailwind.config.js`
- Content paths: `./index.html` + `./src/**/*.{js,ts,jsx,tsx}`
- Custom colors, animations, fonts

### `tsconfig.json`
- Strict TypeScript settings
- Module resolution: `bundler` (for Vite)
- Includes only `src/` directory

## 📝 Important Notes

- **Video background** uses external CloudFront URL — ensure CORS allows your domain
- **Google Fonts** loaded via `index.html` `<link>` tag
- **No Pricing section** — removed as requested for resume
- **All animations** use Framer Motion with scroll triggers
- **Responsive** — mobile-first with breakpoints: sm(640), md(768), lg(1024), xl(1280)

## 🎯 Features for Resume

- ✅ Full-screen video hero with parallax
- ✅ Shiny animated gradient text (Framer Motion)
- ✅ Scroll-triggered animations
- ✅ Interactive hover effects
- ✅ Mobile-responsive navigation
- ✅ Docker containerization
- ✅ Production-ready Nginx config
- ✅ CI/CD ready (Vercel/GitHub)
