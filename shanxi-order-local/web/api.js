let csrf='';
export async function api(path,body){
 const response=await fetch('/api'+path,{method:body===undefined?'GET':'POST',headers:body===undefined?{}:{'Content-Type':'application/json','X-Local-CSRF':csrf},...(body===undefined?{}:{body:JSON.stringify(body)})});
 let data;try{data=await response.json();}catch{throw new Error('本地服务暂不可用，请重新启动');}
 if(data.csrf)csrf=data.csrf;
 if(!response.ok){const error=new Error(data.error?.message||'操作未完成');error.code=data.error?.code;throw error;}
 return data;
}
