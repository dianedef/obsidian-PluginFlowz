import { Plugin, WorkspaceLeaf, Modal, Notice, Setting, Component } from 'obsidian';
import { TViewMode, IPlugin } from './types';
import { Settings } from './Settings';
import { Dashboard } from './Dashboard';
import { Translations } from './Translations';

export class ViewMode extends Component {
   private currentView: Dashboard | null = null;
   private currentMode: TViewMode | null = null;
   private activeLeaf: WorkspaceLeaf | null = null;
   private leafId: string | null = null;
   private translations: Translations;

   constructor(private plugin: Plugin) {
      super();
      this.translations = new Translations();
      // Initialiser les modes depuis les settings
      Settings.loadSettings().then(settings => {
         this.currentMode = settings.currentMode;
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

            // Créer une instance du Dashboard en mode popup
            const dashboard = new Dashboard(
               null,
               Settings,
               this.translations,
               this.plugin
            );
            
            // Rendre le contenu dans la modale
            await dashboard.renderContent(modal.contentEl);

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
}