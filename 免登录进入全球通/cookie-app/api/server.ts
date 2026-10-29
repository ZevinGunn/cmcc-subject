/**
 * local server entry file, for local development
 */
import app from './app.js';
import { getPrisma } from './services/prisma.js';

/**
 * start server with port
 */
const PORT = Number(process.env.PORT ?? process.env.API_PORT ?? 3101);

const start = async () => {
  await getPrisma().$connect();

  const server = app.listen(PORT, () => {
    console.log(`Server ready on port ${PORT}`);
  });

  /**
   * close server
   */
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT signal received');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
};

start().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Server startup failed: ${message}`);
  process.exit(1);
});

export default app;
