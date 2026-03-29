# LearnIt Web Player 🎓

LearnIt is a beautifully crafted, local-first web application designed to locally organize and stream your downloaded offline video courses seamlessly using modern web APIs. It is built as an aesthetically rich, fully-featured alternative to desktop learning platforms.

## 🚀 Features

- **Local-First Architecture:** Uses the modern Web `File System Access API` to directly read huge video files from your computer securely. No massive background uploads, no backend, and zero data leaving your machine!
- **Intelligent Dashboard:** Visually lists out your loaded courses complete with random metadata, thumbnails, and custom UI color styling.
- **Smart Auto-Resume:** Tracks your video progress locally down to the second. Upon re-approving folder permissions, it seamlessly skips you right back to your exact active video cursor!
- **Dynamic Course Player:** A robust, custom-built HTML5 video player featuring adjustable playback speeds up to 2x, custom volume sliders, global keyboard shortcuts, and smart autoplay skipping logic.
- **Directory Layout:** Reconstructs your course into clean tree branches and chapters exactly how they were exported, visually tracking your chapter-by-chapter progression.
- **Progress Tracking:** Saves exactly which individual video lectures you have completed per course entirely locally.

## 🛠️ Built With

- React 19 + ES Modules
- Vite
- Lucide React (Icons)
- CSS (Custom Responsive Layouts)
- HTML5 File System Access API

## ⚙️ Getting Started

Because LearnIt doesn't require a backend API, running it locally is incredibly fast and simple.

1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/elrath017/learnit-web.git
   ```
2. Navigate into the directory and install dependencies:
   ```bash
   cd learnit-web
   npm install
   ```
3. Start the development server locally:
   ```bash
   npm run dev
   ```

## 🌐 Cloud Deployment (Netlify)

You can instantly deploy this project perfectly to services like [Netlify](https://www.netlify.com/).

1. Simply configure your Netlify site to link directly to your GitHub repository.
2. Netlify will autodetect settings and dynamically execute:
   ```bash
   npm run build
   ```
3. The contents of the produced `dist` folder will be served live statically for free!
