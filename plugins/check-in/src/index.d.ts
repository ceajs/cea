import { UserConfOpts } from 'cea-core';
import { SignTask, LogInfo } from './types';
export declare class CheckIn {
    private headers;
    private user;
    private school;
    constructor(user: UserConfOpts);
    signInfo(): Promise<SignTask | void>;
    signWithForm(curTask: SignTask): Promise<LogInfo>;
    private fillExtra;
    private extention;
    private encrypt;
    private decrypt;
}
export declare function checkIn(): Promise<void>;
