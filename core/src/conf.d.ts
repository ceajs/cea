import { UsersConf, SchoolConf } from './types/conf';
export declare function loadConfFromToml(): UsersConf | null;
export declare function getSchoolInfos(users: UsersConf): Promise<SchoolConf | null>;
