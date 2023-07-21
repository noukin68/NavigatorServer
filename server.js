const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 5000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'navigator',
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});


app.use(cors());
app.use(express.json());

//Вход пользователя по номеру телефона
app.post('/login', (req, res) => {
    const { phoneNumber } = req.body;
  
    if (!phoneNumber) {
      return res.status(400).json({ message: 'Не указан номер телефона' });
    }
  
    // Проверяем, есть ли пользователь с указанным номером телефона в базе данных
    db.query(
      'SELECT * FROM phonenumbers WHERE phoneNumber = ?',
      [phoneNumber],
      (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Ошибка базы данных' });
        }
  
        // Если пользователь не найден, возвращаем сообщение о регистрации
        if (results.length === 0) {
          return res.status(401).json({ message: 'Пользователь не найден. Пожалуйста, зарегистрируйтесь.' });
        }
  
        // Вход пользователя
        res.status(200).json({ message: 'Вход выполнен успешно' });
      }
    );
});

//Регистрация пользователя
app.post('/register', (req, res) => {
    const { phoneNumber } = req.body;
  
    if (!phoneNumber) {
      return res.status(400).json({ message: 'Не указан номер телефона' });
    }
  
    // Добавляем пользователя в базу данных
    db.query(
      'INSERT INTO phonenumbers (phoneNumber) VALUES (?)',
      [phoneNumber],
      (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Ошибка базы данных' });
        }
  
        //Регистрация пользователя
        return res.status(200).json({ message: 'Регистрация успешно завершена' });
      }
    );
});
  
// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});