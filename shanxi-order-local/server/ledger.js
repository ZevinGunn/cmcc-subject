import fs from 'node:fs';
import path from 'node:path';
import {randomBytes,createHmac} from 'node:crypto';
export class Ledger {
 constructor(directory){
  fs.mkdirSync(directory,{recursive:true,mode:0o700}); fs.chmodSync(directory,0o700);
  this.directory=directory; this.file=path.join(directory,'orders.json');
  const keyFile=path.join(directory,'account-key');
  if(!fs.existsSync(keyFile)) fs.writeFileSync(keyFile,randomBytes(32),{mode:0o600,flag:'wx'});
  this.key=fs.readFileSync(keyFile);
  this.rows=fs.existsSync(this.file)?JSON.parse(fs.readFileSync(this.file,'utf8')):[];
  if(!Array.isArray(this.rows)) throw Error('本地办理记录损坏，请保留文件并联系维护者');
  let changed=false;
  for(const row of this.rows) if(row.status==='submitting'){row.status='unknown';row.message='服务曾中断，办理结果待核查';changed=true;}
  if(changed)this.save();
 }
 account(phone){return createHmac('sha256',this.key).update(phone).digest('hex');}
 save(){const tmp=this.file+'.tmp';fs.writeFileSync(tmp,JSON.stringify(this.rows,null,2),{mode:0o600});const fd=fs.openSync(tmp,'r');fs.fsyncSync(fd);fs.closeSync(fd);fs.renameSync(tmp,this.file);}
 add(row){this.rows.unshift(row);this.save();return row;}
 update(id,patch){const row=this.rows.find(r=>r.id===id);if(!row)throw Error('办理记录不存在');Object.assign(row,patch);this.save();return row;}
 list(account){return this.rows.filter(r=>r.account===account).map(({account,...row})=>row);}
 blocking(account,product='qqt5ga'){return this.rows.find(r=>r.account===account&&r.product===product&&['submitting','unknown','success','held'].includes(r.status));}
}
