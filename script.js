document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    mobileMenuButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            // Close mobile menu if open
            mobileMenu.classList.add('hidden');
            
            // Scroll to target
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
            
            // Update URL hash without jumping
            history.pushState(null, null, targetId);
        });
    });
    
    // Highlight active navigation link based on scroll position
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - 100)) {
                currentSection = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('text-indigo-200', 'font-semibold');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('text-indigo-200', 'font-semibold');
            }
        });
    });
    
    // Initialize all tools
    initAgeCalculator();
    initBMICalculator();
    initPomodoroTimer();
    initCountdownTimer();
    initTodoList();
    initCalendar();
    initChat();
});

// 1. Age Calculator
function initAgeCalculator() {
    const calculateButton = document.getElementById('calculate-age');
    const birthdateInput = document.getElementById('birthdate');
    const ageResult = document.getElementById('age-result');
    const yearsElement = document.getElementById('years');
    const monthsElement = document.getElementById('months');
    const daysElement = document.getElementById('days');
    
    calculateButton.addEventListener('click', function() {
        const birthdate = new Date(birthdateInput.value);
        const today = new Date();
        
        if (isNaN(birthdate.getTime())) {
            alert('Please enter a valid date of birth');
            return;
        }
        
        // Calculate age
        let years = today.getFullYear() - birthdate.getFullYear();
        let months = today.getMonth() - birthdate.getMonth();
        let days = today.getDate() - birthdate.getDate();
        
        // Adjust for negative months or days
        if (months < 0 || (months === 0 && days < 0)) {
            years--;
            months += 12;
        }
        
        if (days < 0) {
            const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += lastMonth.getDate();
            months--;
        }
        
        // Display results
        yearsElement.textContent = years;
        monthsElement.textContent = months;
        daysElement.textContent = days;
        ageResult.classList.remove('hidden');
    });
}

// 2. BMI Calculator
function initBMICalculator() {
    const calculateButton = document.getElementById('calculate-bmi');
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const bmiResult = document.getElementById('bmi-result');
    const bmiValue = document.getElementById('bmi-value');
    const bmiCategory = document.getElementById('bmi-category');
    
    calculateButton.addEventListener('click', function() {
        const height = parseFloat(heightInput.value) / 100; // Convert cm to m
        const weight = parseFloat(weightInput.value);
        
        if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
            alert('Please enter valid height and weight values');
            return;
        }
        
        // Calculate BMI
        const bmi = weight / (height * height);
        const roundedBMI = Math.round(bmi * 10) / 10;
        
        // Display BMI value
        bmiValue.textContent = roundedBMI;
        
        // Determine BMI category
        let category = '';
        let categoryClass = '';
        
        if (bmi < 18.5) {
            category = 'Underweight';
            categoryClass = 'bg-blue-100 text-blue-800';
        } else if (bmi >= 18.5 && bmi < 25) {
            category = 'Normal weight';
            categoryClass = 'bg-green-100 text-green-800';
        } else if (bmi >= 25 && bmi < 30) {
            category = 'Overweight';
            categoryClass = 'bg-yellow-100 text-yellow-800';
        } else {
            category = 'Obese';
            categoryClass = 'bg-red-100 text-red-800';
        }
        
        // Display category
        bmiCategory.innerHTML = `<p class="text-center font-medium ${categoryClass} p-2 rounded">${category}</p>`;
        bmiResult.classList.remove('hidden');
        
        // Color BMI value based on category
        if (bmi < 18.5) {
            bmiValue.className = 'text-4xl font-bold text-center text-blue-600';
        } else if (bmi >= 18.5 && bmi < 25) {
            bmiValue.className = 'text-4xl font-bold text-center text-green-600';
        } else if (bmi >= 25 && bmi < 30) {
            bmiValue.className = 'text-4xl font-bold text-center text-yellow-600';
        } else {
            bmiValue.className = 'text-4xl font-bold text-center text-red-600';
        }
    });
}

