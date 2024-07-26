const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const Item = require('./models/Item');

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// 同步数据库
sequelize.sync()
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// hello world
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// CRUD 路由
app.get('/items', async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/items/:id', async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      return res.status(404).send('Item not found');
    }
    res.json(item);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/items', async (req, res) => {
  try {
    const newItem = await Item.create(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.put('/items/:id', async (req, res) => {
  try {
    const [updated] = await Item.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) {
      return res.status(404).send('Item not found');
    }
    const updatedItem = await Item.findByPk(req.params.id);
    res.json(updatedItem);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.delete('/items/:id', async (req, res) => {
  try {
    const deleted = await Item.destroy({
      where: { id: req.params.id }
    });
    if (!deleted) {
      return res.status(404).send('Item not found');
    }
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});