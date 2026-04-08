/**
 * 1click Traffic Tracker
 * Tracks page visits for admin analytics
 * Data stored in localStorage (client-side only)
 */

(function() {
    const TRAFFIC_KEY = '1click_traffic_data';
    
    // Get or initialize traffic data
    function getTrafficData() {
        try {
            const data = localStorage.getItem(TRAFFIC_KEY);
            if (data) {
                const parsed = JSON.parse(data);
                // Ensure uniqueIPs is an array (for Set serialization)
                if (!parsed.uniqueIPs) parsed.uniqueIPs = [];
                return parsed;
            }
        } catch (e) {
            console.error('[Tracker] Error reading traffic data:', e);
        }
        return { visits: [], uniqueIPs: [] };
    }
    
    // Save traffic data
    function saveTrafficData(data) {
        try {
            localStorage.setItem(TRAFFIC_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('[Tracker] Error saving traffic data:', e);
        }
    }
    
    // Generate a simple fingerprint for unique visitor tracking
    function getVisitorId() {
        let id = localStorage.getItem('1click_visitor_id');
        if (!id) {
            id = 'v_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now();
            localStorage.setItem('1click_visitor_id', id);
        }
        return id;
    }
    
    // Track current page visit
    function trackVisit() {
        const data = getTrafficData();
        const visitorId = getVisitorId();
        
        // Add visit record
        const visit = {
            timestamp: Date.now(),
            page: window.location.pathname,
            referrer: document.referrer || 'direct',
            userAgent: navigator.userAgent,
            visitorId: visitorId,
            screenSize: `${window.screen.width}x${window.screen.height}`
        };
        
        data.visits.push(visit);
        
        // Track unique visitors
        if (!data.uniqueIPs) data.uniqueIPs = [];
        if (!data.uniqueIPs.includes(visitorId)) {
            data.uniqueIPs.push(visitorId);
        }
        
        // Keep only last 1000 visits to prevent storage overflow
        if (data.visits.length > 1000) {
            data.visits = data.visits.slice(-1000);
        }
        
        saveTrafficData(data);
        
        // Dispatch custom event for real-time updates
        window.dispatchEvent(new CustomEvent('trafficUpdate', { detail: visit }));
    }
    
    // Track when user leaves page
    function trackExit() {
        const data = getTrafficData();
        if (data.visits.length > 0) {
            const lastVisit = data.visits[data.visits.length - 1];
            lastVisit.duration = Date.now() - lastVisit.timestamp;
            lastVisit.exitPage = window.location.pathname;
            saveTrafficData(data);
        }
    }
    
    // Initialize tracking
    function init() {
        // Don't track admin panel
        if (window.location.pathname.includes('/admin/')) {
            return;
        }
        
        // Track on page load
        if (document.readyState === 'complete') {
            trackVisit();
        } else {
            window.addEventListener('load', trackVisit);
        }
        
        // Track on page unload
        window.addEventListener('beforeunload', trackExit);
        
        // Track game clicks
        document.addEventListener('click', function(e) {
            const gameCard = e.target.closest('.game-card');
            if (gameCard) {
                const gameName = gameCard.dataset.game || 'unknown';
                trackGameClick(gameName);
            }
        });
    }
    
    // Track game clicks separately
    function trackGameClick(gameName) {
        const data = getTrafficData();
        if (!data.gameClicks) data.gameClicks = {};
        if (!data.gameClicks[gameName]) data.gameClicks[gameName] = 0;
        data.gameClicks[gameName]++;
        saveTrafficData(data);
    }
    
    // Public API
    window.TrafficTracker = {
        getStats: function() {
            const data = getTrafficData();
            const today = new Date().toDateString();
            const todayVisits = data.visits.filter(v => new Date(v.timestamp).toDateString() === today);
            
            return {
                totalVisits: data.visits.length,
                uniqueVisitors: data.uniqueIPs ? data.uniqueIPs.length : 0,
                todayVisits: todayVisits.length,
                gameClicks: data.gameClicks || {},
                recentVisits: data.visits.slice(-10).reverse()
            };
        },
        
        clearData: function() {
            localStorage.removeItem(TRAFFIC_KEY);
            localStorage.removeItem('1click_visitor_id');
        },
        
        exportData: function() {
            return getTrafficData();
        }
    };
    
    // Start tracking
    init();
})();
