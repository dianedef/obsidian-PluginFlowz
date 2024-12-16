var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// obsidian-PluginFlowz/src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => PluginFlowz
});
module.exports = __toCommonJS(main_exports);
var import_obsidian5 = require("obsidian");

// obsidian-PluginFlowz/src/RegisterStyles.ts
function registerStyles() {
  const styleEl = document.createElement("style");
  styleEl.id = "pluginflowz-styles";
  styleEl.textContent = `
    /* ===== CSS ===== */
    .modal-container.pluginflowz-modal {
        padding: 150px;
    }

    .modal-container.pluginflowz-modal .modal {
        width: calc(100vw - 500px);
        height: calc(100vh - 100px);
        max-width: calc(100vw - 500px);
        max-height: calc(100vh - 100px);
    }

    .modal-container.pluginflowz-modal .modal-bg {
        background-color: rgba(0, 0, 0, 0.5);
    }

    .modal-container.pluginflowz-modal .modal-content {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .pluginflowz-dashboard-container {
        padding: 20px;
        flex: 1;
        overflow-y: auto;
    }

    .pluginflowz-plugins-list {
        display: grid;
        gap: 20px;
        padding: 20px 0;
    }

    .pluginflowz-plugin-item {
        background: var(--background-secondary);
        padding: 15px;
        border-radius: 5px;
    } 
`;
  document.head.appendChild(styleEl);
}

// obsidian-PluginFlowz/src/Settings.ts
var import_obsidian = require("obsidian");
var DEFAULT_SETTINGS = {
  language: "fr",
  currentMode: "popup",
  activeLeafId: null,
  enableAutoUpdate: true,
  notesFolder: "pluginNotes",
  template: "# {{name}}\n\n{{description}}\n\n{{url}}"
};
var Settings = class {
  static initialize(plugin) {
    this.plugin = plugin;
  }
  static async loadSettings() {
    const savedData = await this.plugin.loadData();
    this.settings = Object.assign({}, DEFAULT_SETTINGS, savedData || {});
    return this.settings;
  }
  static async saveSettings(settings) {
    this.settings = Object.assign(this.settings || DEFAULT_SETTINGS, settings);
    await this.plugin.saveData(this.settings);
  }
  static async refresh() {
    if (this.plugin && "refresh" in this.plugin) {
      await this.plugin.refresh();
    }
  }
  static async getViewMode() {
    const data = await this.plugin.loadData();
    return (data == null ? void 0 : data.currentMode) || DEFAULT_SETTINGS.currentMode;
  }
};
var SettingsTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin, settings, viewMode, translations2) {
    super(app, plugin);
    this.viewMode = viewMode;
    this.translations = translations2;
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
  async loadSettings() {
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
  async display() {
    await this.loadSettings();
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian.Setting(containerEl).setName(this.translations.t("settings.defaultViewMode")).setDesc(this.translations.t("settings.defaultViewModeDesc")).addDropdown((dropdown) => dropdown.addOption("tab", this.translations.t("settings.tab")).addOption("sidebar", this.translations.t("settings.sidebar")).addOption("popup", this.translations.t("settings.popup")).setValue(this.settings.currentMode).onChange(async (value) => {
      this.settings.currentMode = value;
      await Settings.saveSettings({ currentMode: value });
      await this.viewMode.setView(value);
    }));
    new import_obsidian.Setting(containerEl).setName(this.translations.t("settings.pluginFolder.name")).setDesc(this.translations.t("settings.pluginFolder.desc")).addText((text) => text.setValue(this.settings.notesFolder).onChange(async (value) => {
      await Settings.saveSettings({ notesFolder: value });
      await this.initializeFolders(value, this.settings.groups);
      new Notice(this.translations.t("settings.pluginFolder.updated"));
    }));
    new import_obsidian.Setting(containerEl).setName(this.translations.t("settings.template.name")).setDesc(this.translations.t("settings.template.desc")).addTextArea((text) => text.setPlaceholder("# {{name}}\n\n{{description}}\n\n{{url}}").setValue(this.settings.template || "").onChange(async (value) => {
      await Settings.saveSettings({ template: value });
    }));
    new import_obsidian.Setting(containerEl).setName(this.translations.t("settings.groupFolder.name")).setDesc(this.translations.t("settings.groupFolder.desc")).addText((text) => text.setValue(this.settings.notesFolder).onChange(async (value) => {
      await Settings.saveSettings({ notesFolder: value });
      await this.initializeFolders(value, this.settings.groups);
      new Notice(this.translations.t("settings.groupFolder.updated"));
    }));
    containerEl.createEl("h1", { text: this.translations.t("settings.importExport.title") });
    new import_obsidian.Setting(containerEl).setName(this.translations.t("settings.importExport.jsonImport.name")).setDesc(this.translations.t("settings.importExport.jsonImport.desc")).addButton((button) => {
      button.setButtonText(this.translations.t("settings.importExport.jsonImport.button")).onClick(() => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.style.display = "none";
        containerEl.appendChild(input);
        input.onchange = async (e) => {
          var _a;
          const target = e.target;
          if (!((_a = target.files) == null ? void 0 : _a.length))
            return;
          const loadingNotice = new Notice(this.translations.t("settings.importExport.jsonImport.loading"), 0);
          try {
            const file = target.files[0];
            const reader = new FileReader();
            reader.onload = async (event) => {
              var _a2;
              try {
                if ((_a2 = event.target) == null ? void 0 : _a2.result) {
                  const config = JSON.parse(event.target.result);
                  if (!config.plugins || !Array.isArray(config.groups)) {
                    new Notice(this.translations.t("settings.importExport.jsonImport.error"));
                    return;
                  }
                  const backup = await this.plugin.loadData();
                  const backupJson = JSON.stringify(backup, null, 2);
                  const backupBlob = new Blob([backupJson], { type: "application/json" });
                  const backupUrl = window.URL.createObjectURL(backupBlob);
                  const backupA = document.createElement("a");
                  backupA.href = backupUrl;
                  backupA.download = "plugin-flowz-backup.json";
                  backupA.click();
                  window.URL.revokeObjectURL(backupUrl);
                  await Settings.saveSettings(config);
                  new Notice(this.translations.t("settings.importExport.jsonImport.success"));
                  this.display();
                }
              } catch (error) {
                console.error("Erreur lors du parsing:", error);
                new Notice(this.translations.t("settings.importExport.jsonImport.error"));
              }
            };
            reader.readAsText(file);
          } catch (error) {
            loadingNotice.hide();
            new Notice(this.translations.t("settings.importExport.jsonImport.error"));
            console.error(error);
          } finally {
            input.value = "";
          }
        };
        input.click();
      });
      return button;
    });
    new import_obsidian.Setting(containerEl).setName(this.translations.t("settings.importExport.jsonExport.name")).setDesc(this.translations.t("settings.importExport.jsonExport.desc")).addButton((button) => button.setButtonText(this.translations.t("settings.importExport.jsonExport.button")).onClick(async () => {
      const loadingNotice = new Notice(this.translations.t("settings.importExport.jsonExport.loading"), 0);
      try {
        const data = await this.plugin.loadData();
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "plugin-flowz-config.json";
        a.click();
        window.URL.revokeObjectURL(url);
        loadingNotice.hide();
        new Notice(this.translations.t("settings.importExport.jsonExport.success"));
      } catch (error) {
        loadingNotice.hide();
        new Notice(this.translations.t("settings.importExport.jsonExport.error"));
        console.error(error);
      }
    }));
    containerEl.createEl("hr");
    containerEl.createEl("h1", { text: this.translations.t("settings.groups.title") });
    this.settings.groups.forEach((group, index) => {
      if (group !== "Sans groupe") {
        new import_obsidian.Setting(containerEl).setName(group).addButton((button) => button.setButtonText(this.translations.t("settings.groups.delete.button")).setWarning().onClick(async () => {
          try {
            const groupPath = `${this.settings.notesFolder}/${group}`;
            this.settings.plugins.forEach((plugin) => {
              if (plugin.group.includes(group)) {
                plugin.group = plugin.group.filter((g) => g !== group);
              }
            });
            this.settings.groups.splice(index, 1);
            await Settings.saveSettings(this.settings);
            new Notice(this.translations.t("settings.groups.delete.success") + ` : ${group}`);
            this.display();
          } catch (error) {
            console.error(`Erreur lors de la suppression du groupe ${group}:`, error);
            new Notice(this.translations.t("settings.groups.delete.error"));
          }
        }));
      }
    });
    let inputText = "";
    new import_obsidian.Setting(containerEl).setName(this.translations.t("settings.groups.add.name")).setDesc(this.translations.t("settings.groups.add.desc")).addText((text) => text.setPlaceholder(this.translations.t("settings.groups.add.placeholder")).setValue("").onChange((value) => {
      inputText = value;
    }).inputEl.addEventListener("keypress", async (e) => {
      if (e.key === "Enter" && inputText.trim()) {
        const groupName = inputText.trim();
        const currentSettings = this.plugin.settingsService.getSettings();
        if (!currentSettings.groups.includes(groupName)) {
          await this.plugin.fileService.ensureFolder(`${currentSettings.rssFolder}/${groupName}`);
          currentSettings.groups.push(groupName);
          await this.plugin.settingsService.updateSettings(currentSettings);
          new Notice(this.translations.t("settings.groups.add.success") + ` : ${groupName}`);
          this.display();
        } else {
          new Notice(this.translations.t("settings.groups.add.error"));
        }
      }
    }));
    containerEl.createEl("hr");
    containerEl.createEl("h1", { text: this.translations.t("settings.plugins.title") });
    const searchContainer = containerEl.createDiv("pluginflowz-search-container");
    const searchInput = searchContainer.createEl("input", {
      type: "text",
      placeholder: this.translations.t("settings.plugins.search.placeholder"),
      cls: "pluginflowz-plugin-search-input"
    });
    const pluginsContainer = containerEl.createDiv("pluginflowz-plugins-container");
    const filterAndDisplayPlugins = (searchTerm = "") => {
      pluginsContainer.empty();
      const groupedPlugins = {};
      this.settings.plugins.filter(
        (plugin) => plugin.title.toLowerCase().includes(searchTerm.toLowerCase()) || plugin.description.toLowerCase().includes(searchTerm.toLowerCase()) || plugin.group.some((g) => g.toLowerCase().includes(searchTerm.toLowerCase()))
      ).forEach((plugin, index) => {
        plugin.group.forEach((group) => {
          if (!groupedPlugins[group]) {
            groupedPlugins[group] = [];
          }
          groupedPlugins[group].push({ plugin, index });
        });
      });
      Object.entries(groupedPlugins).forEach(([groupName, plugins]) => {
        pluginsContainer.createEl("h2", { text: groupName });
        plugins.forEach(({ plugin, index }) => {
          const pluginContainer = pluginsContainer.createDiv("pluginflowz-plugin-container collapsed");
          const headerContainer = pluginContainer.createDiv("pluginflowz-plugin-header");
          const titleContainer = headerContainer.createDiv("pluginflowz-plugin-title-container");
          titleContainer.createEl("span", { text: plugin.title });
          const tagsContainer = titleContainer.createDiv("pluginflowz-plugin-tags-container");
          plugin.tags.forEach((tag) => {
            tagsContainer.createEl("span", {
              text: tag,
              cls: "pluginflowz-plugin-tag"
            });
          });
          const optionsContainer = pluginContainer.createDiv("pluginflowz-plugin-options");
          optionsContainer.style.display = "none";
          const buttonContainer = headerContainer.createDiv("pluginflowz-plugin-buttons");
          let toggleButton;
          const togglePlugin = () => {
            const isCollapsed = pluginContainer.classList.contains("collapsed");
            pluginContainer.classList.toggle("collapsed");
            optionsContainer.style.display = isCollapsed ? "block" : "none";
            if (toggleButton) {
              toggleButton.setIcon(isCollapsed ? "chevron-up" : "chevron-down");
            }
          };
          new import_obsidian.Setting(buttonContainer).addExtraButton((button) => button.setIcon(plugin.activate ? "check-circle" : "circle").setTooltip(plugin.activate ? this.translations.t("settings.plugins.deactivate.tooltip") : this.translations.t("settings.plugins.activate.tooltip")).onClick(async () => {
            plugin.activate = !plugin.activate;
            await Settings.saveSettings(this.settings);
            button.setIcon(plugin.activate ? "check-circle" : "circle");
            new Notice(this.translations.t(
              plugin.activate ? "settings.plugins.activated" : "settings.plugins.deactivated"
            ).replace("{title}", plugin.title));
          })).addExtraButton((button) => {
            toggleButton = button;
            button.setIcon("chevron-down").setTooltip(this.translations.t("settings.plugins.toggle.tooltip")).onClick(() => togglePlugin());
            return button;
          });
          headerContainer.addEventListener("click", (event) => {
            const target = event.target;
            if (!target.closest(".pluginflowz-plugin-buttons")) {
              togglePlugin();
            }
          });
          new import_obsidian.Setting(optionsContainer).setName(this.translations.t("settings.plugins.options.status")).addDropdown((dropdown) => {
            dropdown.addOption("exploring", this.translations.t("settings.plugins.status.exploring"));
            dropdown.addOption("active", this.translations.t("settings.plugins.status.active"));
            dropdown.addOption("inactive", this.translations.t("settings.plugins.status.inactive"));
            dropdown.setValue(plugin.status[0]);
            dropdown.onChange(async (value) => {
              this.settings.plugins[index].status = [value];
              await Settings.saveSettings(this.settings);
            });
          });
          new import_obsidian.Setting(optionsContainer).setName(this.translations.t("settings.plugins.options.groups")).addDropdown((dropdown) => {
            dropdown.addOption("", this.translations.t("settings.plugins.groups.none"));
            this.settings.groups.forEach(
              (g) => dropdown.addOption(g, g)
            );
            dropdown.setValue(plugin.group[0] || "");
            dropdown.onChange(async (value) => {
              const oldGroups = [...plugin.group];
              const newGroup = value || "";
              try {
                if (newGroup && !plugin.group.includes(newGroup)) {
                  plugin.group.push(newGroup);
                }
                await Settings.saveSettings(this.settings);
                this.display();
                const sourceGroups = oldGroups.length ? oldGroups.join(", ") : this.translations.t("settings.plugins.groups.none");
                const destinationGroups = plugin.group.join(", ") || this.translations.t("settings.plugins.groups.none");
                new Notice(
                  this.translations.t("settings.plugins.groups.updated").replace("{title}", plugin.title).replace("{from}", sourceGroups).replace("{to}", destinationGroups)
                );
              } catch (error) {
                console.error("Erreur lors de la mise \xE0 jour des groupes:", error);
                new Notice(this.translations.t("settings.plugins.groups.error"));
              }
            });
          });
          new import_obsidian.Setting(optionsContainer).setName(this.translations.t("settings.plugins.options.rating")).addSlider((slider) => slider.setLimits(1, 5, 1).setValue(plugin.rating).setDynamicTooltip().onChange(async (value) => {
            this.settings.plugins[index].rating = value;
            await Settings.saveSettings(this.settings);
          }));
          new import_obsidian.Setting(optionsContainer).setName(this.translations.t("settings.plugins.options.urgency")).addSlider((slider) => slider.setLimits(1, 3, 1).setValue(plugin.urgency).setDynamicTooltip().onChange(async (value) => {
            this.settings.plugins[index].urgency = value;
            await Settings.saveSettings(this.settings);
          }));
          new import_obsidian.Setting(optionsContainer).setName(this.translations.t("settings.plugins.options.importance")).addSlider((slider) => slider.setLimits(1, 3, 1).setValue(plugin.importance).setDynamicTooltip().onChange(async (value) => {
            this.settings.plugins[index].importance = value;
            await Settings.saveSettings(this.settings);
          }));
        });
      });
    };
    filterAndDisplayPlugins();
    searchInput.addEventListener("input", (e) => {
      const target = e.target;
      filterAndDisplayPlugins(target.value);
    });
  }
  async confirmDelete(pluginTitle) {
    return new Promise((resolve) => {
      const modal = new import_obsidian.Modal(this.app);
      modal.titleEl.setText(this.translations.t("settings.plugins.delete.confirm"));
      modal.contentEl.empty();
      modal.contentEl.createEl("p", {
        text: this.translations.t("settings.plugins.delete.confirmMessage").replace("{title}", pluginTitle)
      });
      new import_obsidian.Setting(modal.contentEl).addButton((btn) => btn.setButtonText(this.translations.t("settings.plugins.delete.cancel")).onClick(() => {
        modal.close();
        resolve(false);
      })).addButton(
        (btn) => btn.setButtonText(this.translations.t("settings.plugins.delete.confirm")).setWarning().onClick(() => {
          modal.close();
          resolve(true);
        })
      );
      modal.open();
    });
  }
  async createNewGroup() {
    return new Promise((resolve) => {
      const modal = new import_obsidian.Modal(this.app);
      modal.titleEl.setText(this.translations.t("settings.plugins.group.add"));
      modal.contentEl.empty();
      const inputContainer = modal.contentEl.createDiv();
      const input = new import_obsidian.Setting(inputContainer).setName(this.translations.t("settings.plugins.group.name")).addText(
        (text) => text.setPlaceholder(this.translations.t("settings.plugins.group.placeholder")).setValue("")
      );
      new import_obsidian.Setting(modal.contentEl).addButton((btn) => btn.setButtonText(this.translations.t("settings.plugins.group.cancel")).onClick(() => {
        modal.close();
        resolve(null);
      })).addButton((btn) => btn.setButtonText(this.translations.t("settings.plugins.group.create")).setCta().onClick(() => {
        const value = input.components[0].getValue().trim();
        if (value) {
          modal.close();
          resolve(value);
        } else {
          new Notice(this.translations.t("settings.plugins.group.error"));
        }
      }));
      modal.open();
    });
  }
};

