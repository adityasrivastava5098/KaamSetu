import React from 'react';

const Topbar = ({ title, subtitle }) => {
    return (
        <div className="topbar">
            <div className="topbar-title">{title || 'Pick a Skill'}</div>
            <div className="topbar-meta">{subtitle || '← choose from the sidebar'}</div>
        </div>
    );
};

export default Topbar;
