import 'dotenv/config';
import app from './app.ts';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ API ready on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
});