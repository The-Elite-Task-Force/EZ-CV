class Role {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly key: string, // added key property
  ) {}

  toString() {
    return this.key; // return the key instead
  }

  getId() {
    return this.id;
  }

  static readonly Owner = new Role(1, "owner", "Owner");
  static readonly Admin = new Role(2, "admin", "Admin");
  static readonly Bidmanager = new Role(3, "bidmanager", "Bidmanager");
  static readonly Member = new Role(4, "member", "Member"); //Previosly "User", previosly "Employee"

  // Optionally, get all roles as an array
  static all(): Role[] {
    return [Role.Owner, Role.Admin, Role.Bidmanager, Role.Member];
  }

  // Return an enum-like object of all role values
  static asEnum(): Record<string, string> {
    return {
      Owner: Role.Owner.toString(),
      Admin: Role.Admin.toString(),
      Bidmanager: Role.Bidmanager.toString(),
      User: Role.Member.toString(),
    };
  }

  // Retrieve a role by its id. Throws an error if the id doesn't match any defined role.
  static fromId(roleId: number): Role {
    const role = Role.all().find((r) => r.id === roleId);
    if (!role) {
      throw new Error(`No role found for id: ${roleId}`);
    }
    return role;
  }
}

export { Role };
