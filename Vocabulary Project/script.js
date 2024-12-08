let users = JSON.parse(localStorage.getItem('users')) || []
let loggedInUser = null
let currentLevel = 0
let startTime = null
let introductionAnimals = []
let levelAnimals = []
const allAnimals = [
    { name: "Dog", image: "images/dog.png", alt: "A dog" },
    { name: "Cat", image: "images/cat.png", alt: "A cat" },
    { name: "Elephant", image: "images/elephant.png", alt: "An elephant" },
    { name: "Lion", image: "images/lion.png", alt: "A lion" },
    { name: "Tiger", image: "images/tiger.png", alt: "A tiger" },
    { name: "Horse", image: "images/horse.png", alt: "A horse" },
    { name: "Cow", image: "images/cow.png", alt: "A cow" },
    { name: "Sheep", image: "images/sheep.png", alt: "A sheep" },
    { name: "Goat", image: "images/goat.png", alt: "A goat" },
    { name: "Rabbit", image: "images/rabbit.png", alt: "A rabbit" },
    { name: "Bear", image: "images/bear.png", alt: "A bear" },
    { name: "Monkey", image: "images/monkey.png", alt: "A monkey" },
    { name: "Giraffe", image: "images/giraffe.png", alt: "A giraffe" },
    { name: "Zebra", image: "images/zebra.png", alt: "A zebra" },
    { name: "Fox", image: "images/fox.png", alt: "A fox" },
    { name: "Wolf", image: "images/wolf.png", alt: "A wolf" },
    { name: "Deer", image: "images/deer.png", alt: "A deer" },
    { name: "Frog", image: "images/frog.png", alt: "A frog" },
    { name: "Snake", image: "images/snake.png", alt: "A snake" },
    { name: "Turtle", image: "images/turtle.png", alt: "A turtle" },
    { name: "Fish", image: "images/fish.png", alt: "A fish" },
    { name: "Shark", image: "images/shark.png", alt: "A shark" },
    { name: "Dolphin", image: "images/dolphin.png", alt: "A dolphin" },
    { name: "Bird", image: "images/bird.png", alt: "A bird" },
    { name: "Butterfly", image: "images/butterfly.png", alt: "A butterfly" },
]

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login-button').addEventListener('click', loginUser)
    document.getElementById('register-button').addEventListener('click', registerUser)
    document.getElementById('to-register-button').addEventListener('click', showRegister)
    document.getElementById('to-login-button').addEventListener('click', showLogin)
    document.getElementById('play-button').addEventListener('click', showCategories)
    document.getElementById('high-scores-button').addEventListener('click', showHighScores)
    document.getElementById('profile-button').addEventListener('click', showProfile)
    document.getElementById('logout-button').addEventListener('click', logout)
    document.getElementById('animals-category-button').addEventListener('click', () => startCategory('Animals'))
    document.getElementById('back-to-main-menu-button').addEventListener('click', showMainMenu)
    document.getElementById('introduction-btn').addEventListener('click', startIntroduction)
    document.getElementById('easy-btn').addEventListener('click', () => startLevel(1))
    document.getElementById('medium-btn').addEventListener('click', () => startLevel(2))
    document.getElementById('hard-btn').addEventListener('click', () => startLevel(3))
    document.getElementById('back-to-categories-button').addEventListener('click', showCategories)
    document.getElementById('intro-submit-button').addEventListener('click', checkIntroduction)
    document.getElementById('intro-hint-button').addEventListener('click', showHint)
    document.getElementById('home-button').addEventListener('click', showMainMenu)
    document.getElementById('profile-back-button').addEventListener('click', showMainMenu)
    document.getElementById('high-scores-back-button').addEventListener('click', showMainMenu)
    document.getElementById('badge-popup-close-button').addEventListener('click', closeBadgePopup)
    document.getElementById('go-to-levels-button').addEventListener('click', showLevels)
    document.getElementById('level-back-to-levels-button').addEventListener('click', showLevels)
    const homeButton = document.getElementById('home-button')
    homeButton.style.display = 'none'
    showLogin()
})

function showLogin() {
    hideAll()
    document.getElementById('login-section').classList.remove('hidden')
    document.getElementById('home-button').style.display = 'none'
}

function showRegister() {
    hideAll()
    document.getElementById('register-section').classList.remove('hidden')
    document.getElementById('home-button').style.display = 'none'
}