// 3. Pomodoro Timer
function initPomodoroTimer() {
    const startButton = document.getElementById('pomodoro-start');
    const pauseButton = document.getElementById('pomodoro-pause');
    const resetButton = document.getElementById('pomodoro-reset');
    const timeDisplay = document.getElementById('pomodoro-time');
    const phaseDisplay = document.getElementById('pomodoro-phase');
    const progressCircle = document.getElementById('pomodoro-progress');
    
    let timer;
    let timeLeft = 25 * 60; // 25 minutes in seconds
    let isRunning = false;
    let isFocusPhase = true;
    let totalTime = 25 * 60;
    
    // Update the display
    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update progress circle
        const circumference = 2 * Math.PI * 15.9155;
        const offset = circumference - (timeLeft / totalTime) * circumference;
        progressCircle.style.strokeDashoffset = offset;
    }
    
    // Start the timer
    function startTimer() {
        if (!isRunning) {
            isRunning = true;
            startButton.disabled = true;
            pauseButton.disabled = false;
            
            timer = setInterval(function() {
                timeLeft--;
                updateDisplay();
                
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    isRunning = false;
                    
                    // Play sound
                    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
                    audio.play();
                    
                    // Switch phase
                    if (isFocusPhase) {
                        // Switch to break
                        isFocusPhase = false;
                        timeLeft = 5 * 60; // 5 minutes
                        totalTime = 5 * 60;
                        phaseDisplay.textContent = 'Break Time';
                        phaseDisplay.className = 'text-xl font-semibold text-green-600';
                        progressCircle.style.stroke = '#10b981';
                    } else {
                        // Switch to focus
                        isFocusPhase = true;
                        timeLeft = 25 * 60; // 25 minutes
                        totalTime = 25 * 60;
                        phaseDisplay.textContent = 'Focus Time';
                        phaseDisplay.className = 'text-xl font-semibold text-red-600';
                        progressCircle.style.stroke = '#ef4444';
                    }
                    
                    startButton.disabled = false;
                    pauseButton.disabled = true;
                    updateDisplay();
                }
            }, 1000);
        }
    }
    
    // Pause the timer
    function pauseTimer() {
        if (isRunning) {
            clearInterval(timer);
            isRunning = false;
            startButton.disabled = false;
            pauseButton.disabled = true;
        }
    }
    
    // Reset the timer
    function resetTimer() {
        clearInterval(timer);
        isRunning = false;
        isFocusPhase = true;
        timeLeft = 25 * 60;
        totalTime = 25 * 60;
        phaseDisplay.textContent = 'Focus Time';
        phaseDisplay.className = 'text-xl font-semibold text-red-600';
        progressCircle.style.stroke = '#ef4444';
        startButton.disabled = false;
        pauseButton.disabled = true;
        updateDisplay();
    }
    
    // Event listeners
    startButton.addEventListener('click', startTimer);
    pauseButton.addEventListener('click', pauseTimer);
    resetButton.addEventListener('click', resetTimer);
    
    // Initialize display
    updateDisplay();
}

