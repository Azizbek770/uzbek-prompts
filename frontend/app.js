const state={type:'all',category:'all',sort:'newest',authMode:'login'};
const $=id=>document.getElementById(id);
const token=()=>localStorage.getItem('up_token');
const categories=[
 ['🎬','Cinematic','Film, scenes & storytelling'],['👤','Portrait','People & character portraits'],['🎨','Anime','Anime & illustration'],['📦','Product','Product photography & ads'],
 ['👕','Fashion','Clothing & editorial style'],['🧊','3D','3D, CGI & renders'],['✍️','Marketing','Ads, copy & campaigns'],['💻','Coding','Programming & software'],
 ['📚','Education','Learning & teaching'],['💼','Business','Business & strategy'],['📱','Social Media','Posts, reels & content'],['📝','Writing','Articles, stories & editing'],
 ['⚡','Productivity','Planning & workflows'],['🎵','Audio','Voice, music & sound'],['🍔','Food','Food photography & recipes'],['✈️','Travel','Travel & destination content'],
 ['🧠','Research','Research & analysis'],['💻', 'Technology', 'Technology, AI & futuristic ideas'],['🎯','Other','Other useful prompts'],
];
function esc(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function typeLabel(t){return t==='video'?'VIDEO':t==='text'?'TEXT':'IMAGE'}
function typeIcon(t){return t==='video'?'🎬':t==='text'?'✍️':'✦'}
function safeUser(){try{return JSON.parse(localStorage.getItem('up_user')||'null')}catch{return null}}
function scrollToId(id){$(id)?.scrollIntoView({behavior:'smooth',block:'start'})}

async function loadPrompts(){
 const grid=$('grid');grid.innerHTML='<div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div>';
 const p=new URLSearchParams({q:$('q').value.trim(),type:state.type,category:state.category,sort:state.sort});
 try{const r=await fetch('/api/prompts?'+p);const data=await r.json();if(!r.ok)throw new Error(data.message);$('statPrompts').textContent=data.length;renderPrompts(data)}
 catch(e){grid.innerHTML='<div class="empty"><h3>Could not load prompts</h3><p>Please make sure the server and database are running.</p><button class="btn btn-primary" onclick="openPromptModal()">+ Publish a Prompt</button></div>'}
}
function renderPrompts(data){
 if(!data.length){$('grid').innerHTML='<div class="empty"><h3>No prompts found</h3><p>Be the first person to publish a useful prompt.</p><button class="btn btn-primary" onclick="openPromptModal()">+ Publish a Prompt</button></div>';return}
 $('grid').innerHTML=data.map(x=>`<article class="prompt-card" data-prompt-id="${esc(x._id)}"><div class="card-media">${x.imageUrl?`<img src="${esc(x.imageUrl)}" alt="${esc(x.title)}" onerror="this.style.display='none'">`:`<div class="media-placeholder">${typeIcon(x.type)}</div>`}<span class="type-pill">${typeLabel(x.type)}</span></div><div class="card-body"><div class="card-top"><div><div class="card-category">${esc(x.category||'Other')}</div><h3 class="card-title">${esc(x.title)}</h3></div></div>${x.description?`<p class="card-desc">${esc(x.description)}</p>`:''}<div class="prompt-preview">${esc(x.prompt)}</div><div class="card-footer"><span class="author">${esc(x.author?.name||'Community')} · <span class="like-count">♥ ${x.likes||0}</span> · ${x.views||0} views</span><div class="card-actions"><button class="action-btn like-btn${x.liked?' liked':''}" type="button" data-action="like" aria-label="Like prompt"><span class="like-icon">${x.liked?'♥':'♡'}</span><span>Like</span></button><button class="action-btn copy-btn" type="button" data-action="copy" aria-label="Copy prompt"><span>⧉</span><span>Copy</span></button></div></div></div></article>`).join('');
 document.querySelectorAll('.prompt-card [data-action=like]').forEach(btn=>btn.addEventListener('click',()=>likePrompt(btn.closest('.prompt-card').dataset.promptId,btn)));
 document.querySelectorAll('.prompt-card [data-action=copy]').forEach(btn=>btn.addEventListener('click',()=>{const card=btn.closest('.prompt-card');const prompt=data.find(x=>String(x._id)===String(card.dataset.promptId))?.prompt||'';copyPrompt(prompt,btn)}));
 data.forEach(x=>fetch('/api/prompts/'+x._id+'/view',{method:'POST'}).catch(()=>{}));
}
async function likePrompt(id,button){
 if(!token()){openAuth('login');return}
 if(button?.disabled)return;
 if(button)button.disabled=true;
 try{
  const r=await fetch('/api/prompts/'+id+'/like',{method:'POST',headers:{Authorization:'Bearer '+token()}});
  const d=await r.json();
  if(!r.ok){if(r.status===401){localStorage.removeItem('up_token');localStorage.removeItem('up_user');updateUser();openAuth('login')}else toast(d.message||'Could not update like.');return}
  if(button){button.classList.toggle('liked',!!d.liked);const icon=button.querySelector('.like-icon');if(icon)icon.textContent=d.liked?'♥':'♡';const count=button.closest('.card-footer')?.querySelector('.like-count');if(count)count.textContent='♥ '+d.likes;}
  toast(d.liked?'Liked':'Like removed');
 }catch(e){toast('Could not update like.')}finally{if(button)button.disabled=false}
}
async function copyPrompt(text,button){
 if(!text){toast('There is nothing to copy.');return}
 try{
  if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text)}else{const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.focus();ta.select();document.execCommand('copy');ta.remove()}
  if(button){button.classList.add('copied');const old=button.innerHTML;button.innerHTML='<span>✓</span><span>Copied</span>';setTimeout(()=>{button.classList.remove('copied');button.innerHTML=old},1400)}
  toast('Prompt copied ✓');
 }catch(e){toast('Could not copy the prompt. Please try again.')}
}
function toast(text){const t=$('toast');t.textContent=text;t.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove('show'),2200)}
function openModal(id){$(id)?.classList.add('open')}
function closeModal(id){$(id)?.classList.remove('open')}
function openAuth(mode='login'){state.authMode=mode;$('authMsg').textContent='';$('loginTab').classList.toggle('active',mode==='login');$('registerTab').classList.toggle('active',mode==='register');$('authName').classList.toggle('hidden',mode==='login');$('authName').value='';$('authTitle').textContent=mode==='login'?'Welcome back':'Create your account';$('authSubtitle').textContent=mode==='login'?'Log in to publish, like, and manage your prompts.':'Create an account in a few seconds and start sharing prompts.';$('authSubmit').textContent=mode==='login'?'Log In':'Sign Up';$('authPassword').value='';openModal('authModal')}
async function submitAuth(){
 const email=$('authEmail').value.trim(),password=$('authPassword').value;const body={email,password};if(state.authMode==='register')body.name=$('authName').value.trim();
 if(!email||!password||(state.authMode==='register'&&!body.name)){ $('authMsg').textContent='Please fill in all required fields.';return }
 const r=await fetch('/api/auth/'+(state.authMode==='register'?'register':'login'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const d=await r.json();
 if(!r.ok){$('authMsg').textContent=d.message||'Authentication failed.';return}
 localStorage.setItem('up_token',d.token);localStorage.setItem('up_user',JSON.stringify(d.user));closeModal('authModal');updateUser();toast(state.authMode==='login'?'Logged in successfully.':'Account created successfully.');
}
function updateUser(){
 const u=safeUser();
 $('loginBtn').classList.toggle('hidden',!!u);$('registerBtn').classList.toggle('hidden',!!u);$('userMenu').classList.toggle('hidden',!u);
 if(u){$('userMenu').textContent='👤 '+u.name;}
}
function openAccount(){const u=safeUser();if(!u){openAuth('login');return}$('accountName').textContent=u.name;$('accountEmail').textContent=u.email;$('myPrompts').classList.add('hidden');$('myPrompts').innerHTML='';openModal('accountModal')}
function openPromptModal(){if(!token()){openAuth('login');return}$('promptMsg').textContent='';$('promptForm').reset();$('pCategory').value='Cinematic';openModal('promptModal')}
async function createPrompt(e){
 e.preventDefault();$('promptMsg').textContent='';
 if(!token()){closeModal('promptModal');openAuth('login');return}
 const body={title:$('pTitle').value.trim(),prompt:$('pPrompt').value.trim(),description:$('pDescription').value.trim(),type:$('pType').value,category:$('pCategory').value,imageUrl:$('pImage').value.trim()};
 const r=await fetch('/api/prompts',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token()},body:JSON.stringify(body)});const d=await r.json();
 if(!r.ok){$('promptMsg').textContent=d.message||'Could not publish the prompt.';return}
 closeModal('promptModal');state.type='all';state.category='all';document.querySelectorAll('.chip').forEach(x=>x.classList.toggle('active',x.dataset.type==='all'));await loadPrompts();scrollToId('prompts');toast('Prompt published successfully ✓');
}
async function loadMyPrompts(){
 const box=$('myPrompts');box.classList.remove('hidden');box.innerHTML='<p class="muted">Loading your prompts...</p>';
 const r=await fetch('/api/prompts/mine',{headers:{Authorization:'Bearer '+token()}});const data=await r.json();
 if(!r.ok){box.innerHTML='<p class="form-msg">'+esc(data.message||'Could not load your prompts.')+'</p>';return}
 if(!data.length){box.innerHTML='<div class="mini-empty">You have not published any prompts yet.</div>';return}
 box.innerHTML='<div class="my-list">'+data.map(x=>`<div class="my-item"><div><b>${esc(x.title)}</b><span>${esc(x.category)} · ${x.likes||0} likes · ${x.views||0} views</span></div><button class="icon-btn" onclick="deletePrompt('${x._id}')">Delete</button></div>`).join('')+'</div>';
}
async function deletePrompt(id){if(!confirm('Delete this prompt?'))return;const r=await fetch('/api/prompts/'+id,{method:'DELETE',headers:{Authorization:'Bearer '+token()}});const d=await r.json();if(!r.ok){toast(d.message||'Could not delete prompt');return}toast('Prompt deleted');await loadMyPrompts();await loadPrompts()}
function renderCategories(){
 $('categoryGrid').innerHTML=categories.map(c=>`<button class="category-card" data-category="${esc(c[1])}"><div class="cat-icon">${c[0]}</div><b>${esc(c[1])}</b><span>${esc(c[2])}</span></button>`).join('');$('statCategories').textContent=categories.length;
 $('pCategory').innerHTML=categories.map(c=>`<option value="${esc(c[1])}">${esc(c[1])}</option>`).join('');
 document.querySelectorAll('.category-card').forEach(b=>b.addEventListener('click',()=>selectCategory(b.dataset.category)));
}
function selectCategory(c){state.category=c;document.querySelectorAll('.chip').forEach(x=>x.classList.toggle('active',x.dataset.type===state.type));loadPrompts();scrollToId('prompts')}
function logout(){localStorage.removeItem('up_token');localStorage.removeItem('up_user');closeModal('accountModal');updateUser();toast('You have been logged out.');}

