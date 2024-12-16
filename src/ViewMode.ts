import { Plugin, WorkspaceLeaf, Modal, Setting, ProgressBarComponent } from 'obsidian';
import { TViewMode, IPlugin } from './types';
import { Settings } from './Settings';
import { Dashboard } from './Dashboard';
import { Translations } from './Translations';

export class ViewMode {
   private currentView: Dashboard | null = null;
   private currentMode: TViewMode | null = null;
   private activeLeaf: WorkspaceLeaf | null = null;
   private leafId: string | null = null;
   private translations: Translations;
   private currentViewMode: 'list' | 'cards' = 'list';
   private plugins: IPlugin[] = [];

   constructor(private plugin: Plugin) {
      this.translations = new Translations();
      // Initialiser les modes depuis les settings
      Settings.loadSettings().then(settings => {
         this.currentMode = settings.currentMode;
         this.currentViewMode = settings.defaultViewMode || 'list'; // Valeur par défaut si non définie
      });
      // Nettoyer les anciennes leafs au démarrage
      this.closeCurrentView();
   }

   private async closeCurrentView() {
      if (this.currentView) {
         const leaves = this.plugin.app.workspace.getLeavesOfType('pluginflowz-view');
         leaves.forEach(leaf => {
            if (leaf.view instanceof Dashboard) {
               leaf.detach();
            }
         });
         this.currentView = null;
         this.activeLeaf = null;
         this.leafId = null;
      }
   }

   private async getLeafForMode(mode: TViewMode): Promise<WorkspaceLeaf | null> {
      const workspace = this.plugin.app.workspace;
      
      // Fermer toutes les vues Dashboard existantes
      const existingLeaves = workspace.getLeavesOfType('pluginflowz-view');
      existingLeaves.forEach(leaf => {
         if (leaf.view instanceof Dashboard) {
            leaf.detach();
         }
      });
      
      let leaf: WorkspaceLeaf | null = null;
      switch (mode) {
         case 'sidebar':
            leaf = workspace.getRightLeaf(false) ?? workspace.getLeaf('split');
            break;
         case 'popup':
            const modal = new Modal(this.plugin.app);
            modal.containerEl.addClass('pluginflowz-modal');
            modal.titleEl.setText(this.translations.t('dashboard.title'));

            // Charger les plugins
            const data = await this.plugin.loadData();
            this.plugins = data?.plugins || [];
            
            // Rendre directement dans le contentEl de la modale
            this.renderContent(modal.contentEl);

            modal.open();
            return null;
         case 'tab':
         default:
            leaf = workspace.getLeaf('split');
            break;
      }

      return leaf;
   }

   async setView(mode: TViewMode) {
      if (mode === this.currentMode && this.currentView && this.activeLeaf) {
         return;
      }

      await this.closeCurrentView();

      const leaf = await this.getLeafForMode(mode);
      
      if (leaf && mode !== 'popup') {
         await leaf.setViewState({
            type: 'pluginflowz-view',
            active: true,
            state: { 
               mode: mode,
               leafId: this.leafId
            }
         });

         this.currentView = leaf.view as Dashboard;
         this.activeLeaf = leaf;
         this.plugin.app.workspace.revealLeaf(leaf);
      }

      this.currentMode = mode;
      // Sauvegarder le nouveau mode dans les settings
      await Settings.saveSettings({ currentMode: mode });
   }

   getActiveLeaf(): WorkspaceLeaf | null {
      return this.activeLeaf;
   }