// 4. Countdown Timer
function initCountdownTimer() {
    const startButton = document.getElementById('countdown-start');
    const pauseButton = document.getElementById('countdown-pause');
    const resetButton = document.getElementById('countdown-reset');
    const display = document.getElementById('countdown-display');
    const hoursInput = document.getElementById('countdown-hours');
    const minutesInput = document.getElementById('countdown-minutes');
    const secondsInput = document.getElementById('countdown-seconds');
    
    let timer;
    let timeLeft = 0;
    let isRunning = false;
    
    // Update the display
    function updateDisplay() {
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;
        
        display.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Start the timer
    function startTimer() {
        // Get input values
        const hours = parseInt(hoursInput.value) || 0;
        const minutes = parseInt(minutesInput.value) || 0;
        const seconds = parseInt(secondsInput.value) || 0;
        
        // Calculate total seconds
        timeLeft = hours * 3600 + minutes * 60 + seconds;
        
        if (timeLeft <= 0) {
            alert('Please enter a valid time');
            return;
        }
        
        if (!isRunning) {
            isRunning = true;
            startButton.disabled = true;
            pauseButton.disabled = false;
            hoursInput.disabled = true;
            minutesInput.disabled = true;
            secondsInput.disabled = true;
            
            updateDisplay();
            
            timer = setInterval(function() {
                timeLeft--;
                updateDisplay();
                
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    isRunning = false;
                    
                    // Play sound
                    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
                    audio.play();
                    
                    startButton.disabled = false;
                    pauseButton.disabled = true;
                    hoursInput.disabled = false;
                    minutesInput.disabled = false;
                    secondsInput.disabled = false;
                }
            }, 1000);
        }
    }
    
    // Pause the timer
    function pauseTimer() {
        if (isRunning) {
            clearInterval(timer);
            isRunning = false;
            startButton.disabled = false;
            pauseButton.disabled = true;
        }
    }
    
    // Reset the timer
    function resetTimer() {
        clearInterval(timer);
        isRunning = false;
        timeLeft = 0;
        hoursInput.value = '';
        minutesInput.value = '';
        secondsInput.value = '';
        startButton.disabled = false;
        pauseButton.disabled = true;
        hoursInput.disabled = false;
        minutesInput.disabled = false;
        secondsInput.disabled = false;
        updateDisplay();
    }
    
    // Event listeners
    startButton.addEventListener('click', startTimer);
    pauseButton.addEventListener('click', pauseTimer);
    resetButton.addEventListener('click', resetTimer);
    
    // Initialize display
    updateDisplay();
}

