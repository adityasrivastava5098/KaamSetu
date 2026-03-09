import React, { useState, useCallback, useEffect } from 'react';
import './App.css';
import Sidebar, { SKILLS } from './components/Sidebar';
import Topbar from './components/Topbar';
import VideoFeed from './components/VideoFeed';
import Toast from './components/Toast';

const API_KEY = "AIzaSyDX4st0rcp5_JqTrldpZFrb-axKqPF1iAo";

function App() {
  const [activeSkill, setActiveSkill] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState('');

  const loadVideos = useCallback(async (skill) => {
    setLoading(true);
    setError(null);
    setActiveIndex(0);

    try {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(skill.query)}&type=video&videoDuration=short&maxResults=9&key=${API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error.message || 'YouTube API error');
      }

      if (!data.items || data.items.length === 0) {
        setVideos([]);
      } else {
        setVideos(data.items);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelectSkill = (skill) => {
    if (activeSkill?.label === skill.label) return;
    setActiveSkill(skill);
    loadVideos(skill);
  };

  const handleShare = (videoId) => {
    navigator.clipboard.writeText(`https://www.youtube.com/watch?v=${videoId}`);
    setToastMessage('Link copied!');
  };

  const handleIndexChange = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  const getTopbarSubtitle = () => {
    if (loading) return 'Finding the best shorts...';
    if (!activeSkill) return '← choose from the sidebar';
    if (videos.length > 0) return `${activeIndex + 1} of ${videos.length} videos`;
    return 'No videos found';
  };

  return (
    <>
      <Sidebar activeSkill={activeSkill} onSelectSkill={handleSelectSkill} />
      <main className="main">
        <Topbar
          title={loading ? 'Loading...' : (activeSkill?.label || 'Pick a Skill')}
          subtitle={getTopbarSubtitle()}
        />

        <div className="feed-wrapper">
          {loading ? (
            <div className="feed">
              <div className="video-card">
                <div className="state-screen">
                  <div className="spinner"></div>
                  <h2>Loading</h2>
                  <p>Finding the best {activeSkill?.label} shorts…</p>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="feed">
              <div className="video-card">
                <div className="state-screen">
                  <div className="big-icon">⚠️</div>
                  <h2>Error</h2>
                  <p>{error}</p>
                </div>
              </div>
            </div>
          ) : videos.length === 0 && activeSkill ? (
            <div className="feed">
              <div className="video-card">
                <div className="state-screen">
                  <div className="big-icon">😕</div>
                  <h2>No Videos</h2>
                  <p>Try another skill</p>
                </div>
              </div>
            </div>
          ) : (
            <VideoFeed
              videos={videos}
              label={activeSkill?.label}
              onShare={handleShare}
              onIndexChange={handleIndexChange}
            />
          )}
        </div>
      </main>

      {toastMessage && (
        <Toast
          message={toastMessage}
          onExited={() => setToastMessage('')}
        />
      )}
    </>
  );
}

export default App;
