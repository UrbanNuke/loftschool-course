/* Задание со звездочкой */

/*
 Создайте страницу с кнопкой.
 При нажатии на кнопку должен создаваться div со случайными размерами, цветом и позицией на экране
 Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */

// для проверки тестов расскоментировать
// import './dnd.html';
import {addListener, removeListener} from "./functions.js";

const homeworkContainer = document.querySelector('#app');

let lastZIndex = 1;

export function createDiv() {
    const randomDiv = document.createElement('div');
    const randomColor = `#${Math.floor(Math.random() * 1000000)}`;
    const randomSide = Math.random() * 300 + 'px';
    randomDiv.classList.add('draggable-div');
    randomDiv.style.backgroundColor = randomColor;
    randomDiv.style.width = randomSide;
    randomDiv.style.height = randomSide;
    randomDiv.style.left = `${(Math.floor(Math.random() * 1000))}px`;
    randomDiv.style.top = `${(Math.floor(Math.random() * 1000))}px`;
    addListener('mousedown', randomDiv, dragAndDropHandler)
    return randomDiv;
}

function dragAndDropHandler(ev) {
    ev.target.ondragstart = function() {
        return false;
    };

    ev.target.style.zIndex = ++lastZIndex;

    function moveAt(pageX, pageY) {
        ev.target.style.left = pageX - ev.target.offsetWidth / 2 + 'px';
        ev.target.style.top = pageY - ev.target.offsetHeight / 2 + 'px';
    }

    moveAt(ev.pageX, ev.pageY);

    function mouseMoveHandler(ev) {
        moveAt(ev.pageX, ev.pageY);
    }

    addListener('mousemove', document, mouseMoveHandler)

    ev.target.onmouseup = () => {
        removeListener('mousemove', document, mouseMoveHandler);
        ev.target.onmouseup = null;
    }
}

const addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.addEventListener('click', function () {
    const randomDiv = createDiv();
    homeworkContainer.appendChild(randomDiv);
});
