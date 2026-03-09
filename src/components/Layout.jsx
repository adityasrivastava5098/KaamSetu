import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';

const Layout = () => {
    const location = useLocation();
    const hideNavPaths = ['/', '/reels']; // Landing page and Reels (reels has its own navigation)
    const shouldShowBottomNav = !hideNavPaths.includes(location.pathname);

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 overflow-x-hidden selection:bg-blue-100 selection:text-blue-600">
            <main className="flex-1">
                <Outlet />
            </main>
            {shouldShowBottomNav && <BottomNav />}
        </div>
    );
};

export default Layout;
