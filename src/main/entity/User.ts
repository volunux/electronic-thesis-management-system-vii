import { Entity, Column, ManyToMany, ManyToOne, OneToOne, JoinColumn, JoinTable, RelationId, BeforeUpdate } from 'typeorm';
import { Role } from './Role';
import { UserProfilePhoto } from './UserProfilePhoto';
import { UserSignature } from './UserSignature';
import { UserStatus } from './UserStatus';
import { UserDto } from './dto/UserDto';

@Entity({
  'name': 'users'
})
export class User extends UserDto {

  constructor(data?: any) {
    super(data);
    if (data) {
      this.created_on = data.created_on ? data.created_on : new Date();
      this.email_address = data.email_address ? data.email_address : undefined;
      this.username = data.username ? data.username : undefined;
      this.password = data.password ? data.password : "";
      this.confirm_password = data.confirm_password ? data.confirm_password : "";
      this.hash = data.hash ? data.hash : "";
      this.salt = data.salt ? data.salt : "";
      this.user_full_name = data.user_full_name ? data.user_full_name : undefined;
      this.user_email_address = data.user_email_address ? data.user_email_address : undefined;
      this.role = data.role ? (typeof data.role == "string" ? new Array(data.role) : data.role) : [];
      this.user_role_id = data.user_role_id ? data.user_role_id : 1;
      this.status = data.status ? data.status : undefined;
      this.user_profile_photo = data.user_profile_photo ? data.user_profile_photo : undefined;
      this.user_signature = data.user_signature ? data.user_signature : undefined;
      this.roles = data.roles ? data.roles : [];
      this.status_id = data.status ? data.status : undefined;
      this.reset_password_token = data.reset_password_token ? data.reset_password_token : undefined;
      this.reset_password_expires = data.reset_password_expires ? data.reset_password_expires : undefined;
    }

  }


  @Column('timestamptz', {
    'nullable': false,
    'default': () => `CURRENT_TIMESTAMP`
  })
  private created_on: Date;

  @Column({
    'nullable': false,
    'length': 50,
    'unique': true
  })
  private email_address: string;

  @Column({
    'nullable': false,
    'length': 20,
    'unique': true
  })
  private username: string;

  @Column({
    'type': 'text'
  })
  private hash: string;

  @Column({
    'type': 'text'
  })
  private salt: string;

  @Column({
    'nullable': true,
    'unique': true
  })
  private reset_password_token: string;

  @Column({
    'nullable': true
  })
  private reset_password_expires: string;

  @ManyToOne(() => UserStatus, {
    'nullable': true,
    'eager': false,
    'onDelete': 'SET NULL'
  })
  @JoinColumn({
    'name': 'status_id'
  })
  private status: UserStatus;

  @Column({
    'nullable': true
  })
  @RelationId((vx: User) => vx.status)
  private status_id: number;

  @OneToOne(() => UserProfilePhoto, photo => photo.user, {
    'nullable': true,
    'eager': false
  })
  private user_profile_photo: UserProfilePhoto;

  @OneToOne(() => UserSignature, signature => signature.user, {
    'nullable': true,
    'eager': false,
  })
  private user_signature: UserSignature;

  private user_role_id: number;

  @ManyToMany(() => Role)
  @JoinTable({
    'name': 'user_role',
    'joinColumn': {
      'name': 'user_id',
      'referencedColumnName': '_id'
    },
    'inverseJoinColumn': {
      'name': 'role_id',
      'referencedColumnName': '_id'
    }
  })
  private roles: Role[];

  private role_ids: number;

  private password: string;
  private confirm_password: string;
  private role: number[];
  private user_full_name?: string;
  private user_email_address?: string;

  public getCreatedOn(): Date {
    return this.created_on;
  }

  public setCreatedOn(created_on: Date): void {
    this.created_on = created_on;
  }

  public getEmailAddress(): string {
    return this.email_address;
  }

  public setEmailAddress(email_address: string): void {
    this.email_address = email_address;
  }

  public getUsername(): string {
    return this.username;
  }

  public setUsername(username: string): void {
    this.username = username;
  }

  public getHash(): string {
    return this.hash;
  }

  public getSalt(): string {
    return this.salt;
  }

  public getRole(): number[] {
    return this.role;
  }

  public getStatus(): UserStatus {
    return this.status;
  }

  public setStatus(status: UserStatus): void {
    this.status = status;
  }

  public getUserProfilePhoto(): UserProfilePhoto {
    return this.user_profile_photo;
  }

  public setUserProfilePhoto(user_profile_photo: UserProfilePhoto): void {
    this.user_profile_photo = user_profile_photo;
  }

  public getUserSignature(): UserSignature {
    return this.user_signature;
  }

  public setUserSignature(user_signature: UserSignature): void {
    this.user_signature = user_signature;
  }

  public getUserRoleId(): number {
    return this.user_role_id;
  }

  public setRole(role: number[]): void {
    this.role = role;
  }

  public setSalt(salt: string): void {
    this.salt = salt;
  }

  public setHash(hash: string): void {
    this.hash = hash;
  }

  public getRoles(): Role[] {
    return this.roles;
  }

  public setRoles(roles: Role[]): void {
    this.roles = roles;
  }

  addRole(role: Role): void {
    this.roles.push(role);
  }

  public getPassword(): string {
    return this.password;
  }

  public setPassword(password: string): void {
    this.password = password;
  }

  public getConfirmPassword(): string {
    return this.confirm_password;
  }

  public setConfirmPassword(password: string): void {
    this.password = password;
  }

  public getStatusId(): number {
    return this.status_id;
  }

  public getResetPasswordToken(): string {
    return this.reset_password_token;
  }

  public setResetPasswordToken(reset_password_token: string): void {
    this.reset_password_expires = reset_password_token;
  }

  public getResetPasswordExpires(): string {
    return this.reset_password_expires;
  }

  public setResetPasswordExpires(reset_password_expires: string): void {
    this.reset_password_expires = reset_password_expires;
  }

  public getUserFullName(): string {
    return this.user_full_name as any;
  }

  public setUserFullName(user_full_name: string): void {
    this.user_full_name = user_full_name;
  }

  public getUserEmailAddress(): string {
    return this.user_email_address as any;
  }

  public setUserEmailAddress(user_email_address: string): void {
    this.user_email_address = user_email_address;
  }

  @BeforeUpdate()
  public deleteTransientProps() {
    delete this.user_email_address;
    delete this.user_full_name;
  }
}