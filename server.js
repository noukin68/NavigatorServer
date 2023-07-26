const express = require('express');
var mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 5000;

var db  = mysql.createPool({
  connectionLimit : 10,
  host: 'marencid.beget.tech',
  user: 'marencid_map',
  password: 'Root123',
  database: 'marencid_map',
});

db.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
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

// Маршрут для добавления точки в базу данных
app.post('/addPoint', async (req, res) => {
  const { latitude, longitude, name } = req.body;

  try {
    db.query(
      'INSERT INTO points (latitude, longitude, name) VALUES (?, ?, ?)',
      [latitude, longitude, name],
      (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Ошибка базы данных' });
        }

        res.status(200).json({ id: result.insertId });
      }
    );
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'An error occurred while inserting data.' });
  }
});

// Маршрут для получения всех точек  из базы данных
app.get('/getPoints', async (req, res) => {
  try {
    db.query(
      'SELECT * FROM points',
      (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Ошибка базы данных' });
        }

        return res.status(200).json(rows);
      }
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(400).json({ error: 'An error occurred while fetching data.' });
  }
});

// Маршрут для получения точки
app.get('/getPointPes', async (req, res) => {
  const { latitude, longitude } = req.body;

  db.query(
    'SELECT * FROM points WHERE latitude = ? AND longitude = ?',
      [latitude, longitude],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Ошибка базы данных' });
      }

      return res.status(200).json({ message: 'Точка успешно получена' });
    }
  );
});
  
// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});