   getCurrentLeafId(): string | null {
      return this.leafId;
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
         const card = cardsGrid.createDiv('pluginflowz-card');
         
         // Header avec actions
         const cardHeader = card.createDiv('pluginflowz-card-header');
         const titleEl = cardHeader.createEl('h3', { text: plugin.title });
         
         // Boutons d'action
         const actions = new Setting(cardHeader);
         actions
            .addExtraButton(btn => btn
               .setIcon(plugin.activate ? 'check-circle' : 'circle')
               .setTooltip(this.translations.t(plugin.activate ? 
                  'settings.plugins.deactivate.tooltip' : 
                  'settings.plugins.activate.tooltip'
               ))
               .onClick(async () => {
                  plugin.activate = !plugin.activate;
                  btn.setIcon(plugin.activate ? 'check-circle' : 'circle');
                  await Settings.saveSettings(this.settings);
                  new Notice(this.translations.t(plugin.activate ? 
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
         
         // Tags
         if (plugin.tags.length > 0) {
            const tagsContainer = cardFooter.createDiv('pluginflowz-card-tags');
            plugin.tags.forEach(tag => {
               tagsContainer.createEl('span', { 
                  text: tag,
                  cls: 'pluginflowz-tag'
               });
            });
         }
         
         // Stats
         const stats = cardFooter.createDiv('pluginflowz-card-stats');
         stats.createEl('span', { 
            text: plugin.status[0],
            cls: `pluginflowz-status-${plugin.status[0]}`
         });

         // Rating avec progress bar
         this.createRatingControl(card, plugin, true);
      });
   }

   private createRatingControl(container: HTMLElement, plugin: IPlugin, isCard: boolean = false) {
       if (isCard) {
           // Version Card avec Progress Bar
           const ratingContainer = container.createDiv('pluginflowz-card-rating');
           const ratingText = ratingContainer.createEl('span', {
               text: '⭐ ',
               cls: 'pluginflowz-rating-text'
           });

           const progressContainer = ratingContainer.createDiv('progress-container');
           const progressBar = progressContainer.createDiv('progress-bar');
           progressBar.style.width = `${(plugin.rating / 5) * 100}%`;

           const ratingValue = ratingContainer.createEl('span', {
               text: `${plugin.rating}/5`,
               cls: 'pluginflowz-rating-value'
           });

           // Fonction pour mettre à jour le rating
           const updateRating = async (e: MouseEvent) => {
               const rect = progressContainer.getBoundingClientRect();
               const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
               const newRating = Math.round((x / rect.width) * 5);
               
               plugin.rating = Math.max(0, Math.min(5, newRating));
               progressBar.style.width = `${(plugin.rating / 5) * 100}%`;
               ratingValue.setText(`${plugin.rating}/5`);
               
               await Settings.saveSettings(this.settings);
           };

           // Rendre la progress bar interactive
           progressContainer.addEventListener('mousemove', (e) => {
               if (e.buttons === 1) { // Si le bouton gauche est enfoncé
                   updateRating(e);
               }
           });

           progressContainer.addEventListener('click', updateRating);

           // Ajouter un style au survol
           progressContainer.style.cursor = 'pointer';
           progressContainer.addEventListener('mousemove', (e) => {
               const rect = progressContainer.getBoundingClientRect();
               const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
               const hoverRating = Math.round((x / rect.width) * 5);
               progressContainer.setAttribute('title', `${hoverRating}/5`);
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

   private renderContent(container: HTMLElement) {
      container.empty();
      
      // Container principal
      const dashboardContainer = container.createDiv('pluginflowz-dashboard-container');
      
      // Header avec titre et toggle
      const header = dashboardContainer.createDiv('pluginflowz-header');
      header.createEl('h2', { text: this.translations.t('dashboard.installedPlugins') });
      
      // Bouton de changement de vue
      const viewButton = header.createEl('button', {
         cls: 'pluginflowz-view-button',
         text: this.translations.t(
            this.currentViewMode === 'cards' 
               ? 'dashboard.listView' 
               : 'dashboard.cardView'
         )
      });
      
      viewButton.addEventListener('click', async () => {
         this.currentViewMode = this.currentViewMode === 'cards' ? 'list' : 'cards';
         viewButton.setText(this.translations.t(
            this.currentViewMode === 'cards' 
               ? 'dashboard.listView' 
               : 'dashboard.cardView'
         ));
         
         // Sauvegarder le mode d'affichage
         await Settings.saveSettings({
            defaultViewMode: this.currentViewMode
         });
         
         this.renderContent(container);
      });

      // Contenu (liste ou cartes)
      const contentContainer = dashboardContainer.createDiv('pluginflowz-content');
      if (this.currentViewMode === 'cards') {
         this.renderPluginCards(contentContainer, this.plugins);
      } else {
         this.renderPluginList(contentContainer, this.plugins);
      }
   }
} 