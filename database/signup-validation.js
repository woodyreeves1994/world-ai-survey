(function(root){
  function validateSignup(body){
    if(!body || body.consent!==true) return {error:'Please agree to receive the study findings.'};
    if(typeof body.receipt!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.receipt))return {error:'A completed survey is required.'};
    if(typeof body.email!=='string')return {error:'Enter a valid email address.'};
    const email=body.email.trim().toLowerCase();
    if(email.length>254||!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email))return {error:'Enter a valid email address.'};
    return {email,receipt:body.receipt};
  }
  if(typeof module!=='undefined'&&module.exports)module.exports={validateSignup};
  else root.TelescopicSignupValidation={validateSignup};
})(typeof window!=='undefined'?window:globalThis);
