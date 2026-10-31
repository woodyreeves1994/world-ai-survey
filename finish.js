(() => {
  'use strict';
  const surveyURL='https://woodyreeves1994.github.io/world-ai-survey/';
  const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const image=src=>new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=src;});
  function lines(ctx,text,x,y,width,lineHeight){
    let line='';for(const word of text.split(' ')){const next=line?line+' '+word:word;if(ctx.measureText(next).width>width&&line){ctx.fillText(line,x,y);line=word;y+=lineHeight;}else line=next;}ctx.fillText(line,x,y);return y+lineHeight;
  }
  function perspectives(report){
    if(report.perspectives)return report.perspectives;
    const score=key=>report.dimensions.find(d=>d.key===key)?.value??50;
    return [
      ['CHANGE',score('pressure')<=35?'Taking change in stride':score('pressure')>=65?'Looking for room to catch up':'Finding my own pace'],
      ['EVERYDAY AI',score('reliance')<=35?'A light touch':score('reliance')>=65?'Part of my everyday life':'Useful, with limits'],
      ['MY DECISIONS',score('ownership')<=35?'The outcome matters most':score('ownership')>=65?'Keeping the choice mine':'A balance of help and agency']
    ];
  }
  async function drawCard(canvas,report){
    await document.fonts.ready;
    const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Image preview unavailable.');
    ctx.fillStyle='#efede3';ctx.fillRect(0,0,1080,1350);
    const logo=await image('assets/telescopic-wordmark.svg');ctx.drawImage(logo,78,72,370,42);
    ctx.fillStyle='#b65538';ctx.beginPath();ctx.arc(972,91,10,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#65645e';ctx.font='500 21px "DM Sans", sans-serif';ctx.fillText('MY HUMAN PERSPECTIVE',80,190);
    ctx.fillStyle='#141413';ctx.font='400 77px "Lora", Georgia';lines(ctx,report.title,75,295,900,91);
    ctx.font='400 27px "DM Sans", sans-serif';ctx.fillStyle='#65645e';ctx.fillText('A snapshot of how life with AI feels to me.',80,575);
    perspectives(report).forEach(([label,value],i)=>{const y=685+i*143;ctx.fillStyle='#79644d';ctx.font='500 19px "DM Sans", sans-serif';ctx.fillText(label,80,y);ctx.fillStyle='#141413';ctx.font='500 31px "DM Sans", sans-serif';lines(ctx,value,80,y+47,470,40);});
    const art=window.SurveyArt.render('tea').replaceAll('#fff5e6','#2f3c41').replaceAll('#f08073','#ba644c');
    const artURL=URL.createObjectURL(new Blob([art],{type:'image/svg+xml'}));
    try{ctx.drawImage(await image(artURL),610,690,390,390);}finally{URL.revokeObjectURL(artURL);}
    ctx.strokeStyle='#c8c4b7';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(80,1145);ctx.lineTo(1000,1145);ctx.stroke();
    ctx.fillStyle='#141413';ctx.font='400 30px "Lora", Georgia';ctx.fillText('You’re not alone in how you feel.',80,1210);
    ctx.fillStyle='#65645e';ctx.font='400 22px "DM Sans", sans-serif';ctx.fillText('Take the survey · woodyreeves1994.github.io/world-ai-survey',80,1260);
    return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('Image could not be created.')),'image/png'));
  }
  function download(blob){const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='my-telescopic-perspective.png';link.click();setTimeout(()=>URL.revokeObjectURL(url),60000);}
  function mount({main,report,receipt,contributed}){
    main.innerHTML=`<article class="finish scene"><header class="finish-heading"><h1 tabindex="-1">One perspective.<br>A bigger picture.</h1><p>Thank you for sharing how you feel. Your answers will help us understand what we’re experiencing together.</p></header><div class="finish-grid"><div class="finish-left"><section class="finish-email"><h2>See what we find.</h2><p>Leave your email and we’ll share the collective findings when they’re ready.</p><form id="resultsEmailForm"><label for="resultsEmail">Email address <span>(optional)</span></label><input id="resultsEmail" type="email" name="email" autocomplete="email" placeholder="you@example.com" maxlength="254" required><label class="email-consent"><input id="emailConsent" type="checkbox" required><span>I’d like an email with the findings from this study.</span></label><button class="primary" id="emailSubmit" type="submit">Send me the findings <span aria-hidden="true">→</span></button><p class="email-privacy">Only this study’s findings. Your email is stored privately, separately from your answers.</p><p class="finish-status" id="emailStatus" role="status"></p></form></section><div><button class="invite-card" id="shareSurvey" type="button"><span><strong>Invite another perspective.</strong><small>Share the survey with someone.<br>Help more people feel a little less alone.</small></span><span class="invite-arrow" aria-hidden="true">↗</span></button><p class="finish-status" id="linkStatus" role="status"></p><input class="copy-link" id="surveyLink" aria-label="Survey link to copy" value="${surveyURL}" readonly hidden></div></div><figure class="share-portrait"><canvas id="resultCard" width="1080" height="1350" role="img" aria-label="Your shareable perspective: ${escape(report.title)}. ${escape(perspectives(report).map(p=>p[1]).join('. '))}"></canvas><div class="portrait-actions"><button class="primary" id="downloadCard" type="button" disabled>Save image <span aria-hidden="true">↓</span></button><button class="secondary" id="shareCard" type="button" disabled>Share image <span aria-hidden="true">↗</span></button></div><figcaption>A little picture of your perspective. Your email and written reflection are never included.</figcaption><p class="finish-status" id="imageStatus" role="status">Preparing your image…</p></figure></div><details class="finish-receipt"><summary>Submission details</summary><p>${contributed?'Your answers are saved.':'Answers have not been sent.'} Reference: ${escape(receipt||'—')}</p></details></article>`;
    const form=main.querySelector('#resultsEmailForm');
    form.addEventListener('submit',async event=>{
      event.preventDefault();
      if(!form.reportValidity())return;
      const button=main.querySelector('#emailSubmit'),status=main.querySelector('#emailStatus');
      if(button.disabled)return;button.disabled=true;status.textContent='Saving your email…';
      try{
        const config=window.SurveyDatabase;
        const response=await fetch(config.signupEndpoint,{method:'POST',headers:{'Content-Type':'application/json',apikey:config.publishableKey},body:JSON.stringify({email:main.querySelector('#resultsEmail').value,consent:main.querySelector('#emailConsent').checked,receipt}),signal:AbortSignal.timeout(22000)});
        const data=await response.json().catch(()=>({}));if(!response.ok||data.saved!==true)throw new Error(data.error||'We couldn’t save your email. Please retry.');
        status.textContent='You’re on the list. We’ll email the findings when they’re ready.';button.textContent='You’re on the list ✓';main.querySelector('#resultsEmail').disabled=true;main.querySelector('#emailConsent').disabled=true;
      }catch(error){status.textContent=error.message||'We couldn’t save your email. Please retry.';button.disabled=false;}
    });
    main.querySelector('#shareSurvey').addEventListener('click',async()=>{
      const status=main.querySelector('#linkStatus');
      try{if(navigator.share){await navigator.share({title:'Telescopic — How does life with AI feel?',text:'A little more understanding. A little less alone.',url:surveyURL});status.textContent='Thanks for making room for another perspective.';return;}}catch(error){if(error.name==='AbortError')return;}
      try{await navigator.clipboard.writeText(surveyURL);status.textContent='Link copied. Send it to someone you’d like to hear from.';}catch{const input=main.querySelector('#surveyLink');input.hidden=false;input.focus();input.select();status.textContent='Copy this link to share the survey.';}
    });
    let cardBlob=null;
    drawCard(main.querySelector('#resultCard'),report).then(blob=>{cardBlob=blob;main.querySelector('#downloadCard').disabled=false;main.querySelector('#shareCard').disabled=false;main.querySelector('#imageStatus').textContent='';}).catch(()=>{main.querySelector('#imageStatus').textContent='Your image couldn’t load. You can still share the survey link.';});
    main.querySelector('#downloadCard').addEventListener('click',()=>{if(cardBlob){download(cardBlob);main.querySelector('#imageStatus').textContent='Image saved. Add it to your favourite social app.';}});
    main.querySelector('#shareCard').addEventListener('click',async()=>{
      if(!cardBlob)return;const file=new File([cardBlob],'my-telescopic-perspective.png',{type:'image/png'});
      if(navigator.canShare?.({files:[file]})){
        try{await navigator.share({files:[file],title:'My Telescopic perspective'});return;}catch(error){if(error.name==='AbortError')return;}
      }
      download(cardBlob);main.querySelector('#imageStatus').textContent='Image saved. Upload it to your favourite social app.';
    });
  }
  window.TelescopicFinish={mount};
})();
