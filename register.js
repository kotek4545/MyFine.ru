let users = JSON.parse(localStorage.getItem('users')) || { "nullkotek": { "pass": "garte454", "role": "admin" } };
let chats = JSON.parse(localStorage.getItem('chats')) || {};

function show(id, btn) {
    document.querySelectorAll('.block').forEach(e => e.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(e => e.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if(btn) btn.classList.add('active');
}

function login() {
    let l = document.getElementById('log').value;
    let p = document.getElementById('pas').value;
    if(l.length < 5 || p.length < 8) return alert("Логин: мин 5, Пароль: мин 8");
    if(!users[l]) users[l] = {pass: p, role: 'player'};
    if(users[l].pass === p) {
        localStorage.setItem('currentUser', l);
        location.reload();
    } else alert("Ошибка пароля!");
}

function logout() { localStorage.removeItem('currentUser'); location.reload(); }

function send() {
    let cur = localStorage.getItem('currentUser');
    if(!cur) return alert("Войдите!");
    if(!chats[cur]) chats[cur] = [];
    chats[cur].push({ sender: cur, text: document.getElementById('new-msg').value });
    localStorage.setItem('chats', JSON.stringify(chats));
    document.getElementById('new-msg').value = "";
    render();
}

function viewChat(u) {
    window.selectedPlayer = u;
    document.getElementById('admin-chat-view').innerHTML = (chats[u] || []).map(m => `<div><b>${m.sender}:</b> ${m.text}</div>`).join('');
}

function sendReply() {
    if(!window.selectedPlayer) return;
    if(!chats[window.selectedPlayer]) chats[window.selectedPlayer] = [];
    chats[window.selectedPlayer].push({ sender: "nullkotek", text: document.getElementById('admin-reply').value });
    localStorage.setItem('chats', JSON.stringify(chats));
    document.getElementById('admin-reply').value = "";
    viewChat(window.selectedPlayer);
}

function render() {
    let cur = localStorage.getItem('currentUser');
    if(cur && chats[cur]) document.getElementById('chat-box').innerHTML = chats[cur].map(m => `<div><b>${m.sender}:</b> ${m.text}</div>`).join('');
    if(cur === "nullkotek") {
        document.getElementById('admin-btn').style.display = 'block';
        document.getElementById('player-list').innerHTML = Object.keys(chats).map(u => `<div class="user-item" onclick="viewChat('${u}')">${u}</div>`).join('');
    }
    if(cur) {
        document.getElementById('auth-box').style.display = 'none';
        document.getElementById('user-box').style.display = 'block';
        document.getElementById('user-text').innerText = "Вы вошли как: " + cur;
    }
}

// Автообновление каждые 2 секунды
setInterval(render, 2000);
render();