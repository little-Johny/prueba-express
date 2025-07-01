class UserController {
  constructor(userRepository) {
    this.userRepository = userRepository;

    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  };

  async getAll(req, res) {
    try {
      const users = await this.userRepository.getAll();
      if(users.length === 0) res.status(404).json({ message: 'Not found' });
      return res.status(200).json({
        users,
      });
    } catch (error) {
      console.error('get all error', error);
      res.status(500).json({ message: 'Server error'});
    }
  };

  async getById(req, res) { 
    try {
      const { id } = req.params;
      const user = await this.userRepository.getById(id);
      if (!user) res.status(404).json({ message: 'Not found' });
      return res.status(200).json({
        user: {
          id: user.id,
          username: user.useranme,
          email: user.email
        }
      });
    } catch (error) {
      console.error('get by id error', error);
      res.status(500).json({ message: 'Server error'}); 
    }
  };

  async update(req, res) {
    try {
      const { id } = req.params;
      const changes = req.body;

      const updatedUser = await this.userRepository.update(changes, id);

      if(!updatedUser) return res.status(404).json({ message: 'Cannot updated'});

      return res.status(200).json({ message: 'Updated successfully' });
    } catch (error) {
      console.error('update error', error);
      res.status(500).json({ message: 'Server error'});
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await this.userRepository.delete(id);
      return res.status(200).json({ message: 'Successfully delete'});
    } catch (error) {
      console.error('delete error', error);
      res.status(500).json({ message: 'Server error'});
    }
  }
}

module.exports = UserController