// obsidian-PluginFlowz/src/Translations.ts
var translations = {
  en: {
    // Dashboard
    "dashboard.title": "PluginFlowz",
    "dashboard.description": "PluginFlowz is a plugin for Obsidian that allows you to manage your videos.",
    "dashboard.viewMode": "View Mode",
    "dashboard.viewModeDesc": "Choose how videos will open by default",
    "dashboard.viewModeTab": "Tab",
    "dashboard.viewModeSidebar": "Sidebar",
    "dashboard.viewModePopup": "Popup",
    // Notices
    "notices.saved": "\u2705 Settings saved",
    "notices.error": "\u274C Error: {message}",
    "notices.success": "\u2705 Operation successful",
    "notices.featureEnabled": "\u2705 Feature enabled",
    "notices.featureDisabled": "\u274C Feature disabled",
    // Commands
    "commands.openDashboard": "Open Dashboard",
    // Errors
    // Settings
    "settings.defaultViewMode": "Default View Mode",
    "settings.defaultViewModeDesc": "Choose how the plugin dashboard will open by default",
    "settings.tab": "Tab",
    "settings.sidebar": "Sidebar",
    "settings.popup": "Popup",
    "settings.pluginFolder.name": "Plugin Notes Folder",
    "settings.pluginFolder.desc": "Where to store plugin notes",
    "settings.pluginFolder.updated": "Plugin folder updated",
    "settings.template.name": "Note Template",
    "settings.template.desc": "Template for plugin notes (use {{name}}, {{description}}, {{url}})",
    "settings.groupFolder.name": "Group Folder",
    "settings.groupFolder.desc": "Where to store plugin groups",
    "settings.groupFolder.updated": "Group folder updated",
    // Import/Export
    "settings.importExport.title": "Import/Export",
    "settings.importExport.jsonImport.name": "Import Configuration",
    "settings.importExport.jsonImport.desc": "Import plugin configuration from JSON file",
    "settings.importExport.jsonImport.button": "Import JSON",
    "settings.importExport.jsonImport.loading": "Importing configuration...",
    "settings.importExport.jsonImport.success": "Configuration imported successfully",
    "settings.importExport.jsonImport.error": "Error importing configuration",
    "settings.importExport.jsonExport.name": "Export Configuration",
    "settings.importExport.jsonExport.desc": "Export plugin configuration to JSON file",
    "settings.importExport.jsonExport.button": "Export JSON",
    "settings.importExport.jsonExport.loading": "Exporting configuration...",
    "settings.importExport.jsonExport.success": "Configuration exported successfully",
    "settings.importExport.jsonExport.error": "Error exporting configuration",
    // Groups Management
    "settings.groups.title": "Groups Management",
    "settings.groups.delete.button": "Delete",
    "settings.groups.delete.success": "Group deleted",
    "settings.groups.delete.error": "Error deleting group",
    "settings.groups.add.name": "Add New Group",
    "settings.groups.add.desc": "Create a new group for organizing plugins",
    "settings.groups.add.placeholder": "Group name",
    "settings.groups.add.success": "Group created",
    "settings.groups.add.error": "Error creating group",
    // Plugins Management
    "settings.plugins.title": "Plugins Management",
    "settings.plugins.search.placeholder": "Search plugins...",
    "settings.plugins.options.status": "Status",
    "settings.plugins.status.exploring": "Exploring",
    "settings.plugins.status.active": "Active",
    "settings.plugins.status.inactive": "Inactive",
    "settings.plugins.options.groups": "Groups",
    "settings.plugins.groups.none": "No group",
    "settings.plugins.groups.updated": "Plugin {title} groups updated from {from} to {to}",
    "settings.plugins.groups.error": "Error updating groups",
    "settings.plugins.options.rating": "Rating",
    "settings.plugins.options.urgency": "Urgency",
    "settings.plugins.options.importance": "Importance",
    "settings.plugins.delete.button": "Delete Plugin",
    "settings.plugins.delete.confirm": "Delete Plugin",
    "settings.plugins.delete.confirmMessage": "Are you sure you want to delete {title}?",
    "settings.plugins.delete.cancel": "Cancel",
    "settings.plugins.deleted": "Plugin {title} deleted",
    // Plugin Actions & Tooltips
    "settings.plugins.activate.tooltip": "Activate plugin",
    "settings.plugins.deactivate.tooltip": "Deactivate plugin",
    "settings.plugins.toggle.tooltip": "Show/Hide options",
    "settings.plugins.activated": "Plugin {title} activated",
    "settings.plugins.deactivated": "Plugin {title} deactivated",
    "settings.plugins.add.name": "Add Plugin",
    "settings.plugins.add.desc": "Add a new plugin to manage",
    "settings.plugins.add.placeholder": "Plugin name",
    "settings.plugins.add.success": "Plugin added successfully",
    "settings.plugins.add.error": "Error adding plugin",
    "settings.plugins.rating.tooltip": "Rate from 1 to 5",
    "settings.plugins.urgency.tooltip": "Set urgency (1: Low, 2: Medium, 3: High)",
    "settings.plugins.importance.tooltip": "Set importance (1: Low, 2: Medium, 3: High)"
  },
  fr: {
    // Dashboard
    "dashboard.title": "PluginFlowz",
    "dashboard.description": "PluginFlowz est un plugin pour Obsidian qui vous permet de g\xE9rer vos vid\xE9os.",
    "dashboard.viewMode": "Mode d'affichage",
    "dashboard.viewModeDesc": "Choisissez comment les vid\xE9os s'ouvriront par d\xE9faut",
    "dashboard.viewModeTab": "Onglet",
    "dashboard.viewModeSidebar": "Barre lat\xE9rale",
    "dashboard.viewModePopup": "Fen\xEAtre contextuelle",
    // Notices
    "notices.saved": "\u2705 Param\xE8tres sauvegard\xE9s",
    "notices.error": "\u274C Erreur: {message}",
    "notices.success": "\u2705 Op\xE9ration r\xE9ussie",
    "notices.featureEnabled": "\u2705 Fonctionnalit\xE9 activ\xE9e",
    "notices.featureDisabled": "\u274C Fonctionnalit\xE9 d\xE9sactiv\xE9e",
    // Commands
    "commands.openDashboard": "Ouvrir le tableau de bord",
    // Errors
    // Settings
    "settings.defaultViewMode": "Mode d'affichage par d\xE9faut",
    "settings.defaultViewModeDesc": "Choisissez comment le tableau de bord s'ouvrira par d\xE9faut",
    "settings.tab": "Onglet",
    "settings.sidebar": "Barre lat\xE9rale",
    "settings.popup": "Fen\xEAtre modale",
    "settings.pluginFolder.name": "Dossier des notes de plugins",
    "settings.pluginFolder.desc": "O\xF9 stocker les notes des plugins",
    "settings.pluginFolder.updated": "Dossier des plugins mis \xE0 jour",
    "settings.template.name": "Template des notes",
    "settings.template.desc": "Template pour les notes de plugins (utilise {{name}}, {{description}}, {{url}})",
    "settings.groupFolder.name": "Dossier des groupes",
    "settings.groupFolder.desc": "O\xF9 stocker les groupes de plugins",
    "settings.groupFolder.updated": "Dossier des groupes mis \xE0 jour",
    // Import/Export
    "settings.importExport.title": "Import/Export",
    "settings.importExport.jsonImport.name": "Importer la configuration",
    "settings.importExport.jsonImport.desc": "Importer la configuration depuis un fichier JSON",
    "settings.importExport.jsonImport.button": "Importer JSON",
    "settings.importExport.jsonImport.loading": "Importation en cours...",
    "settings.importExport.jsonImport.success": "Configuration import\xE9e avec succ\xE8s",
    "settings.importExport.jsonImport.error": "Erreur lors de l'importation",
    "settings.importExport.jsonExport.name": "Exporter la configuration",
    "settings.importExport.jsonExport.desc": "Exporter la configuration vers un fichier JSON",
    "settings.importExport.jsonExport.button": "Exporter JSON",
    "settings.importExport.jsonExport.loading": "Exportation en cours...",
    "settings.importExport.jsonExport.success": "Configuration export\xE9e avec succ\xE8s",
    "settings.importExport.jsonExport.error": "Erreur lors de l'exportation",
    // Groups Management
    "settings.groups.title": "Gestion des groupes",
    "settings.groups.delete.button": "Supprimer",
    "settings.groups.delete.success": "Groupe supprim\xE9",
    "settings.groups.delete.error": "Erreur lors de la suppression",
    "settings.groups.add.name": "Ajouter un groupe",
    "settings.groups.add.desc": "Cr\xE9er un nouveau groupe pour organiser les plugins",
    "settings.groups.add.placeholder": "Nom du groupe",
    "settings.groups.add.success": "Groupe cr\xE9\xE9",
    "settings.groups.add.error": "Erreur lors de la cr\xE9ation",
    // Plugins Management
    "settings.plugins.title": "Gestion des plugins",
    "settings.plugins.search.placeholder": "Rechercher des plugins...",
    "settings.plugins.options.status": "Statut",
    "settings.plugins.status.exploring": "En exploration",
    "settings.plugins.status.active": "Actif",
    "settings.plugins.status.inactive": "Inactif",
    "settings.plugins.options.groups": "Groupes",
    "settings.plugins.groups.none": "Sans groupe",
    "settings.plugins.groups.updated": "Groupes du plugin {title} mis \xE0 jour de {from} vers {to}",
    "settings.plugins.groups.error": "Erreur lors de la mise \xE0 jour des groupes",
    "settings.plugins.options.rating": "Note",
    "settings.plugins.options.urgency": "Urgence",
    "settings.plugins.options.importance": "Importance",
    "settings.plugins.delete.button": "Supprimer le plugin",
    "settings.plugins.delete.confirm": "Supprimer le plugin",
    "settings.plugins.delete.confirmMessage": "\xCAtes-vous s\xFBr de vouloir supprimer {title} ?",
    "settings.plugins.delete.cancel": "Annuler",
    "settings.plugins.deleted": "Plugin {title} supprim\xE9",
    // Plugin Actions & Tooltips
    "settings.plugins.activate.tooltip": "Activer le plugin",
    "settings.plugins.deactivate.tooltip": "D\xE9sactiver le plugin",
    "settings.plugins.toggle.tooltip": "Afficher/Masquer les options",
    "settings.plugins.activated": "Plugin {title} activ\xE9",
    "settings.plugins.deactivated": "Plugin {title} d\xE9sactiv\xE9",
    "settings.plugins.add.name": "Ajouter un plugin",
    "settings.plugins.add.desc": "Ajouter un nouveau plugin \xE0 g\xE9rer",
    "settings.plugins.add.placeholder": "Nom du plugin",
    "settings.plugins.add.success": "Plugin ajout\xE9 avec succ\xE8s",
    "settings.plugins.add.error": "Erreur lors de l'ajout du plugin",
    "settings.plugins.rating.tooltip": "Noter de 1 \xE0 5",
    "settings.plugins.urgency.tooltip": "D\xE9finir l'urgence (1: Faible, 2: Moyenne, 3: Haute)",
    "settings.plugins.importance.tooltip": "D\xE9finir l'importance (1: Faible, 2: Moyenne, 3: Haute)"
  }
};
var Translations = class {
  constructor(initialLang = "fr") {
    this.currentLang = initialLang;
  }
  setLanguage(lang) {
    this.currentLang = lang;
  }
  t(key) {
    var _a;
    return ((_a = translations[this.currentLang]) == null ? void 0 : _a[key]) || translations["en"][key] || key;
  }
};

// obsidian-PluginFlowz/src/Hotkeys.ts
var import_obsidian2 = require("obsidian");
var Hotkeys = class {
  constructor(plugin, settings, translations2, viewMode) {
    this.plugin = plugin;
    this.settings = settings;
    this.translations = translations2;
    this.viewMode = viewMode;
  }
  registerHotkeys() {
    this.plugin.addCommand({
      id: "open-plugins-dashboard",
      name: this.translations.t("commands.openDashboard"),
      icon: "layout-grid",
      callback: async () => {
        try {
          const mode = await Settings.getViewMode();
          await this.viewMode.setView(mode);
        } catch (error) {
          console.error("[Hotkeys]", error);
          new import_obsidian2.Notice(this.translations.t("errors.openDashboard"));
        }
      },
      hotkeys: [{ modifiers: ["Alt"], key: "P" }]
    });
  }
};

// obsidian-PluginFlowz/src/Dashboard.ts
var import_obsidian3 = require("obsidian");
var Dashboard = class extends import_obsidian3.ItemView {
  constructor(leaf, settings, translations2) {
    super(leaf);
    this.settings = settings;
    this.translations = translations2;
  }
  getViewType() {
    return "pluginflowz-view";
  }
  getDisplayText() {
    return this.translations.t("dashboard.title");
  }
  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    await this.renderDashboard(container);
  }
  async renderDashboard(container) {
    const dashboardContainer = container.createDiv("dashboard-container");
    dashboardContainer.createEl("h2", {
      text: this.translations.t("dashboard.installedPlugins")
    });
    const pluginsList = dashboardContainer.createDiv("plugins-list");
    await this.renderPluginsList(pluginsList);
  }
  async renderPluginsList(container) {
    const installedPlugins = Array.from(this.app.plugins.enabledPlugins);
    installedPlugins.forEach((pluginId) => {
      const plugin = this.app.plugins.plugins[pluginId];
      this.createPluginItem(container, plugin);
    });
  }
  createPluginItem(container, plugin) {
    const pluginItem = container.createDiv("plugin-item");
    pluginItem.createEl("h3", { text: plugin.manifest.name });
    pluginItem.createEl("p", { text: plugin.manifest.description });
    pluginItem.createEl("small", {
      text: this.translations.t("dashboard.version", {
        version: plugin.manifest.version
      })
    });
  }
  async onClose() {
  }
};

// obsidian-PluginFlowz/src/ViewMode.ts
var import_obsidian4 = require("obsidian");
var ViewMode = class {
  constructor(plugin) {
    this.plugin = plugin;
    this.currentView = null;
    this.currentMode = null;
    this.activeLeaf = null;
    this.leafId = null;
    this.translations = new Translations();
    Settings.loadSettings().then((settings) => {
      this.currentMode = settings.currentMode;
    });
    this.closeCurrentView();
  }
  async closeCurrentView() {
    if (this.currentView) {
      const leaves = this.plugin.app.workspace.getLeavesOfType("pluginflowz-view");
      leaves.forEach((leaf) => {
        if (leaf.view instanceof Dashboard) {
          leaf.detach();
        }
      });
      this.currentView = null;
      this.activeLeaf = null;
      this.leafId = null;
    }
  }
  getLeafForMode(mode) {
    var _a;
    const workspace = this.plugin.app.workspace;
    const existingLeaves = workspace.getLeavesOfType("pluginflowz-view");
    existingLeaves.forEach((leaf2) => {
      if (leaf2.view instanceof Dashboard) {
        leaf2.detach();
      }
    });
    let leaf = null;
    switch (mode) {
      case "sidebar":
        leaf = (_a = workspace.getRightLeaf(false)) != null ? _a : workspace.getLeaf("split");
        break;
      case "popup":
        const modal = new import_obsidian4.Modal(this.plugin.app);
        modal.containerEl.addClass("pluginflowz-modal");
        modal.titleEl.setText(this.translations.t("dashboard.title"));
        const container = modal.contentEl.createDiv("pluginflowz-dashboard-container");
        const tempLeaf = this.plugin.app.workspace.getLeaf(false);
        const view = new Dashboard(tempLeaf, Settings, this.translations);
        tempLeaf.containerEl.style.display = "none";
        view.onOpen();
        modal.onClose = () => {
          view.onClose();
          tempLeaf.detach();
        };
        modal.open();
        return null;
      case "tab":
      default:
        leaf = workspace.getLeaf("split");
        break;
    }
    return leaf;
  }
  async setView(mode) {
    if (mode === this.currentMode && this.currentView && this.activeLeaf) {
      return;
    }
    await this.closeCurrentView();
    const leaf = this.getLeafForMode(mode);
    if (leaf && mode !== "popup") {
      await leaf.setViewState({
        type: "pluginflowz-view",
        active: true,
        state: {
          mode,
          leafId: this.leafId
        }
      });
      this.currentView = leaf.view;
      this.activeLeaf = leaf;
      this.plugin.app.workspace.revealLeaf(leaf);
    }
    this.currentMode = mode;
    await Settings.saveSettings({ currentMode: mode });
  }
  getActiveLeaf() {
    return this.activeLeaf;
  }
  getCurrentLeafId() {
    return this.leafId;
  }
};

