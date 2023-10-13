const pathName = window.location.pathname;

class Tracker {
  constructor() {
    this._totalCalories = Storage.getTotalCalories();
    this._calorieLimit = Storage.getCalorieLimit(2000);
    this._meals = Storage.getMeal();
    this._workouts = Storage.getWorkout();

    this._displayCalorieLimit();
    this._displayTotalCalorie();
    this._diaplayCaloriesBurned();
    this._calorieRemaining();
    this._progress();
    this._diaplayCaloriesConsumed();
    document.querySelector('#enter-limit').value = this._calorieLimit;
  }

  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calorie;
    Storage.setTotalCalorie(this._totalCalories);
    Storage.saveMeal(meal);
    this._displayNewItem(meal);
    this._render();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calorie;
    this._displayNewWorkout(workout);
    Storage.setTotalCalorie(this._totalCalories);
    Storage.saveWorkout(workout);
    this._render();
  }

  removeMeal(id) {
    const index = this._meals.findIndex((meal) => meal.id === id);

    if (index !== -1) {
      const meal = this._meals[index];

      this._totalCalories -= meal.calorie;
      Storage.setTotalCalorie(this._totalCalories);
      this._meals.splice(index, 1);

      Storage.storeRemoveMeal(id);
      this._render();
    }
  }

  removeWorkout(id) {
    const index = this._workouts.findIndex((workout) => workout.id === id);

    if (index !== -1) {
      const workout = this._workouts[index];

      this._totalCalories += workout.calorie;
      Storage.setTotalCalorie(this._totalCalories);
      this._workouts.splice(index, 1);
      Storage.removeWorkout(id);
      this._render();
    }
  }

  setLimit(calories) {
    this._calorieLimit = calories;
    this._render();
  }

  reset() {
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];
    document.getElementById('progress-bar').style.width = '0%';
    Storage.clearAll();
    this._render();
  }

  loadMeal() {
    this._meals.forEach((meal) => this._displayNewItem(meal));
  }

  loadWorkout() {
    this._workouts.forEach((workout) => this._displayNewWorkout(workout));
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
        class="bg-primary  text-white font-[500] text-[18px] md:text-[24px] rounded-[5px] py-[5px] px-[1rem]"
      >
      <p >${meal.calorie}</p>

      </div>
      <div
        class="cursor-pointer grid place-items-center w-[1.5rem] h-[1.5rem] bg-danger rounded-[5px] text-white delete"
      >
        <i class="fa fa-times"></i>
      </div>
   `;
    item.className =
      'border-[1px] border-grayBorder border-solid p-[1rem] rounded-[5px] flex   justify-between items-center card';
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
<p ">${workout.calorie}</p>
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

class Storage {
  static getCalorieLimit(defaultLimit = 2000) {
    let calorieLimit;
    if (localStorage.getItem('calorieLimit') === null) {
      calorieLimit = defaultLimit;
    } else {
      calorieLimit = +localStorage.getItem('calorieLimit');
    }

    return calorieLimit;
  }

  static setCalorieLimit(calorieLimit) {
    localStorage.setItem('calorieLimit', calorieLimit);
  }

  static getTotalCalories(defaultCalorie = 0) {
    let totalCalorie;

    if (localStorage.getItem('totalCalorie') === null) {
      totalCalorie = defaultCalorie;
    } else {
      totalCalorie = +localStorage.getItem('totalCalorie');
    }

    return totalCalorie;
  }
  static setTotalCalorie(totalCalorie) {
    localStorage.setItem('totalCalorie', totalCalorie);
  }

  static getMeal() {
    let meals;
    if (localStorage.getItem('meals') === null) {
      meals = [];
    } else {
      meals = JSON.parse(localStorage.getItem('meals'));
    }
    return meals;
  }

  static saveMeal(meal) {
    const meals = Storage.getMeal();
    meals.push(meal);
    localStorage.setItem('meals', JSON.stringify(meals));
  }

  static storeRemoveMeal(id) {
    const meals = Storage.getMeal();
    meals.forEach((meal, index) => {
      if (meal.id === id) {
        meals.splice(index, 1);
      }
    });
    localStorage.setItem('meals', JSON.stringify(meals));
  }

  static getWorkout() {
    let workouts;
    if (localStorage.getItem('workouts') === null) {
      workouts = [];
    } else {
      workouts = JSON.parse(localStorage.getItem('workouts'));
    }
    return workouts;
  }

  static saveWorkout(workout) {
    const workouts = Storage.getWorkout();
    workouts.push(workout);
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }

  static removeWorkout(id) {
    const workouts = Storage.getWorkout();
    workouts.forEach((workout, index) => {
      if (workout.id === id) {
        workouts.splice(index, 1);
      }
    });
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }

  static clearAll() {
    localStorage.removeItem('workouts');
    localStorage.removeItem('meals');
    localStorage.removeItem('totalCaories');

    // localStorage.clearAll()
  }
}

class App {
  constructor() {
    this._tracker = new Tracker();
    this._loadEvents();

    this._tracker.loadMeal();
    this._tracker.loadWorkout();
  }

  _loadEvents() {
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
    if (name.value.length < 1 || calorie.value.length < 1) {
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
    Storage.setCalorieLimit(+limitInput.value);
  }

  removeItem(type, e) {
    if (window.confirm('Do you want to remove this item?')) {
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
    if (window.confirm('Are you sure you want to reset?')) {
      this._tracker.reset();
      document.getElementById('remaining-box').style.background = '#f8f9fa';
      document.getElementById('remaining-box').style.color = '#212529';
      document.getElementById('meal-items').innerHTML = '';
      document.getElementById('workout-items').innerHTML = '';
    }
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

async function getquote() {
  const data = await fetch('https://type.fit/api/quotes');
  const result = await data.json();

  document.querySelector('.motivate').classList.add('active');
}

if (pathName === '/index.html') {
  document.querySelector('#quote').addEventListener('click', getquote);
} else {
  const initApp = new App();
}