document.addEventListener('DOMContentLoaded',()=>{
 renderCategories();updateUser();loadPrompts();
 $('loginBtn').onclick=()=>openAuth('login');$('registerBtn').onclick=()=>openAuth('register');$('userMenu').onclick=openAccount;
 $('loginTab').onclick=()=>openAuth('login');$('registerTab').onclick=()=>openAuth('register');$('authSubmit').onclick=submitAuth;
 $('addTopBtn').onclick=openPromptModal;$('heroAdd').onclick=openPromptModal;$('sectionAdd').onclick=openPromptModal;$('ctaAdd').onclick=openPromptModal;
 $('viewPromptsBtn').onclick=()=>scrollToId('prompts');$('searchBtn').onclick=loadPrompts;$('sort').onchange=e=>{state.sort=e.target.value;loadPrompts()};$('q').addEventListener('keydown',e=>{if(e.key==='Enter')loadPrompts()});
 document.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{state.type=b.dataset.type;document.querySelectorAll('.chip').forEach(x=>x.classList.toggle('active',x===b));loadPrompts()});
 $('promptForm').addEventListener('submit',createPrompt);$('logoutBtn').onclick=logout;$('myPromptsBtn').onclick=loadMyPrompts;
 document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>closeModal(b.dataset.close));
 window.addEventListener('click',e=>{if(e.target.classList.contains('modal'))e.target.classList.remove('open')});
});
