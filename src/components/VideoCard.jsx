import React from 'react';

const VideoCard = React.forwardRef(({ video, index, label, active, onShare }, ref) => {
    const videoId = video.id.videoId;
    const title = video.snippet.title;

    return (
        <div className="video-card" data-index={index} ref={ref}>
            <div className="card-inner">
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={title}
                ></iframe>
                <div className="card-label">
                    <div className="skill-tag">{label}</div>
                    <div className="vid-title">{title}</div>
                </div>
                <div className="card-actions">
                    <a
                        className="action-btn"
                        href={`https://www.youtube.com/watch?v=${videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open on YouTube"
                    >
                        ▶
                    </a>
                    <button
                        className="action-btn"
                        onClick={() => onShare(videoId)}
                        title="Share"
                    >
                        🔗
                    </button>
                </div>
            </div>
        </div>
    );
});

export default VideoCard;
