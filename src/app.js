class Tracker {
  constructor() {
    this._totalCalories = 0;
    this._calorieLimit = 2000;
    this._meals = [];
    this._workouts = [];

    this._displayCalorieLimit();
    this._displayTotalCalorie();
    this._diaplayCaloriesBurned();
    this._calorieRemaining();
    this._progress();
  }

  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calorie;
    this._displayNewItem(meal);
    this._render();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calorie;
    this._displayNewWorkout(workout);

    this._render();
  }

  removeMeal(id) {
    const index = this._meals.findIndex((meal) => meal.id === id);

    if (index !== -1) {
      const meal = this._meals[index];

      this._totalCalories -= meal.calorie;
      this._meals.splice(index, 1);
      this._render();
    }
  }

  removeWorkout(id) {
    const index = this._workouts.findIndex((workout) => workout.id === id);

    if (index !== -1) {
      const workout = this._workouts[index];

      this._totalCalories += workout.calorie;
      this._workouts.splice(index, 1);
      this._render();
    }
  }

  setLimit(calories) {
    this._calorieLimit = calories;
    this._render();
  }

  reset() {
    this._totalCalories = 0;
    this._calorieLimit = 0;
    this._meals = [];
    this._workouts = [];
    document.getElementById('progress-bar').style.width = '0%';
    this._render();
  }

  // private methods
  _displayTotalCalorie() {
    const totalCalorieEl = document.getElementById('total-calories');
    totalCalorieEl.innerText = this._totalCalories;
  }

  _displayCalorieLimit() {
    const calorieLimitEl = document.getElementById('limit');
    calorieLimitEl.innerText = this._calorieLimit;
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

  _displayNewItem(meal) {
    const item = document.createElement('div');

    item.innerHTML = `
      <h1 class="text-primaryDark font-[400] text-[18px] md:text-[24px] capitalize">${meal.name}</h1>
  
      <div
        class="bg-primary  text-white font-[500] text-[18px] md:text-[24px] rounded-[5px] "
      >
      <p class="p-[1rem]">${meal.calorie}</p>

      </div>
      <div
        class="cursor-pointer grid place-items-center w-[1.5rem] h-[1.5rem] bg-danger rounded-[5px] text-white delete"
      >
        <i class="fa fa-times"></i>
      </div>
   `;
    item.className =
      'border-[1px] border-grayBorder border-solid p-[1rem] rounded-[5px] flex gap-[1rem]  justify-between items-center card';
    item.setAttribute('data-id', meal.id);
    document.getElementById(`meal-items`).appendChild(item);
  }

  _displayNewWorkout(workout) {
    const item = document.createElement('div');
    item.innerHTML = `
    <h1 class="text-primaryDark font-[400] text-[18px] md:text-[24px] capitalize">
      ${workout.name}
    </h1>

    <div
      class="bg-orange text-white font-[500] text-[18px] md:text-[24px] rounded-[5px] py-[5px] px-[1rem]"
    >
<p class="p-[1rem]">${workout.calorie}</p>
    </div>
    <div
        class="cursor-pointer grid place-items-center w-[1.5rem] h-[1.5rem] bg-danger rounded-[5px] text-white delete"
      >
        <i class="fa fa-times"></i>
      </div>

 `;
    item.className =
      'border-[1px] border-grayBorder border-solid p-[1rem] rounded-[5px] flex gap-[1rem]  justify-between items-center card';
    item.setAttribute('data-id', workout.id);
    document.getElementById(`workout-items`).appendChild(item);
  }

  _render() {
    this._displayTotalCalorie();
    this._displayCalorieLimit();
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
      .addEventListener('submit', this._newItem.bind(this, 'meal'));

    document
      .getElementById('workout-form')
      .addEventListener('submit', this._newItem.bind(this, 'workout'));

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
      .addEventListener('click', this._formCollapse.bind(this, 'workout'));

    document
      .getElementById('add-meal-btn')
      .addEventListener('click', this._formCollapse.bind(this, 'meal'));

    document
      .querySelector('.save')
      .addEventListener('click', this._setLimit.bind(this));

    document
      .getElementById('meal-items')
      .addEventListener('click', this.removeItem.bind(this, 'meal'));
    document
      .getElementById('workout-items')
      .addEventListener('click', this.removeItem.bind(this, 'workout'));

    document
      .getElementById('filter-meal')
      .addEventListener('input', this.filterItem.bind(this, 'meal'));

    document
      .getElementById('filter-workout')
      .addEventListener('input', this.filterItem.bind(this, 'workout'));

    document
      .getElementById('reset')
      .addEventListener('click', this.reset.bind(this));

    window.addEventListener('click', this.activeInput.bind(this));
  }

  _newItem(type, e) {
    e.preventDefault();

    const name = document.getElementById(`enter-${type}`);
    const calorie = document.getElementById(`enter-${type}-calories`);

    // validate input
    if (name.value < 1 && calorie.value < 1) {
      document.querySelector('.error').classList.add('active');

      setTimeout(function () {
        document.querySelector('.error').classList.remove('active');
      }, 3000);

      return;
    }

    if (type === 'meal') {
      const meal = new Meal(name.value, +calorie.value);
      this._tracker.addMeal(meal);
    } else {
      const workout = new Workout(name.value, +calorie.value);
      this._tracker.addWorkout(workout);
    }
    name.value = '';
    calorie.value = '';
    document.getElementById(`${type}-collapse`).classList.remove('open');
  }

  _openModal(e) {
    e.preventDefault();

    document.querySelector('.modal').classList.add('active');
    document.querySelector('body').classList.add('active-body');
  }

  _formCollapse(type, e) {
    e.preventDefault();
    document.getElementById(`${type}-collapse`).classList.toggle('open');
  }

  _setLimit(e) {
    e.preventDefault();
    const limitInput = document.getElementById('enter-limit');
    this._tracker.setLimit(+limitInput.value);
    document.querySelector('.modal').classList.remove('active');
    document.querySelector('body').classList.remove('active-body');
  }

  removeItem(type, e) {
    if (
      e.target.classList.contains('fa-times') ||
      e.target.classList.contains('delete')
    ) {
      const id = e.target.closest('.card').getAttribute('data-id');

      type === 'meal'
        ? this._tracker.removeMeal(id)
        : this._tracker.removeWorkout(id);
      e.target.closest('.card').remove();
    }
  }

  filterItem(type, e) {
    const text = e.target.value.toLowerCase();
    const items = document.querySelectorAll(`#${type}-items > div`);

    items.forEach((item) => {
      const itemName = item.firstElementChild.textContent.toLowerCase();
      if (itemName.indexOf(text) !== -1) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  reset() {
    this._tracker.reset();
    document.getElementById('remaining-box').style.background = '#f8f9fa';
    document.getElementById('remaining-box').style.color = '#212529';
    document.getElementById('meal-items').innerHTML = '';
    document.getElementById('workout-items').innerHTML = '';
  }

  activeInput(e) {
    const inputEl = document.querySelectorAll('.outline-none');

    if (e.target.classList.contains('outline-none')) {
      inputEl.forEach((input) => {
        input.classList.remove('active');
      });
      e.target.classList.add('active');
    } else {
      inputEl.forEach((input) => {
        input.classList.remove('active');
      });
    }
  }
}

const initApp = new App();
