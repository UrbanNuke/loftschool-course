/*
 Страница должна предварительно загрузить список городов из
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 и отсортировать в алфавитном порядке.

 При вводе в текстовое поле, под ним должен появляться список тех городов,
 в названии которых, хотя бы частично, есть введенное значение.
 Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.

 Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 После окончания загрузки городов, надпись исчезает и появляется текстовое поле.

 Разметку смотрите в файле towns.html

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер

 *** Часть со звездочкой ***
 Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 При клике на кнопку, процесс загрузки повторяется заново
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */

import { loadAndSortTowns } from './functions.js';

const homeworkContainer = document.querySelector('#homework-container');

/* Блок с надписью "Загрузка" */
const loadingBlock = homeworkContainer.querySelector('#loading-block');

/* Блок с надписью "Не удалось загрузить города" и кнопкой "Повторить" */
const loadingFailedBlock = homeworkContainer.querySelector('#loading-failed');

/* Блок с текстовым полем и результатом поиска */
const filterBlock = homeworkContainer.querySelector('#filter-block');

/* Блок с результатами поиска */
const filterResult = homeworkContainer.querySelector('#filter-result');

loadingFailedBlock.classList.add('hidden');
filterBlock.classList.add('hidden');
loadingBlock.classList.add('hidden');

let isLoading;
let allCities;

/** Получение всех городов */
const loadTowns = async () => {
    isLoading = true;
    try {
        await loadAndSortTowns().then(cities => allCities = cities);
        isLoading = false;
        filterBlock.classList.remove('hidden');
    } catch {
        loadingFailedBlock.classList.remove('hidden');
        isLoading = false;
    }
}

/** Рендерит элементы в DOM */
const renderElements = cities => {
    filterResult.innerHTML = '';
    cities.forEach(city => {
        const el = document.createElement('p');
        el.textContent = city.name;
        filterResult.append(el);
    })
}

loadTowns().then(() => renderElements(allCities));

/*
 Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов пожно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 */

/*
 Функция должна проверять встречается ли подстрока chunk в строке full
 Проверка должна происходить без учета регистра символов

 Пример:
   isMatching('Moscow', 'moscow') // true
   isMatching('Moscow', 'mosc') // true
   isMatching('Moscow', 'cow') // true
   isMatching('Moscow', 'SCO') // true
   isMatching('Moscow', 'Moscov') // false
 */
const isMatching = (full, chunk) => {
    return full.toLowerCase().includes(chunk.toLowerCase());
}

/* Кнопка "Повторить" */
const retryButton = homeworkContainer.querySelector('#retry-button');

/* Текстовое поле для поиска по городам */
const filterInput = homeworkContainer.querySelector('#filter-input');

retryButton.addEventListener('click', () => {
    if (isLoading) {
        return;
    }
    loadTowns().then(() => renderElements(allCities));
});

filterInput.addEventListener('input', function () {
    if (!filterInput.value) {
        renderElements(allCities);
        return;
    }

    const searchStr = filterInput.value;
    if (!searchStr.trim()) {
        return;
    }

    const filteredCities = allCities.filter(city => isMatching(city.name, searchStr.trim()));
    renderElements(filteredCities);
});

export {loadTowns, isMatching};
