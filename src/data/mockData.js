export const professions = [
    {
        id: 'electrician',
        title: 'Electrician',
        icon: 'Zap',
        modules: [
            { id: 'elec-1', title: 'Basic Circuitry', videoUrl: 'https://www.youtube.com/embed/placeholder1', quizId: 'q1' },
            { id: 'elec-2', title: 'House Wiring', videoUrl: 'https://www.youtube.com/embed/placeholder2', quizId: 'q2' },
            { id: 'elec-3', title: 'Safety Gear', videoUrl: 'https://www.youtube.com/embed/placeholder3', quizId: 'q3' },
        ]
    },
    {
        id: 'carpentry',
        title: 'Carpentry',
        icon: 'Hammer',
        modules: [
            { id: 'carp-1', title: 'Wood Types', videoUrl: 'https://www.youtube.com/embed/placeholder4', quizId: 'q4' },
            { id: 'carp-2', title: 'Cutting Techniques', videoUrl: 'https://www.youtube.com/embed/placeholder5', quizId: 'q5' },
        ]
    },
    {
        id: 'plumbing',
        title: 'Plumbing',
        icon: 'Droplets',
        modules: [
            { id: 'plumb-1', title: 'Pipe Fittings', videoUrl: 'https://www.youtube.com/embed/placeholder6', quizId: 'q6' },
        ]
    },
    {
        id: 'construction',
        title: 'Construction',
        icon: 'HardHat',
        modules: [
            { id: 'const-1', title: 'Brick Laying', videoUrl: 'https://www.youtube.com/embed/placeholder7', quizId: 'q7' },
        ]
    }
];

export const badges = [
    { id: 'b1', title: 'Beginner Electrician', description: 'Mastered basic circuits and safety.', icon: 'Zap' },
    { id: 'b2', title: 'Carpentry Assistant', description: 'Proficient in wood cutting and measuring.', icon: 'Hammer' },
    { id: 'b3', title: 'Plumbing Helper', description: 'Understands basic pipe connections.', icon: 'Droplets' },
];

export const reels = [
    { id: 'r1', title: 'How to fix a switch', profession: 'Electrician', videoUrl: 'r1_video', likes: '1.2k' },
    { id: 'r2', title: 'Secret of smooth wood', profession: 'Carpentry', videoUrl: 'r2_video', likes: '800' },
    { id: 'r3', title: 'Stopping a pipe leak', profession: 'Plumbing', videoUrl: 'r3_video', likes: '2.5k' },
    { id: 'r4', title: 'Safety first at site', profession: 'Construction', videoUrl: 'r4_video', likes: '1.5k' },
];

export const jobs = [
    { id: 'j1', title: 'Assistant Electrician', company: 'ABC Construction', location: 'Mumbai', salary: '₹15,000 - ₹20,000' },
    { id: 'j2', title: 'Senior Carpenter', company: 'WoodWorks Interiors', location: 'Delhi', salary: '₹25,000 - ₹30,000' },
];

export const workers = [
    {
        id: 'w1',
        name: 'Ramesh Kumar',
        skills: ['Beginner Electrician', 'Plumbing Helper'],
        experience: '1 year',
        status: 'Available for Work',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ramesh'
    },
    {
        id: 'w2',
        name: 'Suresh Patil',
        skills: ['Carpentry Assistant'],
        experience: '2 years',
        status: 'In Interview',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Suresh'
    },
];

export const quizzes = {
    'q1': {
        title: 'Basic Circuitry Quiz',
        questions: [
            {
                id: 1,
                text: 'What is used to measure current?',
                options: ['Voltmeter', 'Ammeter', 'Multimeter', 'Thermometer'],
                answer: 1
            },
            {
                id: 2,
                text: 'A circuit must be ________ to let electricity flow.',
                options: ['Open', 'Broken', 'Closed', 'High'],
                answer: 2
            },
        ]
    }
};
