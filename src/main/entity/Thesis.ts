import { BeforeUpdate, Entity, Column, Index, OneToOne, OneToMany, JoinColumn, ManyToOne, ManyToMany, RelationId } from 'typeorm';
import { VxEntity } from './abstract/VxEntity';
import { Faculty } from './Faculty';
import { Department } from './Department';
import { ThesisGrade } from './ThesisGrade';
import { Publisher } from './Publisher';
import { ThesisStatus } from './ThesisStatus';
import { ThesisDocument } from './ThesisDocument';
import { ThesisCoverImage } from './ThesisCoverImage';
import { ThesisComment } from './ThesisComment';

@Entity()
export class Thesis extends VxEntity {

  constructor(data?: any) {
    super(data);
    if (data) {
      this.title = data.title ? data.title : undefined;
      this.price = data.price ? data.price : undefined;
      this.content = data.content ? data.content : undefined;
      this.number_of_page = data.number_of_page ? data.number_of_page : undefined;
      this.supervisor = data.supervisor ? data.supervisor : "Not Available";
      this.publication_year = data.publication_year ? data.publication_year : undefined;
      this.author_name = data.author_name ? data.author_name : undefined;
      this.cover_image = data.cover_image ? data.cover_image : undefined;
      this.name_of_uploader = data.name_of_uploader ? data.name_of_uploader : undefined;
      this.uploader_email_address = data.uploader_email_address ? data.uploader_email_address : undefined;
      this.document = data.document ? data.document : undefined;
      this.publisher = data.publisher ? data.publisher : undefined;
      this.grade = data.grade ? data.grade : undefined;
      this.department = data.department ? data.department : undefined;
      this.faculty = data.faculty ? data.faculty : undefined;
      this.status = data.status ? data.status : undefined;
      this.slug = data.slug ? data.slug : undefined;
      this.department_id = data.department ? data.department : undefined;
      this.faculty_id = data.faculty ? data.faculty : undefined;
      this.grade_id = data.grade ? data.grade : undefined;
      this.publisher_id = data.publisher ? data.publisher : undefined;
      this.status_id = data.status ? data.status : undefined;
      this.comments = [];
    }
  }

  @Column({
    'length': 200,
    'nullable': false,
  })
  private title: string;

  @Column({
    'length': 12,
    'nullable': false
  })
  private price: string;

  @Column({
    'length': 5000,
    'nullable': false,
    'default': 'Not Available'
  })
  private content: string;

  @Column({
    'width': 4,
    'nullable': false
  })
  private number_of_page: number;

  @ManyToOne(() => ThesisGrade, {
    'nullable': true,
    'eager': false,
    'onDelete': 'SET NULL'
  })
  @JoinColumn({
    'name': 'grade_id'
  })
  private grade: ThesisGrade;

  @Column({
    'nullable': true
  })
  @RelationId((vx: Thesis) => vx.grade)
  private grade_id: number;

  @ManyToOne(() => Department, {
    'nullable': true,
    'eager': false,
    'onDelete': 'SET NULL'
  })
  @JoinColumn({
    'name': 'department_id'
  })
  private department: Department;

  @Column({
    'nullable': true
  })
  @RelationId((vx: Thesis) => vx.department)
  private department_id: number;

  @ManyToOne(() => Faculty, {
    'nullable': true,
    'eager': false,
    'onDelete': 'SET NULL'
  })
  @JoinColumn({
    'name': 'faculty_id'
  })
  private faculty: Faculty;

  @Column({
    'nullable': true
  })
  @RelationId((vx: Thesis) => vx.faculty)
  private faculty_id: number;

  @ManyToOne(() => Publisher, {
    'nullable': true,
    'eager': false,
    'onDelete': 'SET NULL'
  })
  @JoinColumn({
    'name': 'publisher_id'
  })
  private publisher: Publisher;

  @Column({
    'nullable': true
  })
  @RelationId((vx: Thesis) => vx.publisher)
  private publisher_id: number;

  @Column({
    'nullable': true,
    'default': 'Not Available',
    'length': 50
  })
  private supervisor: string;

  @Column({
    'length': 4,
    'nullable': false
  })
  private publication_year: string;

  @Column({
    'length': 50,
    'nullable': true,
    'default': 'Not Available'
  })
  private author_name: string;

  @OneToOne(() => ThesisCoverImage, image => image.thesis, {
    'nullable': true,
    'eager': false,
  })
  private cover_image?: ThesisCoverImage;

  @OneToOne(() => ThesisDocument, document => document.thesis, {
    'nullable': true,
    'eager': false
  })
  private document?: ThesisDocument;

  @ManyToOne(() => ThesisStatus, {
    'nullable': true,
    'eager': false,
    'onDelete': 'SET NULL'
  })
  @JoinColumn({
    'name': 'status_id'
  })
  private status: ThesisStatus;

