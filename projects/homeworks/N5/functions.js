/* ДЗ 5 - Асинхронность и работа с сетью */

/*
 Задание 1:

 Функция должна возвращать Promise, который должен быть разрешен через указанное количество секунд

 Пример:
   delayPromise(3) // вернет promise, который будет разрешен через 3 секунды
 */
const delayPromise = seconds => {
    return new Promise(resolve => {
        setTimeout(() => resolve(), seconds * 1000);
    })
}

/*
 Задание 2:

 2.1: Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов можно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json

 2.2: Элементы полученного массива должны быть отсортированы по имени города

 Пример:
   loadAndSortTowns().then(towns => console.log(towns)) // должна вывести в консоль отсортированный массив городов
 */
const loadAndSortTowns = () => {
    return fetch('https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json')
        .then(resp => resp.json())
        .then(cities => {
            const sortFn = (a, b) => a.name.localeCompare(b.name, 'ru', {sensitivity: 'base'});
            cities.sort((a, b) => sortFn(a, b))

            return Promise.resolve(cities);
        })
        .catch(err => Promise.reject(err))
}

export {delayPromise, loadAndSortTowns};
