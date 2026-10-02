const prefersReducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const nav=document.querySelector('#main-nav');
const menu=document.querySelector('.menu-toggle');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}});
const techTriggers=[...document.querySelectorAll('.tech-trigger')];
techTriggers.forEach(trigger=>trigger.addEventListener('click',()=>{const willOpen=trigger.getAttribute('aria-expanded')!=='true';techTriggers.forEach(other=>{other.setAttribute('aria-expanded','false');document.getElementById(other.getAttribute('aria-controls')).hidden=true});if(willOpen){trigger.setAttribute('aria-expanded','true');document.getElementById(trigger.getAttribute('aria-controls')).hidden=false}}));
const figures=[...document.querySelectorAll('.gallery-item')];
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{const filter=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));figures.forEach(f=>f.hidden=filter!=='all'&&f.dataset.category!==filter);document.querySelector('#gallery-status').textContent=`当前展示 ${figures.filter(f=>!f.hidden).length} 张作品`;}));
const lightbox=document.querySelector('#lightbox');
const lightboxMedia=document.querySelector('#lightbox-media');
const resume=document.querySelector('#resume-dialog');
const previous=document.querySelector('#previous-image');
const next=document.querySelector('#next-image');
let currentImages=[],currentImage=0,returnFocus=null,videoMode=false;
function lockPage(){document.body.style.overflow='hidden'}
function clearMedia(){const video=lightboxMedia.querySelector('video');if(video){video.pause();video.removeAttribute('src');video.load()}lightboxMedia.replaceChildren()}
function showImage(index){clearMedia();videoMode=false;currentImage=index;const item=currentImages[index];const img=document.createElement('img');img.src=item.dataset.image;img.alt=item.dataset.title;lightboxMedia.append(img);document.querySelector('#lightbox-title').textContent=item.dataset.title;document.querySelector('#lightbox-count').textContent=`${String(index+1).padStart(2,'0')} / ${String(currentImages.length).padStart(2,'0')}`;document.querySelector('.lightbox-controls').hidden=false;previous.disabled=index===0;next.disabled=index===currentImages.length-1;}
document.querySelectorAll('[data-image]').forEach(button=>button.addEventListener('click',()=>{returnFocus=button;currentImages=figures.filter(f=>!f.hidden).map(f=>f.querySelector('[data-image]'));showImage(currentImages.indexOf(button));lightbox.showModal();lockPage()}));
previous.addEventListener('click',()=>{if(currentImage>0)showImage(currentImage-1)});
next.addEventListener('click',()=>{if(currentImage<currentImages.length-1)showImage(currentImage+1)});
lightbox.addEventListener('keydown',event=>{if(videoMode)return;if(event.key==='ArrowLeft'&&currentImage>0){event.preventDefault();showImage(currentImage-1)}if(event.key==='ArrowRight'&&currentImage<currentImages.length-1){event.preventDefault();showImage(currentImage+1)}});
document.querySelectorAll('[data-video]').forEach(button=>button.addEventListener('click',()=>{clearMedia();returnFocus=button;videoMode=true;document.querySelector('#lightbox-title').textContent=button.dataset.title;document.querySelector('#lightbox-count').textContent='MOTION';document.querySelector('.lightbox-controls').hidden=true;const video=document.createElement('video');const useMobileVideo=window.matchMedia('(max-width:767px)').matches;video.src=useMobileVideo?button.dataset.video.replace(/\.mp4$/,'.mobile.mp4'):button.dataset.video;video.poster=button.dataset.poster;video.controls=true;video.playsInline=true;video.preload='auto';lightboxMedia.append(video);lightbox.showModal();lockPage();video.play().catch(()=>{});}));
document.querySelector('#open-resume').addEventListener('click',event=>{returnFocus=event.currentTarget;resume.showModal();resume.scrollTop=0;lockPage()});
[lightbox,resume].forEach(dialog=>{dialog.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()});dialog.addEventListener('close',()=>{if(dialog===lightbox)clearMedia();document.body.style.overflow='';returnFocus?.focus({preventScroll:true})})});
let contactToastTimer;
async function copyWechat(){
 const result=document.querySelector('#contact-feedback');
 let copied=false;
 try{await navigator.clipboard.writeText('18326036425');copied=true}catch{
  const field=document.createElement('textarea');field.value='18326036425';field.setAttribute('readonly','');field.style.cssText='position:fixed;left:-9999px;top:0';document.body.append(field);field.select();
  try{copied=document.execCommand('copy')}catch{}finally{field.remove();document.querySelector('#copy-contact').focus({preventScroll:true})}
 }
 clearTimeout(contactToastTimer);result.textContent=copied?'已复制微信号：18326036425':'复制未成功，请手动复制：18326036425';result.classList.add('is-visible');
 contactToastTimer=setTimeout(()=>{result.classList.remove('is-visible');result.textContent=''},3500);
}
document.querySelector('#copy-contact').addEventListener('click',copyWechat);
document.querySelector('.contact-link').addEventListener('click',event=>{event.preventDefault();copyWechat();nav.classList.remove('open');menu.setAttribute('aria-expanded','false');history.replaceState(null,'','#wechat');document.querySelector('#wechat').scrollIntoView({behavior:prefersReducedMotion.matches?'instant':'smooth',block:'center'});document.querySelector('#copy-contact').focus({preventScroll:true});});
document.querySelector('#print-resume').addEventListener('click',()=>window.print());
let ticking=false;function updateProgress(){const total=document.documentElement.scrollHeight-innerHeight;document.querySelector('.reading-progress').style.width=`${total>0?scrollY/total*100:0}%`;ticking=false}addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(updateProgress);ticking=true}},{passive:true});updateProgress();
const navSections=[...document.querySelectorAll('main>section[id]')];
function updateActiveSection(){let current=navSections[0];for(const section of navSections){if(section.getBoundingClientRect().top<=160)current=section;}nav.querySelectorAll('a').forEach(a=>{const active=a.hash===`#${current.id}`;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')});}
addEventListener('scroll',updateActiveSection,{passive:true});updateActiveSection();
const flow=document.querySelector('.workflow');
const flowSvg=document.createElementNS('http://www.w3.org/2000/svg','svg');flowSvg.classList.add('workflow-lines');flowSvg.setAttribute('aria-hidden','true');flow.prepend(flowSvg);
function drawWorkflow(){
 const r=flow.getBoundingClientRect();if(r.width<1)return;
 flowSvg.setAttribute('viewBox',`0 0 ${r.width} ${r.height}`);
 let lines='<defs><marker id="flow-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7" fill="none" stroke="#777"/></marker></defs>';
 const edges=[['research','ai'],['ai','agent'],['agent','blender'],['blender','fluid'],['pbr','blender'],['blender','render'],['render','ae'],['ps','ae'],['ae','pr'],['pr','delivery']];
 for(const [from,to] of edges){const a=document.querySelector(`[aria-controls="tech-${from}"]`).getBoundingClientRect();const b=document.querySelector(`[aria-controls="tech-${to}"]`).getBoundingClientRect();let path;
 if(Math.abs(a.left-b.left)<5){const x=a.left+a.width/2-r.left;path=`M${x} ${a.bottom-r.top+2} V${b.top-r.top-5}`;if((from==='blender'&&to==='fluid')||(from==='pbr'&&to==='blender')){lines+=`<path d="M${x+10} ${b.top-r.top-5} V${a.bottom-r.top+2}" fill="none" stroke="#555" stroke-width="1" marker-end="url(#flow-arrow)"/>`;}}
 else{const x1=a.right-r.left-12,y1=a.top+a.height/2-r.top,x2=b.left-r.left+12,y2=b.top+b.height/2-r.top,mid=(x1+x2)/2;path=`M${x1} ${y1} H${mid} V${y2} H${x2}`;}
 lines+=`<path d="${path}" fill="none" stroke="#555" stroke-width="1" marker-end="url(#flow-arrow)"/>`;
 }flowSvg.innerHTML=lines;
}
new ResizeObserver(drawWorkflow).observe(flow);techTriggers.forEach(t=>t.addEventListener('click',()=>requestAnimationFrame(drawWorkflow)));document.fonts.ready.then(drawWorkflow);
