import { Request, Response, NextFunction } from 'express';
import { ParsedQs } from 'qs';
import { UserSession } from '../../entity/UserSession';
import { EntityQueryConfig } from '../../model/query/util/EntityQueryConfig';

export class QueryConfigImpl implements EntityQueryConfig {

  private parameterList: Map<string, string | string[]> = new Map<string, string | string[]>();
  private userPrincipal: UserSession | null = null;

  public init(parameters: ParsedQs): EntityQueryConfig {
    for (let key in parameters) {
      let value: string | string[] = parameters[key] as string | string[];
      this.parameterList.set(key, value);
    }
    return this;
  }

  public existsParameter(parameter: string): boolean {
    let param: string | string[] | undefined = this.parameterList.get(parameter);
    if (param !== null && param !== undefined) { return true; }
    else { return false; }
  }

  public getParameterList(): Map<string, string | string[]> {
    return this.parameterList;
  }

  public getParameter(parameter: string): string | string[] | null {
    let param: string | string[] | undefined = this.parameterList.get(parameter);
    if (param !== null && param !== undefined) {
      if (typeof param == 'object') { return param; }
      else { return param; }
    }
    else { return null; }
  }

  public getParameters(parameter: string): string[] | null {
    let param: string | string[] | undefined = this.parameterList.get(parameter);
    if (param !== null && param !== undefined) { return <string[]>param; }
    else { return null; }
  }

  public getUserPrincipal(): UserSession | null {
    return this.userPrincipal;
  }

  public static execute(req: Request, res: Response, next: NextFunction): void {
    let queryConfigImpl: EntityQueryConfig = new QueryConfigImpl();
    req.query = { ...req.query, ...req.body };
    req.queryConfig = queryConfigImpl.init(req.query);
    (<QueryConfigImpl>queryConfigImpl).setUserPrincipal(<UserSession>req.user);
    return next();
  }

  private setUserPrincipal(user: UserSession): void {
    this.userPrincipal = user;
  }
}