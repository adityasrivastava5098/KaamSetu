import React, { useEffect, useRef, useState, useMemo } from 'react';
import VideoCard from './VideoCard';

const VideoFeed = ({ videos, label, onShare, onIndexChange }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const feedRef = useRef(null);
    const cardRefs = useRef([]);

    useEffect(() => {
        setActiveIndex(0);
        onIndexChange(0);
        // Reset scroll when videos change
        if (feedRef.current) {
            feedRef.current.scrollTop = 0;
        }
    }, [videos, onIndexChange]);

    useEffect(() => {
        if (!videos || videos.length === 0) return;

        const observerOptions = {
            root: feedRef.current,
            threshold: 0.5,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const index = parseInt(entry.target.dataset.index);
                    setActiveIndex(index);
                    onIndexChange(index);
                }
            });
        }, observerOptions);

        const currentCards = cardRefs.current;
        currentCards.forEach((card) => {
            if (card) observer.observe(card);
        });

        return () => {
            currentCards.forEach((card) => {
                if (card) observer.unobserve(card);
            });
        };
    }, [videos, onIndexChange]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!videos || videos.length === 0) return;
            if (e.key === 'ArrowDown' && activeIndex < videos.length - 1) {
                cardRefs.current[activeIndex + 1]?.scrollIntoView({ behavior: 'smooth' });
            } else if (e.key === 'ArrowUp' && activeIndex > 0) {
                cardRefs.current[activeIndex - 1]?.scrollIntoView({ behavior: 'smooth' });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [videos, activeIndex]);

    if (!videos || videos.length === 0) {
        return (
            <div className="feed" id="feed">
                <div className="video-card">
                    <div className="state-screen">
                        <div className="big-icon">🌿</div>
                        <h2>Start Learning</h2>
                        <p>Select any skill from the sidebar to begin</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="feed-wrapper">
            <div className="feed" id="feed" ref={feedRef}>
                {videos.map((video, i) => (
                    <VideoCard
                        key={video.id.videoId}
                        video={video}
                        index={i}
                        label={label}
                        onShare={onShare}
                        ref={(el) => (cardRefs.current[i] = el)}
                    />
                ))}
            </div>

            <div className="scroll-hint" id="dots">
                {videos.map((_, i) => (
                    <div
                        key={i}
                        className={`hint-dot ${i === activeIndex ? 'active' : ''}`}
                        onClick={() => cardRefs.current[i]?.scrollIntoView({ behavior: 'smooth' })}
                        style={{ cursor: 'pointer' }}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default VideoFeed;
