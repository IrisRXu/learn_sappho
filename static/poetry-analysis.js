document.addEventListener('DOMContentLoaded', function() {
    // Set up poem line click events for enhanced analysis
    const poemLines = document.querySelectorAll('.poem-line');
    const analysisContents = document.querySelectorAll('.analysis-content');
    
    poemLines.forEach(line => {
        line.addEventListener('click', function() {
            const lineId = this.id;
            const analysisId = lineId.replace('line', 'analysis');
            const analysisContent = document.getElementById(analysisId);
            
            // Toggle active state for this line
            this.classList.toggle('active');
            
            // Remove active state from other lines
            poemLines.forEach(otherLine => {
                if (otherLine.id !== lineId && otherLine.classList.contains('active')) {
                    otherLine.classList.remove('active');
                }
            });
            
            // Hide all analysis contents
            analysisContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Show the analysis for this line if it exists
            if (analysisContent) {
                analysisContent.classList.add('active');
            }
        });
    });
    
    // Show the first analysis content by default (for demonstration purposes)
    setTimeout(() => {
        if (document.getElementById('line1')) {
            document.getElementById('line1').click();
        }
    }, 1000);

    // Initialize stars background if needed
    initStarsBackground();
});

// Function to initialize stars background
function initStarsBackground() {
    const starsContainer = document.getElementById('stars-container');
    
    // Only initialize if the container exists and is empty
    if (starsContainer && starsContainer.children.length === 0) {
        console.log("Initializing stars manually");
        const starCount = Math.min(100, Math.floor(window.innerWidth * window.innerHeight / 2000));
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            
            // Random size between 1-3px
            const size = Math.random() * 2 + 1;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            
            // Random position
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            
            // Random twinkle animation
            star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
            star.style.setProperty('--delay', `${Math.random() * 5}s`);
            star.style.setProperty('--opacity', `${Math.random() * 0.7 + 0.3}`);
            
            starsContainer.appendChild(star);
        }
    }
} 