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
    const width =
      100 -
      ((this._calorieLimit - this._totalCalories) / this._calorieLimit) * 100;

    progressBar.style.width = `${width}%`;

    if (width <= 15) {
      progressBar.style.background = '#dc3545';
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

const tracker = new Tracker();
const food = new Meal('lunch', 800);
tracker.addMeal(food);

const workout = new Workout('run', 500);
tracker.addWorkout(workout);
