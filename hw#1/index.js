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
const localStorageLessonsKey = 'Lessons';
const localStorageUsersKey = 'Users';
const lessonsContainerEl = document.querySelector('.lessons-container');


initialDataArr.forEach(element => {
    const { id, ...lesson } = element;
    lessonsData[id] = { ...lesson };
});

if (!localStorage.getItem(localStorageLessonsKey)) {
    saveToLocalStorage(localStorageLessonsKey, lessonsData);
}

const lessons = JSON.parse(localStorage.getItem(localStorageLessonsKey));

for (const id in lessons) {
    renderLesson(lessons[id], id);
}

const userName = prompt('Введите имя пользователя'); // имитация авторизации
if (!localStorage.getItem(localStorageUsersKey)) {
    saveToLocalStorage(localStorageUsersKey, {});
}
let users = JSON.parse(localStorage.getItem(localStorageUsersKey));
if (!users[userName]) {
    users[userName] = {};
    saveToLocalStorage(localStorageUsersKey, users);
}


window.addEventListener('DOMContentLoaded', (e) => {
    const userLessons = users[userName];
    for (const lessonId in lessons) {
        const lesson = document.querySelector(`.lesson[data-id="${lessonId}"]`);
        if (userLessons.hasOwnProperty(lessonId)) {
            const btnRegister = lesson.querySelector('.lesson__register');
            btnRegister.disabled = true;
        } else {
            const btnCancel = lesson.querySelector('.lesson__cancel');
            btnCancel.disabled = true;
        }
    }
});




lessonsContainerEl.addEventListener('click', ({ target }) => {
    const lesson = target.closest('.lesson');
    const lessonId = lesson.dataset.id
    if (target.matches('.lesson__register')) {
        if (!checkParicipants(lessonId) || checkUserRegistarion(lessonId)) {
            target.disabled = true;
            return;
        }
        register(lesson);
        target.disabled = true;
        const btnCancel = lesson.querySelector('.lesson__cancel');
        btnCancel.disabled = false;
        return;
    }
    if (target.matches('.lesson__cancel')) {
        if (!checkUserRegistarion(lessonId)) {
            target.disabled = true;
            return;
        }
        cancel(lesson);
        const btnRegister = lesson.querySelector('.lesson__register');
        btnRegister.disabled = false;
        target.disabled = true;
        return;
    }
});


function register(lesson) {
    const lessonId = lesson.dataset.id
    lessons[lessonId].currentParticipants++;
    const { name, time } = lessons[lessonId];
    users[userName][lessonId] = { name, time };
    saveToLocalStorage(localStorageLessonsKey, lessons);
    saveToLocalStorage(localStorageUsersKey, users);
    updateLesson(lesson);

}

function cancel(lesson) {
    const id = lesson.dataset.id
    lessons[id].currentParticipants--;
    delete users[userName][id];
    saveToLocalStorage(localStorageLessonsKey, lessons);
    saveToLocalStorage(localStorageUsersKey, users);
    updateLesson(lesson);
}


function updateLesson(lesson) {
    const currentParticipants = lesson.querySelector('.lesson__curr-participants span');
    currentParticipants.textContent = lessons[lesson.dataset.id].currentParticipants;
}



function checkUserRegistarion(lessonId) {
    return users[userName][lessonId];
}

function checkParicipants(lessonId) {
    return lessons[lessonId].maxParticipants > lessons[lessonId].currentParticipants;
}

function renderLesson(lesson, id) {
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
            <p class="lesson__curr-participants">Количество текущих участников: <span>${lesson.currentParticipants}</span></p>
            <button class="lesson__register">Записаться</button>
            <button class="lesson__cancel">Отменить запись</button>
        </div>
    `);
}