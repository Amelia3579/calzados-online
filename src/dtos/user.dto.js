class UserDto {
  constructor(user) {
    (this.first_name = user.first_name),
      (this.role = user.role),
      (this.active = true);
  }
}

module.exports = UserDto;
