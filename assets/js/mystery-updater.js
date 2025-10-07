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
    
    // Mystery lists for each type
    const mysteryLists = {
        'Joyful Mysteries': [
            "First Joyful Mystery: The Annunciation",
            "Second Joyful Mystery: The Visitation", 
            "Third Joyful Mystery: The Nativity",
            "Fourth Joyful Mystery: The Presentation",
            "Fifth Joyful Mystery: The Finding in the Temple"
        ],
        'Sorrowful Mysteries': [
            "First Sorrowful Mystery: The Agony in the Garden",
            "Second Sorrowful Mystery: The Scourging at the Pillar",
            "Third Sorrowful Mystery: The Crowning with Thorns", 
            "Fourth Sorrowful Mystery: The Carrying of the Cross",
            "Fifth Sorrowful Mystery: The Crucifixion and Death"
        ],
        'Glorious Mysteries': [
            "First Glorious Mystery: The Resurrection",
            "Second Glorious Mystery: The Ascension",
            "Third Glorious Mystery: The Descent of the Holy Spirit",
            "Fourth Glorious Mystery: The Assumption of Mary",
            "Fifth Glorious Mystery: The Coronation of Mary"
        ],
        'Luminous Mysteries': [
            "First Luminous Mystery: The Baptism of Jesus",
            "Second Luminous Mystery: The Wedding at Cana",
            "Third Luminous Mystery: The Proclamation of the Kingdom",
            "Fourth Luminous Mystery: The Transfiguration", 
            "Fifth Luminous Mystery: The Institution of the Eucharist"
        ]
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
        
        // Update the mystery list
        const mysteryList = mysteryContainer.querySelector('.mystery-list ol');
        if (mysteryList && mysteryLists[mysteryForToday]) {
            mysteryList.innerHTML = '';
            mysteryLists[mysteryForToday].forEach(mystery => {
                const li = document.createElement('li');
                li.textContent = mystery;
                mysteryList.appendChild(li);
            });
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
