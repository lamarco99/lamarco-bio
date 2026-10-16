const fs=require('fs'),vm=require('vm'),assert=require('assert');
(async()=>{for(const [label,config,response,wantRedirect] of [
 ['missing backend',{},null,false],
 ['generic 200',{endpoint:'https://n8n.example/webhook'}, {ok:true,json:async()=>({message:'Workflow got started'})},false],
 ['Notion failure',{endpoint:'https://n8n.example/webhook'}, {ok:false,json:async()=>({saved:false})},false],
 ['saved email pending',{endpoint:'https://n8n.example/webhook'}, {ok:true,json:async()=>({saved:true,emailSent:false})},true],
 ['saved and emailed',{endpoint:'https://n8n.example/webhook'}, {ok:true,json:async()=>({saved:true,emailSent:true})},true]
]){
 let listener,redirect;const button={disabled:false},status={textContent:''};
 const form={elements:{email:{value:'test@example.com'},firstName:{value:'Test'},marketingConsent:{checked:false},website:{value:''}},reportValidity:()=>true,querySelector:()=>button,addEventListener:(_,f)=>listener=f};
 const context={document:{getElementById:id=>id==='guide-form'?form:status},window:{BSS_GUIDE_CONFIG:config},crypto:{randomUUID:()=> '00000000-0000-4000-8000-000000000000'},fetch:async()=>response,URL,URLSearchParams,AbortSignal,location:{href:'https://lamarco99.github.io/lamarco-bio/bss/free-guide.html',assign:u=>redirect=u}};
 vm.runInNewContext(fs.readFileSync('bss-native/guide-signup.js','utf8'),context);
 await listener({preventDefault(){}});
 assert.equal(!!redirect,wantRedirect,label);
 if(label==='saved email pending')assert(redirect.includes('delivery=pending'));
 assert.equal(button.disabled,false);
 console.log('PASS '+label);
}
const w=JSON.parse(fs.readFileSync('bss-native/backend/n8n-ai-guide.json'));assert.equal(w.active,false);
for(const n of w.nodes)assert(!n.credentials,'No credentials in export');
console.log('PASS workflow inactive and credential-free');
})();