const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models/index');

const JWT_SECRET = process.env.JWT_SECRET;

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password ) {
      return res.status(400).json({ message: 'Email atau Password tidak boleh kosong' });
    }
    
    const userLogin = await User.findOne({
      where: { email },
    });
    
    if (
      userLogin !== null &&
      (await bcrypt.compare(password, userLogin.password))
    ) {
      const token = jwt.sign(
        {
          id: userLogin.id,
          name: userLogin.name,
          role: userLogin.role,
        },
        JWT_SECRET,
        { expiresIn: '1d' }
      );
      
      res.status(200).json({ 
        message: 'Login berhasil',
        access_token: token
      });
      
    } else {
      res.status(401).json({ message: 'Email atau password Salah' });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const register = async (req, res) => {
  try {
    const { nama, email, password, role } = req.body;
    
    if (!nama || !email || !password ) {
        return res.status(400).json({ message: 'Nama, Email, atau Password tidak boleh kosong' });
    }
    
    await User.create(
      {
        nama,
        email,
        password,
        role: role || 'anggota'
      },
      {
        validate: true,
      }
    );
    
    res.status(201).json({ message: 'User berhasil dibuat' });
  } catch (error) {
    if (error.name == 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
            message: error.errors[0].message
        })
    }
    return res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = { 
  login, 
  register 
};