import async from 'async';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import winston, { Logger } from 'winston';
import SimpleLogger from '../util/other/Logger';
import ConfigurationProperties from '../config/ConfigurationProperties';
import FileLog from '../entity/interface/FileLog';
import { Request, Response, NextFunction } from 'express';
import { RouteOptionsConfig } from '../route/config/RouteOptionsConfig';
import { BaseController } from './abstract/BaseController';

import FileSizeCalculator from '../util/other/FileSizeCalculator';

export class LoggerController extends BaseController {

  private readonly logger: Logger = SimpleLogger.getLogger().child({ 'name': LoggerController.name });
  private readonly eProps: ConfigurationProperties = ConfigurationProperties.getInstance();
  private readonly logDir: string = process.cwd() + this.eProps.getLogDir();

  constructor(config: RouteOptionsConfig) {
    super(config);
    this.config = config;
  }

  public async dashboard(req: Request, res: Response, next: NextFunction): Promise<void> { res.render(this.getBaseViewPath() + "dashboard"); }

  public async entries(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.showEntriesOnFileExtension(req, res, next, '.log');
  }

  public async auditEntries(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.showEntriesOnFileExtension(req, res, next, '.json');
  }

  private async showEntriesOnFileExtension(req: Request, res: Response, next: NextFunction, fileExtension: string): Promise<void> {
    let entries: FileLog[] = [];

    try {
      let fileNames: string[] = fs.readdirSync(this.logDir);
      fileNames.forEach((fileName: string): void => {
        let fileLog: FileLog | null = this.getFileLog(fileName);
        if (fileLog !== null) entries.push(fileLog);
      });
    }
    catch (err: any) { this.logger.error(err); }

    entries = entries.map((details: FileLog) => {
      details['size'] = (FileSizeCalculator.calculateSizeActual(details.size).getCalculatedSize());
      return details;
    })
      .filter((details: FileLog) => details.file_name.endsWith(fileExtension));
    res.render(this.getBaseViewPath() + "entries", { 'entries': entries });
  }

  public async entryDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
    let logFile: string = req.params.name;
    let entry: FileLog | null = null;
    try {
      let fileName: string = path.resolve(this.logDir, logFile);
      let fileContent: Buffer = fs.readFileSync(fileName);
      entry = this.getFileLog(fileName);

      if (entry !== null) {
        entry['content'] = fileContent.toString();
        entry['size'] = (FileSizeCalculator.calculateSizeActual(entry.size).getCalculatedSize());
      }
    }
    catch (err: any) { this.logger.error(err); }
    res.render(this.getBaseViewPath() + "entry-detail", { 'entry': entry, 'title': this.title + ' Entry Detail' });
  }

  public async download(req: Request, res: Response, next: NextFunction): Promise<void> {
    let logFile: string = req.params.name;
    logFile = path.resolve(this.logDir, logFile);
    let entry: FileLog | null = null;
    try {
      let fileExist: boolean = fs.existsSync(logFile);
      if (fileExist === false) throw new Error('File does\'t exists');
      let logStream: fs.ReadStream = fs.createReadStream(logFile);
      logStream.on('open', () => {
        res.attachment(logFile);
        logStream.pipe(res);
      })
    }
    catch (err: any) {
      this.logger.error(err);
      throw new Error(err);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    let logFile: string = req.params.name;
    logFile = path.resolve(this.logDir, logFile);
    let entry: FileLog | null = null;
    try {
      fs.unlinkSync(logFile);
      let message: string = 'File successfully deleted';
      req.flash('success', message);
      res.redirect(this.backToEntries());
    }

    catch (err: any) { throw new Error(err); }
  }

  public async showLog(req: Request, res: Response, next: NextFunction): Promise<void> {
    this.logger.add(winston.transports.File)
    this.logger.query({} as any, function(err: Error, result: any): void {

      if (err) { res.status(400).json(err); }
      else { res.json(result); }
    });
  }

  public async deleteAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    let entries: string[] = [];
    try {
      let fileNames: string[] = fs.readdirSync(this.logDir);
      for (let fileName of fileNames) {
        if (!this.isDirectory(fileName)) {
          entries.push(fileName);
          break;
        }
      }
    }
    catch (err: any) { this.logger.error(err); }
    res.render('pages/shared/all/entry-delete-all', { 'entries': entries, 'title': this.title + ' Entries Delete All' });
  }

  public async findAndDeleteAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    let entries: FileLog[] = [];
    try {
      let fileNames: string[] = fs.readdirSync(this.logDir);
      for (let fileName of fileNames) {
        let filePath: string = path.resolve(this.logDir, fileName);
        if (!this.isDirectory(filePath)) {
          fs.unlink(filePath, () => { });
        }
      }
    }
    catch (err: any) { this.logger.error(err); }

    let message: string = 'Files successfully deleted';
    req.flash('success', message);
    res.redirect(this.backToHome());
  }

  private getFileLog(fileName: string, logDir?: string): FileLog | null {
    try {
      let fileInfo: fs.Stats = fs.statSync(path.resolve(logDir ? logDir : this.logDir, fileName));
      if (!(fileInfo.isDirectory())) {
        let updated_on: Date = fileInfo.mtime;
        let status_last_modified_date: Date = fileInfo.ctime;
        let size: number = fileInfo.size;
        return { 'file_name': fileName, 'updated_on': updated_on, 'status_last_modified_date': status_last_modified_date, 'size': size } as FileLog;
      };
    }
    catch (err: any) { this.logger.error(err); }

    return null;
  }

  private isDirectory(fileName: string): boolean {
    try {
      let fileStat: fs.Stats = fs.statSync(fileName);
      if (fileStat.isDirectory()) return true;
    }
    catch (err: any) { this.logger.error(err); }

    return false;
  }

  protected getBaseViewPath(): string { return "pages/shared/log/"; }

  protected backToEntries(): string { return "/internal/admin/log/entries/"; }

  protected backToHome(): string { return "/log/"; }
}