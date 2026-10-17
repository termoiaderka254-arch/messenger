const WebSocket = require('ws');
const http = require('http');
const PORT = process.env.PORT || 3000;

const HTML_CLIENT = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Онлайн Мессенджер</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box;user-select:none;}
  html,body{width:100%;height:100%;overflow:hidden;background:#0b0f14;
    font-family:'Segoe UI',Roboto,sans-serif;touch-action:none;}
  #app{position:absolute;width:100vw;height:100vh;
    max-width:calc(100vh*(1224/2720));max-height:calc(100vw*(2720/1224));
    aspect-ratio:1224/2720;background:#17212b;overflow:hidden;
    left:50%;top:50%;transform:translate(-50%,-50%);
    box-shadow:0 0 60px rgba(0,0,0,.9);display:flex;flex-direction:column;color:#fff;}
  #login{position:absolute;inset:0;background:linear-gradient(135deg,#17212b,#0e1621);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    padding:8%;z-index:500;text-align:center;}
  #login h1{font-size:clamp(24px,7vw,56px);margin-bottom:6%;color:#4a9eff;}
  #login input{width:100%;max-width:420px;padding:1em 1.4em;border-radius:14px;
    background:rgba(255,255,255,.08);color:#fff;font-size:clamp(14px,3.6vw,26px);
    border:2px solid rgba(255,255,255,.15);margin-bottom:16px;text-align:center;outline:none;}
  #login button{background:linear-gradient(180deg,#4a9eff,#2563eb);color:#fff;
    font-weight:800;font-size:clamp(15px,4vw,30px);padding:.7em 2em;border-radius:999px;
    box-shadow:0 8px 0 #1e40af;border:none;cursor:pointer;}
  #main{flex:1;display:flex;flex-direction:column;min-height:0;}
  .header{background:#17212b;display:flex;align-items:center;gap:12px;
    padding:2.5% 3%;border-bottom:1px solid rgba(255,255,255,.06);}
  .header h2{font-size:clamp(16px,4.5vw,34px);flex:1;}
  .header button{font-size:clamp(20px,5vw,40px);background:none;border:none;color:#8fbcd8;}
  #statusBar{padding:1.5% 3%;background:#0e1621;font-size:clamp(11px,2.8vw,20px);color:#8fbcd8;}
  #statusBar .online{color:#4caf50;font-weight:700;}
  #chatArea{flex:1;display:flex;flex-direction:column;min-height:0;}
  #messages{flex:1;overflow-y:auto;padding:12px 10px;display:flex;flex-direction:column;gap:6px;}
  .msg{max-width:78%;padding:8px 12px;border-radius:16px;font-size:clamp(12px,3.2vw,24px);
    line-height:1.4;word-wrap:break-word;}
  .msg-in{background:#182533;align-self:flex-start;border-bottom-left-radius:4px;}
  .msg-out{background:#2b5278;align-self:flex-end;border-bottom-right-radius:4px;}
  .msg .time{font-size:clamp(8px,2vw,14px);color:#8fbcd8;margin-left:8px;float:right;margin-top:4px;}
  .composer{display:flex;align-items:center;gap:8px;padding:2% 3%;
    background:#17212b;border-top:1px solid rgba(255,255,255,.06);}
  .composer input{flex:1;background:#0e1621;color:#fff;padding:1em 1.2em;border-radius:24px;
    font-size:clamp(12px,3.2vw,24px);border:none;outline:none;}
  .composer button{background:#4a9eff;color:#fff;border:none;font-size:clamp(20px,5vw,40px);
    width:clamp(40px,10vw,80px);height:clamp(40px,10vw,80px);border-radius:50%;}
  #friendsList{padding:2% 3%;background:#0e1621;border-top:1px solid rgba(255,255,255,.06);}
  #friendsList h3{font-size:clamp(12px,3vw,22px);color:#8fbcd8;margin-bottom:8px;}
  .friend-item{display:flex;align-items:center;gap:8px;padding:4px 0;
    font-size:clamp(12px,3vw,22px);cursor:pointer;}
  .friend-item .dot{width:10px;height:10px;border-radius:50%;background:#666;}
  .friend-item .dot.online{background:#4caf50;}
  .hidden{display:none!important;}
</style>
</head>
<body>
<div id="app">
  <div id="login">
    <h1>💬 Онлайн Мессенджер</h1>
    <p style="color:#8fbcd8;margin-bottom:20px;font-size:clamp(12px,3vw,20px);">Введи свой @username</p>
    <input id="usernameInput" placeholder="@username" maxlength="20" autocomplete="off">
    <button id="loginBtn">ВОЙТИ</button>
    <div id="loginError" style="color:#ff5252;margin-top:12px;font-size:clamp(11px,2.8vw,18px);"></div>
  </div>
  <div id="main" class="hidden">
    <div class="header">
      <h2 id="myUsername">@user</h2>
      <button id="logoutBtn">🚪</button>
    </div>
    <div id="statusBar">Статус: <span id="connStatus" class="online">Подключение...</span></div>
    <div id="chatArea">
      <div id="messages"></div>
      <div class="composer">
        <input id="msgInput" placeholder="Сообщение для @друга..." autocomplete="off">
        <button id="sendBtn">➤</button>
      </div>
    </div>
    <div id="friendsList">
      <h3>👥 Добавить друга (введи @username)</h3>
      <div style="display:flex;gap:8px;margin-bottom:8px;">
        <input id="friendInput" placeholder="@username" style="flex:1;padding:0.7em;border-radius:10px;background:#17212b;color:#fff;border:1px solid rgba(255,255,255,.1);font-size:clamp(12px,3vw,22px);">
        <button id="addFriendBtn" style="background:#4a9eff;color:#fff;border:none;padding:0.7em 1.2em;border-radius:10px;font-weight:700;">Добавить</button>
      </div>
      <div id="friends"></div>
    </div>
  </div>
</div>
<script>
(function(){
  var login = document.getElementById('login');
  var main = document.getElementById('main');
  var loginBtn = document.getElementById('loginBtn');
  var usernameInput = document.getElementById('usernameInput');
  var loginError = document.getElementById('loginError');
  var myUsernameEl = document.getElementById('myUsername');
  var connStatus = document.getElementById('connStatus');
  var messagesEl = document.getElementById('messages');
  var msgInput = document.getElementById('msgInput');
  var sendBtn = document.getElementById('sendBtn');
  var friendInput = document.getElementById('friendInput');
  var addFriendBtn = document.getElementById('addFriendBtn');
  var friendsEl = document.getElementById('friends');
  var logoutBtn = document.getElementById('logoutBtn');
  var ws = null;
  var myUsername = '';
  var friends = {};
  var WS_URL = (location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host;
  function connect(username){
    myUsername = username.toLowerCase().trim();
    ws = new WebSocket(WS_URL);
    ws.onopen = function(){
      connStatus.textContent = 'Подключено';
      connStatus.className = 'online';
      ws.send(JSON.stringify({ type: 'login', username: myUsername }));
    };
    ws.onmessage = function(event){
      var data = JSON.parse(event.data);
      if (data.type === 'login_success') {
        login.classList.add('hidden');
        main.classList.remove('hidden');
        myUsernameEl.textContent = '@' + myUsername;
        messagesEl.innerHTML = '';
      } else if (data.type === 'user_online') {
        friends[data.username] = { online: true };
        renderFriends();
      } else if (data.type === 'user_offline') {
        if (friends[data.username]) friends[data.username].online = false;
        renderFriends();
      } else if (data.type === 'message') {
        addMessage(data.text, false, data.from);
      } else if (data.type === 'message_sent') {
        addMessage(data.text, true, data.to);
      } else if (data.type === 'status_result') {
        friends[data.target] = { online: data.online };
        renderFriends();
      } else if (data.type === 'error') {
        alert(data.message);
      }
    };
    ws.onclose = function(){
      connStatus.textContent = 'Отключено';
      connStatus.className = '';
      setTimeout(connect.bind(null, myUsername), 3000);
    };
    ws.onerror = function(){ connStatus.textContent = 'Ошибка подключения'; };
  }
  function addMessage(text, isMe, from){
    var div = document.createElement('div');
    div.className = 'msg ' + (isMe ? 'msg-out' : 'msg-in');
    div.innerHTML = (isMe ? '' : '<div style="font-weight:700;color:#4a9eff;margin-bottom:2px;">@' + from + '</div>') +
      text + '<span class="time">' + new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) + '</span>';
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }
  function renderFriends(){
    friendsEl.innerHTML = '';
    var keys = Object.keys(friends);
    if (keys.length === 0) {
      friendsEl.innerHTML = '<div style="color:#666;font-size:clamp(11px,2.8vw,18px);">Пока никого нет.</div>';
      return;
    }
    keys.forEach(function(u){
      var div = document.createElement('div');
      div.className = 'friend-item';
      div.innerHTML = '<span class="dot' + (friends[u].online ? ' online' : '') + '"></span>' +
        '@' + u + ' <span style="color:#8fbcd8;font-size:.85em;">' + (friends[u].online ? 'в сети' : 'не в сети') + '</span>';
      div.addEventListener('click', function(){
        msgInput.value = '@' + u + ' ';
        msgInput.focus();
      });
      friendsEl.appendChild(div);
    });
  }
  loginBtn.addEventListener('click', function(){
    var name = usernameInput.value.trim().replace(/^@/, '');
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(name)) {
      loginError.textContent = 'Латиница, цифры, _ (3-20 символов)';
      return;
    }
    loginError.textContent = '';
    connect(name);
  });
  usernameInput.addEventListener('keydown', function(e){ if (e.key === 'Enter') loginBtn.click(); });
  sendBtn.addEventListener('click', function(){
    var text = msgInput.value.trim();
    if (!text) return;
    var match = text.match(/^@([a-zA-Z0-9_]{3,20})\\s+(.+)/);
    if (match && ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'message', to: match[1], text: match[2] }));
      msgInput.value = '';
    } else {
      alert('Напиши в формате: @username текст');
    }
  });
  msgInput.addEventListener('keydown', function(e){ if (e.key === 'Enter') sendBtn.click(); });
  addFriendBtn.addEventListener('click', function(){
    var u = friendInput.value.trim().replace(/^@/, '');
    if (!u) return;
    friends[u] = { online: false };
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'check_status', target: u }));
    }
    friendInput.value = '';
    renderFriends();
  });
  logoutBtn.addEventListener('click', function(){ if (ws) ws.close(); location.reload(); });
  renderFriends();
})();
</script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(HTML_CLIENT);
});

