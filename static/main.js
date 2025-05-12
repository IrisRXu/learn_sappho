// quizEnabled = false;

function updateProgress(section, pagesCompleted, totalPages) {
    const progressContainer = document.getElementById(`${section}`);
    progressContainer.classList.add('visible');
    const progressElement = document.getElementById(`${section}-progress`);
    console.log("Progress element:", progressElement);
    const progressPercentage = (pagesCompleted / totalPages) * 100;
    progressElement.style.width = `${progressPercentage}%`;
}

function saveProgress(learning_completed) {
    console.log("saveProgress called with:", learning_completed);
    $.ajax({
        url: '/learning-progress',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            learning_completed: learning_completed
        }),
        success: function(response) {
            console.log("Progress saved:", response);
        },
        error: function(xhr, status, error) {
            console.error("Error saving progress:", status, error);
            console.error("Response:", xhr.responseText);
        }
    });
}

function saveQuizProgress(quiz_completed) {
    console.log("saveProgress called with:", quiz_completed);
    $.ajax({
        url: '/quiz-progress',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            quiz_completed: quiz_completed
        }),
        success: function(response) {
            console.log("Progress saved:", response);
        },
        error: function(xhr, status, error) {
            console.error("Error saving progress:", status, error);
            console.error("Response:", xhr.responseText);
        }
    });
  }

  function handleFinishQuiz() {
    saveQuizProgress(true); // Call saveQuizProgress to update the session
    setTimeout(() => {
        window.location.href = 'fragments'; // Redirect to the fragments page
    }, 100); // Add a small delay to ensure the AJAX request is sent
}

// async function saveProgress(learning_completed) {
//     console.log("Saving progress...");
//     try {
//         const response = await fetch('/learning-progress', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ learning_completed: learning_completed })
//         });
//         const data = await response.json();
//         console.log("Progress saved:", data);
//     } catch (error) {
//         console.error("Error saving progress:", error);
//     }
// }

// function enableQuizNavItem() {
//     if (quizEnabled) return;

//     const quizNavItem = document.getElementById('quiz-disabled');
//     console.log("Quiz Nav Item:", quizNavItem);
//     if (quizNavItem) {
//         quizNavItem.outerHTML = `
//             <div class="nav-group">
//                 <a href="/quiz-intro" class="nav-item" onclick="navigateTo('/quiz-intro')">Test Yourself</a>
//                 <div class="progress-container" id="quiz">
//                     <div class="progress-bar">
//                         <div class="progress-fill" id="quiz-progress"></div>
//                     </div>
//                 </div>
//             </div>
//         `;
//     }

//     quizEnabled = true;
// }

// function handleContinue(event) {
//     event.preventDefault(); // Prevent the default navigation

//     saveProgress(true, function() {
//         // window.location.href = '/page7'; // Redirect to page 7
//     });
// }

// async function handleContinue(event) {
//     event.preventDefault(); // Prevent the default navigation

//     await saveProgress(true); // Wait for the progress to be saved
//     const response = await fetch('/learning-progress', { method: 'GET' });
//     const data = await response.json();
//     console.log("Learning progress data after saving:", data);
//     window.location.href = '/page7'; // Redirect to page 7
// }

// document.addEventListener('DOMContentLoaded', function() {
//     fetch('/learning-progress', { method: 'GET' })
//     .then(response => response.json())
//     .then(data => {
//         console.log("Learning progress data:", data);
//         if (data.learning_completed) {
//             enableQuizNavItem();
//         }
//     }); 
// });

// document.addEventListener('DOMContentLoaded', function() {
//     const progressContainer = document.querySelector('.progress-container');
//     const currentPage = parseInt("{{ current_page }}");
//     const path = window.location.pathname;
//     const isHomePage = path === "/";
//     const isLearningPage = path.startsWith('/page');
//     const isTestOrCreate = path.startsWith('/quiz') || path.startsWith('/create');
    
//     // Reset progress bar visibility on home page
//     if (isHomePage) {
//         sessionStorage.removeItem('showProgressBar');
//         progressContainer.classList.remove('visible');
//     }
    
//     function getPageNumber() {
//         if (path === '/') return 0;
//         const match = path.match(/\/page(\d+)/);
//         return match ? parseInt(match[1]) : 0;
//     }
    
//     function updateProgressBar() {
//         const progressLabel = document.querySelector('.progress-label');
//         const progressFill = document.querySelector('.progress-fill');
        
//         if (progressLabel && progressFill) {
//             const currentPageNum = getPageNumber();
//             progressLabel.textContent = `${currentPageNum}/7`;
//             const progress = Math.min(Math.max((currentPageNum / 7) * 100, 0), 100);
//             progressFill.style.width = `${progress}%`;
//         }
//     }

//     // Only show progress bar if we're in learning pages and it should be shown
//     if (isLearningPage && sessionStorage.getItem('showProgressBar') === 'true') {
//         progressContainer.classList.add('visible');
//         updateProgressBar();
//     } else if (isTestOrCreate) {
//         progressContainer.classList.remove('visible');
//     }

//     // Add click handlers to explore buttons
//     document.querySelectorAll('[data-explore-button]').forEach(button => {
//         button.addEventListener('click', function(e) {
//             sessionStorage.setItem('showProgressBar', 'true');
//             progressContainer.classList.add('visible');
//             updateProgressBar();
//         });
//     });

//     // Add click handler for home link
//     document.querySelector('a[href="/"]').addEventListener('click', function() {
//         sessionStorage.removeItem('showProgressBar');
//         progressContainer.classList.remove('visible');
//     });
// });

// // Override the navigateTo function to maintain progress bar state
// function navigateTo(path) {
//     const items = document.querySelectorAll('.nav-item');
//     items.forEach(item => item.classList.remove('active'));
    
//     const activeItem = document.querySelector(`.nav-item[href="${path.replace(" ", "")}"]`);
//     if (activeItem) {
//         activeItem.classList.add('active');
//     }
// }