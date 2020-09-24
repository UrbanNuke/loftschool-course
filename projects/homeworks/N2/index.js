/* ДЗ 2 - работа с массивами и объектами */

/*
 Задание 1:

 Напишите аналог встроенного метода forEach для работы с массивами
 Посмотрите как работает forEach и повторите это поведение для массива, который будет передан в параметре array

 Пример:
   forEach([1, 2, 3], (el) => console.log(el))
 */
const forEach = (array, fn) => {
    for (const item of array) {
        fn(item, array.indexOf(item), array);
    }
};

/*
 Задание 2:

 Напишите аналог встроенного метода map для работы с массивами
 Посмотрите как работает map и повторите это поведение для массива, который будет передан в параметре array

 Пример:
   map([1, 2, 3], (el) => el ** 2) // [1, 4, 9]
 */
const map = (array, fn) => {
    const outputArr = [];
    for (const item of array) {
        outputArr.push(fn(item, array.indexOf(item), array));
    }
    return outputArr;
};

/*
 Задание 3:

 Напишите аналог встроенного метода reduce для работы с массивами
 Посмотрите как работает reduce и повторите это поведение для массива, который будет передан в параметре array

 Пример:
   reduce([1, 2, 3], (all, current) => all + current) // 6
 */
const reduce = (array, fn, initial) => {
    let acc = initial ? initial : array[0];
    for (let i = initial ? 0 : 1; i < array.length; i++) {
        acc = fn(acc, array[i], i, array);
    }
    return acc;
};

/*
 Задание 4:

 Функция должна перебрать все свойства объекта, преобразовать их имена в верхний регистр и вернуть в виде массива

 Пример:
   upperProps({ name: 'Сергей', lastName: 'Петров' }) вернет ['NAME', 'LASTNAME']
 */
const upperProps = obj => {
    const outputArr = [];
    for (const prop in obj) {
        outputArr.push(prop.toUpperCase());
    }
    return outputArr;
}

/*
 Задание 5 *:

 Функция принимает объект и должна вернуть Proxy для этого объекта
 Proxy должен перехватывать все попытки записи значений свойств и возводить это значение в квадрат

 Пример:
   const obj = createProxy({});
   obj.foo = 2;
   console.log(obj.foo); // 4
 */
const createProxy = obj => {
    return new Proxy(obj, {
        set(target, prop, val) {
            return Reflect.set(target, prop, val ** 2);
        }
    })
}

export {forEach, map, reduce, upperProps, createProxy};
