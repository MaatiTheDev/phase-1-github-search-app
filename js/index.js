document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('search-form');
    const input = document.getElementById('search-input');
    const resultsContainer = document.getElementById('results');
    const reposContainer = document.getElementById('repos');
    const toggleButton = document.getElementById('toggle-search');

    let searchType = 'user'; 

    toggleButton.addEventListener('click', () => {
        searchType = searchType === 'user' ? 'repo' : 'user';
        input.placeholder = searchType === 'user' ? 'Search for users...' : 'Search for repositories...';
        resultsContainer.innerHTML = '';
        reposContainer.innerHTML = '';
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const query = input.value.trim();
        if (query) {
            if (searchType === 'user') {
                searchUsers(query);
            } else {
                searchRepos(query);
            }
        }
    });

    function searchUsers(query) {
        fetch(`https://api.github.com/search/users?q=${query}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        })
        .then(response => response.json())
        .then(data => displayUsers(data.items))
        .catch(error => console.error('Error:', error));
    }

    function searchRepos(query) {
        fetch(`https://api.github.com/search/repositories?q=${query}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        })
        .then(response => response.json())
        .then(data => displayRepos(data.items))
        .catch(error => console.error('Error:', error));
    }

    function displayUsers(users) {
        resultsContainer.innerHTML = '';
        reposContainer.innerHTML = '';

        users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.classList.add('user');
            userElement.innerHTML = `
                <img src="${user.avatar_url}" alt="${user.login}" width="50" height="50">
                <p><strong>${user.login}</strong></p>
                <a href="${user.html_url}" target="_blank">View Profile</a>
            `;
            userElement.addEventListener('click', () => {
                fetchUserRepos(user.login);
            });
            resultsContainer.appendChild(userElement);
        });
    }

    function fetchUserRepos(username) {
        fetch(`https://api.github.com/users/${username}/repos`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        })
        .then(response => response.json())
        .then(data => displayRepos(data))
        .catch(error => console.error('Error:', error));
    }

    function displayRepos(repos) {
        reposContainer.innerHTML = '';
        repos.forEach(repo => {
            const repoElement = document.createElement('div');
            repoElement.classList.add('repo');
            repoElement.innerHTML = `
                <p><strong>${repo.name}</strong></p>
                <p>${repo.description}</p>
                <a href="${repo.html_url}" target="_blank">View Repository</a>
            `;
            reposContainer.appendChild(repoElement);
        });
    }
});
