import { App, Plugin, PluginSettingTab, Setting} from 'obsidian';
import { ViewMode } from './ViewMode';
import { Translations } from './Translations';

export interface DefaultSettings {
   language: string;
   currentMode: TViewMode;
   activeLeafId: string | null;
}

export type TViewMode = 'tab' | 'sidebar' | 'popup';

export const DEFAULT_SETTINGS: DefaultSettings = {
   language: 'fr',
   currentMode: 'tab',
   activeLeafId: null,
};

export class Settings {
   private static plugin: Plugin;
   private static settings: DefaultSettings;

   static initialize(plugin: Plugin) {
      this.plugin = plugin;
   }

   static async loadSettings(): Promise<DefaultSettings> {
      const savedData = await this.plugin.loadData();
      this.settings = Object.assign({}, DEFAULT_SETTINGS, savedData || {});
      return this.settings;
   }

   static async saveSettings(settings: Partial<DefaultSettings>) {
      this.settings = Object.assign(this.settings || DEFAULT_SETTINGS, settings);
      await this.plugin.saveData(this.settings);
   }

   static async refresh() {
      if (this.plugin && 'refresh' in this.plugin) {
         await (this.plugin as any).refresh();
      }
   }

   static async getViewMode(): Promise<TViewMode> {
      const data = await this.plugin.loadData();
      return (data?.currentMode || DEFAULT_SETTINGS.currentMode) as TViewMode;
   }
}

export class SettingsTab extends PluginSettingTab {
   plugin: Plugin;
   settings: DefaultSettings;

   constructor(
      app: App, 
      plugin: Plugin, 
      settings: DefaultSettings, 
      private viewMode: ViewMode,
      private translations: Translations
   ) {
      super(app, plugin);
      this.plugin = plugin;
      this.settings = settings;
   }

   display(): void {
      const { containerEl } = this;
      containerEl.empty();

      // Dropdown pour choisir le mode d'affichage
      new Setting(containerEl)
         .setName(this.translations.t('settings.defaultViewMode'))
         .setDesc(this.translations.t('settings.defaultViewModeDesc'))
         .addDropdown(dropdown => dropdown
            .addOption('tab', this.translations.t('settings.tab'))
            .addOption('sidebar', this.translations.t('settings.sidebar'))
            .addOption('popup', this.translations.t('settings.popup'))
            .setValue(this.settings.currentMode)
            .onChange(async (value) => {
               this.settings.currentMode = value as TViewMode;
               await Settings.saveSettings({ currentMode: value as TViewMode });
               await this.viewMode.setView(value as TViewMode);
            }));

   }
}