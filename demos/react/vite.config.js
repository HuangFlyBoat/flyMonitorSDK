import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    cors: true, //为开发服务器配置 CORS , 默认启用并允许任何源
    port: '8080',
  },
});
