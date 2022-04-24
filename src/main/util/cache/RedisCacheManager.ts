import redis from 'redis';
import { promisify } from 'util';
import { Request , Response , NextFunction } from 'express';
import { Logger } from 'winston';
import SimpleLogger from '../other/Logger';
import { redisConfig } from './redis-config';

export default class RedisCacheManager {
  
  private readonly redisClient : redis.RedisClient = redis.createClient({'host' : redisConfig.host , 'password' : redisConfig.password , 'port' : redisConfig.port })
  private readonly cacheGetAsync = promisify(this.redisClient.get).bind(this.redisClient);
  private readonly cacheSetAsync = promisify(this.redisClient.setex).bind(this.redisClient);
  private readonly logger : Logger = SimpleLogger.getLogger().child({'component' : RedisCacheManager.name});
  private static instance : RedisCacheManager;

  private constructor() {}

  public static getInstance() : RedisCacheManager { if (!RedisCacheManager.instance) { RedisCacheManager.instance = new RedisCacheManager(); }

    return RedisCacheManager.instance;
  }

  public init() : void {
    const context : RedisCacheManager = this;
    this.redisClient
    .on('connect' , function(result : any) : void { context.logger.info('Connected to Redis successfully'); })
    .on('error' , function(err : Error) : void { context.logger.error(err); });
  }

  public getClient() : redis.RedisClient { return this.redisClient; }

  public async getData(key : string) : Promise<any> { return this.cacheGetAsync(key); }

  public async getDataMiddleware(req : Request , res : Response , next : NextFunction) : Promise<any> {
    let data : string | null = null;
    let url : string = req.url;

    try { data = await this.cacheGetAsync(url); }
    catch(err : any) { this.logger.error(err); }

    if (data !== null) {
      data = JSON.parse(data);
      res.setHeader('Content-Type' , 'application/json');
      res.status(200).send(data); }
    else { return next(); }
  }

  public async setData(key : string , data : any , expirationTime : number = 3600) : Promise<void> {
    try { await this.cacheSetAsync(key , expirationTime , JSON.stringify(data)); }
    catch(err : any) { this.logger.error(err); }
  }

  public async clear(key : string) : Promise<any> { this.redisClient.del(key); }

}