import express from 'express';
const app = express();
app.get('/', (req, res) => res.send('Hello World'));
// eslint-disable-next-line no-console
app.listen(3000, () => console.log('API ready on port 3000'));