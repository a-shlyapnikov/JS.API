const photoContainer = document.querySelector('.photo-container');
const accessKey = '';
const localStorageLikedPhotoKey = 'Liked';
const btnShowLiked = document.querySelector('.btn-liked a');
const urlRandom = 'https://api.unsplash.com/photos/random';
const urlPhotoById = 'https://api.unsplash.com/photos/';

if (!localStorage.getItem(localStorageLikedPhotoKey)) {
    localStorage.setItem(localStorageLikedPhotoKey, JSON.stringify({}));
}
const likedPhotos = JSON.parse(localStorage.getItem(localStorageLikedPhotoKey));

const photo = await fetchPhoto(urlRandom);
renderPhoto(photo);
const btnLike = document.querySelector('.like');





btnLike.addEventListener('click', (e) => {
    console.log('liked');
    const id = photo.id;
    const likeCounterEl = photoContainer.querySelector('.like-counter');
    let likes = +likeCounterEl.textContent;
    if (likedPhotos[id]) {
        likes--;
        likeCounterEl.textContent = likes;
        delete likedPhotos[id];
        saveToLocalStorage(localStorageLikedPhotoKey, likedPhotos);
        btnLike.classList.remove('active');
    } else {
        likes++;
        likeCounterEl.textContent = likes;
        const { urls: { regular }, alt_description, user: { first_name, last_name, instagram_username } } = photo;
        likedPhotos[id] = { urls: { regular }, alt_description, likes, user: { first_name, last_name, instagram_username }, id };
        saveToLocalStorage(localStorageLikedPhotoKey, likedPhotos);
        btnLike.classList.add('active');
    }

});

btnShowLiked.addEventListener('click', async ({ target }) => {
    if (target.classList.contains('active')) {
        location.reload();
        // renderPhoto(await fetchPhoto(urlRandom));
        // target.textContent = 'Открыть понравившиеся';
        // target.classList.remove('active');


    } else {
        photoContainer.innerHTML = '';
        target.classList.add('active');
        target.textContent = 'Смотреть дальше';
        for (const id in likedPhotos) {
            const photo = likedPhotos[id];
            console.log(photo);
            photoContainer.insertAdjacentHTML('beforeend', getPictureTemplate(photo))
        }
    }

});

function saveToLocalStorage(key, obj) {
    localStorage.setItem(key, JSON.stringify(obj));
}

function renderPhoto(picture) {
    photoContainer.innerHTML = getPictureTemplate(picture);
}

async function fetchPhoto(url) {
    try {
        const response = await fetch(url + `?client_id=${accessKey}`);
        if (!response.ok) {
            throw new Error("fetching error")
        }
        return await response.json();
    } catch (error) {
        photoContainer.textContent = 'Произошла ошибка загрузки с сервера';
        photoContainer.classList.add('error')
    }
}

function getPictureTemplate(photo) {
    return (`
        <div class="photo" data-id="${photo.id}">
           <img src="${photo.urls.regular}" alt="${photo.alt_description}">
            <p class="photo__desc">${photo.alt_description}</p>
            <p class="photo__ph">Ph: ${photo.user.first_name} ${photo.user.last_name ? photo.user.last_name : ''}</p>
            <p class="photo__socials"> ${photo.user.instagram_username ? 'Instagram: ' + photo.user.instagram_username : ''} </p>
            <div class="photo__like-container">
                <p>Likes: <span class="like-counter">${photo.likes}</span></p>
                <a href="#" class="like ${likedPhotos[photo.id] ? 'active' : ''}">Like</a>
            </div>
        </div>
    `);
}