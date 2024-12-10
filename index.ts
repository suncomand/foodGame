interface Dish {
    dish: string
    ingredients: string[]
}

const dishes: Dish[] = [
    { dish: "Toast 🍞", ingredients: ["🍞", "🧈"] },
    { dish: "Salad 🥗", ingredients: ["🥬", "🥕", "🥒"] },
    { dish: "Hot Dog 🌭", ingredients: ["🌭", "🍞", "🧅"] },
    { dish: "Pizza 🍕", ingredients: ["🍞", "🍅", "🧀"] },
    { dish: "Pasta 🍝", ingredients: ["🍝", "🍅", "🧀", "🌿"] },
    { dish: "Burger 🍔", ingredients: ["🥩", "🍞", "🧀", "🍅", "🥬"] },
    { dish: "Taco 🌮", ingredients: ["🌮", "🥩", "🧀", "🥬", "🍅"] },
    { dish: "Sushi 🍣", ingredients: ["🍚", "🐟", "🥢", "🥑", "🍋"] },
    { dish: "Ramen 🍜", ingredients: ["🍜", "🥩", "🥚", "🌿", "🧄", "🧅"] },
    { dish: "Feast 🍽️", ingredients: ["🍗", "🍖", "🍞", "🍷", "🥗", "🧁", "🍇"] }
]

let currentOrder: Dish | null = null
let score = 0
let timeLeft = 60
let interval: number | null = null
let preparationIngredients: string[] = []

//DOM
const orderDisplay = document.getElementById('order-display') as HTMLDivElement
const ingredientTray = document.getElementById('ingredient-tray') as HTMLDivElement
const preparationArea = document.getElementById('preparation-area') as HTMLDivElement
const scoreDisplay = document.getElementById('score') as HTMLDivElement
const timerDisplay = document.getElementById('timer') as HTMLDivElement

//START GAME
function startGame() {
    score = 0
    timeLeft = 60
    preparationIngredients = []
    generateOrder()
    updateScore()
    startTimer()
}


function generateOrder() {
    currentOrder = dishes[Math.floor(Math.random() * dishes.length)]
    updateOrderDisplay()
}


function updateOrderDisplay() {
    if (currentOrder) {
        orderDisplay.innerHTML = `Order: ${currentOrder.dish}`

        ingredientTray.innerHTML = ''
        const allIngredients = [...currentOrder.ingredients, ...generateDecoys()]
        allIngredients.sort(() => Math.random() - 0.5)

        allIngredients.forEach(ingredient => {
            const ingredientElement = document.createElement('div')
            ingredientElement.classList.add('ingredient')
            ingredientElement.textContent = ingredient

            ingredientElement.setAttribute('draggable', 'true')
            ingredientElement.ondragstart = (event) => handleDragStart(event, ingredient)

            ingredientTray.appendChild(ingredientElement)
        })
    }
}

//DECOY
function generateDecoys(): string[] {
    return ["🥩", "🍅", "🧅", "🥕", "🍚", "🍖"]
}

function handleDragStart(event: DragEvent, ingredient: string) {
    event.dataTransfer?.setData('text', ingredient)
}

//DROPPING

preparationArea.ondragover = (event) => {
    event.preventDefault()
}

preparationArea.ondrop = (event) => {
    event.preventDefault()
    const ingredient = event.dataTransfer?.getData('text')
    if (ingredient && currentOrder) {
        handleIngredientDrop(ingredient)
    }
}

function handleIngredientDrop(ingredient: string) {
    if (currentOrder && currentOrder.ingredients.includes(ingredient)) {
        score += 10
        preparationIngredients.push(ingredient)

        const ingredientElement = document.createElement('div')
        ingredientElement.classList.add('ingredient')
        ingredientElement.textContent = ingredient
        preparationArea.appendChild(ingredientElement)

        currentOrder.ingredients = currentOrder.ingredients.filter(i => i !== ingredient)

        if (currentOrder.ingredients.length === 0) {
            score += 50
            preparationIngredients = []
            generateOrder()
        }
    } else {
        score -= 5
    }

    updateScore()
}

function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`
}

//END MESSAGE
function startTimer() {
    interval = window.setInterval(() => {
        timeLeft--
        timerDisplay.textContent = `Time Left: ${timeLeft}s`

        if (timeLeft <= 0) {
            clearInterval(interval!)
            alert('Game Over! Go to hell! POINTS:' + score)
        }
    }, 1500)
}

window.onload = startGame
