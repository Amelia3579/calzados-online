class UserDto {
  constructor(user) {
    (this.first_name = user.first_name),
      (this.role = user.role),
      (this.email = user.email),
      (this.active = true);
  }
}

module.exports = UserDto;
