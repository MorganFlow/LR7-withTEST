document.addEventListener('DOMContentLoaded', async () => {

    let token = localStorage.getItem('token') || null;
    let username = null;
    let currentUserId = null;
    
    if (token) {
        try {
            console.log('Пытаемся auto-login с token:', token.substring(0, 10) + '...');

            const profileResponse = await fetch('/api/profile/', {
                headers: { 'Authorization': `Token ${token}` }
            });
            if (profileResponse.ok) {
                const profileData = await profileResponse.json();
                currentUserId = profileData.user.id;
                username = profileData.user.username;

                document.getElementById('loginBtn').style.display = 'none';
                document.getElementById('registerBtn').style.display = 'none';
                const profileBtn = document.createElement('button');
                profileBtn.id = 'profileBtn';
                profileBtn.className = 'btn btn-secondary';
                profileBtn.textContent = username;
                profileBtn.addEventListener('click', () => showProfileModal(profileData));
                document.getElementById('controls').appendChild(profileBtn);

                saveBtn.disabled = false;
                loadBtn.disabled = false;
                startBtn.disabled = false;
                friendsBtn.disabled = false;
                console.log('Auto-login успешен, UI обновлён');
            } else {
                console.error('Invalid token, очищаем');
                localStorage.removeItem('token');
                token = null;
            }
        } catch (error) {
            console.error('Ошибка auto-login:', error);
            localStorage.removeItem('token');
            token = null;
        }
    }

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('startBtn');
    const difficultySelect = document.getElementById('difficulty');
    const scoreEl = document.getElementById('score');
    const timerEl = document.getElementById('timer');
    const saveBtn = document.getElementById('saveBtn');
    const loadBtn = document.getElementById('loadBtn');
    const loginBtn = document.getElementById('loginBtn');
    const leaderboardBtn = document.getElementById('leaderboardBtn');
    const friendsBtn = document.getElementById('friendsBtn');

    // Адаптивный размер Canvas
    function resizeCanvas() {
        if (window.innerWidth <= 768) {
            canvas.width = window.innerWidth - 20;
            canvas.height = window.innerHeight / 2;
        } else {
            canvas.width = 800;
            canvas.height = 600;
        }
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let ballX, ballY, ballDX, ballDY, paddleX, paddleWidth, paddleHeight = 10;
    let bricks = [], brickRowCount, brickColumnCount = 5, brickWidth, brickHeight = 20, brickPadding = 10;
    let score = 0, time = 0, timerInterval, gameRunning = false;


    // Параметры по сложности
    function setDifficulty(level) {
        switch (level) {
            case 'easy':
                ballDX = 2; ballDY = -2;
                paddleWidth = 150;
                brickRowCount = 3;
                break;
            case 'medium':
                ballDX = 3; ballDY = -3;
                paddleWidth = 100;
                brickRowCount = 5;
                break;
            case 'hard':
                ballDX = 4; ballDY = -4;
                paddleWidth = 75;
                brickRowCount = 7;
                break;
        }
        brickWidth = (canvas.width / brickColumnCount) - brickPadding - (brickPadding / brickColumnCount);
    }

    // Инициализация кирпичей
    function initBricks() {
        bricks = [];
        for (let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }
    }

    // Рисование
    function drawBall() {
        ctx.beginPath();
        ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = '#0d6efd';
        ctx.fill();
        ctx.closePath();
    }

    function drawBricks() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status === 1) {
                    const brickX = (c * (brickWidth + brickPadding)) + brickPadding;
                    const brickY = (r * (brickHeight + brickPadding)) + brickPadding;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = '#dc3545';
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    // Коллизии и движение
    function collisionDetection() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                const b = bricks[c][r];
                if (b.status === 1) {
                    if (ballX > b.x && ballX < b.x + brickWidth && ballY > b.y && ballY < b.y + brickHeight) {
                        ballDY = -ballDY;
                        b.status = 0;  // Исчезновение
                        score += 10;
                        scoreEl.textContent = score;
                    }
                }
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        collisionDetection();

        // Движение шара
        ballX += ballDX;
        ballY += ballDY;

        if (ballX + 10 > canvas.width || ballX - 10 < 0) ballDX = -ballDX;
        if (ballY - 10 < 0) ballDY = -ballDY;
        if (ballY + 10 > canvas.height) {  // Проигрыш
            alert('Игра окончена! Очков: ' + score);
            resetGame();
        }

        // Коллизия с пластиной
        if (ballY + 10 > canvas.height - paddleHeight && ballX > paddleX && ballX < paddleX + paddleWidth) {
            ballDY = -ballDY;
        }

        // Победа
        if (score === brickRowCount * brickColumnCount * 10) {
            alert('Ты выиграл! Очков: ' + score);
            resetGame();
        }
    }

    // События
    document.addEventListener('mousemove', (e) => {
        const relativeX = e.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth / 2;
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') paddleX -= 20;
        if (e.key === 'ArrowRight') paddleX += 20;
        if (paddleX < 0) paddleX = 0;
        if (paddleX + paddleWidth > canvas.width) paddleX = canvas.width - paddleWidth;
    });

    // Таймер
    function startTimer() {
        timerInterval = setInterval(() => {
            time++;
            const min = Math.floor(time / 60).toString().padStart(2, '0');
            const sec = (time % 60).toString().padStart(2, '0');
            timerEl.textContent = `${min}:${sec}`;
        }, 1000);
    }

    // Старт игры
    function startGame() {
        if (!token) { alert('Необходимо авторизоваться для игры!'); return; }
        setDifficulty(difficultySelect.value);
        initBricks();
        ballX = canvas.width / 2;
        ballY = canvas.height - 30;
        paddleX = (canvas.width - paddleWidth) / 2;
        score = 0;
        time = 0;
        scoreEl.textContent = 0;
        timerEl.textContent = '00:00';
        gameRunning = true;
        saveBtn.disabled = false;
        loadBtn.disabled = false;
        startTimer();
        requestAnimationFrame(gameLoop);
    }

    leaderboardBtn.addEventListener('click', async () => {
        const response = await fetch('/api/leaderboard/');
        const data = await response.json();
        // Создаём модал с таблицей
        const modalHtml = `
            <div class="modal fade" id="leaderboardModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content bg-dark text-light">
                        <div class="modal-header">
                            <h5 class="modal-title">Таблица лидеров</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <select id="leaderDifficulty" class="form-select mb-3">
                                <option value="">Все сложности</option>
                                <option value="easy">Лёгая</option>
                                <option value="medium">Средняя</option>
                                <option value="hard">Сложная</option>
                            </select>
                            <button id="filterLeaderboard">Отфильтровать</button>
                            <table class="table table-dark">
                                <thead><tr><th>Пользователь</th><th>Очков</th><th>Попытка</th><th>Дата</th></tr></thead>
                                <tbody id="leaderTableBody">
                                    ${data.map(entry => `<tr><td>${entry.user.username}</td><td>${entry.score}</td><td>${entry.rank}</td><td>${entry.date_achieved}</td></tr>`).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
        const modalElement = document.createElement('div');
        modalElement.innerHTML = modalHtml;
        document.body.appendChild(modalElement);
        const modal = new bootstrap.Modal(document.getElementById('leaderboardModal'));
        modal.show();

        document.getElementById('filterLeaderboard').addEventListener('click', async () => {
            const diff = document.getElementById('leaderDifficulty').value;
            const url = diff ? `/api/leaderboard/?difficulty=${diff}` : '/api/leaderboard/';
            const response = await fetch(url, { headers: { 'Authorization': `Token ${token}` } });
            const newData = await response.json();
            const tableBody = document.getElementById('leaderTableBody');
            tableBody.innerHTML = newData.map(entry => `<tr><td>${entry.user.username}</td><td>${entry.score}</td><td>${entry.rank}</td><td>${entry.date_achieved}</td></tr>`).join('');
        });
    });

    friendsBtn.addEventListener('click', async () => {
        if (!token) return alert('Сначала войдите в аккаунт!');
        const response = await fetch('/api/friends/', { headers: { 'Authorization': `Token ${token}` } });
        const friends = await response.json();
        console.log('Data from /api/friends/:', friends);

        const acceptedFriends = friends.filter(f => f.accepted);
        const requests = friends.filter(f => !f.accepted && f.to_user.id === currentUserId);

        // <button class="viewProgressBtn" data-friend-id="${f.to_user.id || f.to_user}">View Progress</button>
        let friendsList = acceptedFriends.map(f => {
            const otherUser = f.from_user.id === currentUserId ? f.to_user : f.from_user;
            return `
                <li>${otherUser.username} 

                </li>`;
        }).join('');
        let requestsList = requests.map(r => {
            const otherUser = r.from_user.id === currentUserId ? r.to_user : r.from_user;
            return `
                <li>${otherUser.username} 
                    <button class="acceptFriendBtn" data-request-id="${r.id}">Принять</button>
                </li>`;
        }).join('');

        const modalHtml = `
            <div class="modal fade" id="friendsModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content bg-dark text-light">
                        <div class="modal-header">
                            <h5 class="modal-title">Друзья</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <h6>Друзья</h6>
                            <ul class="friends-list">${friendsList}</ul>
                            <h6>Запросы</h6>
                            <ul class="requests-list">${requestsList}</ul>
                            <input id="addFriendInput" placeholder="Имя пользователя" />
                            <button id="addFriendBtn">Добавить друга</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        const modalElement = document.createElement('div');
        modalElement.innerHTML = modalHtml;
        document.body.appendChild(modalElement);
        const modal = new bootstrap.Modal(document.getElementById('friendsModal'));
        modal.show();

        document.getElementById('addFriendBtn').addEventListener('click', addFriend);
        
        const acceptBtns = document.querySelectorAll('.acceptFriendBtn');
        acceptBtns.forEach(btn => {
            btn.addEventListener('click', async () => {
                const requestId = btn.dataset.requestId;
                await fetch(`/api/friends/${requestId}/accept/`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
                    body: JSON.stringify({ accepted: true })
                });
                alert('Друг принят!');

                // Обнови data
                const newResponse = await fetch('/api/friends/', { headers: { 'Authorization': `Token ${token}` } });
                const newFriends = await newResponse.json();
                // Обнови списки
                const acceptedFriends = newFriends.filter(f => f.accepted);
                const requests = newFriends.filter(f => !f.accepted && f.to_user.id === currentUserId);
                // Перерисуй UL
                document.querySelector('.modal-body ul:nth-of-type(1)').innerHTML = acceptedFriends.map(f => `<li>${f.to_user.username}</li>`).join('');
                document.querySelector('.modal-body ul:nth-of-type(2)').innerHTML = requests.map(r => `<li>${r.from_user.username} <button class="acceptFriendBtn" data-request-id="${r.id}">Принять</button></li>`).join('');
                // Перепривяжи слушатели на новые acceptBtns
                const newAcceptBtns = document.querySelectorAll('.acceptFriendBtn');
                newAcceptBtns.forEach(btn => {
                    btn.addEventListener('click', async () => {
                        const requestId = btn.dataset.requestId;
                        await fetch(`/api/friends/${requestId}/accept/`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
                            body: JSON.stringify({ accepted: true })
                        });
                        alert('Друг принят!');
                    });
                });
            });
        });
        
        const viewBtns = document.querySelectorAll('.viewProgressBtn');
        viewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const friendId = btn.dataset.friendId;
                viewProgress(friendId);
            });
        });
    });

    async function addFriend() {
        const usernameToAdd = document.getElementById('addFriendInput').value;
        const searchResponse = await fetch(`/api/users/search/?query=${usernameToAdd}`, { headers: { 'Authorization': `Token ${token}` } });
        const users = await searchResponse.json();
        if (users.length === 0) return alert('Пользователь не найден');
        const userId = users[0].id;
        if (!userId) return alert('Пользователь не найден');
        await fetch('/api/friends/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
            body: JSON.stringify({ to_user: userId })
        });
        alert('Запрос в друзья отправлен!');
    }

    async function viewProgress(friendId) {
        const response = await fetch(`/api/friends/${friendId}/progress/`, { headers: { 'Authorization': `Token ${token}` } });
        const progress = await response.json();
        // Покажи в новом модале (аналогично leaderboard)
        const progressHtml = progress.map(p => `<tr><td>${p.score}</td><td>${p.rank}</td><td>${p.date_achieved}</td></tr>`).join('');
        const modalHtml = `
            <div class="modal fade" id="progressModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content bg-dark text-light">
                        <div class="modal-header">
                            <h5 class="modal-title">Friend Progress</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <table class="table table-dark">
                                <thead><tr><th>Score</th><th>Rank</th><th>Date</th></tr></thead>
                                <tbody>${progressHtml}</tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
        const modalElement = document.createElement('div');
        modalElement.innerHTML = modalHtml;
        document.body.appendChild(modalElement);
        const modal = new bootstrap.Modal(document.getElementById('progressModal'));
        modal.show();
    }


    function gameLoop() {
        if (gameRunning) {
            draw();
            requestAnimationFrame(gameLoop);
        }
    }

    async function resetGame() {
        gameRunning = false;
        clearInterval(timerInterval);
        saveBtn.disabled = true;
        loadBtn.disabled = true;

        if (token) {
            const state = { ballX, ballY, ballDX, ballDY, paddleX, bricks: bricks.flat().filter(b => b.status === 1).length };
            try {
                await fetch('/api/sessions/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
                    body: JSON.stringify({ game_state: state, score, level: brickRowCount, time_played: time, is_completed: true, difficulty: difficultySelect.value })
                });
                console.log('Сессия сохранена автоматически после проигрыша');
            } catch (error) {
                console.error('Ошибка авто-сохранения:', error);
            }
            try {
                await fetch('/api/leaderboard/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
                    body: JSON.stringify({ score, difficulty: difficultySelect.value })
                });
            } catch (error) {
                console.error('Ошибка отправки на лидерборд:', error);
            }
        }
    }

    startBtn.addEventListener('click', startGame);

    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const loginModalEl = document.getElementById('loginModal');
    const loginModal = new bootstrap.Modal(loginModalEl);

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const usernameInput = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        loginError.textContent = '';

        try {
            const response = await fetch('/api/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: usernameInput, password })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Ошибка авторизации!');
            }
            const data = await response.json();
            token = data.token;
            localStorage.setItem('token', token);
            console.log('Логин успешен, token сохранён');

            const profileResponse = await fetch('/api/profile/', {
                headers: { 'Authorization': `Token ${token}` }
            });
            if (!profileResponse.ok) throw new Error('Профиль не создан!');
            const profileData = await profileResponse.json();
            currentUserId = profileData.user.id;
            username = profileData.user.username;

            document.getElementById('loginBtn').style.display = 'none';
            document.getElementById('registerBtn').style.display = 'none';
            logoutBtn.style.display = 'inline-block'
            const profileBtn = document.createElement('button');
            profileBtn.id = 'profileBtn';
            profileBtn.className = 'btn btn-secondary';
            profileBtn.textContent = username;
            profileBtn.onclick = () => {
                console.log('Клик на кнопку профиля');
                showProfileModal(profileData)();
            };  // Используй onclick для теста
            document.getElementById('controls').appendChild(profileBtn);
            console.log('Кнопка профиля добавлена в DOM');  // Дебаг

            saveBtn.disabled = false;
            loadBtn.disabled = false;
            startBtn.disabled = false;
            friendsBtn.disabled = false;

            loginModal.hide();
            alert('Добро пожаловать, ' + username);
        } catch (error) {
            loginError.textContent = error.message;
        }
    });

    const profileModal = new bootstrap.Modal(document.createElement('div'));
    function showProfileModal(profile) {
        return () => {
            console.log('Открываем профиль для:', profile);  // Дебаг

            // Удаляем старый модал
            const oldModal = document.getElementById('profileModal');
            if (oldModal) oldModal.remove();

            const modalHtml = `
                <div class="modal fade" id="profileModal" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content bg-dark text-light">
                            <div class="modal-header">
                                <h5 class="modal-title">Профиль: ${profile.user.username}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <form id="editProfileForm">
                                    <img id="avatarPreview" src="${profile.avatar || '/static/default-avatar.png'}" alt="Avatar" class="img-fluid mb-3">
                                    <input type="file" id="avatarUpload" accept="image/*" class="mb-2">
                                    <button type="button" id="deleteAvatar" class="btn btn-danger mb-3">Удалить аватар</button>
                                    <div class="mb-3">
                                        <label for="bio" class="form-label">О себе</label>
                                        <textarea class="form-control" id="bio">${profile.bio || ''}</textarea>
                                    </div>
                                    <div class="mb-3">
                                        <label for="dob" class="form-label">Дата рождения</label>
                                        <input type="date" class="form-control" id="dob" value="${profile.date_of_birth || ''}">
                                    </div>
                                    <button type="submit" class="btn btn-primary">Сохранить</button>
                                    <button type="button" id="cancelEdit" class="btn btn-secondary">Отменить</button>
                                </form>
                                <button id="achievementsBtn" class="btn btn-info mt-3">Достижения</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            const modalElement = document.createElement('div');
            modalElement.innerHTML = modalHtml;
            document.body.appendChild(modalElement);

            const modal = new bootstrap.Modal(document.getElementById('profileModal'));
            modal.show();

            // Обработчики для редактирования
            const form = document.getElementById('editProfileForm');
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData();
                formData.append('bio', document.getElementById('bio').value);
                formData.append('date_of_birth', document.getElementById('dob').value);
                const file = document.getElementById('avatarUpload').files[0];
                if (file) formData.append('avatar', file);

                const response = await fetch('/api/profile/', {
                    method: 'PUT',
                    headers: { 'Authorization': `Token ${token}` },
                    body: formData
                });
                if (response.ok) {
                    alert('Профиль обновлён!');
                    // Refetch profile и обнови модал
                    const newProfileResponse = await fetch('/api/profile/', {
                        headers: { 'Authorization': `Token ${token}` }
                    });
                    const newProfile = await newProfileResponse.json();
                    // Обнови поля в модале
                    document.getElementById('bio').value = newProfile.bio || '';
                    document.getElementById('dob').value = newProfile.date_of_birth || '';
                    document.getElementById('avatarPreview').src = newProfile.avatar || '/static/default-avatar.png';
                } else {
                    alert('Ошибка сохранения!');
                }
            });

            document.getElementById('cancelEdit').addEventListener('click', () => {
                modal.hide();  // Просто закрой без сохранения
            });

            document.getElementById('deleteAvatar').addEventListener('click', async () => {
                const response = await fetch('/api/profile/', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
                    body: JSON.stringify({ avatar: null })
                });
                if (response.ok) {
                    document.getElementById('avatarPreview').src = '/static/default-avatar.png';
                    alert('Аватар удалён!');
                } else {
                    alert('Ошибка удаления!');
                }
            });

            // Кнопка достижений
            document.getElementById('achievementsBtn').addEventListener('click', async () => {
                const response = await fetch('/api/achievements/', { headers: { 'Authorization': `Token ${token}` } });
                const achievements = await response.json();
                const achHtml = achievements.map(a => `<li>${a.name}: ${a.description} (достигнуто: ${a.achieved_at})</li>`).join('');
                const achModalHtml = `
                    <div class="modal fade" id="achModal" tabindex="-1">
                        <div class="modal-dialog">
                            <div class="modal-content bg-dark text-light">
                                <div class="modal-header">
                                    <h5 class="modal-title">Достижения</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                </div>
                                <div class="modal-body">
                                    <ul>${achHtml || '<p>Нет достижений</p>'}</ul>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                const achElement = document.createElement('div');
                achElement.innerHTML = achModalHtml;
                document.body.appendChild(achElement);
                const achModal = new bootstrap.Modal(document.getElementById('achModal'));
                achModal.show();
                achElement.addEventListener('hidden.bs.modal', () => achElement.remove());
            });

            // Cleanup
            modalElement.addEventListener('hidden.bs.modal', () => modalElement.remove());
        };
    }


    const registerForm = document.getElementById('registerForm');
    const registerError = document.getElementById('registerError');
    const registerModalEl = document.getElementById('registerModal');
    const registerModal = new bootstrap.Modal(registerModalEl);

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const usernameInput = document.getElementById('regUsername').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        registerError.textContent = '';

        try {
            const regResponse = await fetch('/api/register/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: usernameInput, email, password }) 
            });
            console.log('Response status:', regResponse.status);
            console.log('Response headers:', regResponse.headers.get('Content-Type'));

            if (!regResponse.ok) {
                const text = await regResponse.text();
                console.log('Raw response:', text);
                let errorData;
                try {
                    errorData = JSON.parse(text);
                } catch {
                    throw new Error('Сервер вернул не-JSON ответ: ' + text.slice(0, 100));
                }
                let errorMsg = 'Регистрация не удалась';
                if (errorData.detail) errorMsg = errorData.detail;  // Для общих ошибок
                if (errorData.username) errorMsg = errorData.username[0];
                else if (errorData.email) errorMsg = errorData.email[0];
                else if (errorData.non_field_errors) errorMsg = errorData.non_field_errors[0];
                throw new Error(errorMsg);
            }

            const loginResponse = await fetch('/api/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: usernameInput, password })
            });
            if (!loginResponse.ok) {
                throw new Error('Ошибка автоматического входа в аккаунт.');
            }
            const data = await loginResponse.json();
            token = data.token;
            localStorage.setItem('token', token);
            console.log('Логин успешен, token сохранён');

            const profileResponse = await fetch('/api/profile/', {
                headers: { 'Authorization': `Token ${token}` }
            });
            if (!profileResponse.ok) {
                throw new Error('Ошибка загрузки профиля.');
            }
            const profileData = await profileResponse.json();
            username = profileData.user.username;

            document.getElementById('loginBtn').style.display = 'none';
            document.getElementById('registerBtn').style.display = 'none';
            logoutBtn.style.display = 'inline-block'
            const profileBtn = document.createElement('button');
            profileBtn.id = 'profileBtn';
            profileBtn.className = 'btn btn-secondary';
            profileBtn.textContent = username;
            profileBtn.onclick = () => {
                console.log('Клик на кнопку профиля');
                showProfileModal(profileData)();
            };
            document.getElementById('controls').appendChild(profileBtn);
            console.log('Кнопка профиля добавлена в DOM');

            saveBtn.disabled = false;
            loadBtn.disabled = false;
            startBtn.disabled = false;
            friendsBtn.disabled = false;
            registerModal.hide();
            alert('Вы зарегистрированы и вошли как ' + username + '!');
        } catch (error) {
            registerError.textContent = error.message;
            console.error('Ошибка регистрации:', error);
        }
    });

    saveBtn.addEventListener('click', async () => {
        if (!token) return alert('Сначала войдите в аккаунт!');
        const state = { ballX, ballY, ballDX, ballDY, paddleX, bricks: bricks.flat().filter(b => b.status === 1).length };
        const response = await fetch('/api/sessions/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
            body: JSON.stringify({ game_state: state, score, level: brickRowCount, time_played: time, is_completed: false, difficulty: difficultySelect.value })
        });
        if (!response.ok) {
            const error = await response.json();
            console.error('Ошибка сохранения:', error);
            alert('Ошибка сохранения: ' + (error.detail || 'Неизвестная'));
            return;
        }
        alert('Сохранено!');
    });

    loadBtn.addEventListener('click', async () => {
        if (!token) return alert('Сначала войдите в аккаунт!');
        const response = await fetch('/api/sessions/', { headers: { 'Authorization': `Token ${token}` } });
        const sessions = await response.json();
        if (sessions.length) {
            const last = sessions[sessions.length - 1];
            score = last.score;
            time = last.time_played;  // В секундах
            setDifficulty(last.difficulty);
            initBricks();  // TODO: Восстановить bricks из state
            alert('Загружено!');
            startGame();  // Перезапуск с loaded данными
        }
    });

    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        token = null;
        // Reset UI
        location.reload();
    });
});