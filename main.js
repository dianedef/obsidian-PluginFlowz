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
    .pluginflowz-modal {
        width: 90vw;
        height: 90vh;
        max-width: 90vw;
        max-height: 90vh;
    }

    .pluginflowz-modal .modal-bg {
        background-color: rgba(0, 0, 0, 0.5);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100vw;
        height: 100vh;
    }

    .pluginflowz-modal-content {
        height: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
        z-index: 1;
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL21haW4udHMiLCAic3JjL1JlZ2lzdGVyU3R5bGVzLnRzIiwgInNyYy9TZXR0aW5ncy50cyIsICJzcmMvVHJhbnNsYXRpb25zLnRzIiwgInNyYy9Ib3RrZXlzLnRzIiwgInNyYy9EYXNoYm9hcmQudHMiLCAic3JjL1ZpZXdNb2RlLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyBQbHVnaW4sIE1lbnUgfSBmcm9tICdvYnNpZGlhbic7XHJcbmltcG9ydCB7IFRWaWV3TW9kZSB9IGZyb20gJy4vdHlwZXMnO1xyXG5pbXBvcnQgeyByZWdpc3RlclN0eWxlcyB9IGZyb20gJy4vUmVnaXN0ZXJTdHlsZXMnO1xyXG5pbXBvcnQgeyBTZXR0aW5ncywgU2V0dGluZ3NUYWIsIERFRkFVTFRfU0VUVElOR1MgfSBmcm9tICcuL1NldHRpbmdzJ1xyXG5pbXBvcnQgeyBUcmFuc2xhdGlvbnMgfSBmcm9tICcuL1RyYW5zbGF0aW9ucyc7XHJcbmltcG9ydCB7IEhvdGtleXMgfSBmcm9tICcuL0hvdGtleXMnO1xyXG5pbXBvcnQgeyBEYXNoYm9hcmQgfSBmcm9tICcuL0Rhc2hib2FyZCc7XHJcbmltcG9ydCB7IFZpZXdNb2RlIH0gZnJvbSAnLi9WaWV3TW9kZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbHVnaW5GbG93eiBleHRlbmRzIFBsdWdpbiB7XHJcbiAgIHByaXZhdGUgdmlld01vZGUhOiBWaWV3TW9kZTtcclxuICAgc2V0dGluZ3MhOiBTZXR0aW5ncztcclxuICAgcHJpdmF0ZSB0cmFuc2xhdGlvbnM6IFRyYW5zbGF0aW9ucyA9IG5ldyBUcmFuc2xhdGlvbnMoKTtcclxuICAgcHJpdmF0ZSBob3RrZXlzITogSG90a2V5cztcclxuICAgcHJpdmF0ZSBkYXNoYm9hcmQhOiBEYXNoYm9hcmQ7XHJcblxyXG4gICBwcml2YXRlIGluaXRpYWxpemVWaWV3KCkge1xyXG4gICAgICB0aGlzLnJlZ2lzdGVyVmlldyhcclxuICAgICAgICAgXCJwbHVnaW5mbG93ei12aWV3XCIsXHJcbiAgICAgICAgIChsZWFmKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZpZXcgPSBuZXcgRGFzaGJvYXJkKGxlYWYsIHRoaXMuc2V0dGluZ3MsIHRoaXMudHJhbnNsYXRpb25zKTtcclxuICAgICAgICAgICAgdGhpcy5kYXNoYm9hcmQgPSB2aWV3O1xyXG4gICAgICAgICAgICByZXR1cm4gdmlldztcclxuICAgICAgICAgfVxyXG4gICAgICApO1xyXG4gICB9XHJcblxyXG4gICBhc3luYyBvbmxvYWQoKSB7XHJcbiAgICAgIGF3YWl0IHRoaXMubG9hZEFwcCgpO1xyXG5cclxuICAgICAgLy8gSW5pdGlhbGlzYXRpb25cclxuICAgICAgU2V0dGluZ3MuaW5pdGlhbGl6ZSh0aGlzKTtcclxuICAgICAgXHJcbiAgICAgIC8vIEluaXRpYWxpc2VyIGxlcyB0cmFkdWN0aW9uc1xyXG4gICAgICB0aGlzLmxvYWRMYW5ndWFnZSgpO1xyXG5cclxuICAgICAgLy8gSW5pdGlhbGlzZXIgVmlld01vZGUgYXZhbnQgZGUgbCd1dGlsaXNlclxyXG4gICAgICB0aGlzLnZpZXdNb2RlID0gbmV3IFZpZXdNb2RlKHRoaXMpO1xyXG4gICAgICBcclxuICAgICAgLy8gSW5pdGlhbGlzZXIgbGVzIGhvdGtleXNcclxuICAgICAgdGhpcy5ob3RrZXlzID0gbmV3IEhvdGtleXMoXHJcbiAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgIFNldHRpbmdzLFxyXG4gICAgICAgICB0aGlzLnRyYW5zbGF0aW9ucyxcclxuICAgICAgICAgdGhpcy52aWV3TW9kZVxyXG4gICAgICApO1xyXG4gICAgICB0aGlzLmhvdGtleXMucmVnaXN0ZXJIb3RrZXlzKCk7XHJcbiAgICAgIFxyXG4gICAgICB0aGlzLmluaXRpYWxpemVWaWV3KCk7XHJcblxyXG4gICAgICB0aGlzLmFkZFNldHRpbmdUYWIobmV3IFNldHRpbmdzVGFiKFxyXG4gICAgICAgICB0aGlzLmFwcCxcclxuICAgICAgICAgdGhpcyxcclxuICAgICAgICAgREVGQVVMVF9TRVRUSU5HUyxcclxuICAgICAgICAgdGhpcy52aWV3TW9kZSxcclxuICAgICAgICAgdGhpcy50cmFuc2xhdGlvbnNcclxuICAgICAgKSk7XHJcblxyXG4gICAgICAvLyBDclx1MDBFOWF0aW9uIGR1IG1lbnVcclxuICAgICAgY29uc3QgcmliYm9uSWNvbiA9IHRoaXMuYWRkUmliYm9uSWNvbihcclxuICAgICAgICAgJ2xheW91dC1ncmlkJyxcclxuICAgICAgICAgJ1BsdWdpbkZsb3d6JywgXHJcbiAgICAgICAgIGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbW9kZSA9IGF3YWl0IFNldHRpbmdzLmdldFZpZXdNb2RlKCk7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMudmlld01vZGUuc2V0Vmlldyhtb2RlKTtcclxuICAgICAgICAgfVxyXG4gICAgICApO1xyXG5cclxuICAgICAgcmliYm9uSWNvbi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgKCkgPT4ge1xyXG4gICAgICAgICBjb25zdCBtZW51ID0gbmV3IE1lbnUoKTtcclxuXHJcbiAgICAgICAgIGNvbnN0IGNyZWF0ZU1lbnVJdGVtID0gKHRpdGxlOiBzdHJpbmcsIGljb246IHN0cmluZywgbW9kZTogVFZpZXdNb2RlKSA9PiB7XHJcbiAgICAgICAgICAgIG1lbnUuYWRkSXRlbSgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICBpdGVtLnNldFRpdGxlKHRpdGxlKVxyXG4gICAgICAgICAgICAgICAgICAuc2V0SWNvbihpY29uKVxyXG4gICAgICAgICAgICAgICAgICAub25DbGljayhhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMudmlld01vZGUuc2V0Vmlldyhtb2RlKTtcclxuICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICB9O1xyXG5cclxuICAgICAgICAgY3JlYXRlTWVudUl0ZW0oXCJEYXNoYm9hcmQgVGFiXCIsIFwidGFiXCIsIFwidGFiXCIgYXMgVFZpZXdNb2RlKTtcclxuICAgICAgICAgY3JlYXRlTWVudUl0ZW0oXCJEYXNoYm9hcmQgU2lkZWJhclwiLCBcImxheW91dC1zaWRlYmFyLXJpZ2h0XCIsIFwic2lkZWJhclwiIGFzIFRWaWV3TW9kZSk7XHJcbiAgICAgICAgIGNyZWF0ZU1lbnVJdGVtKFwiRGFzaGJvYXJkIFBvcHVwXCIsIFwibGF5b3V0LXRvcFwiLCBcInBvcHVwXCIgYXMgVFZpZXdNb2RlKTtcclxuXHJcbiAgICAgICAgIGNvbnN0IGljb25SZWN0ID0gcmliYm9uSWNvbi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICAgbWVudS5zaG93QXRQb3NpdGlvbih7IFxyXG4gICAgICAgICAgICB4OiBpY29uUmVjdC5sZWZ0LCBcclxuICAgICAgICAgICAgeTogaWNvblJlY3QudG9wIC0gMTBcclxuICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICBjb25zdCBoYW5kbGVNb3VzZUxlYXZlID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gZS5yZWxhdGVkVGFyZ2V0IGFzIE5vZGU7XHJcbiAgICAgICAgICAgIGNvbnN0IG1lbnVEb20gPSAobWVudSBhcyBhbnkpLmRvbTtcclxuICAgICAgICAgICAgY29uc3QgaXNPdmVySWNvbiA9IHJpYmJvbkljb24uY29udGFpbnModGFyZ2V0KTtcclxuICAgICAgICAgICAgY29uc3QgaXNPdmVyTWVudSA9IG1lbnVEb20gJiYgbWVudURvbS5jb250YWlucyh0YXJnZXQpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKCFpc092ZXJJY29uICYmICFpc092ZXJNZW51KSB7XHJcbiAgICAgICAgICAgICAgIG1lbnUuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICByaWJib25JY29uLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBoYW5kbGVNb3VzZUxlYXZlKTtcclxuICAgICAgICAgICAgICAgaWYgKG1lbnVEb20pIHtcclxuICAgICAgICAgICAgICAgICAgbWVudURvbS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgaGFuZGxlTW91c2VMZWF2ZSk7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICB9O1xyXG5cclxuICAgICAgICAgcmliYm9uSWNvbi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgaGFuZGxlTW91c2VMZWF2ZSk7XHJcbiAgICAgICAgIGNvbnN0IG1lbnVEb20gPSAobWVudSBhcyBhbnkpLmRvbTtcclxuICAgICAgICAgaWYgKG1lbnVEb20pIHtcclxuICAgICAgICAgICAgbWVudURvbS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgaGFuZGxlTW91c2VMZWF2ZSk7XHJcbiAgICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICByZWdpc3RlclN0eWxlcygpO1xyXG4gICB9XHJcblxyXG4gICBwcml2YXRlIGFzeW5jIGxvYWRBcHAoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICBpZiAoIXRoaXMuYXBwLndvcmtzcGFjZSkge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KHJlc29sdmUsIDApO1xyXG4gICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgIH1cclxuXHJcbiAgIHByaXZhdGUgbG9hZExhbmd1YWdlKCk6IHZvaWQge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgICBjb25zdCBsb2NhbGUgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQubGFuZz8udG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKCdmcicpID8gJ2ZyJyA6ICdlbic7XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKCdMYW5ndWUgZFx1MDBFOXRlY3RcdTAwRTllOicsIGxvY2FsZSk7XHJcbiAgICAgICAgIHRoaXMudHJhbnNsYXRpb25zLnNldExhbmd1YWdlKGxvY2FsZSk7XHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgIGNvbnNvbGUud2FybignRXJyZXVyIGxvcnMgZGUgbGEgZFx1MDBFOXRlY3Rpb24gZGUgbGEgbGFuZ3VlLCB1dGlsaXNhdGlvbiBkdSBmcmFuXHUwMEU3YWlzIHBhciBkXHUwMEU5ZmF1dCcpO1xyXG4gICAgICAgICB0aGlzLnRyYW5zbGF0aW9ucy5zZXRMYW5ndWFnZSgnZnInKTtcclxuICAgICAgfVxyXG4gICB9XHJcblxyXG4gICBvbnVubG9hZCgpIHtcclxuICAgICAgdGhpcy5hcHAud29ya3NwYWNlLmRldGFjaExlYXZlc09mVHlwZShcInBsdWdpbmZsb3d6LXZpZXdcIik7XHJcbiAgIH1cclxufVxyXG4iLCAiZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyU3R5bGVzKCkge1xuY29uc3Qgc3R5bGVFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG5zdHlsZUVsLmlkID0gJ3BsdWdpbmZsb3d6LXN0eWxlcyc7XG5zdHlsZUVsLnRleHRDb250ZW50ID0gYFxuICAgIC8qID09PT09IENTUyA9PT09PSAqL1xuICAgIC5wbHVnaW5mbG93ei1tb2RhbCB7XG4gICAgICAgIHdpZHRoOiA5MHZ3O1xuICAgICAgICBoZWlnaHQ6IDkwdmg7XG4gICAgICAgIG1heC13aWR0aDogOTB2dztcbiAgICAgICAgbWF4LWhlaWdodDogOTB2aDtcbiAgICB9XG5cbiAgICAucGx1Z2luZmxvd3otbW9kYWwgLm1vZGFsLWJnIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjUpO1xuICAgICAgICBwb3NpdGlvbjogZml4ZWQ7XG4gICAgICAgIHRvcDogMDtcbiAgICAgICAgbGVmdDogMDtcbiAgICAgICAgcmlnaHQ6IDA7XG4gICAgICAgIGJvdHRvbTogMDtcbiAgICAgICAgd2lkdGg6IDEwMHZ3O1xuICAgICAgICBoZWlnaHQ6IDEwMHZoO1xuICAgIH1cblxuICAgIC5wbHVnaW5mbG93ei1tb2RhbC1jb250ZW50IHtcbiAgICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgIHotaW5kZXg6IDE7XG4gICAgfVxuXG4gICAgLnBsdWdpbmZsb3d6LWRhc2hib2FyZC1jb250YWluZXIge1xuICAgICAgICBwYWRkaW5nOiAyMHB4O1xuICAgICAgICBmbGV4OiAxO1xuICAgICAgICBvdmVyZmxvdy15OiBhdXRvO1xuICAgIH1cblxuICAgIC5wbHVnaW5mbG93ei1wbHVnaW5zLWxpc3Qge1xuICAgICAgICBkaXNwbGF5OiBncmlkO1xuICAgICAgICBnYXA6IDIwcHg7XG4gICAgICAgIHBhZGRpbmc6IDIwcHggMDtcbiAgICB9XG5cbiAgICAucGx1Z2luZmxvd3otcGx1Z2luLWl0ZW0ge1xuICAgICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1iYWNrZ3JvdW5kLXNlY29uZGFyeSk7XG4gICAgICAgIHBhZGRpbmc6IDE1cHg7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgICB9IFxuYDtcblxuZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVucmVnaXN0ZXJTdHlsZXMoKSB7XG5jb25zdCBzdHlsZUVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BsdWdpbmZsb3d6LXN0eWxlcycpO1xuaWYgKHN0eWxlRWwpIHtcbiAgICBzdHlsZUVsLnJlbW92ZSgpO1xufVxufSAiLCAiaW1wb3J0IHsgQXBwLCBQbHVnaW4sIFBsdWdpblNldHRpbmdUYWIsIFNldHRpbmcsIE1vZGFsfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgeyBWaWV3TW9kZSB9IGZyb20gJy4vVmlld01vZGUnO1xuaW1wb3J0IHsgVFZpZXdNb2RlLCBJUGx1Z2luRGF0YSB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgVHJhbnNsYXRpb25zIH0gZnJvbSAnLi9UcmFuc2xhdGlvbnMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIERlZmF1bHRTZXR0aW5ncyB7XG4gICBsYW5ndWFnZTogc3RyaW5nO1xuICAgY3VycmVudE1vZGU6IFRWaWV3TW9kZTtcbiAgIGFjdGl2ZUxlYWZJZDogc3RyaW5nIHwgbnVsbDtcbiAgIGVuYWJsZUF1dG9VcGRhdGU6IGJvb2xlYW47XG4gICBub3Rlc0ZvbGRlcjogc3RyaW5nO1xuICAgdGVtcGxhdGU6IHN0cmluZztcbn1cblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfU0VUVElOR1M6IERlZmF1bHRTZXR0aW5ncyA9IHtcbiAgIGxhbmd1YWdlOiAnZnInLFxuICAgY3VycmVudE1vZGU6ICdwb3B1cCcsXG4gICBhY3RpdmVMZWFmSWQ6IG51bGwsXG4gICBlbmFibGVBdXRvVXBkYXRlOiB0cnVlLFxuICAgbm90ZXNGb2xkZXI6ICdwbHVnaW5Ob3RlcycsXG4gICB0ZW1wbGF0ZTogJyMge3tuYW1lfX1cXG5cXG57e2Rlc2NyaXB0aW9ufX1cXG5cXG57e3VybH19J1xufTtcblxuZXhwb3J0IGNsYXNzIFNldHRpbmdzIHtcbiAgIHByaXZhdGUgc3RhdGljIHBsdWdpbjogUGx1Z2luO1xuICAgcHJpdmF0ZSBzdGF0aWMgc2V0dGluZ3M6IERlZmF1bHRTZXR0aW5ncztcblxuICAgc3RhdGljIGluaXRpYWxpemUocGx1Z2luOiBQbHVnaW4pIHtcbiAgICAgIHRoaXMucGx1Z2luID0gcGx1Z2luO1xuICAgfVxuXG4gICBzdGF0aWMgYXN5bmMgbG9hZFNldHRpbmdzKCk6IFByb21pc2U8RGVmYXVsdFNldHRpbmdzPiB7XG4gICAgICBjb25zdCBzYXZlZERhdGEgPSBhd2FpdCB0aGlzLnBsdWdpbi5sb2FkRGF0YSgpO1xuICAgICAgdGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfU0VUVElOR1MsIHNhdmVkRGF0YSB8fCB7fSk7XG4gICAgICByZXR1cm4gdGhpcy5zZXR0aW5ncztcbiAgIH1cblxuICAgc3RhdGljIGFzeW5jIHNhdmVTZXR0aW5ncyhzZXR0aW5nczogUGFydGlhbDxEZWZhdWx0U2V0dGluZ3M+KSB7XG4gICAgICB0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih0aGlzLnNldHRpbmdzIHx8IERFRkFVTFRfU0VUVElOR1MsIHNldHRpbmdzKTtcbiAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVEYXRhKHRoaXMuc2V0dGluZ3MpO1xuICAgfVxuXG4gICBzdGF0aWMgYXN5bmMgcmVmcmVzaCgpIHtcbiAgICAgIGlmICh0aGlzLnBsdWdpbiAmJiAncmVmcmVzaCcgaW4gdGhpcy5wbHVnaW4pIHtcbiAgICAgICAgIGF3YWl0ICh0aGlzLnBsdWdpbiBhcyBhbnkpLnJlZnJlc2goKTtcbiAgICAgIH1cbiAgIH1cblxuICAgc3RhdGljIGFzeW5jIGdldFZpZXdNb2RlKCk6IFByb21pc2U8VFZpZXdNb2RlPiB7XG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgdGhpcy5wbHVnaW4ubG9hZERhdGEoKTtcbiAgICAgIHJldHVybiAoZGF0YT8uY3VycmVudE1vZGUgfHwgREVGQVVMVF9TRVRUSU5HUy5jdXJyZW50TW9kZSkgYXMgVFZpZXdNb2RlO1xuICAgfVxufVxuXG5leHBvcnQgY2xhc3MgU2V0dGluZ3NUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcbiAgIHBsdWdpbjogUGx1Z2luO1xuICAgc2V0dGluZ3M6IERlZmF1bHRTZXR0aW5ncyAmIElQbHVnaW5EYXRhO1xuXG4gICBjb25zdHJ1Y3RvcihcbiAgICAgIGFwcDogQXBwLCBcbiAgICAgIHBsdWdpbjogUGx1Z2luLCBcbiAgICAgIHNldHRpbmdzOiBEZWZhdWx0U2V0dGluZ3MsIFxuICAgICAgcHJpdmF0ZSB2aWV3TW9kZTogVmlld01vZGUsXG4gICAgICBwcml2YXRlIHRyYW5zbGF0aW9uczogVHJhbnNsYXRpb25zXG4gICApIHtcbiAgICAgIHN1cGVyKGFwcCwgcGx1Z2luKTtcbiAgICAgIHRoaXMucGx1Z2luID0gcGx1Z2luO1xuICAgICAgdGhpcy5zZXR0aW5ncyA9IHtcbiAgICAgICAgIC4uLkRFRkFVTFRfU0VUVElOR1MsXG4gICAgICAgICBncm91cHM6IFtdLFxuICAgICAgICAgcGx1Z2luczogW11cbiAgICAgIH07XG4gICAgICBcbiAgICAgIHRoaXMubG9hZFNldHRpbmdzKCkudGhlbigoKSA9PiB7XG4gICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgIH0pO1xuICAgfVxuXG4gICBwcml2YXRlIGFzeW5jIGxvYWRTZXR0aW5ncygpIHtcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCB0aGlzLnBsdWdpbi5sb2FkRGF0YSgpO1xuICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgIHRoaXMuc2V0dGluZ3MgPSB7XG4gICAgICAgICAgICAuLi5ERUZBVUxUX1NFVFRJTkdTLFxuICAgICAgICAgICAgLi4uZGF0YSxcbiAgICAgICAgICAgIGdyb3VwczogZGF0YS5ncm91cHMgfHwgW10sXG4gICAgICAgICAgICBwbHVnaW5zOiBkYXRhLnBsdWdpbnMgfHwgW11cbiAgICAgICAgIH07XG4gICAgICB9XG4gICB9XG5cbiAgIGFzeW5jIGRpc3BsYXkoKTogdm9pZCB7XG4gICAgICBhd2FpdCB0aGlzLmxvYWRTZXR0aW5ncygpO1xuICAgICAgY29uc3QgeyBjb250YWluZXJFbCB9ID0gdGhpcztcbiAgICAgIGNvbnRhaW5lckVsLmVtcHR5KCk7XG5cbi8vIE1vZGUgZCdhZmZpY2hhZ2UgcGFyIGRcdTAwRTlmYXV0XG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgIC5zZXROYW1lKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLmRlZmF1bHRWaWV3TW9kZScpKVxuICAgICAgICAgLnNldERlc2ModGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MuZGVmYXVsdFZpZXdNb2RlRGVzYycpKVxuICAgICAgICAgLmFkZERyb3Bkb3duKGRyb3Bkb3duID0+IGRyb3Bkb3duXG4gICAgICAgICAgICAuYWRkT3B0aW9uKCd0YWInLCB0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy50YWInKSlcbiAgICAgICAgICAgIC5hZGRPcHRpb24oJ3NpZGViYXInLCB0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5zaWRlYmFyJykpXG4gICAgICAgICAgICAuYWRkT3B0aW9uKCdwb3B1cCcsIHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLnBvcHVwJykpXG4gICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5zZXR0aW5ncy5jdXJyZW50TW9kZSlcbiAgICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuY3VycmVudE1vZGUgPSB2YWx1ZSBhcyBUVmlld01vZGU7XG4gICAgICAgICAgICAgICBhd2FpdCBTZXR0aW5ncy5zYXZlU2V0dGluZ3MoeyBjdXJyZW50TW9kZTogdmFsdWUgYXMgVFZpZXdNb2RlIH0pO1xuICAgICAgICAgICAgICAgYXdhaXQgdGhpcy52aWV3TW9kZS5zZXRWaWV3KHZhbHVlIGFzIFRWaWV3TW9kZSk7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICBcbi8vIERvc3NpZXIgZGVzIHBsdWdpbnNcbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgLnNldE5hbWUodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MucGx1Z2luRm9sZGVyLm5hbWUnKSlcbiAgICAgICAgIC5zZXREZXNjKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLnBsdWdpbkZvbGRlci5kZXNjJykpXG4gICAgICAgICAuYWRkVGV4dCh0ZXh0ID0+IHRleHRcbiAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnNldHRpbmdzLm5vdGVzRm9sZGVyKVxuICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgYXdhaXQgU2V0dGluZ3Muc2F2ZVNldHRpbmdzKHsgbm90ZXNGb2xkZXI6IHZhbHVlIH0pO1xuICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5pbml0aWFsaXplRm9sZGVycyh2YWx1ZSwgdGhpcy5zZXR0aW5ncy5ncm91cHMpO1xuICAgICAgICAgICAgICAgbmV3IE5vdGljZSh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5wbHVnaW5Gb2xkZXIudXBkYXRlZCcpKTtcbiAgICAgICAgICAgIH0pKTtcblxuIFxuLy8gVGVtcGxhdGUgZGVzIG5vdGVzXG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgIC5zZXROYW1lKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLnRlbXBsYXRlLm5hbWUnKSlcbiAgICAgICAgIC5zZXREZXNjKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLnRlbXBsYXRlLmRlc2MnKSlcbiAgICAgICAgIC5hZGRUZXh0QXJlYSgodGV4dCkgPT4gdGV4dFxuICAgICAgICAgICAgLnNldFBsYWNlaG9sZGVyKCcjIHt7bmFtZX19XFxuXFxue3tkZXNjcmlwdGlvbn19XFxuXFxue3t1cmx9fScpXG4gICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5zZXR0aW5ncy50ZW1wbGF0ZSB8fCAnJylcbiAgICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgIGF3YWl0IFNldHRpbmdzLnNhdmVTZXR0aW5ncyh7IHRlbXBsYXRlOiB2YWx1ZSB9KTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgIFxuLy8gRG9zc2llciBkZXMgZ3JvdXBlc1xuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAuc2V0TmFtZSh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5ncm91cEZvbGRlci5uYW1lJykpXG4gICAgICAgICAuc2V0RGVzYyh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5ncm91cEZvbGRlci5kZXNjJykpXG4gICAgICAgICAuYWRkVGV4dCh0ZXh0ID0+IHRleHRcbiAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnNldHRpbmdzLm5vdGVzRm9sZGVyKVxuICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgYXdhaXQgU2V0dGluZ3Muc2F2ZVNldHRpbmdzKHsgbm90ZXNGb2xkZXI6IHZhbHVlIH0pO1xuICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5pbml0aWFsaXplRm9sZGVycyh2YWx1ZSwgdGhpcy5zZXR0aW5ncy5ncm91cHMpO1xuICAgICAgICAgICAgICAgbmV3IE5vdGljZSh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5ncm91cEZvbGRlci51cGRhdGVkJykpO1xuICAgICAgICAgICAgfSkpO1xuXG4vLyBTZWN0aW9uIEltcG9ydC9FeHBvcnRcbiAgICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKCdoMScsIHt0ZXh0OiB0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5pbXBvcnRFeHBvcnQudGl0bGUnKX0pO1xuXG4vLyBJbXBvcnQgSlNPTlxuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAuc2V0TmFtZSh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkltcG9ydC5uYW1lJykpXG4gICAgICAgICAuc2V0RGVzYyh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkltcG9ydC5kZXNjJykpXG4gICAgICAgICAuYWRkQnV0dG9uKChidXR0b246IEJ1dHRvbkNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgYnV0dG9uXG4gICAgICAgICAgICAgICAuc2V0QnV0dG9uVGV4dCh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkltcG9ydC5idXR0b24nKSlcbiAgICAgICAgICAgICAgIC5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgICAgICAgICAgIGlucHV0LnR5cGUgPSAnZmlsZSc7XG4gICAgICAgICAgICAgICAgICBpbnB1dC5hY2NlcHQgPSAnLmpzb24nO1xuICAgICAgICAgICAgICAgICAgaW5wdXQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgICAgICAgIGNvbnRhaW5lckVsLmFwcGVuZENoaWxkKGlucHV0KTtcblxuICAgICAgICAgICAgICAgICAgaW5wdXQub25jaGFuZ2UgPSBhc3luYyAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgICBpZiAoIXRhcmdldC5maWxlcz8ubGVuZ3RoKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxvYWRpbmdOb3RpY2UgPSBuZXcgTm90aWNlKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uSW1wb3J0LmxvYWRpbmcnKSwgMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWxlID0gdGFyZ2V0LmZpbGVzWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmVhZGVyLm9ubG9hZCA9IGFzeW5jIChldmVudDogUHJvZ3Jlc3NFdmVudDxGaWxlUmVhZGVyPikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChldmVudC50YXJnZXQ/LnJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY29uZmlnID0gSlNPTi5wYXJzZShldmVudC50YXJnZXQucmVzdWx0IGFzIHN0cmluZyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFZcdTAwRTlyaWZpZXIgcXVlIGxlIGZpY2hpZXIgY29udGllbnQgbGVzIGNoYW1wcyBlc3NlbnRpZWxzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWNvbmZpZy5wbHVnaW5zIHx8ICFBcnJheS5pc0FycmF5KGNvbmZpZy5ncm91cHMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgTm90aWNlKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uSW1wb3J0LmVycm9yJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDclx1MDBFOWVyIHVuZSBzYXV2ZWdhcmRlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBiYWNrdXAgPSBhd2FpdCB0aGlzLnBsdWdpbi5sb2FkRGF0YSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYmFja3VwSnNvbiA9IEpTT04uc3RyaW5naWZ5KGJhY2t1cCwgbnVsbCwgMik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBiYWNrdXBCbG9iID0gbmV3IEJsb2IoW2JhY2t1cEpzb25dLCB7IHR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJhY2t1cFVybCA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKGJhY2t1cEJsb2IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYmFja3VwQSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2t1cEEuaHJlZiA9IGJhY2t1cFVybDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2t1cEEuZG93bmxvYWQgPSAncGx1Z2luLWZsb3d6LWJhY2t1cC5qc29uJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2t1cEEuY2xpY2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5VUkwucmV2b2tlT2JqZWN0VVJMKGJhY2t1cFVybCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFwcGxpcXVlciBsYSBub3V2ZWxsZSBjb25maWd1cmF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBTZXR0aW5ncy5zYXZlU2V0dGluZ3MoY29uZmlnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25JbXBvcnQuc3VjY2VzcycpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0VycmV1ciBsb3JzIGR1IHBhcnNpbmc6JywgZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZSh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkltcG9ydC5lcnJvcicpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRpbmdOb3RpY2UuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZSh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkltcG9ydC5lcnJvcicpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0LnZhbHVlID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICBpbnB1dC5jbGljaygpO1xuICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBidXR0b247XG4gICAgICAgICB9KTtcblxuLy8gRXhwb3J0IEpTT05cbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgLnNldE5hbWUodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25FeHBvcnQubmFtZScpKVxuICAgICAgICAgLnNldERlc2ModGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25FeHBvcnQuZGVzYycpKVxuICAgICAgICAgLmFkZEJ1dHRvbigoYnV0dG9uOiBCdXR0b25Db21wb25lbnQpID0+IGJ1dHRvblxuICAgICAgICAgICAgLnNldEJ1dHRvblRleHQodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25FeHBvcnQuYnV0dG9uJykpXG4gICAgICAgICAgICAub25DbGljayhhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICBjb25zdCBsb2FkaW5nTm90aWNlID0gbmV3IE5vdGljZSh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkV4cG9ydC5sb2FkaW5nJyksIDApO1xuICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCB0aGlzLnBsdWdpbi5sb2FkRGF0YSgpO1xuICAgICAgICAgICAgICAgICAgY29uc3QganNvblN0cmluZyA9IEpTT04uc3RyaW5naWZ5KGRhdGEsIG51bGwsIDIpO1xuXG4gICAgICAgICAgICAgICAgICBjb25zdCBibG9iID0gbmV3IEJsb2IoW2pzb25TdHJpbmddLCB7IHR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyB9KTtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IHVybCA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuICAgICAgICAgICAgICAgICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgICAgICAgICAgIGEuaHJlZiA9IHVybDtcbiAgICAgICAgICAgICAgICAgIGEuZG93bmxvYWQgPSAncGx1Z2luLWZsb3d6LWNvbmZpZy5qc29uJztcbiAgICAgICAgICAgICAgICAgIGEuY2xpY2soKTtcbiAgICAgICAgICAgICAgICAgIHdpbmRvdy5VUkwucmV2b2tlT2JqZWN0VVJMKHVybCk7XG5cbiAgICAgICAgICAgICAgICAgIGxvYWRpbmdOb3RpY2UuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZSh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkV4cG9ydC5zdWNjZXNzJykpO1xuICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgIGxvYWRpbmdOb3RpY2UuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZSh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkV4cG9ydC5lcnJvcicpKTtcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuXG4gIGNvbnRhaW5lckVsLmNyZWF0ZUVsKCdocicpXG5cbi8vIFNlY3Rpb24gZGUgZ2VzdGlvbiBkZXMgZ3JvdXBlc1xuICBjb250YWluZXJFbC5jcmVhdGVFbCgnaDEnLCB7dGV4dDogdGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MuZ3JvdXBzLnRpdGxlJyl9KVxuXG4vLyBBZmZpY2hlciBsZXMgZ3JvdXBlcyBleGlzdGFudHNcbiAgdGhpcy5zZXR0aW5ncy5ncm91cHMuZm9yRWFjaCgoZ3JvdXA6IHN0cmluZywgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgIGlmIChncm91cCAhPT0gJ1NhbnMgZ3JvdXBlJykge1xuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgIC5zZXROYW1lKGdyb3VwKVxuICAgICAgICAuYWRkQnV0dG9uKChidXR0b246IEJ1dHRvbkNvbXBvbmVudCkgPT4gYnV0dG9uXG4gICAgICAgICAgLnNldEJ1dHRvblRleHQodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MuZ3JvdXBzLmRlbGV0ZS5idXR0b24nKSlcbiAgICAgICAgICAuc2V0V2FybmluZygpXG4gICAgICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgY29uc3QgZ3JvdXBQYXRoID0gYCR7dGhpcy5zZXR0aW5ncy5ub3Rlc0ZvbGRlcn0vJHtncm91cH1gO1xuXG4vLyBEXHUwMEU5cGxhY2VyIGxlcyBwbHVnaW5zIGRlIGNlIGdyb3VwZSB2ZXJzIFwiU2FucyBncm91cGVcIlxuICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzLnBsdWdpbnMuZm9yRWFjaChwbHVnaW4gPT4ge1xuICAgICAgICAgICAgICAgIGlmIChwbHVnaW4uZ3JvdXAuaW5jbHVkZXMoZ3JvdXApKSB7XG4gICAgICAgICAgICAgICAgICBwbHVnaW4uZ3JvdXAgPSBwbHVnaW4uZ3JvdXAuZmlsdGVyKGcgPT4gZyAhPT0gZ3JvdXApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG5cbi8vIFN1cHByaW1lciBsZSBncm91cGUgZGVzIHBhcmFtXHUwMEU4dHJlc1xuICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzLmdyb3Vwcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICBhd2FpdCBTZXR0aW5ncy5zYXZlU2V0dGluZ3ModGhpcy5zZXR0aW5ncyk7XG5cbiAgICAgICAgICAgICAgbmV3IE5vdGljZSh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5ncm91cHMuZGVsZXRlLnN1Y2Nlc3MnKSArIGAgOiAke2dyb3VwfWApO1xuICAgICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYEVycmV1ciBsb3JzIGRlIGxhIHN1cHByZXNzaW9uIGR1IGdyb3VwZSAke2dyb3VwfTpgLCBlcnJvcik7XG4gICAgICAgICAgICAgIG5ldyBOb3RpY2UodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MuZ3JvdXBzLmRlbGV0ZS5lcnJvcicpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KSlcbiAgICB9XG4gIH0pXG5cbi8vIEFqb3V0ZXIgdW4gbm91dmVhdSBncm91cGVcbiAgbGV0IGlucHV0VGV4dCA9ICcnO1xuICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAuc2V0TmFtZSh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5ncm91cHMuYWRkLm5hbWUnKSlcbiAgICAuc2V0RGVzYyh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5ncm91cHMuYWRkLmRlc2MnKSlcbiAgICAuYWRkVGV4dCh0ZXh0ID0+IHRleHRcbiAgICAgIC5zZXRQbGFjZWhvbGRlcih0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5ncm91cHMuYWRkLnBsYWNlaG9sZGVyJykpXG4gICAgICAuc2V0VmFsdWUoJycpXG4gICAgICAub25DaGFuZ2UoKHZhbHVlOiBzdHJpbmcpID0+IHtcbiAgICAgICAgaW5wdXRUZXh0ID0gdmFsdWU7XG4gICAgICB9KVxuICAgICAgLmlucHV0RWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5cHJlc3MnLCBhc3luYyAoZTogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgICAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicgJiYgaW5wdXRUZXh0LnRyaW0oKSkge1xuICAgICAgICAgIGNvbnN0IGdyb3VwTmFtZSA9IGlucHV0VGV4dC50cmltKCk7XG4gICAgICAgICAgY29uc3QgY3VycmVudFNldHRpbmdzID0gdGhpcy5wbHVnaW4uc2V0dGluZ3NTZXJ2aWNlLmdldFNldHRpbmdzKCk7XG4gICAgICAgICAgaWYgKCFjdXJyZW50U2V0dGluZ3MuZ3JvdXBzLmluY2x1ZGVzKGdyb3VwTmFtZSkpIHtcbi8vIENyXHUwMEU5ZXIgbGUgZG9zc2llciBwb3VyIGxlIG5vdXZlYXUgZ3JvdXBlXG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5maWxlU2VydmljZS5lbnN1cmVGb2xkZXIoYCR7Y3VycmVudFNldHRpbmdzLnJzc0ZvbGRlcn0vJHtncm91cE5hbWV9YCk7XG4gICAgICAgICAgICBcbi8vIEFqb3V0ZXIgbGUgZ3JvdXBlIGF1eCBwYXJhbVx1MDBFOHRyZXNcbiAgICAgICAgICAgIGN1cnJlbnRTZXR0aW5ncy5ncm91cHMucHVzaChncm91cE5hbWUpO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2V0dGluZ3NTZXJ2aWNlLnVwZGF0ZVNldHRpbmdzKGN1cnJlbnRTZXR0aW5ncyk7XG4gICAgICAgICAgICBuZXcgTm90aWNlKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLmdyb3Vwcy5hZGQuc3VjY2VzcycpICsgYCA6ICR7Z3JvdXBOYW1lfWApO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ldyBOb3RpY2UodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MuZ3JvdXBzLmFkZC5lcnJvcicpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pKTtcblxuICBjb250YWluZXJFbC5jcmVhdGVFbCgnaHInKTtcbiAgY29udGFpbmVyRWwuY3JlYXRlRWwoJ2gxJywge3RleHQ6IHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLnBsdWdpbnMudGl0bGUnKX0pO1xuXG4vLyBCYXJyZSBkZSByZWNoZXJjaGUgcG91ciBsZXMgcGx1Z2luc1xuICAgICAgY29uc3Qgc2VhcmNoQ29udGFpbmVyID0gY29udGFpbmVyRWwuY3JlYXRlRGl2KCdwbHVnaW5mbG93ei1zZWFyY2gtY29udGFpbmVyJyk7XG4gICAgICBjb25zdCBzZWFyY2hJbnB1dCA9IHNlYXJjaENvbnRhaW5lci5jcmVhdGVFbCgnaW5wdXQnLCB7XG4gICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgICBwbGFjZWhvbGRlcjogdGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MucGx1Z2lucy5zZWFyY2gucGxhY2Vob2xkZXInKSxcbiAgICAgICAgIGNsczogJ3BsdWdpbmZsb3d6LXBsdWdpbi1zZWFyY2gtaW5wdXQnXG4gICAgICB9KTtcblxuLy8gQ29udGFpbmVyIHBvdXIgdG91cyBsZXMgcGx1Z2luc1xuICAgICAgY29uc3QgcGx1Z2luc0NvbnRhaW5lciA9IGNvbnRhaW5lckVsLmNyZWF0ZURpdigncGx1Z2luZmxvd3otcGx1Z2lucy1jb250YWluZXInKTtcbiAgXG4vLyBGb25jdGlvbiBwb3VyIGZpbHRyZXIgZXQgYWZmaWNoZXIgbGVzIHBsdWdpbnNcbiAgICAgIGNvbnN0IGZpbHRlckFuZERpc3BsYXlQbHVnaW5zID0gKHNlYXJjaFRlcm0gPSAnJykgPT4ge1xuICAgICAgICAgcGx1Z2luc0NvbnRhaW5lci5lbXB0eSgpO1xuICAgICAgICAgY29uc3QgZ3JvdXBlZFBsdWdpbnM6IFJlY29yZDxzdHJpbmcsIEFycmF5PHtwbHVnaW46IElQbHVnaW4sIGluZGV4OiBudW1iZXJ9Pj4gPSB7fTtcbiAgICAgICAgIFxuICAgICAgICAgdGhpcy5zZXR0aW5ncy5wbHVnaW5zXG4gICAgICAgICAgICAuZmlsdGVyKHBsdWdpbiA9PiBcbiAgICAgICAgICAgICAgIHBsdWdpbi50aXRsZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHNlYXJjaFRlcm0udG9Mb3dlckNhc2UoKSkgfHxcbiAgICAgICAgICAgICAgIHBsdWdpbi5kZXNjcmlwdGlvbi50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHNlYXJjaFRlcm0udG9Mb3dlckNhc2UoKSkgfHxcbiAgICAgICAgICAgICAgIHBsdWdpbi5ncm91cC5zb21lKGcgPT4gZy50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHNlYXJjaFRlcm0udG9Mb3dlckNhc2UoKSkpXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuZm9yRWFjaCgocGx1Z2luLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgcGx1Z2luLmdyb3VwLmZvckVhY2goZ3JvdXAgPT4ge1xuICAgICAgICAgICAgICAgICAgaWYgKCFncm91cGVkUGx1Z2luc1tncm91cF0pIHtcbiAgICAgICAgICAgICAgICAgICAgIGdyb3VwZWRQbHVnaW5zW2dyb3VwXSA9IFtdO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgZ3JvdXBlZFBsdWdpbnNbZ3JvdXBdLnB1c2goe3BsdWdpbiwgaW5kZXh9KTtcbiAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgIE9iamVjdC5lbnRyaWVzKGdyb3VwZWRQbHVnaW5zKS5mb3JFYWNoKChbZ3JvdXBOYW1lLCBwbHVnaW5zXSkgPT4ge1xuICAgICAgICAgICAgcGx1Z2luc0NvbnRhaW5lci5jcmVhdGVFbCgnaDInLCB7dGV4dDogZ3JvdXBOYW1lfSk7XG5cbiAgICAgICAgICAgIHBsdWdpbnMuZm9yRWFjaCgoe3BsdWdpbiwgaW5kZXh9KSA9PiB7XG4gICAgICAgICAgICAgICBjb25zdCBwbHVnaW5Db250YWluZXIgPSBwbHVnaW5zQ29udGFpbmVyLmNyZWF0ZURpdigncGx1Z2luZmxvd3otcGx1Z2luLWNvbnRhaW5lciBjb2xsYXBzZWQnKTtcbiAgICAgICAgICAgICAgIGNvbnN0IGhlYWRlckNvbnRhaW5lciA9IHBsdWdpbkNvbnRhaW5lci5jcmVhdGVEaXYoJ3BsdWdpbmZsb3d6LXBsdWdpbi1oZWFkZXInKTtcbiAgICAgICAgICAgICAgIFxuLy8gQWpvdXRlciBsZSB0aXRyZSBldCBsZSBzdGF0dXQgZHUgcGx1Z2luXG4gICAgICAgICAgICAgICBjb25zdCB0aXRsZUNvbnRhaW5lciA9IGhlYWRlckNvbnRhaW5lci5jcmVhdGVEaXYoJ3BsdWdpbmZsb3d6LXBsdWdpbi10aXRsZS1jb250YWluZXInKTtcbiAgICAgICAgICAgICAgIHRpdGxlQ29udGFpbmVyLmNyZWF0ZUVsKCdzcGFuJywgeyB0ZXh0OiBwbHVnaW4udGl0bGUgfSk7XG4gICAgICAgICAgICAgICBcbi8vIEFqb3V0ZXIgbGVzIHRhZ3NcbiAgICAgICAgICAgICAgIGNvbnN0IHRhZ3NDb250YWluZXIgPSB0aXRsZUNvbnRhaW5lci5jcmVhdGVEaXYoJ3BsdWdpbmZsb3d6LXBsdWdpbi10YWdzLWNvbnRhaW5lcicpO1xuICAgICAgICAgICAgICAgcGx1Z2luLnRhZ3MuZm9yRWFjaCh0YWcgPT4ge1xuICAgICAgICAgICAgICAgICAgdGFnc0NvbnRhaW5lci5jcmVhdGVFbCgnc3BhbicsIHsgXG4gICAgICAgICAgICAgICAgICAgICB0ZXh0OiB0YWcsXG4gICAgICAgICAgICAgICAgICAgICBjbHM6ICdwbHVnaW5mbG93ei1wbHVnaW4tdGFnJ1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgY29uc3Qgb3B0aW9uc0NvbnRhaW5lciA9IHBsdWdpbkNvbnRhaW5lci5jcmVhdGVEaXYoJ3BsdWdpbmZsb3d6LXBsdWdpbi1vcHRpb25zJyk7XG4gICAgICAgICAgICAgICBvcHRpb25zQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cbi8vIENyXHUwMEU5ZXIgdW4gY29udGVuZXVyIHBvdXIgbGVzIGJvdXRvbnNcbiAgICAgICAgICAgICAgIGNvbnN0IGJ1dHRvbkNvbnRhaW5lciA9IGhlYWRlckNvbnRhaW5lci5jcmVhdGVEaXYoJ3BsdWdpbmZsb3d6LXBsdWdpbi1idXR0b25zJyk7XG5cbiAgICAgICAgICAgICAgIGxldCB0b2dnbGVCdXR0b246IEJ1dHRvbkNvbXBvbmVudDtcblxuLy8gRm9uY3Rpb24gcG91ciB0b2dnbGUgbGUgcGx1Z2luXG4gICAgICAgICAgICAgICBjb25zdCB0b2dnbGVQbHVnaW4gPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICBjb25zdCBpc0NvbGxhcHNlZCA9IHBsdWdpbkNvbnRhaW5lci5jbGFzc0xpc3QuY29udGFpbnMoJ2NvbGxhcHNlZCcpO1xuICAgICAgICAgICAgICAgICAgcGx1Z2luQ29udGFpbmVyLmNsYXNzTGlzdC50b2dnbGUoJ2NvbGxhcHNlZCcpO1xuICAgICAgICAgICAgICAgICAgb3B0aW9uc0NvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gaXNDb2xsYXBzZWQgPyAnYmxvY2snIDogJ25vbmUnO1xuICAgICAgICAgICAgICAgICAgaWYgKHRvZ2dsZUJ1dHRvbikge1xuICAgICAgICAgICAgICAgICAgICAgdG9nZ2xlQnV0dG9uLnNldEljb24oaXNDb2xsYXBzZWQgPyAnY2hldnJvbi11cCcgOiAnY2hldnJvbi1kb3duJyk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICB9O1xuXG4vLyBBam91dGVyIGxlcyBib3V0b25zIGRhbnMgbGV1ciBjb250ZW5ldXJcbiAgICAgICAgICAgICAgIG5ldyBTZXR0aW5nKGJ1dHRvbkNvbnRhaW5lcilcbiAgICAgICAgICAgICAgICAgIC5hZGRFeHRyYUJ1dHRvbigoYnV0dG9uOiBCdXR0b25Db21wb25lbnQpID0+IGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgLnNldEljb24ocGx1Z2luLmFjdGl2YXRlID8gJ2NoZWNrLWNpcmNsZScgOiAnY2lyY2xlJylcbiAgICAgICAgICAgICAgICAgICAgIC5zZXRUb29sdGlwKHBsdWdpbi5hY3RpdmF0ZSA/IFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MucGx1Z2lucy5kZWFjdGl2YXRlLnRvb2x0aXAnKSA6IFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MucGx1Z2lucy5hY3RpdmF0ZS50b29sdGlwJykpXG4gICAgICAgICAgICAgICAgICAgICAub25DbGljayhhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbHVnaW4uYWN0aXZhdGUgPSAhcGx1Z2luLmFjdGl2YXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgU2V0dGluZ3Muc2F2ZVNldHRpbmdzKHRoaXMuc2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uLnNldEljb24ocGx1Z2luLmFjdGl2YXRlID8gJ2NoZWNrLWNpcmNsZScgOiAnY2lyY2xlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgTm90aWNlKHRoaXMudHJhbnNsYXRpb25zLnQocGx1Z2luLmFjdGl2YXRlID8gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAnc2V0dGluZ3MucGx1Z2lucy5hY3RpdmF0ZWQnIDogXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAnc2V0dGluZ3MucGx1Z2lucy5kZWFjdGl2YXRlZCdcbiAgICAgICAgICAgICAgICAgICAgICAgICkucmVwbGFjZSgne3RpdGxlfScsIHBsdWdpbi50aXRsZSkpO1xuICAgICAgICAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICAgICAgICAuYWRkRXh0cmFCdXR0b24oKGJ1dHRvbjogQnV0dG9uQ29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICB0b2dnbGVCdXR0b24gPSBidXR0b247XG4gICAgICAgICAgICAgICAgICAgICBidXR0b24uc2V0SWNvbignY2hldnJvbi1kb3duJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zZXRUb29sdGlwKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLnBsdWdpbnMudG9nZ2xlLnRvb2x0aXAnKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vbkNsaWNrKCgpID0+IHRvZ2dsZVBsdWdpbigpKTtcbiAgICAgICAgICAgICAgICAgICAgIHJldHVybiBidXR0b247XG4gICAgICAgICAgICAgICAgICB9KTtcblxuLy8gUmVuZHJlIGxlIGhlYWRlciBjbGlxdWFibGVcbiAgICAgICAgICAgICAgIGhlYWRlckNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgICAgICAgICAgaWYgKCF0YXJnZXQuY2xvc2VzdCgnLnBsdWdpbmZsb3d6LXBsdWdpbi1idXR0b25zJykpIHtcbiAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZVBsdWdpbigpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgfSk7XG5cbi8vIE9wdGlvbnMgZHUgcGx1Z2luXG4gICAgICAgICAgICAgICBuZXcgU2V0dGluZyhvcHRpb25zQ29udGFpbmVyKVxuICAgICAgICAgICAgICAgICAgLnNldE5hbWUodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MucGx1Z2lucy5vcHRpb25zLnN0YXR1cycpKVxuICAgICAgICAgICAgICAgICAgLmFkZERyb3Bkb3duKChkcm9wZG93bjogRHJvcGRvd25Db21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgIGRyb3Bkb3duLmFkZE9wdGlvbignZXhwbG9yaW5nJywgdGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MucGx1Z2lucy5zdGF0dXMuZXhwbG9yaW5nJykpO1xuICAgICAgICAgICAgICAgICAgICAgZHJvcGRvd24uYWRkT3B0aW9uKCdhY3RpdmUnLCB0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5wbHVnaW5zLnN0YXR1cy5hY3RpdmUnKSk7XG4gICAgICAgICAgICAgICAgICAgICBkcm9wZG93bi5hZGRPcHRpb24oJ2luYWN0aXZlJywgdGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MucGx1Z2lucy5zdGF0dXMuaW5hY3RpdmUnKSk7XG4gICAgICAgICAgICAgICAgICAgICBkcm9wZG93bi5zZXRWYWx1ZShwbHVnaW4uc3RhdHVzWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgIGRyb3Bkb3duLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5wbHVnaW5zW2luZGV4XS5zdGF0dXMgPSBbdmFsdWUgYXMgVFBsdWdpblN0YXR1c107XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBTZXR0aW5ncy5zYXZlU2V0dGluZ3ModGhpcy5zZXR0aW5ncyk7XG4gICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuXG4vLyBHcm91cGVzIGR1IHBsdWdpblxuICAgICAgICAgICAgICAgbmV3IFNldHRpbmcob3B0aW9uc0NvbnRhaW5lcilcbiAgICAgICAgICAgICAgICAgIC5zZXROYW1lKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLnBsdWdpbnMub3B0aW9ucy5ncm91cHMnKSlcbiAgICAgICAgICAgICAgICAgIC5hZGREcm9wZG93bigoZHJvcGRvd246IERyb3Bkb3duQ29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICBkcm9wZG93bi5hZGRPcHRpb24oJycsIHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLnBsdWdpbnMuZ3JvdXBzLm5vbmUnKSk7XG4gICAgICAgICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzLmdyb3Vwcy5mb3JFYWNoKGcgPT4gXG4gICAgICAgICAgICAgICAgICAgICAgICBkcm9wZG93bi5hZGRPcHRpb24oZywgZylcbiAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICBkcm9wZG93bi5zZXRWYWx1ZShwbHVnaW4uZ3JvdXBbMF0gfHwgJycpO1xuICAgICAgICAgICAgICAgICAgICAgZHJvcGRvd24ub25DaGFuZ2UoYXN5bmMgKHZhbHVlOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9sZEdyb3VwcyA9IFsuLi5wbHVnaW4uZ3JvdXBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3R3JvdXAgPSB2YWx1ZSB8fCAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXdHcm91cCAmJiAhcGx1Z2luLmdyb3VwLmluY2x1ZGVzKG5ld0dyb3VwKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGx1Z2luLmdyb3VwLnB1c2gobmV3R3JvdXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBTZXR0aW5ncy5zYXZlU2V0dGluZ3ModGhpcy5zZXR0aW5ncyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc291cmNlR3JvdXBzID0gb2xkR3JvdXBzLmxlbmd0aCA/IG9sZEdyb3Vwcy5qb2luKCcsICcpIDogdGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MucGx1Z2lucy5ncm91cHMubm9uZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVzdGluYXRpb25Hcm91cHMgPSBwbHVnaW4uZ3JvdXAuam9pbignLCAnKSB8fCB0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5wbHVnaW5zLmdyb3Vwcy5ub25lJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgTm90aWNlKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLnBsdWdpbnMuZ3JvdXBzLnVwZGF0ZWQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoJ3t0aXRsZX0nLCBwbHVnaW4udGl0bGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgne2Zyb219Jywgc291cmNlR3JvdXBzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoJ3t0b30nLCBkZXN0aW5hdGlvbkdyb3VwcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyZXVyIGxvcnMgZGUgbGEgbWlzZSBcdTAwRTAgam91ciBkZXMgZ3JvdXBlczonLCBlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgTm90aWNlKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLnBsdWdpbnMuZ3JvdXBzLmVycm9yJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICB9KTtcblxuLy8gTm90ZSBkdSBwbHVnaW5cbiAgICAgICAgICAgICAgIG5ldyBTZXR0aW5nKG9wdGlvbnNDb250YWluZXIpXG4gICAgICAgICAgICAgICAgICAuc2V0TmFtZSh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5wbHVnaW5zLm9wdGlvbnMucmF0aW5nJykpXG4gICAgICAgICAgICAgICAgICAuYWRkU2xpZGVyKHNsaWRlciA9PiBzbGlkZXJcbiAgICAgICAgICAgICAgICAgICAgIC5zZXRMaW1pdHMoMSwgNSwgMSlcbiAgICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZShwbHVnaW4ucmF0aW5nKVxuICAgICAgICAgICAgICAgICAgICAgLnNldER5bmFtaWNUb29sdGlwKClcbiAgICAgICAgICAgICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MucGx1Z2luc1tpbmRleF0ucmF0aW5nID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBTZXR0aW5ncy5zYXZlU2V0dGluZ3ModGhpcy5zZXR0aW5ncyk7XG4gICAgICAgICAgICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgICAgIG5ldyBTZXR0aW5nKG9wdGlvbnNDb250YWluZXIpXG4gICAgICAgICAgICAgICAgICAuc2V0TmFtZSh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5wbHVnaW5zLm9wdGlvbnMudXJnZW5jeScpKVxuICAgICAgICAgICAgICAgICAgLmFkZFNsaWRlcihzbGlkZXIgPT4gc2xpZGVyXG4gICAgICAgICAgICAgICAgICAgICAuc2V0TGltaXRzKDEsIDMsIDEpXG4gICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUocGx1Z2luLnVyZ2VuY3kpXG4gICAgICAgICAgICAgICAgICAgICAuc2V0RHluYW1pY1Rvb2x0aXAoKVxuICAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5wbHVnaW5zW2luZGV4XS51cmdlbmN5ID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBTZXR0aW5ncy5zYXZlU2V0dGluZ3ModGhpcy5zZXR0aW5ncyk7XG4gICAgICAgICAgICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgICAgIG5ldyBTZXR0aW5nKG9wdGlvbnNDb250YWluZXIpXG4gICAgICAgICAgICAgICAgICAuc2V0TmFtZSh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5wbHVnaW5zLm9wdGlvbnMuaW1wb3J0YW5jZScpKVxuICAgICAgICAgICAgICAgICAgLmFkZFNsaWRlcihzbGlkZXIgPT4gc2xpZGVyXG4gICAgICAgICAgICAgICAgICAgICAuc2V0TGltaXRzKDEsIDMsIDEpXG4gICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUocGx1Z2luLmltcG9ydGFuY2UpXG4gICAgICAgICAgICAgICAgICAgICAuc2V0RHluYW1pY1Rvb2x0aXAoKVxuICAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5wbHVnaW5zW2luZGV4XS5pbXBvcnRhbmNlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBTZXR0aW5ncy5zYXZlU2V0dGluZ3ModGhpcy5zZXR0aW5ncyk7XG4gICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgIH0pO1xuICAgICAgfTtcblxuLy8gSW5pdGlhbGlzZXIgbCdhZmZpY2hhZ2UgZXQgbGEgcmVjaGVyY2hlXG4gICAgICBmaWx0ZXJBbmREaXNwbGF5UGx1Z2lucygpO1xuICAgICAgc2VhcmNoSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZSkgPT4ge1xuICAgICAgICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgIGZpbHRlckFuZERpc3BsYXlQbHVnaW5zKHRhcmdldC52YWx1ZSk7XG4gICAgICB9KTtcbiAgIH1cblxuICAgYXN5bmMgY29uZmlybURlbGV0ZShwbHVnaW5UaXRsZTogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgIGNvbnN0IG1vZGFsID0gbmV3IE1vZGFsKHRoaXMuYXBwKTtcbiAgICAgICAgIG1vZGFsLnRpdGxlRWwuc2V0VGV4dCh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5wbHVnaW5zLmRlbGV0ZS5jb25maXJtJykpO1xuXG4gICAgICAgICBtb2RhbC5jb250ZW50RWwuZW1wdHkoKTtcbiAgICAgICAgIG1vZGFsLmNvbnRlbnRFbC5jcmVhdGVFbChcInBcIiwgeyBcbiAgICAgICAgICAgIHRleHQ6IHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLnBsdWdpbnMuZGVsZXRlLmNvbmZpcm1NZXNzYWdlJykucmVwbGFjZSgne3RpdGxlfScsIHBsdWdpblRpdGxlKSBcbiAgICAgICAgIH0pO1xuXG4gICAgICAgICBuZXcgU2V0dGluZyhtb2RhbC5jb250ZW50RWwpXG4gICAgICAgICAgICAuYWRkQnV0dG9uKGJ0biA9PiBidG5cbiAgICAgICAgICAgICAgIC5zZXRCdXR0b25UZXh0KHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLnBsdWdpbnMuZGVsZXRlLmNhbmNlbCcpKVxuICAgICAgICAgICAgICAgLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgbW9kYWwuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICAuYWRkQnV0dG9uKGJ0biA9PiBidG5cbiAgICAgICAgICAgICAgIC5zZXRCdXR0b25UZXh0KHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLnBsdWdpbnMuZGVsZXRlLmNvbmZpcm0nKSlcbiAgICAgICAgICAgICAgIC5zZXRXYXJuaW5nKClcbiAgICAgICAgICAgICAgIC5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgIG1vZGFsLmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgIG1vZGFsLm9wZW4oKTtcbiAgICAgIH0pO1xuICAgfVxuXG4gICBhc3luYyBjcmVhdGVOZXdHcm91cCgpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgY29uc3QgbW9kYWwgPSBuZXcgTW9kYWwodGhpcy5hcHApO1xuICAgICAgICAgbW9kYWwudGl0bGVFbC5zZXRUZXh0KHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLnBsdWdpbnMuZ3JvdXAuYWRkJykpO1xuXG4gICAgICAgICBtb2RhbC5jb250ZW50RWwuZW1wdHkoKTtcbiAgICAgICAgIGNvbnN0IGlucHV0Q29udGFpbmVyID0gbW9kYWwuY29udGVudEVsLmNyZWF0ZURpdigpO1xuICAgICAgICAgY29uc3QgaW5wdXQgPSBuZXcgU2V0dGluZyhpbnB1dENvbnRhaW5lcilcbiAgICAgICAgICAgIC5zZXROYW1lKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLnBsdWdpbnMuZ3JvdXAubmFtZScpKVxuICAgICAgICAgICAgLmFkZFRleHQodGV4dCA9PiB0ZXh0XG4gICAgICAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MucGx1Z2lucy5ncm91cC5wbGFjZWhvbGRlcicpKVxuICAgICAgICAgICAgICAgLnNldFZhbHVlKFwiXCIpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICBuZXcgU2V0dGluZyhtb2RhbC5jb250ZW50RWwpXG4gICAgICAgICAgICAuYWRkQnV0dG9uKGJ0biA9PiBidG5cbiAgICAgICAgICAgICAgIC5zZXRCdXR0b25UZXh0KHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLnBsdWdpbnMuZ3JvdXAuY2FuY2VsJykpXG4gICAgICAgICAgICAgICAub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICBtb2RhbC5jbG9zZSgpO1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZShudWxsKTtcbiAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgLmFkZEJ1dHRvbihidG4gPT4gYnRuXG4gICAgICAgICAgICAgICAuc2V0QnV0dG9uVGV4dCh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5wbHVnaW5zLmdyb3VwLmNyZWF0ZScpKVxuICAgICAgICAgICAgICAgLnNldEN0YSgpXG4gICAgICAgICAgICAgICAub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGlucHV0LmNvbXBvbmVudHNbMF0uZ2V0VmFsdWUoKS50cmltKCk7XG4gICAgICAgICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgIG1vZGFsLmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICBuZXcgTm90aWNlKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLnBsdWdpbnMuZ3JvdXAuZXJyb3InKSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgIG1vZGFsLm9wZW4oKTtcbiAgICAgIH0pO1xuICAgfVxufSIsICJleHBvcnQgdHlwZSBUcmFuc2xhdGlvbktleSA9IFxyXG4gICAvLyBEYXNoYm9hcmRcclxuICAgfCAnZGFzaGJvYXJkLnRpdGxlJ1xyXG4gICB8ICdkYXNoYm9hcmQuZGVzY3JpcHRpb24nXHJcbiAgIHwgJ2Rhc2hib2FyZC52aWV3TW9kZSdcclxuICAgfCAnZGFzaGJvYXJkLnZpZXdNb2RlRGVzYydcclxuICAgfCAnZGFzaGJvYXJkLnZpZXdNb2RlVGFiJ1xyXG4gICB8ICdkYXNoYm9hcmQudmlld01vZGVTaWRlYmFyJ1xyXG4gICB8ICdkYXNoYm9hcmQudmlld01vZGVQb3B1cCdcclxuICAgLy8gTm90aWNlc1xyXG4gICB8ICdub3RpY2VzLnNhdmVkJ1xyXG4gICB8ICdub3RpY2VzLmVycm9yJ1xyXG4gICB8ICdub3RpY2VzLnN1Y2Nlc3MnXHJcbiAgIHwgJ25vdGljZXMuZmVhdHVyZUVuYWJsZWQnXHJcbiAgIHwgJ25vdGljZXMuZmVhdHVyZURpc2FibGVkJ1xyXG4gICAvLyBDb21tYW5kc1xyXG4gICB8ICdjb21tYW5kcy5vcGVuRGFzaGJvYXJkJ1xyXG4gICAvLyBFcnJvcnNcclxuICAgLy8gU2V0dGluZ3NcclxuICAgfCAnc2V0dGluZ3MuZGVmYXVsdFZpZXdNb2RlJ1xyXG4gICB8ICdzZXR0aW5ncy5kZWZhdWx0Vmlld01vZGVEZXNjJ1xyXG4gICB8ICdzZXR0aW5ncy50YWInXHJcbiAgIHwgJ3NldHRpbmdzLnNpZGViYXInXHJcbiAgIHwgJ3NldHRpbmdzLnBvcHVwJ1xyXG4gICB8ICdzZXR0aW5ncy5wbHVnaW5Gb2xkZXIubmFtZSdcclxuICAgfCAnc2V0dGluZ3MucGx1Z2luRm9sZGVyLmRlc2MnXHJcbiAgIHwgJ3NldHRpbmdzLnBsdWdpbkZvbGRlci51cGRhdGVkJ1xyXG4gICB8ICdzZXR0aW5ncy50ZW1wbGF0ZS5uYW1lJ1xyXG4gICB8ICdzZXR0aW5ncy50ZW1wbGF0ZS5kZXNjJ1xyXG4gICB8ICdzZXR0aW5ncy5ncm91cEZvbGRlci5uYW1lJ1xyXG4gICB8ICdzZXR0aW5ncy5ncm91cEZvbGRlci5kZXNjJ1xyXG4gICB8ICdzZXR0aW5ncy5ncm91cEZvbGRlci51cGRhdGVkJ1xyXG4gICB8ICdzZXR0aW5ncy5pbXBvcnRFeHBvcnQudGl0bGUnXHJcbiAgIHwgJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uSW1wb3J0Lm5hbWUnXHJcbiAgIHwgJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uSW1wb3J0LmRlc2MnXHJcbiAgIHwgJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uSW1wb3J0LmJ1dHRvbidcclxuICAgfCAnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25JbXBvcnQubG9hZGluZydcclxuICAgfCAnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25JbXBvcnQuc3VjY2VzcydcclxuICAgfCAnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25JbXBvcnQuZXJyb3InXHJcbiAgIHwgJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uRXhwb3J0Lm5hbWUnXHJcbiAgIHwgJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uRXhwb3J0LmRlc2MnXHJcbiAgIHwgJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uRXhwb3J0LmJ1dHRvbidcclxuICAgfCAnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25FeHBvcnQubG9hZGluZydcclxuICAgfCAnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25FeHBvcnQuc3VjY2VzcydcclxuICAgfCAnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25FeHBvcnQuZXJyb3InXHJcbiAgIHwgJ3NldHRpbmdzLmdyb3Vwcy50aXRsZSdcclxuICAgfCAnc2V0dGluZ3MuZ3JvdXBzLmRlbGV0ZS5idXR0b24nXHJcbiAgIHwgJ3NldHRpbmdzLmdyb3Vwcy5kZWxldGUuc3VjY2VzcydcclxuICAgfCAnc2V0dGluZ3MuZ3JvdXBzLmRlbGV0ZS5lcnJvcidcclxuICAgfCAnc2V0dGluZ3MuZ3JvdXBzLmFkZC5uYW1lJ1xyXG4gICB8ICdzZXR0aW5ncy5ncm91cHMuYWRkLmRlc2MnXHJcbiAgIHwgJ3NldHRpbmdzLmdyb3Vwcy5hZGQucGxhY2Vob2xkZXInXHJcbiAgIHwgJ3NldHRpbmdzLmdyb3Vwcy5hZGQuc3VjY2VzcydcclxuICAgfCAnc2V0dGluZ3MuZ3JvdXBzLmFkZC5lcnJvcidcclxuICAgfCAnc2V0dGluZ3MucGx1Z2lucy50aXRsZSdcclxuICAgfCAnc2V0dGluZ3MucGx1Z2lucy5zZWFyY2gucGxhY2Vob2xkZXInXHJcbiAgIHwgJ3NldHRpbmdzLnBsdWdpbnMub3B0aW9ucy5zdGF0dXMnXHJcbiAgIHwgJ3NldHRpbmdzLnBsdWdpbnMuc3RhdHVzLmV4cGxvcmluZydcclxuICAgfCAnc2V0dGluZ3MucGx1Z2lucy5zdGF0dXMuYWN0aXZlJ1xyXG4gICB8ICdzZXR0aW5ncy5wbHVnaW5zLnN0YXR1cy5pbmFjdGl2ZSdcclxuICAgfCAnc2V0dGluZ3MucGx1Z2lucy5vcHRpb25zLmdyb3VwcydcclxuICAgfCAnc2V0dGluZ3MucGx1Z2lucy5ncm91cHMubm9uZSdcclxuICAgfCAnc2V0dGluZ3MucGx1Z2lucy5ncm91cHMudXBkYXRlZCdcclxuICAgfCAnc2V0dGluZ3MucGx1Z2lucy5ncm91cHMuZXJyb3InXHJcbiAgIHwgJ3NldHRpbmdzLnBsdWdpbnMub3B0aW9ucy5yYXRpbmcnXHJcbiAgIHwgJ3NldHRpbmdzLnBsdWdpbnMub3B0aW9ucy51cmdlbmN5J1xyXG4gICB8ICdzZXR0aW5ncy5wbHVnaW5zLm9wdGlvbnMuaW1wb3J0YW5jZSdcclxuICAgfCAnc2V0dGluZ3MucGx1Z2lucy5kZWxldGUuYnV0dG9uJ1xyXG4gICB8ICdzZXR0aW5ncy5wbHVnaW5zLmRlbGV0ZS5jb25maXJtJ1xyXG4gICB8ICdzZXR0aW5ncy5wbHVnaW5zLmRlbGV0ZS5jb25maXJtTWVzc2FnZSdcclxuICAgfCAnc2V0dGluZ3MucGx1Z2lucy5kZWxldGUuY2FuY2VsJ1xyXG4gICB8ICdzZXR0aW5ncy5wbHVnaW5zLmRlbGV0ZWQnXHJcbiAgIHwgJ3NldHRpbmdzLnBsdWdpbnMuYWN0aXZhdGUudG9vbHRpcCdcclxuICAgfCAnc2V0dGluZ3MucGx1Z2lucy5kZWFjdGl2YXRlLnRvb2x0aXAnXHJcbiAgIHwgJ3NldHRpbmdzLnBsdWdpbnMudG9nZ2xlLnRvb2x0aXAnXHJcbiAgIHwgJ3NldHRpbmdzLnBsdWdpbnMuYWN0aXZhdGVkJ1xyXG4gICB8ICdzZXR0aW5ncy5wbHVnaW5zLmRlYWN0aXZhdGVkJ1xyXG4gICB8ICdzZXR0aW5ncy5wbHVnaW5zLmFkZC5uYW1lJ1xyXG4gICB8ICdzZXR0aW5ncy5wbHVnaW5zLmFkZC5kZXNjJ1xyXG4gICB8ICdzZXR0aW5ncy5wbHVnaW5zLmFkZC5wbGFjZWhvbGRlcidcclxuICAgfCAnc2V0dGluZ3MucGx1Z2lucy5hZGQuc3VjY2VzcydcclxuICAgfCAnc2V0dGluZ3MucGx1Z2lucy5hZGQuZXJyb3InXHJcbiAgIHwgJ3NldHRpbmdzLnBsdWdpbnMucmF0aW5nLnRvb2x0aXAnXHJcbiAgIHwgJ3NldHRpbmdzLnBsdWdpbnMudXJnZW5jeS50b29sdGlwJ1xyXG4gICB8ICdzZXR0aW5ncy5wbHVnaW5zLmltcG9ydGFuY2UudG9vbHRpcCdcclxuXHJcbmV4cG9ydCBjb25zdCB0cmFuc2xhdGlvbnM6IHsgW2xhbmc6IHN0cmluZ106IFJlY29yZDxUcmFuc2xhdGlvbktleSwgc3RyaW5nPiB9ID0ge1xyXG4gICBlbjoge1xyXG4gICAgICAvLyBEYXNoYm9hcmRcclxuICAgICAgJ2Rhc2hib2FyZC50aXRsZSc6ICdQbHVnaW5GbG93eicsXHJcbiAgICAgICdkYXNoYm9hcmQuZGVzY3JpcHRpb24nOiAnUGx1Z2luRmxvd3ogaXMgYSBwbHVnaW4gZm9yIE9ic2lkaWFuIHRoYXQgYWxsb3dzIHlvdSB0byBtYW5hZ2UgeW91ciB2aWRlb3MuJyxcclxuICAgICAgJ2Rhc2hib2FyZC52aWV3TW9kZSc6ICdWaWV3IE1vZGUnLFxyXG4gICAgICAnZGFzaGJvYXJkLnZpZXdNb2RlRGVzYyc6ICdDaG9vc2UgaG93IHZpZGVvcyB3aWxsIG9wZW4gYnkgZGVmYXVsdCcsXHJcbiAgICAgICdkYXNoYm9hcmQudmlld01vZGVUYWInOiAnVGFiJyxcclxuICAgICAgJ2Rhc2hib2FyZC52aWV3TW9kZVNpZGViYXInOiAnU2lkZWJhcicsXHJcbiAgICAgICdkYXNoYm9hcmQudmlld01vZGVQb3B1cCc6ICdQb3B1cCcsXHJcbiAgICAgIC8vIE5vdGljZXNcclxuICAgICAgJ25vdGljZXMuc2F2ZWQnOiAnXHUyNzA1IFNldHRpbmdzIHNhdmVkJyxcclxuICAgICAgJ25vdGljZXMuZXJyb3InOiAnXHUyNzRDIEVycm9yOiB7bWVzc2FnZX0nLFxyXG4gICAgICAnbm90aWNlcy5zdWNjZXNzJzogJ1x1MjcwNSBPcGVyYXRpb24gc3VjY2Vzc2Z1bCcsXHJcbiAgICAgICdub3RpY2VzLmZlYXR1cmVFbmFibGVkJzogJ1x1MjcwNSBGZWF0dXJlIGVuYWJsZWQnLFxyXG4gICAgICAnbm90aWNlcy5mZWF0dXJlRGlzYWJsZWQnOiAnXHUyNzRDIEZlYXR1cmUgZGlzYWJsZWQnLFxyXG4gICAgICAvLyBDb21tYW5kc1xyXG4gICAgICAnY29tbWFuZHMub3BlbkRhc2hib2FyZCc6ICdPcGVuIERhc2hib2FyZCcsXHJcbiAgICAgIC8vIEVycm9yc1xyXG4gICAgICAvLyBTZXR0aW5nc1xyXG4gICAgICAnc2V0dGluZ3MuZGVmYXVsdFZpZXdNb2RlJzogJ0RlZmF1bHQgVmlldyBNb2RlJyxcclxuICAgICAgJ3NldHRpbmdzLmRlZmF1bHRWaWV3TW9kZURlc2MnOiAnQ2hvb3NlIGhvdyB0aGUgcGx1Z2luIGRhc2hib2FyZCB3aWxsIG9wZW4gYnkgZGVmYXVsdCcsXHJcbiAgICAgICdzZXR0aW5ncy50YWInOiAnVGFiJyxcclxuICAgICAgJ3NldHRpbmdzLnNpZGViYXInOiAnU2lkZWJhcicsXHJcbiAgICAgICdzZXR0aW5ncy5wb3B1cCc6ICdQb3B1cCcsXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5Gb2xkZXIubmFtZSc6ICdQbHVnaW4gTm90ZXMgRm9sZGVyJyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbkZvbGRlci5kZXNjJzogJ1doZXJlIHRvIHN0b3JlIHBsdWdpbiBub3RlcycsXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5Gb2xkZXIudXBkYXRlZCc6ICdQbHVnaW4gZm9sZGVyIHVwZGF0ZWQnLFxyXG4gICAgICAnc2V0dGluZ3MudGVtcGxhdGUubmFtZSc6ICdOb3RlIFRlbXBsYXRlJyxcclxuICAgICAgJ3NldHRpbmdzLnRlbXBsYXRlLmRlc2MnOiAnVGVtcGxhdGUgZm9yIHBsdWdpbiBub3RlcyAodXNlIHt7bmFtZX19LCB7e2Rlc2NyaXB0aW9ufX0sIHt7dXJsfX0pJyxcclxuICAgICAgJ3NldHRpbmdzLmdyb3VwRm9sZGVyLm5hbWUnOiAnR3JvdXAgRm9sZGVyJyxcclxuICAgICAgJ3NldHRpbmdzLmdyb3VwRm9sZGVyLmRlc2MnOiAnV2hlcmUgdG8gc3RvcmUgcGx1Z2luIGdyb3VwcycsXHJcbiAgICAgICdzZXR0aW5ncy5ncm91cEZvbGRlci51cGRhdGVkJzogJ0dyb3VwIGZvbGRlciB1cGRhdGVkJyxcclxuICAgICAgLy8gSW1wb3J0L0V4cG9ydFxyXG4gICAgICAnc2V0dGluZ3MuaW1wb3J0RXhwb3J0LnRpdGxlJzogJ0ltcG9ydC9FeHBvcnQnLFxyXG4gICAgICAnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25JbXBvcnQubmFtZSc6ICdJbXBvcnQgQ29uZmlndXJhdGlvbicsXHJcbiAgICAgICdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkltcG9ydC5kZXNjJzogJ0ltcG9ydCBwbHVnaW4gY29uZmlndXJhdGlvbiBmcm9tIEpTT04gZmlsZScsXHJcbiAgICAgICdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkltcG9ydC5idXR0b24nOiAnSW1wb3J0IEpTT04nLFxyXG4gICAgICAnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25JbXBvcnQubG9hZGluZyc6ICdJbXBvcnRpbmcgY29uZmlndXJhdGlvbi4uLicsXHJcbiAgICAgICdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkltcG9ydC5zdWNjZXNzJzogJ0NvbmZpZ3VyYXRpb24gaW1wb3J0ZWQgc3VjY2Vzc2Z1bGx5JyxcclxuICAgICAgJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uSW1wb3J0LmVycm9yJzogJ0Vycm9yIGltcG9ydGluZyBjb25maWd1cmF0aW9uJyxcclxuICAgICAgJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uRXhwb3J0Lm5hbWUnOiAnRXhwb3J0IENvbmZpZ3VyYXRpb24nLFxyXG4gICAgICAnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25FeHBvcnQuZGVzYyc6ICdFeHBvcnQgcGx1Z2luIGNvbmZpZ3VyYXRpb24gdG8gSlNPTiBmaWxlJyxcclxuICAgICAgJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uRXhwb3J0LmJ1dHRvbic6ICdFeHBvcnQgSlNPTicsXHJcbiAgICAgICdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkV4cG9ydC5sb2FkaW5nJzogJ0V4cG9ydGluZyBjb25maWd1cmF0aW9uLi4uJyxcclxuICAgICAgJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uRXhwb3J0LnN1Y2Nlc3MnOiAnQ29uZmlndXJhdGlvbiBleHBvcnRlZCBzdWNjZXNzZnVsbHknLFxyXG4gICAgICAnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25FeHBvcnQuZXJyb3InOiAnRXJyb3IgZXhwb3J0aW5nIGNvbmZpZ3VyYXRpb24nLFxyXG4gICAgICAvLyBHcm91cHMgTWFuYWdlbWVudFxyXG4gICAgICAnc2V0dGluZ3MuZ3JvdXBzLnRpdGxlJzogJ0dyb3VwcyBNYW5hZ2VtZW50JyxcclxuICAgICAgJ3NldHRpbmdzLmdyb3Vwcy5kZWxldGUuYnV0dG9uJzogJ0RlbGV0ZScsXHJcbiAgICAgICdzZXR0aW5ncy5ncm91cHMuZGVsZXRlLnN1Y2Nlc3MnOiAnR3JvdXAgZGVsZXRlZCcsXHJcbiAgICAgICdzZXR0aW5ncy5ncm91cHMuZGVsZXRlLmVycm9yJzogJ0Vycm9yIGRlbGV0aW5nIGdyb3VwJyxcclxuICAgICAgJ3NldHRpbmdzLmdyb3Vwcy5hZGQubmFtZSc6ICdBZGQgTmV3IEdyb3VwJyxcclxuICAgICAgJ3NldHRpbmdzLmdyb3Vwcy5hZGQuZGVzYyc6ICdDcmVhdGUgYSBuZXcgZ3JvdXAgZm9yIG9yZ2FuaXppbmcgcGx1Z2lucycsXHJcbiAgICAgICdzZXR0aW5ncy5ncm91cHMuYWRkLnBsYWNlaG9sZGVyJzogJ0dyb3VwIG5hbWUnLFxyXG4gICAgICAnc2V0dGluZ3MuZ3JvdXBzLmFkZC5zdWNjZXNzJzogJ0dyb3VwIGNyZWF0ZWQnLFxyXG4gICAgICAnc2V0dGluZ3MuZ3JvdXBzLmFkZC5lcnJvcic6ICdFcnJvciBjcmVhdGluZyBncm91cCcsXHJcbiAgICAgIC8vIFBsdWdpbnMgTWFuYWdlbWVudFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy50aXRsZSc6ICdQbHVnaW5zIE1hbmFnZW1lbnQnLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5zZWFyY2gucGxhY2Vob2xkZXInOiAnU2VhcmNoIHBsdWdpbnMuLi4nLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5vcHRpb25zLnN0YXR1cyc6ICdTdGF0dXMnLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5zdGF0dXMuZXhwbG9yaW5nJzogJ0V4cGxvcmluZycsXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLnN0YXR1cy5hY3RpdmUnOiAnQWN0aXZlJyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuc3RhdHVzLmluYWN0aXZlJzogJ0luYWN0aXZlJyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMub3B0aW9ucy5ncm91cHMnOiAnR3JvdXBzJyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuZ3JvdXBzLm5vbmUnOiAnTm8gZ3JvdXAnLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5ncm91cHMudXBkYXRlZCc6ICdQbHVnaW4ge3RpdGxlfSBncm91cHMgdXBkYXRlZCBmcm9tIHtmcm9tfSB0byB7dG99JyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuZ3JvdXBzLmVycm9yJzogJ0Vycm9yIHVwZGF0aW5nIGdyb3VwcycsXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLm9wdGlvbnMucmF0aW5nJzogJ1JhdGluZycsXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLm9wdGlvbnMudXJnZW5jeSc6ICdVcmdlbmN5JyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMub3B0aW9ucy5pbXBvcnRhbmNlJzogJ0ltcG9ydGFuY2UnLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5kZWxldGUuYnV0dG9uJzogJ0RlbGV0ZSBQbHVnaW4nLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5kZWxldGUuY29uZmlybSc6ICdEZWxldGUgUGx1Z2luJyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuZGVsZXRlLmNvbmZpcm1NZXNzYWdlJzogJ0FyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUge3RpdGxlfT8nLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5kZWxldGUuY2FuY2VsJzogJ0NhbmNlbCcsXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLmRlbGV0ZWQnOiAnUGx1Z2luIHt0aXRsZX0gZGVsZXRlZCcsXHJcbiAgICAgIC8vIFBsdWdpbiBBY3Rpb25zICYgVG9vbHRpcHNcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuYWN0aXZhdGUudG9vbHRpcCc6ICdBY3RpdmF0ZSBwbHVnaW4nLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5kZWFjdGl2YXRlLnRvb2x0aXAnOiAnRGVhY3RpdmF0ZSBwbHVnaW4nLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy50b2dnbGUudG9vbHRpcCc6ICdTaG93L0hpZGUgb3B0aW9ucycsXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLmFjdGl2YXRlZCc6ICdQbHVnaW4ge3RpdGxlfSBhY3RpdmF0ZWQnLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5kZWFjdGl2YXRlZCc6ICdQbHVnaW4ge3RpdGxlfSBkZWFjdGl2YXRlZCcsXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLmFkZC5uYW1lJzogJ0FkZCBQbHVnaW4nLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5hZGQuZGVzYyc6ICdBZGQgYSBuZXcgcGx1Z2luIHRvIG1hbmFnZScsXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLmFkZC5wbGFjZWhvbGRlcic6ICdQbHVnaW4gbmFtZScsXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLmFkZC5zdWNjZXNzJzogJ1BsdWdpbiBhZGRlZCBzdWNjZXNzZnVsbHknLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5hZGQuZXJyb3InOiAnRXJyb3IgYWRkaW5nIHBsdWdpbicsXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLnJhdGluZy50b29sdGlwJzogJ1JhdGUgZnJvbSAxIHRvIDUnLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy51cmdlbmN5LnRvb2x0aXAnOiAnU2V0IHVyZ2VuY3kgKDE6IExvdywgMjogTWVkaXVtLCAzOiBIaWdoKScsXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLmltcG9ydGFuY2UudG9vbHRpcCc6ICdTZXQgaW1wb3J0YW5jZSAoMTogTG93LCAyOiBNZWRpdW0sIDM6IEhpZ2gpJyxcclxuICAgfSxcclxuICAgZnI6IHtcclxuICAgICAgLy8gRGFzaGJvYXJkXHJcbiAgICAgICdkYXNoYm9hcmQudGl0bGUnOiAnUGx1Z2luRmxvd3onLFxyXG4gICAgICAnZGFzaGJvYXJkLmRlc2NyaXB0aW9uJzogJ1BsdWdpbkZsb3d6IGVzdCB1biBwbHVnaW4gcG91ciBPYnNpZGlhbiBxdWkgdm91cyBwZXJtZXQgZGUgZ1x1MDBFOXJlciB2b3MgdmlkXHUwMEU5b3MuJyxcclxuICAgICAgJ2Rhc2hib2FyZC52aWV3TW9kZSc6ICdNb2RlIGRcXCdhZmZpY2hhZ2UnLFxyXG4gICAgICAnZGFzaGJvYXJkLnZpZXdNb2RlRGVzYyc6ICdDaG9pc2lzc2V6IGNvbW1lbnQgbGVzIHZpZFx1MDBFOW9zIHNcXCdvdXZyaXJvbnQgcGFyIGRcdTAwRTlmYXV0JyxcclxuICAgICAgJ2Rhc2hib2FyZC52aWV3TW9kZVRhYic6ICdPbmdsZXQnLFxyXG4gICAgICAnZGFzaGJvYXJkLnZpZXdNb2RlU2lkZWJhcic6ICdCYXJyZSBsYXRcdTAwRTlyYWxlJyxcclxuICAgICAgJ2Rhc2hib2FyZC52aWV3TW9kZVBvcHVwJzogJ0Zlblx1MDBFQXRyZSBjb250ZXh0dWVsbGUnLFxyXG4gICAgICAvLyBOb3RpY2VzXHJcbiAgICAgICdub3RpY2VzLnNhdmVkJzogJ1x1MjcwNSBQYXJhbVx1MDBFOHRyZXMgc2F1dmVnYXJkXHUwMEU5cycsXHJcbiAgICAgICdub3RpY2VzLmVycm9yJzogJ1x1Mjc0QyBFcnJldXI6IHttZXNzYWdlfScsXHJcbiAgICAgICdub3RpY2VzLnN1Y2Nlc3MnOiAnXHUyNzA1IE9wXHUwMEU5cmF0aW9uIHJcdTAwRTl1c3NpZScsXHJcbiAgICAgICdub3RpY2VzLmZlYXR1cmVFbmFibGVkJzogJ1x1MjcwNSBGb25jdGlvbm5hbGl0XHUwMEU5IGFjdGl2XHUwMEU5ZScsXHJcbiAgICAgICdub3RpY2VzLmZlYXR1cmVEaXNhYmxlZCc6ICdcdTI3NEMgRm9uY3Rpb25uYWxpdFx1MDBFOSBkXHUwMEU5c2FjdGl2XHUwMEU5ZScsXHJcbiAgICAgIC8vIENvbW1hbmRzXHJcbiAgICAgICdjb21tYW5kcy5vcGVuRGFzaGJvYXJkJzogJ091dnJpciBsZSB0YWJsZWF1IGRlIGJvcmQnLFxyXG4gICAgICAvLyBFcnJvcnNcclxuICAgICAgLy8gU2V0dGluZ3NcclxuICAgICAgJ3NldHRpbmdzLmRlZmF1bHRWaWV3TW9kZSc6ICdNb2RlIGRcXCdhZmZpY2hhZ2UgcGFyIGRcdTAwRTlmYXV0JyxcclxuICAgICAgJ3NldHRpbmdzLmRlZmF1bHRWaWV3TW9kZURlc2MnOiAnQ2hvaXNpc3NleiBjb21tZW50IGxlIHRhYmxlYXUgZGUgYm9yZCBzXFwnb3V2cmlyYSBwYXIgZFx1MDBFOWZhdXQnLFxyXG4gICAgICAnc2V0dGluZ3MudGFiJzogJ09uZ2xldCcsXHJcbiAgICAgICdzZXR0aW5ncy5zaWRlYmFyJzogJ0JhcnJlIGxhdFx1MDBFOXJhbGUnLFxyXG4gICAgICAnc2V0dGluZ3MucG9wdXAnOiAnRmVuXHUwMEVBdHJlIG1vZGFsZScsXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5Gb2xkZXIubmFtZSc6ICdEb3NzaWVyIGRlcyBub3RlcyBkZSBwbHVnaW5zJyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbkZvbGRlci5kZXNjJzogJ09cdTAwRjkgc3RvY2tlciBsZXMgbm90ZXMgZGVzIHBsdWdpbnMnLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2luRm9sZGVyLnVwZGF0ZWQnOiAnRG9zc2llciBkZXMgcGx1Z2lucyBtaXMgXHUwMEUwIGpvdXInLFxyXG4gICAgICAnc2V0dGluZ3MudGVtcGxhdGUubmFtZSc6ICdUZW1wbGF0ZSBkZXMgbm90ZXMnLFxyXG4gICAgICAnc2V0dGluZ3MudGVtcGxhdGUuZGVzYyc6ICdUZW1wbGF0ZSBwb3VyIGxlcyBub3RlcyBkZSBwbHVnaW5zICh1dGlsaXNlIHt7bmFtZX19LCB7e2Rlc2NyaXB0aW9ufX0sIHt7dXJsfX0pJyxcclxuICAgICAgJ3NldHRpbmdzLmdyb3VwRm9sZGVyLm5hbWUnOiAnRG9zc2llciBkZXMgZ3JvdXBlcycsXHJcbiAgICAgICdzZXR0aW5ncy5ncm91cEZvbGRlci5kZXNjJzogJ09cdTAwRjkgc3RvY2tlciBsZXMgZ3JvdXBlcyBkZSBwbHVnaW5zJyxcclxuICAgICAgJ3NldHRpbmdzLmdyb3VwRm9sZGVyLnVwZGF0ZWQnOiAnRG9zc2llciBkZXMgZ3JvdXBlcyBtaXMgXHUwMEUwIGpvdXInLFxyXG4gICAgICAvLyBJbXBvcnQvRXhwb3J0XHJcbiAgICAgICdzZXR0aW5ncy5pbXBvcnRFeHBvcnQudGl0bGUnOiAnSW1wb3J0L0V4cG9ydCcsXHJcbiAgICAgICdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkltcG9ydC5uYW1lJzogJ0ltcG9ydGVyIGxhIGNvbmZpZ3VyYXRpb24nLFxyXG4gICAgICAnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25JbXBvcnQuZGVzYyc6ICdJbXBvcnRlciBsYSBjb25maWd1cmF0aW9uIGRlcHVpcyB1biBmaWNoaWVyIEpTT04nLFxyXG4gICAgICAnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25JbXBvcnQuYnV0dG9uJzogJ0ltcG9ydGVyIEpTT04nLFxyXG4gICAgICAnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25JbXBvcnQubG9hZGluZyc6ICdJbXBvcnRhdGlvbiBlbiBjb3Vycy4uLicsXHJcbiAgICAgICdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkltcG9ydC5zdWNjZXNzJzogJ0NvbmZpZ3VyYXRpb24gaW1wb3J0XHUwMEU5ZSBhdmVjIHN1Y2NcdTAwRThzJyxcclxuICAgICAgJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uSW1wb3J0LmVycm9yJzogJ0VycmV1ciBsb3JzIGRlIGxcXCdpbXBvcnRhdGlvbicsXHJcbiAgICAgICdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkV4cG9ydC5uYW1lJzogJ0V4cG9ydGVyIGxhIGNvbmZpZ3VyYXRpb24nLFxyXG4gICAgICAnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25FeHBvcnQuZGVzYyc6ICdFeHBvcnRlciBsYSBjb25maWd1cmF0aW9uIHZlcnMgdW4gZmljaGllciBKU09OJyxcclxuICAgICAgJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uRXhwb3J0LmJ1dHRvbic6ICdFeHBvcnRlciBKU09OJyxcclxuICAgICAgJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uRXhwb3J0LmxvYWRpbmcnOiAnRXhwb3J0YXRpb24gZW4gY291cnMuLi4nLFxyXG4gICAgICAnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25FeHBvcnQuc3VjY2Vzcyc6ICdDb25maWd1cmF0aW9uIGV4cG9ydFx1MDBFOWUgYXZlYyBzdWNjXHUwMEU4cycsXHJcbiAgICAgICdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkV4cG9ydC5lcnJvcic6ICdFcnJldXIgbG9ycyBkZSBsXFwnZXhwb3J0YXRpb24nLFxyXG4gICAgICAvLyBHcm91cHMgTWFuYWdlbWVudFxyXG4gICAgICAnc2V0dGluZ3MuZ3JvdXBzLnRpdGxlJzogJ0dlc3Rpb24gZGVzIGdyb3VwZXMnLFxyXG4gICAgICAnc2V0dGluZ3MuZ3JvdXBzLmRlbGV0ZS5idXR0b24nOiAnU3VwcHJpbWVyJyxcclxuICAgICAgJ3NldHRpbmdzLmdyb3Vwcy5kZWxldGUuc3VjY2Vzcyc6ICdHcm91cGUgc3VwcHJpbVx1MDBFOScsXHJcbiAgICAgICdzZXR0aW5ncy5ncm91cHMuZGVsZXRlLmVycm9yJzogJ0VycmV1ciBsb3JzIGRlIGxhIHN1cHByZXNzaW9uJyxcclxuICAgICAgJ3NldHRpbmdzLmdyb3Vwcy5hZGQubmFtZSc6ICdBam91dGVyIHVuIGdyb3VwZScsXHJcbiAgICAgICdzZXR0aW5ncy5ncm91cHMuYWRkLmRlc2MnOiAnQ3JcdTAwRTllciB1biBub3V2ZWF1IGdyb3VwZSBwb3VyIG9yZ2FuaXNlciBsZXMgcGx1Z2lucycsXHJcbiAgICAgICdzZXR0aW5ncy5ncm91cHMuYWRkLnBsYWNlaG9sZGVyJzogJ05vbSBkdSBncm91cGUnLFxyXG4gICAgICAnc2V0dGluZ3MuZ3JvdXBzLmFkZC5zdWNjZXNzJzogJ0dyb3VwZSBjclx1MDBFOVx1MDBFOScsXHJcbiAgICAgICdzZXR0aW5ncy5ncm91cHMuYWRkLmVycm9yJzogJ0VycmV1ciBsb3JzIGRlIGxhIGNyXHUwMEU5YXRpb24nLFxyXG4gICAgICAvLyBQbHVnaW5zIE1hbmFnZW1lbnRcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMudGl0bGUnOiAnR2VzdGlvbiBkZXMgcGx1Z2lucycsXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLnNlYXJjaC5wbGFjZWhvbGRlcic6ICdSZWNoZXJjaGVyIGRlcyBwbHVnaW5zLi4uJyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMub3B0aW9ucy5zdGF0dXMnOiAnU3RhdHV0JyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuc3RhdHVzLmV4cGxvcmluZyc6ICdFbiBleHBsb3JhdGlvbicsXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLnN0YXR1cy5hY3RpdmUnOiAnQWN0aWYnLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5zdGF0dXMuaW5hY3RpdmUnOiAnSW5hY3RpZicsXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLm9wdGlvbnMuZ3JvdXBzJzogJ0dyb3VwZXMnLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5ncm91cHMubm9uZSc6ICdTYW5zIGdyb3VwZScsXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLmdyb3Vwcy51cGRhdGVkJzogJ0dyb3VwZXMgZHUgcGx1Z2luIHt0aXRsZX0gbWlzIFx1MDBFMCBqb3VyIGRlIHtmcm9tfSB2ZXJzIHt0b30nLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5ncm91cHMuZXJyb3InOiAnRXJyZXVyIGxvcnMgZGUgbGEgbWlzZSBcdTAwRTAgam91ciBkZXMgZ3JvdXBlcycsXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLm9wdGlvbnMucmF0aW5nJzogJ05vdGUnLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5vcHRpb25zLnVyZ2VuY3knOiAnVXJnZW5jZScsXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLm9wdGlvbnMuaW1wb3J0YW5jZSc6ICdJbXBvcnRhbmNlJyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuZGVsZXRlLmJ1dHRvbic6ICdTdXBwcmltZXIgbGUgcGx1Z2luJyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuZGVsZXRlLmNvbmZpcm0nOiAnU3VwcHJpbWVyIGxlIHBsdWdpbicsXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLmRlbGV0ZS5jb25maXJtTWVzc2FnZSc6ICdcdTAwQ0F0ZXMtdm91cyBzXHUwMEZCciBkZSB2b3Vsb2lyIHN1cHByaW1lciB7dGl0bGV9ID8nLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5kZWxldGUuY2FuY2VsJzogJ0FubnVsZXInLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5kZWxldGVkJzogJ1BsdWdpbiB7dGl0bGV9IHN1cHByaW1cdTAwRTknLFxyXG4gICAgICAvLyBQbHVnaW4gQWN0aW9ucyAmIFRvb2x0aXBzXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLmFjdGl2YXRlLnRvb2x0aXAnOiAnQWN0aXZlciBsZSBwbHVnaW4nLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5kZWFjdGl2YXRlLnRvb2x0aXAnOiAnRFx1MDBFOXNhY3RpdmVyIGxlIHBsdWdpbicsXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLnRvZ2dsZS50b29sdGlwJzogJ0FmZmljaGVyL01hc3F1ZXIgbGVzIG9wdGlvbnMnLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5hY3RpdmF0ZWQnOiAnUGx1Z2luIHt0aXRsZX0gYWN0aXZcdTAwRTknLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5kZWFjdGl2YXRlZCc6ICdQbHVnaW4ge3RpdGxlfSBkXHUwMEU5c2FjdGl2XHUwMEU5JyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuYWRkLm5hbWUnOiAnQWpvdXRlciB1biBwbHVnaW4nLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5hZGQuZGVzYyc6ICdBam91dGVyIHVuIG5vdXZlYXUgcGx1Z2luIFx1MDBFMCBnXHUwMEU5cmVyJyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuYWRkLnBsYWNlaG9sZGVyJzogJ05vbSBkdSBwbHVnaW4nLFxyXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5hZGQuc3VjY2Vzcyc6ICdQbHVnaW4gYWpvdXRcdTAwRTkgYXZlYyBzdWNjXHUwMEU4cycsXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLmFkZC5lcnJvcic6ICdFcnJldXIgbG9ycyBkZSBsXFwnYWpvdXQgZHUgcGx1Z2luJyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMucmF0aW5nLnRvb2x0aXAnOiAnTm90ZXIgZGUgMSBcdTAwRTAgNScsXHJcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLnVyZ2VuY3kudG9vbHRpcCc6ICdEXHUwMEU5ZmluaXIgbFxcJ3VyZ2VuY2UgKDE6IEZhaWJsZSwgMjogTW95ZW5uZSwgMzogSGF1dGUpJyxcclxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuaW1wb3J0YW5jZS50b29sdGlwJzogJ0RcdTAwRTlmaW5pciBsXFwnaW1wb3J0YW5jZSAoMTogRmFpYmxlLCAyOiBNb3llbm5lLCAzOiBIYXV0ZSknLFxyXG4gICB9XHJcbn07XHJcblxyXG5leHBvcnQgY2xhc3MgVHJhbnNsYXRpb25zIHtcclxuICAgcHJpdmF0ZSBjdXJyZW50TGFuZzogc3RyaW5nO1xyXG5cclxuICAgY29uc3RydWN0b3IoaW5pdGlhbExhbmc6IHN0cmluZyA9ICdmcicpIHtcclxuICAgICAgdGhpcy5jdXJyZW50TGFuZyA9IGluaXRpYWxMYW5nO1xyXG4gICB9XHJcblxyXG4gICBzZXRMYW5ndWFnZShsYW5nOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgdGhpcy5jdXJyZW50TGFuZyA9IGxhbmc7XHJcbiAgIH1cclxuXHJcbiAgIHQoa2V5OiBUcmFuc2xhdGlvbktleSk6IHN0cmluZyB7XHJcbiAgICAgIHJldHVybiB0cmFuc2xhdGlvbnNbdGhpcy5jdXJyZW50TGFuZ10/LltrZXldIHx8IHRyYW5zbGF0aW9uc1snZW4nXVtrZXldIHx8IGtleTtcclxuICAgfVxyXG59XHJcbiIsICJpbXBvcnQgeyBQbHVnaW4sIE5vdGljZSB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB7IFNldHRpbmdzIH0gZnJvbSAnLi9TZXR0aW5ncyc7XG5pbXBvcnQgeyBUcmFuc2xhdGlvbnMgfSBmcm9tICcuL1RyYW5zbGF0aW9ucyc7XG5pbXBvcnQgeyBWaWV3TW9kZSB9IGZyb20gJy4vVmlld01vZGUnO1xuXG5leHBvcnQgY2xhc3MgSG90a2V5cyB7XG4gICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgcGx1Z2luOiBQbHVnaW4sXG4gICAgICBwcml2YXRlIHNldHRpbmdzOiBTZXR0aW5ncyxcbiAgICAgIHByaXZhdGUgdHJhbnNsYXRpb25zOiBUcmFuc2xhdGlvbnMsXG4gICAgICBwcml2YXRlIHZpZXdNb2RlOiBWaWV3TW9kZVxuICAgKSB7fVxuXG4gICByZWdpc3RlckhvdGtleXMoKSB7XG4gICAgICAvLyBPdXZyaXIgbGUgZGFzaGJvYXJkXG4gICAgICB0aGlzLnBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICAgICAgIGlkOiAnb3Blbi1wbHVnaW5zLWRhc2hib2FyZCcsXG4gICAgICAgICBuYW1lOiB0aGlzLnRyYW5zbGF0aW9ucy50KCdjb21tYW5kcy5vcGVuRGFzaGJvYXJkJyksXG4gICAgICAgICBpY29uOiAnbGF5b3V0LWdyaWQnLFxuICAgICAgICAgY2FsbGJhY2s6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICBjb25zdCBtb2RlID0gYXdhaXQgU2V0dGluZ3MuZ2V0Vmlld01vZGUoKTtcbiAgICAgICAgICAgICAgIGF3YWl0IHRoaXMudmlld01vZGUuc2V0Vmlldyhtb2RlKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdbSG90a2V5c10nLCBlcnJvcik7XG4gICAgICAgICAgICAgICBuZXcgTm90aWNlKHRoaXMudHJhbnNsYXRpb25zLnQoJ2Vycm9ycy5vcGVuRGFzaGJvYXJkJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgfSxcbiAgICAgICAgIGhvdGtleXM6IFt7IG1vZGlmaWVyczogWydBbHQnXSwga2V5OiAnUCcgfV1cbiAgICAgIH0pO1xuICAgfVxufVxuIiwgImltcG9ydCB7IEl0ZW1WaWV3LCBXb3Jrc3BhY2VMZWFmIH0gZnJvbSAnb2JzaWRpYW4nO1xyXG5pbXBvcnQgeyBUVmlld01vZGUgfSBmcm9tICcuL3R5cGVzJztcclxuaW1wb3J0IHsgU2V0dGluZ3MgfSBmcm9tICcuL1NldHRpbmdzJztcclxuaW1wb3J0IHsgVHJhbnNsYXRpb25zIH0gZnJvbSAnLi9UcmFuc2xhdGlvbnMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIERhc2hib2FyZCBleHRlbmRzIEl0ZW1WaWV3IHtcclxuICAgIHByaXZhdGUgdHJhbnNsYXRpb25zOiBUcmFuc2xhdGlvbnM7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgbGVhZjogV29ya3NwYWNlTGVhZixcclxuICAgICAgICBwcml2YXRlIHNldHRpbmdzOiBTZXR0aW5ncyxcclxuICAgICAgICB0cmFuc2xhdGlvbnM6IFRyYW5zbGF0aW9uc1xyXG4gICAgKSB7XHJcbiAgICAgICAgc3VwZXIobGVhZik7XHJcbiAgICAgICAgdGhpcy50cmFuc2xhdGlvbnMgPSB0cmFuc2xhdGlvbnM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Vmlld1R5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gJ3BsdWdpbmZsb3d6LXZpZXcnO1xyXG4gICAgfVxyXG5cclxuICAgIGdldERpc3BsYXlUZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudHJhbnNsYXRpb25zLnQoJ2Rhc2hib2FyZC50aXRsZScpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIG9uT3BlbigpIHtcclxuICAgICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLmNvbnRhaW5lckVsLmNoaWxkcmVuWzFdIGFzIEhUTUxFbGVtZW50O1xyXG4gICAgICAgIGNvbnRhaW5lci5lbXB0eSgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGF3YWl0IHRoaXMucmVuZGVyRGFzaGJvYXJkKGNvbnRhaW5lcik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhc3luYyByZW5kZXJEYXNoYm9hcmQoY29udGFpbmVyOiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgIGNvbnN0IGRhc2hib2FyZENvbnRhaW5lciA9IGNvbnRhaW5lci5jcmVhdGVEaXYoJ2Rhc2hib2FyZC1jb250YWluZXInKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBFbi10XHUwMEVBdGUgYXZlYyBsZSB0aXRyZVxyXG4gICAgICAgIGRhc2hib2FyZENvbnRhaW5lci5jcmVhdGVFbCgnaDInLCB7IFxyXG4gICAgICAgICAgICB0ZXh0OiB0aGlzLnRyYW5zbGF0aW9ucy50KCdkYXNoYm9hcmQuaW5zdGFsbGVkUGx1Z2lucycpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gTGlzdGUgZGVzIHBsdWdpbnNcclxuICAgICAgICBjb25zdCBwbHVnaW5zTGlzdCA9IGRhc2hib2FyZENvbnRhaW5lci5jcmVhdGVEaXYoJ3BsdWdpbnMtbGlzdCcpO1xyXG4gICAgICAgIGF3YWl0IHRoaXMucmVuZGVyUGx1Z2luc0xpc3QocGx1Z2luc0xpc3QpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYXN5bmMgcmVuZGVyUGx1Z2luc0xpc3QoY29udGFpbmVyOiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgIGNvbnN0IGluc3RhbGxlZFBsdWdpbnMgPSBBcnJheS5mcm9tKHRoaXMuYXBwLnBsdWdpbnMuZW5hYmxlZFBsdWdpbnMpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGluc3RhbGxlZFBsdWdpbnMuZm9yRWFjaChwbHVnaW5JZCA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBsdWdpbiA9IHRoaXMuYXBwLnBsdWdpbnMucGx1Z2luc1twbHVnaW5JZF07XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlUGx1Z2luSXRlbShjb250YWluZXIsIHBsdWdpbik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVQbHVnaW5JdGVtKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHBsdWdpbjogYW55KSB7XHJcbiAgICAgICAgY29uc3QgcGx1Z2luSXRlbSA9IGNvbnRhaW5lci5jcmVhdGVEaXYoJ3BsdWdpbi1pdGVtJyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcGx1Z2luSXRlbS5jcmVhdGVFbCgnaDMnLCB7IHRleHQ6IHBsdWdpbi5tYW5pZmVzdC5uYW1lIH0pO1xyXG4gICAgICAgIHBsdWdpbkl0ZW0uY3JlYXRlRWwoJ3AnLCB7IHRleHQ6IHBsdWdpbi5tYW5pZmVzdC5kZXNjcmlwdGlvbiB9KTtcclxuICAgICAgICBwbHVnaW5JdGVtLmNyZWF0ZUVsKCdzbWFsbCcsIHsgXHJcbiAgICAgICAgICAgIHRleHQ6IHRoaXMudHJhbnNsYXRpb25zLnQoJ2Rhc2hib2FyZC52ZXJzaW9uJywge1xyXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogcGx1Z2luLm1hbmlmZXN0LnZlcnNpb25cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvbkNsb3NlKCkge1xyXG4gICAgICAgIC8vIE5ldHRveWFnZSBzaSBuXHUwMEU5Y2Vzc2FpcmVcclxuICAgIH1cclxufVxyXG4iLCAiaW1wb3J0IHsgUGx1Z2luLCBXb3Jrc3BhY2VMZWFmLCBNb2RhbCB9IGZyb20gJ29ic2lkaWFuJztcclxuaW1wb3J0IHsgVFZpZXdNb2RlIH0gZnJvbSAnLi90eXBlcyc7XHJcbmltcG9ydCB7IFNldHRpbmdzIH0gZnJvbSAnLi9TZXR0aW5ncyc7XHJcbmltcG9ydCB7IERhc2hib2FyZCB9IGZyb20gJy4vRGFzaGJvYXJkJztcclxuaW1wb3J0IHsgVHJhbnNsYXRpb25zIH0gZnJvbSAnLi9UcmFuc2xhdGlvbnMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFZpZXdNb2RlIHtcclxuICAgcHJpdmF0ZSBjdXJyZW50VmlldzogRGFzaGJvYXJkIHwgbnVsbCA9IG51bGw7XHJcbiAgIHByaXZhdGUgY3VycmVudE1vZGU6IFRWaWV3TW9kZSB8IG51bGwgPSBudWxsO1xyXG4gICBwcml2YXRlIGFjdGl2ZUxlYWY6IFdvcmtzcGFjZUxlYWYgfCBudWxsID0gbnVsbDtcclxuICAgcHJpdmF0ZSBsZWFmSWQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xyXG4gICBwcml2YXRlIHRyYW5zbGF0aW9uczogVHJhbnNsYXRpb25zO1xyXG5cclxuICAgY29uc3RydWN0b3IocHJpdmF0ZSBwbHVnaW46IFBsdWdpbikge1xyXG4gICAgICB0aGlzLnRyYW5zbGF0aW9ucyA9IG5ldyBUcmFuc2xhdGlvbnMoKTtcclxuICAgICAgLy8gSW5pdGlhbGlzZXIgbGUgbW9kZSBkZXB1aXMgbGVzIHNldHRpbmdzXHJcbiAgICAgIFNldHRpbmdzLmxvYWRTZXR0aW5ncygpLnRoZW4oc2V0dGluZ3MgPT4ge1xyXG4gICAgICAgICB0aGlzLmN1cnJlbnRNb2RlID0gc2V0dGluZ3MuY3VycmVudE1vZGU7XHJcbiAgICAgIH0pO1xyXG4gICAgICAvLyBOZXR0b3llciBsZXMgYW5jaWVubmVzIGxlYWZzIGF1IGRcdTAwRTltYXJyYWdlXHJcbiAgICAgIHRoaXMuY2xvc2VDdXJyZW50VmlldygpO1xyXG4gICB9XHJcblxyXG4gICBwcml2YXRlIGFzeW5jIGNsb3NlQ3VycmVudFZpZXcoKSB7XHJcbiAgICAgIGlmICh0aGlzLmN1cnJlbnRWaWV3KSB7XHJcbiAgICAgICAgIGNvbnN0IGxlYXZlcyA9IHRoaXMucGx1Z2luLmFwcC53b3Jrc3BhY2UuZ2V0TGVhdmVzT2ZUeXBlKCdwbHVnaW5mbG93ei12aWV3Jyk7XHJcbiAgICAgICAgIGxlYXZlcy5mb3JFYWNoKGxlYWYgPT4ge1xyXG4gICAgICAgICAgICBpZiAobGVhZi52aWV3IGluc3RhbmNlb2YgRGFzaGJvYXJkKSB7XHJcbiAgICAgICAgICAgICAgIGxlYWYuZGV0YWNoKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgfSk7XHJcbiAgICAgICAgIHRoaXMuY3VycmVudFZpZXcgPSBudWxsO1xyXG4gICAgICAgICB0aGlzLmFjdGl2ZUxlYWYgPSBudWxsO1xyXG4gICAgICAgICB0aGlzLmxlYWZJZCA9IG51bGw7XHJcbiAgICAgIH1cclxuICAgfVxyXG5cclxuICAgcHJpdmF0ZSBnZXRMZWFmRm9yTW9kZShtb2RlOiBUVmlld01vZGUpOiBXb3Jrc3BhY2VMZWFmIHwgbnVsbCB7XHJcbiAgICAgIGNvbnN0IHdvcmtzcGFjZSA9IHRoaXMucGx1Z2luLmFwcC53b3Jrc3BhY2U7XHJcbiAgICAgIFxyXG4gICAgICAvLyBGZXJtZXIgdG91dGVzIGxlcyB2dWVzIERhc2hib2FyZCBleGlzdGFudGVzXHJcbiAgICAgIGNvbnN0IGV4aXN0aW5nTGVhdmVzID0gd29ya3NwYWNlLmdldExlYXZlc09mVHlwZSgncGx1Z2luZmxvd3otdmlldycpO1xyXG4gICAgICBleGlzdGluZ0xlYXZlcy5mb3JFYWNoKGxlYWYgPT4ge1xyXG4gICAgICAgICBpZiAobGVhZi52aWV3IGluc3RhbmNlb2YgRGFzaGJvYXJkKSB7XHJcbiAgICAgICAgICAgIGxlYWYuZGV0YWNoKCk7XHJcbiAgICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIFxyXG4gICAgICBsZXQgbGVhZjogV29ya3NwYWNlTGVhZiB8IG51bGwgPSBudWxsO1xyXG4gICAgICBzd2l0Y2ggKG1vZGUpIHtcclxuICAgICAgICAgY2FzZSAnc2lkZWJhcic6XHJcbiAgICAgICAgICAgIGxlYWYgPSB3b3Jrc3BhY2UuZ2V0UmlnaHRMZWFmKGZhbHNlKSA/PyB3b3Jrc3BhY2UuZ2V0TGVhZignc3BsaXQnKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgIGNhc2UgJ3BvcHVwJzpcclxuICAgICAgICAgICAgY29uc3QgbW9kYWwgPSBuZXcgTW9kYWwodGhpcy5wbHVnaW4uYXBwKTtcclxuICAgICAgICAgICAgbW9kYWwuY29udGFpbmVyRWwuYWRkQ2xhc3MoJ3BsdWdpbmZsb3d6LW1vZGFsJyk7XHJcbiAgICAgICAgICAgIG1vZGFsLnRpdGxlRWwuc2V0VGV4dCh0aGlzLnRyYW5zbGF0aW9ucy50KCdkYXNoYm9hcmQudGl0bGUnKSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IG1vZGFsLmNvbnRlbnRFbC5jcmVhdGVEaXYoJ3BsdWdpbmZsb3d6LWRhc2hib2FyZC1jb250YWluZXInKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIENyXHUwMEU5ZXIgdW4gbGVhZiB0ZW1wb3JhaXJlIGVuIHV0aWxpc2FudCBsZXMgbVx1MDBFOXRob2RlcyBkJ09ic2lkaWFuXHJcbiAgICAgICAgICAgIGNvbnN0IHRlbXBMZWFmID0gdGhpcy5wbHVnaW4uYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKTtcclxuICAgICAgICAgICAgY29uc3QgdmlldyA9IG5ldyBEYXNoYm9hcmQodGVtcExlYWYsIFNldHRpbmdzLCB0aGlzLnRyYW5zbGF0aW9ucyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBDYWNoZXIgbGUgbGVhZiBtYWlzIGdhcmRlciBsYSB2dWUgYWN0aXZlXHJcbiAgICAgICAgICAgIHRlbXBMZWFmLmNvbnRhaW5lckVsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2aWV3Lm9uT3BlbigpO1xyXG4gICAgICAgICAgICBtb2RhbC5vbkNsb3NlID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICB2aWV3Lm9uQ2xvc2UoKTtcclxuICAgICAgICAgICAgICAgdGVtcExlYWYuZGV0YWNoKCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIG1vZGFsLm9wZW4oKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7IC8vIE5lIHBhcyByZXRvdXJuZXIgZGUgbGVhZiBwb3VyIGxlIG1vZGUgcG9wdXBcclxuICAgICAgICAgY2FzZSAndGFiJzpcclxuICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgbGVhZiA9IHdvcmtzcGFjZS5nZXRMZWFmKCdzcGxpdCcpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGxlYWY7XHJcbiAgIH1cclxuXHJcbiAgIGFzeW5jIHNldFZpZXcobW9kZTogVFZpZXdNb2RlKSB7XHJcbiAgICAgIGlmIChtb2RlID09PSB0aGlzLmN1cnJlbnRNb2RlICYmIHRoaXMuY3VycmVudFZpZXcgJiYgdGhpcy5hY3RpdmVMZWFmKSB7XHJcbiAgICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgYXdhaXQgdGhpcy5jbG9zZUN1cnJlbnRWaWV3KCk7XHJcblxyXG4gICAgICBjb25zdCBsZWFmID0gdGhpcy5nZXRMZWFmRm9yTW9kZShtb2RlKTtcclxuICAgICAgXHJcbiAgICAgIGlmIChsZWFmICYmIG1vZGUgIT09ICdwb3B1cCcpIHtcclxuICAgICAgICAgYXdhaXQgbGVhZi5zZXRWaWV3U3RhdGUoe1xyXG4gICAgICAgICAgICB0eXBlOiAncGx1Z2luZmxvd3otdmlldycsXHJcbiAgICAgICAgICAgIGFjdGl2ZTogdHJ1ZSxcclxuICAgICAgICAgICAgc3RhdGU6IHsgXHJcbiAgICAgICAgICAgICAgIG1vZGU6IG1vZGUsXHJcbiAgICAgICAgICAgICAgIGxlYWZJZDogdGhpcy5sZWFmSWRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgIHRoaXMuY3VycmVudFZpZXcgPSBsZWFmLnZpZXcgYXMgRGFzaGJvYXJkO1xyXG4gICAgICAgICB0aGlzLmFjdGl2ZUxlYWYgPSBsZWFmO1xyXG4gICAgICAgICB0aGlzLnBsdWdpbi5hcHAud29ya3NwYWNlLnJldmVhbExlYWYobGVhZik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuY3VycmVudE1vZGUgPSBtb2RlO1xyXG4gICAgICAvLyBTYXV2ZWdhcmRlciBsZSBub3V2ZWF1IG1vZGUgZGFucyBsZXMgc2V0dGluZ3NcclxuICAgICAgYXdhaXQgU2V0dGluZ3Muc2F2ZVNldHRpbmdzKHsgY3VycmVudE1vZGU6IG1vZGUgfSk7XHJcbiAgIH1cclxuXHJcbiAgIGdldEFjdGl2ZUxlYWYoKTogV29ya3NwYWNlTGVhZiB8IG51bGwge1xyXG4gICAgICByZXR1cm4gdGhpcy5hY3RpdmVMZWFmO1xyXG4gICB9XHJcblxyXG4gICBnZXRDdXJyZW50TGVhZklkKCk6IHN0cmluZyB8IG51bGwge1xyXG4gICAgICByZXR1cm4gdGhpcy5sZWFmSWQ7XHJcbiAgIH1cclxufSAiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBQUFBLG1CQUE2Qjs7O0FDQXRCLFNBQVMsaUJBQWlCO0FBQ2pDLFFBQU0sVUFBVSxTQUFTLGNBQWMsT0FBTztBQUM5QyxVQUFRLEtBQUs7QUFDYixVQUFRLGNBQWM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUErQ3RCLFdBQVMsS0FBSyxZQUFZLE9BQU87QUFDakM7OztBQ25EQSxzQkFBNkQ7QUFjdEQsSUFBTSxtQkFBb0M7QUFBQSxFQUM5QyxVQUFVO0FBQUEsRUFDVixhQUFhO0FBQUEsRUFD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
