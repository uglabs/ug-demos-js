import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import basicSsl from '@vitejs/plugin-basic-ssl'
import path from 'path'
import fs from 'fs'

const sdkPath = path.resolve(__dirname, '../ug-js-sdk')
const isSdkPathExists = fs.existsSync(sdkPath)
if (isSdkPathExists) {
  console.log('Found local SDK under ../ug-js-sdk - prioritizing it')
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    basicSsl(),
    viteStaticCopy({
      targets: [
        {
          src: path.resolve(
            __dirname,
            'node_modules/@ricky0123/vad-web/dist/vad.worklet.bundle.min.js'
          ),
          dest: 'static/binaries',
        },
        {
          src: path.resolve(__dirname, 'node_modules/@ricky0123/vad-web/dist/*.onnx'),
          dest: 'static/binaries',
        },
        {
          src: path.resolve(__dirname, 'node_modules/onnxruntime-web/dist/*.wasm'),
          dest: 'static/binaries',
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      ...(isSdkPathExists && { 'ug-js-sdk': path.resolve(sdkPath, 'dist/ug-js-sdk.mjs') }),
    },
  },
  optimizeDeps: {
    force: true,
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        entryFileNames: `static/js/[name].[hash].js`,
        chunkFileNames: `static/js/[name].[hash].js`,
        assetFileNames: `static/assets/[name].[hash].[ext]`,
      },
    },
  },
})
