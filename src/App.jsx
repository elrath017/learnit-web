import React, { useState, useEffect, useMemo, useRef } from 'react';
import { PlayCircle, ChevronLeft, ChevronRight, X, Settings, Search, Star, Play, Square, CheckSquare, FolderOpen, Video, Trophy, Share2, MoreVertical, Sparkles, Pause, RotateCcw, RotateCw, Volume2, VolumeX, Maximize, Subtitles } from 'lucide-react';
import './App.css';

// Type priority helper for sorting
const getTypePriority = (name) => {
  const lName = name.toLowerCase();
  if (lName.includes('link') || lName.includes('.url') || lName.includes('.html')) return 0;
  if (lName.endsWith('.pdf')) return 1;
  const isVideo = lName.match(/\.(mp4|mkv|webm|ogg|mov|avi)$/i);
  if (isVideo) return 3;
  return 2;
};

const getNumberPrefix = (name) => {
  const match = name.match(/^(\d+(?:[.-]\d+)*)/);
  return match ? match[0] : null;
};

const advancedSort = (a, b) => {
  const aNum = getNumberPrefix(a.name);
  const bNum = getNumberPrefix(b.name);

  if (aNum && bNum) {
    const numCmp = aNum.localeCompare(bNum, undefined, { numeric: true, sensitivity: 'base' });
    if (numCmp !== 0) return numCmp;
    const typeCmp = getTypePriority(a.name) - getTypePriority(b.name);
    if (typeCmp !== 0) return typeCmp;
  } else if (aNum && !bNum) {
    return -1;
  } else if (!aNum && bNum) {
    return 1;
  } else {
    const typeCmp = getTypePriority(a.name) - getTypePriority(b.name);
    if (typeCmp !== 0) return typeCmp;
  }
  return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
};

