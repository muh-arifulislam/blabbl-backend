import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import { initSocket } from './app/sockets';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    for (const [key, value] of Object.entries(config)) {
      console.log(`config.${key} = ${value}`);
    }

    // seedSuperAdmin();

    server = app.listen(config.port, () => {
      console.log(`app is listening on port ${config.port}`);
    });

    initSocket(server);
  } catch (err) {
    console.log(err);
  }
}

main();

process.on('unhandledRejection', (err) => {
  console.log(`😈 unahandledRejection is detected , shutting down ...`, err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log(`😈 uncaughtException is detected , shutting down ...`);
  process.exit(1);
});
