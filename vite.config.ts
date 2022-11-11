import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path'; // 编辑器提示 path 模块找不到，可以yarn add @types/node --dev
import stylelintPlugin from 'vite-plugin-stylelint';

export default defineConfig({
    plugins: [vue(),
        stylelintPlugin({
            include: ['src/**/*.css', 'src/**/*.less', 'src/**/*.scss', 'src/**/*.sass', 'src/**/*.vue'],
            cache: false
        })
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src') // 设置 `@` 指向 `src` 目录
        }
    },
    server: {
        port: 3000, // 设置服务启动端口号
        open: true // 设置服务启动时是否自动打开浏览器
    }
});
