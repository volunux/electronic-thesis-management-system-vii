import FileConfigurerImpl from './FileConfigurerImpl';

export default class DocumentConfigurer extends FileConfigurerImpl {

  constructor() { super(); }

  public static getInstance() : DocumentConfigurer { return new DocumentConfigurer(); }
}