export { checkIn } from 'cea-check-in';
export declare class Cea {
    private plugins;
    addPlugin(plugin: () => Promise<void>): void;
    start(): Promise<void>;
}
