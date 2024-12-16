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

   private handleCommandError(error: unknown) {
      if (error instanceof CommandError) {
         console.error('[Hotkeys]', error);
         new Notice(this.translations.t(`errors.${error.code}`));
         throw error;
      }
      throw error;
   }

   registerHotkeys() {
      // Ouvrir le dashboard
      this.plugin.addCommand({
         id: 'open-plugins-dashboard',
         name: this.translations.t('commands.openDashboard'),
         icon: 'dashboard',
         callback: async () => {
            try {
               const mode = await Settings.getViewMode();
               await this.viewMode.setView(mode);
            } catch (error) {
               this.handleCommandError(error);
            }
         },
         hotkeys: [{ modifiers: ['Alt'], key: 'P' }]
      });
   }
}
