/* eslint-disable no-undef */
const fs = require('fs');

let app = fs.readFileSync('src/App.jsx', 'utf-8');

// Remove API_URL
app = app.replace(/const API_URL = 'http:\/\/localhost:3001\/api';/g, '');

// Update state and imports
app = app.replace(/const \[lastWatched, setLastWatched\] = useState\(\(\) => \{/g, `const [dirHandle, setDirHandle] = useState(null);\n  const [lastWatched, setLastWatched] = useState(() => {`);

// Replace the old fetchCourses and handleUpdateFolder
app = app.replace(/\/\/ Fetch courses helper[\s\S]*?\/\/ --- Custom Video Player Component ---/g, `
  // Local File System Parser
  const parseDirectory = async (dirHandle) => {
    const structure = [];
    for await (const entry of dirHandle.values()) {
      if (entry.name.startsWith('.')) continue;

      if (entry.kind === 'directory') {
        const children = await parseDirectory(entry);
        const thumbnailChild = children.find(c => c.type === 'file' && c.name.toLowerCase().startsWith('thumbnail.'));
        const filteredChildren = children.filter(c => !(c.type === 'file' && c.name.toLowerCase().startsWith('thumbnail.')));

        structure.push({
          type: 'directory',
          name: entry.name,
          path: entry.name,
          handle: entry,
          children: filteredChildren,
          thumbnailHandle: thumbnailChild ? thumbnailChild.handle : null
        });
      } else {
         const lowerName = entry.name.toLowerCase();
         if (lowerName.includes('[courseclub.me]') || lowerName.includes('[fcsnew.net]')) continue;
         
         const file = await entry.getFile();
         structure.push({
             type: 'file',
             name: entry.name,
             size: file.size,
             handle: entry
         });
      }
    }
    return structure;
  };

  const handleSelectFolder = async () => {
    try {
      const handle = await window.showDirectoryPicker({ mode: 'read' });
      setDirHandle(handle);
      const structure = await parseDirectory(handle);
      
      const enriched = structure.map(c => ({
        ...c,
        ...getCourseMetadata(c.name)
      }));
      setCourses(enriched);
      setShowSettings(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', height: '7.2rem', gap: '2rem' }}>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#2d2f31', fontFamily: 'sans-serif', border: '2px solid #a435f0', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>Learn<span style={{ color: '#a435f0' }}>It</span></div>
          <div className="search-bar" style={{ flex: 1, maxWidth: '60rem', border: '1px solid #1c1d1f', borderRadius: '4rem', height: '4.8rem', display: 'flex', alignItems: 'center', padding: '0 1.6rem', gap: '1rem', background: '#f7f9fa' }}>
            <Search size={20} color="#6a6f73" />
            <input placeholder="Search for anything" style={{ border: 'none', background: 'transparent', width: '100%', fontSize: '1.4rem', outline: 'none' }} />
          </div>
        </div>
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <span style={{ fontWeight: 500, cursor: 'pointer', color: '#2d2f31' }}>Categories</span>
          <button onClick={() => setShowSettings(true)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#2d2f31' }}>
            <Settings size={20} />
            <span style={{ fontSize: '1rem', marginTop: '0.4rem' }}>Settings</span>
          </button>
        </div>
      </nav>

      {showSettings && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Settings</h2>
              <button onClick={() => setShowSettings(false)} className="close-btn"><X size={24} /></button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '1.4rem', marginBottom: '1.6rem' }}>Select the main folder containing your courses from your local computer. This app runs completely in your browser and reads files locally.</p>
              <button onClick={handleSelectFolder} className="btn-primary" style={{ padding: '1.2rem', fontSize: '1.4rem' }}>Select Local Course Folder</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container replacing the rest for brevity. We need to preserve the CC-cards logic though! */}`);

fs.writeFileSync('src/App.jsx.temp', app, 'utf-8');
