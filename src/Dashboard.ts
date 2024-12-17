import { ItemView, WorkspaceLeaf, Plugin, Setting, Notice } from 'obsidian';
import { TViewMode, IPlugin } from './types';
import { TriStateToggle } from './components/ui/TriStateToggle';
import { Settings } from './Settings';
import { Translations } from './Translations';
import { Tag } from './components/ui/Tag';
import { PluginManager } from './PluginManager';
import { Rating } from './components/ui/Rating';

export class Dashboard extends ItemView {
    private translations: Translations;
    private plugins: IPlugin[] = [];
    private pluginManager: PluginManager;

    constructor(
        leaf: WorkspaceLeaf,
        private settings: Settings,
        translations: Translations,
        private plugin: Plugin
    ) {
        super(leaf);
        this.translations = translations;
        this.pluginManager = new PluginManager(this.plugin);
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
        
        // Charger les plugins via le PluginManager
        this.plugins = await this.pluginManager.getAllPlugins();
        
        // Utiliser la fonction utilitaire
        await this.renderContent(container);
    }

    async onClose() {
        // Nettoyage si nécessaire
    }

    private renderPluginList(container: HTMLElement, plugins: IPlugin[]) {
      
        // Liste des plugins
        const pluginsList = container.createDiv('pluginflowz-plugins-list');
        
        // Vérifier s'il y a des plugins
        if (!plugins || plugins.length === 0) {
           pluginsList.createEl('p', {
              text: this.translations.t('dashboard.noPlugins'),
              cls: 'pluginflowz-no-plugins'
           });
           return;
        }
  
        // Afficher tous les plugins
        plugins.forEach(plugin => {
           const pluginEl = pluginsList.createDiv('pluginflowz-plugin-item');
           
           // En-tête du plugin
           const headerEl = pluginEl.createDiv('pluginflowz-plugin-header');
           new Setting(headerEl)
              .addToggle(toggle => toggle
                 .setValue(plugin.activate)
                 .onChange(async (value) => {
                    plugin.activate = value;
                    const pluginManager = new PluginManager(this.plugin);
                    await pluginManager.updatePluginNote(plugin);
                    new Notice(this.translations.t(value ? 
                       'settings.plugins.activated' : 
                       'settings.plugins.deactivated'
                    ).replace('{title}', plugin.title));
                 })
              );
           headerEl.createEl('h4', { text: plugin.title });
           
           // Tags
           if (plugin.tags.length > 0) {
              const tagsEl = pluginEl.createDiv('pluginflowz-plugin-tags');
              plugin.tags.forEach(tag => {
                 new Tag(tagsEl, tag, 
                    async () => {
                       plugin.tags = plugin.tags.filter(t => t !== tag);
                       await Settings.saveSettings(this.settings);
                       this.renderContent(container);
                    },
                    'pluginflowz-tag-removable'
                 );
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
  
           // Rating avec slider
           this.createRatingControl(pluginEl, plugin, false);
        });
     }
  
     private renderPluginCards(container: HTMLElement, plugins: IPlugin[]) {
        
        const cardsGrid = container.createDiv('pluginflowz-cards-grid');
        
        // Vérifier s'il y a des plugins
        if (!plugins || plugins.length === 0) {
           cardsGrid.createEl('p', {
              text: this.translations.t('dashboard.noPlugins'),
              cls: 'pluginflowz-no-plugins'
           });
           return;
        }
  
        console.log('Rendering cards for plugins:', plugins); // Debug
  
        plugins.forEach(plugin => {
           console.log('Creating card for plugin:', plugin.title); // Debug
           console.log('Plugin status:', plugin.status); // Debug
           const card = cardsGrid.createDiv('pluginflowz-card');
           card.setAttribute('data-plugin-title', plugin.title);
           
           // Header avec actions
           const cardHeader = card.createDiv('pluginflowz-card-header');
           cardHeader.createEl('h3', { text: plugin.title });
           
           // Statut juste sous le titre
           const statusContainer = card.createDiv('pluginflowz-card-status-container');
           console.log('Status container created:', statusContainer); // Debug
           
           if (plugin.status && plugin.status.length > 0) {
              console.log('Creating status tag with:', plugin.status[0]); // Debug
              new Tag(statusContainer, plugin.status[0], 
                 () => this.cyclePluginStatus(plugin, statusContainer),
                 `pluginflowz-tag-status ${plugin.status[0]}`
              );
           } else {
              console.log('No status found for plugin:', plugin.title); // Debug
              new Tag(statusContainer, 'exploring', 
                 () => this.cyclePluginStatus(plugin, statusContainer),
                 'pluginflowz-tag-status exploring'
              );
           }
           
           // Boutons d'action
           const actions = new Setting(cardHeader);
           actions
              .addToggle(toggle => toggle
                 .setValue(plugin.activate)
                 .onChange(async (value) => {
                    plugin.activate = value;
                    const pluginManager = new PluginManager(this.plugin);
                    await pluginManager.updatePluginNote(plugin);
                    new Notice(this.translations.t(value ? 
                       'settings.plugins.activated' : 
                       'settings.plugins.deactivated'
                    ).replace('{title}', plugin.title));
                 })
              )
              .addExtraButton(btn => btn
                 .setIcon('more-vertical')
                 .setTooltip(this.translations.t('settings.plugins.options.tooltip'))
              );
           
           // Description
           if (plugin.description) {
              card.createEl('p', { 
                 text: plugin.description,
                 cls: 'pluginflowz-card-description'
              });
           }
           
           // Footer avec tags et stats
           const cardFooter = card.createDiv('pluginflowz-card-footer');
  
           
           // Stats
           const stats = cardFooter.createDiv('pluginflowz-card-stats');
  
           // Rating avec progress bar
           this.createRatingControl(card, plugin, true);
  
           // Tags
           if (plugin.tags.length > 0) {
              const tagsContainer = cardFooter.createDiv('pluginflowz-card-tags');
              plugin.tags.forEach(tag => {
                 const sanitizedTag = tag.replace(/\s+/g, '-').toLowerCase();
                 tagsContainer.createEl('span', { 
                    text: tag,
                    cls: `pluginflowz-tag pluginflowz-tag-${sanitizedTag}`
                 });
              });
           }
  
           // Dans renderPluginCards, après les tags existants
           const addTagButton = cardFooter.createEl('button', {
              cls: 'pluginflowz-add-tag',
              text: '+'
           });
  
           addTagButton.addEventListener('click', async () => {
              const tag = await this.promptForTag();
              if (tag) {
                 await this.addTagToPlugin(plugin, tag, container);
              }
           });
        });
     }
  
     private createRatingControl(container: HTMLElement, plugin: IPlugin, isCard: boolean = false) {
         if (isCard) {
             new Rating(container, plugin.rating, 5, async (value) => {
                 plugin.rating = value;
                 await Settings.saveSettings(this.settings);
             });
         } else {
             // Version List avec Slider
             const ratingContainer = container.createDiv('pluginflowz-rating-container');
             new Setting(ratingContainer)
                 .setName(this.translations.t('settings.plugins.options.rating'))
                 .addSlider(slider => slider
                     .setLimits(0, 5, 1)
                     .setValue(plugin.rating)
                     .setDynamicTooltip()
                     .onChange(async (value) => {
                         plugin.rating = value;
                         await Settings.saveSettings(this.settings);
                     })
                 );
         }
     }
  
     private async renderContent(container: HTMLElement) {
        container.empty();
        
        // Charger les plugins depuis les notes
        const pluginManager = new PluginManager(this.plugin);
        this.plugins = await pluginManager.getAllPlugins();
        
        console.log('Plugins chargés:', this.plugins);
        console.log('Tags uniques:', [...new Set(this.plugins.flatMap(p => p.tags))]);
        console.log('Groupes uniques:', [...new Set(this.plugins.flatMap(p => p.group))]);
  
        // Container principal
        const dashboardContainer = container.createDiv('pluginflowz-dashboard-container');
        
        // Header avec recherche et toggle
        const header = dashboardContainer.createDiv('pluginflowz-header');
        
        // Ajouter la barre de recherche
        const searchContainer = header.createDiv('pluginflowz-search');
        const searchInput = searchContainer.createEl('input', {
           type: 'text',
           placeholder: 'Rechercher des plugins...',
           cls: 'pluginflowz-search-input'
        });
        
        this.registerDomEvent(searchInput, 'input', (e) => {
           const target = e.target as HTMLInputElement;
           const searchTerm = target.value.toLowerCase();
           const filteredPlugins = this.plugins.filter(plugin => 
              plugin.title.toLowerCase().includes(searchTerm) ||
              plugin.description.toLowerCase().includes(searchTerm) ||
              plugin.tags.some(tag => tag.toLowerCase().includes(searchTerm))
           );
           
           // Re-rendre avec les plugins filtrés
           const contentContainer = dashboardContainer.querySelector('.pluginflowz-content') as HTMLElement;
           if (contentContainer) {
              contentContainer.empty();
              if (this.currentViewMode === 'cards') {
                 this.renderPluginCards(contentContainer, filteredPlugins);
              } else {
                 this.renderPluginList(contentContainer, filteredPlugins);
              }
           }
        });
  
        // Bouton de changement de vue
        const viewButton = header.createEl('button', {
           cls: 'pluginflowz-view-button',
           text: this.translations.t(
              this.currentViewMode === 'cards' 
                 ? 'dashboard.listView' 
                 : 'dashboard.cardView'
           )
        });
        
        this.registerDomEvent(viewButton, 'click', async () => {
           this.currentViewMode = this.currentViewMode === 'cards' ? 'list' : 'cards';
           viewButton.setText(this.translations.t(
              this.currentViewMode === 'cards' 
                 ? 'dashboard.listView' 
                 : 'dashboard.cardView'
           ));
           
           await Settings.saveSettings({
              defaultViewMode: this.currentViewMode
           });
           
           this.renderContent(container);
        });
  
        // Ajouter la rangée de filtres
        const filtersRow = dashboardContainer.createDiv('pluginflowz-filters');
        
        // Groupes à gauche
        const groupsContainer = filtersRow.createDiv('pluginflowz-filter-groups');
        
        // Créer un conteneur pour les boutons de contrôle global
        const globalControlsContainer = groupsContainer.createDiv('pluginflowz-global-controls');
        
        // Calculer l'état actuel
        const activeCount = this.plugins.filter(p => p.activate).length;
        const allActive = activeCount === this.plugins.length;
        const allInactive = activeCount === 0;
        const mixedState = !allActive && !allInactive;
        
        // Créer le toggle personnalisé
        const toggleContainer = globalControlsContainer.createDiv();
        const triStateToggle = new TriStateToggle(toggleContainer, async (state) => {
           if (state === 'left') {
              this.plugins.forEach(p => p.activate = false);
           } else if (state === 'right') {
              this.plugins.forEach(p => p.activate = true);
           }
           await Settings.saveSettings(this.settings);
           this.renderContent(container);
        });
        
        // Définir l'état initial
        const initialState = this.getGlobalToggleState();
        triStateToggle.setState(initialState);
  
        // Séparateur
        groupsContainer.createDiv('pluginflowz-filter-separator');
  
        const uniqueGroups = [...new Set(this.plugins.flatMap(p => p.group))]
           .filter(group => group && group.length > 0);
        console.log('Groupes trouvés:', uniqueGroups);
        
        if (uniqueGroups.length > 0) {
           console.log('Rendu des groupes');
           uniqueGroups.forEach(group => {
              console.log('Création tag pour groupe:', group);
              new Tag(groupsContainer, group, () => {
                 console.log('Filter by group:', group);
              }, 'pluginflowz-filter-tag');
           });
        }
  
        // Statuts au milieu
        const statusContainer = filtersRow.createDiv('pluginflowz-filter-status');
  
        // Séparateur avant
        statusContainer.createDiv('pluginflowz-filter-separator');
  
        // Liste des statuts possibles
        const statuses: TPluginStatus[] = ['exploring', 'active', 'inactive', 'ignoring'];
        statuses.forEach(status => {
           new Tag(statusContainer, status, () => {
              // Filtrer les plugins par statut
              const contentContainer = dashboardContainer.querySelector('.pluginflowz-content') as HTMLElement;
              if (contentContainer) {
                 contentContainer.empty();
                 const filteredPlugins = this.plugins.filter(p => p.status.includes(status));
                 if (this.currentViewMode === 'cards') {
                    this.renderPluginCards(contentContainer, filteredPlugins);
                 } else {
                    this.renderPluginList(contentContainer, filteredPlugins);
                 }
              }
           }, `pluginflowz-filter-tag pluginflowz-tag-status ${status}`);
        });
  
        // Séparateur après
        statusContainer.createDiv('pluginflowz-filter-separator');
  
        // Tags à droite
        const tagsContainer = filtersRow.createDiv('pluginflowz-filter-tags');
        const uniqueTags = [...new Set(this.plugins.flatMap(p => p.tags))]
           .filter(tag => tag && tag.length > 0);
        console.log('Tags trouvés:', uniqueTags);
        
        if (uniqueTags.length > 0) {
           console.log('Rendu des tags');
           uniqueTags.forEach(tag => {
              console.log('Création tag pour tag:', tag);
              new Tag(tagsContainer, tag, () => {
                 console.log('Filter by tag:', tag);
              }, 'pluginflowz-filter-tag');
           });
        }
  
        // Contenu (liste ou cartes)
        const contentContainer = dashboardContainer.createDiv('pluginflowz-content');
        if (this.currentViewMode === 'cards') {
           this.renderPluginCards(contentContainer, this.plugins);
        } else {
           this.renderPluginList(contentContainer, this.plugins);
        }
     }
  
     private async cyclePluginStatus(plugin: IPlugin, statusContainer: HTMLElement) {
        const statuses: TPluginStatus[] = ['exploring', 'active', 'inactive', 'ignoring'];
        const currentIndex = statuses.indexOf(plugin.status[0] as TPluginStatus);
        const nextIndex = (currentIndex + 1) % statuses.length;
        
        // Mettre à jour le statut
        plugin.status = [statuses[nextIndex]];
        
        // Mettre à jour la note
        const pluginManager = new PluginManager(this.plugin);
        await pluginManager.updatePluginNote(plugin);
        
        // Mettre à jour juste le tag
        const statusTag = statusContainer.querySelector('.pluginflowz-tag') as HTMLElement;
        if (statusTag) {
            statusTag.textContent = plugin.status[0];
            statuses.forEach(s => statusTag.removeClass(s));
            statusTag.addClass(plugin.status[0]);
        }
     }
  
     private async addTagToPlugin(plugin: IPlugin, tag: string, container: HTMLElement) {
        // Éviter les doublons
        if (!plugin.tags.includes(tag)) {
           plugin.tags.push(tag);
           
           // Mettre à jour la note
           const pluginManager = new PluginManager(this.plugin);
           await pluginManager.updatePluginNote(plugin);
           
           // Mettre à jour uniquement les tags
           await this.updateTags(plugin, container);
        }
     }
  
     private async promptForTag(): Promise<string | null> {
        return new Promise((resolve) => {
           const modal = new Modal(this.plugin.app);
           modal.titleEl.setText('Ajouter un tag');
           
           const input = modal.contentEl.createEl('input', {
              type: 'text',
              placeholder: 'Nom du tag'
           });
           
           const buttonContainer = modal.contentEl.createDiv('modal-button-container');
           
           const submitButton = buttonContainer.createEl('button', {
              text: 'Ajouter',
              cls: 'mod-cta'
           });
           
           submitButton.addEventListener('click', () => {
              const value = input.value.trim();
              modal.close();
              resolve(value || null);
           });
           
           modal.open();
           input.focus();
        });
     }
  
     private async updateTags(plugin: IPlugin, container: HTMLElement) {
        // 1. Mettre à jour les tags de la carte spécifique
        const card = container.querySelector(`[data-plugin-title="${plugin.title}"]`) as HTMLElement;
        if (card) {
           const tagsContainer = card.querySelector('.pluginflowz-card-tags') as HTMLElement;
           if (tagsContainer) {
              tagsContainer.empty();
              plugin.tags.forEach(tag => {
                 const sanitizedTag = tag.replace(/\s+/g, '-').toLowerCase();
                 tagsContainer.createEl('span', { 
                    text: tag,
                    cls: `pluginflowz-tag pluginflowz-tag-${sanitizedTag}`
                 });
              });
           }
        }
  
        // 2. Mettre à jour la barre de filtres des tags
        const filtersContainer = container.querySelector('.pluginflowz-filter-tags') as HTMLElement;
        if (filtersContainer) {
           filtersContainer.empty();
           const uniqueTags = [...new Set(this.plugins.flatMap(p => p.tags))]
              .filter(tag => tag && tag.length > 0);
           uniqueTags.forEach(tag => {
              new Tag(filtersContainer, tag, () => {
                 console.log('Filter by tag:', tag);
              }, 'pluginflowz-filter-tag');
           });
        }
     }
  
     public async refresh(): Promise<void> {
        // Recharger les données
        const data = await this.plugin.loadData();
        this.plugins = data?.plugins || [];
        
        // Trouver le container actuel
        const container = this.plugin.app.workspace.containerEl.querySelector('.pluginflowz-dashboard-container');
        if (container) {
           // Re-rendre le contenu
           await this.renderContent(container as HTMLElement);
        }
     }
  
     private getGlobalToggleState(): 'left' | 'middle' | 'right' {
        const activeCount = this.plugins.filter(p => p.activate).length;
        if (activeCount === 0) return 'left';
        if (activeCount === this.plugins.length) return 'right';
        return 'middle';
     }

}
