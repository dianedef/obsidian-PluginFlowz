import { ItemView, WorkspaceLeaf } from 'obsidian';
import { TViewMode } from './types';
import { Settings } from './Settings';
import { Translations } from './Translations';

export class Dashboard extends ItemView {
    private translations: Translations;

    constructor(
        leaf: WorkspaceLeaf,
        private settings: Settings,
        translations: Translations
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
        
        await this.renderDashboard(container);
    }

    private async renderDashboard(container: HTMLElement) {
        const dashboardContainer = container.createDiv('dashboard-container');
        
        // En-tête avec le titre
        dashboardContainer.createEl('h2', { 
            text: this.translations.t('dashboard.installedPlugins')
        });
        
        // Liste des plugins
        const pluginsList = dashboardContainer.createDiv('plugins-list');
        await this.renderPluginsList(pluginsList);
    }

    private async renderPluginsList(container: HTMLElement) {
        const installedPlugins = Array.from(this.app.plugins.enabledPlugins);
        
        installedPlugins.forEach(pluginId => {
            const plugin = this.app.plugins.plugins[pluginId];
            this.createPluginItem(container, plugin);
        });
    }

    private createPluginItem(container: HTMLElement, plugin: any) {
        const pluginItem = container.createDiv('plugin-item');
        
        pluginItem.createEl('h3', { text: plugin.manifest.name });
        pluginItem.createEl('p', { text: plugin.manifest.description });
        pluginItem.createEl('small', { 
            text: this.translations.t('dashboard.version', {
                version: plugin.manifest.version
            })
        });
    }

    async onClose() {
        // Nettoyage si nécessaire
    }
}
