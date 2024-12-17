import { App, Plugin, PluginSettingTab, Setting, Modal, Notice, ButtonComponent, DropdownComponent, SliderComponent } from 'obsidian';
import { ViewMode } from './ViewMode';
import { TViewMode, IPluginData, IPlugin, TPluginStatus } from './types';
import { Translations } from './Translations';

export interface DefaultSettings {
   language: string;
   currentMode: TViewMode;
   activeLeafId: string | null;
   enableAutoUpdate: boolean;
   notesFolder: string;
   template: string;
   defaultViewMode: 'list' | 'cards';
   plugins: IPlugin[];
}

export const DEFAULT_SETTINGS: DefaultSettings = {
   language: 'fr',
   currentMode: 'popup',
   activeLeafId: null,
   enableAutoUpdate: true,
   notesFolder: 'pluginNotes',
   template: '# {{name}}\n\n{{description}}\n\n{{url}}',
   defaultViewMode: 'list',
   plugins: []
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

   static async updateGroups(groups: TPluginGroup[]): Promise<void> {
      const settings = await this.loadSettings();
      const oldGroups = settings.groups;
      settings.groups = groups;
      await this.saveSettings(settings);

      // Si un groupe a été supprimé, mettre à jour les notes qui l'utilisaient
      const removedGroups = oldGroups.filter(g => !groups.includes(g));
      if (removedGroups.length > 0) {
         const pluginManager = new PluginManager(this.plugin);
         const plugins = await pluginManager.getAllPlugins();
         
         for (const plugin of plugins) {
            const pluginGroups = plugin.group.filter(g => !removedGroups.includes(g as TPluginGroup));
            if (pluginGroups.length !== plugin.group.length) {
               plugin.group = pluginGroups.length > 0 ? pluginGroups : ['Sans groupe'];
               await pluginManager.updatePluginNote(plugin);
            }
         }
      }
   }
}

export class SettingsTab extends PluginSettingTab {
   plugin: Plugin;
   settings: DefaultSettings & IPluginData;

   constructor(
      app: App, 
      plugin: Plugin, 
      settings: DefaultSettings, 
      private viewMode: ViewMode,
      private translations: Translations
   ) {
      super(app, plugin);
      this.plugin = plugin;
      this.settings = {
         ...DEFAULT_SETTINGS,
         groups: [],
         plugins: []
      };
      
      this.loadSettings().then(() => {
         this.display();
      });
   }

   private async loadSettings() {
      const data = await this.plugin.loadData();
      if (data) {
         this.settings = {
            ...DEFAULT_SETTINGS,
            ...data,
            groups: data.groups || [],
            plugins: data.plugins || []
         };
      }
   }

