import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    base: '/star-crossword/', // שנה לשם המאגר שלך
    plugins: [react()],
})
