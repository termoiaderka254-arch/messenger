<!DOCTYPE html>
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
  #app.light{background:#f0f2f5;}
  #app.light .header{background:#fff;color:#000;}
  #app.light .chat-item{color:#000;}
  #app.light .composer{background:#fff;}
  #app.light .composer input{background:#f0f2f5;color:#000;}

  .hidden{display:none!important;}
  button{font-family:inherit;cursor:pointer;border:none;background:none;color:inherit;}
  input,textarea{font-family:inherit;outline:none;border:none;}

  #login{position:absolute;inset:0;background:linear-gradient(135deg,#17212b,#0e1621);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    padding:8%;z-index:500;color:#fff;text-align:center;}
  #login .logo{font-size:clamp(60px,18vw,160px);margin-bottom:6%;}
  #login h1{font-size:clamp(24px,7vw,56px);margin-bottom:4%;
    background:linear-gradient(135deg,#6eb5e0,#4a9eff);-webkit-background-clip:text;
    background-clip:text;-webkit-text-fill-color:transparent;}
  #login p{font-size:clamp(13px,3.4vw,24px);color:#a9c9e0;margin-bottom:5%;line-height:1.5;}
  #login input{width:100%;max-width:420px;padding:1em 1.4em;border-radius:14px;
    background:rgba(255,255,255,.08);color:#fff;font-size:clamp(14px,3.6vw,26px);
    border:2px solid rgba(255,255,255,.15);margin-bottom:16px;text-align:center;}
  #login input:focus{border-color:#4a9eff;}
  #login button{background:linear-gradient(180deg,#4a9eff,#2563eb);color:#fff;
    font-weight:800;font-size:clamp(15px,4vw,30px);padding:.7em 2em;border-radius:999px;
    box-shadow:0 8px 0 #1e40af;letter-spacing:1px;}
  #login button:active{transform:translateY(6px);box-shadow:0 2px 0 #1e40af;}

  #main{flex:1;display:flex;flex-direction:column;min-height:0;}
  .header{background:#17212b;color:#fff;display:flex;align-items:center;gap:12px;
    padding:2.5% 3%;border-bottom:1px solid rgba(255,255,255,.06);flex-shrink:0;}
  .avatar{width:clamp(40px,10vw,80px);height:clamp(40px,10vw,80px);border-radius:50%;
    display:flex;align-items:center;justify-content:center;font-weight:800;
    font-size:clamp(16px,4.5vw,36px);color:#fff;flex-shrink:0;position:relative;}
  .user-info{flex:1;min-width:0;}
  .user-info .name{font-weight:800;font-size:clamp(14px,3.8vw,28px);
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
  .user-info .status{font-size:clamp(10px,2.6vw,18px);color:#8fbcd8;
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .user-info .status.online{color:#4caf50;}
  .user-info .status.typing{color:#4a9eff;font-style:italic;}
  .premium-badge{background:linear-gradient(135deg,#ffd54f,#ff9800);color:#1a1a1a;
    font-size:clamp(8px,2vw,14px);padding:2px 8px;border-radius:999px;font-weight:900;
    display:inline-flex;align-items:center;gap:3px;}
  .verified-badge{color:#4a9eff;font-size:clamp(12px,3vw,24px);}
  .owner-badge{background:linear-gradient(135deg,#ffd54f,#ff5252);color:#fff;
    font-size:clamp(8px,2vw,14px);padding:2px 8px;border-radius:999px;font-weight:900;}
  .co-owner-badge{background:linear-gradient(135deg,#4a9eff,#7c4dff);color:#fff;
    font-size:clamp(8px,2vw,14px);padding:2px 8px;border-radius:999px;font-weight:900;}
  .header-actions{display:flex;gap:8px;flex-shrink:0;}
  .header-actions button{font-size:clamp(20px,5vw,40px);width:clamp(36px,9vw,72px);
    height:clamp(36px,9vw,72px);border-radius:50%;display:flex;align-items:center;
    justify-content:center;color:#8fbcd8;transition:background .15s,color .15s;}
  .header-actions button:hover{background:rgba(255,255,255,.08);color:#fff;}

  .search-bar{display:flex;align-items:center;gap:8px;padding:2% 4%;
    background:#17212b;border-bottom:1px solid rgba(255,255,255,.06);flex-shrink:0;}
  .search-bar input{flex:1;background:#0e1621;color:#fff;padding:.7em 1em;
    border-radius:999px;font-size:clamp(12px,3vw,22px);}
  .search-bar button{font-size:clamp(20px,5vw,40px);color:#8fbcd8;width:clamp(36px,9vw,72px);
    height:clamp(36px,9vw,72px);border-radius:50%;display:flex;align-items:center;
    justify-content:center;}

  #chatList{flex:1;overflow-y:auto;padding-bottom:80px;}
  .chat-item{display:flex;align-items:center;gap:12px;padding:2.5% 3%;cursor:pointer;
    transition:background .15s;color:#fff;position:relative;}
  .chat-item:hover{background:rgba(255,255,255,.05);}
  .chat-item .chat-content{flex:1;min-width:0;}
  .chat-item .chat-name{font-weight:700;font-size:clamp(13px,3.6vw,26px);
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
  .chat-item .chat-preview{font-size:clamp(11px,2.8vw,20px);color:#8fbcd8;
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px;}
  .chat-item .chat-meta{display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0;}
  .chat-item .chat-time{font-size:clamp(9px,2.4vw,16px);color:#6e8aa3;}
  .unread-badge{background:#4a9eff;color:#fff;font-size:clamp(9px,2.4vw,16px);
    font-weight:800;min-width:clamp(18px,4.5vw,34px);height:clamp(18px,4.5vw,34px);
    border-radius:999px;display:flex;align-items:center;justify-content:center;padding:0 6px;}

  #chatView{position:absolute;inset:0;background:#0e1621;display:flex;
    flex-direction:column;z-index:100;}
  .messages{flex:1;overflow-y:auto;padding:12px 10px 16px;display:flex;
    flex-direction:column;gap:6px;}
  .msg{max-width:80%;padding:8px 12px;border-radius:16px;position:relative;
    font-size:clamp(12px,3.2vw,24px);line-height:1.4;word-wrap:break-word;
    animation:msgIn .15s ease-out;color:#fff;}
  @keyframes msgIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
  .msg-in{background:#182533;align-self:flex-start;border-bottom-left-radius:4px;}
  .msg-out{background:#2b5278;align-self:flex-end;border-bottom-right-radius:4px;}
  .msg .msg-time{font-size:clamp(8px,2vw,14px);color:#8fbcd8;margin-left:8px;
    float:right;margin-top:4px;white-space:nowrap;}
  .msg .ticks{color:#4fc3f7;font-size:clamp(9px,2.2vw,16px);margin-left:2px;}
  .msg .ticks.read{color:#4a9eff;}
  .msg .msg-author{font-weight:800;font-size:clamp(11px,2.8vw,20px);
    color:#4a9eff;margin-bottom:2px;display:flex;align-items:center;gap:4px;flex-wrap:wrap;}
  .msg .gift-inline{font-size:clamp(28px,8vw,64px);text-align:center;padding:8px 0;}
  .msg .system-note{color:#ffd54f;font-style:italic;font-size:clamp(10px,2.6vw,18px);line-height:1.5;}
  .msg .cmd-note{color:#4fc3f7;font-family:'Courier New',monospace;
    font-size:clamp(10px,2.6vw,18px);line-height:1.6;background:rgba(74,158,255,.1);
    padding:6px 8px;border-radius:8px;border-left:3px solid #4a9eff;}

  .composer{display:flex;align-items:flex-end;gap:8px;padding:2% 3%;
    background:#17212b;border-top:1px solid rgba(255,255,255,.06);flex-shrink:0;}
  .composer button{font-size:clamp(22px,5.5vw,44px);width:clamp(38px,9vw,76px);
    height:clamp(38px,9vw,76px);border-radius:50%;display:flex;align-items:center;
    justify-content:center;color:#8fbcd8;flex-shrink:0;}
  .composer button.send{background:#4a9eff;color:#fff;}
  .composer input{flex:1;background:#0e1621;color:#fff;padding:1em 1.2em;
    border-radius:24px;font-size:clamp(12px,3.2vw,24px);min-width:0;}

  #profileView{position:absolute;inset:0;background:#17212b;color:#fff;
    display:flex;flex-direction:column;z-index:150;overflow-y:auto;}
  .panel-header{display:flex;align-items:center;gap:12px;padding:3% 4%;
    border-bottom:1px solid rgba(255,255,255,.08);flex-shrink:0;}
  .panel-header h2{font-size:clamp(16px,4.5vw,34px);flex:1;}
  .panel-header button{font-size:clamp(22px,5.5vw,44px);width:clamp(36px,9vw,72px);
    height:clamp(36px,9vw,72px);border-radius:50%;display:flex;align-items:center;
    justify-content:center;color:#8fbcd8;}
  .profile-hero{padding:6% 4%;text-align:center;
    background:linear-gradient(135deg,#1e3a5f,#17212b);}
  .profile-hero .big-avatar{width:clamp(100px,26vw,200px);height:clamp(100px,26vw,200px);
    border-radius:50%;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;
    font-size:clamp(44px,12vw,96px);font-weight:800;color:#fff;
    box-shadow:0 8px 30px rgba(0,0,0,.6);position:relative;}
  .profile-hero .big-avatar .verify-overlay{
    position:absolute;bottom:6%;right:6%;background:#4a9eff;color:#fff;
    width:26%;height:26%;border-radius:50%;display:flex;align-items:center;
    justify-content:center;font-size:clamp(18px,4.5vw,40px);border:4px solid #1e3a5f;
    box-shadow:0 0 25px #4a9eff;font-weight:900;}
  .profile-hero .big-avatar .prem-overlay{
    position:absolute;top:6%;right:6%;background:linear-gradient(135deg,#ffd54f,#ff9800);
    color:#1a1a1a;width:24%;height:24%;border-radius:50%;display:flex;
    align-items:center;justify-content:center;font-size:clamp(14px,3.5vw,30px);
    border:3px solid #1e3a5f;box-shadow:0 0 20px #ffd54f;font-weight:900;}
  .profile-hero h2{font-size:clamp(20px,5.5vw,44px);margin-bottom:4px;
    display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;}
  .profile-hero .username{color:#8fbcd8;font-size:clamp(13px,3.4vw,26px);margin-bottom:8px;}
  .profile-hero .bio{color:#a9c9e0;font-size:clamp(12px,3vw,22px);max-width:500px;
    margin:0 auto;line-height:1.4;}
  .profile-section{background:rgba(255,255,255,.04);border-radius:16px;
    margin:3% 4%;padding:3% 4%;}
  .profile-section h3{font-size:clamp(12px,3vw,22px);color:#8fbcd8;margin-bottom:12px;
    text-transform:uppercase;letter-spacing:1px;}
  .profile-row{display:flex;justify-content:space-between;align-items:center;
    padding:8px 0;font-size:clamp(12px,3.2vw,24px);border-bottom:1px solid rgba(255,255,255,.06);}
  .profile-row:last-child{border-bottom:none;}
  .profile-row .label{color:#8fbcd8;}
  .profile-row .value{font-weight:700;}

  .gifts-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:8px;}
  .gift-card{background:rgba(255,255,255,.06);border-radius:14px;padding:12px 6px;
    text-align:center;cursor:pointer;transition:transform .15s,background .15s;}
  .gift-card:hover{background:rgba(255,255,255,.12);transform:scale(1.05);}
  .gift-card .gift-emoji{font-size:clamp(28px,7vw,56px);display:block;margin-bottom:4px;}
  .gift-card .gift-name{font-size:clamp(9px,2.2vw,14px);color:#a9c9e0;}
  .gift-card .gift-price{font-size:clamp(9px,2.2vw,14px);color:#ffd54f;font-weight:700;margin-top:2px;}

  #adminPanel{position:absolute;inset:0;background:#17212b;color:#fff;
    display:flex;flex-direction:column;z-index:170;overflow-y:auto;}
  .admin-section{margin:3% 4%;background:rgba(255,255,255,.04);
    border-radius:16px;padding:3% 4%;}
  .admin-section h3{font-size:clamp(12px,3vw,22px);color:#8fbcd8;margin-bottom:12px;
    text-transform:uppercase;letter-spacing:1px;}
  .admin-user-row{display:flex;align-items:center;gap:10px;padding:10px 0;
    border-bottom:1px solid rgba(255,255,255,.06);font-size:clamp(11px,2.8vw,20px);flex-wrap:wrap;}
  .admin-user-row:last-child{border-bottom:none;}
  .admin-user-row .au-avatar{width:clamp(32px,8vw,64px);height:clamp(32px,8vw,64px);
    border-radius:50%;display:flex;align-items:center;justify-content:center;
    font-weight:800;font-size:clamp(14px,3.6vw,28px);flex-shrink:0;}
  .admin-user-row .au-info{flex:1;min-width:0;}
  .admin-user-row .au-name{font-weight:700;display:flex;align-items:center;
    gap:4px;flex-wrap:wrap;font-size:clamp(12px,3vw,22px);}
  .admin-user-row .au-role{font-size:clamp(9px,2.4vw,16px);color:#8fbcd8;}
  .admin-actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px;width:100%;}
  .admin-btn{background:rgba(74,158,255,.2);border:1px solid #4a9eff;color:#8fc9ff;
    padding:5px 10px;border-radius:8px;font-size:clamp(9px,2.4vw,16px);
    font-weight:700;cursor:pointer;}
  .admin-btn.danger{background:rgba(229,57,53,.2);border-color:#e53935;color:#ff8a80;}
  .admin-btn.gold{background:rgba(255,213,79,.2);border-color:#ffd54f;color:#ffd54f;}

  #casinoView{position:absolute;inset:0;background:#0d0a1a;color:#fff;
    display:flex;flex-direction:column;z-index:160;overflow-y:auto;}
  .casino-hero{padding:6% 4% 3%;text-align:center;
    background:linear-gradient(135deg,#2a1a4a,#0d0a1a);}
  .casino-hero h1{font-size:clamp(22px,6vw,52px);margin-bottom:8px;
    background:linear-gradient(135deg,#ffd54f,#ff9800);-webkit-background-clip:text;
    background-clip:text;-webkit-text-fill-color:transparent;}
  .casino-balance{font-size:clamp(20px,5.5vw,44px);font-weight:900;color:#7dff7d;
    margin:12px 0;text-shadow:0 0 20px #4caf5088;word-break:break-all;}
  .casino-balance small{font-size:.5em;color:#8fbcd8;display:block;font-weight:600;}

  .roulette-container{margin:3% auto;width:92%;max-width:600px;
    background:rgba(255,255,255,.04);border-radius:20px;padding:4%;border:2px solid #2a1a4a;}
  .roulette-wheel{width:100%;aspect-ratio:1;max-width:400px;margin:0 auto 16px;
    border-radius:50%;position:relative;background:conic-gradient(
      #e53935 0deg 30deg, #1a1a1a 30deg 60deg, #e53935 60deg 90deg, #1a1a1a 90deg 120deg,
      #e53935 120deg 150deg, #1a1a1a 150deg 180deg, #e53935 180deg 210deg, #1a1a1a 210deg 240deg,
      #e53935 240deg 270deg, #1a1a1a 270deg 300deg, #e53935 300deg 330deg, #1a1a1a 330deg 360deg);
    border:6px solid #ffd54f;box-shadow:0 0 40px #ffd54f88, inset 0 0 20px #000;
    transition:transform 4s cubic-bezier(.15,.9,.3,1);}
  .roulette-wheel::after{content:'★';position:absolute;top:50%;left:50%;
    transform:translate(-50%,-50%);font-size:clamp(40px,10vw,80px);color:#ffd54f;
    text-shadow:0 0 20px #ffd54f;background:#0d0a1a;width:30%;height:30%;
    border-radius:50%;display:flex;align-items:center;justify-content:center;
    border:3px solid #ffd54f;}
  .roulette-wheel .pointer{position:absolute;top:-20px;left:50%;
    transform:translateX(-50%);font-size:clamp(30px,8vw,60px);
    filter:drop-shadow(0 4px 8px #000);z-index:2;}

  .bet-row{display:flex;gap:8px;margin:12px 0;flex-wrap:wrap;justify-content:center;}
  .bet-btn{background:rgba(255,255,255,.08);border:2px solid rgba(255,255,255,.15);
    color:#fff;padding:.6em 1.2em;border-radius:12px;font-weight:700;
    font-size:clamp(12px,3vw,22px);cursor:pointer;transition:all .15s;}
  .bet-btn.active{background:rgba(255,213,79,.3);border-color:#ffd54f;color:#ffd54f;}

  .spin-btn{width:100%;padding:1em;border-radius:16px;font-weight:900;
    font-size:clamp(16px,4.5vw,32px);background:linear-gradient(180deg,#ffd54f,#f57c00);
    color:#1a1a1a;border:none;cursor:pointer;box-shadow:0 8px 0 #7f4700;
    letter-spacing:1px;margin-top:12px;}
  .spin-btn:disabled{opacity:.5;cursor:not-allowed;}

  .casino-result{margin:16px 0;padding:16px;border-radius:14px;text-align:center;
    font-size:clamp(16px,4vw,32px);font-weight:900;min-height:60px;
    display:flex;align-items:center;justify-content:center;word-break:break-all;}
  .casino-result.win{background:rgba(76,175,80,.2);color:#7dff7d;border:2px solid #4caf50;}
  .casino-result.lose{background:rgba(244,67,54,.2);color:#ff5252;border:2px solid #e53935;}
  .casino-result.jackpot{background:rgba(255,213,79,.25);color:#ffd54f;
    border:2px solid #ffd54f;animation:pulse 0.5s infinite alternate;}
  @keyframes pulse{from{box-shadow:0 0 20px #ffd54f;}to{box-shadow:0 0 60px #ffd54f;}}

  .casino-history{margin:3% auto;width:92%;max-width:600px;}
  .casino-history h3{font-size:clamp(12px,3vw,22px);color:#8fbcd8;margin-bottom:10px;
    text-transform:uppercase;letter-spacing:1px;}
  .history-item{display:flex;justify-content:space-between;padding:8px 0;
    border-bottom:1px solid rgba(255,255,255,.06);font-size:clamp(11px,2.8vw,20px);gap:10px;}
  .history-item .h-win{color:#7dff7d;font-weight:700;}
  .history-item .h-lose{color:#ff5252;font-weight:700;}

  .casino-shop{margin:3% auto;width:92%;max-width:600px;
    background:rgba(255,255,255,.04);border-radius:16px;padding:4%;}
  .casino-shop h3{font-size:clamp(14px,3.6vw,28px);color:#ffd54f;margin-bottom:12px;}
  .shop-row{display:flex;justify-content:space-between;align-items:center;
    padding:10px 0;border-bottom:1px solid rgba(255,255,255,.06);
    font-size:clamp(12px,3vw,22px);gap:10px;}
  .shop-buy{background:#4caf50;color:#fff;border:none;padding:.5em 1em;
    border-radius:10px;font-weight:700;cursor:pointer;
    font-size:clamp(11px,2.6vw,18px);white-space:nowrap;}
  .shop-buy:disabled{background:#555;opacity:.5;cursor:not-allowed;}

  .bottom-nav{display:flex;background:#17212b;border-top:1px solid rgba(255,255,255,.06);
    flex-shrink:0;}
  .bottom-nav button{flex:1;display:flex;flex-direction:column;align-items:center;
    gap:2px;padding:1.5% 0;color:#6e8aa3;font-size:clamp(9px,2.2vw,16px);}
  .bottom-nav button .nav-icon{font-size:clamp(20px,5vw,40px);}
  .bottom-nav button.active{color:#4a9eff;}

  #giftsView{position:absolute;inset:0;background:#17212b;color:#fff;
    display:flex;flex-direction:column;z-index:150;overflow-y:auto;}
  .panel-body{padding:3% 4%;flex:1;overflow-y:auto;}

  .confirm-dialog{position:absolute;inset:0;background:rgba(0,0,0,.75);
    display:flex;align-items:center;justify-content:center;z-index:400;padding:8%;}
  .confirm-box{background:#1e2c3a;border-radius:20px;padding:24px;max-width:500px;
    width:100%;text-align:center;color:#fff;border:1px solid rgba(255,255,255,.15);}
  .confirm-box p{font-size:clamp(13px,3.4vw,26px);margin-bottom:20px;line-height:1.4;}
  .confirm-box .btn-row{display:flex;gap:10px;}
  .confirm-box button{flex:1;padding:.8em;border-radius:12px;
    font-size:clamp(13px,3.2vw,24px);font-weight:700;}
  .confirm-box .btn-cancel{background:rgba(255,255,255,.1);color:#fff;}
  .confirm-box .btn-ok{background:#e53935;color:#fff;}

  .toast{position:absolute;bottom:14%;left:50%;transform:translateX(-50%) translateY(20px);
    background:rgba(0,0,0,.85);color:#fff;padding:.8em 1.6em;border-radius:12px;
    font-size:clamp(12px,3vw,22px);font-weight:600;z-index:500;opacity:0;
    transition:opacity .3s,transform .3s;pointer-events:none;white-space:nowrap;
    border:1px solid rgba(255,255,255,.15);max-width:92%;text-align:center;}
  .toast.show{opacity:1;transform:translateX(-50%) translateY(0);}

  .secret-group{background:linear-gradient(90deg,rgba(255,213,79,.15),rgba(255,82,82,.15));
    border:2px solid #ffd54f;}
  .secret-group .chat-name{color:#ffd54f;}
  .casino-item{background:linear-gradient(90deg,rgba(255,213,79,.15),rgba(255,152,0,.15));
    border:2px solid #ffd54f;}
  .casino-item .chat-name{color:#ffd54f;}
  .fav-item{background:linear-gradient(90deg,rgba(74,158,255,.1),rgba(124,77,255,.1));
    border:2px solid #4a9eff;}

  .create-group-btn{
    display:flex;align-items:center;gap:10px;padding:3%;
    background:rgba(74,158,255,.12);margin:2% 3%;border-radius:14px;
    border:2px dashed #4a9eff;cursor:pointer;color:#8fc9ff;font-weight:700;
    font-size:clamp(12px,3vw,22px);}

  /* Печатает... */
  .typing-indicator{display:flex;align-items:center;gap:4px;color:#8fbcd8;
    font-size:clamp(10px,2.6vw,18px);font-style:italic;padding:4px 12px;}
  .typing-indicator .dot{width:6px;height:6px;background:#4a9eff;border-radius:50%;
    animation:typingBounce 1.2s infinite;}
  .typing-indicator .dot:nth-child(2){animation-delay:.2s;}
  .typing-indicator .dot:nth-child(3){animation-delay:.4s;}
  @keyframes typingBounce{0%,60%,100%{transform:translateY(0);opacity:.5;}
    30%{transform:translateY(-6px);opacity:1;}}
</style>
</head>
<body>
<div id="app">
  <div id="login">
    <div class="logo">💬</div>
    <h1>Мой Мессенджер</h1>
    <p>Введи имя, чтобы начать</p>
    <input id="nameInput" placeholder="Твоё имя" maxlength="30" autocomplete="off">
    <input id="userInput" placeholder="@username (необязательно)" maxlength="20" autocomplete="off">
    <button id="startBtn">НАЧАТЬ</button>
  </div>

  <div id="main" class="hidden">
    <div class="header">
      <div class="avatar" id="myAvatar" style="background:#4a9eff;">U</div>
      <div class="user-info">
        <div class="name" id="myName">Пользователь</div>
        <div class="status online">в сети</div>
      </div>
      <div class="header-actions">
        <button id="searchBtn">🔍</button>
        <button id="settingsBtn">⚙️</button>
      </div>
    </div>

    <div class="search-bar hidden" id="searchBar">
      <input id="searchInput" placeholder="Поиск чатов или группы..." autocomplete="off">
      <button id="closeSearch">✕</button>
    </div>

    <div id="chatList"></div>

    <div class="bottom-nav">
      <button class="active" data-tab="chats"><span class="nav-icon">💬</span>Чаты</button>
      <button data-tab="profile"><span class="nav-icon">👤</span>Профиль</button>
      <button data-tab="gifts"><span class="nav-icon">🎁</span>Подарки</button>
    </div>
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
      <div class="header-actions">
        <button id="chatAdminBtn" class="hidden" title="Админ-панель">👑</button>
        <button id="chatMoreBtn">⋮</button>
      </div>
    </div>
    <div class="messages" id="messages"></div>
    <div class="composer">
      <button id="emojiBtn">😊</button>
      <input id="msgInput" placeholder="Сообщение или /команда..." autocomplete="off">
      <button id="sendBtn" class="send">➤</button>
    </div>
  </div>

  <div id="profileView" class="hidden">
    <div class="panel-header">
      <button id="backFromProfile">←</button>
      <h2>Профиль</h2>
    </div>
    <div class="profile-hero">
      <div class="big-avatar" id="profileAvatar" style="background:#4a9eff;">
        U
        <div class="verify-overlay hidden" id="profileVerifyOverlay">✓</div>
        <div class="prem-overlay hidden" id="profilePremOverlay">⭐</div>
      </div>
      <h2 id="profileName">Пользователь</h2>
      <div class="username" id="profileUsername">@username</div>
      <div class="bio" id="profileBio">Люблю игры</div>
    </div>
    <div class="profile-section">
      <h3>Статусы</h3>
      <div class="profile-row">
        <span class="label">✓ Верификация</span>
        <span class="value" id="profileVerifiedStatus" style="color:#ff5252;">Нет</span>
      </div>
      <div class="profile-row">
        <span class="label">⭐ Премиум</span>
        <span class="value" id="premiumStatus" style="color:#ff5252;">Нет</span>
      </div>
      <div class="profile-row">
        <span class="label">💰 Баланс</span>
        <span class="value" id="profileBalance">1000💰</span>
      </div>
    </div>
    <div class="profile-section">
      <h3>Юзернейм</h3>
      <div style="display:flex;gap:8px;">
        <input id="usernameField" placeholder="@username" maxlength="20"
          style="flex:1;background:#0e1621;color:#fff;padding:.7em 1em;
          border-radius:10px;font-size:clamp(12px,3vw,22px);
          border:1px solid rgba(255,255,255,.1);">
        <button id="saveUsername" style="background:#4a9eff;color:#fff;
          font-weight:700;padding:.7em 1.4em;border-radius:10px;
          font-size:clamp(11px,2.8vw,20px);">OK</button>
      </div>
    </div>
    <div class="profile-section">
      <h3>Премиум и галочка</h3>
      <button id="buyPremium" style="width:100%;
        background:linear-gradient(180deg,#ffd54f,#f57c00);color:#1a1a1a;
        font-weight:900;padding:.8em;border-radius:14px;
        font-size:clamp(13px,3.4vw,26px);box-shadow:0 6px 0 #7f4700;margin-bottom:8px;">
        ⭐ КУПИТЬ ПРЕМИУМ (5000💰)
      </button>
      <button id="buyVerify" style="width:100%;
        background:linear-gradient(180deg,#4a9eff,#2563eb);color:#fff;
        font-weight:900;padding:.8em;border-radius:14px;
        font-size:clamp(13px,3.4vw,26px);box-shadow:0 6px 0 #1e40af;">
        ✓ КУПИТЬ ГАЛОЧКУ (3000💰)
      </button>
    </div>
    <div class="profile-section">
      <h3>Мои подарки</h3>
      <div id="myGiftsList" style="color:#8fbcd8;font-size:clamp(11px,2.8vw,20px);">
        Пока нет подарков.
      </div>
    </div>
    <div style="height:80px;"></div>
  </div>

  <div id="giftsView" class="hidden">
    <div class="panel-header">
      <button id="backFromGifts">←</button>
      <h2>🎁 Подарки</h2>
    </div>
    <div class="panel-body">
      <p style="color:#8fbcd8;font-size:clamp(11px,2.8vw,20px);margin-bottom:8px;">
        Баланс: <b style="color:#7dff7d;">💰 <span id="giftsMoney">0</span></b>
      </p>
      <p style="color:#8fbcd8;font-size:clamp(11px,2.8vw,20px);margin-bottom:16px;">
        Покупай подарки и отправляй в активный чат (или в Избранное — себе).
      </p>
      <div class="gifts-grid" id="giftsGrid"></div>
    </div>
  </div>

  <div id="settingsPanel" class="panel hidden" style="position:absolute;inset:0;
    background:#17212b;color:#fff;z-index:180;display:flex;flex-direction:column;">
    <div class="panel-header">
      <button id="closeSettings">←</button>
      <h2>Настройки</h2>
    </div>
    <div class="panel-body">
      <h3 style="color:#8fbcd8;font-size:clamp(12px,3vw,22px);margin-bottom:12px;
        text-transform:uppercase;letter-spacing:1px;">Тема</h3>
      <div class="theme-option" data-theme="dark" style="display:flex;
        align-items:center;justify-content:space-between;padding:1em 1.2em;
        background:rgba(255,255,255,.06);border-radius:14px;margin-bottom:10px;
        cursor:pointer;font-size:clamp(13px,3.4vw,26px);">
        <span>🌙 Тёмная</span><span class="theme-check">✓</span>
      </div>
      <div class="theme-option" data-theme="light" style="display:flex;
        align-items:center;justify-content:space-between;padding:1em 1.2em;
        background:rgba(255,255,255,.06);border-radius:14px;margin-bottom:10px;
        cursor:pointer;font-size:clamp(13px,3.4vw,26px);">
        <span>☀️ Светлая</span><span class="theme-check"></span>
      </div>
      <h3 style="color:#8fbcd8;font-size:clamp(12px,3vw,22px);margin:20px 0 12px;
        text-transform:uppercase;letter-spacing:1px;">Аккаунт</h3>
      <button id="resetData" style="width:100%;background:rgba(229,57,53,.2);
        border:2px solid #e53935;color:#ff5252;font-weight:700;
        padding:.8em;border-radius:14px;font-size:clamp(12px,3vw,22px);">
        🗑️ Сбросить все данные
      </button>
    </div>
  </div>

  <div id="adminPanel" class="hidden">
    <div class="panel-header">
      <button id="closeAdmin">←</button>
      <h2 id="adminTitle">👑 Управление</h2>
    </div>
    <div class="panel-body">
      <div class="admin-section">
        <h3>Команды в чате</h3>
        <div style="font-family:'Courier New',monospace;font-size:clamp(10px,2.6vw,18px);
          line-height:1.8;color:#8fc9ff;">
          <div>/verify @user — выдать галочку</div>
          <div>/unverify @user — снять галочку</div>
          <div>/premium @user — выдать премиум</div>
          <div>/unpremium @user — снять премиум</div>
          <div>/gift @user rose — подарить розу</div>
          <div>/warn @user — предупредить</div>
          <div>/ban @user — забанить навсегда</div>
          <div>/unban @user — разбанить</div>
          <div>/money @user 1000 — выдать деньги</div>
          <div>/help — список команд</div>
        </div>
      </div>
      <div class="admin-section">
        <h3>Участники</h3>
        <div id="adminMembersList"></div>
      </div>
    </div>
  </div>

  <div id="casinoView" class="hidden">
    <div class="panel-header">
      <button id="closeCasino">←</button>
      <h2>🎰 Онлайн Казино</h2>
    </div>
    <div class="casino-hero">
      <h1>🎰 УДАЧА ЖДЁТ 🎰</h1>
      <div class="casino-balance">
        💰 <span id="casinoBalance">1000</span>
        <small id="casinoRole">Обычный игрок · ×2</small>
      </div>
    </div>

    <div class="roulette-container">
      <div class="roulette-wheel" id="rouletteWheel">
        <div class="pointer">🔻</div>
      </div>
      <div class="bet-row" id="betRow">
        <button class="bet-btn" data-bet="100">100💰</button>
        <button class="bet-btn active" data-bet="500">500💰</button>
        <button class="bet-btn" data-bet="1000">1000💰</button>
        <button class="bet-btn" data-bet="5000">5000💰</button>
      </div>
      <button class="spin-btn" id="spinBtn">🎰 КРУТИТЬ</button>
      <div class="casino-result" id="casinoResult"></div>
    </div>

    <div class="casino-shop">
      <h3>🛒 Магазин казино</h3>
      <div class="shop-row">
        <span>⭐ Премиум навсегда</span>
        <button class="shop-buy" id="casinoBuyPremium" data-price="5000">5000💰</button>
      </div>
      <div class="shop-row">
        <span>✓ Галочка верификации</span>
        <button class="shop-buy" id="casinoBuyVerify" data-price="3000">3000💰</button>
      </div>
      <div class="shop-row"><span>🌹 Роза</span>
        <button class="shop-buy" data-gift="rose" data-price="50">50💰</button></div>
      <div class="shop-row"><span>🧸 Мишка</span>
        <button class="shop-buy" data-gift="bear" data-price="100">100💰</button></div>
      <div class="shop-row"><span>💎 Алмаз</span>
        <button class="shop-buy" data-gift="diamond" data-price="500">500💰</button></div>
      <div class="shop-row"><span>🏆 Кубок</span>
        <button class="shop-buy" data-gift="cup" data-price="1000">1000💰</button></div>
      <div class="shop-row"><span>🚗 Машина</span>
        <button class="shop-buy" data-gift="car" data-price="2000">2000💰</button></div>
      <div class="shop-row"><span>🏰 Замок</span>
        <button class="shop-buy" data-gift="castle" data-price="10000">10000💰</button></div>
    </div>

    <div class="casino-history">
      <h3>📜 История</h3>
      <div id="casinoHistory" style="color:#8fbcd8;font-size:clamp(11px,2.8vw,20px);">
        Пока нет ставок.
      </div>
    </div>
    <div style="height:40px;"></div>
  </div>

  <div id="modalContainer"></div>
  <div id="toast" class="toast"></div>
</div>

<script>
(function(){
  'use strict';

  var STORAGE_KEY = 'my_messenger_v6';
  var SECRET_GROUP_NAME = 'VacfugOFFBLADELEW';
  var CASINO_START_MONEY = 1000;
  var OWNER_JACKPOT_MULT = 99999998383838383838; // ×99999998383838383838 для владельца

  // ============================================================
  //  БОТЫ: УМНЫЕ ОТВЕТЫ
  // ============================================================
  var BOT = {
    greetings: ['Привет! Как сам?', 'О, привет! Рад тебя видеть 😊', 'Хай! Что нового?',
      'Привет-привет! Как дела?', 'Здравствуй! Давно не общались'],
    howAreYou: ['Отлично, спасибо! А у тебя?', 'Всё хорошо, работаю вот 😄',
      'Норм, не жалуюсь. Ты как?', 'Супер! Планы на вечер есть?'],
    questions: ['Хм, хороший вопрос. Думаю, да', 'Не уверен, но скорее всего так',
      'Интересно... Расскажи подробнее?', 'А почему ты спрашиваешь?',
      'Мне кажется, тут всё зависит от ситуации'],
    money: ['Деньги — это всегда интересно 💰', 'О, любимая тема!',
      'Заработать бы где...', 'А что, есть идеи?'],
    casino: ['О, казино! Я туда не хожу — проигрываю всегда 😂',
      'Говорят, там можно поднять хорошие деньги...',
      'Рулетка? Удачи тебе!', 'Я бы тоже попробовал, но денег жалко'],
    gift: ['Вау, спасибо за подарок! 🎁', 'Ого, ты щедрый! Спасибо!',
      'Спасибо большое! Очень приятно ❤️', 'Ух ты! Не ожидал, спасибо!',
      'Мне очень приятно, спасибо тебе 🙏'],
    premium: ['О, у тебя премиум! Круто! ⭐', 'Смотрю, ты VIP теперь! Поздравляю!',
      'Премиум-статус — это солидно!', 'Красивый значок ⭐, заслужил!'],
    verify: ['Ух ты, у тебя галочка верификации! ✓', 'Ого, ты теперь верифицирован!',
      'Вижу галочку ✓ — доверяю тебе полностью!', 'Круто, теперь тебе можно верить!',
      'Твоя галочка выглядит солидно ✓'],
    bye: ['Давай, до связи! 👋', 'Пока! Пиши ещё', 'Ок, увидимся!',
      'Хорошего дня!', 'Всё, побежал, пока!'],
    thanks: ['Не за что! 😊', 'Обращайся!', 'Всегда рад помочь',
      'Пфф, пустяки!', 'Рад был помочь'],
    laugh: ['Ха-ха, точно! 😄', 'Ахахах, ты жжёшь!', 'Ору 😂',
      'Смешно, конечно!', 'Лол, серьёзно?'],
    default: ['Интересно...', 'Понял тебя', 'Ага, понятно', 'Хм, а я и не знал',
      'Согласен!', 'Слушай, а ты прав', 'Ну да, логично',
      'Кстати, а что ты думаешь о погоде?', 'Расскажи ещё!',
      'Ого, вот это новость!', 'Ясно-понятно', 'Ну такое...',
      'Да ну? Серьёзно?', 'Ммм, интересная мысль']
  };

  function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function botSmartReply(text, me) {
    var t = text.toLowerCase();
    // Проверка на галочку/премиум упоминания
    if (/галочк|верифик|verified/i.test(t)) return pickRandom(BOT.verify);
    if (/премиум|premium|vip/i.test(t)) return pickRandom(BOT.premium);
    if (/привет|здравствуй|хай|ку|добрый/i.test(t)) return pickRandom(BOT.greetings);
    if (/как дела|как ты|как жизнь|чё как/i.test(t)) return pickRandom(BOT.howAreYou);
    if (/деньг|заработ|бабк|бакс|рубл/i.test(t)) return pickRandom(BOT.money);
    if (/казино|рулетк|ставк|выигр/i.test(t)) return pickRandom(BOT.casino);
    if (/пока|до свид|бай|увидим/i.test(t)) return pickRandom(BOT.bye);
    if (/спасиб|благодар/i.test(t)) return pickRandom(BOT.thanks);
    if (/ахах|хах|смешн|лол|ору/i.test(t)) return pickRandom(BOT.laugh);
    if (/\?/.test(t)) return pickRandom(BOT.questions);

    // Если пользователь верифицирован или премиум — иногда упоминает
    if (me && me.verified && Math.random() < 0.3) {
      return 'Кстати, заметил твою галочку ✓ — круто выглядит! ' + pickRandom(BOT.default);
    }
    if (me && me.premium && Math.random() < 0.3) {
      return 'О, у тебя же премиум ⭐! Солидно. ' + pickRandom(BOT.default);
    }
    return pickRandom(BOT.default);
  }

  function botGiftReaction(gift, me) {
    var extra = [' (это же ' + gift.name + '!)', ' Ого, ' + gift.name + '!',
      ' Вот это да — ' + gift.name + '!'];
    var base = pickRandom(BOT.gift) + pickRandom(extra);
    if (me && me.verified) base = '✓ Верифицированному — особенно приятно! ' + base;
    else if (me && me.premium) base = '⭐ Премиум-пользователю — респект! ' + base;
    return base;
  }

  // ============================================================
  //  СОСТОЯНИЕ
  // ============================================================
  var state = {
    me: {
      name: 'Пользователь', username: '', color: '#4a9eff',
      bio: 'Люблю игры', premium: false, verified: false,
      gifts: [], money: CASINO_START_MONEY
    },
    chats: [], theme: 'dark', activeChatId: null,
    secretGroupEntered: false,
    casinoHistory: [],
    casinoLoseStreak: { 100:0, 500:0, 1000:0, 5000:0 }
  };

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        me: state.me, chats: state.chats, theme: state.theme,
        secretGroupEntered: state.secretGroupEntered,
        casinoHistory: state.casinoHistory,
        casinoLoseStreak: state.casinoLoseStreak
      }));
    } catch(e) {}
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      var data = JSON.parse(raw);
      state.me = data.me || state.me;
      state.chats = data.chats || [];
      state.theme = data.theme || 'dark';
      state.secretGroupEntered = data.secretGroupEntered || false;
      state.casinoHistory = data.casinoHistory || [];
      state.casinoLoseStreak = data.casinoLoseStreak || { 100:0, 500:0, 1000:0, 5000:0 };
      if (typeof state.me.money !== 'number') state.me.money = CASINO_START_MONEY;
      return true;
    } catch(e) { return false; }
  }

  var DEFAULT_CHATS = [
    { id: 'chat1', name: 'Аня', username: '@anya', emoji: '👩', color: '#e91e63',
      status: 'в сети', online: true, bio: 'Дизайнер', premium: true, verified: true },
    { id: 'chat2', name: 'Макс', username: '@max', emoji: '🧑', color: '#2196f3',
      status: 'был(а) недавно', online: false, bio: 'Программист', premium: false, verified: false },
    { id: 'chat3', name: 'Команда', username: '@devteam', emoji: '👨‍💻', color: '#4caf50',
      status: '5 участников', online: true, bio: 'Рабочий чат', premium: false, verified: true,
      isGroup: true, members: 5 },
    { id: 'chat4', name: 'Саша', username: '@sasha', emoji: '🧔', color: '#ff9800',
      status: 'не в сети', online: false, bio: 'Спортсмен', premium: false, verified: false }
  ];

  function initChats() {
    if (state.chats.length === 0) {
      state.chats = DEFAULT_CHATS.map(function(c){
        return {
          id: c.id, name: c.name, username: c.username, emoji: c.emoji, color: c.color,
          status: c.status, online: c.online, bio: c.bio, premium: c.premium,
          verified: c.verified, isGroup: c.isGroup || false, members: c.members || 0,
          messages: [{
            id: 'm_init_' + c.id, text: 'Привет! Это ' + c.name + ' 👋',
            author: c.name, fromMe: false, time: Date.now() - 3600000,
            read: true, reactions: []
          }],
          unread: 0
        };
      });
      state.chats.push({
        id: 'favorites', name: 'Избранное', username: '@self', emoji: '⭐',
        color: '#4a9eff', status: 'Заметки', online: true,
        bio: 'Твой личный чат', isFavorites: true,
        messages: [{
          id: 'm_fav_welcome',
          text: '⭐ Это твой личный чат. Сюда можно писать заметки и дарить подарки себе.',
          author: 'Система', fromMe: false, system: true,
          time: Date.now(), read: true, reactions: []
        }], unread: 0
      });
      state.chats.push({
        id: 'casino', name: 'Онлайн Казино', username: '@casino', emoji: '🎰',
        color: '#ffd54f', status: 'Крути рулетку!', online: true,
        bio: 'Рулетка', verified: true, isCasino: true, messages: [], unread: 0
      });
    }
    if (!state.chats.some(function(c){ return c.id === 'favorites'; })) {
      state.chats.push({
        id: 'favorites', name: 'Избранное', username: '@self', emoji: '⭐',
        color: '#4a9eff', status: 'Заметки', online: true, bio: 'Твой личный чат',
        isFavorites: true, messages: [], unread: 0
      });
    }
    if (!state.chats.some(function(c){ return c.id === 'casino'; })) {
      state.chats.push({
        id: 'casino', name: 'Онлайн Казино', username: '@casino', emoji: '🎰',
        color: '#ffd54f', status: 'Крути рулетку!', online: true,
        bio: 'Рулетка', verified: true, isCasino: true, messages: [], unread: 0
      });
    }
  }

  function createSecretGroup() {
    return {
      id: 'secret_group_' + Date.now(), name: SECRET_GROUP_NAME,
      username: '@' + SECRET_GROUP_NAME.toLowerCase(), emoji: '👑',
      color: '#ffd54f', status: 'Секретная группа', online: true,
      bio: 'Закрытая группа. Доступ по названию.', premium: false, verified: true,
      isGroup: true, isSecret: true, members: 1,
      memberList: [{
        name: state.me.name, username: state.me.username,
        role: 'owner', joinedAt: Date.now()
      }],
      messages: [], unread: 0
    };
  }

  function makeHelpMessage(role) {
    return [
      '👑 Добро пожаловать в VacfugOFFBLADELEW!',
      'Твоя роль: ' + (role === 'owner' ? 'ВЛАДЕЛЕЦ' : 'СОВЛАДЕЛЕЦ'), '',
      '📋 КОМАНДЫ (пиши в чат):',
      '/verify @user — выдать галочку',
      '/unverify @user — снять галочку',
      '/premium @user — выдать премиум',
      '/unpremium @user — снять премиум',
      '/gift @user rose — подарить розу',
      '/warn @user — предупредить',
      '/ban @user — забанить навсегда',
      '/unban @user — разбанить',
      '/money @user 1000 — выдать деньги',
      '/help — показать это сообщение'
    ].join('\n');
  }

  // ============================================================
  //  DOM
  // ============================================================
  var $ = function(id){ return document.getElementById(id); };
  var app = $('app'), login = $('login'), main = $('main');
  var chatView = $('chatView'), profileView = $('profileView');
  var giftsView = $('giftsView'), settingsPanel = $('settingsPanel');
  var adminPanel = $('adminPanel'), casinoView = $('casinoView');
  var chatList = $('chatList'), messages = $('messages');
  var msgInput = $('msgInput'), toastEl = $('toast');

  var toastTimeout = null;
  function toast(text) {
    toastEl.textContent = text;
    toastEl.classList.add('show');
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(function(){ toastEl.classList.remove('show'); }, 2400);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];
    });
  }
  function formatTime(ts) {
    var d = new Date(ts), now = new Date();
    if (d.toDateString() === now.toDateString()) {
      return ('0'+d.getHours()).slice(-2) + ':' + ('0'+d.getMinutes()).slice(-2);
    }
    return ('0'+d.getDate()).slice(-2) + '.' + ('0'+(d.getMonth()+1)).slice(-2);
  }
  function formatBigNumber(n) {
    if (n < 1e6) return n.toString();
    return n.toExponential(3).replace('e+', '×10^');
  }
  function applyTheme() {
    if (state.theme === 'light') app.classList.add('light');
    else app.classList.remove('light');
  }
  function getMyRole(chat) {
    if (!chat || !chat.memberList) return null;
    var me = chat.memberList.find(function(m){
      return m.username === state.me.username && m.name === state.me.name;
    });
    return me ? me.role : null;
  }
  function canModerate(chat) {
    var r = getMyRole(chat);
    return r === 'owner' || r === 'coowner';
  }
  function searchSecretGroup(query) {
    return query.trim().toLowerCase() === SECRET_GROUP_NAME.toLowerCase();
  }

  // ============================================================
  //  РЕНДЕР ЧАТОВ
  // ============================================================
  function renderChatList(filter) {
    var query = (filter || '').toLowerCase().trim();
    chatList.innerHTML = '';

    var visible = state.chats.filter(function(c){
      if (c.isCasino) return !query || 'казино casino'.indexOf(query) !== -1;
      if (c.isFavorites) return !query || 'избранное favorites'.indexOf(query) !== -1;
      if (c.isSecret) {
        if (!query) return true;
        return c.name.toLowerCase() === query;
      }
      if (!query) return true;
      return c.name.toLowerCase().indexOf(query) !== -1 ||
             (c.username && c.username.toLowerCase().indexOf(query) !== -1);
    });

    if (query && searchSecretGroup(query) && !state.chats.some(function(c){ return c.isSecret; })) {
      var findItem = document.createElement('div');
      findItem.className = 'chat-item secret-group';
      findItem.innerHTML =
        '<div class="avatar" style="background:#ffd54f;color:#1a1a1a;">👑</div>' +
        '<div class="chat-content">' +
          '<div class="chat-name">' + escapeHtml(SECRET_GROUP_NAME) + ' <span class="verified-badge">✓</span></div>' +
          '<div class="chat-preview">Секретная группа · Нажми, чтобы войти</div>' +
        '</div>';
      findItem.addEventListener('click', enterSecretGroup);
      chatList.appendChild(findItem);
    }

    if (!query) {
      var createBtn = document.createElement('div');
      createBtn.className = 'create-group-btn';
      createBtn.innerHTML = '<span style="font-size:1.4em;">➕</span> Создать группу';
      createBtn.addEventListener('click', showCreateGroupDialog);
      chatList.appendChild(createBtn);
    }

    if (visible.length === 0 && !(query && searchSecretGroup(query))) {
      chatList.innerHTML += '<div style="padding:40px;text-align:center;color:#6e8aa3;' +
        'font-size:clamp(12px,3vw,22px);">' +
        (query ? 'Ничего не найдено' : 'Нет чатов') + '</div>';
      return;
    }

    visible.forEach(function(c){
      var last = c.messages[c.messages.length - 1];
      var item = document.createElement('div');
      item.className = 'chat-item';
      if (c.isSecret) item.className += ' secret-group';
      if (c.isCasino) item.className += ' casino-item';
      if (c.isFavorites) item.className += ' fav-item';

      var nameHtml = escapeHtml(c.name);
      if (c.verified) nameHtml += ' <span class="verified-badge">✓</span>';
      if (c.premium) nameHtml += ' <span class="premium-badge">⭐</span>';
      if (c.isGroup && !c.isCasino) nameHtml += ' <span style="color:#8fbcd8;font-size:.8em;">👥</span>';

      if (c.isSecret) {
        var role = getMyRole(c);
        if (role === 'owner') nameHtml += ' <span class="owner-badge">ВЛАДЕЛЕЦ</span>';
        else if (role === 'coowner') nameHtml += ' <span class="co-owner-badge">СОВЛАДЕЛЕЦ</span>';
      }

      var preview = last ? escapeHtml(last.text).slice(0, 60) : 'Нет сообщений';
      if (c.isCasino) preview = '🎰 Крути рулетку · ×2 · для владельца мега-джекпот';
      if (c.isFavorites && !last) preview = 'Твои заметки и подарки себе';
      var timeStr = last ? formatTime(last.time) : '';

      item.innerHTML =
        '<div class="avatar" style="background:' + c.color + ';">' + c.emoji + '</div>' +
        '<div class="chat-content">' +
          '<div class="chat-name">' + nameHtml + '</div>' +
          '<div class="chat-preview">' + preview + '</div>' +
        '</div>' +
        '<div class="chat-meta">' +
          '<div class="chat-time">' + timeStr + '</div>' +
          (c.unread > 0 ? '<div class="unread-badge">' + c.unread + '</div>' : '') +
        '</div>';

      item.addEventListener('click', function(){ openChat(c.id); });
      chatList.appendChild(item);
    });
  }

  // ============================================================
  //  СОЗДАНИЕ ГРУППЫ
  // ============================================================
  function showCreateGroupDialog() {
    var overlay = document.createElement('div');
    overlay.className = 'confirm-dialog';
    overlay.innerHTML =
      '<div class="confirm-box">' +
        '<p style="margin-bottom:12px;">Создать группу</p>' +
        '<input id="newGroupName" placeholder="Название группы" maxlength="40" style="width:100%;padding:.8em;border-radius:10px;background:#0e1621;color:#fff;border:1px solid rgba(255,255,255,.15);font-size:clamp(13px,3.2vw,22px);margin-bottom:12px;text-align:center;">' +
        '<input id="newGroupEmoji" placeholder="Эмодзи" maxlength="4" style="width:100%;padding:.8em;border-radius:10px;background:#0e1621;color:#fff;border:1px solid rgba(255,255,255,.15);font-size:clamp(13px,3.2vw,22px);margin-bottom:12px;text-align:center;" value="👥">' +
        '<div class="btn-row"><button class="btn-cancel" id="cancelNewGroup">Отмена</button>' +
        '<button class="btn-ok" id="confirmNewGroup" style="background:#4a9eff;">Создать</button></div>' +
      '</div>';
    overlay.querySelector('#cancelNewGroup').addEventListener('click', function(){ overlay.remove(); });
    overlay.querySelector('#confirmNewGroup').addEventListener('click', function(){
      var name = overlay.querySelector('#newGroupName').value.trim();
      var emoji = overlay.querySelector('#newGroupEmoji').value.trim() || '👥';
      if (!name) { toast('Введи название'); return; }
      var group = {
        id: 'group_' + Date.now(), name: name,
        username: '@' + name.toLowerCase().replace(/\s+/g, '_'), emoji: emoji,
        color: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'),
        status: '1 участник', online: true, bio: 'Моя группа',
        premium: false, verified: false, isGroup: true, members: 1,
        memberList: [{
          name: state.me.name, username: state.me.username,
          role: 'owner', joinedAt: Date.now()
        }],
        messages: [{
          id: 'm_grp_' + Date.now(),
          text: '👥 Группа "' + name + '" создана. Владелец: ' + state.me.name,
          author: 'Система', fromMe: false, system: true,
          time: Date.now(), read: true, reactions: []
        }],
        unread: 0
      };
      state.chats.push(group);
      save(); overlay.remove(); renderChatList();
      toast('✅ Группа "' + name + '" создана!');
    });
    overlay.addEventListener('click', function(e){ if (e.target === overlay) overlay.remove(); });
    document.body.appendChild(overlay);
  }

  // ============================================================
  //  ВХОД В СЕКРЕТНУЮ ГРУППУ
  // ============================================================
  function enterSecretGroup() {
    if (!state.chats.some(function(c){ return c.isSecret; })) {
      var group = createSecretGroup();
      group.messages.push({
        id: 'm_help_' + Date.now(), text: makeHelpMessage('owner'),
        author: 'Система', fromMe: false, system: true, cmd: true,
        time: Date.now(), read: true, reactions: []
      });
      state.chats.push(group);
      state.secretGroupEntered = true;
      save();
      toast('👑 Ты ВЛАДЕЛЕЦ группы!');
      openChat(group.id);
      return;
    }

    var group = state.chats.find(function(c){ return c.isSecret; });
    var meInGroup = group.memberList.find(function(m){
      return m.username === state.me.username && m.name === state.me.name;
    });
    if (meInGroup) { openChat(group.id); return; }

    if (group.memberList.length === 0) {
      group.memberList.push({ name: state.me.name, username: state.me.username, role: 'owner', joinedAt: Date.now() });
      toast('👑 Ты ВЛАДЕЛЕЦ!');
    } else if (group.memberList.length === 1) {
      group.memberList.push({ name: state.me.name, username: state.me.username, role: 'coowner', joinedAt: Date.now() });
      toast('⭐ Ты СОВЛАДЕЛЕЦ!');
    } else {
      toast('❌ Группа заполнена'); return;
    }
    group.members = group.memberList.length;
    group.messages.push({
      id: 'm_help_' + Date.now(), text: makeHelpMessage(getMyRole(group)),
      author: 'Система', fromMe: false, system: true, cmd: true,
      time: Date.now(), read: true, reactions: []
    });
    save();
    openChat(group.id);
  }

  // ============================================================
  //  ОТКРЫТИЕ ЧАТА
  // ============================================================
  function openChat(chatId) {
    var chat = state.chats.find(function(c){ return c.id === chatId; });
    if (!chat) return;
    state.activeChatId = chatId;
    chat.unread = 0;
    save();

    main.classList.add('hidden');
    chatView.classList.remove('hidden');
    casinoView.classList.add('hidden');

    $('chatAvatar').style.background = chat.color;
    $('chatAvatar').textContent = chat.emoji;
    var nameEl = $('chatName');
    var nameHtml = escapeHtml(chat.name);
    if (chat.verified) nameHtml += ' <span class="verified-badge">✓</span>';
    if (chat.isSecret) {
      var role = getMyRole(chat);
      if (role === 'owner') nameHtml += ' <span class="owner-badge">ВЛАДЕЛЕЦ</span>';
      else if (role === 'coowner') nameHtml += ' <span class="co-owner-badge">СОВЛАДЕЛЕЦ</span>';
    }
    nameEl.innerHTML = nameHtml;
    $('chatStatus').textContent = chat.isCasino ? 'Крути рулетку!' :
      (chat.isFavorites ? 'Твой личный чат' :
      (chat.isGroup && chat.memberList ? chat.memberList.length + ' участн. · ' + chat.bio :
       chat.status));
    $('chatStatus').className = 'status' + (chat.online ? ' online' : '');

    var adminBtn = $('chatAdminBtn');
    if (chat.isSecret && canModerate(chat)) adminBtn.classList.remove('hidden');
    else adminBtn.classList.add('hidden');

    if (chat.isCasino) {
      chatView.classList.add('hidden');
      casinoView.classList.remove('hidden');
      renderCasino();
      return;
    }

    renderMessages(chat);
    msgInput.value = '';
    msgInput.focus();
  }

  function closeChat() {
    chatView.classList.add('hidden');
    casinoView.classList.add('hidden');
    main.classList.remove('hidden');
    state.activeChatId = null;
    renderChatList();
    save();
  }

  // ============================================================
  //  СООБЩЕНИЯ
  // ============================================================
  var typingTimeout = null;

  function renderMessages(chat) {
    messages.innerHTML = '';
    chat.messages.forEach(function(m){
      var div = document.createElement('div');
      div.className = 'msg ' + (m.fromMe ? 'msg-out' : 'msg-in');

      var html = '';
      if (m.system) {
        html += '<div class="' + (m.cmd ? 'cmd-note' : 'system-note') + '">' +
          escapeHtml(m.text).replace(/\n/g, '<br>') + '</div>';
      } else {
        if (!m.fromMe && chat.isGroup && m.author) {
          html += '<div class="msg-author">' + escapeHtml(m.author);
          if (m.authorPremium) html += ' <span class="premium-badge">⭐</span>';
          if (m.authorVerified) html += ' <span class="verified-badge">✓</span>';
          html += '</div>';
        }
        if (m.gift) {
          html += '<div class="gift-inline">' + m.gift.emoji + '</div>' +
                  '<div style="text-align:center;font-size:.85em;">' + escapeHtml(m.gift.name) + '</div>';
        } else {
          html += escapeHtml(m.text).replace(/\n/g, '<br>');
        }
      }

      var ticks = '';
      if (m.fromMe) {
        ticks = '<span class="ticks' + (m.read ? ' read' : '') + '">' +
          (m.read ? '✓✓' : '✓') + '</span>';
      }
      html += '<span class="msg-time">' + formatTime(m.time) + ' ' + ticks + '</span>';

      div.innerHTML = html;
      messages.appendChild(div);
    });
    setTimeout(function(){ messages.scrollTop = messages.scrollHeight; }, 30);
  }

  function showTyping(chat) {
    var existing = $('typingIndicator');
    if (existing) existing.remove();
    if (!chat || chat.isFavorites || chat.isCasino) return;

    var div = document.createElement('div');
    div.id = 'typingIndicator';
    div.className = 'typing-indicator';
    var who = chat.isGroup && chat.memberList ?
      (chat.memberList.find(function(m){ return m.name !== state.me.name; }) || {}).name || chat.name :
      chat.name;
    div.innerHTML = escapeHtml(who) + ' печатает <span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;

    // Обновляем статус в шапке
    if (state.activeChatId === chat.id) {
      var st = $('chatStatus');
      st.textContent = 'печатает...';
      st.className = 'status typing';
    }

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(function(){
      var el = $('typingIndicator');
      if (el) el.remove();
      if (state.activeChatId === chat.id) {
        var st2 = $('chatStatus');
        st2.textContent = chat.isGroup && chat.memberList ?
          chat.memberList.length + ' участн. · ' + chat.bio : chat.status;
        st2.className = 'status' + (chat.online ? ' online' : '');
      }
    }, 3000);
  }

  // ============================================================
  //  КОМАНДЫ
  // ============================================================
  function processCommand(text, chat) {
    var parts = text.trim().split(/\s+/);
    var cmd = parts[0].toLowerCase();
    var args = parts.slice(1);
    var myRole = getMyRole(chat);

    function addSystem(txt, isCmd) {
      chat.messages.push({
        id: 'm_sys_' + Date.now() + Math.random(),
        text: txt, author: 'Система', fromMe: false, system: true,
        cmd: isCmd || false, time: Date.now(), read: true, reactions: []
      });
    }
    function findMemberByUsername(u) {
      if (!u) return null;
      u = u.replace(/^@/, '').toLowerCase();
      return chat.memberList.find(function(m){
        return (m.username || '').toLowerCase() === u;
      });
    }

    if (cmd === '/help') {
      addSystem(makeHelpMessage(myRole), true);
      save(); renderMessages(chat); return true;
    }
    if (!myRole) {
      addSystem('❌ Только участники группы могут использовать команды');
      save(); renderMessages(chat); return true;
    }

    if (cmd === '/verify' || cmd === '/unverify' || cmd === '/premium' ||
        cmd === '/unpremium' || cmd === '/money') {
      if (myRole !== 'owner') {
        addSystem('❌ Только ВЛАДЕЛЕЦ может использовать /' + cmd.slice(1));
        save(); renderMessages(chat); return true;
      }
      var m = findMemberByUsername(args[0]);
      if (!m) { addSystem('❌ Пользователь не найден. Формат: /' + cmd.slice(1) + ' @user'); save(); renderMessages(chat); return true; }

      if (cmd === '/verify') {
        m.verified = true;
        if (m.name === state.me.name || m.username === state.me.username) state.me.verified = true;
        addSystem('✅ ' + m.name + ' получил галочку ✓');
      } else if (cmd === '/unverify') {
        m.verified = false;
        if (m.name === state.me.name || m.username === state.me.username) state.me.verified = false;
        addSystem('✅ Галочка снята с ' + m.name);
      } else if (cmd === '/premium') {
        m.premium = true;
        if (m.name === state.me.name || m.username === state.me.username) state.me.premium = true;
        addSystem('⭐ ' + m.name + ' получил премиум');
      } else if (cmd === '/unpremium') {
        m.premium = false;
        if (m.name === state.me.name || m.username === state.me.username) state.me.premium = false;
        addSystem('⭐ Премиум снят с ' + m.name);
      } else if (cmd === '/money') {
        var amount = parseInt(args[1], 10);
        if (!amount || amount < 1) {
          addSystem('❌ Формат: /money @user 1000'); save(); renderMessages(chat); return true;
        }
        if (m.name !== state.me.name && m.username !== state.me.username) {
          addSystem('⚠️ Деньги можно выдавать только себе'); save(); renderMessages(chat); return true;
        }
        state.me.money += amount;
        addSystem('💰 ' + state.me.name + ' получил ' + amount + '💰');
      }
      save(); renderMessages(chat); updateMoneyDisplays();
      // Обновляем профиль если открыт
      if (!profileView.classList.contains('hidden')) updateProfileView();
      return true;
    }

    if (cmd === '/gift') {
      if (myRole !== 'owner' && myRole !== 'coowner') {
        addSystem('❌ Только владелец/совладелец'); save(); renderMessages(chat); return true;
      }
      var target = findMemberByUsername(args[0]);
      var giftName = args[1];
      if (!target || !giftName) { addSystem('❌ Формат: /gift @user rose'); save(); renderMessages(chat); return true; }
      var giftMap = {
        rose: { emoji: '🌹', name: 'Роза' }, bear: { emoji: '🧸', name: 'Мишка' },
        diamond: { emoji: '💎', name: 'Алмаз' }, cup: { emoji: '🏆', name: 'Кубок' },
        car: { emoji: '🚗', name: 'Машина' }, castle: { emoji: '🏰', name: 'Замок' }
      };
      var gift = giftMap[giftName.toLowerCase()];
      if (!gift) { addSystem('❌ Доступно: rose, bear, diamond, cup, car, castle'); save(); renderMessages(chat); return true; }
      addSystem('🎁 ' + state.me.name + ' подарил ' + gift.name + ' игроку ' + target.name + ' ' + gift.emoji);
      save(); renderMessages(chat); return true;
    }

    if (cmd === '/warn') {
      if (!canModerate(chat)) { addSystem('❌ Нет прав'); save(); renderMessages(chat); return true; }
      var t = findMemberByUsername(args[0]);
      if (!t) { addSystem('❌ Формат: /warn @user'); save(); renderMessages(chat); return true; }
      if (t.name === state.me.name) { addSystem('❌ Себя нельзя'); save(); renderMessages(chat); return true; }
      t.warnings = (t.warnings || 0) + 1;
      if (t.warnings >= 3) { t.banned = true; addSystem('🚫 ' + t.name + ' ЗАБАНЕН (3/3)'); }
      else addSystem('⚠️ ' + t.name + ' предупреждение (' + t.warnings + '/3)');
      save(); renderMessages(chat); return true;
    }
    if (cmd === '/ban') {
      if (!canModerate(chat)) { addSystem('❌ Нет прав'); save(); renderMessages(chat); return true; }
      var tb = findMemberByUsername(args[0]);
      if (!tb) { addSystem('❌ Формат: /ban @user'); save(); renderMessages(chat); return true; }
      if (tb.role === 'owner') { addSystem('❌ Нельзя забанить владельца'); save(); renderMessages(chat); return true; }
      tb.banned = true;
      addSystem('🚫 ' + tb.name + ' забанен навсегда');
      save(); renderMessages(chat); return true;
    }
    if (cmd === '/unban') {
      if (myRole !== 'owner') { addSystem('❌ Только владелец'); save(); renderMessages(chat); return true; }
      var tu = findMemberByUsername(args[0]);
      if (!tu) { addSystem('❌ Формат: /unban @user'); save(); renderMessages(chat); return true; }
      tu.banned = false; tu.warnings = 0;
      addSystem('✅ ' + tu.name + ' разбанен');
      save(); renderMessages(chat); return true;
    }
    addSystem('❓ Неизвестная команда. /help', true);
    save(); renderMessages(chat); return true;
  }

  // ============================================================
  //  ОТПРАВКА
  // ============================================================
  function sendMessage() {
    var text = msgInput.value.trim();
    if (!text) return;
    var chat = state.chats.find(function(c){ return c.id === state.activeChatId; });
    if (!chat) return;

    if (text.startsWith('/')) {
      if (chat.isSecret) { processCommand(text, chat); msgInput.value = ''; return; }
      toast('Команды только в секретной группе');
      msgInput.value = '';
      return;
    }

    var role = getMyRole(chat);
    var msg = {
      id: 'm_' + Date.now() + '_' + Math.random().toString(36).slice(2,7),
      text: text, author: state.me.name,
      authorPremium: state.me.premium,
      authorVerified: state.me.verified,
      fromMe: true, time: Date.now(), read: false, reactions: []
    };
    chat.messages.push(msg);
    chat.unread = 0;
    msgInput.value = '';
    save();
    renderMessages(chat);
    renderChatList();

    // Бот-ответ
    var isBotChat = !chat.isGroup && !chat.isFavorites && !chat.isCasino;
    var isSecretChat = chat.isSecret;
    var groupHasOthers = chat.isGroup && chat.memberList && chat.memberList.length > 1;

    if (isBotChat || isSecretChat || groupHasOthers) {
      // Показываем "печатает" через 400 мс
      setTimeout(function(){
        if (state.activeChatId === chat.id) showTyping(chat);
      }, 400);

      setTimeout(function(){
        msg.read = true;
        var replyText = botSmartReply(text, state.me);
        var replyAuthor = chat.name;
        var replyPremium = false, replyVerified = false;

        if (isSecretChat && chat.memberList) {
          var other = chat.memberList.find(function(m){ return m.name !== state.me.name; });
          if (other) { replyAuthor = other.name; replyPremium = !!other.premium; replyVerified = !!other.verified; }
          else { replyAuthor = '👑 ' + chat.memberList[0].name; }
        } else if (groupHasOthers) {
          var otherM = chat.memberList.find(function(m){ return m.name !== state.me.name; });
          replyAuthor = otherM.name;
          replyPremium = !!otherM.premium;
          replyVerified = !!otherM.verified;
        }

        // Если пользователь верифицирован/премиум — бот иногда отмечает это
        if (state.me.verified && Math.random() < 0.4) {
          // Уже добавлено в botSmartReply
        }

        chat.messages.push({
          id: 'm_' + Date.now() + Math.random(),
          text: replyText, author: replyAuthor,
          authorPremium: replyPremium, authorVerified: replyVerified,
          fromMe: false, time: Date.now(), read: true, reactions: []
        });

        // Убираем индикатор печати
        var ti = $('typingIndicator');
        if (ti) ti.remove();

        save();
        if (state.activeChatId === chat.id) renderMessages(chat);
        renderChatList();
      }, 1400 + Math.random() * 1800);
    }
  }

  // ============================================================
  //  КАЗИНО
  // ============================================================
  var currentBet = 500;
  var isSpinning = false;

  function renderCasino() {
    $('casinoBalance').textContent = formatBigNumber(state.me.money);
    var secret = state.chats.find(function(c){ return c.isSecret; });
    var isOwner = secret && getMyRole(secret) === 'owner';
    $('casinoRole').textContent = isOwner ? '👑 ВЛАДЕЛЕЦ · ×99999998383838383838' : '🎲 Обычный игрок · ×2';

    document.querySelectorAll('.bet-btn').forEach(function(b){
      b.classList.toggle('active', parseInt(b.dataset.bet) === currentBet);
    });

    var h = $('casinoHistory');
    if (state.casinoHistory.length === 0) {
      h.innerHTML = 'Пока нет ставок.';
    } else {
      h.innerHTML = state.casinoHistory.slice(-10).reverse().map(function(item){
        var sign = item.win >= 0 ? '+' : '';
        var cls = item.win >= 0 ? 'h-win' : 'h-lose';
        return '<div class="history-item"><span>' + item.time + ' · ' + item.bet +
          '💰 · x' + item.mult + '</span><span class="' + cls + '">' + sign +
          formatBigNumber(item.win) + '💰</span></div>';
      }).join('');
    }

    document.querySelectorAll('.shop-buy').forEach(function(btn){
      var price = parseInt(btn.dataset.price, 10);
      btn.disabled = state.me.money < price;
    });
  }

  function spin() {
    if (isSpinning) return;
    if (state.me.money < currentBet) { toast('❌ Недостаточно денег'); return; }
    isSpinning = true;
    $('spinBtn').disabled = true;
    $('casinoResult').className = 'casino-result';
    $('casinoResult').textContent = '🎰 Крутим...';

    state.me.money -= currentBet;
    updateMoneyDisplays();

    var secret = state.chats.find(function(c){ return c.isSecret; });
    var isOwner = secret && getMyRole(secret) === 'owner';
    var multiplier = isOwner ? OWNER_JACKPOT_MULT : 2;

    // ============ СИСТЕМА ВЫИГРЫША ============
    // 100 = 5 проигрышей → выигрыш
    // 500 = 1 проигрыш → выигрыш
    // 1000 = 2 проигрыша → выигрыш (гарантированный 3-й)
    // 5000 = 2 проигрыша → выигрыш (гарантированный 3-й)
    var guaranteedAfter = { 100: 5, 500: 1, 1000: 2, 5000: 2 };
    var need = guaranteedAfter[currentBet] || 0;
    var streak = state.casinoLoseStreak[currentBet] || 0;
    var isWin;
    if (need > 0) {
      if (streak >= need) {
        isWin = true;
        state.casinoLoseStreak[currentBet] = 0;
      } else {
        isWin = false;
        state.casinoLoseStreak[currentBet] = streak + 1;
      }
    } else {
      isWin = Math.random() < (isOwner ? 0.05 : 0.40);
    }

    var wheel = $('rouletteWheel');
    var rotations = 5 + Math.random() * 5;
    var finalAngle = rotations * 360 + Math.random() * 360;
    wheel.style.transform = 'rotate(' + finalAngle + 'deg)';

    setTimeout(function(){
      var payout = 0;
      var resultClass = 'lose';
      var resultText = '';

      if (isWin) {
        payout = currentBet * multiplier;
        state.me.money += payout;
        resultClass = isOwner ? 'jackpot' : 'win';
        if (isOwner) {
          resultText = '💎 МЕГА-ДЖЕКПОТ! ×99999998383838383838 · +' + formatBigNumber(payout) + '💰';
        } else {
          resultText = '🎉 Победа! ×2 · +' + formatBigNumber(payout) + '💰';
        }
      } else {
        resultClass = 'lose';
        resultText = '😢 Проигрыш · -' + currentBet + '💰';
      }

      $('casinoResult').className = 'casino-result ' + resultClass;
      $('casinoResult').textContent = resultText;

      var d = new Date();
      var timeStr = ('0'+d.getHours()).slice(-2) + ':' + ('0'+d.getMinutes()).slice(-2);
      state.casinoHistory.push({
        time: timeStr, bet: currentBet,
        win: isWin ? payout - currentBet : -currentBet,
        mult: isWin ? multiplier : 0
      });
      if (state.casinoHistory.length > 30) state.casinoHistory.shift();

      save();
      updateMoneyDisplays();
      renderCasino();

      isSpinning = false;
      $('spinBtn').disabled = false;
    }, 4200);
  }

  function updateMoneyDisplays() {
    var el = $('casinoBalance');
    if (el) el.textContent = formatBigNumber(state.me.money);
    var g = $('giftsMoney');
    if (g) g.textContent = formatBigNumber(state.me.money);
    var pb = $('profileBalance');
    if (pb) pb.textContent = formatBigNumber(state.me.money) + '💰';
    var buyPrem = $('buyPremium');
    if (buyPrem) buyPrem.disabled = state.me.premium || state.me.money < 5000;
    var buyVer = $('buyVerify');
    if (buyVer) buyVer.disabled = state.me.verified || state.me.money < 3000;
  }

  // ============================================================
  //  ПРОФИЛЬ
  // ============================================================
  function updateProfileView() {
    $('profileAvatar').textContent = state.me.name.charAt(0).toUpperCase();
    $('profileAvatar').style.background = state.me.color;

    var pname = escapeHtml(state.me.name);
    if (state.me.premium) pname += ' <span class="premium-badge">⭐</span>';
    if (state.me.verified) pname += ' <span class="verified-badge">✓</span>';
    $('profileName').innerHTML = pname;

    // ГАЛОЧКА И ПРЕМИУМ НА АВАТАРЕ
    var vOverlay = $('profileVerifyOverlay');
    var pOverlay = $('profilePremOverlay');
    if (state.me.verified) vOverlay.classList.remove('hidden');
    else vOverlay.classList.add('hidden');
    if (state.me.premium) pOverlay.classList.remove('hidden');
    else pOverlay.classList.add('hidden');

    $('profileUsername').textContent = state.me.username ? '@' + state.me.username : '@username';
    $('profileBio').textContent = state.me.bio || '';
    $('usernameField').value = state.me.username ? '@' + state.me.username : '';

    // СТАТУСЫ
    var vEl = $('profileVerifiedStatus');
    vEl.textContent = state.me.verified ? '✓ Есть' : 'Нет';
    vEl.style.color = state.me.verified ? '#4a9eff' : '#ff5252';
    var pEl = $('premiumStatus');
    pEl.textContent = state.me.premium ? '⭐ PREMIUM' : 'Нет';
    pEl.style.color = state.me.premium ? '#ffd54f' : '#ff5252';

    $('profileBalance').textContent = formatBigNumber(state.me.money) + '💰';
    $('buyPremium').textContent = state.me.premium ? '✅ Премиум активен' : '⭐ КУПИТЬ ПРЕМИУМ (5000💰)';
    $('buyVerify').textContent = state.me.verified ? '✅ Галочка активна' : '✓ КУПИТЬ ГАЛОЧКУ (3000💰)';
    updateMoneyDisplays();
    renderMyGifts();
  }

  // ============================================================
  //  ПОДАРКИ
  // ============================================================
  var GIFTS = [
    { id: 'rose', emoji: '🌹', name: 'Роза', price: 50 },
    { id: 'bear', emoji: '🧸', name: 'Мишка', price: 100 },
    { id: 'cake', emoji: '🎂', name: 'Торт', price: 150 },
    { id: 'diamond', emoji: '💎', name: 'Алмаз', price: 500 },
    { id: 'cup', emoji: '🏆', name: 'Кубок', price: 1000 },
    { id: 'car', emoji: '🚗', name: 'Машина', price: 2000 },
    { id: 'plane', emoji: '✈️', name: 'Самолёт', price: 3000 },
    { id: 'pizza', emoji: '🍕', name: 'Пицца', price: 80 },
    { id: 'star', emoji: '⭐', name: 'Звезда', price: 300 },
    { id: 'giftbox', emoji: '🎁', name: 'Подарок', price: 200 },
    { id: 'ring', emoji: '💍', name: 'Кольцо', price: 5000 },
    { id: 'castle', emoji: '🏰', name: 'Замок', price: 10000 }
  ];

  function renderGifts() {
    var grid = $('giftsGrid');
    grid.innerHTML = '';
    GIFTS.forEach(function(g){
      var card = document.createElement('div');
      card.className = 'gift-card';
      card.innerHTML = '<span class="gift-emoji">' + g.emoji + '</span>' +
                       '<div class="gift-name">' + g.name + '</div>' +
                       '<div class="gift-price">' + g.price + '💰</div>';
      card.addEventListener('click', function(){ buyAndSendGift(g); });
      grid.appendChild(card);
    });
    updateMoneyDisplays();
  }

  function buyAndSendGift(gift) {
    if (state.me.money < gift.price) {
      toast('❌ Нужно ' + gift.price + '💰');
      return;
    }
    var chatId = state.activeChatId || 'favorites';
    var chat = state.chats.find(function(c){ return c.id === chatId; });
    if (!chat) return;

    state.me.money -= gift.price;
    chat.messages.push({
      id: 'm_' + Date.now(), text: 'Подарок: ' + gift.name,
      author: state.me.name, fromMe: true, time: Date.now(),
      read: false, gift: gift, reactions: []
    });
    state.me.gifts.push({ emoji: gift.emoji, name: gift.name, date: Date.now() });
    save();
    updateMoneyDisplays();
    renderMyGifts();
    toast('🎁 ' + gift.name + ' отправлен!');
    if (state.activeChatId === chat.id) renderMessages(chat);
    renderChatList();

    // Бот реагирует (кроме Избранного)
    var isBotChat = !chat.isFavorites && !chat.isGroup && !chat.isCasino;
    var groupHasOthers = chat.isGroup && chat.memberList && chat.memberList.length > 1;

    if (isBotChat || groupHasOthers) {
      setTimeout(function(){
        if (state.activeChatId === chat.id) showTyping(chat);
      }, 600);

      setTimeout(function(){
        var replyAuthor = chat.name;
        var rp = false, rv = false;
        if (groupHasOthers) {
          var other = chat.memberList.find(function(m){ return m.name !== state.me.name; });
          if (other) { replyAuthor = other.name; rp = !!other.premium; rv = !!other.verified; }
        }
        chat.messages.push({
          id: 'm_' + Date.now() + Math.random(),
          text: botGiftReaction(gift, state.me),
          author: replyAuthor,
          authorPremium: rp, authorVerified: rv,
          fromMe: false, time: Date.now(), read: true, reactions: []
        });
        var ti = $('typingIndicator');
        if (ti) ti.remove();
        save();
        if (state.activeChatId === chat.id) renderMessages(chat);
        renderChatList();
      }, 1400 + Math.random() * 1200);
    }
  }

  function renderMyGifts() {
    var el = $('myGiftsList');
    if (!el) return;
    if (!state.me.gifts || state.me.gifts.length === 0) {
      el.innerHTML = 'Пока нет подарков.';
      return;
    }
    el.innerHTML = state.me.gifts.map(function(g){
      return '<div style="display:flex;align-items:center;gap:8px;padding:6px 0;' +
        'border-bottom:1px solid rgba(255,255,255,.06);">' +
        '<span style="font-size:1.6em;">' + g.emoji + '</span>' +
        '<span style="flex:1;">' + escapeHtml(g.name) + '</span></div>';
    }).join('');
  }

  // ============================================================
  //  АДМИН-ПАНЕЛЬ
  // ============================================================
  function openAdminPanel() {
    var chat = state.chats.find(function(c){ return c.id === state.activeChatId; });
    if (!chat || !chat.isSecret || !canModerate(chat)) return;
    chatView.classList.add('hidden');
    adminPanel.classList.remove('hidden');
    var myRole = getMyRole(chat);
    $('adminTitle').textContent = myRole === 'owner' ? '👑 Владелец' : '⭐ Совладелец';
    renderAdminMembers(chat);
  }
  function closeAdminPanel() {
    adminPanel.classList.add('hidden');
    if (state.activeChatId) chatView.classList.remove('hidden');
    else main.classList.remove('hidden');
  }
  function renderAdminMembers(chat) {
    var list = $('adminMembersList');
    list.innerHTML = '';
    var myRole = getMyRole(chat);
    var iAmOwner = (myRole === 'owner');

    chat.memberList.forEach(function(m, idx){
      var div = document.createElement('div');
      div.className = 'admin-user-row';
      var roleLabel = m.role === 'owner' ? '👑 Владелец' :
                      m.role === 'coowner' ? '⭐ Совладелец' : 'Участник';
      var roleColor = m.role === 'owner' ? '#ffd54f' :
                      m.role === 'coowner' ? '#4a9eff' : '#8fbcd8';
      var color = '#' + Math.floor(Math.abs(Math.sin(idx + 1) * 1000000)).toString(16).slice(0,6);
      var initial = (m.name || '?').charAt(0).toUpperCase();

      div.innerHTML =
        '<div class="au-avatar" style="background:' + color + ';">' + initial + '</div>' +
        '<div class="au-info">' +
          '<div class="au-name">' + escapeHtml(m.name) +
            (m.premium ? ' <span class="premium-badge">⭐</span>' : '') +
            (m.verified ? ' <span class="verified-badge">✓</span>' : '') +
          '</div>' +
          '<div class="au-role" style="color:' + roleColor + '">' + roleLabel +
            (m.banned ? ' · 🚫 ЗАБАНЕН' : '') +
            (m.warnings > 0 ? ' · ⚠️ ' + m.warnings + '/3' : '') +
          '</div>' +
        '</div>';

      var actions = document.createElement('div');
      actions.className = 'admin-actions';

      if (m.name === state.me.name) {
        actions.innerHTML = '<span style="color:#8fbcd8;font-size:clamp(9px,2.4vw,16px);">' +
          'Это ты — роль: ' + roleLabel + '</span>';
      } else if (iAmOwner) {
        var verifyBtn = document.createElement('button');
        verifyBtn.className = 'admin-btn gold';
        verifyBtn.textContent = m.verified ? 'Снять ✓' : 'Дать ✓';
        verifyBtn.addEventListener('click', function(){
          m.verified = !m.verified; save();
          renderAdminMembers(chat); toast(m.verified ? '✓ Выдано' : 'Снято');
        });
        actions.appendChild(verifyBtn);

        var premiumBtn = document.createElement('button');
        premiumBtn.className = 'admin-btn gold';
        premiumBtn.textContent = m.premium ? 'Снять ⭐' : 'Дать ⭐';
        premiumBtn.addEventListener('click', function(){
          m.premium = !m.premium; save();
          renderAdminMembers(chat); toast(m.premium ? '⭐ Выдано' : 'Снято');
        });
        actions.appendChild(premiumBtn);

        var giftBtn = document.createElement('button');
        giftBtn.className = 'admin-btn gold';
        giftBtn.textContent = '🎁 Подарок';
        giftBtn.addEventListener('click', function(){ openGiftPicker(chat, m); });
        actions.appendChild(giftBtn);

        var warnBtn = document.createElement('button');
        warnBtn.className = 'admin-btn';
        warnBtn.textContent = '⚠️ Предупредить';
        warnBtn.addEventListener('click', function(){
          m.warnings = (m.warnings || 0) + 1;
          if (m.warnings >= 3) { m.banned = true; toast('🚫 Автобан'); }
          else toast('⚠️ ' + m.warnings + '/3');
          save(); renderAdminMembers(chat);
        });
        actions.appendChild(warnBtn);

        if (!m.banned) {
          var banBtn = document.createElement('button');
          banBtn.className = 'admin-btn danger';
          banBtn.textContent = '🚫 Забанить';
          banBtn.addEventListener('click', function(){
            showConfirm('Забанить ' + m.name + '?', function(){
              m.banned = true; save(); renderAdminMembers(chat); toast('🚫 Забанен');
            });
          });
          actions.appendChild(banBtn);
        } else {
          var unbanBtn = document.createElement('button');
          unbanBtn.className = 'admin-btn';
          unbanBtn.textContent = '✅ Разбанить';
          unbanBtn.addEventListener('click', function(){
            m.banned = false; m.warnings = 0; save();
            renderAdminMembers(chat); toast('✅ Разбанен');
          });
          actions.appendChild(unbanBtn);
        }
      } else if (myRole === 'coowner' && m.role !== 'owner') {
        var warnBtn2 = document.createElement('button');
        warnBtn2.className = 'admin-btn';
        warnBtn2.textContent = '⚠️ Предупредить';
        warnBtn2.addEventListener('click', function(){
          m.warnings = (m.warnings || 0) + 1;
          if (m.warnings >= 3) { m.banned = true; toast('🚫 Автобан'); }
          else toast('⚠️ ' + m.warnings + '/3');
          save(); renderAdminMembers(chat);
        });
        actions.appendChild(warnBtn2);

        if (!m.banned) {
          var banBtn2 = document.createElement('button');
          banBtn2.className = 'admin-btn danger';
          banBtn2.textContent = '🚫 Забанить';
          banBtn2.addEventListener('click', function(){
            showConfirm('Забанить ' + m.name + '?', function(){
              m.banned = true; save(); renderAdminMembers(chat); toast('🚫 Забанен');
            });
          });
          actions.appendChild(banBtn2);
        }
      }

      div.appendChild(actions);
      list.appendChild(div);
    });
  }

  function openGiftPicker(chat, member) {
    var overlay = document.createElement('div');
    overlay.className = 'confirm-dialog';
    overlay.innerHTML = '<div class="confirm-box"><p>Подарок для ' +
      escapeHtml(member.name) + '</p><div id="giftPickerGrid" class="gifts-grid"></div>' +
      '<div class="btn-row" style="margin-top:16px;"><button class="btn-cancel" id="closeGiftPicker">Отмена</button></div></div>';

    var grid = overlay.querySelector('#giftPickerGrid');
    GIFTS.forEach(function(g){
      var card = document.createElement('div');
      card.className = 'gift-card';
      card.innerHTML = '<span class="gift-emoji">' + g.emoji + '</span>' +
                       '<div class="gift-name">' + g.name + '</div>' +
                       '<div class="gift-price">' + g.price + '💰</div>';
      card.addEventListener('click', function(){
        if (state.me.money < g.price) { toast('❌ Нужно ' + g.price + '💰'); return; }
        state.me.money -= g.price;
        chat.messages.push({
          id: 'm_' + Date.now(),
          text: '🎁 ' + state.me.name + ' подарил ' + g.name + ' игроку ' + member.name,
          author: 'Система', fromMe: false, system: true,
          time: Date.now(), read: true, reactions: []
        });
        if (member.name !== state.me.name) {
          setTimeout(function(){
            if (state.activeChatId === chat.id) showTyping(chat);
          }, 400);
          setTimeout(function(){
            chat.messages.push({
              id: 'm_' + Date.now() + Math.random(),
              text: botGiftReaction(g, state.me),
              author: member.name,
              authorPremium: !!member.premium,
              authorVerified: !!member.verified,
              fromMe: false, time: Date.now(), read: true, reactions: []
            });
            var ti = $('typingIndicator');
            if (ti) ti.remove();
            save();
            if (state.activeChatId === chat.id) renderMessages(chat);
            renderChatList();
          }, 1400 + Math.random() * 1000);
        }
        save(); overlay.remove();
        updateMoneyDisplays();
        renderAdminMembers(chat);
        if (state.activeChatId === chat.id) renderMessages(chat);
        toast('🎁 ' + g.name + ' подарен ' + member.name);
      });
      grid.appendChild(card);
    });

    overlay.querySelector('#closeGiftPicker').addEventListener('click', function(){ overlay.remove(); });
    overlay.addEventListener('click', function(e){ if (e.target === overlay) overlay.remove(); });
    document.body.appendChild(overlay);
  }

  // ============================================================
  //  ПОДТВЕРЖДЕНИЕ
  // ============================================================
  function showConfirm(text, onOk) {
    var overlay = document.createElement('div');
    overlay.className = 'confirm-dialog';
    overlay.innerHTML = '<div class="confirm-box"><p>' + text + '</p>' +
      '<div class="btn-row"><button class="btn-cancel">Отмена</button>' +
      '<button class="btn-ok">Да</button></div></div>';
    overlay.querySelector('.btn-cancel').addEventListener('click', function(){ overlay.remove(); });
    overlay.querySelector('.btn-ok').addEventListener('click', function(){ overlay.remove(); onOk(); });
    overlay.addEventListener('click', function(e){ if (e.target === overlay) overlay.remove(); });
    document.body.appendChild(overlay);
  }

  // ============================================================
  //  НАВИГАЦИЯ
  // ============================================================
  function showTab(tab) {
    profileView.classList.add('hidden');
    giftsView.classList.add('hidden');
    settingsPanel.classList.add('hidden');
    chatView.classList.add('hidden');
    adminPanel.classList.add('hidden');
    casinoView.classList.add('hidden');
    main.classList.add('hidden');

    if (tab === 'chats') { main.classList.remove('hidden'); renderChatList(); }
    else if (tab === 'profile') { profileView.classList.remove('hidden'); updateProfileView(); }
    else if (tab === 'gifts') { giftsView.classList.remove('hidden'); renderGifts(); }

    document.querySelectorAll('.bottom-nav button').forEach(function(b){
      b.classList.toggle('active', b.dataset.tab === tab);
    });
  }

  // ============================================================
  //  ИНИЦИАЛИЗАЦИЯ
  // ============================================================
  var loaded = load();
  initChats();
  applyTheme();

  if (loaded && state.me.name && state.me.name !== 'Пользователь') {
    login.classList.add('hidden');
    main.classList.remove('hidden');
    $('myName').innerHTML = escapeHtml(state.me.name) +
      (state.me.premium ? ' <span class="premium-badge">⭐</span>' : '') +
      (state.me.verified ? ' <span class="verified-badge">✓</span>' : '');
    $('myAvatar').textContent = state.me.name.charAt(0).toUpperCase();
    $('myAvatar').style.background = state.me.color;
    renderChatList();
  } else {
    login.classList.remove('hidden');
    main.classList.add('hidden');
  }

  document.querySelectorAll('.theme-option').forEach(function(el){
    if (el.dataset.theme === state.theme) {
      el.classList.add('active');
      el.querySelector('.theme-check').textContent = '✓';
    }
  });

  // ============================================================
  //  ОБРАБОТЧИКИ
  // ============================================================
  $('startBtn').addEventListener('click', function(){
    var name = $('nameInput').value.trim();
    var user = $('userInput').value.trim().replace(/^@/, '');
    if (!name) { toast('Введи имя'); return; }
    state.me.name = name.slice(0, 30);
    state.me.username = user;
    if (!state.me.money) state.me.money = CASINO_START_MONEY;
    save();
    login.classList.add('hidden');
    main.classList.remove('hidden');
    $('myName').textContent = state.me.name;
    $('myAvatar').textContent = state.me.name.charAt(0).toUpperCase();
    $('myAvatar').style.background = state.me.color;
    renderChatList();
    toast('👋 Привет! У тебя ' + formatBigNumber(state.me.money) + '💰');
  });

  $('searchBtn').addEventListener('click', function(){
    $('searchBar').classList.toggle('hidden');
    if (!$('searchBar').classList.contains('hidden')) $('searchInput').focus();
  });
  $('closeSearch').addEventListener('click', function(){
    $('searchBar').classList.add('hidden');
    $('searchInput').value = '';
    renderChatList();
  });
  $('searchInput').addEventListener('input', function(){
    renderChatList($('searchInput').value);
  });

  $('settingsBtn').addEventListener('click', function(){ settingsPanel.classList.remove('hidden'); });
  $('closeSettings').addEventListener('click', function(){ settingsPanel.classList.add('hidden'); });
  document.querySelectorAll('.theme-option').forEach(function(el){
    el.addEventListener('click', function(){
      state.theme = el.dataset.theme;
      document.querySelectorAll('.theme-option').forEach(function(t){
        t.classList.remove('active');
        t.querySelector('.theme-check').textContent = '';
      });
      el.classList.add('active');
      el.querySelector('.theme-check').textContent = '✓';
      applyTheme(); save();
      toast('Тема: ' + (state.theme === 'dark' ? '🌙' : '☀️'));
    });
  });
  $('resetData').addEventListener('click', function(){
    showConfirm('Сбросить все данные?', function(){
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    });
  });

  $('sendBtn').addEventListener('click', sendMessage);
  msgInput.addEventListener('keydown', function(e){
    if (e.key === 'Enter') { e.preventDefault(); sendMessage(); }
  });
  $('emojiBtn').addEventListener('click', function(){ msgInput.value += '😊'; msgInput.focus(); });
  $('backToChats').addEventListener('click', closeChat);
  $('chatAdminBtn').addEventListener('click', openAdminPanel);
  $('closeAdmin').addEventListener('click', closeAdminPanel);
  $('chatMoreBtn').addEventListener('click', function(){
    var chat = state.chats.find(function(c){ return c.id === state.activeChatId; });
    if (!chat) return;
    var txt = '👤 ' + chat.name + '\n🔗 ' + (chat.username || '') + '\n📝 ' + (chat.bio || '');
    if (chat.isSecret) {
      txt += '\n\nУчастники:\n' + chat.memberList.map(function(m){
        return '· ' + m.name + ' — ' + (m.role === 'owner' ? 'Владелец' : 'Совладелец');
      }).join('\n');
    }
    alert(txt);
  });

  $('saveUsername').addEventListener('click', function(){
    var val = $('usernameField').value.trim().replace(/^@/, '');
    if (!val) { toast('Введи юзернейм'); return; }
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(val)) { toast('Только буквы, цифры, _ (3-20)'); return; }
    state.me.username = val;
    save(); updateProfileView();
    toast('✅ Юзернейм сохранён');
  });

  $('buyPremium').addEventListener('click', function(){
    if (state.me.premium) { toast('Уже активен'); return; }
    if (state.me.money < 5000) { toast('❌ Нужно 5000💰'); return; }
    state.me.money -= 5000;
    state.me.premium = true;
    save(); updateProfileView();
    toast('⭐ Премиум куплен!');
  });

  $('buyVerify').addEventListener('click', function(){
    if (state.me.verified) { toast('Уже активна'); return; }
    if (state.me.money < 3000) { toast('❌ Нужно 3000💰'); return; }
    state.me.money -= 3000;
    state.me.verified = true;
    save(); updateProfileView();
    toast('✓ Галочка куплена!');
  });

  // КАЗИНО
  $('closeCasino').addEventListener('click', closeChat);
  document.querySelectorAll('.bet-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      if (isSpinning) return;
      currentBet = parseInt(btn.dataset.bet, 10);
      document.querySelectorAll('.bet-btn').forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
    });
  });
  $('spinBtn').addEventListener('click', spin);

  document.querySelectorAll('.shop-buy').forEach(function(btn){
    btn.addEventListener('click', function(){
      var price = parseInt(btn.dataset.price, 10);
      if (state.me.money < price) { toast('❌ Нужно ' + price + '💰'); return; }
      if (btn.id === 'casinoBuyPremium') {
        if (state.me.premium) { toast('Уже есть'); return; }
        state.me.money -= price; state.me.premium = true;
        save(); renderCasino(); updateMoneyDisplays(); toast('⭐ Премиум куплен!');
      } else if (btn.id === 'casinoBuyVerify') {
        if (state.me.verified) { toast('Уже есть'); return; }
        state.me.money -= price; state.me.verified = true;
        save(); renderCasino(); updateMoneyDisplays(); toast('✓ Галочка куплена!');
      } else if (btn.dataset.gift) {
        var g = GIFTS.find(function(x){ return x.id === btn.dataset.gift; });
        if (!g) return;
        state.me.money -= price;
        state.me.gifts.push({ emoji: g.emoji, name: g.name, date: Date.now() });
        save(); renderCasino(); updateMoneyDisplays(); renderMyGifts();
        toast('🎁 ' + g.name + ' куплен!');
      }
    });
  });

  document.querySelectorAll('.bottom-nav button').forEach(function(btn){
    btn.addEventListener('click', function(){ showTab(btn.dataset.tab); });
  });

  $('backFromProfile').addEventListener('click', function(){ showTab('chats'); });
  $('backFromGifts').addEventListener('click', function(){ showTab('chats'); });

  document.addEventListener('touchmove', function(e){
    if (!e.target.closest('.messages') && !e.target.closest('#chatList') &&
        !e.target.closest('.panel-body') && !e.target.closest('#profileView') &&
        !e.target.closest('#giftsView') && !e.target.closest('#adminPanel') &&
        !e.target.closest('#casinoView')) {
      e.preventDefault();
    }
  }, { passive: false });

})();
</script>
</body>
</html>
