let csrf='',accountContext='';
export async function api(path,body){
 const response=await fetch(import.meta.env.BASE_URL+'api'+path,{method:body===undefined?'GET':'POST',headers:body===undefined?{}:{'Content-Type':'application/json','X-Local-CSRF':csrf,'X-Account-Context':accountContext},...(body===undefined?{}:{body:JSON.stringify(body)})});
 let data;try{data=await response.json();}catch{throw new Error('服务暂不可用，请稍后重试');}
 if(data.csrf)csrf=data.csrf;
 if('accountEpoch' in data)accountContext=`${data.activeAccountId||''}:${data.accountEpoch}`;
 if(!response.ok){const error=new Error(data.error?.message||'操作未完成');error.code=data.error?.code;throw error;}
 return data;
}
