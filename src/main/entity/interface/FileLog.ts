export default interface FileLog {

  file_name: string;
  updated_on: Date;
  size: number | string;
  status_last_modified_date: Date;
  content?: string;
}