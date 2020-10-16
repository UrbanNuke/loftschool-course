/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 + 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 + 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 + Если добавляется cookie с именем уже существующей cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 + В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 + Если в поле фильтра пусто, то должны выводиться все доступные cookie
 + Если добавляемая cookie не соответствует фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 + Если добавляется cookie, с именем уже существующей cookie и ее новое значение не соответствует фильтру,
   то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

import './cookie.html';

/*
 app - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
import {hasCookie, getCookies, setCookie, deleteCookie, getCookieLength} from './cookies.js';

const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

filterNameInput.addEventListener('input', function () {
    const value = filterNameInput.value.trim();

    if (!value && listTable.children.length !== getCookieLength()) {
        renderAllCookies();
    }

    if (!value) {
        return;
    }

    renderAllCookies(value);
});

addButton.addEventListener('click', () => {
    const cookieKey = addNameInput.value.trim();
    const cookieValue = addValueInput.value.trim();


    // Если добавляемая кука не подходит под фильтр, добавляем только в браузер
    if (!cookieKey.toLowerCase().includes(filterNameInput.value)
        && !cookieValue.toLowerCase().includes(filterNameInput.value)
        && !hasCookie(cookieKey)) {
        setCookie(cookieKey, cookieValue);
        return;
    }

    // Обработка случая если куки уже имеются
    if (hasCookie(cookieKey)) {

        const tr = [...listTable.children].find(tr => {
            return tr.firstChild.textContent === cookieKey;
        });

        // Если добавляется cookie, с именем уже существующей cookie и ее новое значение не соответствует фильтру,
        //  то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена
        if (!cookieValue.toLowerCase().includes(filterNameInput.value)) {
            setCookie(cookieKey, cookieValue);
            tr.remove();
            filterNameInput.value = '';
            return;
        }

        const removeBtn = tr.querySelector('button');
        removeBtn.previousElementSibling.textContent = cookieValue;
        removeBtn.onclick = () => {
            tr.remove();
            deleteCookie(cookieKey, cookieValue);
        }

        setCookie(cookieKey, cookieValue);
        filterNameInput.value = '';
        return;
    }

    setCookie(cookieKey, cookieValue);

    // Обработка случая если куки новые
    renderOneCookie(cookieKey, cookieValue);
    filterNameInput.value = '';
});

/** Рендерит cookies на странице */
function renderAllCookies(filter = '') {
    const cookies = getCookies();
    listTable.innerHTML = '';
    for (const [key, value] of Object.entries(cookies)) {
        if (key.toLowerCase().includes(filter) || value.toLowerCase().includes(filter)) {
            renderOneCookie(key, value);
        }
    }
}

/**
 * Рендерит одну cookie на странице
 * @param key ключ cookie
 * @param value значение cookie
 */
function renderOneCookie(key, value) {
    const tr = document.createElement('tr');

    const tdKey = document.createElement('td');
    tdKey.textContent = key;

    const tdName = document.createElement('td');
    tdName.textContent = value;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'удалить';
    deleteBtn.onclick = () => {
        deleteCookie(key, value);
        tr.remove();
    }

    tr.append(...[tdKey, tdName, deleteBtn]);

    listTable.append(tr);
}

renderAllCookies();
