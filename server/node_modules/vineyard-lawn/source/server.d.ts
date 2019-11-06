import * as express from "express";
import { Request_Processor } from "./api";
import { RequestListener, ValidationCompiler } from "./types";
export interface SSLConfig {
    enabled?: boolean;
    publicFile?: string;
    privateFile?: string;
}
export interface Server_Config {
    port?: number;
    ssl?: SSLConfig;
}
export declare class Server implements ValidationCompiler {
    private app;
    private node_server;
    private port;
    private default_preprocessor;
    private ajv;
    private requestListener;
    constructor(default_preprocessor?: Request_Processor, requestedListener?: RequestListener);
    private checkAjv();
    compileApiSchema(schema: any): {};
    addApiSchemaHelper(schema: any): void;
    getApiSchema(): any;
    createEndpoints(endpoints: any, preprocessor?: Request_Processor): void;
    add_endpoints(endpoints: any, preprocessor?: Request_Processor): void;
    enable_cors(): void;
    start(config: Server_Config): Promise<void>;
    get_app(): any;
    get_port(): number;
    stop(): Promise<void>;
}
export declare function start_express(app: express.Application, port: any, ssl: SSLConfig): Promise<any>;
