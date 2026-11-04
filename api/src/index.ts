import app from './app';
import { env } from './config/env';

app.listen(env.PORT, () => {
  console.info(`API de RunaGo escuchando en http://localhost:${env.PORT}`);
});
