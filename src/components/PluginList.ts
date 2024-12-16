import { IPlugin } from '../types';
import { Translations } from '../Translations';

export class PluginList {
    constructor(
        private container: HTMLElement,
        private plugins: IPlugin[],
        private translations: Translations
    ) {}

    render() {
        // En-tête avec le titre
        const title = this.container.createEl('h2', { 
            text: this.translations.t('dashboard.installedPlugins')
        });
        
        // Liste des plugins
        const pluginsList = this.container.createDiv('pluginflowz-plugins-list');
        
        // Vérifier s'il y a des plugins
        if (!this.plugins || this.plugins.length === 0) {
            pluginsList.createEl('p', {
                text: this.translations.t('dashboard.noPlugins'),
                cls: 'pluginflowz-no-plugins'
            });
            return;
        }

        // Afficher tous les plugins
        this.plugins.forEach(plugin => {
            const pluginEl = pluginsList.createDiv('pluginflowz-plugin-item');
            
            // En-tête du plugin
            const headerEl = pluginEl.createDiv('pluginflowz-plugin-header');
            headerEl.createEl('h4', { text: plugin.title });
            
            // Tags
            if (plugin.tags.length > 0) {
                const tagsEl = pluginEl.createDiv('pluginflowz-plugin-tags');
                plugin.tags.forEach(tag => {
                    tagsEl.createEl('span', { 
                        text: tag,
                        cls: 'pluginflowz-plugin-tag'
                    });
                });
            }
            
            // Description
            if (plugin.description) {
                pluginEl.createEl('p', { text: plugin.description });
            }
            
            // Statut et notes
            const infoEl = pluginEl.createDiv('pluginflowz-plugin-info');
            infoEl.createEl('span', { 
                text: `Status: ${plugin.status.join(', ')}`,
                cls: 'pluginflowz-plugin-status'
            });
            if (plugin.rating > 0) {
                infoEl.createEl('span', { 
                    text: `Rating: ${plugin.rating}/5`,
                    cls: 'pluginflowz-plugin-rating'
                });
            }
        });
    }
} 