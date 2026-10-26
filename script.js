const toggle=document.querySelector('.menu-toggle');const nav=document.querySelector('#primary-nav');
toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));nav.classList.toggle('open',!open)});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{toggle.setAttribute('aria-expanded','false');nav.classList.remove('open')}));
document.querySelectorAll('.copy-bio').forEach(button=>button.addEventListener('click',async()=>{const bio=[...button.parentElement.querySelectorAll('p')].map(p=>p.textContent).join('\n\n');try{await navigator.clipboard.writeText(bio);const old=button.textContent;button.textContent='Copied';setTimeout(()=>button.textContent=old,2000)}catch{button.textContent='Select text to copy'}}));
const form=document.querySelector('#booking-form');form?.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;const data=new FormData(form);const lines=[['Name','name'],['Organisation','organisation'],['Email','email'],['Event','event'],['Preferred date','date'],['Location / virtual','location'],['Speaking format','format'],['Audience size','audience'],['Message','message']].map(([label,key])=>`${label}: ${data.get(key)||'Not provided'}`);const subject=`Booking enquiry: ${data.get('event')||'Leigh Smyth speaking event'}`;const url=`mailto:Leigh@impactmatch.global?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;window.location.href=url;document.querySelector('#form-note').textContent='Your email app should open with the enquiry ready to send. Please send the email there to complete your enquiry.'});


const prefersReducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const brandsTrack=document.querySelector('.brands-track');
if(brandsTrack&&!prefersReducedMotion){
  const duplicate=brandsTrack.querySelector('.brands-list').cloneNode(true);
  duplicate.setAttribute('aria-hidden','true');
  brandsTrack.append(duplicate);
  brandsTrack.classList.add('is-animated');
  brandsTrack.parentElement.classList.add('is-animated');
}

const impactBand=document.querySelector('.impact-band');
const counters=[...document.querySelectorAll('.stat strong[data-count]')];
if(impactBand&&counters.length&&!prefersReducedMotion&&'IntersectionObserver' in window){
  const formatCount=(number,value)=>{
    const suffix=number.dataset.suffix||'';
    if(number.dataset.format==='millions'){
      if(value>=1000000)return '1m'+suffix;
      if(value>=1000)return Math.floor(value/1000)+'k'+suffix;
    }
    return value.toLocaleString('en-GB')+suffix;
  };
  const finalLabels=counters.map(number=>number.textContent);
  counters.forEach(number=>{number.textContent=formatCount(number,0)});
  const observer=new IntersectionObserver(entries=>{
    if(!entries[0].isIntersecting)return;
    observer.disconnect();
    const duration=1800;
    let start;
    const tick=time=>{
      if(start===undefined)start=time;
      const progress=Math.min((time-start)/duration,1);
      const eased=1-Math.pow(1-progress,3);
      counters.forEach((number,index)=>{
        const target=Number(number.dataset.count);
        number.textContent=progress===1?finalLabels[index]:formatCount(number,Math.round(target*eased));
      });
      if(progress<1)requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  },{threshold:0.35});
  observer.observe(impactBand);
}