// obsidian-PluginFlowz/src/main.ts
var PluginFlowz = class extends import_obsidian5.Plugin {
  constructor() {
    super(...arguments);
    this.translations = new Translations();
  }
  initializeView() {
    this.registerView(
      "pluginflowz-view",
      (leaf) => {
        const view = new Dashboard(leaf, this.settings, this.translations);
        this.dashboard = view;
        return view;
      }
    );
  }
  async onload() {
    await this.loadApp();
    Settings.initialize(this);
    this.loadLanguage();
    this.viewMode = new ViewMode(this);
    this.hotkeys = new Hotkeys(
      this,
      Settings,
      this.translations,
      this.viewMode
    );
    this.hotkeys.registerHotkeys();
    this.initializeView();
    this.addSettingTab(new SettingsTab(
      this.app,
      this,
      DEFAULT_SETTINGS,
      this.viewMode,
      this.translations
    ));
    const ribbonIcon = this.addRibbonIcon(
      "layout-grid",
      "PluginFlowz",
      async () => {
        const mode = await Settings.getViewMode();
        await this.viewMode.setView(mode);
      }
    );
    ribbonIcon.addEventListener("mouseenter", () => {
      const menu = new import_obsidian5.Menu();
      const createMenuItem = (title, icon, mode) => {
        menu.addItem((item) => {
          item.setTitle(title).setIcon(icon).onClick(async () => {
            await this.viewMode.setView(mode);
          });
        });
      };
      createMenuItem("Dashboard Tab", "tab", "tab");
      createMenuItem("Dashboard Sidebar", "layout-sidebar-right", "sidebar");
      createMenuItem("Dashboard Popup", "layout-top", "popup");
      const iconRect = ribbonIcon.getBoundingClientRect();
      menu.showAtPosition({
        x: iconRect.left,
        y: iconRect.top - 10
      });
      const handleMouseLeave = (e) => {
        const target = e.relatedTarget;
        const menuDom2 = menu.dom;
        const isOverIcon = ribbonIcon.contains(target);
        const isOverMenu = menuDom2 && menuDom2.contains(target);
        if (!isOverIcon && !isOverMenu) {
          menu.hide();
          ribbonIcon.removeEventListener("mouseleave", handleMouseLeave);
          if (menuDom2) {
            menuDom2.removeEventListener("mouseleave", handleMouseLeave);
          }
        }
      };
      ribbonIcon.addEventListener("mouseleave", handleMouseLeave);
      const menuDom = menu.dom;
      if (menuDom) {
        menuDom.addEventListener("mouseleave", handleMouseLeave);
      }
    });
    registerStyles();
  }
  async loadApp() {
    return new Promise((resolve) => {
      if (!this.app.workspace) {
        setTimeout(resolve, 0);
      } else {
        resolve();
      }
    });
  }
  loadLanguage() {
    var _a;
    try {
      const locale = ((_a = document.documentElement.lang) == null ? void 0 : _a.toLowerCase().startsWith("fr")) ? "fr" : "en";
      console.log("Langue d\xE9tect\xE9e:", locale);
      this.translations.setLanguage(locale);
    } catch (error) {
      console.warn("Erreur lors de la d\xE9tection de la langue, utilisation du fran\xE7ais par d\xE9faut");
      this.translations.setLanguage("fr");
    }
  }
  onunload() {
    this.app.workspace.detachLeavesOfType("pluginflowz-view");
  }
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL21haW4udHMiLCAic3JjL1JlZ2lzdGVyU3R5bGVzLnRzIiwgInNyYy9TZXR0aW5ncy50cyIsICJzcmMvVHJhbnNsYXRpb25zLnRzIiwgInNyYy9Ib3RrZXlzLnRzIiwgInNyYy9EYXNoYm9hcmQudHMiLCAic3JjL1ZpZXdNb2RlLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyBQbHVnaW4sIE1lbnUgfSBmcm9tICdvYnNpZGlhbic7XHJcbmltcG9ydCB7IFRWaWV3TW9kZSB9IGZyb20gJy4vdHlwZXMnO1xyXG5pbXBvcnQgeyByZWdpc3RlclN0eWxlcyB9IGZyb20gJy4vUmVnaXN0ZXJTdHlsZXMnO1xyXG5pbXBvcnQgeyBTZXR0aW5ncywgU2V0dGluZ3NUYWIsIERFRkFVTFRfU0VUVElOR1MgfSBmcm9tICcuL1NldHRpbmdzJ1xyXG5pbXBvcnQgeyBUcmFuc2xhdGlvbnMgfSBmcm9tICcuL1RyYW5zbGF0aW9ucyc7XHJcbmltcG9ydCB7IEhvdGtleXMgfSBmcm9tICcuL0hvdGtleXMnO1xyXG5pbXBvcnQgeyBEYXNoYm9hcmQgfSBmcm9tICcuL0Rhc2hib2FyZCc7XHJcbmltcG9ydCB7IFZpZXdNb2RlIH0gZnJvbSAnLi9WaWV3TW9kZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbHVnaW5GbG93eiBleHRlbmRzIFBsdWdpbiB7XHJcbiAgIHByaXZhdGUgdmlld01vZGUhOiBWaWV3TW9kZTtcclxuICAgc2V0dGluZ3MhOiBTZXR0aW5ncztcclxuICAgcHJpdmF0ZSB0cmFuc2xhdGlvbnM6IFRyYW5zbGF0aW9ucyA9IG5ldyBUcmFuc2xhdGlvbnMoKTtcclxuICAgcHJpdmF0ZSBob3RrZXlzITogSG90a2V5cztcclxuICAgcHJpdmF0ZSBkYXNoYm9hcmQhOiBEYXNoYm9hcmQ7XHJcblxyXG4gICBwcml2YXRlIGluaXRpYWxpemVWaWV3KCkge1xyXG4gICAgICB0aGlzLnJlZ2lzdGVyVmlldyhcclxuICAgICAgICAgXCJwbHVnaW5mbG93ei12aWV3XCIsXHJcbiAgICAgICAgIChsZWFmKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZpZXcgPSBuZXcgRGFzaGJvYXJkKGxlYWYsIHRoaXMuc2V0dGluZ3MsIHRoaXMudHJhbnNsYXRpb25zKTtcclxuICAgICAgICAgICAgdGhpcy5kYXNoYm9hcmQgPSB2aWV3O1xyXG4gICAgICAgICAgICByZXR1cm4gdmlldztcclxuICAgICAgICAgfVxyXG4gICAgICApO1xyXG4gICB9XHJcblxyXG4gICBhc3luYyBvbmxvYWQoKSB7XHJcbiAgICAgIGF3YWl0IHRoaXMubG9hZEFwcCgpO1xyXG5cclxuICAgICAgLy8gSW5pdGlhbGlzYXRpb25cclxuICAgICAgU2V0dGluZ3MuaW5pdGlhbGl6ZSh0aGlzKTtcclxuICAgICAgXHJcbiAgICAgIC8vIEluaXRpYWxpc2VyIGxlcyB0cmFkdWN0aW9uc1xyXG4gICAgICB0aGlzLmxvYWRMYW5ndWFnZSgpO1xyXG5cclxuICAgICAgLy8gSW5pdGlhbGlzZXIgVmlld01vZGUgYXZhbnQgZGUgbCd1dGlsaXNlclxyXG4gICAgICB0aGlzLnZpZXdNb2RlID0gbmV3IFZpZXdNb2RlKHRoaXMpO1xyXG4gICAgICBcclxuICAgICAgLy8gSW5pdGlhbGlzZXIgbGVzIGhvdGtleXNcclxuICAgICAgdGhpcy5ob3RrZXlzID0gbmV3IEhvdGtleXMoXHJcbiAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgIFNldHRpbmdzLFxyXG4gICAgICAgICB0aGlzLnRyYW5zbGF0aW9ucyxcclxuICAgICAgICAgdGhpcy52aWV3TW9kZVxyXG4gICAgICApO1xyXG4gICAgICB0aGlzLmhvdGtleXMucmVnaXN0ZXJIb3RrZXlzKCk7XHJcbiAgICAgIFxyXG4gICAgICB0aGlzLmluaXRpYWxpemVWaWV3KCk7XHJcblxyXG4gICAgICB0aGlzLmFkZFNldHRpbmdUYWIobmV3IFNldHRpbmdzVGFiKFxyXG4gICAgICAgICB0aGlzLmFwcCxcclxuICAgICAgICAgdGhpcyxcclxuICAgICAgICAgREVGQVVMVF9TRVRUSU5HUyxcclxuICAgICAgICAgdGhpcy52aWV3TW9kZSxcclxuICAgICAgICAgdGhpcy50cmFuc2xhdGlvbnNcclxuICAgICAgKSk7XHJcblxyXG4gICAgICAvLyBDclx1MDBFOWF0aW9uIGR1IG1lbnVcclxuICAgICAgY29uc3QgcmliYm9uSWNvbiA9IHRoaXMuYWRkUmliYm9uSWNvbihcclxuICAgICAgICAgJ2xheW91dC1ncmlkJyxcclxuICAgICAgICAgJ1BsdWdpbkZsb3d6JywgXHJcbiAgICAgICAgIGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbW9kZSA9IGF3YWl0IFNldHRpbmdzLmdldFZpZXdNb2RlKCk7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMudmlld01vZGUuc2V0Vmlldyhtb2RlKTtcclxuICAgICAgICAgfVxyXG4gICAgICApO1xyXG5cclxuICAgICAgcmliYm9uSWNvbi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgKCkgPT4ge1xyXG4gICAgICAgICBjb25zdCBtZW51ID0gbmV3IE1lbnUoKTtcclxuXHJcbiAgICAgICAgIGNvbnN0IGNyZWF0ZU1lbnVJdGVtID0gKHRpdGxlOiBzdHJpbmcsIGljb246IHN0cmluZywgbW9kZTogVFZpZXdNb2RlKSA9PiB7XHJcbiAgICAgICAgICAgIG1lbnUuYWRkSXRlbSgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICBpdGVtLnNldFRpdGxlKHRpdGxlKVxyXG4gICAgICAgICAgICAgICAgICAuc2V0SWNvbihpY29uKVxyXG4gICAgICAgICAgICAgICAgICAub25DbGljayhhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMudmlld01vZGUuc2V0Vmlldyhtb2RlKTtcclxuICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICB9O1xyXG5cclxuICAgICAgICAgY3JlYXRlTWVudUl0ZW0oXCJEYXNoYm9hcmQgVGFiXCIsIFwidGFiXCIsIFwidGFiXCIgYXMgVFZpZXdNb2RlKTtcclxuICAgICAgICAgY3JlYXRlTWVudUl0ZW0oXCJEYXNoYm9hcmQgU2lkZWJhclwiLCBcImxheW91dC1zaWRlYmFyLXJpZ2h0XCIsIFwic2lkZWJhclwiIGFzIFRWaWV3TW9kZSk7XHJcbiAgICAgICAgIGNyZWF0ZU1lbnVJdGVtKFwiRGFzaGJvYXJkIFBvcHVwXCIsIFwibGF5b3V0LXRvcFwiLCBcInBvcHVwXCIgYXMgVFZpZXdNb2RlKTtcclxuXHJcbiAgICAgICAgIGNvbnN0IGljb25SZWN0ID0gcmliYm9uSWNvbi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICAgbWVudS5zaG93QXRQb3NpdGlvbih7IFxyXG4gICAgICAgICAgICB4OiBpY29uUmVjdC5sZWZ0LCBcclxuICAgICAgICAgICAgeTogaWNvblJlY3QudG9wIC0gMTBcclxuICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICBjb25zdCBoYW5kbGVNb3VzZUxlYXZlID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gZS5yZWxhdGVkVGFyZ2V0IGFzIE5vZGU7XHJcbiAgICAgICAgICAgIGNvbnN0IG1lbnVEb20gPSAobWVudSBhcyBhbnkpLmRvbTtcclxuICAgICAgICAgICAgY29uc3QgaXNPdmVySWNvbiA9IHJpYmJvbkljb24uY29udGFpbnModGFyZ2V0KTtcclxuICAgICAgICAgICAgY29uc3QgaXNPdmVyTWVudSA9IG1lbnVEb20gJiYgbWVudURvbS5jb250YWlucyh0YXJnZXQpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKCFpc092ZXJJY29uICYmICFpc092ZXJNZW51KSB7XHJcbiAgICAgICAgICAgICAgIG1lbnUuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICByaWJib25JY29uLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBoYW5kbGVNb3VzZUxlYXZlKTtcclxuICAgICAgICAgICAgICAgaWYgKG1lbnVEb20pIHtcclxuICAgICAgICAgICAgICAgICAgbWVudURvbS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgaGFuZGxlTW91c2VMZWF2ZSk7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICB9O1xyXG5cclxuICAgICAgICAgcmliYm9uSWNvbi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgaGFuZGxlTW91c2VMZWF2ZSk7XHJcbiAgICAgICAgIGNvbnN0IG1lbnVEb20gPSAobWVudSBhcyBhbnkpLmRvbTtcclxuICAgICAgICAgaWYgKG1lbnVEb20pIHtcclxuICAgICAgICAgICAgbWVudURvbS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgaGFuZGxlTW91c2VMZWF2ZSk7XHJcbiAgICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICByZWdpc3RlclN0eWxlcygpO1xyXG4gICB9XHJcblxyXG4gICBwcml2YXRlIGFzeW5jIGxvYWRBcHAoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICBpZiAoIXRoaXMuYXBwLndvcmtzcGFjZSkge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KHJlc29sdmUsIDApO1xyXG4gICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgIH1cclxuXHJcbiAgIHByaXZhdGUgbG9hZExhbmd1YWdlKCk6IHZvaWQge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgICBjb25zdCBsb2NhbGUgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQubGFuZz8udG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKCdmcicpID8gJ2ZyJyA6ICdlbic7XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKCdMYW5ndWUgZFx1MDBFOXRlY3RcdTAwRTllOicsIGxvY2FsZSk7XHJcbiAgICAgICAgIHRoaXMudHJhbnNsYXRpb25zLnNldExhbmd1YWdlKGxvY2FsZSk7XHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgIGNvbnNvbGUud2FybignRXJyZXVyIGxvcnMgZGUgbGEgZFx1MDBFOXRlY3Rpb24gZGUgbGEgbGFuZ3VlLCB1dGlsaXNhdGlvbiBkdSBmcmFuXHUwMEU3YWlzIHBhciBkXHUwMEU5ZmF1dCcpO1xyXG4gICAgICAgICB0aGlzLnRyYW5zbGF0aW9ucy5zZXRMYW5ndWFnZSgnZnInKTtcclxuICAgICAgfVxyXG4gICB9XHJcblxyXG4gICBvbnVubG9hZCgpIHtcclxuICAgICAgdGhpcy5hcHAud29ya3NwYWNlLmRldGFjaExlYXZlc09mVHlwZShcInBsdWdpbmZsb3d6LXZpZXdcIik7XHJcbiAgIH1cclxufVxyXG4iLCAiZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyU3R5bGVzKCkge1xuY29uc3Qgc3R5bGVFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG5zdHlsZUVsLmlkID0gJ3BsdWdpbmZsb3d6LXN0eWxlcyc7XG5zdHlsZUVsLnRleHRDb250ZW50ID0gYFxuICAgIC8qID09PT09IENTUyA9PT09PSAqL1xuICAgIC5tb2RhbC1jb250YWluZXIucGx1Z2luZmxvd3otbW9kYWwge1xuICAgICAgICBwYWRkaW5nOiAxNTBweDtcbiAgICB9XG5cbiAgICAubW9kYWwtY29udGFpbmVyLnBsdWdpbmZsb3d6LW1vZGFsIC5tb2RhbCB7XG4gICAgICAgIHdpZHRoOiBjYWxjKDEwMHZ3IC0gNTAwcHgpO1xuICAgICAgICBoZWlnaHQ6IGNhbGMoMTAwdmggLSAxMDBweCk7XG4gICAgICAgIG1heC13aWR0aDogY2FsYygxMDB2dyAtIDUwMHB4KTtcbiAgICAgICAgbWF4LWhlaWdodDogY2FsYygxMDB2aCAtIDEwMHB4KTtcbiAgICB9XG5cbiAgICAubW9kYWwtY29udGFpbmVyLnBsdWdpbmZsb3d6LW1vZGFsIC5tb2RhbC1iZyB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC41KTtcbiAgICB9XG5cbiAgICAubW9kYWwtY29udGFpbmVyLnBsdWdpbmZsb3d6LW1vZGFsIC5tb2RhbC1jb250ZW50IHtcbiAgICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIH1cblxuICAgIC5wbHVnaW5mbG93ei1kYXNoYm9hcmQtY29udGFpbmVyIHtcbiAgICAgICAgcGFkZGluZzogMjBweDtcbiAgICAgICAgZmxleDogMTtcbiAgICAgICAgb3ZlcmZsb3cteTogYXV0bztcbiAgICB9XG5cbiAgICAucGx1Z2luZmxvd3otcGx1Z2lucy1saXN0IHtcbiAgICAgICAgZGlzcGxheTogZ3JpZDtcbiAgICAgICAgZ2FwOiAyMHB4O1xuICAgICAgICBwYWRkaW5nOiAyMHB4IDA7XG4gICAgfVxuXG4gICAgLnBsdWdpbmZsb3d6LXBsdWdpbi1pdGVtIHtcbiAgICAgICAgYmFja2dyb3VuZDogdmFyKC0tYmFja2dyb3VuZC1zZWNvbmRhcnkpO1xuICAgICAgICBwYWRkaW5nOiAxNXB4O1xuICAgICAgICBib3JkZXItcmFkaXVzOiA1cHg7XG4gICAgfSBcbmA7XG5cbmRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1bnJlZ2lzdGVyU3R5bGVzKCkge1xuY29uc3Qgc3R5bGVFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwbHVnaW5mbG93ei1zdHlsZXMnKTtcbmlmIChzdHlsZUVsKSB7XG4gICAgc3R5bGVFbC5yZW1vdmUoKTtcbn1cbn0gIiwgImltcG9ydCB7IEFwcCwgUGx1Z2luLCBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nLCBNb2RhbH0gZnJvbSAnb2JzaWRpYW4nO1xuaW1wb3J0IHsgVmlld01vZGUgfSBmcm9tICcuL1ZpZXdNb2RlJztcbmltcG9ydCB7IFRWaWV3TW9kZSwgSVBsdWdpbkRhdGEgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IFRyYW5zbGF0aW9ucyB9IGZyb20gJy4vVHJhbnNsYXRpb25zJztcblxuZXhwb3J0IGludGVyZmFjZSBEZWZhdWx0U2V0dGluZ3Mge1xuICAgbGFuZ3VhZ2U6IHN0cmluZztcbiAgIGN1cnJlbnRNb2RlOiBUVmlld01vZGU7XG4gICBhY3RpdmVMZWFmSWQ6IHN0cmluZyB8IG51bGw7XG4gICBlbmFibGVBdXRvVXBkYXRlOiBib29sZWFuO1xuICAgbm90ZXNGb2xkZXI6IHN0cmluZztcbiAgIHRlbXBsYXRlOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX1NFVFRJTkdTOiBEZWZhdWx0U2V0dGluZ3MgPSB7XG4gICBsYW5ndWFnZTogJ2ZyJyxcbiAgIGN1cnJlbnRNb2RlOiAncG9wdXAnLFxuICAgYWN0aXZlTGVhZklkOiBudWxsLFxuICAgZW5hYmxlQXV0b1VwZGF0ZTogdHJ1ZSxcbiAgIG5vdGVzRm9sZGVyOiAncGx1Z2luTm90ZXMnLFxuICAgdGVtcGxhdGU6ICcjIHt7bmFtZX19XFxuXFxue3tkZXNjcmlwdGlvbn19XFxuXFxue3t1cmx9fSdcbn07XG5cbmV4cG9ydCBjbGFzcyBTZXR0aW5ncyB7XG4gICBwcml2YXRlIHN0YXRpYyBwbHVnaW46IFBsdWdpbjtcbiAgIHByaXZhdGUgc3RhdGljIHNldHRpbmdzOiBEZWZhdWx0U2V0dGluZ3M7XG5cbiAgIHN0YXRpYyBpbml0aWFsaXplKHBsdWdpbjogUGx1Z2luKSB7XG4gICAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcbiAgIH1cblxuICAgc3RhdGljIGFzeW5jIGxvYWRTZXR0aW5ncygpOiBQcm9taXNlPERlZmF1bHRTZXR0aW5ncz4ge1xuICAgICAgY29uc3Qgc2F2ZWREYXRhID0gYXdhaXQgdGhpcy5wbHVnaW4ubG9hZERhdGEoKTtcbiAgICAgIHRoaXMuc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX1NFVFRJTkdTLCBzYXZlZERhdGEgfHwge30pO1xuICAgICAgcmV0dXJuIHRoaXMuc2V0dGluZ3M7XG4gICB9XG5cbiAgIHN0YXRpYyBhc3luYyBzYXZlU2V0dGluZ3Moc2V0dGluZ3M6IFBhcnRpYWw8RGVmYXVsdFNldHRpbmdzPikge1xuICAgICAgdGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24odGhpcy5zZXR0aW5ncyB8fCBERUZBVUxUX1NFVFRJTkdTLCBzZXR0aW5ncyk7XG4gICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKTtcbiAgIH1cblxuICAgc3RhdGljIGFzeW5jIHJlZnJlc2goKSB7XG4gICAgICBpZiAodGhpcy5wbHVnaW4gJiYgJ3JlZnJlc2gnIGluIHRoaXMucGx1Z2luKSB7XG4gICAgICAgICBhd2FpdCAodGhpcy5wbHVnaW4gYXMgYW55KS5yZWZyZXNoKCk7XG4gICAgICB9XG4gICB9XG5cbiAgIHN0YXRpYyBhc3luYyBnZXRWaWV3TW9kZSgpOiBQcm9taXNlPFRWaWV3TW9kZT4ge1xuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHRoaXMucGx1Z2luLmxvYWREYXRhKCk7XG4gICAgICByZXR1cm4gKGRhdGE/LmN1cnJlbnRNb2RlIHx8IERFRkFVTFRfU0VUVElOR1MuY3VycmVudE1vZGUpIGFzIFRWaWV3TW9kZTtcbiAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFNldHRpbmdzVGFiIGV4dGVuZHMgUGx1Z2luU2V0dGluZ1RhYiB7XG4gICBwbHVnaW46IFBsdWdpbjtcbiAgIHNldHRpbmdzOiBEZWZhdWx0U2V0dGluZ3MgJiBJUGx1Z2luRGF0YTtcblxuICAgY29uc3RydWN0b3IoXG4gICAgICBhcHA6IEFwcCwgXG4gICAgICBwbHVnaW46IFBsdWdpbiwgXG4gICAgICBzZXR0aW5nczogRGVmYXVsdFNldHRpbmdzLCBcbiAgICAgIHByaXZhdGUgdmlld01vZGU6IFZpZXdNb2RlLFxuICAgICAgcHJpdmF0ZSB0cmFuc2xhdGlvbnM6IFRyYW5zbGF0aW9uc1xuICAgKSB7XG4gICAgICBzdXBlcihhcHAsIHBsdWdpbik7XG4gICAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcbiAgICAgIHRoaXMuc2V0dGluZ3MgPSB7XG4gICAgICAgICAuLi5ERUZBVUxUX1NFVFRJTkdTLFxuICAgICAgICAgZ3JvdXBzOiBbXSxcbiAgICAgICAgIHBsdWdpbnM6IFtdXG4gICAgICB9O1xuICAgICAgXG4gICAgICB0aGlzLmxvYWRTZXR0aW5ncygpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICB9KTtcbiAgIH1cblxuICAgcHJpdmF0ZSBhc3luYyBsb2FkU2V0dGluZ3MoKSB7XG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgdGhpcy5wbHVnaW4ubG9hZERhdGEoKTtcbiAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICB0aGlzLnNldHRpbmdzID0ge1xuICAgICAgICAgICAgLi4uREVGQVVMVF9TRVRUSU5HUyxcbiAgICAgICAgICAgIC4uLmRhdGEsXG4gICAgICAgICAgICBncm91cHM6IGRhdGEuZ3JvdXBzIHx8IFtdLFxuICAgICAgICAgICAgcGx1Z2luczogZGF0YS5wbHVnaW5zIHx8IFtdXG4gICAgICAgICB9O1xuICAgICAgfVxuICAgfVxuXG4gICBhc3luYyBkaXNwbGF5KCk6IHZvaWQge1xuICAgICAgYXdhaXQgdGhpcy5sb2FkU2V0dGluZ3MoKTtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyRWwgfSA9IHRoaXM7XG4gICAgICBjb250YWluZXJFbC5lbXB0eSgpO1xuXG4vLyBNb2RlIGQnYWZmaWNoYWdlIHBhciBkXHUwMEU5ZmF1dFxuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAuc2V0TmFtZSh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5kZWZhdWx0Vmlld01vZGUnKSlcbiAgICAgICAgIC5zZXREZXNjKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLmRlZmF1bHRWaWV3TW9kZURlc2MnKSlcbiAgICAgICAgIC5hZGREcm9wZG93bihkcm9wZG93biA9PiBkcm9wZG93blxuICAgICAgICAgICAgLmFkZE9wdGlvbigndGFiJywgdGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MudGFiJykpXG4gICAgICAgICAgICAuYWRkT3B0aW9uKCdzaWRlYmFyJywgdGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3Muc2lkZWJhcicpKVxuICAgICAgICAgICAgLmFkZE9wdGlvbigncG9wdXAnLCB0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5wb3B1cCcpKVxuICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMuc2V0dGluZ3MuY3VycmVudE1vZGUpXG4gICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzLmN1cnJlbnRNb2RlID0gdmFsdWUgYXMgVFZpZXdNb2RlO1xuICAgICAgICAgICAgICAgYXdhaXQgU2V0dGluZ3Muc2F2ZVNldHRpbmdzKHsgY3VycmVudE1vZGU6IHZhbHVlIGFzIFRWaWV3TW9kZSB9KTtcbiAgICAgICAgICAgICAgIGF3YWl0IHRoaXMudmlld01vZGUuc2V0Vmlldyh2YWx1ZSBhcyBUVmlld01vZGUpO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgXG4vLyBEb3NzaWVyIGRlcyBwbHVnaW5zXG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgIC5zZXROYW1lKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLnBsdWdpbkZvbGRlci5uYW1lJykpXG4gICAgICAgICAuc2V0RGVzYyh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5wbHVnaW5Gb2xkZXIuZGVzYycpKVxuICAgICAgICAgLmFkZFRleHQodGV4dCA9PiB0ZXh0XG4gICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5zZXR0aW5ncy5ub3Rlc0ZvbGRlcilcbiAgICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgIGF3YWl0IFNldHRpbmdzLnNhdmVTZXR0aW5ncyh7IG5vdGVzRm9sZGVyOiB2YWx1ZSB9KTtcbiAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuaW5pdGlhbGl6ZUZvbGRlcnModmFsdWUsIHRoaXMuc2V0dGluZ3MuZ3JvdXBzKTtcbiAgICAgICAgICAgICAgIG5ldyBOb3RpY2UodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MucGx1Z2luRm9sZGVyLnVwZGF0ZWQnKSk7XG4gICAgICAgICAgICB9KSk7XG5cbiBcbi8vIFRlbXBsYXRlIGRlcyBub3Rlc1xuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAuc2V0TmFtZSh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy50ZW1wbGF0ZS5uYW1lJykpXG4gICAgICAgICAuc2V0RGVzYyh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy50ZW1wbGF0ZS5kZXNjJykpXG4gICAgICAgICAuYWRkVGV4dEFyZWEoKHRleHQpID0+IHRleHRcbiAgICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcignIyB7e25hbWV9fVxcblxcbnt7ZGVzY3JpcHRpb259fVxcblxcbnt7dXJsfX0nKVxuICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMuc2V0dGluZ3MudGVtcGxhdGUgfHwgJycpXG4gICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICBhd2FpdCBTZXR0aW5ncy5zYXZlU2V0dGluZ3MoeyB0ZW1wbGF0ZTogdmFsdWUgfSk7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICBcbi8vIERvc3NpZXIgZGVzIGdyb3VwZXNcbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgLnNldE5hbWUodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MuZ3JvdXBGb2xkZXIubmFtZScpKVxuICAgICAgICAgLnNldERlc2ModGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MuZ3JvdXBGb2xkZXIuZGVzYycpKVxuICAgICAgICAgLmFkZFRleHQodGV4dCA9PiB0ZXh0XG4gICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5zZXR0aW5ncy5ub3Rlc0ZvbGRlcilcbiAgICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgIGF3YWl0IFNldHRpbmdzLnNhdmVTZXR0aW5ncyh7IG5vdGVzRm9sZGVyOiB2YWx1ZSB9KTtcbiAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuaW5pdGlhbGl6ZUZvbGRlcnModmFsdWUsIHRoaXMuc2V0dGluZ3MuZ3JvdXBzKTtcbiAgICAgICAgICAgICAgIG5ldyBOb3RpY2UodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MuZ3JvdXBGb2xkZXIudXBkYXRlZCcpKTtcbiAgICAgICAgICAgIH0pKTtcblxuLy8gU2VjdGlvbiBJbXBvcnQvRXhwb3J0XG4gICAgICBjb250YWluZXJFbC5jcmVhdGVFbCgnaDEnLCB7dGV4dDogdGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MuaW1wb3J0RXhwb3J0LnRpdGxlJyl9KTtcblxuLy8gSW1wb3J0IEpTT05cbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgLnNldE5hbWUodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25JbXBvcnQubmFtZScpKVxuICAgICAgICAgLnNldERlc2ModGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25JbXBvcnQuZGVzYycpKVxuICAgICAgICAgLmFkZEJ1dHRvbigoYnV0dG9uOiBCdXR0b25Db21wb25lbnQpID0+IHtcbiAgICAgICAgICAgIGJ1dHRvblxuICAgICAgICAgICAgICAgLnNldEJ1dHRvblRleHQodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25JbXBvcnQuYnV0dG9uJykpXG4gICAgICAgICAgICAgICAub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgICAgICAgICAgICBpbnB1dC50eXBlID0gJ2ZpbGUnO1xuICAgICAgICAgICAgICAgICAgaW5wdXQuYWNjZXB0ID0gJy5qc29uJztcbiAgICAgICAgICAgICAgICAgIGlucHV0LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAgICAgICBjb250YWluZXJFbC5hcHBlbmRDaGlsZChpbnB1dCk7XG5cbiAgICAgICAgICAgICAgICAgIGlucHV0Lm9uY2hhbmdlID0gYXN5bmMgKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICAgICAgICAgICAgICAgaWYgKCF0YXJnZXQuZmlsZXM/Lmxlbmd0aCkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgICAgICBjb25zdCBsb2FkaW5nTm90aWNlID0gbmV3IE5vdGljZSh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkltcG9ydC5sb2FkaW5nJyksIDApO1xuXG4gICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlsZSA9IHRhcmdldC5maWxlc1swXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWRlci5vbmxvYWQgPSBhc3luYyAoZXZlbnQ6IFByb2dyZXNzRXZlbnQ8RmlsZVJlYWRlcj4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQudGFyZ2V0Py5yZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbmZpZyA9IEpTT04ucGFyc2UoZXZlbnQudGFyZ2V0LnJlc3VsdCBhcyBzdHJpbmcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBWXHUwMEU5cmlmaWVyIHF1ZSBsZSBmaWNoaWVyIGNvbnRpZW50IGxlcyBjaGFtcHMgZXNzZW50aWVsc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjb25maWcucGx1Z2lucyB8fCAhQXJyYXkuaXNBcnJheShjb25maWcuZ3JvdXBzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZSh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkltcG9ydC5lcnJvcicpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ3JcdTAwRTllciB1bmUgc2F1dmVnYXJkZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYmFja3VwID0gYXdhaXQgdGhpcy5wbHVnaW4ubG9hZERhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJhY2t1cEpzb24gPSBKU09OLnN0cmluZ2lmeShiYWNrdXAsIG51bGwsIDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYmFja3VwQmxvYiA9IG5ldyBCbG9iKFtiYWNrdXBKc29uXSwgeyB0eXBlOiAnYXBwbGljYXRpb24vanNvbicgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBiYWNrdXBVcmwgPSB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChiYWNrdXBCbG9iKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJhY2t1cEEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrdXBBLmhyZWYgPSBiYWNrdXBVcmw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrdXBBLmRvd25sb2FkID0gJ3BsdWdpbi1mbG93ei1iYWNrdXAuanNvbic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrdXBBLmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuVVJMLnJldm9rZU9iamVjdFVSTChiYWNrdXBVcmwpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBcHBsaXF1ZXIgbGEgbm91dmVsbGUgY29uZmlndXJhdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgU2V0dGluZ3Muc2F2ZVNldHRpbmdzKGNvbmZpZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgTm90aWNlKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uSW1wb3J0LnN1Y2Nlc3MnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJldXIgbG9ycyBkdSBwYXJzaW5nOicsIGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25JbXBvcnQuZXJyb3InKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2FkaW5nTm90aWNlLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25JbXBvcnQuZXJyb3InKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgaW5wdXQuY2xpY2soKTtcbiAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gYnV0dG9uO1xuICAgICAgICAgfSk7XG5cbi8vIEV4cG9ydCBKU09OXG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgIC5zZXROYW1lKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uRXhwb3J0Lm5hbWUnKSlcbiAgICAgICAgIC5zZXREZXNjKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uRXhwb3J0LmRlc2MnKSlcbiAgICAgICAgIC5hZGRCdXR0b24oKGJ1dHRvbjogQnV0dG9uQ29tcG9uZW50KSA9PiBidXR0b25cbiAgICAgICAgICAgIC5zZXRCdXR0b25UZXh0KHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uRXhwb3J0LmJ1dHRvbicpKVxuICAgICAgICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgY29uc3QgbG9hZGluZ05vdGljZSA9IG5ldyBOb3RpY2UodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25FeHBvcnQubG9hZGluZycpLCAwKTtcbiAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgdGhpcy5wbHVnaW4ubG9hZERhdGEoKTtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGpzb25TdHJpbmcgPSBKU09OLnN0cmluZ2lmeShkYXRhLCBudWxsLCAyKTtcblxuICAgICAgICAgICAgICAgICAgY29uc3QgYmxvYiA9IG5ldyBCbG9iKFtqc29uU3RyaW5nXSwgeyB0eXBlOiAnYXBwbGljYXRpb24vanNvbicgfSk7XG4gICAgICAgICAgICAgICAgICBjb25zdCB1cmwgPSB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgICAgICAgICAgICBhLmhyZWYgPSB1cmw7XG4gICAgICAgICAgICAgICAgICBhLmRvd25sb2FkID0gJ3BsdWdpbi1mbG93ei1jb25maWcuanNvbic7XG4gICAgICAgICAgICAgICAgICBhLmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgICB3aW5kb3cuVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpO1xuXG4gICAgICAgICAgICAgICAgICBsb2FkaW5nTm90aWNlLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25FeHBvcnQuc3VjY2VzcycpKTtcbiAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICBsb2FkaW5nTm90aWNlLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25FeHBvcnQuZXJyb3InKSk7XG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKTtcblxuICBjb250YWluZXJFbC5jcmVhdGVFbCgnaHInKVxuXG4vLyBTZWN0aW9uIGRlIGdlc3Rpb24gZGVzIGdyb3VwZXNcbiAgY29udGFpbmVyRWwuY3JlYXRlRWwoJ2gxJywge3RleHQ6IHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLmdyb3Vwcy50aXRsZScpfSlcblxuLy8gQWZmaWNoZXIgbGVzIGdyb3VwZXMgZXhpc3RhbnRzXG4gIHRoaXMuc2V0dGluZ3MuZ3JvdXBzLmZvckVhY2goKGdyb3VwOiBzdHJpbmcsIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICBpZiAoZ3JvdXAgIT09ICdTYW5zIGdyb3VwZScpIHtcbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAuc2V0TmFtZShncm91cClcbiAgICAgICAgLmFkZEJ1dHRvbigoYnV0dG9uOiBCdXR0b25Db21wb25lbnQpID0+IGJ1dHRvblxuICAgICAgICAgIC5zZXRCdXR0b25UZXh0KHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLmdyb3Vwcy5kZWxldGUuYnV0dG9uJykpXG4gICAgICAgICAgLnNldFdhcm5pbmcoKVxuICAgICAgICAgIC5vbkNsaWNrKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGNvbnN0IGdyb3VwUGF0aCA9IGAke3RoaXMuc2V0dGluZ3Mubm90ZXNGb2xkZXJ9LyR7Z3JvdXB9YDtcblxuLy8gRFx1MDBFOXBsYWNlciBsZXMgcGx1Z2lucyBkZSBjZSBncm91cGUgdmVycyBcIlNhbnMgZ3JvdXBlXCJcbiAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5wbHVnaW5zLmZvckVhY2gocGx1Z2luID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocGx1Z2luLmdyb3VwLmluY2x1ZGVzKGdyb3VwKSkge1xuICAgICAgICAgICAgICAgICAgcGx1Z2luLmdyb3VwID0gcGx1Z2luLmdyb3VwLmZpbHRlcihnID0+IGcgIT09IGdyb3VwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuXG4vLyBTdXBwcmltZXIgbGUgZ3JvdXBlIGRlcyBwYXJhbVx1MDBFOHRyZXNcbiAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5ncm91cHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgYXdhaXQgU2V0dGluZ3Muc2F2ZVNldHRpbmdzKHRoaXMuc2V0dGluZ3MpO1xuXG4gICAgICAgICAgICAgIG5ldyBOb3RpY2UodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MuZ3JvdXBzLmRlbGV0ZS5zdWNjZXNzJykgKyBgIDogJHtncm91cH1gKTtcbiAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBFcnJldXIgbG9ycyBkZSBsYSBzdXBwcmVzc2lvbiBkdSBncm91cGUgJHtncm91cH06YCwgZXJyb3IpO1xuICAgICAgICAgICAgICBuZXcgTm90aWNlKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLmdyb3Vwcy5kZWxldGUuZXJyb3InKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkpXG4gICAgfVxuICB9KVxuXG4vLyBBam91dGVyIHVuIG5vdXZlYXUgZ3JvdXBlXG4gIGxldCBpbnB1dFRleHQgPSAnJztcbiAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgLnNldE5hbWUodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MuZ3JvdXBzLmFkZC5uYW1lJykpXG4gICAgLnNldERlc2ModGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MuZ3JvdXBzLmFkZC5kZXNjJykpXG4gICAgLmFkZFRleHQodGV4dCA9PiB0ZXh0XG4gICAgICAuc2V0UGxhY2Vob2xkZXIodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MuZ3JvdXBzLmFkZC5wbGFjZWhvbGRlcicpKVxuICAgICAgLnNldFZhbHVlKCcnKVxuICAgICAgLm9uQ2hhbmdlKCh2YWx1ZTogc3RyaW5nKSA9PiB7XG4gICAgICAgIGlucHV0VGV4dCA9IHZhbHVlO1xuICAgICAgfSlcbiAgICAgIC5pbnB1dEVsLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgYXN5bmMgKGU6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgICAgaWYgKGUua2V5ID09PSAnRW50ZXInICYmIGlucHV0VGV4dC50cmltKCkpIHtcbiAgICAgICAgICBjb25zdCBncm91cE5hbWUgPSBpbnB1dFRleHQudHJpbSgpO1xuICAgICAgICAgIGNvbnN0IGN1cnJlbnRTZXR0aW5ncyA9IHRoaXMucGx1Z2luLnNldHRpbmdzU2VydmljZS5nZXRTZXR0aW5ncygpO1xuICAgICAgICAgIGlmICghY3VycmVudFNldHRpbmdzLmdyb3Vwcy5pbmNsdWRlcyhncm91cE5hbWUpKSB7XG4vLyBDclx1MDBFOWVyIGxlIGRvc3NpZXIgcG91ciBsZSBub3V2ZWF1IGdyb3VwZVxuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uZmlsZVNlcnZpY2UuZW5zdXJlRm9sZGVyKGAke2N1cnJlbnRTZXR0aW5ncy5yc3NGb2xkZXJ9LyR7Z3JvdXBOYW1lfWApO1xuICAgICAgICAgICAgXG4vLyBBam91dGVyIGxlIGdyb3VwZSBhdXggcGFyYW1cdTAwRTh0cmVzXG4gICAgICAgICAgICBjdXJyZW50U2V0dGluZ3MuZ3JvdXBzLnB1c2goZ3JvdXBOYW1lKTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNldHRpbmdzU2VydmljZS51cGRhdGVTZXR0aW5ncyhjdXJyZW50U2V0dGluZ3MpO1xuICAgICAgICAgICAgbmV3IE5vdGljZSh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5ncm91cHMuYWRkLnN1Y2Nlc3MnKSArIGAgOiAke2dyb3VwTmFtZX1gKTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXcgTm90aWNlKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLmdyb3Vwcy5hZGQuZXJyb3InKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KSk7XG5cbiAgY29udGFpbmVyRWwuY3JlYXRlRWwoJ2hyJyk7XG4gIGNvbnRhaW5lckVsLmNyZWF0ZUVsKCdoMScsIHt0ZXh0OiB0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5wbHVnaW5zLnRpdGxlJyl9KTtcblxuLy8gQmFycmUgZGUgcmVjaGVyY2hlIHBvdXIgbGVzIHBsdWdpbnNcbiAgICAgIGNvbnN0IHNlYXJjaENvbnRhaW5lciA9IGNvbnRhaW5lckVsLmNyZWF0ZURpdigncGx1Z2luZmxvd3otc2VhcmNoLWNvbnRhaW5lcicpO1xuICAgICAgY29uc3Qgc2VhcmNoSW5wdXQgPSBzZWFyY2hDb250YWluZXIuY3JlYXRlRWwoJ2lucHV0Jywge1xuICAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICAgcGxhY2Vob2xkZXI6IHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLnBsdWdpbnMuc2VhcmNoLnBsYWNlaG9sZGVyJyksXG4gICAgICAgICBjbHM6ICdwbHVnaW5mbG93ei1wbHVnaW4tc2VhcmNoLWlucHV0J1xuICAgICAgfSk7XG5cbi8vIENvbnRhaW5lciBwb3VyIHRvdXMgbGVzIHBsdWdpbnNcbiAgICAgIGNvbnN0IHBsdWdpbnNDb250YWluZXIgPSBjb250YWluZXJFbC5jcmVhdGVEaXYoJ3BsdWdpbmZsb3d6LXBsdWdpbnMtY29udGFpbmVyJyk7XG4gIFxuLy8gRm9uY3Rpb24gcG91ciBmaWx0cmVyIGV0IGFmZmljaGVyIGxlcyBwbHVnaW5zXG4gICAgICBjb25zdCBmaWx0ZXJBbmREaXNwbGF5UGx1Z2lucyA9IChzZWFyY2hUZXJtID0gJycpID0+IHtcbiAgICAgICAgIHBsdWdpbnNDb250YWluZXIuZW1wdHkoKTtcbiAgICAgICAgIGNvbnN0IGdyb3VwZWRQbHVnaW5zOiBSZWNvcmQ8c3RyaW5nLCBBcnJheTx7cGx1Z2luOiBJUGx1Z2luLCBpbmRleDogbnVtYmVyfT4+ID0ge307XG4gICAgICAgICBcbiAgICAgICAgIHRoaXMuc2V0dGluZ3MucGx1Z2luc1xuICAgICAgICAgICAgLmZpbHRlcihwbHVnaW4gPT4gXG4gICAgICAgICAgICAgICBwbHVnaW4udGl0bGUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhzZWFyY2hUZXJtLnRvTG93ZXJDYXNlKCkpIHx8XG4gICAgICAgICAgICAgICBwbHVnaW4uZGVzY3JpcHRpb24udG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhzZWFyY2hUZXJtLnRvTG93ZXJDYXNlKCkpIHx8XG4gICAgICAgICAgICAgICBwbHVnaW4uZ3JvdXAuc29tZShnID0+IGcudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhzZWFyY2hUZXJtLnRvTG93ZXJDYXNlKCkpKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmZvckVhY2goKHBsdWdpbiwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgIHBsdWdpbi5ncm91cC5mb3JFYWNoKGdyb3VwID0+IHtcbiAgICAgICAgICAgICAgICAgIGlmICghZ3JvdXBlZFBsdWdpbnNbZ3JvdXBdKSB7XG4gICAgICAgICAgICAgICAgICAgICBncm91cGVkUGx1Z2luc1tncm91cF0gPSBbXTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGdyb3VwZWRQbHVnaW5zW2dyb3VwXS5wdXNoKHtwbHVnaW4sIGluZGV4fSk7XG4gICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICBPYmplY3QuZW50cmllcyhncm91cGVkUGx1Z2lucykuZm9yRWFjaCgoW2dyb3VwTmFtZSwgcGx1Z2luc10pID0+IHtcbiAgICAgICAgICAgIHBsdWdpbnNDb250YWluZXIuY3JlYXRlRWwoJ2gyJywge3RleHQ6IGdyb3VwTmFtZX0pO1xuXG4gICAgICAgICAgICBwbHVnaW5zLmZvckVhY2goKHtwbHVnaW4sIGluZGV4fSkgPT4ge1xuICAgICAgICAgICAgICAgY29uc3QgcGx1Z2luQ29udGFpbmVyID0gcGx1Z2luc0NvbnRhaW5lci5jcmVhdGVEaXYoJ3BsdWdpbmZsb3d6LXBsdWdpbi1jb250YWluZXIgY29sbGFwc2VkJyk7XG4gICAgICAgICAgICAgICBjb25zdCBoZWFkZXJDb250YWluZXIgPSBwbHVnaW5Db250YWluZXIuY3JlYXRlRGl2KCdwbHVnaW5mbG93ei1wbHVnaW4taGVhZGVyJyk7XG4gICAgICAgICAgICAgICBcbi8vIEFqb3V0ZXIgbGUgdGl0cmUgZXQgbGUgc3RhdHV0IGR1IHBsdWdpblxuICAgICAgICAgICAgICAgY29uc3QgdGl0bGVDb250YWluZXIgPSBoZWFkZXJDb250YWluZXIuY3JlYXRlRGl2KCdwbHVnaW5mbG93ei1wbHVnaW4tdGl0bGUtY29udGFpbmVyJyk7XG4gICAgICAgICAgICAgICB0aXRsZUNvbnRhaW5lci5jcmVhdGVFbCgnc3BhbicsIHsgdGV4dDogcGx1Z2luLnRpdGxlIH0pO1xuICAgICAgICAgICAgICAgXG4vLyBBam91dGVyIGxlcyB0YWdzXG4gICAgICAgICAgICAgICBjb25zdCB0YWdzQ29udGFpbmVyID0gdGl0bGVDb250YWluZXIuY3JlYXRlRGl2KCdwbHVnaW5mbG93ei1wbHVnaW4tdGFncy1jb250YWluZXInKTtcbiAgICAgICAgICAgICAgIHBsdWdpbi50YWdzLmZvckVhY2godGFnID0+IHtcbiAgICAgICAgICAgICAgICAgIHRhZ3NDb250YWluZXIuY3JlYXRlRWwoJ3NwYW4nLCB7IFxuICAgICAgICAgICAgICAgICAgICAgdGV4dDogdGFnLFxuICAgICAgICAgICAgICAgICAgICAgY2xzOiAncGx1Z2luZmxvd3otcGx1Z2luLXRhZydcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgIGNvbnN0IG9wdGlvbnNDb250YWluZXIgPSBwbHVnaW5Db250YWluZXIuY3JlYXRlRGl2KCdwbHVnaW5mbG93ei1wbHVnaW4tb3B0aW9ucycpO1xuICAgICAgICAgICAgICAgb3B0aW9uc0NvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG4vLyBDclx1MDBFOWVyIHVuIGNvbnRlbmV1ciBwb3VyIGxlcyBib3V0b25zXG4gICAgICAgICAgICAgICBjb25zdCBidXR0b25Db250YWluZXIgPSBoZWFkZXJDb250YWluZXIuY3JlYXRlRGl2KCdwbHVnaW5mbG93ei1wbHVnaW4tYnV0dG9ucycpO1xuXG4gICAgICAgICAgICAgICBsZXQgdG9nZ2xlQnV0dG9uOiBCdXR0b25Db21wb25lbnQ7XG5cbi8vIEZvbmN0aW9uIHBvdXIgdG9nZ2xlIGxlIHBsdWdpblxuICAgICAgICAgICAgICAgY29uc3QgdG9nZ2xlUGx1Z2luID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgY29uc3QgaXNDb2xsYXBzZWQgPSBwbHVnaW5Db250YWluZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdjb2xsYXBzZWQnKTtcbiAgICAgICAgICAgICAgICAgIHBsdWdpbkNvbnRhaW5lci5jbGFzc0xpc3QudG9nZ2xlKCdjb2xsYXBzZWQnKTtcbiAgICAgICAgICAgICAgICAgIG9wdGlvbnNDb250YWluZXIuc3R5bGUuZGlzcGxheSA9IGlzQ29sbGFwc2VkID8gJ2Jsb2NrJyA6ICdub25lJztcbiAgICAgICAgICAgICAgICAgIGlmICh0b2dnbGVCdXR0b24pIHtcbiAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZUJ1dHRvbi5zZXRJY29uKGlzQ29sbGFwc2VkID8gJ2NoZXZyb24tdXAnIDogJ2NoZXZyb24tZG93bicpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgfTtcblxuLy8gQWpvdXRlciBsZXMgYm91dG9ucyBkYW5zIGxldXIgY29udGVuZXVyXG4gICAgICAgICAgICAgICBuZXcgU2V0dGluZyhidXR0b25Db250YWluZXIpXG4gICAgICAgICAgICAgICAgICAuYWRkRXh0cmFCdXR0b24oKGJ1dHRvbjogQnV0dG9uQ29tcG9uZW50KSA9PiBidXR0b25cbiAgICAgICAgICAgICAgICAgICAgIC5zZXRJY29uKHBsdWdpbi5hY3RpdmF0ZSA/ICdjaGVjay1jaXJjbGUnIDogJ2NpcmNsZScpXG4gICAgICAgICAgICAgICAgICAgICAuc2V0VG9vbHRpcChwbHVnaW4uYWN0aXZhdGUgPyBcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLnBsdWdpbnMuZGVhY3RpdmF0ZS50b29sdGlwJykgOiBcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLnBsdWdpbnMuYWN0aXZhdGUudG9vbHRpcCcpKVxuICAgICAgICAgICAgICAgICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGx1Z2luLmFjdGl2YXRlID0gIXBsdWdpbi5hY3RpdmF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IFNldHRpbmdzLnNhdmVTZXR0aW5ncyh0aGlzLnNldHRpbmdzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbi5zZXRJY29uKHBsdWdpbi5hY3RpdmF0ZSA/ICdjaGVjay1jaXJjbGUnIDogJ2NpcmNsZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZSh0aGlzLnRyYW5zbGF0aW9ucy50KHBsdWdpbi5hY3RpdmF0ZSA/IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuYWN0aXZhdGVkJyA6IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuZGVhY3RpdmF0ZWQnXG4gICAgICAgICAgICAgICAgICAgICAgICApLnJlcGxhY2UoJ3t0aXRsZX0nLCBwbHVnaW4udGl0bGUpKTtcbiAgICAgICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICAgICAgLmFkZEV4dHJhQnV0dG9uKChidXR0b246IEJ1dHRvbkNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgdG9nZ2xlQnV0dG9uID0gYnV0dG9uO1xuICAgICAgICAgICAgICAgICAgICAgYnV0dG9uLnNldEljb24oJ2NoZXZyb24tZG93bicpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2V0VG9vbHRpcCh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5wbHVnaW5zLnRvZ2dsZS50b29sdGlwJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAub25DbGljaygoKSA9PiB0b2dnbGVQbHVnaW4oKSk7XG4gICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnV0dG9uO1xuICAgICAgICAgICAgICAgICAgfSk7XG5cbi8vIFJlbmRyZSBsZSBoZWFkZXIgY2xpcXVhYmxlXG4gICAgICAgICAgICAgICBoZWFkZXJDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICAgICAgICAgIGlmICghdGFyZ2V0LmNsb3Nlc3QoJy5wbHVnaW5mbG93ei1wbHVnaW4tYnV0dG9ucycpKSB7XG4gICAgICAgICAgICAgICAgICAgICB0b2dnbGVQbHVnaW4oKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgIH0pO1xuXG4vLyBPcHRpb25zIGR1IHBsdWdpblxuICAgICAgICAgICAgICAgbmV3IFNldHRpbmcob3B0aW9uc0NvbnRhaW5lcilcbiAgICAgICAgICAgICAgICAgIC5zZXROYW1lKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLnBsdWdpbnMub3B0aW9ucy5zdGF0dXMnKSlcbiAgICAgICAgICAgICAgICAgIC5hZGREcm9wZG93bigoZHJvcGRvd246IERyb3Bkb3duQ29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICBkcm9wZG93bi5hZGRPcHRpb24oJ2V4cGxvcmluZycsIHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLnBsdWdpbnMuc3RhdHVzLmV4cGxvcmluZycpKTtcbiAgICAgICAgICAgICAgICAgICAgIGRyb3Bkb3duLmFkZE9wdGlvbignYWN0aXZlJywgdGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MucGx1Z2lucy5zdGF0dXMuYWN0aXZlJykpO1xuICAgICAgICAgICAgICAgICAgICAgZHJvcGRvd24uYWRkT3B0aW9uKCdpbmFjdGl2ZScsIHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLnBsdWdpbnMuc3RhdHVzLmluYWN0aXZlJykpO1xuICAgICAgICAgICAgICAgICAgICAgZHJvcGRvd24uc2V0VmFsdWUocGx1Z2luLnN0YXR1c1swXSk7XG4gICAgICAgICAgICAgICAgICAgICBkcm9wZG93bi5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MucGx1Z2luc1tpbmRleF0uc3RhdHVzID0gW3ZhbHVlIGFzIFRQbHVnaW5TdGF0dXNdO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgU2V0dGluZ3Muc2F2ZVNldHRpbmdzKHRoaXMuc2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICB9KTtcblxuLy8gR3JvdXBlcyBkdSBwbHVnaW5cbiAgICAgICAgICAgICAgIG5ldyBTZXR0aW5nKG9wdGlvbnNDb250YWluZXIpXG4gICAgICAgICAgICAgICAgICAuc2V0TmFtZSh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5wbHVnaW5zLm9wdGlvbnMuZ3JvdXBzJykpXG4gICAgICAgICAgICAgICAgICAuYWRkRHJvcGRvd24oKGRyb3Bkb3duOiBEcm9wZG93bkNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgZHJvcGRvd24uYWRkT3B0aW9uKCcnLCB0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5wbHVnaW5zLmdyb3Vwcy5ub25lJykpO1xuICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5ncm91cHMuZm9yRWFjaChnID0+IFxuICAgICAgICAgICAgICAgICAgICAgICAgZHJvcGRvd24uYWRkT3B0aW9uKGcsIGcpXG4gICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgZHJvcGRvd24uc2V0VmFsdWUocGx1Z2luLmdyb3VwWzBdIHx8ICcnKTtcbiAgICAgICAgICAgICAgICAgICAgIGRyb3Bkb3duLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvbGRHcm91cHMgPSBbLi4ucGx1Z2luLmdyb3VwXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld0dyb3VwID0gdmFsdWUgfHwgJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV3R3JvdXAgJiYgIXBsdWdpbi5ncm91cC5pbmNsdWRlcyhuZXdHcm91cCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsdWdpbi5ncm91cC5wdXNoKG5ld0dyb3VwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgU2V0dGluZ3Muc2F2ZVNldHRpbmdzKHRoaXMuc2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNvdXJjZUdyb3VwcyA9IG9sZEdyb3Vwcy5sZW5ndGggPyBvbGRHcm91cHMuam9pbignLCAnKSA6IHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLnBsdWdpbnMuZ3JvdXBzLm5vbmUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlc3RpbmF0aW9uR3JvdXBzID0gcGx1Z2luLmdyb3VwLmpvaW4oJywgJykgfHwgdGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MucGx1Z2lucy5ncm91cHMubm9uZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZSh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5wbHVnaW5zLmdyb3Vwcy51cGRhdGVkJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKCd7dGl0bGV9JywgcGx1Z2luLnRpdGxlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoJ3tmcm9tfScsIHNvdXJjZUdyb3VwcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKCd7dG99JywgZGVzdGluYXRpb25Hcm91cHMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0VycmV1ciBsb3JzIGRlIGxhIG1pc2UgXHUwMEUwIGpvdXIgZGVzIGdyb3VwZXM6JywgZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZSh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5wbHVnaW5zLmdyb3Vwcy5lcnJvcicpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfSk7XG5cbi8vIE5vdGUgZHUgcGx1Z2luXG4gICAgICAgICAgICAgICBuZXcgU2V0dGluZyhvcHRpb25zQ29udGFpbmVyKVxuICAgICAgICAgICAgICAgICAgLnNldE5hbWUodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MucGx1Z2lucy5vcHRpb25zLnJhdGluZycpKVxuICAgICAgICAgICAgICAgICAgLmFkZFNsaWRlcihzbGlkZXIgPT4gc2xpZGVyXG4gICAgICAgICAgICAgICAgICAgICAuc2V0TGltaXRzKDEsIDUsIDEpXG4gICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUocGx1Z2luLnJhdGluZylcbiAgICAgICAgICAgICAgICAgICAgIC5zZXREeW5hbWljVG9vbHRpcCgpXG4gICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzLnBsdWdpbnNbaW5kZXhdLnJhdGluZyA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgU2V0dGluZ3Muc2F2ZVNldHRpbmdzKHRoaXMuc2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAgICBuZXcgU2V0dGluZyhvcHRpb25zQ29udGFpbmVyKVxuICAgICAgICAgICAgICAgICAgLnNldE5hbWUodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MucGx1Z2lucy5vcHRpb25zLnVyZ2VuY3knKSlcbiAgICAgICAgICAgICAgICAgIC5hZGRTbGlkZXIoc2xpZGVyID0+IHNsaWRlclxuICAgICAgICAgICAgICAgICAgICAgLnNldExpbWl0cygxLCAzLCAxKVxuICAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHBsdWdpbi51cmdlbmN5KVxuICAgICAgICAgICAgICAgICAgICAgLnNldER5bmFtaWNUb29sdGlwKClcbiAgICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MucGx1Z2luc1tpbmRleF0udXJnZW5jeSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgU2V0dGluZ3Muc2F2ZVNldHRpbmdzKHRoaXMuc2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAgICBuZXcgU2V0dGluZyhvcHRpb25zQ29udGFpbmVyKVxuICAgICAgICAgICAgICAgICAgLnNldE5hbWUodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MucGx1Z2lucy5vcHRpb25zLmltcG9ydGFuY2UnKSlcbiAgICAgICAgICAgICAgICAgIC5hZGRTbGlkZXIoc2xpZGVyID0+IHNsaWRlclxuICAgICAgICAgICAgICAgICAgICAgLnNldExpbWl0cygxLCAzLCAxKVxuICAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHBsdWdpbi5pbXBvcnRhbmNlKVxuICAgICAgICAgICAgICAgICAgICAgLnNldER5bmFtaWNUb29sdGlwKClcbiAgICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MucGx1Z2luc1tpbmRleF0uaW1wb3J0YW5jZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgU2V0dGluZ3Muc2F2ZVNldHRpbmdzKHRoaXMuc2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICB9KTtcbiAgICAgIH07XG5cbi8vIEluaXRpYWxpc2VyIGwnYWZmaWNoYWdlIGV0IGxhIHJlY2hlcmNoZVxuICAgICAgZmlsdGVyQW5kRGlzcGxheVBsdWdpbnMoKTtcbiAgICAgIHNlYXJjaElucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGUpID0+IHtcbiAgICAgICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgICBmaWx0ZXJBbmREaXNwbGF5UGx1Z2lucyh0YXJnZXQudmFsdWUpO1xuICAgICAgfSk7XG4gICB9XG5cbiAgIGFzeW5jIGNvbmZpcm1EZWxldGUocGx1Z2luVGl0bGU6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICBjb25zdCBtb2RhbCA9IG5ldyBNb2RhbCh0aGlzLmFwcCk7XG4gICAgICAgICBtb2RhbC50aXRsZUVsLnNldFRleHQodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MucGx1Z2lucy5kZWxldGUuY29uZmlybScpKTtcblxuICAgICAgICAgbW9kYWwuY29udGVudEVsLmVtcHR5KCk7XG4gICAgICAgICBtb2RhbC5jb250ZW50RWwuY3JlYXRlRWwoXCJwXCIsIHsgXG4gICAgICAgICAgICB0ZXh0OiB0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5wbHVnaW5zLmRlbGV0ZS5jb25maXJtTWVzc2FnZScpLnJlcGxhY2UoJ3t0aXRsZX0nLCBwbHVnaW5UaXRsZSkgXG4gICAgICAgICB9KTtcblxuICAgICAgICAgbmV3IFNldHRpbmcobW9kYWwuY29udGVudEVsKVxuICAgICAgICAgICAgLmFkZEJ1dHRvbihidG4gPT4gYnRuXG4gICAgICAgICAgICAgICAuc2V0QnV0dG9uVGV4dCh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5wbHVnaW5zLmRlbGV0ZS5jYW5jZWwnKSlcbiAgICAgICAgICAgICAgIC5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgIG1vZGFsLmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgLmFkZEJ1dHRvbihidG4gPT4gYnRuXG4gICAgICAgICAgICAgICAuc2V0QnV0dG9uVGV4dCh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5wbHVnaW5zLmRlbGV0ZS5jb25maXJtJykpXG4gICAgICAgICAgICAgICAuc2V0V2FybmluZygpXG4gICAgICAgICAgICAgICAub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICBtb2RhbC5jbG9zZSgpO1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICBtb2RhbC5vcGVuKCk7XG4gICAgICB9KTtcbiAgIH1cblxuICAgYXN5bmMgY3JlYXRlTmV3R3JvdXAoKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgIGNvbnN0IG1vZGFsID0gbmV3IE1vZGFsKHRoaXMuYXBwKTtcbiAgICAgICAgIG1vZGFsLnRpdGxlRWwuc2V0VGV4dCh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5wbHVnaW5zLmdyb3VwLmFkZCcpKTtcblxuICAgICAgICAgbW9kYWwuY29udGVudEVsLmVtcHR5KCk7XG4gICAgICAgICBjb25zdCBpbnB1dENvbnRhaW5lciA9IG1vZGFsLmNvbnRlbnRFbC5jcmVhdGVEaXYoKTtcbiAgICAgICAgIGNvbnN0IGlucHV0ID0gbmV3IFNldHRpbmcoaW5wdXRDb250YWluZXIpXG4gICAgICAgICAgICAuc2V0TmFtZSh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5wbHVnaW5zLmdyb3VwLm5hbWUnKSlcbiAgICAgICAgICAgIC5hZGRUZXh0KHRleHQgPT4gdGV4dFxuICAgICAgICAgICAgICAgLnNldFBsYWNlaG9sZGVyKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLnBsdWdpbnMuZ3JvdXAucGxhY2Vob2xkZXInKSlcbiAgICAgICAgICAgICAgIC5zZXRWYWx1ZShcIlwiKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgbmV3IFNldHRpbmcobW9kYWwuY29udGVudEVsKVxuICAgICAgICAgICAgLmFkZEJ1dHRvbihidG4gPT4gYnRuXG4gICAgICAgICAgICAgICAuc2V0QnV0dG9uVGV4dCh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5wbHVnaW5zLmdyb3VwLmNhbmNlbCcpKVxuICAgICAgICAgICAgICAgLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgbW9kYWwuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICAgIHJlc29sdmUobnVsbCk7XG4gICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgIC5hZGRCdXR0b24oYnRuID0+IGJ0blxuICAgICAgICAgICAgICAgLnNldEJ1dHRvblRleHQodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MucGx1Z2lucy5ncm91cC5jcmVhdGUnKSlcbiAgICAgICAgICAgICAgIC5zZXRDdGEoKVxuICAgICAgICAgICAgICAgLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBpbnB1dC5jb21wb25lbnRzWzBdLmdldFZhbHVlKCkudHJpbSgpO1xuICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICBtb2RhbC5jbG9zZSgpO1xuICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZSh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5wbHVnaW5zLmdyb3VwLmVycm9yJykpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICBtb2RhbC5vcGVuKCk7XG4gICAgICB9KTtcbiAgIH1cbn0iLCAiZXhwb3J0IHR5cGUgVHJhbnNsYXRpb25LZXkgPSBcclxuICAgLy8gRGFzaGJvYXJkXHJcbiAgIHwgJ2Rhc2hib2FyZC50aXRsZSdcclxuICAgfCAnZGFzaGJvYXJkLmRlc2NyaXB0aW9uJ1xyXG4gICB8ICdkYXNoYm9hcmQudmlld01vZGUnXHJcbiAgIHwgJ2Rhc2hib2FyZC52aWV3TW9kZURlc2MnXHJcbiAgIHwgJ2Rhc2hib2FyZC52aWV3TW9kZVRhYidcclxuICAgfCAnZGFzaGJvYXJkLnZpZXdNb2RlU2lkZWJhcidcclxuICAgfCAnZGFzaGJvYXJkLnZpZXdNb2RlUG9wdXAnXHJcbiAgIC8vIE5vdGljZXNcclxuICAgfCAnbm90aWNlcy5zYXZlZCdcclxuICAgfCAnbm90aWNlcy5lcnJvcidcclxuICAgfCAnbm90aWNlcy5zdWNjZXNzJ1xyXG4gICB8ICdub3RpY2VzLmZlYXR1cmVFbmFibGVkJ1xyXG4gICB8ICdub3RpY2VzLmZlYXR1cmVEaXNhYmxlZCdcclxuICAgLy8gQ29tbWFuZHNcclxuICAgfCAnY29tbWFuZHMub3BlbkRhc2hib2FyZCdcclxuICAgLy8gRXJyb3JzXHJcbiAgIC8vIFNldHRpbmdzXHJcbiAgIHwgJ3NldHRpbmdzLmRlZmF1bHRWaWV3TW9kZSdcclxuICAgfCAnc2V0dGluZ3MuZGVmYXVsdFZpZXdNb2RlRGVzYydcclxuICAgfCAnc2V0dGluZ3MudGFiJ1xyXG4gICB8ICdzZXR0aW5ncy5zaWRlYmFyJ1xyXG4gICB8ICdzZXR0aW5ncy5wb3B1cCdcclxuICAgfCAnc2V0dGluZ3MucGx1Z2luRm9sZGVyLm5hbWUnXHJcbiAgIHwgJ3NldHRpbmdzLnBsdWdpbkZvbGRlci5kZXNjJ1xyXG4gICB8ICdzZXR0aW5ncy5wbHVnaW5Gb2xkZXIudXBkYXRlZCdcclxuICAgfCAnc2V0dGluZ3MudGVtcGxhdGUubmFtZSdcclxuICAgfCAnc2V0dGluZ3MudGVtcGxhdGUuZGVzYydcclxuICAgfCAnc2V0dGluZ3MuZ3JvdXBGb2xkZXIubmFtZSdcclxuICAgfCAnc2V0dGluZ3MuZ3JvdXBGb2xkZXIuZGVzYydcclxuICAgfCAnc2V0dGluZ3MuZ3JvdXBGb2xkZXIudXBkYXRlZCdcclxuICAgfCAnc2V0dGluZ3MuaW1wb3J0RXhwb3J0LnRpdGxlJ1xyXG4gICB8ICdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkltcG9ydC5uYW1lJ1xyXG4gICB8ICdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkltcG9ydC5kZXNjJ1xyXG4gICB8ICdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkltcG9ydC5idXR0b24nXHJcbiAgIHwgJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uSW1wb3J0LmxvYWRpbmcnXHJcbiAgIHwgJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uSW1wb3J0LnN1Y2Nlc3MnXHJcbiAgIHwgJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uSW1wb3J0LmVycm9yJ1xyXG4gICB8ICdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkV4cG9ydC5uYW1lJ1xyXG4gICB8ICdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkV4cG9ydC5kZXNjJ1xyXG4gICB8ICdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkV4cG9ydC5idXR0b24nXHJcbiAgIHwgJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uRXhwb3J0LmxvYWRpbmcnXHJcbiAgIHwgJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uRXhwb3J0LnN1Y2Nlc3MnXHJcbiAgIHwgJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uRXhwb3J0LmVycm9yJ1xyXG4gICB8ICdzZXR0aW5ncy5ncm91cHMudGl0bGUnXHJcbiAgIHwgJ3NldHRpbmdzLmdyb3Vwcy5kZWxldGUuYnV0dG9uJ1xyXG4gICB8ICdzZXR0aW5ncy5ncm91cHMuZGVsZXRlLnN1Y2Nlc3MnXHJcbiAgIHwgJ3NldHRpbmdzLmdyb3Vwcy5kZWxldGUuZXJyb3InXHJcbiAgIHwgJ3NldHRpbmdzLmdyb3Vwcy5hZGQubmFtZSdcclxuICAgfCAnc2V0dGluZ3MuZ3JvdXBzLmFkZC5kZXNjJ1xyXG4gICB8ICdzZXR0aW5ncy5ncm91cHMuYWRkLnBsYWNlaG9sZGVyJ1xyXG4gICB8ICdzZXR0aW5ncy5ncm91cHMuYWRkLnN1Y2Nlc3MnXHJcbiAgIHwgJ3NldHRpbmdzLmdyb3Vwcy5hZGQuZXJyb3InXHJcbiAgIHwgJ3NldHRpbmdzLnBsdWdpbnMudGl0bGUnXHJcbiAgIHwgJ3NldHRpbmdzLnBsdWdpbnMuc2VhcmNoLnBsYWNlaG9sZGVyJ1xyXG4gICB8ICdzZXR0aW5ncy5wbHVnaW5zLm9wdGlvbnMuc3RhdHVzJ1xyXG4gICB8ICdzZXR0aW5ncy5wbHVnaW5zLnN0YXR1cy5leHBsb3JpbmcnXHJcbiAgIHwgJ3NldHRpbmdzLnBsdWdpbnMuc3RhdHVzLmFjdGl2ZSdcclxuICAgfCAnc2V0dGluZ3MucGx1Z2lucy5zdGF0dXMuaW5hY3RpdmUnXHJcbiAgIHwgJ3NldHRpbmdzLnBsdWdpbnMub3B0aW9ucy5ncm91cHMnXHJcbiAgIHwgJ3NldHRpbmdzLnBsdWdpbnMuZ3JvdXBzLm5vbmUnXHJcbiAgIHwgJ3NldHRpbmdzLnBsdWdpbnMuZ3JvdXBzLnVwZGF0ZWQnXHJcbiAgIHwgJ3NldHRpbmdzLnBsdWdpbnMuZ3JvdXBzLmVycm9yJ1xyXG4gICB8ICdzZXR0aW5ncy5wbHVnaW5zLm9wdGlvbnMucmF0aW5nJ1xyXG4gICB8ICdzZXR0aW5ncy5wbHVnaW5zLm9wdGlvbnMudXJnZW5jeSdcclxuICAgfCAnc2V0dGluZ3MucGx1Z2lucy5vcHRpb25zLmltcG9ydGFuY2UnXHJcbiAgIHwgJ3NldHRpbmdzLnBsdWdpbnMuZGVsZXRlLmJ1dHRvbidcclxuICAgfCAnc2V0dGluZ3MucGx1Z2lucy5kZWxldGUuY29uZmlybSdcclxuICAgfCAnc2V0dGluZ3MucGx1Z2lucy5kZWxldGUuY29uZmlybU1lc3NhZ2UnXHJcbiAgIHwgJ3NldHRpbmdzLnBsdWdpbnMuZGVsZXRlLmNhbmNlbCdcclxuICAgfCAnc2V0dGluZ3MucGx1Z2lucy5kZWxldGVkJ1xyXG4gICB8ICdzZXR0aW5ncy5wbHVnaW5zLmFjdGl2YXRlLnRvb2x0aXAnXHJcbiAgIHwgJ3NldHRpbmdzLnBsdWdpbnMuZGVhY3RpdmF0ZS50b29sdGlwJ1xyXG4gICB8ICdzZXR0aW5ncy5wbHVnaW5zLnRvZ2dsZS50b29sdGlwJ1xyXG4gICB8ICdzZXR0aW5ncy5wbHVnaW5zLmFjdGl2YXRlZCdcclxuICAgfCAnc2V0dGluZ3MucGx1Z2lucy5kZWFjdGl2YXRlZCdcclxuICAgfCAnc2V0dGluZ3MucGx1Z2lucy5hZGQubmFtZSdcclxuICAgfCAnc2V0dGluZ3MucGx1Z2lucy5hZGQuZGVzYydcclxuICAgfCAnc2V0dGluZ3MucGx1Z2lucy5hZGQucGxhY2Vob2xkZXInXHJcbiAgIHwgJ3NldHRpbmdzLnBsdWdpbnMuYWRkLnN1Y2Nlc3MnXHJcbiAgIHwgJ3NldHRpbmdzLnBsdWdpbnMuYWRkLmVycm9yJ1xyXG4gICB8ICdzZXR0aW5ncy5wbHVnaW5zLnJhdGluZy50b29sdGlwJ1xyXG4gICB8ICdzZXR0aW5ncy5wbHVnaW5zLnVyZ2VuY3kudG9vbHRpcCdcclxuICAgfCAnc2V0dGluZ3MucGx1Z2lucy5pbXBvcnRhbmNlLnRvb2x0aXAnXHJcblxyXG5leHBvcnQgY29uc3QgdHJhbnNsYXRpb25zOiB7IFtsYW5nOiBzdHJpbmddOiBSZWNvcmQ8VHJhbnNsYXRpb25LZXksIHN0cmluZz4gfSA9IHtcclxuICAgZW46IHtcclxuICAgICAgLy8gRGFzaGJvYXJkXHJcbiAgICAgICdkYXNoYm9hcmQudGl0bGUnOiAnUGx1Z2luRmxvd3onLFxyXG4gICAgICAnZGFzaGJvYXJkLmRlc2NyaXB0aW9uJzogJ1BsdWdpbkZsb3d6IGlzIGEgcGx1Z2luIGZvciBPYnNpZGlhbiB0aGF0IGFsbG93cyB5b3UgdG8gbWFuYWdlIHlvdXIgdmlkZW9zLicsXHJcbiAgICAgICdkYXNoYm9hcmQudmlld01vZGUnOiAnVmlldyBNb2RlJyxcclxuICAgICAgJ2Rhc2hib2FyZC52aWV3TW9kZURlc2MnOiAnQ2hvb3NlIGhvdyB2aWRlb3Mgd2lsbCBvcGVuIGJ5IGRlZmF1bHQnLFxyXG4gICAgICAnZGFzaGJvYXJkLnZpZXdNb2RlVGFiJzogJ1RhYicsXHJcbiAgICAgICdkYXNoYm9hcmQudmlld01vZGVTaWRlYmFyJzogJ1NpZGViYXInLFxyXG4gICAgICAnZGFzaGJvYXJkLnZpZXdNb2RlUG9wdXAnOiAnUG9wdXAnLFxyXG4gICAgICAvLyBOb3RpY2VzXHJcbiAgICAgICdub3RpY2VzLnNhdmVkJzogJ1x1MjcwNSBTZXR0aW5ncyBzYXZlZCcsXHJcbiAgICAgICdub3RpY2VzLmVycm9yJzogJ1x1Mjc0QyBFcnJvcjoge21lc3NhZ2V9JyxcclxuICAgICAgJ25vdGljZXMuc3VjY2Vzcyc6ICdcdTI3MDUgT3BlcmF0aW9uIHN1Y2Nlc3NmdWwnLFxyXG4gICAgICAnbm90aWNlcy5mZWF0dXJlRW5hYmxlZCc6ICdcdTI3MDUgRmVhdHVyZSBlbmFibGVkJyxcclxuICAgICAgJ25vdGljZXMuZmVhdHVyZURpc2FibGVkJzogJ1x1Mjc0QyBGZWF0dXJlIGRpc2FibGVkJyxcclxuICAgICAgLy8gQ29tbWFuZHNcclxuICAgICAgJ2NvbW1hbmRzLm9wZW5EYXNoYm9hcmQnOiAnT3BlbiBEYXNoYm9hcmQnLFxyXG4gICAgICAvLyBFcnJvcnNcclxuICAgICAgLy8gU2V0dGluZ3NcclxuICAgICAgJ3NldHRpbmdzLmRlZmF1bHRWaWV3TW9kZSc6ICdEZWZhdWx0IFZpZXcgTW9kZScsXHJcbiAgICAgICdzZXR0aW5ncy5kZWZhdWx0Vmlld01vZGVEZXNjJzogJ0Nob29zZSBob3cgdGhlIHBsdWdpbiBkYXNoYm9hcmQgd2lsbCBvcGVuIGJ5IGRlZmF1bHQnLFxyXG4gICAgICAnc2V0dGluZ3MudGFiJzogJ1RhYicsXHJcbiAgICAgICdzZXR0aW5ncy5zaWRlYmFyJzogJ1NpZGViYXInLFxyXG4gICAgICAnc2V0dGluZ3MucG9wdXAnOiAnUG9wdXAnLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2luRm9sZGVyLm5hbWUnOiAnUGx1Z2luIE5vdGVzIEZvbGRlcicsXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5Gb2xkZXIuZGVzYyc6ICdXaGVyZSB0byBzdG9yZSBwbHVnaW4gbm90ZXMnLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2luRm9sZGVyLnVwZGF0ZWQnOiAnUGx1Z2luIGZvbGRlciB1cGRhdGVkJyxcclxuICAgICAgJ3NldHRpbmdzLnRlbXBsYXRlLm5hbWUnOiAnTm90ZSBUZW1wbGF0ZScsXHJcbiAgICAgICdzZXR0aW5ncy50ZW1wbGF0ZS5kZXNjJzogJ1RlbXBsYXRlIGZvciBwbHVnaW4gbm90ZXMgKHVzZSB7e25hbWV9fSwge3tkZXNjcmlwdGlvbn19LCB7e3VybH19KScsXHJcbiAgICAgICdzZXR0aW5ncy5ncm91cEZvbGRlci5uYW1lJzogJ0dyb3VwIEZvbGRlcicsXHJcbiAgICAgICdzZXR0aW5ncy5ncm91cEZvbGRlci5kZXNjJzogJ1doZXJlIHRvIHN0b3JlIHBsdWdpbiBncm91cHMnLFxyXG4gICAgICAnc2V0dGluZ3MuZ3JvdXBGb2xkZXIudXBkYXRlZCc6ICdHcm91cCBmb2xkZXIgdXBkYXRlZCcsXHJcbiAgICAgIC8vIEltcG9ydC9FeHBvcnRcclxuICAgICAgJ3NldHRpbmdzLmltcG9ydEV4cG9ydC50aXRsZSc6ICdJbXBvcnQvRXhwb3J0JyxcclxuICAgICAgJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uSW1wb3J0Lm5hbWUnOiAnSW1wb3J0IENvbmZpZ3VyYXRpb24nLFxyXG4gICAgICAnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25JbXBvcnQuZGVzYyc6ICdJbXBvcnQgcGx1Z2luIGNvbmZpZ3VyYXRpb24gZnJvbSBKU09OIGZpbGUnLFxyXG4gICAgICAnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25JbXBvcnQuYnV0dG9uJzogJ0ltcG9ydCBKU09OJyxcclxuICAgICAgJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uSW1wb3J0LmxvYWRpbmcnOiAnSW1wb3J0aW5nIGNvbmZpZ3VyYXRpb24uLi4nLFxyXG4gICAgICAnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25JbXBvcnQuc3VjY2Vzcyc6ICdDb25maWd1cmF0aW9uIGltcG9ydGVkIHN1Y2Nlc3NmdWxseScsXHJcbiAgICAgICdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkltcG9ydC5lcnJvcic6ICdFcnJvciBpbXBvcnRpbmcgY29uZmlndXJhdGlvbicsXHJcbiAgICAgICdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkV4cG9ydC5uYW1lJzogJ0V4cG9ydCBDb25maWd1cmF0aW9uJyxcclxuICAgICAgJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uRXhwb3J0LmRlc2MnOiAnRXhwb3J0IHBsdWdpbiBjb25maWd1cmF0aW9uIHRvIEpTT04gZmlsZScsXHJcbiAgICAgICdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkV4cG9ydC5idXR0b24nOiAnRXhwb3J0IEpTT04nLFxyXG4gICAgICAnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25FeHBvcnQubG9hZGluZyc6ICdFeHBvcnRpbmcgY29uZmlndXJhdGlvbi4uLicsXHJcbiAgICAgICdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkV4cG9ydC5zdWNjZXNzJzogJ0NvbmZpZ3VyYXRpb24gZXhwb3J0ZWQgc3VjY2Vzc2Z1bGx5JyxcclxuICAgICAgJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uRXhwb3J0LmVycm9yJzogJ0Vycm9yIGV4cG9ydGluZyBjb25maWd1cmF0aW9uJyxcclxuICAgICAgLy8gR3JvdXBzIE1hbmFnZW1lbnRcclxuICAgICAgJ3NldHRpbmdzLmdyb3Vwcy50aXRsZSc6ICdHcm91cHMgTWFuYWdlbWVudCcsXHJcbiAgICAgICdzZXR0aW5ncy5ncm91cHMuZGVsZXRlLmJ1dHRvbic6ICdEZWxldGUnLFxyXG4gICAgICAnc2V0dGluZ3MuZ3JvdXBzLmRlbGV0ZS5zdWNjZXNzJzogJ0dyb3VwIGRlbGV0ZWQnLFxyXG4gICAgICAnc2V0dGluZ3MuZ3JvdXBzLmRlbGV0ZS5lcnJvcic6ICdFcnJvciBkZWxldGluZyBncm91cCcsXHJcbiAgICAgICdzZXR0aW5ncy5ncm91cHMuYWRkLm5hbWUnOiAnQWRkIE5ldyBHcm91cCcsXHJcbiAgICAgICdzZXR0aW5ncy5ncm91cHMuYWRkLmRlc2MnOiAnQ3JlYXRlIGEgbmV3IGdyb3VwIGZvciBvcmdhbml6aW5nIHBsdWdpbnMnLFxyXG4gICAgICAnc2V0dGluZ3MuZ3JvdXBzLmFkZC5wbGFjZWhvbGRlcic6ICdHcm91cCBuYW1lJyxcclxuICAgICAgJ3NldHRpbmdzLmdyb3Vwcy5hZGQuc3VjY2Vzcyc6ICdHcm91cCBjcmVhdGVkJyxcclxuICAgICAgJ3NldHRpbmdzLmdyb3Vwcy5hZGQuZXJyb3InOiAnRXJyb3IgY3JlYXRpbmcgZ3JvdXAnLFxyXG4gICAgICAvLyBQbHVnaW5zIE1hbmFnZW1lbnRcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMudGl0bGUnOiAnUGx1Z2lucyBNYW5hZ2VtZW50JyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuc2VhcmNoLnBsYWNlaG9sZGVyJzogJ1NlYXJjaCBwbHVnaW5zLi4uJyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMub3B0aW9ucy5zdGF0dXMnOiAnU3RhdHVzJyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuc3RhdHVzLmV4cGxvcmluZyc6ICdFeHBsb3JpbmcnLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5zdGF0dXMuYWN0aXZlJzogJ0FjdGl2ZScsXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLnN0YXR1cy5pbmFjdGl2ZSc6ICdJbmFjdGl2ZScsXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLm9wdGlvbnMuZ3JvdXBzJzogJ0dyb3VwcycsXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLmdyb3Vwcy5ub25lJzogJ05vIGdyb3VwJyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuZ3JvdXBzLnVwZGF0ZWQnOiAnUGx1Z2luIHt0aXRsZX0gZ3JvdXBzIHVwZGF0ZWQgZnJvbSB7ZnJvbX0gdG8ge3RvfScsXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLmdyb3Vwcy5lcnJvcic6ICdFcnJvciB1cGRhdGluZyBncm91cHMnLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5vcHRpb25zLnJhdGluZyc6ICdSYXRpbmcnLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5vcHRpb25zLnVyZ2VuY3knOiAnVXJnZW5jeScsXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLm9wdGlvbnMuaW1wb3J0YW5jZSc6ICdJbXBvcnRhbmNlJyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuZGVsZXRlLmJ1dHRvbic6ICdEZWxldGUgUGx1Z2luJyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuZGVsZXRlLmNvbmZpcm0nOiAnRGVsZXRlIFBsdWdpbicsXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLmRlbGV0ZS5jb25maXJtTWVzc2FnZSc6ICdBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlIHt0aXRsZX0/JyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuZGVsZXRlLmNhbmNlbCc6ICdDYW5jZWwnLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5kZWxldGVkJzogJ1BsdWdpbiB7dGl0bGV9IGRlbGV0ZWQnLFxyXG4gICAgICAvLyBQbHVnaW4gQWN0aW9ucyAmIFRvb2x0aXBzXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLmFjdGl2YXRlLnRvb2x0aXAnOiAnQWN0aXZhdGUgcGx1Z2luJyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuZGVhY3RpdmF0ZS50b29sdGlwJzogJ0RlYWN0aXZhdGUgcGx1Z2luJyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMudG9nZ2xlLnRvb2x0aXAnOiAnU2hvdy9IaWRlIG9wdGlvbnMnLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5hY3RpdmF0ZWQnOiAnUGx1Z2luIHt0aXRsZX0gYWN0aXZhdGVkJyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuZGVhY3RpdmF0ZWQnOiAnUGx1Z2luIHt0aXRsZX0gZGVhY3RpdmF0ZWQnLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5hZGQubmFtZSc6ICdBZGQgUGx1Z2luJyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuYWRkLmRlc2MnOiAnQWRkIGEgbmV3IHBsdWdpbiB0byBtYW5hZ2UnLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5hZGQucGxhY2Vob2xkZXInOiAnUGx1Z2luIG5hbWUnLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5hZGQuc3VjY2Vzcyc6ICdQbHVnaW4gYWRkZWQgc3VjY2Vzc2Z1bGx5JyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuYWRkLmVycm9yJzogJ0Vycm9yIGFkZGluZyBwbHVnaW4nLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5yYXRpbmcudG9vbHRpcCc6ICdSYXRlIGZyb20gMSB0byA1JyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMudXJnZW5jeS50b29sdGlwJzogJ1NldCB1cmdlbmN5ICgxOiBMb3csIDI6IE1lZGl1bSwgMzogSGlnaCknLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5pbXBvcnRhbmNlLnRvb2x0aXAnOiAnU2V0IGltcG9ydGFuY2UgKDE6IExvdywgMjogTWVkaXVtLCAzOiBIaWdoKScsXHJcbiAgIH0sXHJcbiAgIGZyOiB7XHJcbiAgICAgIC8vIERhc2hib2FyZFxyXG4gICAgICAnZGFzaGJvYXJkLnRpdGxlJzogJ1BsdWdpbkZsb3d6JyxcclxuICAgICAgJ2Rhc2hib2FyZC5kZXNjcmlwdGlvbic6ICdQbHVnaW5GbG93eiBlc3QgdW4gcGx1Z2luIHBvdXIgT2JzaWRpYW4gcXVpIHZvdXMgcGVybWV0IGRlIGdcdTAwRTlyZXIgdm9zIHZpZFx1MDBFOW9zLicsXHJcbiAgICAgICdkYXNoYm9hcmQudmlld01vZGUnOiAnTW9kZSBkXFwnYWZmaWNoYWdlJyxcclxuICAgICAgJ2Rhc2hib2FyZC52aWV3TW9kZURlc2MnOiAnQ2hvaXNpc3NleiBjb21tZW50IGxlcyB2aWRcdTAwRTlvcyBzXFwnb3V2cmlyb250IHBhciBkXHUwMEU5ZmF1dCcsXHJcbiAgICAgICdkYXNoYm9hcmQudmlld01vZGVUYWInOiAnT25nbGV0JyxcclxuICAgICAgJ2Rhc2hib2FyZC52aWV3TW9kZVNpZGViYXInOiAnQmFycmUgbGF0XHUwMEU5cmFsZScsXHJcbiAgICAgICdkYXNoYm9hcmQudmlld01vZGVQb3B1cCc6ICdGZW5cdTAwRUF0cmUgY29udGV4dHVlbGxlJyxcclxuICAgICAgLy8gTm90aWNlc1xyXG4gICAgICAnbm90aWNlcy5zYXZlZCc6ICdcdTI3MDUgUGFyYW1cdTAwRTh0cmVzIHNhdXZlZ2FyZFx1MDBFOXMnLFxyXG4gICAgICAnbm90aWNlcy5lcnJvcic6ICdcdTI3NEMgRXJyZXVyOiB7bWVzc2FnZX0nLFxyXG4gICAgICAnbm90aWNlcy5zdWNjZXNzJzogJ1x1MjcwNSBPcFx1MDBFOXJhdGlvbiByXHUwMEU5dXNzaWUnLFxyXG4gICAgICAnbm90aWNlcy5mZWF0dXJlRW5hYmxlZCc6ICdcdTI3MDUgRm9uY3Rpb25uYWxpdFx1MDBFOSBhY3Rpdlx1MDBFOWUnLFxyXG4gICAgICAnbm90aWNlcy5mZWF0dXJlRGlzYWJsZWQnOiAnXHUyNzRDIEZvbmN0aW9ubmFsaXRcdTAwRTkgZFx1MDBFOXNhY3Rpdlx1MDBFOWUnLFxyXG4gICAgICAvLyBDb21tYW5kc1xyXG4gICAgICAnY29tbWFuZHMub3BlbkRhc2hib2FyZCc6ICdPdXZyaXIgbGUgdGFibGVhdSBkZSBib3JkJyxcclxuICAgICAgLy8gRXJyb3JzXHJcbiAgICAgIC8vIFNldHRpbmdzXHJcbiAgICAgICdzZXR0aW5ncy5kZWZhdWx0Vmlld01vZGUnOiAnTW9kZSBkXFwnYWZmaWNoYWdlIHBhciBkXHUwMEU5ZmF1dCcsXHJcbiAgICAgICdzZXR0aW5ncy5kZWZhdWx0Vmlld01vZGVEZXNjJzogJ0Nob2lzaXNzZXogY29tbWVudCBsZSB0YWJsZWF1IGRlIGJvcmQgc1xcJ291dnJpcmEgcGFyIGRcdTAwRTlmYXV0JyxcclxuICAgICAgJ3NldHRpbmdzLnRhYic6ICdPbmdsZXQnLFxyXG4gICAgICAnc2V0dGluZ3Muc2lkZWJhcic6ICdCYXJyZSBsYXRcdTAwRTlyYWxlJyxcclxuICAgICAgJ3NldHRpbmdzLnBvcHVwJzogJ0Zlblx1MDBFQXRyZSBtb2RhbGUnLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2luRm9sZGVyLm5hbWUnOiAnRG9zc2llciBkZXMgbm90ZXMgZGUgcGx1Z2lucycsXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5Gb2xkZXIuZGVzYyc6ICdPXHUwMEY5IHN0b2NrZXIgbGVzIG5vdGVzIGRlcyBwbHVnaW5zJyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbkZvbGRlci51cGRhdGVkJzogJ0Rvc3NpZXIgZGVzIHBsdWdpbnMgbWlzIFx1MDBFMCBqb3VyJyxcclxuICAgICAgJ3NldHRpbmdzLnRlbXBsYXRlLm5hbWUnOiAnVGVtcGxhdGUgZGVzIG5vdGVzJyxcclxuICAgICAgJ3NldHRpbmdzLnRlbXBsYXRlLmRlc2MnOiAnVGVtcGxhdGUgcG91ciBsZXMgbm90ZXMgZGUgcGx1Z2lucyAodXRpbGlzZSB7e25hbWV9fSwge3tkZXNjcmlwdGlvbn19LCB7e3VybH19KScsXHJcbiAgICAgICdzZXR0aW5ncy5ncm91cEZvbGRlci5uYW1lJzogJ0Rvc3NpZXIgZGVzIGdyb3VwZXMnLFxyXG4gICAgICAnc2V0dGluZ3MuZ3JvdXBGb2xkZXIuZGVzYyc6ICdPXHUwMEY5IHN0b2NrZXIgbGVzIGdyb3VwZXMgZGUgcGx1Z2lucycsXHJcbiAgICAgICdzZXR0aW5ncy5ncm91cEZvbGRlci51cGRhdGVkJzogJ0Rvc3NpZXIgZGVzIGdyb3VwZXMgbWlzIFx1MDBFMCBqb3VyJyxcclxuICAgICAgLy8gSW1wb3J0L0V4cG9ydFxyXG4gICAgICAnc2V0dGluZ3MuaW1wb3J0RXhwb3J0LnRpdGxlJzogJ0ltcG9ydC9FeHBvcnQnLFxyXG4gICAgICAnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25JbXBvcnQubmFtZSc6ICdJbXBvcnRlciBsYSBjb25maWd1cmF0aW9uJyxcclxuICAgICAgJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uSW1wb3J0LmRlc2MnOiAnSW1wb3J0ZXIgbGEgY29uZmlndXJhdGlvbiBkZXB1aXMgdW4gZmljaGllciBKU09OJyxcclxuICAgICAgJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uSW1wb3J0LmJ1dHRvbic6ICdJbXBvcnRlciBKU09OJyxcclxuICAgICAgJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uSW1wb3J0LmxvYWRpbmcnOiAnSW1wb3J0YXRpb24gZW4gY291cnMuLi4nLFxyXG4gICAgICAnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25JbXBvcnQuc3VjY2Vzcyc6ICdDb25maWd1cmF0aW9uIGltcG9ydFx1MDBFOWUgYXZlYyBzdWNjXHUwMEU4cycsXHJcbiAgICAgICdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkltcG9ydC5lcnJvcic6ICdFcnJldXIgbG9ycyBkZSBsXFwnaW1wb3J0YXRpb24nLFxyXG4gICAgICAnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25FeHBvcnQubmFtZSc6ICdFeHBvcnRlciBsYSBjb25maWd1cmF0aW9uJyxcclxuICAgICAgJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uRXhwb3J0LmRlc2MnOiAnRXhwb3J0ZXIgbGEgY29uZmlndXJhdGlvbiB2ZXJzIHVuIGZpY2hpZXIgSlNPTicsXHJcbiAgICAgICdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkV4cG9ydC5idXR0b24nOiAnRXhwb3J0ZXIgSlNPTicsXHJcbiAgICAgICdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkV4cG9ydC5sb2FkaW5nJzogJ0V4cG9ydGF0aW9uIGVuIGNvdXJzLi4uJyxcclxuICAgICAgJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uRXhwb3J0LnN1Y2Nlc3MnOiAnQ29uZmlndXJhdGlvbiBleHBvcnRcdTAwRTllIGF2ZWMgc3VjY1x1MDBFOHMnLFxyXG4gICAgICAnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25FeHBvcnQuZXJyb3InOiAnRXJyZXVyIGxvcnMgZGUgbFxcJ2V4cG9ydGF0aW9uJyxcclxuICAgICAgLy8gR3JvdXBzIE1hbmFnZW1lbnRcclxuICAgICAgJ3NldHRpbmdzLmdyb3Vwcy50aXRsZSc6ICdHZXN0aW9uIGRlcyBncm91cGVzJyxcclxuICAgICAgJ3NldHRpbmdzLmdyb3Vwcy5kZWxldGUuYnV0dG9uJzogJ1N1cHByaW1lcicsXHJcbiAgICAgICdzZXR0aW5ncy5ncm91cHMuZGVsZXRlLnN1Y2Nlc3MnOiAnR3JvdXBlIHN1cHByaW1cdTAwRTknLFxyXG4gICAgICAnc2V0dGluZ3MuZ3JvdXBzLmRlbGV0ZS5lcnJvcic6ICdFcnJldXIgbG9ycyBkZSBsYSBzdXBwcmVzc2lvbicsXHJcbiAgICAgICdzZXR0aW5ncy5ncm91cHMuYWRkLm5hbWUnOiAnQWpvdXRlciB1biBncm91cGUnLFxyXG4gICAgICAnc2V0dGluZ3MuZ3JvdXBzLmFkZC5kZXNjJzogJ0NyXHUwMEU5ZXIgdW4gbm91dmVhdSBncm91cGUgcG91ciBvcmdhbmlzZXIgbGVzIHBsdWdpbnMnLFxyXG4gICAgICAnc2V0dGluZ3MuZ3JvdXBzLmFkZC5wbGFjZWhvbGRlcic6ICdOb20gZHUgZ3JvdXBlJyxcclxuICAgICAgJ3NldHRpbmdzLmdyb3Vwcy5hZGQuc3VjY2Vzcyc6ICdHcm91cGUgY3JcdTAwRTlcdTAwRTknLFxyXG4gICAgICAnc2V0dGluZ3MuZ3JvdXBzLmFkZC5lcnJvcic6ICdFcnJldXIgbG9ycyBkZSBsYSBjclx1MDBFOWF0aW9uJyxcclxuICAgICAgLy8gUGx1Z2lucyBNYW5hZ2VtZW50XHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLnRpdGxlJzogJ0dlc3Rpb24gZGVzIHBsdWdpbnMnLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5zZWFyY2gucGxhY2Vob2xkZXInOiAnUmVjaGVyY2hlciBkZXMgcGx1Z2lucy4uLicsXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLm9wdGlvbnMuc3RhdHVzJzogJ1N0YXR1dCcsXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLnN0YXR1cy5leHBsb3JpbmcnOiAnRW4gZXhwbG9yYXRpb24nLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5zdGF0dXMuYWN0aXZlJzogJ0FjdGlmJyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuc3RhdHVzLmluYWN0aXZlJzogJ0luYWN0aWYnLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5vcHRpb25zLmdyb3Vwcyc6ICdHcm91cGVzJyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuZ3JvdXBzLm5vbmUnOiAnU2FucyBncm91cGUnLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5ncm91cHMudXBkYXRlZCc6ICdHcm91cGVzIGR1IHBsdWdpbiB7dGl0bGV9IG1pcyBcdTAwRTAgam91ciBkZSB7ZnJvbX0gdmVycyB7dG99JyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuZ3JvdXBzLmVycm9yJzogJ0VycmV1ciBsb3JzIGRlIGxhIG1pc2UgXHUwMEUwIGpvdXIgZGVzIGdyb3VwZXMnLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5vcHRpb25zLnJhdGluZyc6ICdOb3RlJyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMub3B0aW9ucy51cmdlbmN5JzogJ1VyZ2VuY2UnLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5vcHRpb25zLmltcG9ydGFuY2UnOiAnSW1wb3J0YW5jZScsXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLmRlbGV0ZS5idXR0b24nOiAnU3VwcHJpbWVyIGxlIHBsdWdpbicsXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLmRlbGV0ZS5jb25maXJtJzogJ1N1cHByaW1lciBsZSBwbHVnaW4nLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5kZWxldGUuY29uZmlybU1lc3NhZ2UnOiAnXHUwMENBdGVzLXZvdXMgc1x1MDBGQnIgZGUgdm91bG9pciBzdXBwcmltZXIge3RpdGxlfSA/JyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuZGVsZXRlLmNhbmNlbCc6ICdBbm51bGVyJyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuZGVsZXRlZCc6ICdQbHVnaW4ge3RpdGxlfSBzdXBwcmltXHUwMEU5JyxcclxuICAgICAgLy8gUGx1Z2luIEFjdGlvbnMgJiBUb29sdGlwc1xyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5hY3RpdmF0ZS50b29sdGlwJzogJ0FjdGl2ZXIgbGUgcGx1Z2luJyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuZGVhY3RpdmF0ZS50b29sdGlwJzogJ0RcdTAwRTlzYWN0aXZlciBsZSBwbHVnaW4nLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy50b2dnbGUudG9vbHRpcCc6ICdBZmZpY2hlci9NYXNxdWVyIGxlcyBvcHRpb25zJyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuYWN0aXZhdGVkJzogJ1BsdWdpbiB7dGl0bGV9IGFjdGl2XHUwMEU5JyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuZGVhY3RpdmF0ZWQnOiAnUGx1Z2luIHt0aXRsZX0gZFx1MDBFOXNhY3Rpdlx1MDBFOScsXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLmFkZC5uYW1lJzogJ0Fqb3V0ZXIgdW4gcGx1Z2luJyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuYWRkLmRlc2MnOiAnQWpvdXRlciB1biBub3V2ZWF1IHBsdWdpbiBcdTAwRTAgZ1x1MDBFOXJlcicsXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLmFkZC5wbGFjZWhvbGRlcic6ICdOb20gZHUgcGx1Z2luJyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuYWRkLnN1Y2Nlc3MnOiAnUGx1Z2luIGFqb3V0XHUwMEU5IGF2ZWMgc3VjY1x1MDBFOHMnLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5hZGQuZXJyb3InOiAnRXJyZXVyIGxvcnMgZGUgbFxcJ2Fqb3V0IGR1IHBsdWdpbicsXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLnJhdGluZy50b29sdGlwJzogJ05vdGVyIGRlIDEgXHUwMEUwIDUnLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy51cmdlbmN5LnRvb2x0aXAnOiAnRFx1MDBFOWZpbmlyIGxcXCd1cmdlbmNlICgxOiBGYWlibGUsIDI6IE1veWVubmUsIDM6IEhhdXRlKScsXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLmltcG9ydGFuY2UudG9vbHRpcCc6ICdEXHUwMEU5ZmluaXIgbFxcJ2ltcG9ydGFuY2UgKDE6IEZhaWJsZSwgMjogTW95ZW5uZSwgMzogSGF1dGUpJyxcclxuICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNsYXNzIFRyYW5zbGF0aW9ucyB7XHJcbiAgIHByaXZhdGUgY3VycmVudExhbmc6IHN0cmluZztcclxuXHJcbiAgIGNvbnN0cnVjdG9yKGluaXRpYWxMYW5nOiBzdHJpbmcgPSAnZnInKSB7XHJcbiAgICAgIHRoaXMuY3VycmVudExhbmcgPSBpbml0aWFsTGFuZztcclxuICAgfVxyXG5cclxuICAgc2V0TGFuZ3VhZ2UobGFuZzogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuY3VycmVudExhbmcgPSBsYW5nO1xyXG4gICB9XHJcblxyXG4gICB0KGtleTogVHJhbnNsYXRpb25LZXkpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gdHJhbnNsYXRpb25zW3RoaXMuY3VycmVudExhbmddPy5ba2V5XSB8fCB0cmFuc2xhdGlvbnNbJ2VuJ11ba2V5XSB8fCBrZXk7XHJcbiAgIH1cclxufVxyXG4iLCAiaW1wb3J0IHsgUGx1Z2luLCBOb3RpY2UgfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgeyBTZXR0aW5ncyB9IGZyb20gJy4vU2V0dGluZ3MnO1xuaW1wb3J0IHsgVHJhbnNsYXRpb25zIH0gZnJvbSAnLi9UcmFuc2xhdGlvbnMnO1xuaW1wb3J0IHsgVmlld01vZGUgfSBmcm9tICcuL1ZpZXdNb2RlJztcblxuZXhwb3J0IGNsYXNzIEhvdGtleXMge1xuICAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIHBsdWdpbjogUGx1Z2luLFxuICAgICAgcHJpdmF0ZSBzZXR0aW5nczogU2V0dGluZ3MsXG4gICAgICBwcml2YXRlIHRyYW5zbGF0aW9uczogVHJhbnNsYXRpb25zLFxuICAgICAgcHJpdmF0ZSB2aWV3TW9kZTogVmlld01vZGVcbiAgICkge31cblxuICAgcmVnaXN0ZXJIb3RrZXlzKCkge1xuICAgICAgLy8gT3V2cmlyIGxlIGRhc2hib2FyZFxuICAgICAgdGhpcy5wbHVnaW4uYWRkQ29tbWFuZCh7XG4gICAgICAgICBpZDogJ29wZW4tcGx1Z2lucy1kYXNoYm9hcmQnLFxuICAgICAgICAgbmFtZTogdGhpcy50cmFuc2xhdGlvbnMudCgnY29tbWFuZHMub3BlbkRhc2hib2FyZCcpLFxuICAgICAgICAgaWNvbjogJ2xheW91dC1ncmlkJyxcbiAgICAgICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgY29uc3QgbW9kZSA9IGF3YWl0IFNldHRpbmdzLmdldFZpZXdNb2RlKCk7XG4gICAgICAgICAgICAgICBhd2FpdCB0aGlzLnZpZXdNb2RlLnNldFZpZXcobW9kZSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignW0hvdGtleXNdJywgZXJyb3IpO1xuICAgICAgICAgICAgICAgbmV3IE5vdGljZSh0aGlzLnRyYW5zbGF0aW9ucy50KCdlcnJvcnMub3BlbkRhc2hib2FyZCcpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH0sXG4gICAgICAgICBob3RrZXlzOiBbeyBtb2RpZmllcnM6IFsnQWx0J10sIGtleTogJ1AnIH1dXG4gICAgICB9KTtcbiAgIH1cbn1cbiIsICJpbXBvcnQgeyBJdGVtVmlldywgV29ya3NwYWNlTGVhZiB9IGZyb20gJ29ic2lkaWFuJztcclxuaW1wb3J0IHsgVFZpZXdNb2RlIH0gZnJvbSAnLi90eXBlcyc7XHJcbmltcG9ydCB7IFNldHRpbmdzIH0gZnJvbSAnLi9TZXR0aW5ncyc7XHJcbmltcG9ydCB7IFRyYW5zbGF0aW9ucyB9IGZyb20gJy4vVHJhbnNsYXRpb25zJztcclxuXHJcbmV4cG9ydCBjbGFzcyBEYXNoYm9hcmQgZXh0ZW5kcyBJdGVtVmlldyB7XHJcbiAgICBwcml2YXRlIHRyYW5zbGF0aW9uczogVHJhbnNsYXRpb25zO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIGxlYWY6IFdvcmtzcGFjZUxlYWYsXHJcbiAgICAgICAgcHJpdmF0ZSBzZXR0aW5nczogU2V0dGluZ3MsXHJcbiAgICAgICAgdHJhbnNsYXRpb25zOiBUcmFuc2xhdGlvbnNcclxuICAgICkge1xyXG4gICAgICAgIHN1cGVyKGxlYWYpO1xyXG4gICAgICAgIHRoaXMudHJhbnNsYXRpb25zID0gdHJhbnNsYXRpb25zO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFZpZXdUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuICdwbHVnaW5mbG93ei12aWV3JztcclxuICAgIH1cclxuXHJcbiAgICBnZXREaXNwbGF5VGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRyYW5zbGF0aW9ucy50KCdkYXNoYm9hcmQudGl0bGUnKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvbk9wZW4oKSB7XHJcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5jb250YWluZXJFbC5jaGlsZHJlblsxXSBhcyBIVE1MRWxlbWVudDtcclxuICAgICAgICBjb250YWluZXIuZW1wdHkoKTtcclxuICAgICAgICBcclxuICAgICAgICBhd2FpdCB0aGlzLnJlbmRlckRhc2hib2FyZChjb250YWluZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYXN5bmMgcmVuZGVyRGFzaGJvYXJkKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICBjb25zdCBkYXNoYm9hcmRDb250YWluZXIgPSBjb250YWluZXIuY3JlYXRlRGl2KCdkYXNoYm9hcmQtY29udGFpbmVyJyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gRW4tdFx1MDBFQXRlIGF2ZWMgbGUgdGl0cmVcclxuICAgICAgICBkYXNoYm9hcmRDb250YWluZXIuY3JlYXRlRWwoJ2gyJywgeyBcclxuICAgICAgICAgICAgdGV4dDogdGhpcy50cmFuc2xhdGlvbnMudCgnZGFzaGJvYXJkLmluc3RhbGxlZFBsdWdpbnMnKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIExpc3RlIGRlcyBwbHVnaW5zXHJcbiAgICAgICAgY29uc3QgcGx1Z2luc0xpc3QgPSBkYXNoYm9hcmRDb250YWluZXIuY3JlYXRlRGl2KCdwbHVnaW5zLWxpc3QnKTtcclxuICAgICAgICBhd2FpdCB0aGlzLnJlbmRlclBsdWdpbnNMaXN0KHBsdWdpbnNMaXN0KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFzeW5jIHJlbmRlclBsdWdpbnNMaXN0KGNvbnRhaW5lcjogSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICBjb25zdCBpbnN0YWxsZWRQbHVnaW5zID0gQXJyYXkuZnJvbSh0aGlzLmFwcC5wbHVnaW5zLmVuYWJsZWRQbHVnaW5zKTtcclxuICAgICAgICBcclxuICAgICAgICBpbnN0YWxsZWRQbHVnaW5zLmZvckVhY2gocGx1Z2luSWQgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBwbHVnaW4gPSB0aGlzLmFwcC5wbHVnaW5zLnBsdWdpbnNbcGx1Z2luSWRdO1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVBsdWdpbkl0ZW0oY29udGFpbmVyLCBwbHVnaW4pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlUGx1Z2luSXRlbShjb250YWluZXI6IEhUTUxFbGVtZW50LCBwbHVnaW46IGFueSkge1xyXG4gICAgICAgIGNvbnN0IHBsdWdpbkl0ZW0gPSBjb250YWluZXIuY3JlYXRlRGl2KCdwbHVnaW4taXRlbScpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHBsdWdpbkl0ZW0uY3JlYXRlRWwoJ2gzJywgeyB0ZXh0OiBwbHVnaW4ubWFuaWZlc3QubmFtZSB9KTtcclxuICAgICAgICBwbHVnaW5JdGVtLmNyZWF0ZUVsKCdwJywgeyB0ZXh0OiBwbHVnaW4ubWFuaWZlc3QuZGVzY3JpcHRpb24gfSk7XHJcbiAgICAgICAgcGx1Z2luSXRlbS5jcmVhdGVFbCgnc21hbGwnLCB7IFxyXG4gICAgICAgICAgICB0ZXh0OiB0aGlzLnRyYW5zbGF0aW9ucy50KCdkYXNoYm9hcmQudmVyc2lvbicsIHtcclxuICAgICAgICAgICAgICAgIHZlcnNpb246IHBsdWdpbi5tYW5pZmVzdC52ZXJzaW9uXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25DbG9zZSgpIHtcclxuICAgICAgICAvLyBOZXR0b3lhZ2Ugc2kgblx1MDBFOWNlc3NhaXJlXHJcbiAgICB9XHJcbn1cclxuIiwgImltcG9ydCB7IFBsdWdpbiwgV29ya3NwYWNlTGVhZiwgTW9kYWwgfSBmcm9tICdvYnNpZGlhbic7XHJcbmltcG9ydCB7IFRWaWV3TW9kZSB9IGZyb20gJy4vdHlwZXMnO1xyXG5pbXBvcnQgeyBTZXR0aW5ncyB9IGZyb20gJy4vU2V0dGluZ3MnO1xyXG5pbXBvcnQgeyBEYXNoYm9hcmQgfSBmcm9tICcuL0Rhc2hib2FyZCc7XHJcbmltcG9ydCB7IFRyYW5zbGF0aW9ucyB9IGZyb20gJy4vVHJhbnNsYXRpb25zJztcclxuXHJcbmV4cG9ydCBjbGFzcyBWaWV3TW9kZSB7XHJcbiAgIHByaXZhdGUgY3VycmVudFZpZXc6IERhc2hib2FyZCB8IG51bGwgPSBudWxsO1xyXG4gICBwcml2YXRlIGN1cnJlbnRNb2RlOiBUVmlld01vZGUgfCBudWxsID0gbnVsbDtcclxuICAgcHJpdmF0ZSBhY3RpdmVMZWFmOiBXb3Jrc3BhY2VMZWFmIHwgbnVsbCA9IG51bGw7XHJcbiAgIHByaXZhdGUgbGVhZklkOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcclxuICAgcHJpdmF0ZSB0cmFuc2xhdGlvbnM6IFRyYW5zbGF0aW9ucztcclxuXHJcbiAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcGx1Z2luOiBQbHVnaW4pIHtcclxuICAgICAgdGhpcy50cmFuc2xhdGlvbnMgPSBuZXcgVHJhbnNsYXRpb25zKCk7XHJcbiAgICAgIC8vIEluaXRpYWxpc2VyIGxlIG1vZGUgZGVwdWlzIGxlcyBzZXR0aW5nc1xyXG4gICAgICBTZXR0aW5ncy5sb2FkU2V0dGluZ3MoKS50aGVuKHNldHRpbmdzID0+IHtcclxuICAgICAgICAgdGhpcy5jdXJyZW50TW9kZSA9IHNldHRpbmdzLmN1cnJlbnRNb2RlO1xyXG4gICAgICB9KTtcclxuICAgICAgLy8gTmV0dG95ZXIgbGVzIGFuY2llbm5lcyBsZWFmcyBhdSBkXHUwMEU5bWFycmFnZVxyXG4gICAgICB0aGlzLmNsb3NlQ3VycmVudFZpZXcoKTtcclxuICAgfVxyXG5cclxuICAgcHJpdmF0ZSBhc3luYyBjbG9zZUN1cnJlbnRWaWV3KCkge1xyXG4gICAgICBpZiAodGhpcy5jdXJyZW50Vmlldykge1xyXG4gICAgICAgICBjb25zdCBsZWF2ZXMgPSB0aGlzLnBsdWdpbi5hcHAud29ya3NwYWNlLmdldExlYXZlc09mVHlwZSgncGx1Z2luZmxvd3otdmlldycpO1xyXG4gICAgICAgICBsZWF2ZXMuZm9yRWFjaChsZWFmID0+IHtcclxuICAgICAgICAgICAgaWYgKGxlYWYudmlldyBpbnN0YW5jZW9mIERhc2hib2FyZCkge1xyXG4gICAgICAgICAgICAgICBsZWFmLmRldGFjaCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgIH0pO1xyXG4gICAgICAgICB0aGlzLmN1cnJlbnRWaWV3ID0gbnVsbDtcclxuICAgICAgICAgdGhpcy5hY3RpdmVMZWFmID0gbnVsbDtcclxuICAgICAgICAgdGhpcy5sZWFmSWQgPSBudWxsO1xyXG4gICAgICB9XHJcbiAgIH1cclxuXHJcbiAgIHByaXZhdGUgZ2V0TGVhZkZvck1vZGUobW9kZTogVFZpZXdNb2RlKTogV29ya3NwYWNlTGVhZiB8IG51bGwge1xyXG4gICAgICBjb25zdCB3b3Jrc3BhY2UgPSB0aGlzLnBsdWdpbi5hcHAud29ya3NwYWNlO1xyXG4gICAgICBcclxuICAgICAgLy8gRmVybWVyIHRvdXRlcyBsZXMgdnVlcyBEYXNoYm9hcmQgZXhpc3RhbnRlc1xyXG4gICAgICBjb25zdCBleGlzdGluZ0xlYXZlcyA9IHdvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoJ3BsdWdpbmZsb3d6LXZpZXcnKTtcclxuICAgICAgZXhpc3RpbmdMZWF2ZXMuZm9yRWFjaChsZWFmID0+IHtcclxuICAgICAgICAgaWYgKGxlYWYudmlldyBpbnN0YW5jZW9mIERhc2hib2FyZCkge1xyXG4gICAgICAgICAgICBsZWFmLmRldGFjaCgpO1xyXG4gICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBcclxuICAgICAgbGV0IGxlYWY6IFdvcmtzcGFjZUxlYWYgfCBudWxsID0gbnVsbDtcclxuICAgICAgc3dpdGNoIChtb2RlKSB7XHJcbiAgICAgICAgIGNhc2UgJ3NpZGViYXInOlxyXG4gICAgICAgICAgICBsZWFmID0gd29ya3NwYWNlLmdldFJpZ2h0TGVhZihmYWxzZSkgPz8gd29ya3NwYWNlLmdldExlYWYoJ3NwbGl0Jyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICBjYXNlICdwb3B1cCc6XHJcbiAgICAgICAgICAgIGNvbnN0IG1vZGFsID0gbmV3IE1vZGFsKHRoaXMucGx1Z2luLmFwcCk7XHJcbiAgICAgICAgICAgIG1vZGFsLmNvbnRhaW5lckVsLmFkZENsYXNzKCdwbHVnaW5mbG93ei1tb2RhbCcpO1xyXG4gICAgICAgICAgICBtb2RhbC50aXRsZUVsLnNldFRleHQodGhpcy50cmFuc2xhdGlvbnMudCgnZGFzaGJvYXJkLnRpdGxlJykpO1xyXG4gICAgICAgICAgICBjb25zdCBjb250YWluZXIgPSBtb2RhbC5jb250ZW50RWwuY3JlYXRlRGl2KCdwbHVnaW5mbG93ei1kYXNoYm9hcmQtY29udGFpbmVyJyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBDclx1MDBFOWVyIHVuIGxlYWYgdGVtcG9yYWlyZSBlbiB1dGlsaXNhbnQgbGVzIG1cdTAwRTl0aG9kZXMgZCdPYnNpZGlhblxyXG4gICAgICAgICAgICBjb25zdCB0ZW1wTGVhZiA9IHRoaXMucGx1Z2luLmFwcC53b3Jrc3BhY2UuZ2V0TGVhZihmYWxzZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHZpZXcgPSBuZXcgRGFzaGJvYXJkKHRlbXBMZWFmLCBTZXR0aW5ncywgdGhpcy50cmFuc2xhdGlvbnMpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gQ2FjaGVyIGxlIGxlYWYgbWFpcyBnYXJkZXIgbGEgdnVlIGFjdGl2ZVxyXG4gICAgICAgICAgICB0ZW1wTGVhZi5jb250YWluZXJFbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdmlldy5vbk9wZW4oKTtcclxuICAgICAgICAgICAgbW9kYWwub25DbG9zZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgdmlldy5vbkNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgIHRlbXBMZWFmLmRldGFjaCgpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBtb2RhbC5vcGVuKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsOyAvLyBOZSBwYXMgcmV0b3VybmVyIGRlIGxlYWYgcG91ciBsZSBtb2RlIHBvcHVwXHJcbiAgICAgICAgIGNhc2UgJ3RhYic6XHJcbiAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIGxlYWYgPSB3b3Jrc3BhY2UuZ2V0TGVhZignc3BsaXQnKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBsZWFmO1xyXG4gICB9XHJcblxyXG4gICBhc3luYyBzZXRWaWV3KG1vZGU6IFRWaWV3TW9kZSkge1xyXG4gICAgICBpZiAobW9kZSA9PT0gdGhpcy5jdXJyZW50TW9kZSAmJiB0aGlzLmN1cnJlbnRWaWV3ICYmIHRoaXMuYWN0aXZlTGVhZikge1xyXG4gICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGF3YWl0IHRoaXMuY2xvc2VDdXJyZW50VmlldygpO1xyXG5cclxuICAgICAgY29uc3QgbGVhZiA9IHRoaXMuZ2V0TGVhZkZvck1vZGUobW9kZSk7XHJcbiAgICAgIFxyXG4gICAgICBpZiAobGVhZiAmJiBtb2RlICE9PSAncG9wdXAnKSB7XHJcbiAgICAgICAgIGF3YWl0IGxlYWYuc2V0Vmlld1N0YXRlKHtcclxuICAgICAgICAgICAgdHlwZTogJ3BsdWdpbmZsb3d6LXZpZXcnLFxyXG4gICAgICAgICAgICBhY3RpdmU6IHRydWUsXHJcbiAgICAgICAgICAgIHN0YXRlOiB7IFxyXG4gICAgICAgICAgICAgICBtb2RlOiBtb2RlLFxyXG4gICAgICAgICAgICAgICBsZWFmSWQ6IHRoaXMubGVhZklkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICB0aGlzLmN1cnJlbnRWaWV3ID0gbGVhZi52aWV3IGFzIERhc2hib2FyZDtcclxuICAgICAgICAgdGhpcy5hY3RpdmVMZWFmID0gbGVhZjtcclxuICAgICAgICAgdGhpcy5wbHVnaW4uYXBwLndvcmtzcGFjZS5yZXZlYWxMZWFmKGxlYWYpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmN1cnJlbnRNb2RlID0gbW9kZTtcclxuICAgICAgLy8gU2F1dmVnYXJkZXIgbGUgbm91dmVhdSBtb2RlIGRhbnMgbGVzIHNldHRpbmdzXHJcbiAgICAgIGF3YWl0IFNldHRpbmdzLnNhdmVTZXR0aW5ncyh7IGN1cnJlbnRNb2RlOiBtb2RlIH0pO1xyXG4gICB9XHJcblxyXG4gICBnZXRBY3RpdmVMZWFmKCk6IFdvcmtzcGFjZUxlYWYgfCBudWxsIHtcclxuICAgICAgcmV0dXJuIHRoaXMuYWN0aXZlTGVhZjtcclxuICAgfVxyXG5cclxuICAgZ2V0Q3VycmVudExlYWZJZCgpOiBzdHJpbmcgfCBudWxsIHtcclxuICAgICAgcmV0dXJuIHRoaXMubGVhZklkO1xyXG4gICB9XHJcbn0gIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUFBQSxtQkFBNkI7OztBQ0F0QixTQUFTLGlCQUFpQjtBQUNqQyxRQUFNLFVBQVUsU0FBUyxjQUFjLE9BQU87QUFDOUMsVUFBUSxLQUFLO0FBQ2IsVUFBUSxjQUFjO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUEwQ3RCLFdBQVMsS0FBSyxZQUFZLE9BQU87QUFDakM7OztBQzlDQSxzQkFBNkQ7QUFjdEQsSUFBTSxtQkFBb0M7QUFBQSxFQUM5QyxVQUFVO0FBQUEsRUFDVixhQUFhO0FBQUEsRUFDYixjQUFjO0FBQUEsRUFDZCxrQkFBa0I7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QUFTLE1BQU07QUFDN0MsY0FBTSxhQUFhQSxZQUFXQSxTQUFRLFNBQVMsTUFBTTtBQUVyRCxZQUFJLENBQUMsY0FBYyxDQUFDLFlBQVk7QUFDN0IsZUFBSyxLQUFLO0FBQ1YscUJBQVcsb0JBQW9CLGNBQWMsZ0JBQWdCO0FBQzdELGNBQUlBLFVBQVM7QUFDVixZQUFBQSxTQUFRLG9CQUFvQixjQUFjLGdCQUFnQjtBQUFBLFVBQzdEO0FBQUEsUUFDSDtBQUFBLE1BQ0g7QUFFQSxpQkFBVyxpQkFBaUIsY0FBYyxnQkFBZ0I7QUFDMUQsWUFBTSxVQUFXLEtBQWE7QUFDOUIsVUFBSSxTQUFTO0FBQ1YsZ0JBQVEsaUJBQWlCLGNBQWMsZ0JBQWdCO0FBQUEsTUFDMUQ7QUFBQSxJQUNILENBQUM7QUFFRCxtQkFBZTtBQUFBLEVBQ2xCO0FBQUEsRUFFQSxNQUFjLFVBQXlCO0FBQ3BDLFdBQU8sSUFBSSxRQUFRLENBQUMsWUFBWTtBQUM3QixVQUFJLENBQUMsS0FBSyxJQUFJLFdBQVc7QUFDdEIsbUJBQVcsU0FBUyxDQUFDO0FBQUEsTUFDeEIsT0FBTztBQUNKLGdCQUFRO0FBQUEsTUFDWDtBQUFBLElBQ0gsQ0FBQztBQUFBLEVBQ0o7QUFBQSxFQUVRLGVBQXFCO0FBOUhoQztBQStITSxRQUFJO0FBQ0QsWUFBTSxXQUFTLGNBQVMsZ0JBQWdCLFNBQXpCLG1CQUErQixjQUFjLFdBQVcsU0FBUSxPQUFPO0FBQ3RGLGNBQVEsSUFBSSwwQkFBb0IsTUFBTTtBQUN0QyxXQUFLLGFBQWEsWUFBWSxNQUFNO0FBQUEsSUFDdkMsU0FBUyxPQUFPO0FBQ2IsY0FBUSxLQUFLLHVGQUE4RTtBQUMzRixXQUFLLGFBQWEsWUFBWSxJQUFJO0FBQUEsSUFDckM7QUFBQSxFQUNIO0FBQUEsRUFFQSxXQUFXO0FBQ1IsU0FBSyxJQUFJLFVBQVUsbUJBQW1CLGtCQUFrQjtBQUFBLEVBQzNEO0FBQ0g7IiwKICAibmFtZXMiOiBbImltcG9ydF9vYnNpZGlhbiIsICJ0cmFuc2xhdGlvbnMiLCAiX2EiLCAiaW1wb3J0X29ic2lkaWFuIiwgInRyYW5zbGF0aW9ucyIsICJpbXBvcnRfb2JzaWRpYW4iLCAidHJhbnNsYXRpb25zIiwgImltcG9ydF9vYnNpZGlhbiIsICJsZWFmIiwgIm1lbnVEb20iXQp9Cg==
