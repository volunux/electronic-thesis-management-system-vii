import { Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, RelationId } from 'typeorm';
import { Department } from '../Department';
import { Faculty } from '../Faculty';
import { Level } from '../Level';
import { Country } from '../Country';

export class UserDto {

  constructor(data?: any) {
    if (data) {
      this._id = data._id ? data._id : undefined;
      this.updated_on = data.updated_on ? data.updated_on : new Date();
      this.first_name = data.first_name ? data.first_name : undefined;
      this.last_name = data.last_name ? data.last_name : undefined;
      this.about = data.about ? data.about : "Not Available";
      this.matriculation_number = data.matriculation_number ? data.matriculation_number.toUpperCase() : undefined;
      this.department = data.department ? data.department : undefined;
      this.faculty = data.faculty ? data.faculty : undefined;
      this.level = data.level ? data.level : undefined;
      this.country = data.country ? data.country : undefined;
      this.department_id = data.department ? data.department : undefined;
      this.faculty_id = data.faculty ? data.faculty : undefined;
      this.level_id = data.level ? data.level : undefined;
      this.country_id = data.country ? data.country : undefined;
    }
  }

  @PrimaryGeneratedColumn()
  private _id: number;

  @Column('timestamptz', {
    'nullable': false,
    'default': () => `CURRENT_TIMESTAMP`
  })
  private updated_on: Date;

  @Column({
    'nullable': false,
    'length': 20
  })
  private first_name: string;

  @Column({
    'nullable': false,
    'length': 20
  })
  private last_name: string;

  @Column({
    'nullable': true,
    'length': 300,
    'default': 'Not Available'
  })
  private about: string;

  @Column({
    'nullable': false,
    'length': 15,
    'unique': true
  })
  private matriculation_number: string;

  @ManyToOne(() => Department, {
    'nullable': true,
    'eager': false,
    'onDelete': 'SET NULL'
  })
  @JoinColumn({
    'name': 'department_id'
  })
  protected department: Department;

  @Column({
    'nullable': true
  })
  @RelationId((vx: UserDto) => vx.department)
  private department_id: number;

  @ManyToOne(() => Faculty, {
    'nullable': true,
    'eager': false,
    'onDelete': 'SET NULL'
  })
  @JoinColumn({
    'name': 'faculty_id'
  })
  protected faculty: Faculty;

  @Column({
    'nullable': true
  })
  @RelationId((vx: UserDto) => vx.faculty)
  private faculty_id: number;

  @ManyToOne(() => Level, {
    'nullable': true,
    'eager': false,
    'onDelete': 'SET NULL'
  })
  @JoinColumn({
    'name': 'level_id'
  })
  protected level: Level;

  @Column({
    'nullable': true
  })
  @RelationId((vx: UserDto) => vx.level)
  private level_id: number;

  @ManyToOne(() => Country, {
    'nullable': true,
    'eager': false,
    'onDelete': 'SET NULL'
  })
  @JoinColumn({
    'name': 'country_id'
  })
  protected country: Country;

  @Column({
    'nullable': true
  })
  @RelationId((user: UserDto) => user.country)
  private country_id: number;

  public getId(): number {
    return this._id
  }

  public setId(id: number): void {
    this._id = id;
  }

  public getUpdatedOn(): Date {
    return this.updated_on;
  }

  public setUpdatedOn(updated_on: Date): void {
    this.updated_on = updated_on;
  }

  public getFirstName(): string {
    return this.first_name;
  }

  public setFirstName(first_name: string): void {
    this.first_name = first_name;
  }

  public getLastName(): string {
    return this.last_name;
  }

  public setLastName(last_name: string): void {
    this.last_name = last_name;
  }

  public getAbout(): string {
    return this.about;
  }

  public setAbout(about: string): void {
    this.about = about;
  }

  public getMatriculationNumber(): string {
    return this.matriculation_number;
  }

  public setMatriculationNumber(matriculation_number: string): void {
    this.matriculation_number = matriculation_number;
  }

  public getDepartment(): Department {
    return this.department;
  }

  public setDepartment(department: Department) {
    this.department = department;
  }

  public getFaculty(): Faculty {
    return this.faculty;
  }

  public setFaculty(faculty: Faculty): void {
    this.faculty = faculty;
  }

  public getLevel(): Level {
    return this.level;
  }

  public setLevel(level: Level): void {
    this.level = level;
  }

  public getCountry(): Country {
    return this.country;
  }

  public setCountry(country: Country): void {
    this.country = country;
  }

  public getDepartmentId(): number {
    return this.department_id;
  }

  public getFacultyId(): number {
    return this.faculty_id;
  }

  public getLevelId(): number {
    return this.level_id;
  }

  public getCountryId(): number {
    return this.country_id;
  }

}