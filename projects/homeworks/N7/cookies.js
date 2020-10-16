/**
 * Получение cookie в виде объекта ключ - значение
 * @return cookie
 */
function getCookies() {
    return document.cookie.split('; ').reduce((acc, curr) => {
        const [key, value] = curr.split('=');
        acc[key] = value;
        return acc;
    }, {})
}

/**
 * Проверяет имеется ли уже такая cookie
 * @param cookieKey ключ cookie
 * @return индикатор нахождения
 */
function hasCookie(cookieKey) {
    return getCookies()[cookieKey];
}

/**
 * Установка cookie
 * @param key ключ cookie
 * @param value значение cookie
 * @param options доп. опции
 */
function setCookie(key, value, options = {}) {
    options = {
        path: '/',
        ...options
    };

    let updatedCookie = encodeURIComponent(key) + "=" + encodeURIComponent(value);

    for (const optionKey in options) {
        updatedCookie += "; " + optionKey;
        const optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}

/**
 * Удаление cookie
 * @param key ключ cookie
 */
function deleteCookie(key) {
    setCookie(key, "", {
        'max-age': -1
    })
}

/**
 * Получить кол-во cookies
 * @return кол-во cookies
 */
function getCookieLength() {
    return document.cookie.split(';').length;
}

export {getCookies, hasCookie, deleteCookie, setCookie, getCookieLength};
