// 統一定義 API 網址

const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users/";
const dataPanel = document.querySelector('#data-panel');
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

const friendList = []


axios
  .get(INDEX_URL)
  .then((response) => {
    const allFriendData = response.data.results;
    friendList.push(...allFriendData);
    renderFriendList(friendList);
  })
  .catch((error) => {
    console.log(error);
  });

function renderFriendList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `
      <div class="col-sm-3">
        <div class="mb-2">
          <!-- cards -->
          <div class="card">
            <img
              src=${item.avatar}
              class="card-img-top card-avatar" alt="Friend Avatar" 
            <div class="card-body">
              <h5 class="card-title">${item.name + " " + item.surname}</h5>
            </div>
             <div class ="card-footer">
          <button class ="btn btn-primary btn-show-friend" data-toggle="modal" data-target="#friend-modal" data-id=${item.id}>More</button>
          <button class ="btn btn-warning btn-add-favorite" data-id=${item.id}>❤</button>
          </div>
          </div>
        </div>
      </div>
    `;
  });

  dataPanel.innerHTML = rawHTML;
}

function showFriendModal(id) {
  const friendName = document.querySelector("#friend-modal-name");
  const friendEmail = document.querySelector("#friend-modal-email");
  const friendBirthDay = document.querySelector("#friend-modal-birthday");
  const friendAge = document.querySelector("#friend-modal-age");
  const friendGender = document.querySelector("#friend-modal-gender");
  const friendRegion = document.querySelector("#friend-modal-region");

  friendName.innerHTML = ''
  friendEmail.innerHTML = ''
  friendBirthDay.innerHTML = ''
  friendAge.innerHTML = ''
  friendGender.innerHTML = ''
  friendRegion.innerHTML = ''

  axios
    .get(INDEX_URL + id)
    .then((response) => {
      const data = response.data;

      friendName.innerHTML = `${data.name} ${data.surname}`;
      friendEmail.innerHTML = `email: ${data.email}`;
      friendBirthDay.innerHTML = `birthday: ${data.birthday}`;
      friendAge.innerHTM = `$age: ${data.age}`;
      friendGender.innerHTML = `gender: ${data.gender}`;
      friendRegion.innerHTML = `region: ${data.region}`;
    })
    .catch((error) => {
      console.log(error);
    });
}

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteFriends')) || []
  const friend = friendList.find((friend) => friend.id === id)
  if (list.some((friend) => friend.id === id)) {
    return alert('該朋友已在收藏清單中！')
  }
  list.push(friend)
  localStorage.setItem('favoriteFriends', JSON.stringify(list))
}

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches('.btn-show-friend')) {
    showFriendModal(Number(event.target.dataset.id));
  }
  else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
});

searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {

  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase()

  if (!keyword.length) {
    return alert('請輸入關鍵字')
  }
  let filteredFriends = []
  filteredFriends = friendList.filter((user) =>
    user.name.toLowerCase().includes(keyword)
  )

  renderFriendList(filteredFriends)
})