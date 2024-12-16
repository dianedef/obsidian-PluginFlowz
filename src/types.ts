export type TViewMode = 'tab' | 'sidebar' | 'popup';

export type TPluginStatus = 'exploring' | 'active' | 'inactive';
export type TPluginGroup = 'Tech' | 'Outils' | 'Base';
export type TPluginTags = 'Productivity' | 'Writing' | 'Blogging' | string;

export interface IPlugin {
    title: string;
    url: string;
    tags: TPluginTags[];
    status: TPluginStatus[];
    activate: boolean;
    description: string;
    transcribe: boolean;
    group: TPluginGroup[];
    rating: number;  // 1-5
    urgency: number; // 1-3
    importance: number; // 1-3
    mdNote?: string;
}

export interface IPluginData {
    language: string;
    currentMode: TViewMode;
    activeLeafId: string | null;
    enableAutoUpdate: boolean;
    notesFolder: string;
    plugins: IPlugin[];
    groups: TPluginGroup[];
    defaultViewMode: TViewMode;
}

export interface DefaultSettings {
   language: string;
   currentMode: TViewMode;
   activeLeafId: string | null;
   enableAutoUpdate: boolean;
   notesFolder: string;
   template: string;
   defaultViewMode: 'list' | 'cards';
} 