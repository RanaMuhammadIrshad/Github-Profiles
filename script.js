const API_URL = 'https://api.github.com/users/';
const form = document.getElementById('form');
const search = document.getElementById('search');
const main = document.getElementById('main');

async function getUser(userName) {
  try {
    const { data } = await axios(API_URL + userName);
    createUserCart(data);
    getRepos(userName);
  } catch (err) {
    createErrorCard('Problem fetching repos');
  }
}

async function getRepos(userName) {
  try {
    const { data } = await axios(API_URL + userName + '/repos?sort=created');
    addReposToCart(data);
  } catch (err) {
    if (err.response.status === 404) {
      createErrorCard('No profile with this username');
    }
  }
}

function createUserCart(user) {
  const html = `
  <div class="card">
  <img
    src="${user.avatar_url}"
    alt="${user.name}"
    class="avatar"
  />
  <div class="user-info">
    <h2>${user.name}</h2>
    <p>${user.bio}</p>
    <ul>
      <li>${user.followers} <strong>Followers</strong></li>
      <li>${user.following} <strong>Following</strong></li>
      <li>${user.public_repos} <strong>Repos</strong></li>
    </ul>
    <div id="repos"></div>
  </div>
</div>

  `;

  main.innerHTML = html;
}

function createErrorCard(msg) {
  const html = `
  <div class = "card">
  <h1>${msg}</h1>
  </div>
  `;

  main.innerHTML = html;
}

function addReposToCart(repos) {
  const reposEl = document.getElementById('repos');
  repos.slice(0, 10).forEach((repo) => {
    const repoLink = document.createElement('a');
    repoLink.classList.add('repo');

    repoLink.href = repo.html_url;
    repoLink.target = '_blank';
    repoLink.innerText = repo.name;

    reposEl.appendChild(repoLink);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const user = search.value;
  console.log(typeof user, user);
  if (user) {
    getUser(user);
    search.value = '';
  }
});
