/* Необходимо создать веб-страницу с динамическими элементами с расписанием занятий.

На странице должна быть таблица с расписанием занятий, на основе JSON-данных.
Каждая строка таблицы должна содержать информацию о занятии, а именно:
- название занятия
- время проведения занятия
- максимальное количество участников
- текущее количество участников
- кнопка "записаться"
- кнопка "отменить запись"

Если максимальное количество участников достигнуто, либо пользователь уже записан на занятие, сделайте кнопку "записаться" неактивной.
Кнопка "отменить запись" активна в случае, если пользователь записан на занятие, иначе она должна быть неактивна.

Пользователь может записаться на один курс только один раз.

При нажатии на кнопку "записаться" увеличьте количество записанных участников.
Если пользователь нажимает "отменить запись", уменьшите количество записанных участников.
Обновляйте состояние кнопок и количество участников в реальном времени.

Если количество участников уже максимально, то пользователь не может записаться, даже если он не записывался ранее.

Сохраняйте данные в LocalStorage, чтобы они сохранялись и отображались при перезагрузке страницы.

Начальные данные (JSON): */
const initialData = `[
    {
        "id": 1,
        "name": "Йога",
        "time": "10:00 - 11:00",
        "maxParticipants": 15,
        "currentParticipants": 8
    },
    {
        "id": 2,
        "name": "Пилатес",
        "time": "11:30 - 12:30",
        "maxParticipants": 10,
        "currentParticipants": 5
    },
    {
        "id": 3,
        "name": "Кроссфит",
        "time": "13:00 - 14:00",
        "maxParticipants": 20,
        "currentParticipants": 15
    },
    {
        "id": 4,
        "name": "Танцы",
        "time": "14:30 - 15:30",
        "maxParticipants": 12,
        "currentParticipants": 10
    },
    {
        "id": 5,
        "name": "Бокс",
        "time": "16:00 - 17:00",
        "maxParticipants": 8,
        "currentParticipants": 6
    }
]`;

const lessonsData = {};
const initialDataArr = JSON.parse(initialData);
const localStorageKey = 'Lessons';
const lessonsContainerEl = document.querySelector('.lessons-container');


initialDataArr.forEach(element => {
    const { id, ...lesson } = element;
    lessonsData[id] = { ...lesson };
});

if (!localStorage.getItem(localStorageKey)) {
    saveToLocalStorage(localStorageKey, lessonsData);
}

const lessons = JSON.parse(localStorage.getItem(localStorageKey));

for (const id in lessons) {
    addToLessons(lessons[id], id);
}

const userName = prompt('Введите имя пользователя') // имитация авторизации
const userLessons = {};

if (!localStorage.getItem(userName)) {
    saveToLocalStorage(userName, {});
}

lessonsContainerEl.addEventListener('click', ({ target }) => {
    const lesson = target.closest('.lesson');
    if (target.matches('.lesson__register')) {
        register(lesson);
    }
    if (target.matches('.lesson__cancel')) {
        cancel(lesson);
    }
});


function register(lesson) {
    try {
        const id = lesson.dataset.id
        if (!checkParicipants(id)) {
            throw new Error('Колличество учатников занятия максимально');
        }
        if (checkUserRegistarion(id)) {
            throw new Error('Вы уже зарегистрированы на это занятие');
        }
        lessons[id].currentParticipants++;
        const { name, time } = lessons[id];
        userLessons[id] = { name, time };
        saveToLocalStorage(localStorageKey, lessons);
        saveToLocalStorage(userName, userLessons);
        updateLesson(lesson);
    } catch (error) {
        alert(error.message);
        console.log(error);
    }
}

function cancel(lesson) {
    try {
        const id = lesson.dataset.id
        if (!checkUserRegistarion(id)) {
            throw new Error('Вы не зарегистрированы на это занятие')
        }
        lessons[id].currentParticipants--;
        delete userLessons[id];
        saveToLocalStorage(localStorageKey, lessons);
        saveToLocalStorage(userName, userLessons);
        updateLesson(lesson);
    } catch (error) {
        alert(error.message)
        console.log(error);
    }
}


function updateLesson(lesson) {
    const currentParticipants = lesson.querySelector('.lesson__curr-participants');
    currentParticipants.textContent = `Количество текущих участников: ${lessons[lesson.dataset.id].currentParticipants}`
}



function checkUserRegistarion(lessonId) {
    return JSON.parse(localStorage.getItem(userName))[lessonId];
}

function checkParicipants(lessonId) {
    return lessons[lessonId].maxParticipants > lessons[lessonId].currentParticipants;
}

function addToLessons(lesson, id) {
    lessonsContainerEl.insertAdjacentHTML('beforeend', getLessonTemplate(lesson, id));
}

function saveToLocalStorage(key, obj) {
    localStorage.setItem(key, JSON.stringify(obj))
}

function getLessonTemplate(lesson, id) {
    return (`
        <div class="lesson" data-id="${id}">
            <h3 class="lesson__title">${lesson.name}</h3>
            <p class="lesson__time">${lesson.time}</p>
            <p class="lesson__max-participants">Максимальное количество участников: ${lesson.maxParticipants}</p>
            <p class="lesson__curr-participants">Количество текущих участников: ${lesson.currentParticipants}</p>
            <button class="lesson__register">Записаться</button>
            <button class="lesson__cancel">Отменить запись</button>
        </div>
    `);
}