import { ItemView, WorkspaceLeaf, Plugin } from 'obsidian';
import { TViewMode, IPlugin } from './types';
import { Settings } from './Settings';
import { Translations } from './Translations';
import { Tag } from './components/ui/Tag';

export class Dashboard extends ItemView {
    private translations: Translations;
    private plugins: IPlugin[] = [];

    constructor(
        leaf: WorkspaceLeaf,
        private settings: Settings,
        translations: Translations,
        private plugin: Plugin
    ) {
        super(leaf);
        this.translations = translations;
    }

    getViewType(): string {
        return 'pluginflowz-view';
    }

    getDisplayText(): string {
        return this.translations.t('dashboard.title');
    }

    async onOpen() {
        const container = this.containerEl.children[1] as HTMLElement;
        container.empty();
        
        // Charger les plugins
        const data = await this.plugin.loadData();
        this.plugins = data?.plugins || [];
        
        // Utiliser la fonction utilitaire
        renderPluginList(container, this.plugins, this.translations);
    }

    async onClose() {
        // Nettoyage si nécessaire
    }
}