// 5. To-Do List
function initTodoList() {
    const todoInput = document.getElementById('todo-input');
    const addButton = document.getElementById('todo-add');
    const todoList = document.getElementById('todo-list');
    const clearButton = document.getElementById('todo-clear');
    const countElement = document.getElementById('todo-count');
    
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    
    // Render todos
    function renderTodos() {
        todoList.innerHTML = '';
        
        if (todos.length === 0) {
            todoList.innerHTML = '<li class="py-4 text-center text-gray-500">No tasks yet. Add one above!</li>';
            countElement.textContent = '0 tasks';
            clearButton.classList.add('hidden');
            return;
        }
        
        let activeCount = todos.filter(todo => !todo.completed).length;
        countElement.textContent = `${activeCount} ${activeCount === 1 ? 'task' : 'tasks'}`;
        clearButton.classList.toggle('hidden', todos.every(todo => !todo.completed));
        
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = 'py-3 flex items-center';
            
            li.innerHTML = `
                <div class="flex items-center flex-grow">
                    <input type="checkbox" id="todo-${index}" ${todo.completed ? 'checked' : ''} class="mr-3 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                    <label for="todo-${index}" class="flex-grow ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}">${todo.text}</label>
                    <button class="edit-todo ml-2 text-gray-500 hover:text-indigo-600 transition" data-index="${index}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-todo ml-2 text-gray-500 hover:text-red-600 transition" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            todoList.appendChild(li);
        });
        
        // Add event listeners to checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const index = parseInt(this.id.split('-')[1]);
                todos[index].completed = this.checked;
                saveTodos();
                renderTodos();
            });
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-todo').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                todos.splice(index, 1);
                saveTodos();
                renderTodos();
            });
        });
        
        // Add event listeners to edit buttons
        document.querySelectorAll('.edit-todo').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                const newText = prompt('Edit task:', todos[index].text);
                if (newText !== null && newText.trim() !== '') {
                    todos[index].text = newText.trim();
                    saveTodos();
                    renderTodos();
                }
            });
        });
    }
    
    // Save todos to localStorage
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }
    
    // Add new todo
    function addTodo() {
        const text = todoInput.value.trim();
        if (text !== '') {
            todos.push({
                text: text,
                completed: false
            });
            saveTodos();
            todoInput.value = '';
            renderTodos();
        }
    }
    
    // Clear completed todos
    function clearCompleted() {
        todos = todos.filter(todo => !todo.completed);
        saveTodos();
        renderTodos();
    }
    
    // Event listeners
    addButton.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
    clearButton.addEventListener('click', clearCompleted);
    
    // Initial render
    renderTodos();
}

// 6. Calendar
function initCalendar() {
    const monthYearElement = document.getElementById('calendar-month-year');
    const prevButton = document.getElementById('calendar-prev');
    const nextButton = document.getElementById('calendar-next');
    const daysContainer = document.getElementById('calendar-days');
    const eventModal = document.getElementById('event-modal');
    const eventModalDate = document.getElementById('event-modal-date');
    const eventTitleInput = document.getElementById('event-title');
    const eventCancelButton = document.getElementById('event-cancel');
    const eventSaveButton = document.getElementById('event-save');
    const eventsList = document.getElementById('events-list');
    
    let currentDate = new Date();
    let selectedDate = null;
    let events = JSON.parse(localStorage.getItem('calendarEvents')) || [];
    
    // Render calendar
    function renderCalendar() {
        // Set month and year header
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        monthYearElement.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
        
        // Get first day of month and total days in month
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        
        // Get days from previous month
        const prevMonthDays = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
        
        // Clear calendar
        daysContainer.innerHTML = '';
        
        // Add days from previous month
        for (let i = firstDay - 1; i >= 0; i--) {
            const dayElement = document.createElement('div');
            dayElement.className = 'text-center py-2 text-gray-400';
            dayElement.textContent = prevMonthDays - i;
            daysContainer.appendChild(dayElement);
        }
        
        // Add days from current month
        const today = new Date();
        for (let i = 1; i <= daysInMonth; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'text-center py-2 cursor-pointer hover:bg-purple-50 rounded transition';
            dayElement.textContent = i;
            
            // Highlight today
            if (i === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear()) {
                dayElement.className += ' bg-purple-100 font-semibold';
            }
            
            // Check if this date has events
            const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
            const dateEvents = events.filter(event => event.date === dateStr);
            
            if (dateEvents.length > 0) {
                dayElement.innerHTML += `<span class="block w-1 h-1 mx-auto mt-1 rounded-full bg-purple-500"></span>`;
            }
            
            // Add click event
            dayElement.addEventListener('click', function() {
                openEventModal(i);
            });
            
            daysContainer.appendChild(dayElement);
        }
        
        // Calculate total cells (should be 42 to fill 6 rows)
        const totalCells = firstDay + daysInMonth;
        const remainingCells = totalCells > 35 ? 42 - totalCells : 35 - totalCells;
        
        // Add days from next month
        for (let i = 1; i <= remainingCells; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'text-center py-2 text-gray-400';
            dayElement.textContent = i;
            daysContainer.appendChild(dayElement);
        }
        
        // Render events list
        renderEventsList();
    }
    
    // Open event modal
    function openEventModal(day) {
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const year = currentDate.getFullYear();
        const dayStr = day.toString().padStart(2, '0');
        
        selectedDate = `${year}-${month}-${dayStr}`;
        eventModalDate.textContent = `Add Event for ${month}/${dayStr}/${year}`;
        eventTitleInput.value = '';
        eventModal.classList.remove('hidden');
    }
    
    // Close event modal
    function closeEventModal() {
        eventModal.classList.add('hidden');
    }
    
    // Save event
    function saveEvent() {
        const title = eventTitleInput.value.trim();
        
        if (title === '') {
            alert('Please enter an event title');
            return;
        }
        
        events.push({
            date: selectedDate,
            title: title
        });
        
        localStorage.setItem('calendarEvents', JSON.stringify(events));
        closeEventModal();
        renderCalendar();
    }
    
    // Render events list
    function renderEventsList() {
        eventsList.innerHTML = '';
        
        if (events.length === 0) {
            eventsList.innerHTML = '<p class="text-gray-500 text-center py-4">No events scheduled</p>';
            return;
        }
        
        // Group events by date
        const eventsByDate = {};
        events.forEach(event => {
            if (!eventsByDate[event.date]) {
                eventsByDate[event.date] = [];
            }
            eventsByDate[event.date].push(event);
        });
        
        // Sort dates
        const sortedDates = Object.keys(eventsByDate).sort();
        
        // Display events
        sortedDates.forEach(date => {
            const dateObj = new Date(date);
            const dateStr = dateObj.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            
            const dateHeader = document.createElement('h4');
            dateHeader.className = 'font-semibold text-gray-800 mt-4 mb-2';
            dateHeader.textContent = dateStr;
            eventsList.appendChild(dateHeader);
            
            eventsByDate[date].forEach((event, index) => {
                const eventElement = document.createElement('div');
                eventElement.className = 'flex items-center justify-between bg-white p-3 rounded-lg shadow mb-2';
                
                eventElement.innerHTML = `
                    <p>${event.title}</p>
                    <button class="delete-event text-red-500 hover:text-red-700 transition" data-date="${date}" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                
                eventsList.appendChild(eventElement);
            });
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-event').forEach(button => {
            button.addEventListener('click', function() {
                const date = this.getAttribute('data-date');
                const index = parseInt(this.getAttribute('data-index'));
                
                // Find the event in the main events array
                let eventIndex = -1;
                let count = 0;
                
                for (let i = 0; i < events.length; i++) {
                    if (events[i].date === date) {
                        if (count === index) {
                            eventIndex = i;
                            break;
                        }
                        count++;
                    }
                }
                
                if (eventIndex !== -1) {
                    events.splice(eventIndex, 1);
                    localStorage.setItem('calendarEvents', JSON.stringify(events));
                    renderCalendar();
                }
            });
        });
    }
    
    // Event listeners
    prevButton.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    nextButton.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
    
    eventCancelButton.addEventListener('click', closeEventModal);
    eventSaveButton.addEventListener('click', saveEvent);
    
    // Initial render
    renderCalendar();
}
//theme
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle (existing code remains)
    
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // Apply the saved theme
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    // Theme toggle click handler
    themeToggle.addEventListener('click', function() {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    });
    
    // Current time display
    const currentTimeElement = document.getElementById('current-time');
    
    function updateCurrentTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
        currentTimeElement.textContent = timeString;
    }
    
    // Update time immediately and then every second
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    
    // Smooth scrolling for navigation links (existing code remains)
    // Highlight active navigation link (existing code remains)
    
    // Initialize all tools (existing code remains)
    initAgeCalculator();
    initBMICalculator();
    initPomodoroTimer();
    initCountdownTimer();
    initTodoList();
    initCalendar();
    initChat();
});
//weather
async function getWeather() {
    const city = document.getElementById("weather-city").value.trim();
    const apiKey = 'f06fcebd014555fc7b5628faa32358b2'; // Replace with your actual OpenWeatherMap API key
  
    if (!city) return alert("Please enter a city name.");
  
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.cod !== 200) throw new Error(data.message);
  
      document.getElementById("weather-location").textContent = `${data.name}, ${data.sys.country}`;
      document.getElementById("weather-temp").textContent = data.main.temp.toFixed(1);
      document.getElementById("weather-description").textContent = data.weather[0].description;
      document.getElementById("weather-result").classList.remove("hidden");
    } catch (err) {
      alert("Error: " + err.message);
    }
  }
  
//currency
// Currency conversion logic with JS
const form = document.getElementById('converter-form');
const resultDiv = document.getElementById('result');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get the selected currencies and the amount to convert
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;
    const amount = document.getElementById('amount').value;

    if (amount <= 0) {
        resultDiv.innerHTML = 'Please enter a valid amount.';
        return;
    }

    try {
        // Fetch exchange rates from an API (free tier of ExchangeRate-API or another API)
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        const data = await response.json();

        if (data.error) {
            resultDiv.innerHTML = 'Error fetching exchange rates.';
            return;
        }

        // Get the exchange rate for the "to" currency
        const rate = data.rates[toCurrency];

        if (rate) {
            const convertedAmount = (amount * rate).toFixed(2);
            resultDiv.innerHTML = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
        } else {
            resultDiv.innerHTML = 'Invalid currency selected.';
        }
    } catch (error) {
        resultDiv.innerHTML = 'Failed to fetch exchange rates. Please try again later.';
    }
});
