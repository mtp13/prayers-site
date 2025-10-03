// Dynamic Mystery Updater
// Updates the mystery display based on the current day
(function() {
    'use strict';
    
    // Mystery mapping for each day of the week
    const mysteryMapping = {
        1: 'Joyful Mysteries',    // Monday
        2: 'Sorrowful Mysteries', // Tuesday
        3: 'Glorious Mysteries',  // Wednesday
        4: 'Luminous Mysteries',  // Thursday
        5: 'Sorrowful Mysteries', // Friday
        6: 'Joyful Mysteries',    // Saturday
        0: 'Glorious Mysteries'   // Sunday (getDay() returns 0 for Sunday)
    };
    
    // URL mapping for mysteries
    const mysteryUrls = {
        'Joyful Mysteries': '/mysteries/joyful-mysteries',
        'Sorrowful Mysteries': '/mysteries/sorrowful-mysteries',
        'Glorious Mysteries': '/mysteries/glorious-mysteries',
        'Luminous Mysteries': '/mysteries/luminous-mysteries'
    };
    
    function updateTodaysMystery() {
        const mysteryContainer = document.querySelector('.todays-mystery');
        if (!mysteryContainer) return;
        
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const mysteryForToday = mysteryMapping[dayOfWeek];
        const mysteryUrl = mysteryUrls[mysteryForToday];
        
        // Format the date
        const dateOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const formattedDate = today.toLocaleDateString('en-US', dateOptions);
        
        // Update the mystery title link
        const titleLink = mysteryContainer.querySelector('h3 a');
        if (titleLink) {
            titleLink.textContent = mysteryForToday;
            titleLink.href = mysteryUrl;
        }
        
        // Update the date text
        const dateText = mysteryContainer.querySelector('p em');
        if (dateText) {
            dateText.textContent = `Today's recommended mystery for ${formattedDate}`;
        }
        
        // Update the read more link
        const readMoreLink = mysteryContainer.querySelector('.read-more-link');
        if (readMoreLink) {
            readMoreLink.href = mysteryUrl;
            readMoreLink.textContent = `Read the full ${mysteryForToday} →`;
        }
        
        // Add a data attribute to indicate this was updated by JS
        mysteryContainer.setAttribute('data-js-updated', 'true');
    }
    
    // Update when the page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateTodaysMystery);
    } else {
        updateTodaysMystery();
    }
    
    // Optional: Update every hour to catch day changes for long-running sessions
    setInterval(updateTodaysMystery, 60 * 60 * 1000); // 1 hour
    
})();