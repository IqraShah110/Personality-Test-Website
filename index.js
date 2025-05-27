// Global variables
let currentQuestion = 1;
const totalQuestions = 50;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    const nextButton = document.getElementById('nextButton');
    const submitButton = document.getElementById('submitButton');
    const progressBar = document.getElementById('progressBar');

    // Show first question and hide others
    showCurrentQuestion();
    updateProgress();
    
    // Handle next button click
    nextButton.addEventListener('click', function() {
        if (currentQuestion < totalQuestions) {
            // Hide current question with fade out
            const currentQuestionElement = document.querySelector(`.question[data-question="${currentQuestion}"]`);
            currentQuestionElement.style.opacity = '0';
            currentQuestionElement.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                // Hide current question
                currentQuestionElement.classList.remove('active');
                
                // Show next question
                currentQuestion++;
                showCurrentQuestion();
                
                // Update progress and buttons
                updateProgress();
                updateButtonVisibility();
                
                // Smooth scroll to top of the new question
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }, 300);
        }
    });

    // Add event listeners to all radio buttons
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            updateButtonVisibility();
        });
    });
});

// Show current question
function showCurrentQuestion() {
    const nextQuestion = document.querySelector(`.question[data-question="${currentQuestion}"]`);
    nextQuestion.classList.add('active');
    
    // Trigger reflow for animation
    void nextQuestion.offsetWidth;
    
    // Show with animation
    nextQuestion.style.opacity = '1';
    nextQuestion.style.transform = 'translateY(0)';
}

// Update progress bar
function updateProgress() {
    const progressBar = document.getElementById('progressBar');
    const progress = ((currentQuestion - 1) / totalQuestions) * 100;
    progressBar.style.width = `${progress}%`;
}

// Update button visibility based on current question and answer state
function updateButtonVisibility() {
    const nextButton = document.getElementById('nextButton');
    const submitButton = document.getElementById('submitButton');
    const currentQuestionElement = document.querySelector(`.question[data-question="${currentQuestion}"]`);
    const isAnswered = currentQuestionElement.querySelector('input[type="radio"]:checked');

    if (currentQuestion === totalQuestions) {
        nextButton.style.display = 'none';
        submitButton.style.display = isAnswered ? 'block' : 'none';
    } else {
        nextButton.style.display = isAnswered ? 'block' : 'none';
        submitButton.style.display = 'none';
    }
}

function calculateResults() {
    // Object to store the sum for each personality trait
    let traitScores = {
        extrovert: 0,
        agreeable: 0,
        conscious: 0,
        neuroticism: 0,
        openness: 0
    };
  
    // Store the values for each trait class
    let traitValues = {
        extrovert: 20,   // Base score for extrovert
        agreeable: 14,    // Base score for agreeable
        conscious: 14,    // Base score for conscious
        neuroticism: 38,  // Base score for neuroticism
        openness: 8       // Base score for openness
    };
  
    // Maximum possible score for each trait
    const maxScore = 40;
  
    // Loop through all the classes and calculate scores based on the selected answers
    const classes = ['extrovert', 'agreeable', 'conscious', 'neuroticism', 'openness'];
    let allAnswered = true;
  
    classes.forEach(function(trait) {
        const radios = document.querySelectorAll(`.${trait} input[type="radio"]`);
        const checked = document.querySelector(`.${trait} input[type="radio"]:checked`);
        
        if (!checked) {
            allAnswered = false;
        }

        radios.forEach(function(radio) {
            if (radio.checked) {
                traitScores[trait] += parseInt(radio.value);
            }
        });
  
        // Add the base score to the trait score
        traitScores[trait] += traitValues[trait];
    });
  
    if (!allAnswered) {
        alert("Please answer all the questions before submitting the test.");
        return;
    }
  
    // Calculate percentages for each trait
    let traitPercentages = {};
    for (let trait in traitScores) {
        traitPercentages[trait] = ((traitScores[trait] / maxScore) * 100).toFixed(2); // Round to 2 decimal places
    }
  
    // Display the results
    displayResults(traitPercentages);
}
  
// Function to display the final results as percentages
function displayResults(percentages) {
    const resultDiv = document.getElementById("result");
    let resultHTML = "<h2>Your Personality Test Results</h2>";
    
    for (let trait in percentages) {
        const percentage = percentages[trait];
        const barWidth = percentage + '%';
        const barColor = getTraitColor(trait);
        
        resultHTML += `
            <div class="trait-result">
                <div class="trait-header">
                    <span class="trait-name">${trait.charAt(0).toUpperCase() + trait.slice(1)}</span>
                    <span class="trait-percentage">${percentage}%</span>
                </div>
                <div class="trait-bar-container">
                    <div class="trait-bar" style="width: ${barWidth}; background-color: ${barColor};"></div>
                </div>
            </div>
        `;
    }
    
    resultDiv.innerHTML = resultHTML;
}

// Helper function to get color for each trait
function getTraitColor(trait) {
    const colors = {
        extrovert: '#4CAF50',
        agreeable: '#2196F3',
        conscious: '#9C27B0',
        neuroticism: '#FF9800',
        openness: '#E91E63'
    };
    return colors[trait] || '#666';
}

// Add this CSS to your form.css file
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .trait-result {
        margin: 15px 0;
    }
    
    .trait-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
    }
    
    .trait-name {
        font-weight: 600;
    }
    
    .trait-bar-container {
        background: #f0f0f0;
        border-radius: 4px;
        height: 20px;
        overflow: hidden;
    }
    
    .trait-bar {
        height: 100%;
        transition: width 1s ease-out;
    }
    
    label.selected {
        background: #e3f2fd;
        border-color: #2196F3;
        transform: translateX(10px);
    }
`;
document.head.appendChild(styleSheet);