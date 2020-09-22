import { expect } from '@jest/globals';
import {
  bindFunction,
  returnArgumentsArray,
  returnCounter,
  returnFirstArgument,
  returnFnResult,
  sumWithDefaults,
} from './index';

// Задание 1
test('Функция должна возвращать аргумент, переданный ей в качестве параметра', () => {
  const result = returnFirstArgument(10);
  const result2 = returnFirstArgument('привет');

  expect(result).toBe(10);
  expect(result2).toBe('привет');
});

// Задание 2
test(`Функция должна возвращать сумму переданных аргументов.
      Значение по умолчанию для второго аргумента должно быть равно 100`, () => {
  const result = sumWithDefaults(10, 20);
  const result2 = sumWithDefaults(10);

  expect(result).toBe(30);
  expect(result2).toBe(110);
});

// Задание 3
test('Функция должна принимать другую функцию и возвращать результат вызова этой функции', () => {
  const result = returnFnResult(() => 'привет');

  expect(result).toBe('привет');
});

// Задание 4
test(`Функция должна принимать число и возвращать новую функцию (F)
      При вызове функции F, переданное ранее число должно быть увеличено на единицу и возвращено из F`, () => {
  const f = returnCounter(10);

  expect(f()).toBe(11);
  expect(f()).toBe(12);
  expect(f()).toBe(13);
});

// Задание 5
test(`Функция должна возвращать все переданные ей аргументы в виде массива
      Количество переданных аргументов заранее неизвестно`, () => {
  const result = returnArgumentsArray(1, 2, 3);

  expect(result).toStrictEqual([1, 2, 3]);
});

// Задание 6
test(`Функция должна принимать другую функцию (F) и некоторое количество дополнительных аргументов
      Функция должна привязать переданные аргументы к функции F и вернуть получившуюся функцию`, () => {
  function sum(a, b) {
    return a + b;
  }

  const newSum = bindFunction(sum, 2, 4);
  expect(newSum()).toBe(6);
});
