# LearnIt Web Player 🎓

LearnIt is a beautifully crafted, local-first web application designed to locally organize and stream your downloaded offline video courses seamlessly using modern web APIs. It is built as an aesthetically rich, fully-featured alternative to desktop learning platforms.

## 🚀 Features

- **Local-First Architecture:** Uses the modern Web `File System Access API` to directly read huge video files from your computer securely. No massive background uploads, no backend, and zero data leaving your machine!
- **Intelligent Dashboard:** Visually lists out your loaded courses complete with random metadata, thumbnails, and custom UI color styling.
- **Smart Auto-Resume:** Tracks your video progress locally down to the second. Persistent progress is saved in a `learnitweb-progress.json` file directly in your course folder.
- **Dynamic Course Player:** A robust, custom-built HTML5 video player featuring adjustable playback speeds up to 2x, custom volume sliders, global keyboard shortcuts, and smart autoplay skipping logic.
- **Directory Layout:** Reconstructs your course into clean tree branches and chapters exactly how they were exported, visually tracking your chapter-by-chapter progression.
- **AI Assistant:** Integrated sidebar for AI-powered course assistance (accessible via the "AI Assistant" tab).

## 📖 How to Use

LearnIt is designed to be simple and intuitive. Follow these steps to get started:

### 1. Launch the App
Open the hosted version or run it locally using `npm run dev`. On first load, you'll be greeted with a request to authorize folder access.

### 2. Select Your Courses Folder
Click on the **"Authorize Access to Local Courses Folder"** button. This will open a browser directory picker. 
> [!IMPORTANT]
> Select the **root folder** where all your course directories are stored. LearnIt will automatically scan for subdirectories (courses) and video files.

### 3. Browse and Play
- Your courses will appear as cards on the dashboard.
- Click on a course to open the player.
- The app automatically finds and starts the **first video** in the course structure.
- Use the sidebar on the right to navigate between chapters and lectures.

### 4. Progress Syncing
As you watch, your progress is saved automatically. 
- A file named `learnitweb-progress.json` is created/updated in your selected root folder. 
- This file stores your `lastWatched` video, its timestamp, and a list of `completedVideos`.
- **Portability:** Because the progress is saved in a file, you can move your course folder to another computer, and LearnIt will still remember where you left off!

### 5. Player Controls & Shortcuts
- **Space:** Play / Pause.
- **Arrow Right / Left:** Seek forward/backward 10 seconds.
- **F:** Toggle Fullscreen.
- **Mouse Drag:** You can click and drag the progress bar to scrub through the video.
- **Autoplay:** Toggle the "Autoplay" switch in the bottom right to automatically play the next video when the current one ends.

## 🛠️ Built With

- React 19 + ES Modules
- Vite
- Lucide React (Icons)
- CSS (Custom Responsive Layouts)
- HTML5 File System Access API

## ⚙️ Development Setup

1. Clone this repository:
   ```bash
   git clone https://github.com/elrath017/learnit-web.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🌐 Deployment

This app is a static site and can be deployed anywhere (Netlify, Vercel, GitHub Pages).

1. Build the project:
   ```bash
   npm run build
   ```
2. Serve the `dist` folder.
