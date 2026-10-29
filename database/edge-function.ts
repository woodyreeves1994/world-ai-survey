// Only the publishable app key is embedded. Database credentials stay in the Edge runtime.
import './survey-model.js';
import './validation.js';
const model=(globalThis as any).SurveyModel;
const validate=(globalThis as any).WorldAISubmissionValidation.validateSubmission;
const allowedOrigin='https://woodyreeves1994.github.io';
const appKey='sb_publishable_0KaOgqh4VdpR6IAG9lgPdg_pw0JGzML';
Deno.serve(async (req:Request) => {
  const origin=req.headers.get('origin');
  const cors={'Access-Control-Allow-Origin':allowedOrigin,'Access-Control-Allow-Headers':'apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Max-Age':'3600','Vary':'Origin','Cache-Control':'no-store'};
  const reply=(status:number,body:unknown)=>new Response(JSON.stringify(body),{status,headers:{...cors,'Content-Type':'application/json'}});
  if(origin!==allowedOrigin) return new Response('Origin not allowed',{status:403});
  if(req.method==='OPTIONS') return new Response(null,{status:204,headers:cors});
  if(req.method!=='POST') return reply(405,{error:'Method not allowed.'});
  if(req.headers.get('apikey')!==appKey) return reply(401,{error:'App authentication required.'});
  if(!req.headers.get('content-type')?.startsWith('application/json')) return reply(415,{error:'JSON required.'});
  try {
    const reader=req.body?.getReader();
    if(!reader) return reply(400,{error:'Missing responses.'});
    const chunks:Uint8Array[]=[]; let size=0;
    while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>40000){await reader.cancel();return reply(413,{error:'Submission is too large.'});}chunks.push(value);}
    const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
    let body;try{body=JSON.parse(new TextDecoder().decode(bytes));}catch{return reply(400,{error:'Invalid JSON.'});}
    const validated=validate(body,model);
    if(validated.error) return reply(400,{error:validated.error});
    const url=Deno.env.get('SUPABASE_URL');const secret=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if(!url||!secret) return reply(503,{error:'Submission service unavailable.'});
    const identity=req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||req.headers.get('cf-connecting-ip')||body.receipt;
    const hmacKey=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
    const digest=await crypto.subtle.sign('HMAC',hmacKey,new TextEncoder().encode(new Date().toISOString().slice(0,10)+':'+identity));
    const hash=Array.from(new Uint8Array(digest)).map(n=>n.toString(16).padStart(2,'0')).join('');
    const headers={'apikey':secret,'Authorization':'Bearer '+secret,'Content-Type':'application/json'};
    const rate=await fetch(url+'/rest/v1/rpc/world_ai_consume_limit',{method:'POST',headers,body:JSON.stringify({p_actor:hash}),signal:AbortSignal.timeout(8000)});
    if(!rate.ok) return reply(503,{error:'Submission service unavailable. Please retry.'});
    if(await rate.json()!==true) return reply(429,{error:'Too many submissions. Please try again in 15 minutes.'});
    const insert=await fetch(url+'/rest/v1/world_ai_responses',{method:'POST',headers:{...headers,Prefer:'return=minimal'},body:JSON.stringify(validated.record),signal:AbortSignal.timeout(8000)});
    if(!insert.ok){const error=await insert.json().catch(()=>({}));if(error.code!=='23505')return reply(503,{error:'Your answers could not be saved. Please retry.'});}
    return reply(200,{saved:true,receipt:body.receipt});
  } catch {return reply(503,{error:'Your answers could not be saved. Please retry.'});}
});
