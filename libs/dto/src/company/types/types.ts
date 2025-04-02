class Role {
  constructor(
    public readonly id: number,
    public readonly name: string,
  ) {}

  toString() {
    return this.name;
  }

  getId() {
    return this.id;
  }

  static readonly Owner = new Role(1, "owner");
  static readonly Admin = new Role(2, "admin");
  static readonly Bidmanager = new Role(3, "bidmanager");
  static readonly User = new Role(4, "user");

  // Optionally, get all roles as an array
  static all(): Role[] {
    return [Role.Owner, Role.Admin, Role.Bidmanager, Role.User];
  }

  // Return an enum-like object of all role values
  static asEnum(): Record<string, string> {
    return {
      Owner: Role.Owner.toString(),
      Admin: Role.Admin.toString(),
      Bidmanager: Role.Bidmanager.toString(),
      User: Role.User.toString(),
    };
  }
}

export { Role };