// Main App Component
function App() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSettings, setShowSettings] = useState(true); // open by default to ask for permission

  const [lastWatched, setLastWatched] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('learnit_web_last') || 'null');
    } catch {
      return null;
    }
  });

  const getCourseMetadata = () => {
    const isBestseller = Math.random() > 0.6;
    const rating = (4.0 + Math.random()).toFixed(1);
    const reviewCount = Math.floor(Math.random() * 50000) + 1000;
    const price = Math.floor(Math.random() * 400) + 399;
    const colors = ["#2d2f31", "#e59819", "#5624d0", "#1c1d1f"];
    return {
      color: colors[Math.floor(Math.random() * colors.length)],
      rating,
      reviewCount: reviewCount.toLocaleString(),
      currentPrice: `₹${price}`,
      originalPrice: `₹${price * 4}`,
      instructor: "Web Instructor",
      details: "A comprehensive local video course.",
      isBestseller
    };
  };

  const parseDirectory = async (handle) => {
    const structure = [];
    for await (const entry of handle.values()) {
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
             handle: entry,
             path: entry.name // placeholder relative
         });
      }
    }
    return structure;
  };

  const handleSelectFolder = async () => {
    try {
      const handle = await window.showDirectoryPicker({ mode: 'read' });
      const structure = await parseDirectory(handle);
      
      const enriched = structure.map(c => ({
        ...c,
        ...getCourseMetadata()
      }));
      setCourses(enriched);
      setShowSettings(false);
    } catch (err) {
      console.error('Error opening folder:', err);
    }
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setCurrentVideo(null); // Wait for them to select a video inside
  };

  const handleBackToDashboard = () => {
    setSelectedCourse(null);
    setCurrentVideo(null);
  };

  if (selectedCourse) {
    return (
      <VideoPlayerLayout 
        course={selectedCourse} 
        currentVideo={currentVideo} 
        setCurrentVideo={(v) => {
          setCurrentVideo(v);
          const record = {
            courseName: selectedCourse.name,
            videoName: v.name,
            timestamp: Date.now()
          };
          setLastWatched(record);
          localStorage.setItem('learnit_web_last', JSON.stringify(record));
        }}
        onBack={handleBackToDashboard}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
    );
  }

  return (
    <div className="app-container">
      <nav className="navbar" style={{ display: 'flex', alignItems: 'center', height: '7.2rem', gap: '2rem', padding: '0 2.4rem', borderBottom: '1px solid #d1d7dc' }}>
        <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#2d2f31', fontFamily: 'sans-serif', border: '2px solid #a435f0', padding: '0.2rem 0.6rem', borderRadius: '4px', cursor: 'pointer' }} onClick={() => setShowSettings(true)}>Learn<span style={{ color: '#a435f0' }}>It</span></div>
        <div className="search-bar" style={{ flex: 1, maxWidth: '60rem', border: '1px solid #1c1d1f', borderRadius: '4rem', height: '4.8rem', display: 'flex', alignItems: 'center', padding: '0 1.6rem', gap: '1rem', background: '#f7f9fa', marginLeft: '1rem' }}>
          <Search size={20} color="#6a6f73" />
          <input placeholder="Search for anything" style={{ border: 'none', background: 'transparent', width: '100%', fontSize: '1.4rem', outline: 'none' }} />
        </div>
        
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginLeft: 'auto' }}>
          <span style={{ fontWeight: 500, cursor: 'pointer', color: '#2d2f31', fontSize: '1.4rem' }}>Categories</span>
          <button onClick={() => setShowSettings(true)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#2d2f31' }}>
            <Settings size={20} />
            <span style={{ fontSize: '1rem', marginTop: '0.4rem' }}>Folder</span>
          </button>
        </div>
      </nav>

      {showSettings && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Select Courses Folder</h2>
              <button onClick={() => setShowSettings(false)} className="close-btn"><X size={24} /></button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center', padding: '2rem' }}>
              <p style={{ fontSize: '1.4rem', marginBottom: '2rem', lineHeight: '1.6', color: '#2d2f31' }}>
                This is the Web Version of LearnIt. It uses the modern <br/><b>File System Access API</b> to read your videos directly in the browser!
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1.6rem' }}>
                <button onClick={() => setShowSettings(false)} className="btn-secondary" style={{ padding: '1.2rem 2.4rem', fontSize: '1.4rem', border: '1px solid #2d2f31' }}>
                  Cancel
                </button>
                <button onClick={handleSelectFolder} className="btn-primary" style={{ padding: '1.2rem 2.4rem', fontSize: '1.4rem' }}>
                  Authorize Access to Local Courses Folder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="main-container">
        {lastWatched && (
          <div className="section-header-group">
            <h2>What to learn next</h2>
            <div className="continue-learning-card" onClick={() => {
              const course = courses.find(c => c.name === lastWatched.courseName);
              if (course) {
                let foundVideo = null;
                const searchVideo = (items) => {
                  for (const item of items) {
                    if (item.type === 'file' && item.name === lastWatched.videoName) foundVideo = item;
                    if (!foundVideo && item.type === 'directory' && item.children) searchVideo(item.children);
                  }
                };
                if (course.children) searchVideo(course.children);
                
                setSelectedCourse(course);
                if (foundVideo) setCurrentVideo(foundVideo);
              }
            }}>
              <div className="cl-thumbnail" style={{ background: '#2d2f31', position: 'relative' }}>
                <ThumbnailRenderer handle={courses.find(c => c.name === lastWatched.courseName)?.thumbnailHandle} />
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <Play fill="white" color="white" size={48} />
                </div>
              </div>
              <div className="cl-info">
                <span className="cl-meta" style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem', color: '#6a6f73' }}>
                  Date {new Date(lastWatched.timestamp).toLocaleDateString()}
                </span>
                <span className="cl-course-title">{lastWatched.courseName}</span>
                <span className="cl-lecture-title">{lastWatched.videoName}</span>
                <span className="cl-meta">Lecture • Resume</span>
              </div>
            </div>
          </div>
        )}

        <div className="section-header-group" style={{ marginTop: '4rem' }}>
          <h3>Your Library</h3>
          {courses.length === 0 && <p style={{ fontSize: '1.4rem', color: '#6a6f73' }}>No courses loaded. Click 'Folder' in the top right.</p>}
          <div className="carousel-wrapper">
            <div className="course-carousel">
              {courses.map(course => (
                <div key={course.name} className="course-card-new" onClick={() => handleCourseSelect(course)}>
                  <div className="cc-thumbnail">
                     <ThumbnailRenderer handle={course.thumbnailHandle} fallback={
                       <div className="cc-placeholder" style={{ background: course.color }}>
                         <span style={{ fontWeight: 700, fontSize: '2rem', padding: '1rem', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                           {course.name.substring(0, 2).toUpperCase()}
                         </span>
                       </div>
                     }/>
                  </div>
                  <div className="cc-details">
                    <h3 className="cc-title">{course.name}</h3>
                    <span className="cc-instructor">{course.instructor}</span>
                    <div className="cc-rating-row">
                      <span className="rating-number">{course.rating}</span>
                      <div className="rating-stars">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} fill="#e59819" color="#e59819" />
                        ))}
                      </div>
                      <span className="rating-count">({course.reviewCount})</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Sub Component to Render FileSystemHandle as Image URL safely
const ThumbnailRenderer = ({ handle, fallback }) => {
  const [url, setUrl] = useState(null);
  
  useEffect(() => {
    let active = true;
    let objectUrl = null;
    if (handle) {
      handle.getFile().then(file => {
        if (active) {
          objectUrl = URL.createObjectURL(file);
          setUrl(objectUrl);
        }
      }).catch(e => console.error(e));
    }
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    }
  }, [handle]);
  
  if (!handle || !url) return fallback || <div style={{width:'100%', height:'100%', background:'#2d2f31'}}></div>;
  
  return <img src={url} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
};

// Player Layout 
const VideoPlayerLayout = ({ course, currentVideo, setCurrentVideo, onBack, sidebarOpen, setSidebarOpen }) => {
  const [completedVideos, setCompletedVideos] = useState(() => {
    try {
      const stored = localStorage.getItem('learnit_web_completed');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    localStorage.setItem('learnit_web_completed', JSON.stringify([...completedVideos]));
  }, [completedVideos]);

  const [activeTab, setActiveTab] = useState('overview');
  const [expandedFolders, setExpandedFolders] = useState({});

  useEffect(() => {
    if (!currentVideo || !course.children) return;
    
    const pathObj = {};
    const tryFindPath = (items, targetName) => {
      for (const item of items) {
        if (item.type === 'file' && item.name === targetName) {
           return true; 
        }
        if (item.type === 'directory' && item.children) {
           if (tryFindPath(item.children, targetName)) {
              pathObj[item.name] = true;
              return true;
           }
        }
      }
      return false;
    };
    
    if (tryFindPath(course.children, currentVideo.name)) {
       setTimeout(() => {
         setExpandedFolders(prev => ({ ...prev, ...pathObj }));
       }, 0);
    }
  }, [currentVideo, course.children]);

  const flatPlaylist = useMemo(() => {
    const playlist = [];
    const traverse = (items) => {
      const sorted = [...items].sort(advancedSort);
      sorted.forEach(item => {
        if (item.type === 'directory') {
          if (item.children) traverse(item.children);
        } else if (item.name.match(/\.(mp4|mkv|webm|ogg|mov|avi)$/i)) {
          playlist.push(item);
        }
      });
    };
    if (course.children) {
      traverse(course.children);
    }
    return playlist;
  }, [course]);

  const toggleFolder = (path) => {
    setExpandedFolders(prev => ({ ...prev, [path]: !prev[path] }));
  };

  const handleNextVideo = () => {
     const currentIndex = flatPlaylist.findIndex(v => v.name === currentVideo?.name);
     if (currentIndex !== -1 && currentIndex + 1 < flatPlaylist.length) {
       setCurrentVideo(flatPlaylist[currentIndex + 1]);
     }
  };

  const handleVideoCompleted = (shouldAutoplay) => {
     if (currentVideo && !completedVideos.has(currentVideo.name)) {
        setCompletedVideos(prev => new Set(prev).add(currentVideo.name));
     }
     if (shouldAutoplay) {
        handleNextVideo();
     }
  };

  return (
    <div className="player-page" style={{backgroundColor: '#000', height: '100vh', display: 'flex', flexDirection: 'column'}}>
      <header className="player-header" style={{height: '5.6rem', backgroundColor: '#1c1d1f', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.6rem', borderBottom: '1px solid #3e4143', zIndex: 100, flexShrink: 0}}>
        <div className="player-header-left" style={{display: 'flex', alignItems: 'center', gap: '1.6rem', flex: 1}}>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff', cursor: 'pointer', fontFamily: 'sans-serif', border: '2px solid #a435f0', padding: '0.2rem 0.6rem', borderRadius: '4px' }} onClick={onBack}>Learn<span style={{ color: '#a435f0' }}>It</span></div>
          <div className="player-header-title" style={{fontWeight: 700, fontSize: '1.4rem', color: '#fff', borderLeft: '1px solid #3e4143', paddingLeft: '1.6rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '600px'}}>{course.name}</div>
        </div>
        <div className="player-header-right" style={{display: 'flex', alignItems: 'center', gap: '1.6rem'}}>
          <button style={{background: 'transparent', color: '#fff', border: 'none', fontWeight: 700, fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer'}}><Star size={16} /> Leave a rating</button>
          <button style={{background: 'transparent', color: '#fff', border: '1px solid #fff', padding: '0.6rem 1.2rem', fontWeight: 700, fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer'}}><Trophy size={16} /> Your progress</button>
          <button style={{background: 'transparent', color: '#fff', border: '1px solid #fff', padding: '0.6rem 1.2rem', fontWeight: 700, fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer'}}>Share <Share2 size={16} /></button>
          <button style={{background: 'transparent', color: '#fff', border: '1px solid #fff', padding: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}><MoreVertical size={16} /></button>
        </div>
      </header>

      <div className="player-body" style={{display: 'flex', flex: 1, overflow: 'hidden'}}>
        <div className="course-main-left" style={{flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', backgroundColor: '#fff'}}>
          <div className="video-container" style={{ position: 'relative', width: '100%', background: '#000', display: 'flex', flexShrink: 0, aspectRatio: '16/9' }}>
            {currentVideo ? (
              <LocalVideoPlayer fileHandle={currentVideo.handle} onEnded={handleVideoCompleted} onNext={handleNextVideo} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '2rem' }}>
                Select a video to start learning!
              </div>
            )}
          </div>

          <div className="course-content-tabs" style={{ display: 'flex', gap: '2.4rem', padding: '0 2.4rem', borderBottom: '1px solid #d1d7dc', marginTop: '2.4rem' }}>
            {['Overview', 'Q&A', 'Notes', 'Announcements', 'Reviews', 'Learning tools'].map(tab => (
              <div 
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                style={{
                  padding: '0.8rem 0',
                  fontWeight: 700,
                  fontSize: '1.4rem',
                  color: activeTab === tab.toLowerCase() ? '#2d2f31' : '#6a6f73',
                  borderBottom: activeTab === tab.toLowerCase() ? '2px solid #2d2f31' : '2px solid transparent',
                  cursor: 'pointer',
                  marginBottom: '-1px'
                }}
              >
                {tab}
              </div>
            ))}
          </div>
          
          <div className="course-tab-content" style={{ padding: '2.4rem', backgroundColor: '#fff' }}>
            {activeTab === 'overview' && (
              <>
                <h2 style={{ fontSize: '2.4rem', fontWeight: 700, marginBottom: '1.6rem', color: '#2d2f31' }}>
                  {currentVideo ? currentVideo.name.replace(/\.[^/.]+$/, "") : course.name}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.6rem', marginBottom: '3.2rem', fontSize: '1.4rem', color: '#2d2f31' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#b4690e' }}>
                    {course.rating} <Star size={14} fill="#e59819" color="#e59819" />
                  </div>
                  <div style={{ color: '#2d2f31' }}>
                    {course.reviewCount} students
                  </div>
                  <div style={{ color: '#2d2f31' }}>
                    51 hours total
                  </div>
                </div>
                
                <div>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '1.6rem', color: '#2d2f31' }}>Description</h3>
                  <p style={{ fontSize: '1.4rem', lineHeight: '1.6', color: '#2d2f31' }}>
                    Become a Full-Stack Web Developer with just one course. HTML, CSS, Javascript, Node, React, MongoDB, Web3 and DApps 
                    <br/><br/>
                    {course.details}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {sidebarOpen && (
          <div className="course-sidebar-right" style={{width: '40rem', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', flexShrink: 0, zIndex: 20}}>
            <div className="sidebar-tabs" style={{display: 'flex', borderBottom: '1px solid #d1d7dc', alignItems: 'center', background: 'white'}}>
              <div className="sidebar-tab active" style={{flex: 1, padding: '1.6rem', fontWeight: 700, fontSize: '1.4rem', color: '#2d2f31', borderBottom: '2px solid #2d2f31', textAlign: 'center', cursor: 'pointer'}}>Course content</div>
              <div className="sidebar-tab" style={{flex: 1, padding: '1.6rem', fontWeight: 700, fontSize: '1.4rem', color: '#a435f0', textAlign: 'center', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem'}}><Sparkles size={16} /> AI Assistant</div>
              <div style={{ padding: '1.6rem', cursor: 'pointer', borderLeft: '1px solid #d1d7dc' }} onClick={() => setSidebarOpen(false)}><X size={20} color="#2d2f31" /></div>
            </div>

            <div className="sidebar-content">
              {course.children && <SimpleFileTree items={course.children} expanded={expandedFolders} toggle={toggleFolder} onPlay={setCurrentVideo} current={currentVideo} completed={completedVideos} />}
            </div>
          </div>
        )}
        {!sidebarOpen && (
          <div style={{ position: 'absolute', right: 0, top: '6rem', background: '#2d2f31', padding: '1rem', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px', cursor: 'pointer', zIndex: 99 }} onClick={() => setSidebarOpen(true)}>
            <ChevronLeft size={24} color="white" />
          </div>
        )}
      </div>
    </div>
  );
};

// Local Video Player using ObjectURL
const LocalVideoPlayer = ({ fileHandle, onEnded, onNext }) => {
  const [url, setUrl] = useState(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const containerRef = useRef(null);
  
  useEffect(() => {
    let active = true;
    let objectUrl = null;
    if (fileHandle) {
      fileHandle.getFile().then(file => {
        if (active) {
          objectUrl = URL.createObjectURL(file);
          setUrl(objectUrl);
        }
      });
    }
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    }
  }, [fileHandle]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const updateProgress = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100 || 0);
      if (video.currentTime > 0) {
         localStorage.setItem(`learnit_resume_${fileHandle.name}`, video.currentTime);
      }
    };
    const updateDuration = () => {
      setDuration(video.duration);
      video.playbackRate = playbackRate;
      video.volume = volume;
      video.muted = isMuted;

      const savedTime = localStorage.getItem(`learnit_resume_${fileHandle.name}`);
      if (savedTime) {
         const t = parseFloat(savedTime);
         if (t > 0 && t < video.duration - 5) {
            video.currentTime = t;
         }
      }
    };
    
    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('loadedmetadata', updateDuration);
    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('loadedmetadata', updateDuration);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) return;
      
      const video = videoRef.current;
      if (!video) return;

      switch(e.key) {
        case 'ArrowRight':
          video.currentTime = Math.min(video.duration, video.currentTime + 10);
          break;
        case 'ArrowLeft':
          video.currentTime = Math.max(0, video.currentTime - 10);
          break;
        case ' ':
          e.preventDefault();
          if (video.paused) {
            video.play();
            setIsPlaying(true);
          } else {
            video.pause();
            setIsPlaying(false);
          }
          break;
        case 'f':
        case 'F':
          if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen().catch(err => console.error(err));
          } else {
            document.exitFullscreen();
          }
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * duration;
  };

  const handleSpeedChange = (rate) => {
    setPlaybackRate(rate);
    if (videoRef.current) videoRef.current.playbackRate = rate;
    setShowSpeedMenu(false);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
         console.error(err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (timeInSeconds) => {
    if (!timeInSeconds || isNaN(timeInSeconds)) return "0:00";
    const m = Math.floor(timeInSeconds / 60);
    const s = Math.floor(timeInSeconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!url) return <div style={{color:'white', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%'}}>Loading video file...</div>;

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative', background: '#000', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <video 
        ref={videoRef}
        src={url} 
        autoPlay 
        onEnded={() => {
           if (onEnded) onEnded(autoplayEnabled);
        }}
        onClick={togglePlay}
        style={{ width: '100%', flex: 1, objectFit: 'contain' }}
      />
      {duration > 0 && (duration - currentTime <= 5) && onNext && (
         <div style={{ position: 'absolute', bottom: '80px', right: '32px', zIndex: 50 }}>
            <button onClick={onNext} style={{ background: '#1c1d1f', border: '1px solid #3e4143', color: '#fff', padding: '1.2rem 2.4rem', fontSize: '1.6rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.8rem', boxShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              Next Lecture <Play size={16} fill="white" />
            </button>
         </div>
      )}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '2rem 1.6rem 1.2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        
        <div style={{ height: '4px', background: 'rgba(255,255,255,0.3)', cursor: 'pointer', position: 'relative', borderRadius: '2px' }} onClick={handleSeek}>
          <div style={{ height: '100%', width: `${progress}%`, background: '#a435f0', borderRadius: '2px', position: 'relative' }}>
            <div style={{ position: 'absolute', right: '-6px', top: '-4px', width: '12px', height: '12px', background: '#a435f0', borderRadius: '50%' }}></div>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff', marginTop: '0.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.6rem' }}>
            <button onClick={togglePlay} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex' }}>
              {isPlaying ? <Pause fill="white" size={20} /> : <Play fill="white" size={20} />}
            </button>
            <button onClick={() => videoRef.current.currentTime -= 10} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex' }}>
              <RotateCcw size={18} />
            </button>
            
            <div style={{ position: 'relative' }}>
              {showSpeedMenu && (
                <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px', background: 'rgba(28, 29, 31, 0.95)', border: '1px solid #3e4143', borderRadius: '4px', padding: '8px 0', display: 'flex', flexDirection: 'column', zIndex: 100 }}>
                  {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].reverse().map(rate => (
                    <button 
                      key={rate} 
                      onClick={() => handleSpeedChange(rate)} 
                      style={{ background: 'transparent', border: 'none', color: playbackRate === rate ? '#fff' : '#d1d7dc', width: '100%', padding: '6px 16px', fontSize: '1.3rem', fontWeight: playbackRate === rate ? 700 : 400, cursor: 'pointer', textAlign: 'center' }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                      onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
              <button onClick={() => setShowSpeedMenu(!showSpeedMenu)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.3rem', fontWeight: 700, width: '3.6rem' }}>
                {playbackRate}x
              </button>
            </div>

            <button onClick={() => videoRef.current.currentTime += 10} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex' }}>
              <RotateCw size={18} />
            </button>
            <div style={{ fontSize: '1.3rem', marginLeft: '0.8rem', fontWeight: 500 }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1.3rem', fontWeight: 500 }}>
              Autoplay
              <div 
                 onClick={() => setAutoplayEnabled(!autoplayEnabled)}
                 style={{ width: '32px', height: '18px', background: autoplayEnabled ? '#a435f0' : '#3e4143', borderRadius: '10px', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}
              >
                <div style={{ width: '14px', height: '14px', background: '#fff', borderRadius: '50%', position: 'absolute', right: autoplayEnabled ? '2px' : 'auto', left: autoplayEnabled ? 'auto' : '2px', top: '2px', transition: 'all 0.2s' }}></div>
              </div>
            </div>
            
            <button onClick={() => { setIsMuted(!isMuted); if(videoRef.current) videoRef.current.muted = !isMuted; }} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex' }}>
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            
            <input 
              type="range" 
              min="0" max="1" step="0.01" 
              value={isMuted ? 0 : volume} 
              onChange={handleVolumeChange}
              style={{ width: '60px', accentColor: '#a435f0', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '1.2rem', fontWeight: 500, width: '36px' }}>{Math.round((isMuted ? 0 : volume) * 100)}%</span>
            
            <button onClick={toggleFullscreen} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex' }}>
              <Maximize size={20} />
            </button>
            <span style={{ fontSize: '1.4rem', fontWeight: 700, marginLeft: '0.8rem', color: '#a435f0', fontFamily: 'sans-serif' }}>LearnIt</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Tree Parser for Sidebar
const SimpleFileTree = ({ items, expanded, toggle, onPlay, current, completed, level = 0 }) => {
  const sortedItems = [...items].sort(advancedSort);

  return (
    <div style={{ paddingLeft: level > 0 ? '1.6rem' : '0' }}>
      {sortedItems.map(item => {
        if (item.type === 'directory') {
          const isExp = expanded[item.name];
          return (
            <div key={item.name} className="tree-directory">
              <div 
                onClick={() => toggle(item.name)} 
                className="directory-header" 
                style={{ padding: '1.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f7f9fa', borderBottom: '1px solid #d1d7dc', cursor: 'pointer' }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#2d2f31' }}>{item.name.replace(/\.[^/.]+$/, "")}</div>
                </div>
                {isExp ? <ChevronLeft size={20} style={{ transform: 'rotate(90deg)' }} /> : <ChevronLeft size={20} style={{ transform: 'rotate(-90deg)' }} />}
              </div>
              {isExp && item.children && (
                <div className="directory-children" style={{ borderBottom: '1px solid #d1d7dc' }}>
                  <SimpleFileTree items={item.children} expanded={expanded} toggle={toggle} onPlay={onPlay} current={current} completed={completed} level={level + 1} />
                </div>
              )}
            </div>
          );
        } else {
          return <LessonItem key={item.name} item={item} current={current} onPlay={onPlay} completed={completed} level={level} />;
        }
      })}
    </div>
  );
};

const LessonItem = ({ item, current, onPlay, completed, level }) => {
  const isVideo = item.name.match(/\.(mp4|mkv|webm|ogg|mov|avi)$/i);
  const [duration, setDuration] = useState(null);

  useEffect(() => {
    let active = true;
    if (isVideo && item.handle) {
      item.handle.getFile().then(file => {
        if (!active) return;
        const url = URL.createObjectURL(file);
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          if (active) setDuration(video.duration);
          URL.revokeObjectURL(url);
        };
        video.src = url;
      }).catch(e => console.error(e));
    }
    return () => { active = false; };
  }, [isVideo, item.handle]);

  const handleItemClick = () => {
    if (isVideo) {
      onPlay(item);
    } else {
       // For documents, we must open a blob
       item.handle.getFile().then(file => {
          const url = URL.createObjectURL(file);
          window.open(url, '_blank');
       });
    }
  };

  return (
    <div
      className={`lesson-item ${current?.name === item.name ? 'active' : ''}`}
      onClick={handleItemClick}
      style={{ paddingLeft: level > 0 ? '1.6rem' : '1.6rem', backgroundColor: current?.name === item.name ? '#e1f0ec' : 'transparent', borderLeft: current?.name === item.name ? '4px solid #a435f0' : '4px solid transparent' }}
    >
      <div className="lesson-checkbox">
        {isVideo && (completed.has(item.name) ? <div style={{width: '16px', height: '16px', backgroundColor: '#a435f0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '2px'}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div> : <div style={{width: '16px', height: '16px', border: '1px solid #8B9093', borderRadius: '2px'}}></div>)}
        {!isVideo && <div style={{ width: 16 }}></div>}
      </div>
      <div className="lesson-info">
        <div className="lesson-title">{item.name.replace(/\.[^/.]+$/, "")}</div>
        <div className="lesson-meta">
          <div className="video-icon-small">
            {isVideo ? <PlayCircle size={14} /> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>}
          </div>
          <span>{isVideo ? (duration !== null ? `${Math.round(duration / 60)}min` : 'Video') : 'PDF'}</span>
        </div>
      </div>
    </div>
  );
};

export default App;