   async display(): void {
      await this.loadSettings();
      const { containerEl } = this;
      containerEl.empty();

// Mode d'affichage par défaut
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
               
// Dossier des plugins
      new Setting(containerEl)
         .setName(this.translations.t('settings.pluginFolder.name'))
         .setDesc(this.translations.t('settings.pluginFolder.desc'))
         .addText(text => text
            .setValue(this.settings.notesFolder)
            .onChange(async (value) => {
               await Settings.saveSettings({ notesFolder: value });
               await this.initializeFolders(value, this.settings.groups);
               new Notice(this.translations.t('settings.pluginFolder.updated'));
            }));

 
// Template des notes
      new Setting(containerEl)
         .setName(this.translations.t('settings.template.name'))
         .setDesc(this.translations.t('settings.template.desc'))
         .addTextArea((text) => text
            .setPlaceholder('# {{name}}\n\n{{description}}\n\n{{url}}')
            .setValue(this.settings.template || '')
            .onChange(async (value) => {
               await Settings.saveSettings({ template: value });
            }));
               
// Dossier des groupes
      new Setting(containerEl)
         .setName(this.translations.t('settings.groupFolder.name'))
         .setDesc(this.translations.t('settings.groupFolder.desc'))
         .addText(text => text
            .setValue(this.settings.notesFolder)
            .onChange(async (value) => {
               await Settings.saveSettings({ notesFolder: value });
               await this.initializeFolders(value, this.settings.groups);
               new Notice(this.translations.t('settings.groupFolder.updated'));
            }));

// Section Import/Export
      containerEl.createEl('h1', {text: this.translations.t('settings.importExport.title')});

// Import JSON
      new Setting(containerEl)
         .setName(this.translations.t('settings.importExport.jsonImport.name'))
         .setDesc(this.translations.t('settings.importExport.jsonImport.desc'))
         .addButton((button: ButtonComponent) => {
            button
               .setButtonText(this.translations.t('settings.importExport.jsonImport.button'))
               .onClick(() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.json';
                  input.style.display = 'none';
                  containerEl.appendChild(input);

                  input.onchange = async (e: Event) => {
                     const target = e.target as HTMLInputElement;
                     if (!target.files?.length) return;

                     const loadingNotice = new Notice(this.translations.t('settings.importExport.jsonImport.loading'), 0);

                     try {
                        const file = target.files[0];
                        const reader = new FileReader();

                        reader.onload = async (event: ProgressEvent<FileReader>) => {
                           try {
                              if (event.target?.result) {
                                 const config = JSON.parse(event.target.result as string);

                                 // Vérifier que le fichier contient les champs essentiels
                                 if (!config.plugins || !Array.isArray(config.groups)) {
                                    new Notice(this.translations.t('settings.importExport.jsonImport.error'));
                                    return;
                                 }

                                 // Créer une sauvegarde
                                 const backup = await this.plugin.loadData();
                                 const backupJson = JSON.stringify(backup, null, 2);
                                 const backupBlob = new Blob([backupJson], { type: 'application/json' });
                                 const backupUrl = window.URL.createObjectURL(backupBlob);
                                 const backupA = document.createElement('a');
                                 backupA.href = backupUrl;
                                 backupA.download = 'plugin-flowz-backup.json';
                                 backupA.click();
                                 window.URL.revokeObjectURL(backupUrl);

                                 // Appliquer la nouvelle configuration
                                 await Settings.saveSettings(config);
                                 new Notice(this.translations.t('settings.importExport.jsonImport.success'));
                                 this.display();
                              }
                           } catch (error) {
                              console.error('Erreur lors du parsing:', error);
                              new Notice(this.translations.t('settings.importExport.jsonImport.error'));
                           }
                        };

                        reader.readAsText(file);
                     } catch (error) {
                        loadingNotice.hide();
                        new Notice(this.translations.t('settings.importExport.jsonImport.error'));
                        console.error(error);
                     } finally {
                        input.value = '';
                     }
                  };

                  input.click();
               });

            return button;
         });

// Export JSON
      new Setting(containerEl)
         .setName(this.translations.t('settings.importExport.jsonExport.name'))
         .setDesc(this.translations.t('settings.importExport.jsonExport.desc'))
         .addButton((button: ButtonComponent) => button
            .setButtonText(this.translations.t('settings.importExport.jsonExport.button'))
            .onClick(async () => {
               const loadingNotice = new Notice(this.translations.t('settings.importExport.jsonExport.loading'), 0);
               try {
                  const data = await this.plugin.loadData();
                  const jsonString = JSON.stringify(data, null, 2);

                  const blob = new Blob([jsonString], { type: 'application/json' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'plugin-flowz-config.json';
                  a.click();
                  window.URL.revokeObjectURL(url);

                  loadingNotice.hide();
                  new Notice(this.translations.t('settings.importExport.jsonExport.success'));
               } catch (error) {
                  loadingNotice.hide();
                  new Notice(this.translations.t('settings.importExport.jsonExport.error'));
                  console.error(error);
               }
            }));

  containerEl.createEl('hr')

// Section de gestion des groupes
  containerEl.createEl('h1', {text: this.translations.t('settings.groups.title')})

// Afficher les groupes existants
  this.settings.groups.forEach((group: string, index: number) => {
    if (group !== 'Sans groupe') {
      new Setting(containerEl)
        .setName(group)
        .addButton((button: ButtonComponent) => button
          .setButtonText(this.translations.t('settings.groups.delete.button'))
          .setWarning()
          .onClick(async () => {
            try {
              const groupPath = `${this.settings.notesFolder}/${group}`;

// Déplacer les plugins de ce groupe vers "Sans groupe"
              this.settings.plugins.forEach(plugin => {
                if (plugin.group.includes(group)) {
                  plugin.group = plugin.group.filter(g => g !== group);
                }
              });

// Supprimer le groupe des paramètres
              this.settings.groups.splice(index, 1);
              await Settings.saveSettings(this.settings);

              new Notice(this.translations.t('settings.groups.delete.success') + ` : ${group}`);
              this.display();
            } catch (error) {
              console.error(`Erreur lors de la suppression du groupe ${group}:`, error);
              new Notice(this.translations.t('settings.groups.delete.error'));
            }
          }))
    }
  })

// Ajouter un nouveau groupe
  let inputText = '';
  new Setting(containerEl)
    .setName(this.translations.t('settings.groups.add.name'))
    .setDesc(this.translations.t('settings.groups.add.desc'))
    .addText(text => text
      .setPlaceholder(this.translations.t('settings.groups.add.placeholder'))
      .setValue('')
      .onChange((value: string) => {
        inputText = value;
      })
      .inputEl.addEventListener('keypress', async (e: KeyboardEvent) => {
        if (e.key === 'Enter' && inputText.trim()) {
          const groupName = inputText.trim();
          const currentSettings = this.plugin.settingsService.getSettings();
          if (!currentSettings.groups.includes(groupName)) {
// Créer le dossier pour le nouveau groupe
            await this.plugin.fileService.ensureFolder(`${currentSettings.rssFolder}/${groupName}`);
            
// Ajouter le groupe aux paramètres
            currentSettings.groups.push(groupName);
            await this.plugin.settingsService.updateSettings(currentSettings);
            new Notice(this.translations.t('settings.groups.add.success') + ` : ${groupName}`);
            this.display();
          } else {
            new Notice(this.translations.t('settings.groups.add.error'));
          }
        }
      }));

  containerEl.createEl('hr');
  containerEl.createEl('h1', {text: this.translations.t('settings.plugins.title')});

// Barre de recherche pour les plugins
      const searchContainer = containerEl.createDiv('pluginflowz-search-container');
      const searchInput = searchContainer.createEl('input', {
         type: 'text',
         placeholder: this.translations.t('settings.plugins.search.placeholder'),
         cls: 'pluginflowz-plugin-search-input'
      });

// Container pour tous les plugins
      const pluginsContainer = containerEl.createDiv('pluginflowz-plugins-container');
  
// Fonction pour filtrer et afficher les plugins
      const filterAndDisplayPlugins = (searchTerm = '') => {
         pluginsContainer.empty();
         const groupedPlugins: Record<string, Array<{plugin: IPlugin, index: number}>> = {};
         
         this.settings.plugins
            .filter(plugin => 
               plugin.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
               plugin.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
               plugin.group.some(g => g.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .forEach((plugin, index) => {
               plugin.group.forEach(group => {
                  if (!groupedPlugins[group]) {
                     groupedPlugins[group] = [];
                  }
                  groupedPlugins[group].push({plugin, index});
               });
            });

         Object.entries(groupedPlugins).forEach(([groupName, plugins]) => {
            pluginsContainer.createEl('h2', {text: groupName});

            plugins.forEach(({plugin, index}) => {
               const pluginContainer = pluginsContainer.createDiv('pluginflowz-plugin-container collapsed');
               const headerContainer = pluginContainer.createDiv('pluginflowz-plugin-header');
               
// Ajouter le titre et le statut du plugin
               const titleContainer = headerContainer.createDiv('pluginflowz-plugin-title-container');
               titleContainer.createEl('span', { text: plugin.title });
               
// Ajouter les tags
               const tagsContainer = titleContainer.createDiv('pluginflowz-plugin-tags-container');
               plugin.tags.forEach(tag => {
                  tagsContainer.createEl('span', { 
                     text: tag,
                     cls: 'pluginflowz-plugin-tag'
                  });
               });

               const optionsContainer = pluginContainer.createDiv('pluginflowz-plugin-options');
               optionsContainer.style.display = 'none';

// Créer un conteneur pour les boutons
               const buttonContainer = headerContainer.createDiv('pluginflowz-plugin-buttons');

               let toggleButton: ButtonComponent;

// Fonction pour toggle le plugin
               const togglePlugin = () => {
                  const isCollapsed = pluginContainer.classList.contains('collapsed');
                  pluginContainer.classList.toggle('collapsed');
                  optionsContainer.style.display = isCollapsed ? 'block' : 'none';
                  if (toggleButton) {
                     toggleButton.setIcon(isCollapsed ? 'chevron-up' : 'chevron-down');
                  }
               };

// Ajouter les boutons dans leur conteneur
               new Setting(buttonContainer)
                  .addExtraButton((button: ButtonComponent) => button
                     .setIcon(plugin.activate ? 'check-circle' : 'circle')
                     .setTooltip(plugin.activate ? 
                        this.translations.t('settings.plugins.deactivate.tooltip') : 
                        this.translations.t('settings.plugins.activate.tooltip'))
                     .onClick(async () => {
                        plugin.activate = !plugin.activate;
                        await Settings.saveSettings(this.settings);
                        button.setIcon(plugin.activate ? 'check-circle' : 'circle');
                        new Notice(this.translations.t(plugin.activate ? 
                           'settings.plugins.activated' : 
                           'settings.plugins.deactivated'
                        ).replace('{title}', plugin.title));
                     }))
                  .addExtraButton((button: ButtonComponent) => {
                     toggleButton = button;
                     button.setIcon('chevron-down')
                        .setTooltip(this.translations.t('settings.plugins.toggle.tooltip'))
                        .onClick(() => togglePlugin());
                     return button;
                  });

// Rendre le header cliquable
               headerContainer.addEventListener('click', (event: MouseEvent) => {
                  const target = event.target as HTMLElement;
                  if (!target.closest('.pluginflowz-plugin-buttons')) {
                     togglePlugin();
                  }
               });

// Options du plugin
               new Setting(optionsContainer)
                  .setName(this.translations.t('settings.plugins.options.status'))
                  .addDropdown((dropdown: DropdownComponent) => {
                     dropdown.addOption('exploring', this.translations.t('settings.plugins.status.exploring'));
                     dropdown.addOption('active', this.translations.t('settings.plugins.status.active'));
                     dropdown.addOption('inactive', this.translations.t('settings.plugins.status.inactive'));
                     dropdown.setValue(plugin.status[0]);
                     dropdown.onChange(async (value) => {
                        this.settings.plugins[index].status = [value as TPluginStatus];
                        await Settings.saveSettings(this.settings);
                     });
                  });

// Groupes du plugin
               new Setting(optionsContainer)
                  .setName(this.translations.t('settings.plugins.options.groups'))
                  .addDropdown((dropdown: DropdownComponent) => {
                     dropdown.addOption('', this.translations.t('settings.plugins.groups.none'));
                     this.settings.groups.forEach(g => 
                        dropdown.addOption(g, g)
                     );
                     dropdown.setValue(plugin.group[0] || '');
                     dropdown.onChange(async (value: string) => {
                        const oldGroups = [...plugin.group];
                        const newGroup = value || '';
                        
                        try {
                           if (newGroup && !plugin.group.includes(newGroup)) {
                              plugin.group.push(newGroup);
                           }
                           
                           await Settings.saveSettings(this.settings);
                           this.display();
                           
                           const sourceGroups = oldGroups.length ? oldGroups.join(', ') : this.translations.t('settings.plugins.groups.none');
                           const destinationGroups = plugin.group.join(', ') || this.translations.t('settings.plugins.groups.none');
                           new Notice(this.translations.t('settings.plugins.groups.updated')
                              .replace('{title}', plugin.title)
                              .replace('{from}', sourceGroups)
                              .replace('{to}', destinationGroups)
                           );
                        } catch (error) {
                           console.error('Erreur lors de la mise à jour des groupes:', error);
                           new Notice(this.translations.t('settings.plugins.groups.error'));
                        }
                     });
                  });

// Note du plugin
               new Setting(optionsContainer)
                  .setName(this.translations.t('settings.plugins.options.rating'))
                  .addSlider(slider => slider
                     .setLimits(1, 5, 1)
                     .setValue(plugin.rating)
                     .setDynamicTooltip()
                     .onChange(async (value) => {
                        this.settings.plugins[index].rating = value;
                        await Settings.saveSettings(this.settings);
                     }));

               new Setting(optionsContainer)
                  .setName(this.translations.t('settings.plugins.options.urgency'))
                  .addSlider(slider => slider
                     .setLimits(1, 3, 1)
                     .setValue(plugin.urgency)
                     .setDynamicTooltip()
                     .onChange(async (value) => {
                        this.settings.plugins[index].urgency = value;
                        await Settings.saveSettings(this.settings);
                     }));

               new Setting(optionsContainer)
                  .setName(this.translations.t('settings.plugins.options.importance'))
                  .addSlider(slider => slider
                     .setLimits(1, 3, 1)
                     .setValue(plugin.importance)
                     .setDynamicTooltip()
                     .onChange(async (value) => {
                        this.settings.plugins[index].importance = value;
                        await Settings.saveSettings(this.settings);
                     }));
            });
         });
      };

// Initialiser l'affichage et la recherche
      filterAndDisplayPlugins();
      searchInput.addEventListener('input', (e) => {
         const target = e.target as HTMLInputElement;
         filterAndDisplayPlugins(target.value);
      });
   }

   async confirmDelete(pluginTitle: string): Promise<boolean> {
      return new Promise((resolve) => {
         const modal = new Modal(this.app);
         modal.titleEl.setText(this.translations.t('settings.plugins.delete.confirm'));

         modal.contentEl.empty();
         modal.contentEl.createEl("p", { 
            text: this.translations.t('settings.plugins.delete.confirmMessage').replace('{title}', pluginTitle) 
         });

         new Setting(modal.contentEl)
            .addButton(btn => btn
               .setButtonText(this.translations.t('settings.plugins.delete.cancel'))
               .onClick(() => {
                  modal.close();
                  resolve(false);
               }))
            .addButton(btn => btn
               .setButtonText(this.translations.t('settings.plugins.delete.confirm'))
               .setWarning()
               .onClick(() => {
                  modal.close();
                  resolve(true);
               })
            );

         modal.open();
      });
   }

   async createNewGroup(): Promise<string | null> {
      return new Promise((resolve) => {
         const modal = new Modal(this.app);
         modal.titleEl.setText(this.translations.t('settings.plugins.group.add'));

         modal.contentEl.empty();
         const inputContainer = modal.contentEl.createDiv();
         const input = new Setting(inputContainer)
            .setName(this.translations.t('settings.plugins.group.name'))
            .addText(text => text
               .setPlaceholder(this.translations.t('settings.plugins.group.placeholder'))
               .setValue("")
            );

         new Setting(modal.contentEl)
            .addButton(btn => btn
               .setButtonText(this.translations.t('settings.plugins.group.cancel'))
               .onClick(() => {
                  modal.close();
                  resolve(null);
               }))
            .addButton(btn => btn
               .setButtonText(this.translations.t('settings.plugins.group.create'))
               .setCta()
               .onClick(() => {
                  const value = input.components[0].getValue().trim();
                  if (value) {
                     modal.close();
                     resolve(value);
                  } else {
                     new Notice(this.translations.t('settings.plugins.group.error'));
                  }
               }));

         modal.open();
      });
   }
}