(() => {
  'use strict';
  const config=window.SurveyDatabase;
  window.SurveySubmission={
    enabled:!!config?.enabled,
    createReceipt:()=>crypto.randomUUID(),
    async save({responses,receipt,startedAt}) {
      if(!config?.enabled) throw new Error('Response collection is not configured.');
      const response=await fetch(config.endpoint,{method:'POST',headers:{'Content-Type':'application/json',apikey:config.publishableKey},body:JSON.stringify({version:6,consent:true,receipt,responses,durationSeconds:Math.max(0,Math.floor((Date.now()-startedAt)/1000))}),signal:AbortSignal.timeout(22000)});
      const result=await response.json().catch(()=>({}));
      if(!response.ok||result.saved!==true||result.receipt!==receipt) throw new Error(result.error||'Your answers could not be saved. Please retry.');
      return result;
    }
  };
})();
