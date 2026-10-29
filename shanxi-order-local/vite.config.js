import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
const publicBuild=process.env.SHANXI_PUBLIC_BUILD==='1';
export default defineConfig({base:'/',define:{'import.meta.env.SHANXI_PUBLIC':JSON.stringify(publicBuild)},plugins:[vue()],root:'web',build:{outDir:publicBuild?'../dist-public':'../dist',emptyOutDir:true},server:{proxy:{'/api':'http://127.0.0.1:4318'}}});
