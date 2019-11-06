export declare class HTTP_Error extends Error {
    status: number;
    body: any;
    key: string;
    constructor(message?: string, status?: number, body?: {});
}
export declare class Bad_Request extends HTTP_Error {
    constructor(message?: string, bodyOrKey?: {});
}
export declare class BadRequest extends HTTP_Error {
    constructor(message?: string, bodyOrKey?: {});
}
export declare class Needs_Login extends HTTP_Error {
    constructor(message?: string);
}
export declare class Unauthorized extends HTTP_Error {
    constructor(message?: string);
}
