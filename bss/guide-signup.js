(function(){
const form=document.getElementById('guide-form'),status=document.getElementById('form-status'),button=form.querySelector('button');
let requestId=crypto.randomUUID(),inFlight=false;
form.addEventListener('submit',async function(event){
event.preventDefault();if(inFlight||!form.reportValidity())return;
const endpoint=window.BSS_GUIDE_CONFIG?.endpoint;
if(!endpoint||!endpoint.startsWith('https://')){status.textContent='Guide delivery is being connected. Please try again later.';return;}
inFlight=true;button.disabled=true;status.textContent='Preparing your guide…';
const payload={email:form.elements.email.value.trim(),firstName:form.elements.firstName.value.trim(),marketingConsent:form.elements.marketingConsent.checked,website:form.elements.website.value,requestId,source:'bss-free-guide',guide:'Your First AI Business Workflow'};
try{
const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({...payload,marketingConsent:String(payload.marketingConsent)}),credentials:'omit',signal:AbortSignal.timeout(25000)});
let result;try{result=await response.json();}catch{throw Error('invalid_response');}
if(!response.ok||result.saved!==true)throw Error('not_saved');
const url=new URL('guide-ready.html',location.href);
if(result.emailSent!==true)url.searchParams.set('delivery','pending');
location.assign(url.href);
}catch(error){status.textContent='We couldn’t confirm your request. Please try again. You won’t be redirected until it has been saved.';}
finally{inFlight=false;button.disabled=false;}
});
})();