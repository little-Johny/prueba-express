const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { config } = require('../config/config');
const User = require('../models/user.model');

class AuthController {
  constructor(userRepository) {
    this.userRepository = userRepository;

    // Enlazar los metodos al contexto de clase
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.__signatureToken = this.__signatureToken.bind(this);
  }

  async register(req, res) {
    try {
      const user = new User(req.body);
      if (!user.isValid()) {
        return res.status(400).json({ message: 'Bad data'});
      }

      const exist = await this.userRepository.login(user.email);
      if(exist) return res.status(409).json({ message: `email in use`});
      
      const createdUser = await this.userRepository.register(user);

      // Generacion y firma de token
      const token = this.__signatureToken(createdUser);

      return res.status(201).json({
        data: {
          user: {
            id: createdUser.id,
            username: createdUser.username,
            email: createdUser.email,
          },
          token
        }
      });

    } catch (error) {
      console.error('register error', error);
      res.status(500).json({ message: 'Server error'});
    }
  }

  async login(req, res) {
    try {
      const user = new User(req.body);
      if (!user.isLoginValid()) {
        return res.status(400).json({ message: 'Bad data' });
      }
      const exist = await this.userRepository.login(user.email);
      if(!exist) return res.status(409).json({ message: `invalid credentials`});
      const passwordMatch = await bcrypt.compare(user.password, exist.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'invalid credentials'});
      }
      return res.status(200).json({
        data: {
          user: {
            id: exist.id,
            username: exist.username,
            email: exist.email,
          },
          token: this.__signatureToken(exist),
        }
      });
    } catch (error) {
      console.error('login error', error);
      res.status(500).json({ message: 'Server error'});
    }
  }

  async getProfile(req, res) {
    try {
      const { sub: id } = req.user;
      const user = await this.userRepository.getById(id);
      if (!user) {
        res.status(404).json({ message: 'Not found '});
      }
      return res.status(200).json({
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email
          }
        }
      });
    } catch (error) {
      console.error('get profile error', error);
      res.status(500).json({ message: 'Server error'});
    }
  }

  __signatureToken(user) {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username 
    };

    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });
    return token
  };

}

module.exports = AuthController;