function showMainMenu() {
    hideAll()
    document.getElementById('main-menu').classList.remove('hidden')
    document.getElementById('home-button').style.display = 'none'
}

function showCategories() {
    hideAll()
    document.getElementById('categories').classList.remove('hidden')
}

function showLevels() {
    hideAll()
    document.getElementById('levels').classList.remove('hidden')
    updateLevelButtons()
}

function showProfile() {
    hideAll()
    document.getElementById('profile').classList.remove('hidden')
    document.getElementById('profile-info').textContent = `Username: ${loggedInUser.username}, Total Points: ${loggedInUser.totalPoints || 0}`
    displayBadges()
    displayProgressCategories()
}

function showHighScores() {
    hideAll()
    document.getElementById('high-scores').classList.remove('hidden')
    displayHighScores()
}

function startCategory(category) {
    if (category === 'Animals') {
        hideAll()
        document.getElementById('levels').classList.remove('hidden')
        updateLevelButtons()
    }
}

function registerUser(event) {
    event.preventDefault()
    const username = document.getElementById('register-username').value.trim()
    const password = document.getElementById('register-password').value
    const message = document.getElementById('register-message')
    if (username && password) {
        if (users.some(user => user.username.toLowerCase() === username.toLowerCase())) {
            message.textContent = "Username already exists! Please choose a different one."
        } else {
            users.push({ username, password, progress: 0, badges: {}, stats: {}, totalPoints: 0, knownAnimals: [] })
            localStorage.setItem('users', JSON.stringify(users))
            message.textContent = "Registration successful! You can now log in."
        }
    } else {
        message.textContent = "Please fill in both username and password fields."
    }
}

function loginUser(event) {
    event.preventDefault()
    const username = document.getElementById('login-username').value.trim()
    const password = document.getElementById('login-password').value
    const message = document.getElementById('login-message')
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password)
    if (user) {
        loggedInUser = user
        loggedInUser.knownAnimals = loggedInUser.knownAnimals || []
        currentLevel = loggedInUser.progress || 0
        message.textContent = ""
        showMainMenu()
    } else {
        message.textContent = "Invalid username or password."
    }
}

function logout() {
    loggedInUser = null
    document.getElementById('login-message').textContent = "You have successfully logged out."
    showLogin()
}

function startIntroduction() {
    hideAll()
    document.getElementById('introduction').classList.remove('hidden')
    document.getElementById('home-button').style.display = 'block'
    currentLevel = 0
    startTime = Date.now()
    loggedInUser.stats = loggedInUser.stats || {}
    loggedInUser.stats['Animals'] = loggedInUser.stats['Animals'] || { attempts: 0, correct: 0, timeSpent: 0 }
    document.getElementById('intro-hint').textContent = ''
    introductionAnimals = getRandomAnimals(10)
    showNextAnimal()
}

function getRandomAnimals(number) {
    const shuffled = [...allAnimals].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, number)
}

function showNextAnimal() {
    if (currentLevel < introductionAnimals.length) {
        const animal = introductionAnimals[currentLevel]
        document.getElementById('intro-image').src = animal.image
        document.getElementById('intro-image').alt = animal.alt
        document.getElementById('animal-name').textContent = `What is this animal?`
        document.getElementById('animal-input').value = ''
        document.getElementById('intro-message').textContent = ''
        document.getElementById('intro-hint').textContent = ''
        document.getElementById('go-to-levels-button').classList.add('hidden')
    } else {
        const timeSpent = (Date.now() - startTime) / 1000
        loggedInUser.stats['Animals'].timeSpent += timeSpent
        updateUserData()
        document.getElementById('intro-message').textContent = "Great job! You've learned the animals!"
        document.getElementById('intro-message').style.color = "#4caf50"
        document.getElementById('go-to-levels-button').classList.remove('hidden')
        addBadge("Completed Introduction", "Animals", "beginner")
        if (hasMasteredAllAnimals()) {
            addBadge("Master of Animals", "Animals", "gold")
            document.getElementById('intro-message').textContent += "\nYou've earned the Master of Animals Badge!"
        } else {
            document.getElementById('intro-message').textContent += "\nYou've earned the Beginner Badge! You can view it in your profile."
        }
        loggedInUser.progress = Math.max(loggedInUser.progress, 1)
        addPoints(100)
        updateUserData()
        updateLevelButtons()
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        })
    }
}

