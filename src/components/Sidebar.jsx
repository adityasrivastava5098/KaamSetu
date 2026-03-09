import React from 'react';

const SKILLS = [
    { label: 'Plumbing', icon: '🔧', query: 'plumbing repair tutorial shorts' },
    { label: 'Electrical', icon: '⚡', query: 'basic electrical wiring tutorial shorts' },
    { label: 'Masonry', icon: '🧱', query: 'masonry construction tutorial shorts' },
    { label: 'Farming', icon: '🌾', query: 'farming techniques tutorial shorts' },
    { label: 'Carpentry', icon: '🪵', query: 'carpentry woodwork tutorial shorts' },
    { label: 'Welding', icon: '🔥', query: 'welding basics tutorial shorts' },
    { label: 'Roofing', icon: '🏚️', query: 'roofing repair tutorial shorts' },
];

const Sidebar = ({ activeSkill, onSelectSkill }) => {
    return (
        <aside className="sidebar">
            <div className="logo">Rural<br /><span>Craft</span></div>
            <div className="skills-label">Skills</div>

            {SKILLS.map((skill) => (
                <button
                    key={skill.label}
                    className={`skill-btn ${activeSkill?.label === skill.label ? 'active' : ''}`}
                    onClick={() => onSelectSkill(skill)}
                >
                    <span className="icon">{skill.icon}</span> {skill.label}
                </button>
            ))}

            <div className="sidebar-footer">Swipe or scroll to learn</div>
        </aside>
    );
};

export default Sidebar;
export { SKILLS };