  @Column({
    'nullable': true
  })
  @RelationId((vx: Thesis) => vx.status)
  private status_id: number;

  @Index()
  @Column({
    'nullable': true,
    'unique': true,
    'length': 250,
    'readonly': true
  })
  private slug: string;

  private name_of_uploader?: string;
  private uploader_email_address?: string;

  @OneToMany(() => ThesisComment, comment => comment.thesis, {
    'cascade': true,
    'eager': false,
  })
  public comments: ThesisComment[];

  private comments_ids: number[];

  public getTitle(): string {
    return this.title;
  }

  public getPrice(): string {
    return this.price;
  }

  public getPublisher(): Publisher {
    return this.publisher;
  }

  public setPublisher(publisher: Publisher): void {
    this.publisher = publisher;
  }

  public getContent(): string {
    return this.content;
  }

  public setContent(content: string): void {
    this.content = content;
  }

  public getNumberOfPage(): number {
    return this.number_of_page;
  }

  public setNumberOfPage(number_of_page: number): void {
    this.number_of_page = number_of_page;
  }

  public getGrade(): ThesisGrade {
    return this.grade;
  }

  public setGrade(grade: ThesisGrade): void {
    this.grade = grade;
  }

  public getDepartment(): Department {
    return this.department;
  }

  public setDepartment(department: Department): void {
    this.department = department;
  }

  public getFaculty(): Faculty {
    return this.faculty;
  }

  public setFaculty(faculty: Faculty): void {
    this.faculty = faculty;
  }

  public getSupervisor(): string {
    return this.supervisor;
  }

  public setSupervisor(supervisor: string): void {
    this.supervisor = supervisor;
  }

  public getPublicationYear(): string {
    return this.publication_year;
  }

  public setPublicationYear(publication_year: string): void {
    this.publication_year = publication_year;
  }

  public getAuthorName(): string {
    return this.author_name;
  }

  public setAuthorName(author_name: string): void {
    this.author_name = author_name;
  }

  public getCoverImage(): ThesisCoverImage {
    return this.cover_image as any;
  }

  public setCoverImage(cover_image: ThesisCoverImage): void {
    this.cover_image = cover_image;
  }

  public getDocument(): ThesisDocument {
    return this.document as any;
  }

  public setDocument(document: ThesisDocument): void {
    this.document = document;
  }

  public getStatus(): ThesisStatus {
    return this.status;
  }

  public setStatus(status: ThesisStatus): void {
    this.status = status;
  }

  public getSlug(): string {
    return this.slug;
  }

  public setSlug(slug: string): void {
    this.slug = slug;
  }

  public getNameOfUploader(): string {
    return this.name_of_uploader as any;
  }

  public setNameOfUploader(name_of_uploader: string): void {
    this.name_of_uploader = name_of_uploader;
  }

  public getUploaderEmailAddress(): string {
    return this.uploader_email_address as any;
  }

  public setUploaderEmailAddress(uploader_email_address: string): void {
    this.uploader_email_address = uploader_email_address;
  }

  public getDepartmentId(): number {
    return this.department_id;
  }

  public getFacultyId(): number {
    return this.faculty_id;
  }

  public getPublisherId(): number {
    return this.publisher_id;
  }

  public getGradeId(): number {
    return this.grade_id;
  }

  public getStatusId(): number {
    return this.status_id;
  }

  public setStatusId(status_id: number): void {
    this.status_id = status_id;
  }

  public getComments(): ThesisComment[] {
    return this.comments;
  }

  public setComments(comments: ThesisComment[]): void {
    this.comments = comments;
  }

  public addComment(comment: ThesisComment): void {
    if (this.comments === null || this.comments === undefined) this.comments = [];
    this.comments.push(comment);
  }

  public getCommentsIds(): number[] {
    return this.comments_ids;
  }

  public setCommentsIds(ids: number[]): void {
    this.comments_ids = ids;
  }

  public getCommentsFromIds(): ThesisComment[] {
    return this.commentsFromIds(this.comments_ids);
  }

  public setCommentsFromIds(ids: number[]) {
    this.comments = this.commentsFromIds(ids);
  }

  public commentsFromIds(ids: number[]): ThesisComment[] {
    let context: Thesis = this;
    let comments: ThesisComment[] = ids.map((id: number): ThesisComment => {
      let comment: ThesisComment = new ThesisComment();
      comment.setThesisId(context.getId());
      comment.setId(id);
      return comment;
    });
    return comments;
  }

  @BeforeUpdate()
  public deleteTransientProps() {
    delete this.user_id;
    delete this.cover_image;
    delete this.document;
    delete this.name_of_uploader;
    delete this.uploader_email_address;
  }

}