const wss = new WebSocket.Server({ server });
const users = new Map();

wss.on('connection', (ws) => {
  let currentUser = null;
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'login') {
        const username = data.username.toLowerCase().trim();
        if (!username) return;
        if (users.has(username)) {
          const old = users.get(username);
          if (old.ws.readyState === WebSocket.OPEN) {
            old.ws.send(JSON.stringify({ type: 'error', message: 'Вы вошли с другого устройства' }));
            old.ws.close();
          }
        }
        currentUser = username;
        users.set(username, { ws, online: true });
        ws.send(JSON.stringify({ type: 'login_success', username }));
        broadcast({ type: 'user_online', username });
        return;
      }
      if (data.type === 'message' && currentUser) {
        const target = data.to.toLowerCase().trim();
        const targetUser = users.get(target);
        if (targetUser && targetUser.ws.readyState === WebSocket.OPEN) {
          targetUser.ws.send(JSON.stringify({
            type: 'message', from: currentUser, text: data.text, time: Date.now()
          }));
          ws.send(JSON.stringify({ type: 'message_sent', to: target, text: data.text, time: Date.now() }));
        } else {
          ws.send(JSON.stringify({ type: 'error', message: `Пользователь @${target} не в сети` }));
        }
        return;
      }
      if (data.type === 'check_status' && currentUser) {
        const target = data.target.toLowerCase().trim();
        ws.send(JSON.stringify({ type: 'status_result', target, online: users.has(target) }));
        return;
      }
    } catch (e) {}
  });
  ws.on('close', () => {
    if (currentUser) {
      users.delete(currentUser);
      broadcast({ type: 'user_offline', username: currentUser });
    }
  });
});

function broadcast(data) {
  const msg = JSON.stringify(data);
  users.forEach((user) => {
    if (user.ws.readyState === WebSocket.OPEN) user.ws.send(msg);
  });
}

server.listen(PORT, () => console.log(`Сервер на порту ${PORT}`));
