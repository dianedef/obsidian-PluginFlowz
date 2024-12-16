import { Plugin, Notice } from 'obsidian';
import { Settings } from './Settings';
import { Translations } from './Translations';
import { ViewMode } from './ViewMode';

export class Hotkeys {
   constructor(
      private plugin: Plugin,
      private settings: Settings,
      private translations: Translations,
      private viewMode: ViewMode
   ) {}

   registerHotkeys() {
      // Ouvrir le dashboard
      this.plugin.addCommand({
         id: 'open-plugins-dashboard',
         name: this.translations.t('commands.openDashboard'),
         icon: 'layout-grid',
         callback: async () => {
            try {
               const mode = await Settings.getViewMode();
               await this.viewMode.setView(mode);
            } catch (error) {
               console.error('[Hotkeys]', error);
               new Notice(this.translations.t('errors.openDashboard'));
            }
         },
         hotkeys: [{ modifiers: ['Alt'], key: 'P' }]
      });
   }
}
