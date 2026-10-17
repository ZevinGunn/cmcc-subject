import {safeMessage} from './domain.js';

// Only operational profile fields leave the official authentication response.
// Customer IDs, identity documents, addresses and login credentials stay private.
export function accountProfile(data={}){
 const info=data.sinfo?.custInfo||data.custInfo||{},plan=data.sinfo?.prdInfo||data.prdInfo||{};
 const values={region:info.regionName,town:info.town_name,status:info.runCodeName,brand:info.smName,level:info.user_grade_code_name,openedAt:info.create_time,plan:plan.prod_prc_name,planFee:plan.mainPrcFee};
 return Object.fromEntries(Object.entries(values).filter(([,v])=>['string','number'].includes(typeof v)&&String(v).trim()!=='').map(([k,v])=>[k,safeMessage(v)]));
}
