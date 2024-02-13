const pictureContainer = document.querySelector('.photo-container');
const accessKey = '4YZMz5raUapYKiQtghjsYhsT2XAIw9Ss7xhN6Pd4PIw';
const localStorageLikedPhotoKey = 'Liked';



const photo = await fetchPhoto();
renderPhoto(photo);
console.log(photo);

const btnLike = document.querySelector('.like');

btnLike.addEventListener('click', (e) => {
    if (localStorage.getItem(localStorageLikedPhotoKey)) {

    }
    const likeCounterEl = pictureContainer.querySelector('.like-counter');
    likeCounterEl.textContent = +likeCounterEl.textContent + 1;
});

function renderPhoto(picture) {
    pictureContainer.innerHTML = getPictureTemplate(picture);
}

async function fetchPhoto() {
    try {
        const response = await fetch(`https://api.unsplash.com/photos/random?client_id=${accessKey}`);
        if (!response.ok) {
            throw new Error("fetching error")
        }
        return await response.json();
    } catch (error) {
        console.log(error.message);
    }
}

function getPictureTemplate(photo) {
    return (`
        <div class="photo">
            <img src="${photo.urls.regular}" alt="${photo.alt_description}">
            <p>${photo.alt_description}</p>
            <p>Ph: ${photo.user.first_name} ${photo.user.last_name}</p>
            <p> ${photo.user.instagram_username ? 'Instagram: ' + photo.user.instagram_username : ''} </p>
            <div class="like-container">
                <p>Likes: <span class="like-counter">${photo.likes}</span></p>
                <button class="like">Like</button>
            </div>
        </div>
    `);
}