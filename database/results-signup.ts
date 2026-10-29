import './signup-validation.js';
const validate=(globalThis as any).TelescopicSignupValidation.validateSignup;
const originAllowed='https://woodyreeves1994.github.io';
const appKey='sb_publishable_0KaOgqh4VdpR6IAG9lgPdg_pw0JGzML';
Deno.serve(async(req:Request)=>{
  const cors={'Access-Control-Allow-Origin':originAllowed,'Access-Control-Allow-Headers':'apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS','Cache-Control':'no-store','Vary':'Origin'};
  const reply=(status:number,body:unknown)=>new Response(JSON.stringify(body),{status,headers:{...cors,'Content-Type':'application/json'}});
  if(req.headers.get('origin')!==originAllowed)return reply(403,{error:'Origin not allowed.'});
  if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
  if(req.method!=='POST')return reply(405,{error:'Method not allowed.'});
  if(req.headers.get('apikey')!==appKey)return reply(401,{error:'App authentication required.'});
  if(!req.headers.get('content-type')?.startsWith('application/json'))return reply(415,{error:'JSON required.'});
  try{
    const reader=req.body?.getReader();if(!reader)return reply(400,{error:'Missing signup.'});
    const chunks:Uint8Array[]=[];let size=0;
    while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>2048){await reader.cancel();return reply(413,{error:'Signup too large.'});}chunks.push(value);}
    const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
    let body;try{body=JSON.parse(new TextDecoder().decode(bytes));}catch{return reply(400,{error:'Invalid JSON.'});}
    const data=validate(body);if(data.error)return reply(400,{error:data.error});
    const url=Deno.env.get('SUPABASE_URL'),secret=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if(!url||!secret)return reply(503,{error:'Signup unavailable. Please retry.'});
    const headers={'apikey':secret,'Authorization':'Bearer '+secret,'Content-Type':'application/json'};
    const identity=req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||req.headers.get('cf-connecting-ip')||data.receipt;
    const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
    const digest=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode('signup:'+new Date().toISOString().slice(0,10)+':'+identity));
    const hash=Array.from(new Uint8Array(digest)).map(n=>n.toString(16).padStart(2,'0')).join('');
    const rate=await fetch(url+'/rest/v1/rpc/world_ai_consume_limit',{method:'POST',headers,body:JSON.stringify({p_actor:hash}),signal:AbortSignal.timeout(8000)});
    if(!rate.ok)return reply(503,{error:'Signup unavailable. Please retry.'});
    if(await rate.json()!==true)return reply(429,{error:'Please try again in 15 minutes.'});
    const completed=await fetch(url+'/rest/v1/world_ai_responses?select=is_test&receipt=eq.'+encodeURIComponent(data.receipt),{headers,signal:AbortSignal.timeout(8000)});
    if(!completed.ok)return reply(503,{error:'Signup unavailable. Please retry.'});
    const records=await completed.json();if(!records.length)return reply(400,{error:'Please finish sending your survey first.'});
    const saved=await fetch(url+'/rest/v1/world_ai_results_subscribers',{method:'POST',headers:{...headers,Prefer:'return=minimal'},body:JSON.stringify({email:data.email,is_test:records[0].is_test}),signal:AbortSignal.timeout(8000)});
    if(!saved.ok){const error=await saved.json().catch(()=>({}));if(error.code!=='23505')return reply(503,{error:'We could not save your email. Please retry.'});}
    return reply(200,{saved:true});
  }catch{return reply(503,{error:'We could not save your email. Please retry.'});}
});
