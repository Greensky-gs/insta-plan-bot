declare global {
    namespace NodeJS {
        interface ProcessEnv {
            accountName: string;
            password: string;
        }
    }
}

export {}