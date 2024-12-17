export type TViewMode = 'tab' | 'sidebar' | 'popup';

export type TPluginStatus = 'exploring' | 'active' | 'inactive' | 'ignoring';
export type TPluginGroup = 'Tech' | 'Outils' | 'Base' | 'Sans groupe';
export type TPluginTags = 'Productivity' | 'Writing' | 'Blogging' | string;

export interface IPlugin {
    id: string;
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
    notesFolder: string;
    plugins: IPlugin[];
    groups: TPluginGroup[];
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