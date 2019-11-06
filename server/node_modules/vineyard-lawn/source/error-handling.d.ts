import { Request, RequestListener } from './types';
export declare function sendErrorResponse(res: any, error: any): void;
export declare function handleError(res: any, error: any, listener: RequestListener, request?: Request): void;
