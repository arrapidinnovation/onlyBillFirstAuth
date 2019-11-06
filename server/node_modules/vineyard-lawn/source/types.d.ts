export declare type PromiseOrVoid = Promise<any> | null;
import { Version } from "./version";
export declare enum Method {
    get = 0,
    post = 1,
    put = 2,
    delete = 3,
}
export interface Request {
    data: any;
    session: any;
    user?: any;
    params?: any;
    version: Version;
    startTime?: any;
    original?: any;
}
export interface SimpleResponse {
    code: number;
    message: string;
    body: any;
}
export interface RequestListener {
    onRequest(request: Request, response: SimpleResponse, req: any): PromiseOrVoid;
    onError(error: any, request?: Request): PromiseOrVoid;
}
export interface ValidationCompiler {
    compileApiSchema(schema: any): any;
}
