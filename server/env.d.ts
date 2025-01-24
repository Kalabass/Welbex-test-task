declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    ORIGIN: string;
    TYPEORM_HOST: string;
    TYPEORM_PORT: number;
    TYPEORM_USERNAME: string;
    TYPEORM_PASSWORD: string;
    TYPEORM_DATABASE: string;
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    DOMAIN: string;
    NODE_ENV: string;
  }
}
