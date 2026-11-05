import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    env: {
      DOTENV_CONFIG_PATH: 'no-existe.env',
      PORT: '3000',
      DATABASE_URL: 'postgresql://prueba:prueba@localhost:5432/prueba',
      DIRECT_URL: 'postgresql://prueba:prueba@localhost:5432/prueba',
      JWT_SECRET: 'secreto-solo-para-pruebas-con-mas-de-32-caracteres',
    },
  },
});
