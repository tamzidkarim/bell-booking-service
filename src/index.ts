process.on('uncaughtException', err => {
  console.log(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});
