// server.js
require('dotenv').config();
const path       = require('path');
const express    = require('express');
const mongoose   = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt     = require('bcrypt');

const app  = express();
const PORT = process.env.PORT || 3000;

// 1) Conectar a MongoDB Atlas
mongoose.connect('mongodb+srv://angi:OGtEktq78wSXcsdR@angi1.4qqtx1v.mongodb.net/?retryWrites=true&w=majority&appName=angi1', {
  useNewUrlParser:    true,
  useUnifiedTopology: true
})
.then(() => console.log('🔗 Conectado a MongoDB Atlas'))
.catch(err => console.error('❌ Error de conexión:', err));

// 2) Define esquema de usuario
const userSchema = new mongoose.Schema({
  username:     { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// 3) Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 4) Sirve archivos estáticos (tu index.html y assets)
app.use(express.static(path.join(__dirname, 'public')));

// 5) Ruta de login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).send('Usuario o contraseña incorrectos');
    }
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).send('Usuario o contraseña incorrectos');
    }
    // Aquí podrías emitir un JWT o establecer sesión…
    return res.send('✔️ Login exitoso');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error interno en el servidor');
  }
});

// 6) Inicia el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
