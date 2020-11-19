// У жизненного цикла HTML-страницы есть три важных события:
// DOMContentLoaded – браузер полностью загрузил HTML, было построено DOM-дерево, но внешние ресурсы, такие как картинки <img> и стили, могут быть ещё не загружены.
// load – браузер загрузил HTML и внешние ресурсы (картинки, стили и т.д.).
// beforeunload/unload – пользователь покидает страницу.

document.addEventListener('DOMContentLoaded', () => {
  const squares = document.querySelectorAll('.game__square');
  const scoreDisplay = document.querySelector('.game__count');
  const startBtn = document.querySelector('.game__button');

  //Начальные данные
  const width = 10; //ширина ряда
  let currentIndex = 0; //первый див в сетке
  let appleIndex = 0; //первый див в сетке
  let currentSnake = [2, 1, 0]; //дивы в змейке, где номер 2 - голова, а 0 хвост
  let direction = 1; //передвигается на 1 див за раз
  let score = 0;
  let speed = 0.9;
  let intervalTime = 0;
  let interval = 0;


  //Начать или обновить игру
  function startGame() {
    //Каждая ячейка змейки должна быть учтена до старта игры. В начале игры ни у одного дива не должно быть класса snake и apple
    currentSnake.forEach((index) =>
      squares[index].classList.remove('game__snake')
    );
    squares[appleIndex].classList.remove('game__apple');
    clearInterval(interval);
    score = 0;
    randomApple();

    //Параметры для начала игры
    direction = 1;
    scoreDisplay.innerText = score; // Node.innerText - это свойство, позволяющее задавать или получать текстовое содержимое элемента и его потомков
    intervalTime = 1000;
    currentSnake = [2, 1, 0];
    currentIndex = 0;
    currentSnake.forEach((index) =>
      squares[index].classList.add('game__snake')
    );
    interval = setInterval(moveOutcomes, intervalTime); //setInterval позволяет вызывать функцию регулярно несколько раз (setTimeout только один). 1 арг - функция для выполнения, 2 арг - задержка в миллисекундах
  }


  //Функция, которая обрабатывает любой результат (победы, проигрыши, столкновения)
  function moveOutcomes() {
    //если змейка ударилась о границу или о себя
    //проверка, где в сетке находится голова змеи, находится ли змея на параллельных линиях и в пределах сетки
    if (
      (currentSnake[0] + width >= width * width && direction === width) || //если ударилась о край
      (currentSnake[0] % width === width - 1 && direction === 1) || //если ударилась о правый край
      (currentSnake[0] % width === 0 && direction === -1) || //если ударилась о левый край
      (currentSnake[0] - width < 0 && direction === -width) || //Унарный оператор. Если x равно 3, тогда -x вернёт -3.
      squares[currentSnake[0] + direction].classList.contains('game__snake') //если ударилась о саму себя
    ) {
      //Добавить звук проигрыша
      soundLose();
      return clearInterval(interval);
    } else {
      soundMove();
    }

    //Движение змейки, хвост встает в начало
    const tail = currentSnake.pop(); //Метод pop() удаляет последний элемент из массива и возвращает его значение.
    squares[tail].classList.remove('game__snake');
    currentSnake.unshift(currentSnake[0] + direction); //Метод unshift() добавляет один или более элементов в начало массива и возвращает новую длину массива
    
    
    //Если змейка взяла яблоко
    if (squares[currentSnake[0]].classList.contains('game__apple')) {
      //добавить звук, когда змейка съела яблоко
      soundWin();
      //удалить яблоко
      squares[currentSnake[0]].classList.remove('game__apple');
      //добавить в хвост новый квадрат
      squares[tail].classList.add('game__snake');
      currentSnake.push(tail);
      //добавить на поле новое яблоко и обновить интервал
      randomApple();
      score++;
      scoreDisplay.textContent = score;
      clearInterval(interval);
      //увеличить скорость передвижения змейки
      intervalTime = intervalTime * speed;
      interval = setInterval(moveOutcomes, intervalTime);
    }

    squares[currentSnake[0]].classList.add('game__snake');
  }


  //Звук проигрыша
  function soundLose() {
    const loseSound = new Audio();
    loseSound.src = './sounds/lose.mp3';
    loseSound.autoplay = true;
  }


  //Звук выигрыша
  function soundWin() {
    const winSound = new Audio();
    winSound.src = './sounds/win.mp3';
    winSound.autoplay = true;
  }

  //Звук движения 
  function soundMove() {
    const moveSound = new Audio();
    moveSound.src = './sounds/move2.mp3';
    moveSound.play();
  }

  //Добавить на поле новое яблоко, когда старое съедено
  function randomApple() {
    do {
      appleIndex = Math.floor(Math.random() * squares.length);
    } while (squares[appleIndex].classList.contains('game__snake')); //убедиться, что яблоко не появится на самой змейке
    squares[appleIndex].classList.add('game__apple');
  }


  //Распределить функции согласно кодам клавиш
  function control(e) {
    //убедиться в том, что класса snake нет между ходами
    //!!!! если будет баг в первом диве(0,0), закомментировать эту строчку
    // squares[currentIndex].classList.remove('game__snake');

    if (e.keyCode === 39) {
      direction = 1; //при нажатии правой стрелки, змея идет вправо
    } else if (e.keyCode === 38) {
      direction = -width; // при нажатии стрелки вверх, змея идет на 10 дивов назад (вверх)
    } else if (e.keyCode === 37) {
      direction = -1; //при нажатии левой стрелки, змея идет налево на 1 див
    } else if (e.keyCode === 40) {
      direction = +width; // при нажатии стрелки вниз, змея идет на 10 дивов вперед от текущей позиции (вниз)
    }
  }

  document.addEventListener('keyup', control);
  startBtn.addEventListener('click', startGame);
});
