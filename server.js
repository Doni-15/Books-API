const app = require('./app');

const port = Number(process.env.PORT || 5000);

app.listen(port, '127.0.0.1', () => {
  console.log(`Books API berjalan pada http://127.0.0.1:${port}`);
});
