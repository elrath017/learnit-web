# LearnIt Web Player 🎓

LearnIt is a beautifully crafted, local-first web application designed to locally organize and stream your downloaded offline video courses seamlessly using modern web APIs. It is built as an aesthetically rich, fully-featured alternative to desktop learning platforms.

**🌐 Live Web Version:** [learnitweb.netlify.app](https://learnitweb.netlify.app/)

## 🚀 Features

- **Local-First Architecture:** Uses the modern Web `File System Access API` to directly read huge video files from your computer securely. No massive background uploads, no backend, and zero data leaving your machine!
- **Intelligent Dashboard:** Visually lists your course folders. It automatically filters out non-folder files (like metadata or JSON) to keep your library clean.
- **Smart Tracking:** Progress is automatically tracked in your browser's local storage for a seamless experience. Watch count, completion status, and last viewed time are all handled instantly.
- **Persistent Portable Progress:** Use the "Your Progress" panel to explicitly **💾 Save** your history to a `learnitweb-progress.json` file in your course folder or **🗂️ Recover** history from an existing file.
- **Dynamic Course Player:** A robust, custom-built HTML5 video player featuring adjustable playback speeds, custom volume sliders, keyboard shortcuts, and smart autoplay logic.
- **Course Management:** Monitor your path with a visual progress bar and percentage indicator. Need to start over? Use the **↺ Restart Course** feature to clear progress and jump back to the first lesson.

## 📖 How to Use

LearnIt is designed to be simple and intuitive. Follow these steps to get started:

### 1. Launch the App
Go to the [live web version](https://learnitweb.netlify.app/) or run it locally using `npm run dev`. On first load, you'll be greeted with a request to authorize folder access.

### 2. Select Your Courses Folder
Click on the **"Authorize Access to Local Courses Folder"** button and select the **root folder** where all your course directories are stored. LearnIt scans for subdirectories (courses) and organizes them automatically.

### 3. Browse and Play
- Course folders appear as cards on the dashboard (loose files are filtered out).
- Click a course to start learning. The app automatically launches the first video.
- Use the right sidebar to navigate between chapters and lectures.

### 4. Managing Progress
Your learning journey is saved automatically to your browser, but you can manage it further via the **"Your progress"** button in the player header:
- **💾 Save:** Commits your current progress to `learnitweb-progress.json` in your local folder.
- **🗂️ Recover:** Restores your history from a previously saved JSON file (perfect for switching devices).
- **↺ Restart Course:** Resets all completion marks for the current course and returns you to the first lecture.

### 5. Player Controls & Shortcuts
- **Space:** Play / Pause.
- **Arrow Right / Left:** Seek forward/backward 10 seconds.
- **F:** Toggle Fullscreen.
- **Volume Controller:** Custom slider with percentage display.
- **Speed Selector:** Adjustable playback from 0.5x to 2x.
- **Autoplay:** Automatically jump to the next lecture upon completion.

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
