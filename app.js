fe3"}
const installEl = document.getElementById('install');
const statusEl = document.getElementById('statusTime');
const osEl = document.getElementById('os');
const logList = document.getElementById('logList');

const modal = document.getElementById('modal');
const logText = document.getElementById('logText');
const saveBtn = document.getElementById('saveLog');
const cancelBtn = document.getElementById('cancelLog');
const deleteBtn = document.getElementById('deleteLog');

let editingIndex = null;

function nowStr(){
  return new Date().toLocaleString();
}

if(!localStorage.getItem('install')){
  localStorage.setItem('install', nowStr());
}
installEl.textContent = localStorage.getItem('install');
statusEl.textContent = nowStr();
osEl.textContent = navigator.userAgent;

function tick(){
  statusEl.textContent = nowStr();
  setTimeout(tick,1000);
}
tick();

let start = new Date(localStorage.getItem('install'));
function updateTimer(){
  const diff = Date.now()-start.getTime();
  const s = Math.floor(diff/1000);
  const d = Math.floor(s/86400);
  const h = String(Math.floor((s%86400)/3600)).padStart(2,'0');
  const m = String(Math.floor((s%3600)/60)).padStart(2,'0');
  const ss = String(s%60).padStart(2,'0');
  document.getElementById('timer').textContent = ${d}일 ${h}:${m}:${ss};
  requestAnimationFrame(updateTimer);
}
updateTimer();

function getLogs(){
  return JSON.parse(localStorage.getItem('logs')||'[]');
}
function setLogs(v){
  localStorage.setItem('logs', JSON.stringify(v));
}
function renderLogs(){
  logList.innerHTML='';
  getLogs().forEach((l,i)=>{
    const div=document.createElement('div');
    div.className='log';
    div.textContent=l;
    div.onclick=()=>openEditor(i);
    logList.appendChild(div);
  });
}
renderLogs();

document.getElementById('addLog').onclick=()=>{
  const logs=getLogs();
  logs.unshift(nowStr()+" 상태 업데이트");
  setLogs(logs);
  renderLogs();
};

function openEditor(idx){
  editingIndex=idx;
  logText.value = getLogs()[idx];
  modal.classList.remove('hidden');
}
cancelBtn.onclick=()=>modal.classList.add('hidden');

saveBtn.onclick=()=>{
  const logs=getLogs();
  logs[editingIndex]=logText.value;
  setLogs(logs);
  renderLogs();
  modal.classList.add('hidden');
};

deleteBtn.onclick=()=>{
  const logs=getLogs();
  logs.splice(editingIndex,1);
  setLogs(logs);
  renderLogs();
  modal.classList.add('hidden');
};

const drawer=document.getElementById('drawer');
document.getElementById('menuBtn').onclick=()=>{
  drawer.classList.toggle('open');
};

document.querySelectorAll('.switch').forEach(sw=>{
  const key=sw.dataset.key;
  const val=localStorage.getItem(key)==='1';
  if(val) sw.classList.add('on');
  sw.onclick=()=>{
    sw.classList.toggle('on');
    localStorage.setItem(key, sw.classList.contains('on')?'1':'0');
  };
});

if('serviceWorker' in navigator){
  navigator.serviceWorker.register('service-worker.js
