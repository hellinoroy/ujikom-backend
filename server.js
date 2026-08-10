const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models/index');

const authRoutes = require('./routes/authRoutes');
const kategoriRoutes = require('./routes/kategoriRoutes');
const bukuRoutes = require('./routes/bukuRoutes');
const peminjamRoutes = require('./routes/peminjamRoutes');


require('dotenv').config();

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:5173' }))

app.use('/api/auth', authRoutes);
app.use('/api/kategori', kategoriRoutes);
app.use('/api/buku', bukuRoutes);
app.use('/api/peminjam', peminjamRoutes);

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Database connected…');
        // overwrite db tables
        // await sequelize.sync({ force: true });

        app.listen(8080, () => {
            console.log('Server running on http://localhost:8080');
        });

    } catch (error) {
        console.error('Error starting server:', error);
    }
}

startServer();