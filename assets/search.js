
(function(){
var box=document.getElementById('q'),res=document.getElementById('res');
if(!box)return;
var idx=[],sel=-1,base=document.body.dataset.base||'';
fetch(base+'search-index.json').then(r=>r.json()).then(d=>{idx=d;});
function norm(s){return (s||'').toLowerCase().replace(/\s+/g,'');}
function score(e,q){
  var c=norm(e.c),t=norm(e.t);
  if(c===q)return 100; if(c.replace(/[:]/g,'')===q.replace(/[:]/g,''))return 95;
  if(c.indexOf(q)===0)return 80; if(c.indexOf(q)>=0)return 60;
  if(t.indexOf(q)===0)return 40; if(t.indexOf(q)>=0)return 20; return 0;}
function render(list){
  if(!list.length){res.classList.remove('open');return;}
  res.innerHTML=list.map(function(e,i){
    return '<a href="'+base+e.u+'" data-i="'+i+'"><span class="code">'+e.c+
      '</span>'+e.t+'<span class="badge b-'+e.k+'">'+e.n+'</span></a>';}).join('');
  res.classList.add('open');sel=-1;}
box.addEventListener('input',function(){
  var q=norm(box.value); if(!q){res.classList.remove('open');return;}
  var out=[];
  for(var i=0;i<idx.length;i++){var s=score(idx[i],q); if(s)out.push([s,idx[i]]);}
  out.sort(function(a,b){return b[0]-a[0];});
  render(out.slice(0,40).map(function(x){return x[1];}));});
box.addEventListener('keydown',function(e){
  var items=res.querySelectorAll('a'); if(!items.length)return;
  if(e.key==='ArrowDown'){e.preventDefault();sel=Math.min(sel+1,items.length-1);}
  else if(e.key==='ArrowUp'){e.preventDefault();sel=Math.max(sel-1,0);}
  else if(e.key==='Enter'){if(sel>=0){e.preventDefault();items[sel].click();}return;}
  else if(e.key==='Escape'){res.classList.remove('open');return;}
  else return;
  items.forEach(function(a){a.classList.remove('sel');});
  items[sel].classList.add('sel');items[sel].scrollIntoView({block:'nearest'});});
document.addEventListener('click',function(e){
  if(!res.contains(e.target)&&e.target!==box)res.classList.remove('open');});
})();
