const WebSocket = require('ws');
const http = require('http');
const PORT = process.env.PORT || 3000;

// ============================================================
//  HTML КЛИЕНТ (Твой мессенджер + Встроенный онлайн)
// ============================================================
const HTML_CLIENT = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Мой Мессенджер</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box;user-select:none;-webkit-tap-highlight-color:transparent;}
  html,body{width:100%;height:100%;overflow:hidden;background:#0b0f14;
    font-family:'Segoe UI',Roboto,system-ui,sans-serif;touch-action:none;}
  #app{position:absolute;width:100vw;height:100vh;
    max-width:calc(100vh*(1224/2720));max-height:calc(100vw*(2720/1224));
    aspect-ratio:1224/2720;background:#17212b;overflow:hidden;
    left:50%;top:50%;transform:translate(-50%,-50%);
    box-shadow:0 0 60px rgba(0,0,0,.9);display:flex;flex-direction:column;}
  .hidden{display:none!important;}
  button{font-family:inherit;cursor:pointer;border:none;background:none;color:inherit;}
  input,textarea{font-family:inherit;outline:none;border:none;}

  #login{position:absolute;inset:0;background:linear-gradient(135deg,#17212b,#0e1621);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    padding:8%;z-index:500;color:#fff;text-align:center;}
  #login h1{font-size:clamp(24px,7vw,56px);margin-bottom:4%;color:#4a9eff;}
  #login p{font-size:clamp(13px,3.4vw,24px);color:#a9c9e0;margin-bottom:5%;}
  #login input{width:100%;max-width:420px;padding:1em 1.4em;border-radius:14px;
    background:rgba(255,255,255,.08);color:#fff;font-size:clamp(14px,3.6vw,26px);
    border:2px solid rgba(255,255,255,.15);margin-bottom:16px;text-align:center;}
  #login button{background:linear-gradient(180deg,#4a9eff,#2563eb);color:#fff;
    font-weight:800;font-size:clamp(15px,4vw,30px);padding:.7em 2em;border-radius:999px;
    box-shadow:0 8px 0 #1e40af;}

  #main{flex:1;display:flex;flex-direction:column;min-height:0;}
  .header{background:#17212b;color:#fff;display:flex;align-items:center;gap:12px;
    padding:2.5% 3%;border-bottom:1px solid rgba(255,255,255,.06);flex-shrink:0;}
  .avatar{width:clamp(40px,10vw,80px);height:clamp(40px,10vw,80px);border-radius:50%;
    display:flex;align-items:center;justify-content:center;font-weight:800;
    font-size:clamp(16px,4.5vw,36px);color:#fff;flex-shrink:0;position:relative;}
  .user-info{flex:1;min-width:0;}
  .user-info .name{font-weight:800;font-size:clamp(14px,3.8vw,28px);
    display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
  .user-info .status{font-size:clamp(10px,2.6vw,18px);color:#8fbcd8;}
  .user-info .status.online{color:#4caf50;}
  .premium-badge{background:linear-gradient(135deg,#ffd54f,#ff9800);color:#1a1a1a;
    font-size:clamp(8px,2vw,14px);padding:2px 8px;border-radius:999px;font-weight:900;}
  .verified-badge{color:#4a9eff;font-size:clamp(12px,3vw,24px);}
  .header-actions button{font-size:clamp(20px,5vw,40px);width:clamp(36px,9vw,72px);
    height:clamp(36px,9vw,72px);border-radius:50%;color:#8fbcd8;}

  .search-bar{display:flex;align-items:center;gap:8px;padding:2% 4%;
    background:#17212b;border-bottom:1px solid rgba(255,255,255,.06);flex-shrink:0;}
  .search-bar input{flex:1;background:#0e1621;color:#fff;padding:.7em 1em;
    border-radius:999px;font-size:clamp(12px,3vw,22px);}
  .search-bar button{font-size:clamp(20px,5vw,40px);color:#8fbcd8;
    width:clamp(36px,9vw,72px);height:clamp(36px,9vw,72px);}

  #chatList{flex:1;overflow-y:auto;padding-bottom:80px;}
  .chat-item{display:flex;align-items:center;gap:12px;padding:2.5% 3%;cursor:pointer;
    color:#fff;position:relative;border-bottom:1px solid rgba(255,255,255,.03);}
  .chat-item:hover{background:rgba(255,255,255,.05);}
  .chat-item .chat-content{flex:1;min-width:0;}
  .chat-item .chat-name{font-weight:700;font-size:clamp(13px,3.6vw,26px);
    display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
  .chat-item .chat-preview{font-size:clamp(11px,2.8vw,20px);color:#8fbcd8;
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px;}
  .chat-item .chat-meta{display:flex;flex-direction:column;align-items:flex-end;gap:6px;}
  .chat-item .chat-time{font-size:clamp(9px,2.4vw,16px);color:#6e8aa3;}

  #chatView{position:absolute;inset:0;background:#0e1621;display:flex;
    flex-direction:column;z-index:100;}
  .messages{flex:1;overflow-y:auto;padding:12px 10px 16px;display:flex;
    flex-direction:column;gap:6px;}
  .msg{max-width:80%;padding:8px 12px;border-radius:16px;position:relative;
    font-size:clamp(12px,3.2vw,24px);line-height:1.4;word-wrap:break-word;color:#fff;}
  .msg-in{background:#182533;align-self:flex-start;border-bottom-left-radius:4px;}
  .msg-out{background:#2b5278;align-self:flex-end;border-bottom-right-radius:4px;}
  .msg .msg-time{font-size:clamp(8px,2vw,14px);color:#8fbcd8;margin-left:8px;
    float:right;margin-top:4px;}
  .msg .msg-author{font-weight:800;font-size:clamp(11px,2.8vw,20px);
    color:#4a9eff;margin-bottom:2px;display:flex;align-items:center;gap:4px;}
  
  .composer{display:flex;align-items:flex-end;gap:8px;padding:2% 3%;
    background:#17212b;border-top:1px solid rgba(255,255,255,.06);flex-shrink:0;}
  .composer button{font-size:clamp(22px,5.5vw,44px);width:clamp(38px,9vw,76px);
    height:clamp(38px,9vw,76px);border-radius:50%;color:#8fbcd8;}
  .composer button.send{background:#4a9eff;color:#fff;}
  .composer input{flex:1;background:#0e1621;color:#fff;padding:1em 1.2em;
    border-radius:24px;font-size:clamp(12px,3.2vw,24px);min-width:0;}
    
  /* Стили для онлайн-чата */
  .online-indicator {width:10px;height:10px;border-radius:50%;background:#4caf50;display:inline-block;margin-right:6px;box-shadow:0 0 8px #4caf50;}
  .offline-indicator {width:10px;height:10px;border-radius:50%;background:#666;display:inline-block;margin-right:6px;}
</style>
</head>
<body>
<div id="app">
  <div id="login">
    <h1>💬 Онлайн Мессенджер</h1>
    <p>Введи свой @username</p>
    <input id="nameInput" placeholder="@username" maxlength="20" autocomplete="off">
    <button id="startBtn">НАЧАТЬ</button>
  </div>

  <div id="main" class="hidden">
    <div class="header">
      <div class="avatar" id="myAvatar" style="background:#4a9eff;">U</div>
      <div class="user-info">
        <div class="name" id="myName">Пользователь</div>
        <div class="status online" id="connStatus">Подключение к серверу...</div>
      </div>
      <div class="header-actions">
        <button id="searchBtn">🔍</button>
      </div>
    </div>
    
    <div id="chatList"></div>
  </div>

  <div id="chatView" class="hidden">
    <div class="header">
      <button id="backToChats" style="font-size:clamp(22px,5.5vw,44px);color:#8fbcd8;
        width:clamp(36px,9vw,72px);height:clamp(36px,9vw,72px);border-radius:50%;
        display:flex;align-items:center;justify-content:center;">←</button>
      <div class="avatar" id="chatAvatar" style="background:#4caf50;">?</div>
      <div class="user-info">
        <div class="name" id="chatName">Чат</div>
        <div class="status" id="chatStatus">в сети</div>
      </div>
    </div>
    <div class="messages" id="messages"></div>
    <div class="composer">
      <button id="emojiBtn">😊</button>
      <input id="msgInput" placeholder="Сообщение..." autocomplete="off">
      <button id="sendBtn" class="send">➤</button>
    </div>
  </div>
</div>

<script>
(function(){
  'use strict';

  // ================= СОСТОЯНИЕ =================
  var state = {
    myName: '',
    ws: null,
    onlineUsers: {},
    currentChat: 'global',
    messages: []
  };

  var WS_URL = (location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host;

  // ================= DOM =================
  var $ = function(id){ return document.getElementById(id); };
  var login = $('login'), main = $('main'), chatView = $('chatView');
  var chatList = $('chatList'), messages = $('messages'), msgInput = $('msgInput');

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];
    });
  }

  // ================= WEBSOCKET =================
  function connect() {
    state.ws = new WebSocket(WS_URL);
    
    state.ws.onopen = function() {
      $('connStatus').textContent = 'В сети (онлайн)';
      $('connStatus').className = 'status online';
      state.ws.send(JSON.stringify({ type: 'login', username: state.myName }));
    };

    state.ws.onmessage = function(e) {
      var data = JSON.parse(e.data);
      
      if (data.type === 'login_success') {
        // Успешно вошли
      } 
      else if (data.type === 'users_update') {
        state.onlineUsers = data.users;
        renderChatList();
        if (state.currentChat === 'global') {
          renderMessages();
        }
      }
      else if (data.type === 'message') {
        state.messages.push(data);
        if (state.currentChat === 'global') {
          renderMessages();
        } else {
          // Уведомление (упрощенно)
        }
      }
    };

    state.ws.onclose = function() {
      $('connStatus').textContent = 'Отключено. Переподключение...';
      $('connStatus').className = 'status';
      setTimeout(connect, 3000);
    };
  }

  // ================= РЕНДЕР СПИСКА ЧАТОВ =================
  function renderChatList() {
    chatList.innerHTML = '';

    // 1. Глобальный чат
    var globalItem = document.createElement('div');
    globalItem.className = 'chat-item';
    globalItem.innerHTML = 
      '<div class="avatar" style="background:#4caf50;">🌐</div>' +
      '<div class="chat-content">' +
        '<div class="chat-name">Глобальный чат</div>' +
        '<div class="chat-preview">Общайтесь со всеми, кто в сети</div>' +
      '</div>';
    globalItem.addEventListener('click', function(){ openChat('global'); });
    chatList.appendChild(globalItem);

    // 2. Список онлайн юзеров (кроме себя)
    var users = Object.keys(state.onlineUsers).filter(function(u){ return u !== state.myName; });
    
    if (users.length > 0) {
      var header = document.createElement('div');
      header.style.cssText = 'padding:10px 3%; font-size:12px; color:#8fbcd8; text-transform:uppercase; margin-top:10px;';
      header.textContent = 'Пользователи в сети';
      chatList.appendChild(header);

      users.forEach(function(u) {
        var item = document.createElement('div');
        item.className = 'chat-item';
        item.innerHTML = 
          '<div class="avatar" style="background:#e91e63;">' + u.charAt(0).toUpperCase() + '</div>' +
          '<div class="chat-content">' +
            '<div class="chat-name">@' + u + '</div>' +
            '<div class="chat-preview"><span class="online-indicator"></span>в сети</div>' +
          '</div>';
        item.addEventListener('click', function(){ openChat(u); });
        chatList.appendChild(item);
      });
    }
  }

  // ================= ОТКРЫТИЕ ЧАТА =================
  function openChat(chatId) {
    state.currentChat = chatId;
    main.classList.add('hidden');
    chatView.classList.remove('hidden');

    if (chatId === 'global') {
      $('chatName').textContent = '🌐 Глобальный чат';
      $('chatAvatar').textContent = '🌐';
      $('chatAvatar').style.background = '#4caf50';
      $('chatStatus').textContent = 'Общайтесь со всеми';
    } else {
      $('chatName').textContent = '@' + chatId;
      $('chatAvatar').textContent = chatId.charAt(0).toUpperCase();
      $('chatAvatar').style.background = '#e91e63';
      $('chatStatus').textContent = 'Личные сообщения (в разработке)';
    }

    renderMessages();
    msgInput.value = '';
    msgInput.focus();
  }

  // ================= РЕНДЕР СООБЩЕНИЙ =================
  function renderMessages() {
    messages.innerHTML = '';
    
    state.messages.forEach(function(m) {
      // Фильтрация для личных чатов (упрощенно)
      if (state.currentChat !== 'global') {
        var isFromMeToThem = (m.from === state.myName && m.to === state.currentChat);
        var isFromThemToMe = (m.from === state.currentChat && m.to === state.myName);
        if (!isFromMeToThem && !isFromThemToMe) return;
      }

      var isMe = m.from === state.myName;
      var div = document.createElement('div');
      div.className = 'msg ' + (isMe ? 'msg-out' : 'msg-in');
      
      var authorHtml = '';
      if (!isMe) {
        authorHtml = '<div class="msg-author">' + escapeHtml(m.from) + '</div>';
      }

      div.innerHTML = authorHtml + escapeHtml(m.text) + 
        '<span class="msg-time">' + m.time + '</span>';
      messages.appendChild(div);
    });

    setTimeout(function(){ messages.scrollTop = messages.scrollHeight; }, 30);
  }

  // ================= ОТПРАВКА =================
  function sendMessage() {
    var text = msgInput.value.trim();
    if (!text || !state.ws || state.ws.readyState !== WebSocket.OPEN) return;

    var payload = {
      type: 'message',
      to: state.currentChat === 'global' ? 'all' : state.currentChat,
      text: text
    };

    state.ws.send(JSON.stringify(payload));
    
    // В глобальном чате сообщение придет через WebSocket от сервера
    // В личных чатах тоже (сервер перешлет)
    msgInput.value = '';
  }

  // ================= СОБЫТИЯ =================
  $('startBtn').addEventListener('click', function() {
    var name = $('nameInput').value.trim().replace(/^@/, '').toLowerCase();
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(name)) {
      alert('Только латиница, цифры, _ (3-20 символов)');
      return;
    }
    state.myName = name;
    login.classList.add('hidden');
    main.classList.remove('hidden');
    $('myName').textContent = '@' + name;
    $('myAvatar').textContent = name.charAt(0).toUpperCase();
    connect();
  });

  $('sendBtn').addEventListener('click', sendMessage);
  msgInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); sendMessage(); }
  });

  $('backToChats').addEventListener('click', function() {
    chatView.classList.add('hidden');
    main.classList.remove('hidden');
    state.currentChat = null;
    renderChatList();
  });

})();
</script>
</body>
</html>`;

// ============================================================
//  СЕРВЕР (WebSocket логика)
// ============================================================
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(HTML_CLIENT);
});

const wss = new WebSocket.Server({ server });
const users = new Map(); // username -> { ws }

// Рассылка всем, кто в сети
function broadcast(data, excludeUser = null) {
  const msg = JSON.stringify(data);
  users.forEach((user, username) => {
    if (username !== excludeUser && user.ws.readyState === WebSocket.OPEN) {
      user.ws.send(msg);
    }
  });
}

function sendUsersList() {
  const list = {};
  users.forEach((u, name) => { list[name] = true; });
  const msg = JSON.stringify({ type: 'users_update', users: list });
  users.forEach((u) => {
    if (u.ws.readyState === WebSocket.OPEN) u.ws.send(msg);
  });
}

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
          if (old.ws.readyState === WebSocket.OPEN) old.ws.close();
        }

        currentUser = username;
        users.set(username, { ws });
        
        ws.send(JSON.stringify({ type: 'login_success', username }));
        sendUsersList(); // Обновить список у всех
        console.log(`+ ${username} вошел`);
      }

      else if (data.type === 'message' && currentUser) {
        const d = new Date();
        const timeStr = ('0'+d.getHours()).slice(-2) + ':' + ('0'+d.getMinutes()).slice(-2);
        
        const msgPayload = {
          type: 'message',
          from: currentUser,
          to: data.to, // 'all' или конкретный юзер
          text: data.text,
          time: timeStr
        };

        if (data.to === 'all') {
          // Глобальный чат — отправляем всем, включая себя
          broadcast(msgPayload);
        } else {
          // Личное сообщение — отправляем получателю и себе (для отображения)
          const targetUser = users.get(data.to);
          if (targetUser && targetUser.ws.readyState === WebSocket.OPEN) {
            targetUser.ws.send(JSON.stringify(msgPayload));
          }
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(msgPayload));
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  });

  ws.on('close', () => {
    if (currentUser) {
      users.delete(currentUser);
      sendUsersList();
      console.log(`- ${currentUser} вышел`);
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
