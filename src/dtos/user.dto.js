class UserDto {
  constructor(user) {
    (this.full_name = user.full_name),
      (this.role = user.role),
      (this.email = user.email),
      (this.active = true);
  }
}

module.exports = UserDto;
