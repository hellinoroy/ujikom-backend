const express = require('express');
const { sequelize } = require('./models/index');

const authRoutes = require('./routes/authRoutes');
const kategoriRoutes = require('./routes/kategoriRoutes');
const bukuRoutes = require('./routes/bukuRoutes');


require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/kategori', kategoriRoutes);
app.use('/api/buku', bukuRoutes);

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