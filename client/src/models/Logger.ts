export enum Service {
    CLIENT = 'client',
    SERVER = 'server'
}

export enum Severity {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical'
}

export enum LogType {
    INFO = 'info',
    WARNING = 'warn',
    ERROR = 'error'
}

export enum Environment {
    LOCAL = 'local',
    DEV = 'dev',
    DEV_NO_AUTH = 'dev-no-auth',
    LOAD_TEST = 'load-test',
    TEST = 'test',
    PROD = 'prod'
}

export interface MethodsLogMessage extends InitialLogData {
    step: string;
    severity: Severity;
}

export interface InitialLogData {
    user?: string;
    investigation?: number | string;
    workflow: string;
}

export interface InitialLogMessage {
    type: LogType,
    timestamp: string,
    environment: Environment
}

export type LogMessage = MethodsLogMessage & InitialLogMessage;