function hasMasteredAllAnimals() {
    const knownAnimals = loggedInUser.knownAnimals || []
    return allAnimals.every(animal => knownAnimals.includes(animal.name))
}

function checkIntroduction() {
    const input = document.getElementById('animal-input').value.trim().toLowerCase()
    const message = document.getElementById('intro-message')
    const currentAnimal = introductionAnimals[currentLevel]
    loggedInUser.stats['Animals'].attempts++
    updateUserData()
    if (input === currentAnimal.name.toLowerCase()) {
        message.textContent = "Correct!"
        message.style.color = "#4caf50"
        loggedInUser.stats['Animals'].correct++
        loggedInUser.knownAnimals = loggedInUser.knownAnimals || []
        if (!loggedInUser.knownAnimals.includes(currentAnimal.name)) {
            loggedInUser.knownAnimals.push(currentAnimal.name)
        }
        addPoints(10)
        updateUserData()
        currentLevel++
        setTimeout(showNextAnimal, 1000)
    } else {
        message.textContent = "Try again!"
        message.style.color = "#f44336"
    }
}

function showHint() {
    const hint = introductionAnimals[currentLevel].name.charAt(0).toUpperCase() + introductionAnimals[currentLevel].name.slice(1)
    document.getElementById('intro-hint').textContent = `Hint: The animal is a ${hint}.`
}

function startLevel(level) {
    hideAll()
    document.getElementById('home-button').style.display = 'block'
    document.getElementById('level').classList.remove('hidden')
    startTime = Date.now()
    loggedInUser.stats = loggedInUser.stats || {}
    loggedInUser.stats['Animals'] = loggedInUser.stats['Animals'] || { attempts: 0, correct: 0, timeSpent: 0 }
    let numPairs = 0
    currentLevel = level
    if (level === 1) {
        numPairs = 4
        document.getElementById('level-title').textContent = 'Easy: Match 4 Pairs'
    } else if (level === 2) {
        numPairs = 8
        document.getElementById('level-title').textContent = 'Medium: Match 8 Pairs'
    } else if (level === 3) {
        numPairs = 12
        document.getElementById('level-title').textContent = 'Hard: Match 12 Pairs'
    }
    levelAnimals = getRandomAnimals(numPairs)
    setupLevel()
}

let selectedImageElement = null
let selectedWordElement = null
let matchedPairs = 0

function setupLevel() {
    matchedPairs = 0
    selectedImageElement = null
    selectedWordElement = null
    const imagesContainer = document.getElementById('images-container')
    const wordsContainer = document.getElementById('words-container')
    const message = document.getElementById('level-message')
    imagesContainer.innerHTML = ''
    wordsContainer.innerHTML = ''
    message.textContent = ''
    document.getElementById('level-back-to-levels-button').classList.add('hidden')
    const shuffledImages = [...levelAnimals].sort(() => 0.5 - Math.random())
    const shuffledWords = [...levelAnimals].sort(() => 0.5 - Math.random())
    shuffledImages.forEach(animal => {
        const imgDiv = document.createElement('div')
        imgDiv.classList.add('level-item')
        imgDiv.setAttribute('tabindex', '0')
        const img = document.createElement('img')
        img.src = animal.image
        img.alt = animal.alt
        imgDiv.appendChild(img)
        imgDiv.dataset.name = animal.name
        imgDiv.addEventListener('click', () => selectImage(animal.name, imgDiv))
        imgDiv.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') selectImage(animal.name, imgDiv)
        })
        imagesContainer.appendChild(imgDiv)
    })
    shuffledWords.forEach(animal => {
        const wordDiv = document.createElement('div')
        wordDiv.classList.add('level-item')
        wordDiv.setAttribute('tabindex', '0')
        wordDiv.textContent = animal.name
        wordDiv.dataset.name = animal.name
        wordDiv.addEventListener('click', () => selectWord(animal.name, wordDiv))
        wordDiv.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') selectWord(animal.name, wordDiv)
        })
        wordsContainer.appendChild(wordDiv)
    })
}

function selectImage(name, element) {
    if (selectedImageElement) {
        selectedImageElement.classList.remove('selected')
    }
    selectedImageElement = element
    element.classList.add('selected')
    checkMatch()
}

function selectWord(name, element) {
    if (selectedWordElement) {
        selectedWordElement.classList.remove('selected')
    }
    selectedWordElement = element
    element.classList.add('selected')
    checkMatch()
}

