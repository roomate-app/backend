import express from 'express';
import routerApi from './routes/index.js';
const app = express();
const port = 3000;
const baseUrl = "http://localhost:" + port;


app.get('/', (req, res) => {
  res.send('Hello World!');
});

routerApi(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
  console.log(`Example app listening at ${baseUrl}`);
});


export {app, baseUrl};


