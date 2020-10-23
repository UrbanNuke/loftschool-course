// eslint-disable-next-line no-undef
ymaps.ready(init);

let map;

let idCounter = 1;

const geoObjects = [];

if (localStorage.length) {
    Object.keys(localStorage).forEach(key => {
        geoObjects.push(JSON.parse(localStorage.getItem(key)));
    });
    idCounter = localStorage.length + 1;
}

function init() {
    // eslint-disable-next-line no-undef
    map = new ymaps.Map('map', {
        center: [59.94015403, 30.31539954],
        zoom: 12,
        controls: ['zoomControl']
    });

    const popupClass = ymaps.templateLayoutFactory.createClass(
        `<div id="popup" class="popup">
            <div class="popup__header">
                <img class="popup__header-icon" src="assets/img/point_small.png">
                <span class="popup__header-text">{% if address %} {{address}} {% else %} {{properties.address}} {% endif %}</span>
                <button class="popup__header-close-btn">
                    <img src="assets/img/close_btn.png">
                </button>
            </div>
            {% if properties.reviews.length %}
            <div class="popup__comments">
                {% for review in properties.reviews %}
                <div class="popup__comment">
                    <div class="popup__comment-header">
                        <div class="popup__comment-name">{{review.name}}</div>
                        <div class="popup__comment-place">{{review.place}}</div>
                        <div class="popup__comment-date">{{review.date}}</div>
                    </div>
                    <p class="popup__comment-review">{{review.comment}}</p>
                </div>
                {% endfor %}
            </div>
            {% endif %}
            <div class="popup__new-comment">
                <h2 class="popup__new-comment-header-title">ВАШ ОТЗЫВ</h2>
                <form onsubmit="return false;" class="popup__new-comment-form">
                    <input type="text" name="name" placeholder="Ваше имя" class="popup__new-comment-form-name" required>
                    {% if !properties.place %}
                    <input type="text" name="place" placeholder="Укажите место" class="popup__new-comment-form-place" required>
                    {% endif %}
                    <textarea name="comment" placeholder="Поделитесь впечатлениями" id="comment" cols="30" rows="10" class="popup__new-comment-form-review" required></textarea>
                    <button class="popup__new-comment-form-add-btn"">Добавить</button>
                </form>
            </div>
        </div>`, {
            build: function () {
                this.constructor.superclass.build.call(this);
                this.popup = document.getElementById('popup');
                this.closeBtn = this.popup.querySelector('.popup__header-close-btn');
                this.closeBtn.addEventListener('click', closeBalloon);
                this.addButton = this.popup.querySelector('.popup__new-comment-form-add-btn');
                this.form = this.popup.querySelector('.popup__new-comment-form');
                const formElements = {
                    form: {
                        name: this.form.elements.name,
                        place: this.form.elements.place,
                        comment: this.form.elements.comment
                    }
                };
                const data = Object.assign({},this._data, formElements);
                this.addButton.addEventListener('click',
                    this._data?.properties?._data?.place
                        ? addComment.bind(null, this._data.geoObject, this.form)
                        : addGeoObject.bind(null, data)
                );
            },
            clear: function () {
                this.constructor.superclass.clear.call(this);
                this.closeBtn.removeEventListener('click', closeBalloon);
                this.addButton.removeEventListener('click', addGeoObject);
            }
        }
    );

    // eslint-disable-next-line no-undef
    const clusterPopup = ymaps.templateLayoutFactory.createClass(
        `<div id="popup" class="popup popup--cluster">
            <div class="popup__place-list">
                {% for object in properties.geoObjects %}
                    <a href="#" data-id="{{object.properties.id}}" class="popup__place-item ">{{object.properties.place}}</a>
                {% endfor %}
            </div>
            <div class="popup__comments-block">
                <div class="popup__header popup__header--cluster">
                    <img class="popup__header-icon" src="assets/img/point_small.png">
                    <span class="popup__header-text">{{properties.currentMark.properties._data.address}}</span>
                    <button class="popup__header-close-btn">
                        <img src="assets/img/close_btn.png">
                    </button>
                </div>
                {% if properties.currentMark.properties._data.reviews.length %}
                <div class="popup__comments">
                    {% for review in properties.currentMark.properties._data.reviews %}
                    <div class="popup__comment">
                        <div class="popup__comment-header">
                            <div class="popup__comment-name">{{review.name}}</div>
                            <div class="popup__comment-place">{{review.place}}</div>
                            <div class="popup__comment-date">{{review.date}}</div>
                        </div>
                        <p class="popup__comment-review">{{review.comment}}</p>
                    </div>
                    {% endfor %}
                </div>
                {% endif %}
                <div class="popup__new-comment">
                    <h2 class="popup__new-comment-header-title">ВАШ ОТЗЫВ</h2>
                    <form onsubmit="return false;" class="popup__new-comment-form">
                        <input type="text" name="name" placeholder="Ваше имя" class="popup__new-comment-form-name" required>
                        <textarea name="comment" placeholder="Поделитесь впечатлениями" id="comment" cols="30" rows="10" class="popup__new-comment-form-review" required></textarea>
                        <button class="popup__new-comment-form-add-btn"">Добавить</button>
                    </form>
                </div>
            </div>
        </div>
            `, {
            build: function () {
                console.log(this);
                this.constructor.superclass.build.call(this);
                this.geoObjects = this._data.cluster.getGeoObjects();
                this._data.cluster.properties._data.currentMark = this.geoObjects[0];
                this.popup = document.getElementById('popup');
                this.closeBtn = this.popup.querySelector('.popup__header-close-btn');
                this.closeBtn.addEventListener('click', closeBalloon);
                this.addButton = this.popup.querySelector('.popup__new-comment-form-add-btn');
                this.form = this.popup.querySelector('.popup__new-comment-form');
                [...this.popup.querySelector('.popup__place-list').children].forEach(child => {
                    child.addEventListener('click', e => {
                        const placeId = e.target.getAttribute('data-id');
                        this._data.cluster.properties._data.currentMark = this.geoObjects.find(object => object.properties._data.id.toString() === placeId);
                        this.constructor.superclass.rebuild.call(this);
                    });
                });
                this.addButton.addEventListener('click', addComment.bind(null, this._data.cluster.properties._data.currentMark, this.form));
            },
            clear: function () {
                this.constructor.superclass.clear.call(this);
                this.closeBtn.removeEventListener('click', closeBalloon);
                this.addButton.removeEventListener('click', addGeoObject);
            }
        }
    );

    // eslint-disable-next-line no-undef
    const clusterer = new ymaps.Clusterer({ clusterDisableClickZoom: true, balloonLayout: clusterPopup, hideIconOnBalloonOpen: false });
    map.geoObjects.add(clusterer);

    if (geoObjects.length) {
        geoObjects.forEach(item => {
            addGeoObject(item, true);
        })
    }

    function closeBalloon() {
        map.balloon.close();
    }

    function addGeoObject(data, initialize = false) {
        let info;
        if (initialize === true) {
            info = data.reviews;
        } else {
            info = {name: data.form.name.value.trim(), place: data.form.place.value.trim(), comment: data.form.comment.value.trim()};
        }
        if (initialize !== true && (!info.name || !info.place || !info.comment)) {
            return;
        }
        // eslint-disable-next-line no-undef
        const mark = new ymaps.Placemark(data.coords, {
            coords: data.coords,
            address: data.address,
            reviews: initialize === true ? info : [info],
            place: initialize === true ? data.place : info.place,
            id: data.id ? data.id : idCounter++,
            clusterCaption: initialize === true ? data.place : info.place
        }, {
            hideIconOnBalloonOpen: false,
            balloonLayout: popupClass,
            iconLayout: 'default#image',
            iconImageHref: 'assets/img/point.png',
            iconImageSize: [44, 66],
            iconImageOffset: [-22, -66]
        });
        clusterer.add(mark);
        if (initialize !== true) {
            localStorage.setItem(mark.properties._data.id, JSON.stringify(mark.properties._data));
            map.balloon.close();
        }
    }

    function addComment(mark, form) {
        const innerData = mark.properties._data;
        const info = {name: form.name.value.trim(), comment: form.comment.value.trim()};
        if (!info.name || !info.comment) {
            return;
        }
        innerData.reviews.push({name: info.name, place: innerData.place, comment: info.comment});
        localStorage.setItem(innerData.id, JSON.stringify(innerData));
        map.balloon.close();
    }

    map.events.add('click', async (e) => {
        // eslint-disable-next-line no-undef
        const address = await ymaps.geocode(e.get('coords')).then(res => res.geoObjects.get(0).properties.getAll().text);

        map.balloon.open(e.get('coords'),
            {coords: e.get('coords'), address},
            {layout: popupClass, closeButton: true}
        );
    })
}




