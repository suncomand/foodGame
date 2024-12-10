"use strict";
const dishes = [
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
];
let currentOrder = null;
let score = 0;
let timeLeft = 60;
let interval = null;
let preparationIngredients = [];
//DOM
const orderDisplay = document.getElementById('order-display');
const ingredientTray = document.getElementById('ingredient-tray');
const preparationArea = document.getElementById('preparation-area');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
//START GAME
function startGame() {
    score = 0;
    timeLeft = 60;
    preparationIngredients = [];
    generateOrder();
    updateScore();
    startTimer();
}
function generateOrder() {
    currentOrder = dishes[Math.floor(Math.random() * dishes.length)];
    updateOrderDisplay();
}
function updateOrderDisplay() {
    if (currentOrder) {
        orderDisplay.innerHTML = `Order: ${currentOrder.dish}`;
        ingredientTray.innerHTML = '';
        const allIngredients = [...currentOrder.ingredients, ...generateDecoys()];
        allIngredients.sort(() => Math.random() - 0.5);
        allIngredients.forEach(ingredient => {
            const ingredientElement = document.createElement('div');
            ingredientElement.classList.add('ingredient');
            ingredientElement.textContent = ingredient;
            ingredientElement.setAttribute('draggable', 'true');
            ingredientElement.ondragstart = (event) => handleDragStart(event, ingredient);
            ingredientTray.appendChild(ingredientElement);
        });
    }
}
//DECOY
function generateDecoys() {
    return ["🥩", "🍅", "🧅", "🥕", "🍚", "🍖"];
}
function handleDragStart(event, ingredient) {
    var _a;
    (_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData('text', ingredient);
}
//DROPPING
preparationArea.ondragover = (event) => {
    event.preventDefault();
};
preparationArea.ondrop = (event) => {
    var _a;
    event.preventDefault();
    const ingredient = (_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData('text');
    if (ingredient && currentOrder) {
        handleIngredientDrop(ingredient);
    }
};
function handleIngredientDrop(ingredient) {
    if (currentOrder && currentOrder.ingredients.includes(ingredient)) {
        score += 10;
        preparationIngredients.push(ingredient);
        const ingredientElement = document.createElement('div');
        ingredientElement.classList.add('ingredient');
        ingredientElement.textContent = ingredient;
        preparationArea.appendChild(ingredientElement);
        currentOrder.ingredients = currentOrder.ingredients.filter(i => i !== ingredient);
        if (currentOrder.ingredients.length === 0) {
            score += 50;
            preparationIngredients = [];
            generateOrder();
        }
    }
    else {
        score -= 5;
    }
    updateScore();
}
function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}
//END MESSAGE
function startTimer() {
    interval = window.setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time Left: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(interval);
            alert('Game Over! Go to hell!, POINTS:' + score);
        }
    }, 1500);
}
window.onload = startGame;
