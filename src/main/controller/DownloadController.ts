import async from 'async';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import winston, { Logger } from 'winston';
import SimpleLogger from '../util/other/Logger';
import ConfigurationProperties from '../config/ConfigurationProperties';
import FileConfigurerImpl from '../util/aws/s3/FileConfigurerImpl';
import S3SignedUrlGenerator from '../helper/file/S3SignedUrlGenerator';
import { Request, Response, NextFunction } from 'express';
import { BaseController } from './abstract/BaseController';
import { User } from '../entity/User';
import { UserSession } from '../entity/UserSession';
import { OrderItem } from '../entity/OrderItem';
import { Thesis } from '../entity/Thesis';
import { RouteOptionsConfig } from '../route/config/RouteOptionsConfig';
import { UserThesisService } from '../model/service/UserThesisService';
import { UserThesisServiceImpl } from '../model/service/impl/UserThesisServiceImpl';

export class DownloadController extends BaseController {

  private readonly logger: Logger = SimpleLogger.getLogger().child({ 'name': DownloadController.name });
  private readonly eProps: ConfigurationProperties = ConfigurationProperties.getInstance();
  private readonly service: UserThesisService = new UserThesisServiceImpl();

  constructor(config: RouteOptionsConfig) {
    super(config);
    this.config = config;
  }

  public async dashboard(req: Request, res: Response, next: NextFunction): Promise<void> { res.render(this.getBaseViewPath() + "dashboard"); }

  public async entries(req: Request, res: Response, next: NextFunction): Promise<void> {
    let userId: number = (<UserSession>req.user).getId();
    let entries: OrderItem[] = await this.service.entriesDownload(userId);
    res.render(this.getBaseViewPath() + "entries", { 'entries': entries, 'title': this.title + ' Entries' });
  }

  public async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    let id: string = req.params.id;
    let userId: number = (<UserSession>req.user).getId();
    let orderId: number = +req.params.order;

    if (!orderId) throw new Error("Invalid order id");
    let entry: Thesis | null = await this.service.userOrderEntryDownloadDetail(id);
    let title: string = "Thesis Detail";
    if (entry !== null) { title = entry.getTitle(); }
    res.render(this.getBaseViewPath() + "entry-detail", { 'entry': entry, 'title': title, 'order_id': orderId });
  }

  public async userOrderEntryDownload(req: Request, res: Response, next: NextFunction): Promise<void> {
    let userId: number = (<UserSession>req.user).getId();
    let orderId: number = Number.parseInt(req.params.order);
    let thesisId: number = Number.parseInt(req.params.thesis);
    let entry: OrderItem | null = await this.service.userOrderEntryDownload(userId, orderId, thesisId);
    let fileConfigurer: FileConfigurerImpl = FileConfigurerImpl.getInstance();

    if (entry === null || (entry !== null && entry.getItem() && entry.getItem().getDocument() === null)) {
      res.status(403).json({ 'message': 'Forbidden' });
      return;
    }

    let thesisDocBucketName: string = this.eProps.getThesisDocBucket();
    let url: string | null = S3SignedUrlGenerator.getInstance(fileConfigurer.getS3Instance(), fileConfigurer.getConfiguration()).createSignedUrlGet(entry.getItem().getDocument().getKey(), thesisDocBucketName);
    res.status(200).json({ 'url': url }) as any;
  }

  protected getBaseViewPath(): string { return "pages/shared/download/"; }

  protected backToEntries(): string { return "/download/entries"; }

  protected backToHome(): string { return "/download/"; }


}