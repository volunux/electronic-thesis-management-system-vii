import { Express, Request, Response, NextFunction } from 'express';
import ExpressHbs from 'express-handlebars';
import ConfigFilePaths from './ConfigFilePaths';
import { handlebarsTemplateHelpers } from '../helper/view/HandlebarsTemplateHelpers';

const hbs: Exphbs = ExpressHbs.create({

  'defaultLayout': 'main',
  'layoutsDir': ConfigFilePaths.layoutsDir,
  'extname': '.html',
  'helpers': handlebarsTemplateHelpers,
  'partialsDir': ConfigFilePaths.partialsDir
});

export class TemplateEngineConfig {

  static init(app: Express): void {
    app.engine('html', hbs.engine);
    app.set('views', ConfigFilePaths.viewsDir);
    app.set('view engine', 'html');
    app.enable('view cache');
  }
}