const path=require('node:path');
module.exports={apps:[
 {name:'shanxi-public',cwd:__dirname,script:'server/public.js',interpreter:process.execPath,instances:1,exec_mode:'fork',autorestart:true,max_memory_restart:'1G',kill_timeout:150000,env:{NODE_ENV:'production'}},
 {name:'shanxi-tunnel',cwd:__dirname,script:process.env.CLOUDFLARED_BIN||'/opt/homebrew/bin/cloudflared',args:['tunnel','--config',path.join(__dirname,'.public/tunnel.yml'),'run'],interpreter:'none',instances:1,exec_mode:'fork',autorestart:true,max_memory_restart:'256M',kill_timeout:15000},
]};
