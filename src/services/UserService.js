const userRepository = require('../repositories/UserRepository');

class UserService {
  async updateUserLocation(userId, neighborhood) {
    return userRepository.updateLocation(userId, neighborhood);
  }
}

module.exports = new UserService();