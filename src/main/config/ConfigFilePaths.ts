import path from 'path';

export default class ConfigFilePaths {
  static partialsDir: string = path.join(process.cwd(), 'src', 'view', 'partials');
  static layoutsDir: string = path.join(process.cwd(), 'src', 'view', 'layouts');
  static viewsDir: string = path.join(process.cwd(), 'src', 'view');
  static envDir: string = path.join(process.cwd(), 'src', '.env');
  static staticDir: string = path.join(process.cwd(), 'src', 'resource');

}