declare module 'obsidian' {
    export class Plugin {
        app: any;
        manifest: any;
        constructor(app: any, manifest: any);
        loadData(): Promise<any>;
        saveData(data: any): Promise<void>;
    }
} 