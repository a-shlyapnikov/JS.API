/* Создайте интерфейс веб-страницы, который включает в себя следующие элементы:
a. Контейнер для отображения текущего изображения.
b. Кнопки "Предыдущее изображение" и "Следующее изображение" для переключения между изображениями.
c. Навигационные точки (индикаторы) для быстрого переключения между изображениями.

Для создания элементов интерфейса используйте HTML.
При клике на кнопку "Предыдущее изображение" должно отображаться предыдущее изображение.
При клике на кнопку "Следующее изображение" должно отображаться следующее изображение.
При клике на навигационные точки, слайдер должен переключаться к соответствующему изображению.

Слайдер должен циклически переключаться между изображениями, то есть после последнего изображения должно отображаться первое, и наоборот.

Добавьте стилизацию для слайдера и элементов интерфейса с использованием CSS для улучшения внешнего вида. */
const sliderData = [
    {
        img: 'https://images.unsplash.com/photo-1699388642049-d88d57cc7d4a?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        title: 'Nature, Marek Piwnicki'
    },
    {
        img: 'https://images.unsplash.com/photo-1699125680104-308d0ae2661b?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        title: 'Fog, Pramod Tiwari'
    },
    {
        img: 'https://images.unsplash.com/photo-1699362232821-b2eccfc516e5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        title: 'City, Maëva Vigier'
    },
    {
        img: 'https://images.unsplash.com/photo-1697137031945-78dda795e5ac?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        title: 'Maountains, Marek Piwnicki'
    },
    {
        img: 'https://images.unsplash.com/photo-1510279770292-4b34de9f5c23?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        title: 'Sea, Iswanto Arif'
    }
];

const sliderEl = document.querySelector('.slider');
const paginationEl = document.querySelector('.pagination');
const prevBtnEl = paginationEl.querySelector('.prev-btn');
const nextBtnEl = paginationEl.querySelector('.next-btn');

let CURRENT_PAGE = 1;

window.addEventListener('DOMContentLoaded', () => {
    changeSlide(CURRENT_PAGE)

})

sliderData.forEach((slide, index) => {
    nextBtnEl.insertAdjacentHTML('beforebegin', getPaginationLiTemplate(index + 1));
});

paginationEl.addEventListener('click', ({ target }) => {
    if (target.matches('.btn-id a')) {
        const id = target.parentNode.dataset.id;
        changeSlide(id, target.parentNode);
        CURRENT_PAGE = +id;
    }
    
    if (target.matches('.prev-btn a')) {
        if (CURRENT_PAGE > 1) {
            CURRENT_PAGE--
            changeSlide(CURRENT_PAGE)
        } else {
            changeSlide(sliderData.length)
            CURRENT_PAGE = sliderData.length
        }
    }
    if (target.matches('.next-btn a')) {
        if (CURRENT_PAGE ===  sliderData.length) {
            CURRENT_PAGE = 1;
            changeSlide(CURRENT_PAGE)
        } else {
            CURRENT_PAGE++;
            changeSlide(CURRENT_PAGE)
        }
    }
});

const paginationList = paginationEl.querySelectorAll('li');


function changeSlide(id, node) {
    sliderEl.innerHTML = getSlideTemplate(sliderData[id - 1]);
    removeActive(document.querySelector(`li[data-id="${id}"`));
}

function removeActive(node) {
    paginationList.forEach(element => {
        if (element.classList.contains('active')) {
            element.classList.remove('active')
        }
    });
    node.classList.add('active');
}


function getPaginationLiTemplate(index) {
    return (`
        <li class="btn-id" data-id="${index}">
            <a href="#">${index}</a>
        </li>
    `)
}

function getSlideTemplate(slide) {
    return (`
        <div class="slide">
            <img src="${slide.img}" alt="${slide.title}">
            <h3>${slide.title}</h3>
        </div>
    `);
}