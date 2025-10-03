export interface DynamicConfig {
    host: string;
    port: number;
    corsOrigins: string[];
    databasePath: string;
    jwtSecret: string;
    jwtExpiresIn: string;
    realHost: string;
    nodeEnv: string;
    throttleTtl: number;
    throttleLimit: number;
}
export declare function generateDynamicConfig(): DynamicConfig;
export declare function logDynamicConfig(config: DynamicConfig): void;