function checkMatch() {
    if (selectedImageElement && selectedWordElement) {
        const message = document.getElementById('level-message')
        loggedInUser.stats['Animals'].attempts++
        updateUserData()
        if (selectedImageElement.dataset.name === selectedWordElement.dataset.name) {
            message.textContent = "Correct Match!"
            message.style.color = "#4caf50"
            selectedImageElement.style.visibility = 'hidden'
            selectedWordElement.style.visibility = 'hidden'
            matchedPairs++
            loggedInUser.stats['Animals'].correct++
            loggedInUser.knownAnimals = loggedInUser.knownAnimals || []
            if (!loggedInUser.knownAnimals.includes(selectedImageElement.dataset.name)) {
                loggedInUser.knownAnimals.push(selectedImageElement.dataset.name)
            }
            addPoints(10)
            updateUserData()
            if (matchedPairs === levelAnimals.length) {
                const timeSpent = (Date.now() - startTime) / 1000
                loggedInUser.stats['Animals'].timeSpent += timeSpent
                updateUserData()
                message.textContent = "Congratulations! You've matched all pairs!"
                loggedInUser.progress = Math.max(loggedInUser.progress, currentLevel + 1)
                if (currentLevel === 1) {
                    addBadge("Easy Level Completed", "Animals", "bronze")
                } else if (currentLevel === 2) {
                    addBadge("Medium Level Completed", "Animals", "silver")
                } else if (currentLevel === 3) {
                    addBadge("Hard Level Completed", "Animals", "gold")
                }
                if (hasMasteredAllAnimals()) {
                    addBadge("Master of Animals", "Animals", "gold")
                    message.textContent += "\nYou've earned the Master of Animals Badge!"
                }
                updateUserData()
                updateLevelButtons()
                document.getElementById('level-back-to-levels-button').classList.remove('hidden')
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 }
                })
            }
        } else {
            message.textContent = "Try Again!"
            message.style.color = "#f44336"
        }
        setTimeout(() => {
            if (selectedImageElement) selectedImageElement.classList.remove('selected')
            if (selectedWordElement) selectedWordElement.classList.remove('selected')
            selectedImageElement = null
            selectedWordElement = null
        }, 500)
    }
}

function addBadge(name, category, badgeType) {
    if (!loggedInUser.badges) {
        loggedInUser.badges = {}
    }
    if (!loggedInUser.badges[category]) {
        loggedInUser.badges[category] = []
    }
    if (!loggedInUser.badges[category].some(badge => badge.name === name)) {
        loggedInUser.badges[category].push({ name, badgeType })
        updateUserData()
    }
}

function displayBadges() {
    const badgeContainer = document.getElementById('badge-container')
    badgeContainer.innerHTML = ''
    if (loggedInUser.badges) {
        for (const category in loggedInUser.badges) {
            const categoryDiv = document.createElement('div')
            categoryDiv.classList.add('badge-category')
            const categoryHeading = document.createElement('h3')
            categoryHeading.textContent = category
            categoryDiv.appendChild(categoryHeading)
            const badgeList = document.createElement('div')
            badgeList.classList.add('badge-list')
            loggedInUser.badges[category].forEach(badge => {
                const badgeElementWrapper = document.createElement('div')
                badgeElementWrapper.classList.add('badge-wrapper')
                const badgeElement = document.createElement('div')
                badgeElement.classList.add('badge', badge.badgeType)
                badgeElement.textContent = badge.name
                const badgeName = document.createElement('div')
                badgeName.classList.add('badge-name')
                badgeName.textContent = badge.name
                badgeElementWrapper.appendChild(badgeElement)
                badgeElementWrapper.appendChild(badgeName)
                badgeList.appendChild(badgeElementWrapper)
            })
            categoryDiv.appendChild(badgeList)
            badgeContainer.appendChild(categoryDiv)
        }
    }
}

function displayProgressCategories() {
    const progressCategories = document.getElementById('progress-categories')
    progressCategories.innerHTML = ''
    const categoryButton = document.createElement('button')
    categoryButton.classList.add('progress-category-button')
    categoryButton.textContent = 'Animals'
    categoryButton.addEventListener('click', () => toggleProgressStats('Animals'))
    progressCategories.appendChild(categoryButton)
}

