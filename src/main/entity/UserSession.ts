export class UserSession {

  constructor(data?: any) {

    if (data) {
      this._id = data._id ? data._id : 1;
      this.email_address = data.email_address ? data.email_address : undefined;
      this.username = data.username ? data.username : undefined;
      this.hash = data.hash ? data.hash : "";
      this.salt = data.salt ? data.salt : "";
      this.role = data.role ? data.role : "";
      this.department = data.department ? data.department : undefined;
      this.faculty = data.faculty ? data.faculty : undefined;
      this.level = data.level ? data.level : undefined;
      this.status = data.status ? data.status : undefined;
    }
  }

  private _id: number;
  private email_address: string;
  private username: string;
  private hash?: string;
  private salt?: string;
  private role: string[];
  private department: string;
  private faculty: string;
  private level: string;

  private status: string;

  public getId(): number {
    return this._id;
  }

  public getEmailAddress(): string {
    return this.email_address;
  }

  public getUsername(): string {
    return this.username;
  }

  public getHash(): string {
    return <string>this.hash;
  }

  public getSalt(): string {
    return <string>this.salt;
  }

  public getRole(): string[] {
    return this.role;
  }

  public getDepartment(): string {
    return this.department;
  }

  public getFaculty(): string {
    return this.faculty;
  }

  public getLevel(): string {
    return this.level;
  }

  public getStatus(): string {
    return this.status;
  }

  public setRole(role: string[]): void {
    this.role = role;
  }

  public setSalt(salt: string): void {
    this.salt = salt;
  }

  public setHash(hash: string): void {
    this.hash = hash;
  }

  public setStatus(status: string): void {
    this.status = status;
  }

  public getUserRole(): string[] {
    return this.role;
  }

  public deleteConfidentialKeys() {
    delete this.hash;
    delete this.salt;
  }

}