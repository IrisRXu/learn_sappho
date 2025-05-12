document.addEventListener('DOMContentLoaded', function() {
    const progressContainer = document.querySelector('.progress-container');
    const currentPage = parseInt("{{ current_page }}");
    const path = window.location.pathname;
    const isHomePage = path === "/";
    const isLearningPage = path.startsWith('/page');
    const isTestOrCreate = path.startsWith('/quiz') || path.startsWith('/create');
    
    // Reset progress bar visibility on home page
    if (isHomePage) {
        sessionStorage.removeItem('showProgressBar');
        progressContainer.classList.remove('visible');
    }
    
    function getPageNumber() {
        if (path === '/') return 0;
        const match = path.match(/\/page(\d+)/);
        return match ? parseInt(match[1]) : 0;
    }
    
    function updateProgressBar() {
        const progressLabel = document.querySelector('.progress-label');
        const progressFill = document.querySelector('.progress-fill');
        
        if (progressLabel && progressFill) {
            const currentPageNum = getPageNumber();
            progressLabel.textContent = `${currentPageNum}/7`;
            const progress = Math.min(Math.max((currentPageNum / 7) * 100, 0), 100);
            progressFill.style.width = `${progress}%`;
        }
    }

    // Only show progress bar if we're in learning pages and it should be shown
    if (isLearningPage && sessionStorage.getItem('showProgressBar') === 'true') {
        progressContainer.classList.add('visible');
        updateProgressBar();
    } else if (isTestOrCreate) {
        progressContainer.classList.remove('visible');
    }

    // Add click handlers to explore buttons
    document.querySelectorAll('[data-explore-button]').forEach(button => {
        button.addEventListener('click', function(e) {
            sessionStorage.setItem('showProgressBar', 'true');
            progressContainer.classList.add('visible');
            updateProgressBar();
        });
    });

    // Add click handler for home link
    document.querySelector('a[href="/"]').addEventListener('click', function() {
        sessionStorage.removeItem('showProgressBar');
        progressContainer.classList.remove('visible');
    });
});

// Override the navigateTo function to maintain progress bar state
function navigateTo(path) {
    const items = document.querySelectorAll('.nav-item');
    items.forEach(item => item.classList.remove('active'));
    
    const activeItem = document.querySelector(`.nav-item[href="${path.replace(" ", "")}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
}