function toggleProgressStats(category) {
    const progressStats = document.getElementById('progress-stats')
    if (progressStats.innerHTML === '') {
        const stats = loggedInUser.stats[category]
        const accuracy = ((stats.correct / stats.attempts) * 100).toFixed(2) || 0
        const timeSpent = stats.timeSpent.toFixed(2) || 0
        const animalsLearned = loggedInUser.knownAnimals ? loggedInUser.knownAnimals.length : 0
        const totalAnimals = allAnimals.length
        const statsList = document.createElement('ul')
        const statItem = document.createElement('li')
        statItem.innerHTML = `<strong>${category}:</strong> 
            Attempts: ${stats.attempts}, Correct: ${stats.correct}, 
            Accuracy: ${accuracy}%, Time Spent: ${timeSpent} seconds, 
            Animals Learned: ${animalsLearned}/${totalAnimals}`
        statsList.appendChild(statItem)
        progressStats.appendChild(statsList)
    } else {
        progressStats.innerHTML = ''
    }
}

function hideAll() {
    document.querySelectorAll('#app > div').forEach(div => div.classList.add('hidden'))
}

function updateLevelButtons() {
    const introductionBtn = document.getElementById('introduction-btn')
    const easyBtn = document.getElementById('easy-btn')
    const mediumBtn = document.getElementById('medium-btn')
    const hardBtn = document.getElementById('hard-btn')
    introductionBtn.classList.remove('hidden')
    if (loggedInUser.progress >= 1) {
        easyBtn.classList.remove('hidden')
        introductionBtn.classList.add('completed')
    }
    if (loggedInUser.progress >= 2) {
        mediumBtn.classList.remove('hidden')
        easyBtn.classList.add('completed')
    }
    if (loggedInUser.progress >= 3) {
        hardBtn.classList.remove('hidden')
        mediumBtn.classList.add('completed')
    }
    if (loggedInUser.progress >= 4) {
        hardBtn.classList.add('completed')
    }
}

function updateUserData() {
    const userIndex = users.findIndex(u => u.username.toLowerCase() === loggedInUser.username.toLowerCase())
    if (userIndex !== -1) {
        users[userIndex] = loggedInUser
        localStorage.setItem('users', JSON.stringify(users))
    }
}

function addPoints(points) {
    loggedInUser.totalPoints = (loggedInUser.totalPoints || 0) + points
    updateUserData()
}

function displayHighScores() {
    const highScoresList = document.getElementById('high-scores-list')
    highScoresList.innerHTML = ''
    const sortedUsers = users.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0))
    const list = document.createElement('ul')
    sortedUsers.forEach((user, index) => {
        const listItem = document.createElement('li')
        const userLink = document.createElement('a')
        userLink.href = '#'
        userLink.textContent = `${index + 1}. ${user.username} - ${user.totalPoints || 0} points`
        userLink.addEventListener('click', () => showUserBadges(user))
        listItem.appendChild(userLink)
        list.appendChild(listItem)
    })
    highScoresList.appendChild(list)
}

function showUserBadges(user) {
    const badgePopup = document.getElementById('badge-popup')
    const badgePopupTitle = document.getElementById('badge-popup-title')
    const badgePopupContent = document.getElementById('badge-popup-content')
    badgePopupTitle.textContent = `${user.username}'s Badges`
    badgePopupContent.innerHTML = ''
    if (user.badges) {
        for (const category in user.badges) {
            const categoryDiv = document.createElement('div')
            categoryDiv.classList.add('badge-category')
            const categoryHeading = document.createElement('h3')
            categoryHeading.textContent = category
            categoryDiv.appendChild(categoryHeading)
            const badgeList = document.createElement('div')
            badgeList.classList.add('badge-list')
            user.badges[category].forEach(badge => {
                const badgeElementWrapper = document.createElement('div')
                badgeElementWrapper.classList.add('badge-wrapper')
                const badgeElement = document.createElement('div')
                badgeElement.classList.add('badge', badge.badgeType)
                badgeElement.textContent = badge.name
                const badgeName = document.createElement('div')
                badgeName.classList.add('badge-name')
                badgeName.textContent = badge.name
                badgeElementWrapper.appendChild(badgeElement)
                badgeElementWrapper.appendChild(badgeName)
                badgeList.appendChild(badgeElementWrapper)
            })
            categoryDiv.appendChild(badgeList)
            badgePopupContent.appendChild(categoryDiv)
        }
    } else {
        badgePopupContent.textContent = 'No badges yet.'
    }
    badgePopup.classList.remove('hidden')
}

function closeBadgePopup() {
    document.getElementById('badge-popup').classList.add('hidden')
}
