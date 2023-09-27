class Tracker {
  constructor() {
    this._totalCalories = 0;
    this._calorieLimit = 2000;
    this._meals = [];
    this._workouts = [];

    this._displayCalorieLimit();
    this._displayTotalCalorie();
  }

  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calorie;
    this._render();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calorie;
    this._render();
  }

  _displayTotalCalorie() {
    const totalCalorieEl = document.getElementById('total-calories');
    totalCalorieEl.innerText = this._totalCalories;
  }

  _displayCalorieLimit() {
    const totalCalorieEl = document.getElementById('limit');
    totalCalorieEl.innerText = this._calorieLimit;
  }

  _diaplayCaloriesConsumed() {
    const calorieConsumedEl = document.getElementById('consumedCal');
    calorieConsumedEl.innerText = this._meals.reduce(
      (total, meal) => total + meal.calorie,
      0
    );
  }

  _diaplayCaloriesBurned() {
    const calorieBurnedEl = document.getElementById('burnedCal');
    calorieBurnedEl.innerText = this._workouts.reduce(
      (total, workout) => total + workout.calorie,
      0
    );
  }

  _calorieRemaining() {
    const calorieRemainingEl = document.getElementById('remainingCal');
    calorieRemainingEl.innerText = this._calorieLimit - this._totalCalories;
  }

  _progress() {
    const progressBar = document.getElementById('progress-bar');
    const percentage = (this._totalCalories / this._calorieLimit) * 100;
    const width = Math.min(percentage, 100);
    progressBar.style.width = `${width}%`;

    if (width >= 95) {
      progressBar.style.background = '#dc3545';
    } else {
      progressBar.style.background = '#599f3d';
    }

    if (this._calorieLimit - this._totalCalories <= 0) {
      document.getElementById('remaining-box').style.background = '#dc3545';
      document.getElementById('remaining-box').style.color = 'white';
    } else {
      document.getElementById('remaining-box').style.background = '#f8f9fa';
      document.getElementById('remaining-box').style.color = '#212529';
    }
  }

  _render() {
    this._displayTotalCalorie();
    this._diaplayCaloriesConsumed();
    this._diaplayCaloriesBurned();
    this._calorieRemaining();
    this._progress();
  }
}

class Meal {
  constructor(name, calorie) {
    this.name = name;
    this.calorie = calorie;
    this.id = Math.random().toString(16).slice(2);
  }
}

class Workout {
  constructor(name, calorie) {
    this.name = name;
    this.calorie = calorie;
    this.id = Math.random().toString(16).slice(2);
  }
}

class App {
  constructor() {
    this._tracker = new Tracker();

    document
      .getElementById('meal-form')
      .addEventListener('submit', this._newMeal.bind(this));

    document
      .getElementById('workout-form')
      .addEventListener('submit', this._newWorkout.bind(this));

    document
      .getElementById('set-limit')
      .addEventListener('click', this._openModal.bind(this));

    document
      .querySelector('.close-modal')
      .addEventListener('click', function () {
        document.querySelector('.modal').classList.remove('active');
        document.querySelector('body').classList.remove('active-body');
      });

    document
      .getElementById('add-workout-btn')
      .addEventListener('click', this._workoutCollapse.bind(this));

    document
      .getElementById('add-meal-btn')
      .addEventListener('click', this._mealCollapse.bind(this));
  }

  _newMeal(e) {
    e.preventDefault();

    const name = document.getElementById('enter-meal');
    const calorie = document.getElementById('enter-calories');

    // validate input
    if (name.value < 1 && calorie.value < 1) {
      document.querySelector('.error').classList.add('active');

      setTimeout(function () {
        document.querySelector('.error').classList.remove('active');
      }, 3000);

      return;
    }

    const meal = new Meal(name.value, +calorie.value);
    this._tracker.addMeal(meal);
    name.value = '';
    calorie.value = '';
  }

  _newWorkout(e) {
    e.preventDefault();

    const name = document.getElementById('enter-workout');
    const calorie = document.getElementById('enter-workout-calories');

    // validate input
    if (name.value < 1 && calorie.value < 1) {
      document.querySelector('.error').classList.add('active');

      setTimeout(function () {
        document.querySelector('.error').classList.remove('active');
      }, 3000);

      return;
    }

    const workout = new Workout(name.value, +calorie.value);
    this._tracker.addWorkout(workout);
    name.value = '';
    calorie.value = '';
  }

  _openModal(e) {
    e.preventDefault();

    document.querySelector('.modal').classList.add('active');
    document.querySelector('body').classList.add('active-body');
  }

  _workoutCollapse(e) {
    e.preventDefault();
    document.getElementById('workout-collapse').classList.toggle('open');
  }

  _mealCollapse(e) {
    e.preventDefault();
    document.getElementById('meal-collapse').classList.toggle('open');
  }
}

const initApp = new App();

const tracker = new Tracker();
const food = new Meal('lunch', 1000);
tracker.addMeal(food);
const workout = new Workout('run', 500);
tracker.addWorkout(workout);
