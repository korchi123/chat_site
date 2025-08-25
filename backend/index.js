import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import {DB} from './config/db.js'
import router from './routers/routers.js';
import ErrorHandlingMiddleware from './middleware.js/ErrorHandlingMiddleware.js';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const app = express();
const PORT=process.env.PORT || 5000
// Получаем текущий путь к файлу
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//const url=process.env.DB_URL
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: 'https://chat-site-frontend.onrender.com',
  //origin:"http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Сначала API маршруты
app.use('/api', router);

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: "working" });
});

// ✅ Добавьте проверку существования build папки
const buildPath = path.join(__dirname, '../client/build');

if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
  
  // ✅ Обработка всех GET запросов для SPA
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
} else {
  console.log('Build folder not found, serving API only');
}
app.use(ErrorHandlingMiddleware);


const start = async ()=>{
    try{
await DB.authenticate()
    console.log('Connection to DB established');
  

   
await DB.sync()
app.listen(PORT, console.log(`сервер запущен на ${PORT}`))
    } catch(e){
console.log(e)
    }
}

start()
