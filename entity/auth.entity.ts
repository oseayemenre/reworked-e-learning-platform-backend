export class UserEntity {
  public readonly _username;
  public readonly _email;
  public readonly _password;
  public readonly _firstname;
  public readonly _lastname;
  public readonly _currentLevel;
  public readonly _semester;
  public readonly _course;
  public readonly _role;

  constructor(
    username: string,
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    currentLevel: string,
    semester: string,
    course: string,
    role: string
  ) {
    (this._username = username), (this._email = email);
    this._password = password;
    this._firstname = firstname;
    this._lastname = lastname;
    this._currentLevel = currentLevel;
    this._semester = semester;
    this._course = course;
    this._role = role;
  }
}
