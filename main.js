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
    /* ===== Modal ===== */

    .modal-container.pluginflowz-modal .modal {
        width: calc(100vw - 200px);
        height: calc(100vh - 100px);
        max-width: calc(100vw - 200px);
        max-height: calc(100vh - 100px);
    }

    .modal-container.pluginflowz-modal .modal-content {
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    /* ===== Dashboard ===== */
    .pluginflowz-dashboard-container {
        padding: 20px;
        flex: 1;
        overflow-y: auto;
    }

    /* En mode popup */
    .modal-container .pluginflowz-dashboard-container {
        height: 100%;
    }

    /* En mode tab/sidebar */
    .workspace-leaf-content[data-type="pluginflowz-view"] .pluginflowz-dashboard-container {
        height: 100%;
    }

    /* ===== Plugins List ===== */
    .pluginflowz-plugins-list {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 20px 0;
    }

    .pluginflowz-plugin-item {
        background: var(--background-secondary);
        padding: 15px;
        border-radius: 5px;
    }

    /* Mode Cards */
    .pluginflowz-cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        padding: 20px;
    }

    .pluginflowz-card {
        background: var(--background-secondary);
        border-radius: 8px;
        padding: 15px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .pluginflowz-card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }

    .pluginflowz-card-description {
        flex: 1;
        color: var(--text-muted);
    }

    .pluginflowz-card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    /* Header avec toggle */
    .pluginflowz-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        margin-bottom: 20px;
    }

    .pluginflowz-header .setting-item {
        border: none;
        padding: 0;
    }

    .pluginflowz-header .setting-item-control {
        padding: 0;
    }

    .pluginflowz-header .clickable-icon {
        padding: 4px;
        border-radius: 4px;
    }

    .pluginflowz-header .clickable-icon:hover {
        background-color: var(--background-modifier-hover);
    }

    .pluginflowz-view-button {
        background-color: var(--interactive-accent);
        color: var(--text-on-accent);
        padding: 4px 12px;
        border-radius: 4px;
        font-size: 14px;
        border: none;
        cursor: pointer;
        transition: background-color 0.15s ease;
    }

    .pluginflowz-view-button:hover {
        background-color: var(--interactive-accent-hover);
    }

    .pluginflowz-rating-container,
    .pluginflowz-card-rating {
        margin-top: 10px;
    }

    .pluginflowz-rating-container .setting-item,
    .pluginflowz-card-rating .setting-item {
        border: none;
        padding: 0;
    }

    .pluginflowz-card-rating .setting-item-name {
        font-size: 16px;
        padding: 0;
    }

    .pluginflowz-card-rating .slider {
        flex: 1;
    }

    .pluginflowz-progress {
        width: 100%;
        height: 4px;
        background-color: var(--background-modifier-border);
        border-radius: 2px;
        overflow: hidden;
        margin-bottom: 4px;
    }

    .pluginflowz-progress-value {
        height: 100%;
        background-color: var(--interactive-accent);
        transition: width 0.2s ease;
    }

    .pluginflowz-rating-text {
        font-size: 12px;
        color: var(--text-muted);
    }

    .pluginflowz-card-rating {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 8px;
    }

    .progress-container {
        flex: 1;
        height: 4px;
        background-color: var(--background-modifier-border);
        border-radius: 2px;
        overflow: hidden;
        cursor: pointer;
        transition: height 0.15s ease;
    }

    .progress-container:hover {
        height: 8px;
    }

    .progress-bar {
        height: 100%;
        background-color: var(--interactive-accent);
        transition: width 0.2s ease;
    }

    .pluginflowz-rating-value {
        font-size: 12px;
        color: var(--text-muted);
        min-width: 32px;
        text-align: right;
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
  template: "# {{name}}\n\n{{description}}\n\n{{url}}",
  defaultViewMode: "list"
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
    "dashboard.noPlugins": "No plugins installed yet. Install some plugins to manage them here.",
    "dashboard.installedPlugins": "Installed Plugins",
    "dashboard.switchToList": "Switch to list view",
    "dashboard.switchToCards": "Switch to cards view",
    "dashboard.listView": "List View",
    "dashboard.cardView": "Card View",
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
    "dashboard.noPlugins": "Aucun plugin install\xE9 pour le moment. Installez des plugins pour les g\xE9rer ici.",
    "dashboard.installedPlugins": "Plugins Install\xE9s",
    "dashboard.switchToList": "Passer en vue liste",
    "dashboard.switchToCards": "Passer en vue cartes",
    "dashboard.listView": "Vue Liste",
    "dashboard.cardView": "Vue Cartes",
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
  constructor(leaf, settings, translations2, plugin) {
    super(leaf);
    this.settings = settings;
    this.plugin = plugin;
    this.plugins = [];
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
    const data = await this.plugin.loadData();
    this.plugins = (data == null ? void 0 : data.plugins) || [];
    renderPluginList(container, this.plugins, this.translations);
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
    this.currentViewMode = "list";
    this.plugins = [];
    this.translations = new Translations();
    Settings.loadSettings().then((settings) => {
      this.currentMode = settings.currentMode;
      this.currentViewMode = settings.defaultViewMode || "list";
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
  async getLeafForMode(mode) {
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
        const data = await this.plugin.loadData();
        this.plugins = (data == null ? void 0 : data.plugins) || [];
        this.renderContent(modal.contentEl);
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
    const leaf = await this.getLeafForMode(mode);
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
  renderPluginList(container, plugins) {
    const pluginsList = container.createDiv("pluginflowz-plugins-list");
    if (!plugins || plugins.length === 0) {
      pluginsList.createEl("p", {
        text: this.translations.t("dashboard.noPlugins"),
        cls: "pluginflowz-no-plugins"
      });
      return;
    }
    plugins.forEach((plugin) => {
      const pluginEl = pluginsList.createDiv("pluginflowz-plugin-item");
      const headerEl = pluginEl.createDiv("pluginflowz-plugin-header");
      headerEl.createEl("h4", { text: plugin.title });
      if (plugin.tags.length > 0) {
        const tagsEl = pluginEl.createDiv("pluginflowz-plugin-tags");
        plugin.tags.forEach((tag) => {
          tagsEl.createEl("span", {
            text: tag,
            cls: "pluginflowz-plugin-tag"
          });
        });
      }
      if (plugin.description) {
        pluginEl.createEl("p", { text: plugin.description });
      }
      const infoEl = pluginEl.createDiv("pluginflowz-plugin-info");
      infoEl.createEl("span", {
        text: `Status: ${plugin.status.join(", ")}`,
        cls: "pluginflowz-plugin-status"
      });
      if (plugin.rating > 0) {
        infoEl.createEl("span", {
          text: `Rating: ${plugin.rating}/5`,
          cls: "pluginflowz-plugin-rating"
        });
      }
      this.createRatingControl(pluginEl, plugin, false);
    });
  }
  renderPluginCards(container, plugins) {
    const cardsGrid = container.createDiv("pluginflowz-cards-grid");
    if (!plugins || plugins.length === 0) {
      cardsGrid.createEl("p", {
        text: this.translations.t("dashboard.noPlugins"),
        cls: "pluginflowz-no-plugins"
      });
      return;
    }
    console.log("Rendering cards for plugins:", plugins);
    plugins.forEach((plugin) => {
      console.log("Creating card for plugin:", plugin.title);
      const card = cardsGrid.createDiv("pluginflowz-card");
      const cardHeader = card.createDiv("pluginflowz-card-header");
      const titleEl = cardHeader.createEl("h3", { text: plugin.title });
      const actions = new import_obsidian4.Setting(cardHeader);
      actions.addExtraButton(
        (btn) => btn.setIcon(plugin.activate ? "check-circle" : "circle").setTooltip(this.translations.t(
          plugin.activate ? "settings.plugins.deactivate.tooltip" : "settings.plugins.activate.tooltip"
        )).onClick(async () => {
          plugin.activate = !plugin.activate;
          btn.setIcon(plugin.activate ? "check-circle" : "circle");
          await Settings.saveSettings(this.settings);
          new Notice(this.translations.t(
            plugin.activate ? "settings.plugins.activated" : "settings.plugins.deactivated"
          ).replace("{title}", plugin.title));
        })
      ).addExtraButton(
        (btn) => btn.setIcon("more-vertical").setTooltip(this.translations.t("settings.plugins.options.tooltip"))
      );
      if (plugin.description) {
        card.createEl("p", {
          text: plugin.description,
          cls: "pluginflowz-card-description"
        });
      }
      const cardFooter = card.createDiv("pluginflowz-card-footer");
      if (plugin.tags.length > 0) {
        const tagsContainer = cardFooter.createDiv("pluginflowz-card-tags");
        plugin.tags.forEach((tag) => {
          tagsContainer.createEl("span", {
            text: tag,
            cls: "pluginflowz-tag"
          });
        });
      }
      const stats = cardFooter.createDiv("pluginflowz-card-stats");
      stats.createEl("span", {
        text: plugin.status[0],
        cls: `pluginflowz-status-${plugin.status[0]}`
      });
      this.createRatingControl(card, plugin, true);
    });
  }
  createRatingControl(container, plugin, isCard = false) {
    if (isCard) {
      const ratingContainer = container.createDiv("pluginflowz-card-rating");
      const ratingText = ratingContainer.createEl("span", {
        text: "\u2B50 ",
        cls: "pluginflowz-rating-text"
      });
      const progressContainer = ratingContainer.createDiv("progress-container");
      const progressBar = progressContainer.createDiv("progress-bar");
      progressBar.style.width = `${plugin.rating / 5 * 100}%`;
      const ratingValue = ratingContainer.createEl("span", {
        text: `${plugin.rating}/5`,
        cls: "pluginflowz-rating-value"
      });
      const updateRating = async (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const newRating = Math.round(x / rect.width * 5);
        plugin.rating = Math.max(0, Math.min(5, newRating));
        progressBar.style.width = `${plugin.rating / 5 * 100}%`;
        ratingValue.setText(`${plugin.rating}/5`);
        await Settings.saveSettings(this.settings);
      };
      progressContainer.addEventListener("mousemove", (e) => {
        if (e.buttons === 1) {
          updateRating(e);
        }
      });
      progressContainer.addEventListener("click", updateRating);
      progressContainer.style.cursor = "pointer";
      progressContainer.addEventListener("mousemove", (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const hoverRating = Math.round(x / rect.width * 5);
        progressContainer.setAttribute("title", `${hoverRating}/5`);
      });
    } else {
      const ratingContainer = container.createDiv("pluginflowz-rating-container");
      new import_obsidian4.Setting(ratingContainer).setName(this.translations.t("settings.plugins.options.rating")).addSlider(
        (slider) => slider.setLimits(0, 5, 1).setValue(plugin.rating).setDynamicTooltip().onChange(async (value) => {
          plugin.rating = value;
          await Settings.saveSettings(this.settings);
        })
      );
    }
  }
  renderContent(container) {
    container.empty();
    const dashboardContainer = container.createDiv("pluginflowz-dashboard-container");
    const header = dashboardContainer.createDiv("pluginflowz-header");
    header.createEl("h2", { text: this.translations.t("dashboard.installedPlugins") });
    const viewButton = header.createEl("button", {
      cls: "pluginflowz-view-button",
      text: this.translations.t(
        this.currentViewMode === "cards" ? "dashboard.listView" : "dashboard.cardView"
      )
    });
    viewButton.addEventListener("click", async () => {
      this.currentViewMode = this.currentViewMode === "cards" ? "list" : "cards";
      viewButton.setText(this.translations.t(
        this.currentViewMode === "cards" ? "dashboard.listView" : "dashboard.cardView"
      ));
      await Settings.saveSettings({
        defaultViewMode: this.currentViewMode
      });
      this.renderContent(container);
    });
    const contentContainer = dashboardContainer.createDiv("pluginflowz-content");
    if (this.currentViewMode === "cards") {
      this.renderPluginCards(contentContainer, this.plugins);
    } else {
      this.renderPluginList(contentContainer, this.plugins);
    }
  }
};

// obsidian-PluginFlowz/src/PluginManager.ts
var PluginManager = class {
  constructor(plugin) {
    this.plugin = plugin;
  }
  async getInstalledPlugins() {
    var _a;
    const plugins = [];
    const manifests = Object.entries(this.plugin.app.plugins.manifests);
    console.log("\u{1F50C} PluginManager - D\xE9tection des plugins:", manifests.length, "plugins trouv\xE9s");
    for (const [id, manifest] of manifests) {
      if (id === this.plugin.manifest.id) {
        console.log("\u{1F50C} PluginManager - Ignor\xE9:", id, "(notre plugin)");
        continue;
      }
      plugins.push({
        title: manifest.name,
        url: manifest.authorUrl || "",
        tags: [],
        status: ["exploring"],
        activate: ((_a = this.plugin.app.plugins.getPlugin(id)) == null ? void 0 : _a.enabled) || false,
        description: manifest.description,
        transcribe: false,
        group: [],
        rating: 0,
        urgency: 1,
        importance: 1,
        mdNote: `${id}.md`
      });
      console.log("\u{1F50C} PluginManager - Ajout\xE9:", manifest.name, "(", id, ")");
    }
    console.log("\u{1F50C} PluginManager - Total:", plugins.length, "plugins ajout\xE9s");
    return plugins;
  }
  async syncPlugins() {
    console.log("\u{1F504} PluginManager - D\xE9but de la synchronisation");
    const data = await this.plugin.loadData();
    const currentPlugins = (data == null ? void 0 : data.plugins) || [];
    console.log("\u{1F504} PluginManager - Plugins existants:", currentPlugins.length);
    const installedPlugins = await this.getInstalledPlugins();
    console.log("\u{1F504} PluginManager - Plugins install\xE9s:", installedPlugins.length);
    const mergedPlugins = installedPlugins.map((newPlugin) => {
      const existingPlugin = currentPlugins.find((p) => p.title === newPlugin.title);
      return existingPlugin ? { ...newPlugin, ...existingPlugin } : newPlugin;
    });
    console.log("\u{1F504} PluginManager - Plugins apr\xE8s fusion:", mergedPlugins.length);
    await this.plugin.saveData({
      ...data,
      plugins: mergedPlugins
    });
    console.log("\u{1F504} PluginManager - Synchronisation termin\xE9e");
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
        const view = new Dashboard(leaf, this.settings, this.translations, this);
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
    const pluginManager = new PluginManager(this);
    await pluginManager.syncPlugins();
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL21haW4udHMiLCAic3JjL1JlZ2lzdGVyU3R5bGVzLnRzIiwgInNyYy9TZXR0aW5ncy50cyIsICJzcmMvVHJhbnNsYXRpb25zLnRzIiwgInNyYy9Ib3RrZXlzLnRzIiwgInNyYy9EYXNoYm9hcmQudHMiLCAic3JjL1ZpZXdNb2RlLnRzIiwgInNyYy9QbHVnaW5NYW5hZ2VyLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyBQbHVnaW4sIE1lbnUgfSBmcm9tICdvYnNpZGlhbic7XHJcbmltcG9ydCB7IFRWaWV3TW9kZSB9IGZyb20gJy4vdHlwZXMnO1xyXG5pbXBvcnQgeyByZWdpc3RlclN0eWxlcyB9IGZyb20gJy4vUmVnaXN0ZXJTdHlsZXMnO1xyXG5pbXBvcnQgeyBTZXR0aW5ncywgU2V0dGluZ3NUYWIsIERFRkFVTFRfU0VUVElOR1MgfSBmcm9tICcuL1NldHRpbmdzJ1xyXG5pbXBvcnQgeyBUcmFuc2xhdGlvbnMgfSBmcm9tICcuL1RyYW5zbGF0aW9ucyc7XHJcbmltcG9ydCB7IEhvdGtleXMgfSBmcm9tICcuL0hvdGtleXMnO1xyXG5pbXBvcnQgeyBEYXNoYm9hcmQgfSBmcm9tICcuL0Rhc2hib2FyZCc7XHJcbmltcG9ydCB7IFZpZXdNb2RlIH0gZnJvbSAnLi9WaWV3TW9kZSc7XHJcbmltcG9ydCB7IFBsdWdpbk1hbmFnZXIgfSBmcm9tICcuL1BsdWdpbk1hbmFnZXInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGx1Z2luRmxvd3ogZXh0ZW5kcyBQbHVnaW4ge1xyXG4gICBwcml2YXRlIHZpZXdNb2RlITogVmlld01vZGU7XHJcbiAgIHNldHRpbmdzITogU2V0dGluZ3M7XHJcbiAgIHByaXZhdGUgdHJhbnNsYXRpb25zOiBUcmFuc2xhdGlvbnMgPSBuZXcgVHJhbnNsYXRpb25zKCk7XHJcbiAgIHByaXZhdGUgaG90a2V5cyE6IEhvdGtleXM7XHJcbiAgIHByaXZhdGUgZGFzaGJvYXJkITogRGFzaGJvYXJkO1xyXG5cclxuICAgcHJpdmF0ZSBpbml0aWFsaXplVmlldygpIHtcclxuICAgICAgdGhpcy5yZWdpc3RlclZpZXcoXHJcbiAgICAgICAgIFwicGx1Z2luZmxvd3otdmlld1wiLFxyXG4gICAgICAgICAobGVhZikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB2aWV3ID0gbmV3IERhc2hib2FyZChsZWFmLCB0aGlzLnNldHRpbmdzLCB0aGlzLnRyYW5zbGF0aW9ucywgdGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMuZGFzaGJvYXJkID0gdmlldztcclxuICAgICAgICAgICAgcmV0dXJuIHZpZXc7XHJcbiAgICAgICAgIH1cclxuICAgICAgKTtcclxuICAgfVxyXG5cclxuICAgYXN5bmMgb25sb2FkKCkge1xyXG4gICAgICBhd2FpdCB0aGlzLmxvYWRBcHAoKTtcclxuXHJcbiAgICAgIC8vIEluaXRpYWxpc2F0aW9uXHJcbiAgICAgIFNldHRpbmdzLmluaXRpYWxpemUodGhpcyk7XHJcbiAgICAgIFxyXG4gICAgICAvLyBJbml0aWFsaXNlciBsZXMgdHJhZHVjdGlvbnNcclxuICAgICAgdGhpcy5sb2FkTGFuZ3VhZ2UoKTtcclxuXHJcbiAgICAgIC8vIEluaXRpYWxpc2VyIFZpZXdNb2RlIGF2YW50IGRlIGwndXRpbGlzZXJcclxuICAgICAgdGhpcy52aWV3TW9kZSA9IG5ldyBWaWV3TW9kZSh0aGlzKTtcclxuICAgICAgXHJcbiAgICAgIC8vIEluaXRpYWxpc2VyIGxlcyBob3RrZXlzXHJcbiAgICAgIHRoaXMuaG90a2V5cyA9IG5ldyBIb3RrZXlzKFxyXG4gICAgICAgICB0aGlzLFxyXG4gICAgICAgICBTZXR0aW5ncyxcclxuICAgICAgICAgdGhpcy50cmFuc2xhdGlvbnMsXHJcbiAgICAgICAgIHRoaXMudmlld01vZGVcclxuICAgICAgKTtcclxuICAgICAgdGhpcy5ob3RrZXlzLnJlZ2lzdGVySG90a2V5cygpO1xyXG4gICAgICBcclxuICAgICAgdGhpcy5pbml0aWFsaXplVmlldygpO1xyXG5cclxuICAgICAgdGhpcy5hZGRTZXR0aW5nVGFiKG5ldyBTZXR0aW5nc1RhYihcclxuICAgICAgICAgdGhpcy5hcHAsXHJcbiAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgIERFRkFVTFRfU0VUVElOR1MsXHJcbiAgICAgICAgIHRoaXMudmlld01vZGUsXHJcbiAgICAgICAgIHRoaXMudHJhbnNsYXRpb25zXHJcbiAgICAgICkpO1xyXG5cclxuICAgICAgLy8gQ3JcdTAwRTlhdGlvbiBkdSBtZW51XHJcbiAgICAgIGNvbnN0IHJpYmJvbkljb24gPSB0aGlzLmFkZFJpYmJvbkljb24oXHJcbiAgICAgICAgICdsYXlvdXQtZ3JpZCcsXHJcbiAgICAgICAgICdQbHVnaW5GbG93eicsIFxyXG4gICAgICAgICBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1vZGUgPSBhd2FpdCBTZXR0aW5ncy5nZXRWaWV3TW9kZSgpO1xyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLnZpZXdNb2RlLnNldFZpZXcobW9kZSk7XHJcbiAgICAgICAgIH1cclxuICAgICAgKTtcclxuXHJcbiAgICAgIHJpYmJvbkljb24uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcclxuICAgICAgICAgY29uc3QgbWVudSA9IG5ldyBNZW51KCk7XHJcblxyXG4gICAgICAgICBjb25zdCBjcmVhdGVNZW51SXRlbSA9ICh0aXRsZTogc3RyaW5nLCBpY29uOiBzdHJpbmcsIG1vZGU6IFRWaWV3TW9kZSkgPT4ge1xyXG4gICAgICAgICAgICBtZW51LmFkZEl0ZW0oKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgaXRlbS5zZXRUaXRsZSh0aXRsZSlcclxuICAgICAgICAgICAgICAgICAgLnNldEljb24oaWNvbilcclxuICAgICAgICAgICAgICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnZpZXdNb2RlLnNldFZpZXcobW9kZSk7XHJcbiAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgIGNyZWF0ZU1lbnVJdGVtKFwiRGFzaGJvYXJkIFRhYlwiLCBcInRhYlwiLCBcInRhYlwiIGFzIFRWaWV3TW9kZSk7XHJcbiAgICAgICAgIGNyZWF0ZU1lbnVJdGVtKFwiRGFzaGJvYXJkIFNpZGViYXJcIiwgXCJsYXlvdXQtc2lkZWJhci1yaWdodFwiLCBcInNpZGViYXJcIiBhcyBUVmlld01vZGUpO1xyXG4gICAgICAgICBjcmVhdGVNZW51SXRlbShcIkRhc2hib2FyZCBQb3B1cFwiLCBcImxheW91dC10b3BcIiwgXCJwb3B1cFwiIGFzIFRWaWV3TW9kZSk7XHJcblxyXG4gICAgICAgICBjb25zdCBpY29uUmVjdCA9IHJpYmJvbkljb24uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgIG1lbnUuc2hvd0F0UG9zaXRpb24oeyBcclxuICAgICAgICAgICAgeDogaWNvblJlY3QubGVmdCwgXHJcbiAgICAgICAgICAgIHk6IGljb25SZWN0LnRvcCAtIDEwXHJcbiAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgY29uc3QgaGFuZGxlTW91c2VMZWF2ZSA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGUucmVsYXRlZFRhcmdldCBhcyBOb2RlO1xyXG4gICAgICAgICAgICBjb25zdCBtZW51RG9tID0gKG1lbnUgYXMgYW55KS5kb207XHJcbiAgICAgICAgICAgIGNvbnN0IGlzT3Zlckljb24gPSByaWJib25JY29uLmNvbnRhaW5zKHRhcmdldCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGlzT3Zlck1lbnUgPSBtZW51RG9tICYmIG1lbnVEb20uY29udGFpbnModGFyZ2V0KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmICghaXNPdmVySWNvbiAmJiAhaXNPdmVyTWVudSkge1xyXG4gICAgICAgICAgICAgICBtZW51LmhpZGUoKTtcclxuICAgICAgICAgICAgICAgcmliYm9uSWNvbi5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgaGFuZGxlTW91c2VMZWF2ZSk7XHJcbiAgICAgICAgICAgICAgIGlmIChtZW51RG9tKSB7XHJcbiAgICAgICAgICAgICAgICAgIG1lbnVEb20ucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIGhhbmRsZU1vdXNlTGVhdmUpO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgIHJpYmJvbkljb24uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIGhhbmRsZU1vdXNlTGVhdmUpO1xyXG4gICAgICAgICBjb25zdCBtZW51RG9tID0gKG1lbnUgYXMgYW55KS5kb207XHJcbiAgICAgICAgIGlmIChtZW51RG9tKSB7XHJcbiAgICAgICAgICAgIG1lbnVEb20uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIGhhbmRsZU1vdXNlTGVhdmUpO1xyXG4gICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgcmVnaXN0ZXJTdHlsZXMoKTtcclxuXHJcbiAgICAgIC8vIFN5bmNocm9uaXNlciBsZXMgcGx1Z2lucyBhdSBkXHUwMEU5bWFycmFnZVxyXG4gICAgICBjb25zdCBwbHVnaW5NYW5hZ2VyID0gbmV3IFBsdWdpbk1hbmFnZXIodGhpcyk7XHJcbiAgICAgIGF3YWl0IHBsdWdpbk1hbmFnZXIuc3luY1BsdWdpbnMoKTtcclxuICAgfVxyXG5cclxuICAgcHJpdmF0ZSBhc3luYyBsb2FkQXBwKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgaWYgKCF0aGlzLmFwcC53b3Jrc3BhY2UpIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dChyZXNvbHZlLCAwKTtcclxuICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICB9XHJcblxyXG4gICBwcml2YXRlIGxvYWRMYW5ndWFnZSgpOiB2b2lkIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICAgY29uc3QgbG9jYWxlID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50Lmxhbmc/LnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aCgnZnInKSA/ICdmcicgOiAnZW4nO1xyXG4gICAgICAgICBjb25zb2xlLmxvZygnTGFuZ3VlIGRcdTAwRTl0ZWN0XHUwMEU5ZTonLCBsb2NhbGUpO1xyXG4gICAgICAgICB0aGlzLnRyYW5zbGF0aW9ucy5zZXRMYW5ndWFnZShsb2NhbGUpO1xyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICBjb25zb2xlLndhcm4oJ0VycmV1ciBsb3JzIGRlIGxhIGRcdTAwRTl0ZWN0aW9uIGRlIGxhIGxhbmd1ZSwgdXRpbGlzYXRpb24gZHUgZnJhblx1MDBFN2FpcyBwYXIgZFx1MDBFOWZhdXQnKTtcclxuICAgICAgICAgdGhpcy50cmFuc2xhdGlvbnMuc2V0TGFuZ3VhZ2UoJ2ZyJyk7XHJcbiAgICAgIH1cclxuICAgfVxyXG5cclxuICAgb251bmxvYWQoKSB7XHJcbiAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS5kZXRhY2hMZWF2ZXNPZlR5cGUoXCJwbHVnaW5mbG93ei12aWV3XCIpO1xyXG4gICB9XHJcbn1cclxuIiwgImV4cG9ydCBmdW5jdGlvbiByZWdpc3RlclN0eWxlcygpIHtcbmNvbnN0IHN0eWxlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuc3R5bGVFbC5pZCA9ICdwbHVnaW5mbG93ei1zdHlsZXMnO1xuc3R5bGVFbC50ZXh0Q29udGVudCA9IGBcbiAgICAvKiA9PT09PSBNb2RhbCA9PT09PSAqL1xuXG4gICAgLm1vZGFsLWNvbnRhaW5lci5wbHVnaW5mbG93ei1tb2RhbCAubW9kYWwge1xuICAgICAgICB3aWR0aDogY2FsYygxMDB2dyAtIDIwMHB4KTtcbiAgICAgICAgaGVpZ2h0OiBjYWxjKDEwMHZoIC0gMTAwcHgpO1xuICAgICAgICBtYXgtd2lkdGg6IGNhbGMoMTAwdncgLSAyMDBweCk7XG4gICAgICAgIG1heC1oZWlnaHQ6IGNhbGMoMTAwdmggLSAxMDBweCk7XG4gICAgfVxuXG4gICAgLm1vZGFsLWNvbnRhaW5lci5wbHVnaW5mbG93ei1tb2RhbCAubW9kYWwtY29udGVudCB7XG4gICAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICB9XG5cbiAgICAvKiA9PT09PSBEYXNoYm9hcmQgPT09PT0gKi9cbiAgICAucGx1Z2luZmxvd3otZGFzaGJvYXJkLWNvbnRhaW5lciB7XG4gICAgICAgIHBhZGRpbmc6IDIwcHg7XG4gICAgICAgIGZsZXg6IDE7XG4gICAgICAgIG92ZXJmbG93LXk6IGF1dG87XG4gICAgfVxuXG4gICAgLyogRW4gbW9kZSBwb3B1cCAqL1xuICAgIC5tb2RhbC1jb250YWluZXIgLnBsdWdpbmZsb3d6LWRhc2hib2FyZC1jb250YWluZXIge1xuICAgICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgfVxuXG4gICAgLyogRW4gbW9kZSB0YWIvc2lkZWJhciAqL1xuICAgIC53b3Jrc3BhY2UtbGVhZi1jb250ZW50W2RhdGEtdHlwZT1cInBsdWdpbmZsb3d6LXZpZXdcIl0gLnBsdWdpbmZsb3d6LWRhc2hib2FyZC1jb250YWluZXIge1xuICAgICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgfVxuXG4gICAgLyogPT09PT0gUGx1Z2lucyBMaXN0ID09PT09ICovXG4gICAgLnBsdWdpbmZsb3d6LXBsdWdpbnMtbGlzdCB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGdhcDogMjBweDtcbiAgICAgICAgcGFkZGluZzogMjBweCAwO1xuICAgIH1cblxuICAgIC5wbHVnaW5mbG93ei1wbHVnaW4taXRlbSB7XG4gICAgICAgIGJhY2tncm91bmQ6IHZhcigtLWJhY2tncm91bmQtc2Vjb25kYXJ5KTtcbiAgICAgICAgcGFkZGluZzogMTVweDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNXB4O1xuICAgIH1cblxuICAgIC8qIE1vZGUgQ2FyZHMgKi9cbiAgICAucGx1Z2luZmxvd3otY2FyZHMtZ3JpZCB7XG4gICAgICAgIGRpc3BsYXk6IGdyaWQ7XG4gICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KGF1dG8tZmlsbCwgbWlubWF4KDMwMHB4LCAxZnIpKTtcbiAgICAgICAgZ2FwOiAyMHB4O1xuICAgICAgICBwYWRkaW5nOiAyMHB4O1xuICAgIH1cblxuICAgIC5wbHVnaW5mbG93ei1jYXJkIHtcbiAgICAgICAgYmFja2dyb3VuZDogdmFyKC0tYmFja2dyb3VuZC1zZWNvbmRhcnkpO1xuICAgICAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgICAgIHBhZGRpbmc6IDE1cHg7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGdhcDogMTBweDtcbiAgICB9XG5cbiAgICAucGx1Z2luZmxvd3otY2FyZC1oZWFkZXIge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgICAgIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICAgIH1cblxuICAgIC5wbHVnaW5mbG93ei1jYXJkLWRlc2NyaXB0aW9uIHtcbiAgICAgICAgZmxleDogMTtcbiAgICAgICAgY29sb3I6IHZhcigtLXRleHQtbXV0ZWQpO1xuICAgIH1cblxuICAgIC5wbHVnaW5mbG93ei1jYXJkLWZvb3RlciB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICB9XG5cbiAgICAvKiBIZWFkZXIgYXZlYyB0b2dnbGUgKi9cbiAgICAucGx1Z2luZmxvd3otaGVhZGVyIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBwYWRkaW5nOiAwIDIwcHg7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDIwcHg7XG4gICAgfVxuXG4gICAgLnBsdWdpbmZsb3d6LWhlYWRlciAuc2V0dGluZy1pdGVtIHtcbiAgICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgICBwYWRkaW5nOiAwO1xuICAgIH1cblxuICAgIC5wbHVnaW5mbG93ei1oZWFkZXIgLnNldHRpbmctaXRlbS1jb250cm9sIHtcbiAgICAgICAgcGFkZGluZzogMDtcbiAgICB9XG5cbiAgICAucGx1Z2luZmxvd3otaGVhZGVyIC5jbGlja2FibGUtaWNvbiB7XG4gICAgICAgIHBhZGRpbmc6IDRweDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNHB4O1xuICAgIH1cblxuICAgIC5wbHVnaW5mbG93ei1oZWFkZXIgLmNsaWNrYWJsZS1pY29uOmhvdmVyIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmFja2dyb3VuZC1tb2RpZmllci1ob3Zlcik7XG4gICAgfVxuXG4gICAgLnBsdWdpbmZsb3d6LXZpZXctYnV0dG9uIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0taW50ZXJhY3RpdmUtYWNjZW50KTtcbiAgICAgICAgY29sb3I6IHZhcigtLXRleHQtb24tYWNjZW50KTtcbiAgICAgICAgcGFkZGluZzogNHB4IDEycHg7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICBib3JkZXI6IG5vbmU7XG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjE1cyBlYXNlO1xuICAgIH1cblxuICAgIC5wbHVnaW5mbG93ei12aWV3LWJ1dHRvbjpob3ZlciB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWludGVyYWN0aXZlLWFjY2VudC1ob3Zlcik7XG4gICAgfVxuXG4gICAgLnBsdWdpbmZsb3d6LXJhdGluZy1jb250YWluZXIsXG4gICAgLnBsdWdpbmZsb3d6LWNhcmQtcmF0aW5nIHtcbiAgICAgICAgbWFyZ2luLXRvcDogMTBweDtcbiAgICB9XG5cbiAgICAucGx1Z2luZmxvd3otcmF0aW5nLWNvbnRhaW5lciAuc2V0dGluZy1pdGVtLFxuICAgIC5wbHVnaW5mbG93ei1jYXJkLXJhdGluZyAuc2V0dGluZy1pdGVtIHtcbiAgICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgICBwYWRkaW5nOiAwO1xuICAgIH1cblxuICAgIC5wbHVnaW5mbG93ei1jYXJkLXJhdGluZyAuc2V0dGluZy1pdGVtLW5hbWUge1xuICAgICAgICBmb250LXNpemU6IDE2cHg7XG4gICAgICAgIHBhZGRpbmc6IDA7XG4gICAgfVxuXG4gICAgLnBsdWdpbmZsb3d6LWNhcmQtcmF0aW5nIC5zbGlkZXIge1xuICAgICAgICBmbGV4OiAxO1xuICAgIH1cblxuICAgIC5wbHVnaW5mbG93ei1wcm9ncmVzcyB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBoZWlnaHQ6IDRweDtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmFja2dyb3VuZC1tb2RpZmllci1ib3JkZXIpO1xuICAgICAgICBib3JkZXItcmFkaXVzOiAycHg7XG4gICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDRweDtcbiAgICB9XG5cbiAgICAucGx1Z2luZmxvd3otcHJvZ3Jlc3MtdmFsdWUge1xuICAgICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWludGVyYWN0aXZlLWFjY2VudCk7XG4gICAgICAgIHRyYW5zaXRpb246IHdpZHRoIDAuMnMgZWFzZTtcbiAgICB9XG5cbiAgICAucGx1Z2luZmxvd3otcmF0aW5nLXRleHQge1xuICAgICAgICBmb250LXNpemU6IDEycHg7XG4gICAgICAgIGNvbG9yOiB2YXIoLS10ZXh0LW11dGVkKTtcbiAgICB9XG5cbiAgICAucGx1Z2luZmxvd3otY2FyZC1yYXRpbmcge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBnYXA6IDhweDtcbiAgICAgICAgbWFyZ2luLXRvcDogOHB4O1xuICAgIH1cblxuICAgIC5wcm9ncmVzcy1jb250YWluZXIge1xuICAgICAgICBmbGV4OiAxO1xuICAgICAgICBoZWlnaHQ6IDRweDtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmFja2dyb3VuZC1tb2RpZmllci1ib3JkZXIpO1xuICAgICAgICBib3JkZXItcmFkaXVzOiAycHg7XG4gICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgdHJhbnNpdGlvbjogaGVpZ2h0IDAuMTVzIGVhc2U7XG4gICAgfVxuXG4gICAgLnByb2dyZXNzLWNvbnRhaW5lcjpob3ZlciB7XG4gICAgICAgIGhlaWdodDogOHB4O1xuICAgIH1cblxuICAgIC5wcm9ncmVzcy1iYXIge1xuICAgICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWludGVyYWN0aXZlLWFjY2VudCk7XG4gICAgICAgIHRyYW5zaXRpb246IHdpZHRoIDAuMnMgZWFzZTtcbiAgICB9XG5cbiAgICAucGx1Z2luZmxvd3otcmF0aW5nLXZhbHVlIHtcbiAgICAgICAgZm9udC1zaXplOiAxMnB4O1xuICAgICAgICBjb2xvcjogdmFyKC0tdGV4dC1tdXRlZCk7XG4gICAgICAgIG1pbi13aWR0aDogMzJweDtcbiAgICAgICAgdGV4dC1hbGlnbjogcmlnaHQ7XG4gICAgfVxuYDtcblxuZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVucmVnaXN0ZXJTdHlsZXMoKSB7XG5jb25zdCBzdHlsZUVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BsdWdpbmZsb3d6LXN0eWxlcycpO1xuaWYgKHN0eWxlRWwpIHtcbiAgICBzdHlsZUVsLnJlbW92ZSgpO1xufVxufSAiLCAiaW1wb3J0IHsgQXBwLCBQbHVnaW4sIFBsdWdpblNldHRpbmdUYWIsIFNldHRpbmcsIE1vZGFsfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgeyBWaWV3TW9kZSB9IGZyb20gJy4vVmlld01vZGUnO1xuaW1wb3J0IHsgVFZpZXdNb2RlLCBJUGx1Z2luRGF0YSB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgVHJhbnNsYXRpb25zIH0gZnJvbSAnLi9UcmFuc2xhdGlvbnMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIERlZmF1bHRTZXR0aW5ncyB7XG4gICBsYW5ndWFnZTogc3RyaW5nO1xuICAgY3VycmVudE1vZGU6IFRWaWV3TW9kZTtcbiAgIGFjdGl2ZUxlYWZJZDogc3RyaW5nIHwgbnVsbDtcbiAgIGVuYWJsZUF1dG9VcGRhdGU6IGJvb2xlYW47XG4gICBub3Rlc0ZvbGRlcjogc3RyaW5nO1xuICAgdGVtcGxhdGU6IHN0cmluZztcbiAgIGRlZmF1bHRWaWV3TW9kZTogJ2xpc3QnIHwgJ2NhcmRzJztcbn1cblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfU0VUVElOR1M6IERlZmF1bHRTZXR0aW5ncyA9IHtcbiAgIGxhbmd1YWdlOiAnZnInLFxuICAgY3VycmVudE1vZGU6ICdwb3B1cCcsXG4gICBhY3RpdmVMZWFmSWQ6IG51bGwsXG4gICBlbmFibGVBdXRvVXBkYXRlOiB0cnVlLFxuICAgbm90ZXNGb2xkZXI6ICdwbHVnaW5Ob3RlcycsXG4gICB0ZW1wbGF0ZTogJyMge3tuYW1lfX1cXG5cXG57e2Rlc2NyaXB0aW9ufX1cXG5cXG57e3VybH19JyxcbiAgIGRlZmF1bHRWaWV3TW9kZTogJ2xpc3QnXG59O1xuXG5leHBvcnQgY2xhc3MgU2V0dGluZ3Mge1xuICAgcHJpdmF0ZSBzdGF0aWMgcGx1Z2luOiBQbHVnaW47XG4gICBwcml2YXRlIHN0YXRpYyBzZXR0aW5nczogRGVmYXVsdFNldHRpbmdzO1xuXG4gICBzdGF0aWMgaW5pdGlhbGl6ZShwbHVnaW46IFBsdWdpbikge1xuICAgICAgdGhpcy5wbHVnaW4gPSBwbHVnaW47XG4gICB9XG5cbiAgIHN0YXRpYyBhc3luYyBsb2FkU2V0dGluZ3MoKTogUHJvbWlzZTxEZWZhdWx0U2V0dGluZ3M+IHtcbiAgICAgIGNvbnN0IHNhdmVkRGF0YSA9IGF3YWl0IHRoaXMucGx1Z2luLmxvYWREYXRhKCk7XG4gICAgICB0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9TRVRUSU5HUywgc2F2ZWREYXRhIHx8IHt9KTtcbiAgICAgIHJldHVybiB0aGlzLnNldHRpbmdzO1xuICAgfVxuXG4gICBzdGF0aWMgYXN5bmMgc2F2ZVNldHRpbmdzKHNldHRpbmdzOiBQYXJ0aWFsPERlZmF1bHRTZXR0aW5ncz4pIHtcbiAgICAgIHRoaXMuc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHRoaXMuc2V0dGluZ3MgfHwgREVGQVVMVF9TRVRUSU5HUywgc2V0dGluZ3MpO1xuICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7XG4gICB9XG5cbiAgIHN0YXRpYyBhc3luYyByZWZyZXNoKCkge1xuICAgICAgaWYgKHRoaXMucGx1Z2luICYmICdyZWZyZXNoJyBpbiB0aGlzLnBsdWdpbikge1xuICAgICAgICAgYXdhaXQgKHRoaXMucGx1Z2luIGFzIGFueSkucmVmcmVzaCgpO1xuICAgICAgfVxuICAgfVxuXG4gICBzdGF0aWMgYXN5bmMgZ2V0Vmlld01vZGUoKTogUHJvbWlzZTxUVmlld01vZGU+IHtcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCB0aGlzLnBsdWdpbi5sb2FkRGF0YSgpO1xuICAgICAgcmV0dXJuIChkYXRhPy5jdXJyZW50TW9kZSB8fCBERUZBVUxUX1NFVFRJTkdTLmN1cnJlbnRNb2RlKSBhcyBUVmlld01vZGU7XG4gICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTZXR0aW5nc1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuICAgcGx1Z2luOiBQbHVnaW47XG4gICBzZXR0aW5nczogRGVmYXVsdFNldHRpbmdzICYgSVBsdWdpbkRhdGE7XG5cbiAgIGNvbnN0cnVjdG9yKFxuICAgICAgYXBwOiBBcHAsIFxuICAgICAgcGx1Z2luOiBQbHVnaW4sIFxuICAgICAgc2V0dGluZ3M6IERlZmF1bHRTZXR0aW5ncywgXG4gICAgICBwcml2YXRlIHZpZXdNb2RlOiBWaWV3TW9kZSxcbiAgICAgIHByaXZhdGUgdHJhbnNsYXRpb25zOiBUcmFuc2xhdGlvbnNcbiAgICkge1xuICAgICAgc3VwZXIoYXBwLCBwbHVnaW4pO1xuICAgICAgdGhpcy5wbHVnaW4gPSBwbHVnaW47XG4gICAgICB0aGlzLnNldHRpbmdzID0ge1xuICAgICAgICAgLi4uREVGQVVMVF9TRVRUSU5HUyxcbiAgICAgICAgIGdyb3VwczogW10sXG4gICAgICAgICBwbHVnaW5zOiBbXVxuICAgICAgfTtcbiAgICAgIFxuICAgICAgdGhpcy5sb2FkU2V0dGluZ3MoKS50aGVuKCgpID0+IHtcbiAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgfSk7XG4gICB9XG5cbiAgIHByaXZhdGUgYXN5bmMgbG9hZFNldHRpbmdzKCkge1xuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHRoaXMucGx1Z2luLmxvYWREYXRhKCk7XG4gICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgdGhpcy5zZXR0aW5ncyA9IHtcbiAgICAgICAgICAgIC4uLkRFRkFVTFRfU0VUVElOR1MsXG4gICAgICAgICAgICAuLi5kYXRhLFxuICAgICAgICAgICAgZ3JvdXBzOiBkYXRhLmdyb3VwcyB8fCBbXSxcbiAgICAgICAgICAgIHBsdWdpbnM6IGRhdGEucGx1Z2lucyB8fCBbXVxuICAgICAgICAgfTtcbiAgICAgIH1cbiAgIH1cblxuICAgYXN5bmMgZGlzcGxheSgpOiB2b2lkIHtcbiAgICAgIGF3YWl0IHRoaXMubG9hZFNldHRpbmdzKCk7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lckVsIH0gPSB0aGlzO1xuICAgICAgY29udGFpbmVyRWwuZW1wdHkoKTtcblxuLy8gTW9kZSBkJ2FmZmljaGFnZSBwYXIgZFx1MDBFOWZhdXRcbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgLnNldE5hbWUodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MuZGVmYXVsdFZpZXdNb2RlJykpXG4gICAgICAgICAuc2V0RGVzYyh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5kZWZhdWx0Vmlld01vZGVEZXNjJykpXG4gICAgICAgICAuYWRkRHJvcGRvd24oZHJvcGRvd24gPT4gZHJvcGRvd25cbiAgICAgICAgICAgIC5hZGRPcHRpb24oJ3RhYicsIHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLnRhYicpKVxuICAgICAgICAgICAgLmFkZE9wdGlvbignc2lkZWJhcicsIHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLnNpZGViYXInKSlcbiAgICAgICAgICAgIC5hZGRPcHRpb24oJ3BvcHVwJywgdGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MucG9wdXAnKSlcbiAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnNldHRpbmdzLmN1cnJlbnRNb2RlKVxuICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5jdXJyZW50TW9kZSA9IHZhbHVlIGFzIFRWaWV3TW9kZTtcbiAgICAgICAgICAgICAgIGF3YWl0IFNldHRpbmdzLnNhdmVTZXR0aW5ncyh7IGN1cnJlbnRNb2RlOiB2YWx1ZSBhcyBUVmlld01vZGUgfSk7XG4gICAgICAgICAgICAgICBhd2FpdCB0aGlzLnZpZXdNb2RlLnNldFZpZXcodmFsdWUgYXMgVFZpZXdNb2RlKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgIFxuLy8gRG9zc2llciBkZXMgcGx1Z2luc1xuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAuc2V0TmFtZSh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5wbHVnaW5Gb2xkZXIubmFtZScpKVxuICAgICAgICAgLnNldERlc2ModGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MucGx1Z2luRm9sZGVyLmRlc2MnKSlcbiAgICAgICAgIC5hZGRUZXh0KHRleHQgPT4gdGV4dFxuICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMuc2V0dGluZ3Mubm90ZXNGb2xkZXIpXG4gICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICBhd2FpdCBTZXR0aW5ncy5zYXZlU2V0dGluZ3MoeyBub3Rlc0ZvbGRlcjogdmFsdWUgfSk7XG4gICAgICAgICAgICAgICBhd2FpdCB0aGlzLmluaXRpYWxpemVGb2xkZXJzKHZhbHVlLCB0aGlzLnNldHRpbmdzLmdyb3Vwcyk7XG4gICAgICAgICAgICAgICBuZXcgTm90aWNlKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLnBsdWdpbkZvbGRlci51cGRhdGVkJykpO1xuICAgICAgICAgICAgfSkpO1xuXG4gXG4vLyBUZW1wbGF0ZSBkZXMgbm90ZXNcbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgLnNldE5hbWUodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MudGVtcGxhdGUubmFtZScpKVxuICAgICAgICAgLnNldERlc2ModGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MudGVtcGxhdGUuZGVzYycpKVxuICAgICAgICAgLmFkZFRleHRBcmVhKCh0ZXh0KSA9PiB0ZXh0XG4gICAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoJyMge3tuYW1lfX1cXG5cXG57e2Rlc2NyaXB0aW9ufX1cXG5cXG57e3VybH19JylcbiAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnNldHRpbmdzLnRlbXBsYXRlIHx8ICcnKVxuICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgYXdhaXQgU2V0dGluZ3Muc2F2ZVNldHRpbmdzKHsgdGVtcGxhdGU6IHZhbHVlIH0pO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgXG4vLyBEb3NzaWVyIGRlcyBncm91cGVzXG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgIC5zZXROYW1lKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLmdyb3VwRm9sZGVyLm5hbWUnKSlcbiAgICAgICAgIC5zZXREZXNjKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLmdyb3VwRm9sZGVyLmRlc2MnKSlcbiAgICAgICAgIC5hZGRUZXh0KHRleHQgPT4gdGV4dFxuICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMuc2V0dGluZ3Mubm90ZXNGb2xkZXIpXG4gICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICBhd2FpdCBTZXR0aW5ncy5zYXZlU2V0dGluZ3MoeyBub3Rlc0ZvbGRlcjogdmFsdWUgfSk7XG4gICAgICAgICAgICAgICBhd2FpdCB0aGlzLmluaXRpYWxpemVGb2xkZXJzKHZhbHVlLCB0aGlzLnNldHRpbmdzLmdyb3Vwcyk7XG4gICAgICAgICAgICAgICBuZXcgTm90aWNlKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLmdyb3VwRm9sZGVyLnVwZGF0ZWQnKSk7XG4gICAgICAgICAgICB9KSk7XG5cbi8vIFNlY3Rpb24gSW1wb3J0L0V4cG9ydFxuICAgICAgY29udGFpbmVyRWwuY3JlYXRlRWwoJ2gxJywge3RleHQ6IHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLmltcG9ydEV4cG9ydC50aXRsZScpfSk7XG5cbi8vIEltcG9ydCBKU09OXG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgIC5zZXROYW1lKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uSW1wb3J0Lm5hbWUnKSlcbiAgICAgICAgIC5zZXREZXNjKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uSW1wb3J0LmRlc2MnKSlcbiAgICAgICAgIC5hZGRCdXR0b24oKGJ1dHRvbjogQnV0dG9uQ29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICBidXR0b25cbiAgICAgICAgICAgICAgIC5zZXRCdXR0b25UZXh0KHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uSW1wb3J0LmJ1dHRvbicpKVxuICAgICAgICAgICAgICAgLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgICAgICAgICAgICAgaW5wdXQudHlwZSA9ICdmaWxlJztcbiAgICAgICAgICAgICAgICAgIGlucHV0LmFjY2VwdCA9ICcuanNvbic7XG4gICAgICAgICAgICAgICAgICBpbnB1dC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgICAgY29udGFpbmVyRWwuYXBwZW5kQ2hpbGQoaW5wdXQpO1xuXG4gICAgICAgICAgICAgICAgICBpbnB1dC5vbmNoYW5nZSA9IGFzeW5jIChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgIGlmICghdGFyZ2V0LmZpbGVzPy5sZW5ndGgpIHJldHVybjtcblxuICAgICAgICAgICAgICAgICAgICAgY29uc3QgbG9hZGluZ05vdGljZSA9IG5ldyBOb3RpY2UodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25JbXBvcnQubG9hZGluZycpLCAwKTtcblxuICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpbGUgPSB0YXJnZXQuZmlsZXNbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZWFkZXIub25sb2FkID0gYXN5bmMgKGV2ZW50OiBQcm9ncmVzc0V2ZW50PEZpbGVSZWFkZXI+KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldD8ucmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjb25maWcgPSBKU09OLnBhcnNlKGV2ZW50LnRhcmdldC5yZXN1bHQgYXMgc3RyaW5nKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVlx1MDBFOXJpZmllciBxdWUgbGUgZmljaGllciBjb250aWVudCBsZXMgY2hhbXBzIGVzc2VudGllbHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghY29uZmlnLnBsdWdpbnMgfHwgIUFycmF5LmlzQXJyYXkoY29uZmlnLmdyb3VwcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25JbXBvcnQuZXJyb3InKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENyXHUwMEU5ZXIgdW5lIHNhdXZlZ2FyZGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJhY2t1cCA9IGF3YWl0IHRoaXMucGx1Z2luLmxvYWREYXRhKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBiYWNrdXBKc29uID0gSlNPTi5zdHJpbmdpZnkoYmFja3VwLCBudWxsLCAyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJhY2t1cEJsb2IgPSBuZXcgQmxvYihbYmFja3VwSnNvbl0sIHsgdHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYmFja3VwVXJsID0gd2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwoYmFja3VwQmxvYik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBiYWNrdXBBID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja3VwQS5ocmVmID0gYmFja3VwVXJsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja3VwQS5kb3dubG9hZCA9ICdwbHVnaW4tZmxvd3otYmFja3VwLmpzb24nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja3VwQS5jbGljaygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LlVSTC5yZXZva2VPYmplY3RVUkwoYmFja3VwVXJsKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXBwbGlxdWVyIGxhIG5vdXZlbGxlIGNvbmZpZ3VyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IFNldHRpbmdzLnNhdmVTZXR0aW5ncyhjb25maWcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZSh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkltcG9ydC5zdWNjZXNzJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyZXVyIGxvcnMgZHUgcGFyc2luZzonLCBlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgTm90aWNlKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uSW1wb3J0LmVycm9yJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmVhZGVyLnJlYWRBc1RleHQoZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9hZGluZ05vdGljZS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgTm90aWNlKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uSW1wb3J0LmVycm9yJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQudmFsdWUgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgIGlucHV0LmNsaWNrKCk7XG4gICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGJ1dHRvbjtcbiAgICAgICAgIH0pO1xuXG4vLyBFeHBvcnQgSlNPTlxuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAuc2V0TmFtZSh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkV4cG9ydC5uYW1lJykpXG4gICAgICAgICAuc2V0RGVzYyh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkV4cG9ydC5kZXNjJykpXG4gICAgICAgICAuYWRkQnV0dG9uKChidXR0b246IEJ1dHRvbkNvbXBvbmVudCkgPT4gYnV0dG9uXG4gICAgICAgICAgICAuc2V0QnV0dG9uVGV4dCh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkV4cG9ydC5idXR0b24nKSlcbiAgICAgICAgICAgIC5vbkNsaWNrKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgIGNvbnN0IGxvYWRpbmdOb3RpY2UgPSBuZXcgTm90aWNlKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uRXhwb3J0LmxvYWRpbmcnKSwgMCk7XG4gICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHRoaXMucGx1Z2luLmxvYWREYXRhKCk7XG4gICAgICAgICAgICAgICAgICBjb25zdCBqc29uU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoZGF0YSwgbnVsbCwgMik7XG5cbiAgICAgICAgICAgICAgICAgIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbanNvblN0cmluZ10sIHsgdHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nIH0pO1xuICAgICAgICAgICAgICAgICAgY29uc3QgdXJsID0gd2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG4gICAgICAgICAgICAgICAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICAgICAgICAgICAgYS5ocmVmID0gdXJsO1xuICAgICAgICAgICAgICAgICAgYS5kb3dubG9hZCA9ICdwbHVnaW4tZmxvd3otY29uZmlnLmpzb24nO1xuICAgICAgICAgICAgICAgICAgYS5jbGljaygpO1xuICAgICAgICAgICAgICAgICAgd2luZG93LlVSTC5yZXZva2VPYmplY3RVUkwodXJsKTtcblxuICAgICAgICAgICAgICAgICAgbG9hZGluZ05vdGljZS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICBuZXcgTm90aWNlKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uRXhwb3J0LnN1Y2Nlc3MnKSk7XG4gICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgbG9hZGluZ05vdGljZS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICBuZXcgTm90aWNlKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uRXhwb3J0LmVycm9yJykpO1xuICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSk7XG5cbiAgY29udGFpbmVyRWwuY3JlYXRlRWwoJ2hyJylcblxuLy8gU2VjdGlvbiBkZSBnZXN0aW9uIGRlcyBncm91cGVzXG4gIGNvbnRhaW5lckVsLmNyZWF0ZUVsKCdoMScsIHt0ZXh0OiB0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5ncm91cHMudGl0bGUnKX0pXG5cbi8vIEFmZmljaGVyIGxlcyBncm91cGVzIGV4aXN0YW50c1xuICB0aGlzLnNldHRpbmdzLmdyb3Vwcy5mb3JFYWNoKChncm91cDogc3RyaW5nLCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgaWYgKGdyb3VwICE9PSAnU2FucyBncm91cGUnKSB7XG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgLnNldE5hbWUoZ3JvdXApXG4gICAgICAgIC5hZGRCdXR0b24oKGJ1dHRvbjogQnV0dG9uQ29tcG9uZW50KSA9PiBidXR0b25cbiAgICAgICAgICAuc2V0QnV0dG9uVGV4dCh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5ncm91cHMuZGVsZXRlLmJ1dHRvbicpKVxuICAgICAgICAgIC5zZXRXYXJuaW5nKClcbiAgICAgICAgICAub25DbGljayhhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBjb25zdCBncm91cFBhdGggPSBgJHt0aGlzLnNldHRpbmdzLm5vdGVzRm9sZGVyfS8ke2dyb3VwfWA7XG5cbi8vIERcdTAwRTlwbGFjZXIgbGVzIHBsdWdpbnMgZGUgY2UgZ3JvdXBlIHZlcnMgXCJTYW5zIGdyb3VwZVwiXG4gICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MucGx1Z2lucy5mb3JFYWNoKHBsdWdpbiA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHBsdWdpbi5ncm91cC5pbmNsdWRlcyhncm91cCkpIHtcbiAgICAgICAgICAgICAgICAgIHBsdWdpbi5ncm91cCA9IHBsdWdpbi5ncm91cC5maWx0ZXIoZyA9PiBnICE9PSBncm91cCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcblxuLy8gU3VwcHJpbWVyIGxlIGdyb3VwZSBkZXMgcGFyYW1cdTAwRTh0cmVzXG4gICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuZ3JvdXBzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgIGF3YWl0IFNldHRpbmdzLnNhdmVTZXR0aW5ncyh0aGlzLnNldHRpbmdzKTtcblxuICAgICAgICAgICAgICBuZXcgTm90aWNlKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLmdyb3Vwcy5kZWxldGUuc3VjY2VzcycpICsgYCA6ICR7Z3JvdXB9YCk7XG4gICAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgRXJyZXVyIGxvcnMgZGUgbGEgc3VwcHJlc3Npb24gZHUgZ3JvdXBlICR7Z3JvdXB9OmAsIGVycm9yKTtcbiAgICAgICAgICAgICAgbmV3IE5vdGljZSh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5ncm91cHMuZGVsZXRlLmVycm9yJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pKVxuICAgIH1cbiAgfSlcblxuLy8gQWpvdXRlciB1biBub3V2ZWF1IGdyb3VwZVxuICBsZXQgaW5wdXRUZXh0ID0gJyc7XG4gIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgIC5zZXROYW1lKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLmdyb3Vwcy5hZGQubmFtZScpKVxuICAgIC5zZXREZXNjKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLmdyb3Vwcy5hZGQuZGVzYycpKVxuICAgIC5hZGRUZXh0KHRleHQgPT4gdGV4dFxuICAgICAgLnNldFBsYWNlaG9sZGVyKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLmdyb3Vwcy5hZGQucGxhY2Vob2xkZXInKSlcbiAgICAgIC5zZXRWYWx1ZSgnJylcbiAgICAgIC5vbkNoYW5nZSgodmFsdWU6IHN0cmluZykgPT4ge1xuICAgICAgICBpbnB1dFRleHQgPSB2YWx1ZTtcbiAgICAgIH0pXG4gICAgICAuaW5wdXRFbC5hZGRFdmVudExpc3RlbmVyKCdrZXlwcmVzcycsIGFzeW5jIChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJyAmJiBpbnB1dFRleHQudHJpbSgpKSB7XG4gICAgICAgICAgY29uc3QgZ3JvdXBOYW1lID0gaW5wdXRUZXh0LnRyaW0oKTtcbiAgICAgICAgICBjb25zdCBjdXJyZW50U2V0dGluZ3MgPSB0aGlzLnBsdWdpbi5zZXR0aW5nc1NlcnZpY2UuZ2V0U2V0dGluZ3MoKTtcbiAgICAgICAgICBpZiAoIWN1cnJlbnRTZXR0aW5ncy5ncm91cHMuaW5jbHVkZXMoZ3JvdXBOYW1lKSkge1xuLy8gQ3JcdTAwRTllciBsZSBkb3NzaWVyIHBvdXIgbGUgbm91dmVhdSBncm91cGVcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLmZpbGVTZXJ2aWNlLmVuc3VyZUZvbGRlcihgJHtjdXJyZW50U2V0dGluZ3MucnNzRm9sZGVyfS8ke2dyb3VwTmFtZX1gKTtcbiAgICAgICAgICAgIFxuLy8gQWpvdXRlciBsZSBncm91cGUgYXV4IHBhcmFtXHUwMEU4dHJlc1xuICAgICAgICAgICAgY3VycmVudFNldHRpbmdzLmdyb3Vwcy5wdXNoKGdyb3VwTmFtZSk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zZXR0aW5nc1NlcnZpY2UudXBkYXRlU2V0dGluZ3MoY3VycmVudFNldHRpbmdzKTtcbiAgICAgICAgICAgIG5ldyBOb3RpY2UodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MuZ3JvdXBzLmFkZC5zdWNjZXNzJykgKyBgIDogJHtncm91cE5hbWV9YCk7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3IE5vdGljZSh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5ncm91cHMuYWRkLmVycm9yJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSkpO1xuXG4gIGNvbnRhaW5lckVsLmNyZWF0ZUVsKCdocicpO1xuICBjb250YWluZXJFbC5jcmVhdGVFbCgnaDEnLCB7dGV4dDogdGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MucGx1Z2lucy50aXRsZScpfSk7XG5cbi8vIEJhcnJlIGRlIHJlY2hlcmNoZSBwb3VyIGxlcyBwbHVnaW5zXG4gICAgICBjb25zdCBzZWFyY2hDb250YWluZXIgPSBjb250YWluZXJFbC5jcmVhdGVEaXYoJ3BsdWdpbmZsb3d6LXNlYXJjaC1jb250YWluZXInKTtcbiAgICAgIGNvbnN0IHNlYXJjaElucHV0ID0gc2VhcmNoQ29udGFpbmVyLmNyZWF0ZUVsKCdpbnB1dCcsIHtcbiAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgIHBsYWNlaG9sZGVyOiB0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5wbHVnaW5zLnNlYXJjaC5wbGFjZWhvbGRlcicpLFxuICAgICAgICAgY2xzOiAncGx1Z2luZmxvd3otcGx1Z2luLXNlYXJjaC1pbnB1dCdcbiAgICAgIH0pO1xuXG4vLyBDb250YWluZXIgcG91ciB0b3VzIGxlcyBwbHVnaW5zXG4gICAgICBjb25zdCBwbHVnaW5zQ29udGFpbmVyID0gY29udGFpbmVyRWwuY3JlYXRlRGl2KCdwbHVnaW5mbG93ei1wbHVnaW5zLWNvbnRhaW5lcicpO1xuICBcbi8vIEZvbmN0aW9uIHBvdXIgZmlsdHJlciBldCBhZmZpY2hlciBsZXMgcGx1Z2luc1xuICAgICAgY29uc3QgZmlsdGVyQW5kRGlzcGxheVBsdWdpbnMgPSAoc2VhcmNoVGVybSA9ICcnKSA9PiB7XG4gICAgICAgICBwbHVnaW5zQ29udGFpbmVyLmVtcHR5KCk7XG4gICAgICAgICBjb25zdCBncm91cGVkUGx1Z2luczogUmVjb3JkPHN0cmluZywgQXJyYXk8e3BsdWdpbjogSVBsdWdpbiwgaW5kZXg6IG51bWJlcn0+PiA9IHt9O1xuICAgICAgICAgXG4gICAgICAgICB0aGlzLnNldHRpbmdzLnBsdWdpbnNcbiAgICAgICAgICAgIC5maWx0ZXIocGx1Z2luID0+IFxuICAgICAgICAgICAgICAgcGx1Z2luLnRpdGxlLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc2VhcmNoVGVybS50b0xvd2VyQ2FzZSgpKSB8fFxuICAgICAgICAgICAgICAgcGx1Z2luLmRlc2NyaXB0aW9uLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc2VhcmNoVGVybS50b0xvd2VyQ2FzZSgpKSB8fFxuICAgICAgICAgICAgICAgcGx1Z2luLmdyb3VwLnNvbWUoZyA9PiBnLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc2VhcmNoVGVybS50b0xvd2VyQ2FzZSgpKSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5mb3JFYWNoKChwbHVnaW4sIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICBwbHVnaW4uZ3JvdXAuZm9yRWFjaChncm91cCA9PiB7XG4gICAgICAgICAgICAgICAgICBpZiAoIWdyb3VwZWRQbHVnaW5zW2dyb3VwXSkge1xuICAgICAgICAgICAgICAgICAgICAgZ3JvdXBlZFBsdWdpbnNbZ3JvdXBdID0gW107XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBncm91cGVkUGx1Z2luc1tncm91cF0ucHVzaCh7cGx1Z2luLCBpbmRleH0pO1xuICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgT2JqZWN0LmVudHJpZXMoZ3JvdXBlZFBsdWdpbnMpLmZvckVhY2goKFtncm91cE5hbWUsIHBsdWdpbnNdKSA9PiB7XG4gICAgICAgICAgICBwbHVnaW5zQ29udGFpbmVyLmNyZWF0ZUVsKCdoMicsIHt0ZXh0OiBncm91cE5hbWV9KTtcblxuICAgICAgICAgICAgcGx1Z2lucy5mb3JFYWNoKCh7cGx1Z2luLCBpbmRleH0pID0+IHtcbiAgICAgICAgICAgICAgIGNvbnN0IHBsdWdpbkNvbnRhaW5lciA9IHBsdWdpbnNDb250YWluZXIuY3JlYXRlRGl2KCdwbHVnaW5mbG93ei1wbHVnaW4tY29udGFpbmVyIGNvbGxhcHNlZCcpO1xuICAgICAgICAgICAgICAgY29uc3QgaGVhZGVyQ29udGFpbmVyID0gcGx1Z2luQ29udGFpbmVyLmNyZWF0ZURpdigncGx1Z2luZmxvd3otcGx1Z2luLWhlYWRlcicpO1xuICAgICAgICAgICAgICAgXG4vLyBBam91dGVyIGxlIHRpdHJlIGV0IGxlIHN0YXR1dCBkdSBwbHVnaW5cbiAgICAgICAgICAgICAgIGNvbnN0IHRpdGxlQ29udGFpbmVyID0gaGVhZGVyQ29udGFpbmVyLmNyZWF0ZURpdigncGx1Z2luZmxvd3otcGx1Z2luLXRpdGxlLWNvbnRhaW5lcicpO1xuICAgICAgICAgICAgICAgdGl0bGVDb250YWluZXIuY3JlYXRlRWwoJ3NwYW4nLCB7IHRleHQ6IHBsdWdpbi50aXRsZSB9KTtcbiAgICAgICAgICAgICAgIFxuLy8gQWpvdXRlciBsZXMgdGFnc1xuICAgICAgICAgICAgICAgY29uc3QgdGFnc0NvbnRhaW5lciA9IHRpdGxlQ29udGFpbmVyLmNyZWF0ZURpdigncGx1Z2luZmxvd3otcGx1Z2luLXRhZ3MtY29udGFpbmVyJyk7XG4gICAgICAgICAgICAgICBwbHVnaW4udGFncy5mb3JFYWNoKHRhZyA9PiB7XG4gICAgICAgICAgICAgICAgICB0YWdzQ29udGFpbmVyLmNyZWF0ZUVsKCdzcGFuJywgeyBcbiAgICAgICAgICAgICAgICAgICAgIHRleHQ6IHRhZyxcbiAgICAgICAgICAgICAgICAgICAgIGNsczogJ3BsdWdpbmZsb3d6LXBsdWdpbi10YWcnXG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICBjb25zdCBvcHRpb25zQ29udGFpbmVyID0gcGx1Z2luQ29udGFpbmVyLmNyZWF0ZURpdigncGx1Z2luZmxvd3otcGx1Z2luLW9wdGlvbnMnKTtcbiAgICAgICAgICAgICAgIG9wdGlvbnNDb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuLy8gQ3JcdTAwRTllciB1biBjb250ZW5ldXIgcG91ciBsZXMgYm91dG9uc1xuICAgICAgICAgICAgICAgY29uc3QgYnV0dG9uQ29udGFpbmVyID0gaGVhZGVyQ29udGFpbmVyLmNyZWF0ZURpdigncGx1Z2luZmxvd3otcGx1Z2luLWJ1dHRvbnMnKTtcblxuICAgICAgICAgICAgICAgbGV0IHRvZ2dsZUJ1dHRvbjogQnV0dG9uQ29tcG9uZW50O1xuXG4vLyBGb25jdGlvbiBwb3VyIHRvZ2dsZSBsZSBwbHVnaW5cbiAgICAgICAgICAgICAgIGNvbnN0IHRvZ2dsZVBsdWdpbiA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGlzQ29sbGFwc2VkID0gcGx1Z2luQ29udGFpbmVyLmNsYXNzTGlzdC5jb250YWlucygnY29sbGFwc2VkJyk7XG4gICAgICAgICAgICAgICAgICBwbHVnaW5Db250YWluZXIuY2xhc3NMaXN0LnRvZ2dsZSgnY29sbGFwc2VkJyk7XG4gICAgICAgICAgICAgICAgICBvcHRpb25zQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSBpc0NvbGxhcHNlZCA/ICdibG9jaycgOiAnbm9uZSc7XG4gICAgICAgICAgICAgICAgICBpZiAodG9nZ2xlQnV0dG9uKSB7XG4gICAgICAgICAgICAgICAgICAgICB0b2dnbGVCdXR0b24uc2V0SWNvbihpc0NvbGxhcHNlZCA/ICdjaGV2cm9uLXVwJyA6ICdjaGV2cm9uLWRvd24nKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgIH07XG5cbi8vIEFqb3V0ZXIgbGVzIGJvdXRvbnMgZGFucyBsZXVyIGNvbnRlbmV1clxuICAgICAgICAgICAgICAgbmV3IFNldHRpbmcoYnV0dG9uQ29udGFpbmVyKVxuICAgICAgICAgICAgICAgICAgLmFkZEV4dHJhQnV0dG9uKChidXR0b246IEJ1dHRvbkNvbXBvbmVudCkgPT4gYnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAuc2V0SWNvbihwbHVnaW4uYWN0aXZhdGUgPyAnY2hlY2stY2lyY2xlJyA6ICdjaXJjbGUnKVxuICAgICAgICAgICAgICAgICAgICAgLnNldFRvb2x0aXAocGx1Z2luLmFjdGl2YXRlID8gXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5wbHVnaW5zLmRlYWN0aXZhdGUudG9vbHRpcCcpIDogXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5wbHVnaW5zLmFjdGl2YXRlLnRvb2x0aXAnKSlcbiAgICAgICAgICAgICAgICAgICAgIC5vbkNsaWNrKGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsdWdpbi5hY3RpdmF0ZSA9ICFwbHVnaW4uYWN0aXZhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBTZXR0aW5ncy5zYXZlU2V0dGluZ3ModGhpcy5zZXR0aW5ncyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b24uc2V0SWNvbihwbHVnaW4uYWN0aXZhdGUgPyAnY2hlY2stY2lyY2xlJyA6ICdjaXJjbGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UodGhpcy50cmFuc2xhdGlvbnMudChwbHVnaW4uYWN0aXZhdGUgPyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICdzZXR0aW5ncy5wbHVnaW5zLmFjdGl2YXRlZCcgOiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICdzZXR0aW5ncy5wbHVnaW5zLmRlYWN0aXZhdGVkJ1xuICAgICAgICAgICAgICAgICAgICAgICAgKS5yZXBsYWNlKCd7dGl0bGV9JywgcGx1Z2luLnRpdGxlKSk7XG4gICAgICAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICAgICAgIC5hZGRFeHRyYUJ1dHRvbigoYnV0dG9uOiBCdXR0b25Db21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZUJ1dHRvbiA9IGJ1dHRvbjtcbiAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbi5zZXRJY29uKCdjaGV2cm9uLWRvd24nKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnNldFRvb2x0aXAodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MucGx1Z2lucy50b2dnbGUudG9vbHRpcCcpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uQ2xpY2soKCkgPT4gdG9nZ2xlUGx1Z2luKCkpO1xuICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJ1dHRvbjtcbiAgICAgICAgICAgICAgICAgIH0pO1xuXG4vLyBSZW5kcmUgbGUgaGVhZGVyIGNsaXF1YWJsZVxuICAgICAgICAgICAgICAgaGVhZGVyQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICBpZiAoIXRhcmdldC5jbG9zZXN0KCcucGx1Z2luZmxvd3otcGx1Z2luLWJ1dHRvbnMnKSkge1xuICAgICAgICAgICAgICAgICAgICAgdG9nZ2xlUGx1Z2luKCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICB9KTtcblxuLy8gT3B0aW9ucyBkdSBwbHVnaW5cbiAgICAgICAgICAgICAgIG5ldyBTZXR0aW5nKG9wdGlvbnNDb250YWluZXIpXG4gICAgICAgICAgICAgICAgICAuc2V0TmFtZSh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5wbHVnaW5zLm9wdGlvbnMuc3RhdHVzJykpXG4gICAgICAgICAgICAgICAgICAuYWRkRHJvcGRvd24oKGRyb3Bkb3duOiBEcm9wZG93bkNvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgZHJvcGRvd24uYWRkT3B0aW9uKCdleHBsb3JpbmcnLCB0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5wbHVnaW5zLnN0YXR1cy5leHBsb3JpbmcnKSk7XG4gICAgICAgICAgICAgICAgICAgICBkcm9wZG93bi5hZGRPcHRpb24oJ2FjdGl2ZScsIHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLnBsdWdpbnMuc3RhdHVzLmFjdGl2ZScpKTtcbiAgICAgICAgICAgICAgICAgICAgIGRyb3Bkb3duLmFkZE9wdGlvbignaW5hY3RpdmUnLCB0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5wbHVnaW5zLnN0YXR1cy5pbmFjdGl2ZScpKTtcbiAgICAgICAgICAgICAgICAgICAgIGRyb3Bkb3duLnNldFZhbHVlKHBsdWdpbi5zdGF0dXNbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgZHJvcGRvd24ub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzLnBsdWdpbnNbaW5kZXhdLnN0YXR1cyA9IFt2YWx1ZSBhcyBUUGx1Z2luU3RhdHVzXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IFNldHRpbmdzLnNhdmVTZXR0aW5ncyh0aGlzLnNldHRpbmdzKTtcbiAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfSk7XG5cbi8vIEdyb3VwZXMgZHUgcGx1Z2luXG4gICAgICAgICAgICAgICBuZXcgU2V0dGluZyhvcHRpb25zQ29udGFpbmVyKVxuICAgICAgICAgICAgICAgICAgLnNldE5hbWUodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MucGx1Z2lucy5vcHRpb25zLmdyb3VwcycpKVxuICAgICAgICAgICAgICAgICAgLmFkZERyb3Bkb3duKChkcm9wZG93bjogRHJvcGRvd25Db21wb25lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgIGRyb3Bkb3duLmFkZE9wdGlvbignJywgdGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MucGx1Z2lucy5ncm91cHMubm9uZScpKTtcbiAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuZ3JvdXBzLmZvckVhY2goZyA9PiBcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyb3Bkb3duLmFkZE9wdGlvbihnLCBnKVxuICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgIGRyb3Bkb3duLnNldFZhbHVlKHBsdWdpbi5ncm91cFswXSB8fCAnJyk7XG4gICAgICAgICAgICAgICAgICAgICBkcm9wZG93bi5vbkNoYW5nZShhc3luYyAodmFsdWU6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2xkR3JvdXBzID0gWy4uLnBsdWdpbi5ncm91cF07XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdHcm91cCA9IHZhbHVlIHx8ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5ld0dyb3VwICYmICFwbHVnaW4uZ3JvdXAuaW5jbHVkZXMobmV3R3JvdXApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbHVnaW4uZ3JvdXAucHVzaChuZXdHcm91cCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IFNldHRpbmdzLnNhdmVTZXR0aW5ncyh0aGlzLnNldHRpbmdzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzb3VyY2VHcm91cHMgPSBvbGRHcm91cHMubGVuZ3RoID8gb2xkR3JvdXBzLmpvaW4oJywgJykgOiB0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5wbHVnaW5zLmdyb3Vwcy5ub25lJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZXN0aW5hdGlvbkdyb3VwcyA9IHBsdWdpbi5ncm91cC5qb2luKCcsICcpIHx8IHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLnBsdWdpbnMuZ3JvdXBzLm5vbmUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MucGx1Z2lucy5ncm91cHMudXBkYXRlZCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgne3RpdGxlfScsIHBsdWdpbi50aXRsZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKCd7ZnJvbX0nLCBzb3VyY2VHcm91cHMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgne3RvfScsIGRlc3RpbmF0aW9uR3JvdXBzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJldXIgbG9ycyBkZSBsYSBtaXNlIFx1MDBFMCBqb3VyIGRlcyBncm91cGVzOicsIGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MucGx1Z2lucy5ncm91cHMuZXJyb3InKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuXG4vLyBOb3RlIGR1IHBsdWdpblxuICAgICAgICAgICAgICAgbmV3IFNldHRpbmcob3B0aW9uc0NvbnRhaW5lcilcbiAgICAgICAgICAgICAgICAgIC5zZXROYW1lKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLnBsdWdpbnMub3B0aW9ucy5yYXRpbmcnKSlcbiAgICAgICAgICAgICAgICAgIC5hZGRTbGlkZXIoc2xpZGVyID0+IHNsaWRlclxuICAgICAgICAgICAgICAgICAgICAgLnNldExpbWl0cygxLCA1LCAxKVxuICAgICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHBsdWdpbi5yYXRpbmcpXG4gICAgICAgICAgICAgICAgICAgICAuc2V0RHluYW1pY1Rvb2x0aXAoKVxuICAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5wbHVnaW5zW2luZGV4XS5yYXRpbmcgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IFNldHRpbmdzLnNhdmVTZXR0aW5ncyh0aGlzLnNldHRpbmdzKTtcbiAgICAgICAgICAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgICAgbmV3IFNldHRpbmcob3B0aW9uc0NvbnRhaW5lcilcbiAgICAgICAgICAgICAgICAgIC5zZXROYW1lKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLnBsdWdpbnMub3B0aW9ucy51cmdlbmN5JykpXG4gICAgICAgICAgICAgICAgICAuYWRkU2xpZGVyKHNsaWRlciA9PiBzbGlkZXJcbiAgICAgICAgICAgICAgICAgICAgIC5zZXRMaW1pdHMoMSwgMywgMSlcbiAgICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZShwbHVnaW4udXJnZW5jeSlcbiAgICAgICAgICAgICAgICAgICAgIC5zZXREeW5hbWljVG9vbHRpcCgpXG4gICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzLnBsdWdpbnNbaW5kZXhdLnVyZ2VuY3kgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IFNldHRpbmdzLnNhdmVTZXR0aW5ncyh0aGlzLnNldHRpbmdzKTtcbiAgICAgICAgICAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgICAgbmV3IFNldHRpbmcob3B0aW9uc0NvbnRhaW5lcilcbiAgICAgICAgICAgICAgICAgIC5zZXROYW1lKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLnBsdWdpbnMub3B0aW9ucy5pbXBvcnRhbmNlJykpXG4gICAgICAgICAgICAgICAgICAuYWRkU2xpZGVyKHNsaWRlciA9PiBzbGlkZXJcbiAgICAgICAgICAgICAgICAgICAgIC5zZXRMaW1pdHMoMSwgMywgMSlcbiAgICAgICAgICAgICAgICAgICAgIC5zZXRWYWx1ZShwbHVnaW4uaW1wb3J0YW5jZSlcbiAgICAgICAgICAgICAgICAgICAgIC5zZXREeW5hbWljVG9vbHRpcCgpXG4gICAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzLnBsdWdpbnNbaW5kZXhdLmltcG9ydGFuY2UgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IFNldHRpbmdzLnNhdmVTZXR0aW5ncyh0aGlzLnNldHRpbmdzKTtcbiAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgfSk7XG4gICAgICB9O1xuXG4vLyBJbml0aWFsaXNlciBsJ2FmZmljaGFnZSBldCBsYSByZWNoZXJjaGVcbiAgICAgIGZpbHRlckFuZERpc3BsYXlQbHVnaW5zKCk7XG4gICAgICBzZWFyY2hJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChlKSA9PiB7XG4gICAgICAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICAgZmlsdGVyQW5kRGlzcGxheVBsdWdpbnModGFyZ2V0LnZhbHVlKTtcbiAgICAgIH0pO1xuICAgfVxuXG4gICBhc3luYyBjb25maXJtRGVsZXRlKHBsdWdpblRpdGxlOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgY29uc3QgbW9kYWwgPSBuZXcgTW9kYWwodGhpcy5hcHApO1xuICAgICAgICAgbW9kYWwudGl0bGVFbC5zZXRUZXh0KHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLnBsdWdpbnMuZGVsZXRlLmNvbmZpcm0nKSk7XG5cbiAgICAgICAgIG1vZGFsLmNvbnRlbnRFbC5lbXB0eSgpO1xuICAgICAgICAgbW9kYWwuY29udGVudEVsLmNyZWF0ZUVsKFwicFwiLCB7IFxuICAgICAgICAgICAgdGV4dDogdGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MucGx1Z2lucy5kZWxldGUuY29uZmlybU1lc3NhZ2UnKS5yZXBsYWNlKCd7dGl0bGV9JywgcGx1Z2luVGl0bGUpIFxuICAgICAgICAgfSk7XG5cbiAgICAgICAgIG5ldyBTZXR0aW5nKG1vZGFsLmNvbnRlbnRFbClcbiAgICAgICAgICAgIC5hZGRCdXR0b24oYnRuID0+IGJ0blxuICAgICAgICAgICAgICAgLnNldEJ1dHRvblRleHQodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MucGx1Z2lucy5kZWxldGUuY2FuY2VsJykpXG4gICAgICAgICAgICAgICAub25DbGljaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICBtb2RhbC5jbG9zZSgpO1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgIC5hZGRCdXR0b24oYnRuID0+IGJ0blxuICAgICAgICAgICAgICAgLnNldEJ1dHRvblRleHQodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MucGx1Z2lucy5kZWxldGUuY29uZmlybScpKVxuICAgICAgICAgICAgICAgLnNldFdhcm5pbmcoKVxuICAgICAgICAgICAgICAgLm9uQ2xpY2soKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgbW9kYWwuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgbW9kYWwub3BlbigpO1xuICAgICAgfSk7XG4gICB9XG5cbiAgIGFzeW5jIGNyZWF0ZU5ld0dyb3VwKCk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICBjb25zdCBtb2RhbCA9IG5ldyBNb2RhbCh0aGlzLmFwcCk7XG4gICAgICAgICBtb2RhbC50aXRsZUVsLnNldFRleHQodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MucGx1Z2lucy5ncm91cC5hZGQnKSk7XG5cbiAgICAgICAgIG1vZGFsLmNvbnRlbnRFbC5lbXB0eSgpO1xuICAgICAgICAgY29uc3QgaW5wdXRDb250YWluZXIgPSBtb2RhbC5jb250ZW50RWwuY3JlYXRlRGl2KCk7XG4gICAgICAgICBjb25zdCBpbnB1dCA9IG5ldyBTZXR0aW5nKGlucHV0Q29udGFpbmVyKVxuICAgICAgICAgICAgLnNldE5hbWUodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MucGx1Z2lucy5ncm91cC5uYW1lJykpXG4gICAgICAgICAgICAuYWRkVGV4dCh0ZXh0ID0+IHRleHRcbiAgICAgICAgICAgICAgIC5zZXRQbGFjZWhvbGRlcih0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5wbHVnaW5zLmdyb3VwLnBsYWNlaG9sZGVyJykpXG4gICAgICAgICAgICAgICAuc2V0VmFsdWUoXCJcIilcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgIG5ldyBTZXR0aW5nKG1vZGFsLmNvbnRlbnRFbClcbiAgICAgICAgICAgIC5hZGRCdXR0b24oYnRuID0+IGJ0blxuICAgICAgICAgICAgICAgLnNldEJ1dHRvblRleHQodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MucGx1Z2lucy5ncm91cC5jYW5jZWwnKSlcbiAgICAgICAgICAgICAgIC5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgIG1vZGFsLmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpO1xuICAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICAuYWRkQnV0dG9uKGJ0biA9PiBidG5cbiAgICAgICAgICAgICAgIC5zZXRCdXR0b25UZXh0KHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLnBsdWdpbnMuZ3JvdXAuY3JlYXRlJykpXG4gICAgICAgICAgICAgICAuc2V0Q3RhKClcbiAgICAgICAgICAgICAgIC5vbkNsaWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gaW5wdXQuY29tcG9uZW50c1swXS5nZXRWYWx1ZSgpLnRyaW0oKTtcbiAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgbW9kYWwuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MucGx1Z2lucy5ncm91cC5lcnJvcicpKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgbW9kYWwub3BlbigpO1xuICAgICAgfSk7XG4gICB9XG59IiwgImV4cG9ydCB0eXBlIFRyYW5zbGF0aW9uS2V5ID0gXG4gICAvLyBEYXNoYm9hcmRcbiAgIHwgJ2Rhc2hib2FyZC50aXRsZSdcbiAgIHwgJ2Rhc2hib2FyZC5kZXNjcmlwdGlvbidcbiAgIHwgJ2Rhc2hib2FyZC52aWV3TW9kZSdcbiAgIHwgJ2Rhc2hib2FyZC52aWV3TW9kZURlc2MnXG4gICB8ICdkYXNoYm9hcmQudmlld01vZGVUYWInXG4gICB8ICdkYXNoYm9hcmQudmlld01vZGVTaWRlYmFyJ1xuICAgfCAnZGFzaGJvYXJkLnZpZXdNb2RlUG9wdXAnXG4gICB8ICdkYXNoYm9hcmQubm9QbHVnaW5zJ1xuICAgfCAnZGFzaGJvYXJkLmluc3RhbGxlZFBsdWdpbnMnXG4gICB8ICdkYXNoYm9hcmQuc3dpdGNoVG9MaXN0J1xuICAgfCAnZGFzaGJvYXJkLnN3aXRjaFRvQ2FyZHMnXG4gICB8ICdkYXNoYm9hcmQubGlzdFZpZXcnXG4gICB8ICdkYXNoYm9hcmQuY2FyZFZpZXcnXG4gICAvLyBOb3RpY2VzXG4gICB8ICdub3RpY2VzLnNhdmVkJ1xuICAgfCAnbm90aWNlcy5lcnJvcidcbiAgIHwgJ25vdGljZXMuc3VjY2VzcydcbiAgIHwgJ25vdGljZXMuZmVhdHVyZUVuYWJsZWQnXG4gICB8ICdub3RpY2VzLmZlYXR1cmVEaXNhYmxlZCdcbiAgIC8vIENvbW1hbmRzXG4gICB8ICdjb21tYW5kcy5vcGVuRGFzaGJvYXJkJ1xuICAgLy8gRXJyb3JzXG4gICAvLyBTZXR0aW5nc1xuICAgfCAnc2V0dGluZ3MuZGVmYXVsdFZpZXdNb2RlJ1xuICAgfCAnc2V0dGluZ3MuZGVmYXVsdFZpZXdNb2RlRGVzYydcbiAgIHwgJ3NldHRpbmdzLnRhYidcbiAgIHwgJ3NldHRpbmdzLnNpZGViYXInXG4gICB8ICdzZXR0aW5ncy5wb3B1cCdcbiAgIHwgJ3NldHRpbmdzLnBsdWdpbkZvbGRlci5uYW1lJ1xuICAgfCAnc2V0dGluZ3MucGx1Z2luRm9sZGVyLmRlc2MnXG4gICB8ICdzZXR0aW5ncy5wbHVnaW5Gb2xkZXIudXBkYXRlZCdcbiAgIHwgJ3NldHRpbmdzLnRlbXBsYXRlLm5hbWUnXG4gICB8ICdzZXR0aW5ncy50ZW1wbGF0ZS5kZXNjJ1xuICAgfCAnc2V0dGluZ3MuZ3JvdXBGb2xkZXIubmFtZSdcbiAgIHwgJ3NldHRpbmdzLmdyb3VwRm9sZGVyLmRlc2MnXG4gICB8ICdzZXR0aW5ncy5ncm91cEZvbGRlci51cGRhdGVkJ1xuICAgfCAnc2V0dGluZ3MuaW1wb3J0RXhwb3J0LnRpdGxlJ1xuICAgfCAnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25JbXBvcnQubmFtZSdcbiAgIHwgJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uSW1wb3J0LmRlc2MnXG4gICB8ICdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkltcG9ydC5idXR0b24nXG4gICB8ICdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkltcG9ydC5sb2FkaW5nJ1xuICAgfCAnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25JbXBvcnQuc3VjY2VzcydcbiAgIHwgJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uSW1wb3J0LmVycm9yJ1xuICAgfCAnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25FeHBvcnQubmFtZSdcbiAgIHwgJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uRXhwb3J0LmRlc2MnXG4gICB8ICdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkV4cG9ydC5idXR0b24nXG4gICB8ICdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkV4cG9ydC5sb2FkaW5nJ1xuICAgfCAnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25FeHBvcnQuc3VjY2VzcydcbiAgIHwgJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uRXhwb3J0LmVycm9yJ1xuICAgfCAnc2V0dGluZ3MuZ3JvdXBzLnRpdGxlJ1xuICAgfCAnc2V0dGluZ3MuZ3JvdXBzLmRlbGV0ZS5idXR0b24nXG4gICB8ICdzZXR0aW5ncy5ncm91cHMuZGVsZXRlLnN1Y2Nlc3MnXG4gICB8ICdzZXR0aW5ncy5ncm91cHMuZGVsZXRlLmVycm9yJ1xuICAgfCAnc2V0dGluZ3MuZ3JvdXBzLmFkZC5uYW1lJ1xuICAgfCAnc2V0dGluZ3MuZ3JvdXBzLmFkZC5kZXNjJ1xuICAgfCAnc2V0dGluZ3MuZ3JvdXBzLmFkZC5wbGFjZWhvbGRlcidcbiAgIHwgJ3NldHRpbmdzLmdyb3Vwcy5hZGQuc3VjY2VzcydcbiAgIHwgJ3NldHRpbmdzLmdyb3Vwcy5hZGQuZXJyb3InXG4gICB8ICdzZXR0aW5ncy5wbHVnaW5zLnRpdGxlJ1xuICAgfCAnc2V0dGluZ3MucGx1Z2lucy5zZWFyY2gucGxhY2Vob2xkZXInXG4gICB8ICdzZXR0aW5ncy5wbHVnaW5zLm9wdGlvbnMuc3RhdHVzJ1xuICAgfCAnc2V0dGluZ3MucGx1Z2lucy5zdGF0dXMuZXhwbG9yaW5nJ1xuICAgfCAnc2V0dGluZ3MucGx1Z2lucy5zdGF0dXMuYWN0aXZlJ1xuICAgfCAnc2V0dGluZ3MucGx1Z2lucy5zdGF0dXMuaW5hY3RpdmUnXG4gICB8ICdzZXR0aW5ncy5wbHVnaW5zLm9wdGlvbnMuZ3JvdXBzJ1xuICAgfCAnc2V0dGluZ3MucGx1Z2lucy5ncm91cHMubm9uZSdcbiAgIHwgJ3NldHRpbmdzLnBsdWdpbnMuZ3JvdXBzLnVwZGF0ZWQnXG4gICB8ICdzZXR0aW5ncy5wbHVnaW5zLmdyb3Vwcy5lcnJvcidcbiAgIHwgJ3NldHRpbmdzLnBsdWdpbnMub3B0aW9ucy5yYXRpbmcnXG4gICB8ICdzZXR0aW5ncy5wbHVnaW5zLm9wdGlvbnMudXJnZW5jeSdcbiAgIHwgJ3NldHRpbmdzLnBsdWdpbnMub3B0aW9ucy5pbXBvcnRhbmNlJ1xuICAgfCAnc2V0dGluZ3MucGx1Z2lucy5kZWxldGUuYnV0dG9uJ1xuICAgfCAnc2V0dGluZ3MucGx1Z2lucy5kZWxldGUuY29uZmlybSdcbiAgIHwgJ3NldHRpbmdzLnBsdWdpbnMuZGVsZXRlLmNvbmZpcm1NZXNzYWdlJ1xuICAgfCAnc2V0dGluZ3MucGx1Z2lucy5kZWxldGUuY2FuY2VsJ1xuICAgfCAnc2V0dGluZ3MucGx1Z2lucy5kZWxldGVkJ1xuICAgfCAnc2V0dGluZ3MucGx1Z2lucy5hY3RpdmF0ZS50b29sdGlwJ1xuICAgfCAnc2V0dGluZ3MucGx1Z2lucy5kZWFjdGl2YXRlLnRvb2x0aXAnXG4gICB8ICdzZXR0aW5ncy5wbHVnaW5zLnRvZ2dsZS50b29sdGlwJ1xuICAgfCAnc2V0dGluZ3MucGx1Z2lucy5hY3RpdmF0ZWQnXG4gICB8ICdzZXR0aW5ncy5wbHVnaW5zLmRlYWN0aXZhdGVkJ1xuICAgfCAnc2V0dGluZ3MucGx1Z2lucy5hZGQubmFtZSdcbiAgIHwgJ3NldHRpbmdzLnBsdWdpbnMuYWRkLmRlc2MnXG4gICB8ICdzZXR0aW5ncy5wbHVnaW5zLmFkZC5wbGFjZWhvbGRlcidcbiAgIHwgJ3NldHRpbmdzLnBsdWdpbnMuYWRkLnN1Y2Nlc3MnXG4gICB8ICdzZXR0aW5ncy5wbHVnaW5zLmFkZC5lcnJvcidcbiAgIHwgJ3NldHRpbmdzLnBsdWdpbnMucmF0aW5nLnRvb2x0aXAnXG4gICB8ICdzZXR0aW5ncy5wbHVnaW5zLnVyZ2VuY3kudG9vbHRpcCdcbiAgIHwgJ3NldHRpbmdzLnBsdWdpbnMuaW1wb3J0YW5jZS50b29sdGlwJ1xuXG5leHBvcnQgY29uc3QgdHJhbnNsYXRpb25zOiB7IFtsYW5nOiBzdHJpbmddOiBSZWNvcmQ8VHJhbnNsYXRpb25LZXksIHN0cmluZz4gfSA9IHtcbiAgIGVuOiB7XG4gICAgICAvLyBEYXNoYm9hcmRcbiAgICAgICdkYXNoYm9hcmQudGl0bGUnOiAnUGx1Z2luRmxvd3onLFxuICAgICAgJ2Rhc2hib2FyZC5kZXNjcmlwdGlvbic6ICdQbHVnaW5GbG93eiBpcyBhIHBsdWdpbiBmb3IgT2JzaWRpYW4gdGhhdCBhbGxvd3MgeW91IHRvIG1hbmFnZSB5b3VyIHZpZGVvcy4nLFxuICAgICAgJ2Rhc2hib2FyZC52aWV3TW9kZSc6ICdWaWV3IE1vZGUnLFxuICAgICAgJ2Rhc2hib2FyZC52aWV3TW9kZURlc2MnOiAnQ2hvb3NlIGhvdyB2aWRlb3Mgd2lsbCBvcGVuIGJ5IGRlZmF1bHQnLFxuICAgICAgJ2Rhc2hib2FyZC52aWV3TW9kZVRhYic6ICdUYWInLFxuICAgICAgJ2Rhc2hib2FyZC52aWV3TW9kZVNpZGViYXInOiAnU2lkZWJhcicsXG4gICAgICAnZGFzaGJvYXJkLnZpZXdNb2RlUG9wdXAnOiAnUG9wdXAnLFxuICAgICAgJ2Rhc2hib2FyZC5ub1BsdWdpbnMnOiAnTm8gcGx1Z2lucyBpbnN0YWxsZWQgeWV0LiBJbnN0YWxsIHNvbWUgcGx1Z2lucyB0byBtYW5hZ2UgdGhlbSBoZXJlLicsXG4gICAgICAnZGFzaGJvYXJkLmluc3RhbGxlZFBsdWdpbnMnOiAnSW5zdGFsbGVkIFBsdWdpbnMnLFxuICAgICAgJ2Rhc2hib2FyZC5zd2l0Y2hUb0xpc3QnOiAnU3dpdGNoIHRvIGxpc3QgdmlldycsXG4gICAgICAnZGFzaGJvYXJkLnN3aXRjaFRvQ2FyZHMnOiAnU3dpdGNoIHRvIGNhcmRzIHZpZXcnLFxuICAgICAgJ2Rhc2hib2FyZC5saXN0Vmlldyc6ICdMaXN0IFZpZXcnLFxuICAgICAgJ2Rhc2hib2FyZC5jYXJkVmlldyc6ICdDYXJkIFZpZXcnLFxuICAgICAgLy8gTm90aWNlc1xuICAgICAgJ25vdGljZXMuc2F2ZWQnOiAnXHUyNzA1IFNldHRpbmdzIHNhdmVkJyxcbiAgICAgICdub3RpY2VzLmVycm9yJzogJ1x1Mjc0QyBFcnJvcjoge21lc3NhZ2V9JyxcbiAgICAgICdub3RpY2VzLnN1Y2Nlc3MnOiAnXHUyNzA1IE9wZXJhdGlvbiBzdWNjZXNzZnVsJyxcbiAgICAgICdub3RpY2VzLmZlYXR1cmVFbmFibGVkJzogJ1x1MjcwNSBGZWF0dXJlIGVuYWJsZWQnLFxuICAgICAgJ25vdGljZXMuZmVhdHVyZURpc2FibGVkJzogJ1x1Mjc0QyBGZWF0dXJlIGRpc2FibGVkJyxcbiAgICAgIC8vIENvbW1hbmRzXG4gICAgICAnY29tbWFuZHMub3BlbkRhc2hib2FyZCc6ICdPcGVuIERhc2hib2FyZCcsXG4gICAgICAvLyBFcnJvcnNcbiAgICAgIC8vIFNldHRpbmdzXG4gICAgICAnc2V0dGluZ3MuZGVmYXVsdFZpZXdNb2RlJzogJ0RlZmF1bHQgVmlldyBNb2RlJyxcbiAgICAgICdzZXR0aW5ncy5kZWZhdWx0Vmlld01vZGVEZXNjJzogJ0Nob29zZSBob3cgdGhlIHBsdWdpbiBkYXNoYm9hcmQgd2lsbCBvcGVuIGJ5IGRlZmF1bHQnLFxuICAgICAgJ3NldHRpbmdzLnRhYic6ICdUYWInLFxuICAgICAgJ3NldHRpbmdzLnNpZGViYXInOiAnU2lkZWJhcicsXG4gICAgICAnc2V0dGluZ3MucG9wdXAnOiAnUG9wdXAnLFxuICAgICAgJ3NldHRpbmdzLnBsdWdpbkZvbGRlci5uYW1lJzogJ1BsdWdpbiBOb3RlcyBGb2xkZXInLFxuICAgICAgJ3NldHRpbmdzLnBsdWdpbkZvbGRlci5kZXNjJzogJ1doZXJlIHRvIHN0b3JlIHBsdWdpbiBub3RlcycsXG4gICAgICAnc2V0dGluZ3MucGx1Z2luRm9sZGVyLnVwZGF0ZWQnOiAnUGx1Z2luIGZvbGRlciB1cGRhdGVkJyxcbiAgICAgICdzZXR0aW5ncy50ZW1wbGF0ZS5uYW1lJzogJ05vdGUgVGVtcGxhdGUnLFxuICAgICAgJ3NldHRpbmdzLnRlbXBsYXRlLmRlc2MnOiAnVGVtcGxhdGUgZm9yIHBsdWdpbiBub3RlcyAodXNlIHt7bmFtZX19LCB7e2Rlc2NyaXB0aW9ufX0sIHt7dXJsfX0pJyxcbiAgICAgICdzZXR0aW5ncy5ncm91cEZvbGRlci5uYW1lJzogJ0dyb3VwIEZvbGRlcicsXG4gICAgICAnc2V0dGluZ3MuZ3JvdXBGb2xkZXIuZGVzYyc6ICdXaGVyZSB0byBzdG9yZSBwbHVnaW4gZ3JvdXBzJyxcbiAgICAgICdzZXR0aW5ncy5ncm91cEZvbGRlci51cGRhdGVkJzogJ0dyb3VwIGZvbGRlciB1cGRhdGVkJyxcbiAgICAgIC8vIEltcG9ydC9FeHBvcnRcbiAgICAgICdzZXR0aW5ncy5pbXBvcnRFeHBvcnQudGl0bGUnOiAnSW1wb3J0L0V4cG9ydCcsXG4gICAgICAnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25JbXBvcnQubmFtZSc6ICdJbXBvcnQgQ29uZmlndXJhdGlvbicsXG4gICAgICAnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25JbXBvcnQuZGVzYyc6ICdJbXBvcnQgcGx1Z2luIGNvbmZpZ3VyYXRpb24gZnJvbSBKU09OIGZpbGUnLFxuICAgICAgJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uSW1wb3J0LmJ1dHRvbic6ICdJbXBvcnQgSlNPTicsXG4gICAgICAnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25JbXBvcnQubG9hZGluZyc6ICdJbXBvcnRpbmcgY29uZmlndXJhdGlvbi4uLicsXG4gICAgICAnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25JbXBvcnQuc3VjY2Vzcyc6ICdDb25maWd1cmF0aW9uIGltcG9ydGVkIHN1Y2Nlc3NmdWxseScsXG4gICAgICAnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25JbXBvcnQuZXJyb3InOiAnRXJyb3IgaW1wb3J0aW5nIGNvbmZpZ3VyYXRpb24nLFxuICAgICAgJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uRXhwb3J0Lm5hbWUnOiAnRXhwb3J0IENvbmZpZ3VyYXRpb24nLFxuICAgICAgJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uRXhwb3J0LmRlc2MnOiAnRXhwb3J0IHBsdWdpbiBjb25maWd1cmF0aW9uIHRvIEpTT04gZmlsZScsXG4gICAgICAnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25FeHBvcnQuYnV0dG9uJzogJ0V4cG9ydCBKU09OJyxcbiAgICAgICdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkV4cG9ydC5sb2FkaW5nJzogJ0V4cG9ydGluZyBjb25maWd1cmF0aW9uLi4uJyxcbiAgICAgICdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkV4cG9ydC5zdWNjZXNzJzogJ0NvbmZpZ3VyYXRpb24gZXhwb3J0ZWQgc3VjY2Vzc2Z1bGx5JyxcbiAgICAgICdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkV4cG9ydC5lcnJvcic6ICdFcnJvciBleHBvcnRpbmcgY29uZmlndXJhdGlvbicsXG4gICAgICAvLyBHcm91cHMgTWFuYWdlbWVudFxuICAgICAgJ3NldHRpbmdzLmdyb3Vwcy50aXRsZSc6ICdHcm91cHMgTWFuYWdlbWVudCcsXG4gICAgICAnc2V0dGluZ3MuZ3JvdXBzLmRlbGV0ZS5idXR0b24nOiAnRGVsZXRlJyxcbiAgICAgICdzZXR0aW5ncy5ncm91cHMuZGVsZXRlLnN1Y2Nlc3MnOiAnR3JvdXAgZGVsZXRlZCcsXG4gICAgICAnc2V0dGluZ3MuZ3JvdXBzLmRlbGV0ZS5lcnJvcic6ICdFcnJvciBkZWxldGluZyBncm91cCcsXG4gICAgICAnc2V0dGluZ3MuZ3JvdXBzLmFkZC5uYW1lJzogJ0FkZCBOZXcgR3JvdXAnLFxuICAgICAgJ3NldHRpbmdzLmdyb3Vwcy5hZGQuZGVzYyc6ICdDcmVhdGUgYSBuZXcgZ3JvdXAgZm9yIG9yZ2FuaXppbmcgcGx1Z2lucycsXG4gICAgICAnc2V0dGluZ3MuZ3JvdXBzLmFkZC5wbGFjZWhvbGRlcic6ICdHcm91cCBuYW1lJyxcbiAgICAgICdzZXR0aW5ncy5ncm91cHMuYWRkLnN1Y2Nlc3MnOiAnR3JvdXAgY3JlYXRlZCcsXG4gICAgICAnc2V0dGluZ3MuZ3JvdXBzLmFkZC5lcnJvcic6ICdFcnJvciBjcmVhdGluZyBncm91cCcsXG4gICAgICAvLyBQbHVnaW5zIE1hbmFnZW1lbnRcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLnRpdGxlJzogJ1BsdWdpbnMgTWFuYWdlbWVudCcsXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5zZWFyY2gucGxhY2Vob2xkZXInOiAnU2VhcmNoIHBsdWdpbnMuLi4nLFxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMub3B0aW9ucy5zdGF0dXMnOiAnU3RhdHVzJyxcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLnN0YXR1cy5leHBsb3JpbmcnOiAnRXhwbG9yaW5nJyxcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLnN0YXR1cy5hY3RpdmUnOiAnQWN0aXZlJyxcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLnN0YXR1cy5pbmFjdGl2ZSc6ICdJbmFjdGl2ZScsXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5vcHRpb25zLmdyb3Vwcyc6ICdHcm91cHMnLFxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuZ3JvdXBzLm5vbmUnOiAnTm8gZ3JvdXAnLFxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuZ3JvdXBzLnVwZGF0ZWQnOiAnUGx1Z2luIHt0aXRsZX0gZ3JvdXBzIHVwZGF0ZWQgZnJvbSB7ZnJvbX0gdG8ge3RvfScsXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5ncm91cHMuZXJyb3InOiAnRXJyb3IgdXBkYXRpbmcgZ3JvdXBzJyxcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLm9wdGlvbnMucmF0aW5nJzogJ1JhdGluZycsXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5vcHRpb25zLnVyZ2VuY3knOiAnVXJnZW5jeScsXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5vcHRpb25zLmltcG9ydGFuY2UnOiAnSW1wb3J0YW5jZScsXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5kZWxldGUuYnV0dG9uJzogJ0RlbGV0ZSBQbHVnaW4nLFxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuZGVsZXRlLmNvbmZpcm0nOiAnRGVsZXRlIFBsdWdpbicsXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5kZWxldGUuY29uZmlybU1lc3NhZ2UnOiAnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB7dGl0bGV9PycsXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5kZWxldGUuY2FuY2VsJzogJ0NhbmNlbCcsXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5kZWxldGVkJzogJ1BsdWdpbiB7dGl0bGV9IGRlbGV0ZWQnLFxuICAgICAgLy8gUGx1Z2luIEFjdGlvbnMgJiBUb29sdGlwc1xuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuYWN0aXZhdGUudG9vbHRpcCc6ICdBY3RpdmF0ZSBwbHVnaW4nLFxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuZGVhY3RpdmF0ZS50b29sdGlwJzogJ0RlYWN0aXZhdGUgcGx1Z2luJyxcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLnRvZ2dsZS50b29sdGlwJzogJ1Nob3cvSGlkZSBvcHRpb25zJyxcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLmFjdGl2YXRlZCc6ICdQbHVnaW4ge3RpdGxlfSBhY3RpdmF0ZWQnLFxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuZGVhY3RpdmF0ZWQnOiAnUGx1Z2luIHt0aXRsZX0gZGVhY3RpdmF0ZWQnLFxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuYWRkLm5hbWUnOiAnQWRkIFBsdWdpbicsXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5hZGQuZGVzYyc6ICdBZGQgYSBuZXcgcGx1Z2luIHRvIG1hbmFnZScsXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5hZGQucGxhY2Vob2xkZXInOiAnUGx1Z2luIG5hbWUnLFxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuYWRkLnN1Y2Nlc3MnOiAnUGx1Z2luIGFkZGVkIHN1Y2Nlc3NmdWxseScsXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5hZGQuZXJyb3InOiAnRXJyb3IgYWRkaW5nIHBsdWdpbicsXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5yYXRpbmcudG9vbHRpcCc6ICdSYXRlIGZyb20gMSB0byA1JyxcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLnVyZ2VuY3kudG9vbHRpcCc6ICdTZXQgdXJnZW5jeSAoMTogTG93LCAyOiBNZWRpdW0sIDM6IEhpZ2gpJyxcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLmltcG9ydGFuY2UudG9vbHRpcCc6ICdTZXQgaW1wb3J0YW5jZSAoMTogTG93LCAyOiBNZWRpdW0sIDM6IEhpZ2gpJyxcbiAgIH0sXG4gICBmcjoge1xuICAgICAgLy8gRGFzaGJvYXJkXG4gICAgICAnZGFzaGJvYXJkLnRpdGxlJzogJ1BsdWdpbkZsb3d6JyxcbiAgICAgICdkYXNoYm9hcmQuZGVzY3JpcHRpb24nOiAnUGx1Z2luRmxvd3ogZXN0IHVuIHBsdWdpbiBwb3VyIE9ic2lkaWFuIHF1aSB2b3VzIHBlcm1ldCBkZSBnXHUwMEU5cmVyIHZvcyB2aWRcdTAwRTlvcy4nLFxuICAgICAgJ2Rhc2hib2FyZC52aWV3TW9kZSc6ICdNb2RlIGRcXCdhZmZpY2hhZ2UnLFxuICAgICAgJ2Rhc2hib2FyZC52aWV3TW9kZURlc2MnOiAnQ2hvaXNpc3NleiBjb21tZW50IGxlcyB2aWRcdTAwRTlvcyBzXFwnb3V2cmlyb250IHBhciBkXHUwMEU5ZmF1dCcsXG4gICAgICAnZGFzaGJvYXJkLnZpZXdNb2RlVGFiJzogJ09uZ2xldCcsXG4gICAgICAnZGFzaGJvYXJkLnZpZXdNb2RlU2lkZWJhcic6ICdCYXJyZSBsYXRcdTAwRTlyYWxlJyxcbiAgICAgICdkYXNoYm9hcmQudmlld01vZGVQb3B1cCc6ICdGZW5cdTAwRUF0cmUgY29udGV4dHVlbGxlJyxcbiAgICAgICdkYXNoYm9hcmQubm9QbHVnaW5zJzogJ0F1Y3VuIHBsdWdpbiBpbnN0YWxsXHUwMEU5IHBvdXIgbGUgbW9tZW50LiBJbnN0YWxsZXogZGVzIHBsdWdpbnMgcG91ciBsZXMgZ1x1MDBFOXJlciBpY2kuJyxcbiAgICAgICdkYXNoYm9hcmQuaW5zdGFsbGVkUGx1Z2lucyc6ICdQbHVnaW5zIEluc3RhbGxcdTAwRTlzJyxcbiAgICAgICdkYXNoYm9hcmQuc3dpdGNoVG9MaXN0JzogJ1Bhc3NlciBlbiB2dWUgbGlzdGUnLFxuICAgICAgJ2Rhc2hib2FyZC5zd2l0Y2hUb0NhcmRzJzogJ1Bhc3NlciBlbiB2dWUgY2FydGVzJyxcbiAgICAgICdkYXNoYm9hcmQubGlzdFZpZXcnOiAnVnVlIExpc3RlJyxcbiAgICAgICdkYXNoYm9hcmQuY2FyZFZpZXcnOiAnVnVlIENhcnRlcycsXG4gICAgICAvLyBOb3RpY2VzXG4gICAgICAnbm90aWNlcy5zYXZlZCc6ICdcdTI3MDUgUGFyYW1cdTAwRTh0cmVzIHNhdXZlZ2FyZFx1MDBFOXMnLFxuICAgICAgJ25vdGljZXMuZXJyb3InOiAnXHUyNzRDIEVycmV1cjoge21lc3NhZ2V9JyxcbiAgICAgICdub3RpY2VzLnN1Y2Nlc3MnOiAnXHUyNzA1IE9wXHUwMEU5cmF0aW9uIHJcdTAwRTl1c3NpZScsXG4gICAgICAnbm90aWNlcy5mZWF0dXJlRW5hYmxlZCc6ICdcdTI3MDUgRm9uY3Rpb25uYWxpdFx1MDBFOSBhY3Rpdlx1MDBFOWUnLFxuICAgICAgJ25vdGljZXMuZmVhdHVyZURpc2FibGVkJzogJ1x1Mjc0QyBGb25jdGlvbm5hbGl0XHUwMEU5IGRcdTAwRTlzYWN0aXZcdTAwRTllJyxcbiAgICAgIC8vIENvbW1hbmRzXG4gICAgICAnY29tbWFuZHMub3BlbkRhc2hib2FyZCc6ICdPdXZyaXIgbGUgdGFibGVhdSBkZSBib3JkJyxcbiAgICAgIC8vIEVycm9yc1xuICAgICAgLy8gU2V0dGluZ3NcbiAgICAgICdzZXR0aW5ncy5kZWZhdWx0Vmlld01vZGUnOiAnTW9kZSBkXFwnYWZmaWNoYWdlIHBhciBkXHUwMEU5ZmF1dCcsXG4gICAgICAnc2V0dGluZ3MuZGVmYXVsdFZpZXdNb2RlRGVzYyc6ICdDaG9pc2lzc2V6IGNvbW1lbnQgbGUgdGFibGVhdSBkZSBib3JkIHNcXCdvdXZyaXJhIHBhciBkXHUwMEU5ZmF1dCcsXG4gICAgICAnc2V0dGluZ3MudGFiJzogJ09uZ2xldCcsXG4gICAgICAnc2V0dGluZ3Muc2lkZWJhcic6ICdCYXJyZSBsYXRcdTAwRTlyYWxlJyxcbiAgICAgICdzZXR0aW5ncy5wb3B1cCc6ICdGZW5cdTAwRUF0cmUgbW9kYWxlJyxcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5Gb2xkZXIubmFtZSc6ICdEb3NzaWVyIGRlcyBub3RlcyBkZSBwbHVnaW5zJyxcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5Gb2xkZXIuZGVzYyc6ICdPXHUwMEY5IHN0b2NrZXIgbGVzIG5vdGVzIGRlcyBwbHVnaW5zJyxcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5Gb2xkZXIudXBkYXRlZCc6ICdEb3NzaWVyIGRlcyBwbHVnaW5zIG1pcyBcdTAwRTAgam91cicsXG4gICAgICAnc2V0dGluZ3MudGVtcGxhdGUubmFtZSc6ICdUZW1wbGF0ZSBkZXMgbm90ZXMnLFxuICAgICAgJ3NldHRpbmdzLnRlbXBsYXRlLmRlc2MnOiAnVGVtcGxhdGUgcG91ciBsZXMgbm90ZXMgZGUgcGx1Z2lucyAodXRpbGlzZSB7e25hbWV9fSwge3tkZXNjcmlwdGlvbn19LCB7e3VybH19KScsXG4gICAgICAnc2V0dGluZ3MuZ3JvdXBGb2xkZXIubmFtZSc6ICdEb3NzaWVyIGRlcyBncm91cGVzJyxcbiAgICAgICdzZXR0aW5ncy5ncm91cEZvbGRlci5kZXNjJzogJ09cdTAwRjkgc3RvY2tlciBsZXMgZ3JvdXBlcyBkZSBwbHVnaW5zJyxcbiAgICAgICdzZXR0aW5ncy5ncm91cEZvbGRlci51cGRhdGVkJzogJ0Rvc3NpZXIgZGVzIGdyb3VwZXMgbWlzIFx1MDBFMCBqb3VyJyxcbiAgICAgIC8vIEltcG9ydC9FeHBvcnRcbiAgICAgICdzZXR0aW5ncy5pbXBvcnRFeHBvcnQudGl0bGUnOiAnSW1wb3J0L0V4cG9ydCcsXG4gICAgICAnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25JbXBvcnQubmFtZSc6ICdJbXBvcnRlciBsYSBjb25maWd1cmF0aW9uJyxcbiAgICAgICdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkltcG9ydC5kZXNjJzogJ0ltcG9ydGVyIGxhIGNvbmZpZ3VyYXRpb24gZGVwdWlzIHVuIGZpY2hpZXIgSlNPTicsXG4gICAgICAnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25JbXBvcnQuYnV0dG9uJzogJ0ltcG9ydGVyIEpTT04nLFxuICAgICAgJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uSW1wb3J0LmxvYWRpbmcnOiAnSW1wb3J0YXRpb24gZW4gY291cnMuLi4nLFxuICAgICAgJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uSW1wb3J0LnN1Y2Nlc3MnOiAnQ29uZmlndXJhdGlvbiBpbXBvcnRcdTAwRTllIGF2ZWMgc3VjY1x1MDBFOHMnLFxuICAgICAgJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uSW1wb3J0LmVycm9yJzogJ0VycmV1ciBsb3JzIGRlIGxcXCdpbXBvcnRhdGlvbicsXG4gICAgICAnc2V0dGluZ3MuaW1wb3J0RXhwb3J0Lmpzb25FeHBvcnQubmFtZSc6ICdFeHBvcnRlciBsYSBjb25maWd1cmF0aW9uJyxcbiAgICAgICdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkV4cG9ydC5kZXNjJzogJ0V4cG9ydGVyIGxhIGNvbmZpZ3VyYXRpb24gdmVycyB1biBmaWNoaWVyIEpTT04nLFxuICAgICAgJ3NldHRpbmdzLmltcG9ydEV4cG9ydC5qc29uRXhwb3J0LmJ1dHRvbic6ICdFeHBvcnRlciBKU09OJyxcbiAgICAgICdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkV4cG9ydC5sb2FkaW5nJzogJ0V4cG9ydGF0aW9uIGVuIGNvdXJzLi4uJyxcbiAgICAgICdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkV4cG9ydC5zdWNjZXNzJzogJ0NvbmZpZ3VyYXRpb24gZXhwb3J0XHUwMEU5ZSBhdmVjIHN1Y2NcdTAwRThzJyxcbiAgICAgICdzZXR0aW5ncy5pbXBvcnRFeHBvcnQuanNvbkV4cG9ydC5lcnJvcic6ICdFcnJldXIgbG9ycyBkZSBsXFwnZXhwb3J0YXRpb24nLFxuICAgICAgLy8gR3JvdXBzIE1hbmFnZW1lbnRcbiAgICAgICdzZXR0aW5ncy5ncm91cHMudGl0bGUnOiAnR2VzdGlvbiBkZXMgZ3JvdXBlcycsXG4gICAgICAnc2V0dGluZ3MuZ3JvdXBzLmRlbGV0ZS5idXR0b24nOiAnU3VwcHJpbWVyJyxcbiAgICAgICdzZXR0aW5ncy5ncm91cHMuZGVsZXRlLnN1Y2Nlc3MnOiAnR3JvdXBlIHN1cHByaW1cdTAwRTknLFxuICAgICAgJ3NldHRpbmdzLmdyb3Vwcy5kZWxldGUuZXJyb3InOiAnRXJyZXVyIGxvcnMgZGUgbGEgc3VwcHJlc3Npb24nLFxuICAgICAgJ3NldHRpbmdzLmdyb3Vwcy5hZGQubmFtZSc6ICdBam91dGVyIHVuIGdyb3VwZScsXG4gICAgICAnc2V0dGluZ3MuZ3JvdXBzLmFkZC5kZXNjJzogJ0NyXHUwMEU5ZXIgdW4gbm91dmVhdSBncm91cGUgcG91ciBvcmdhbmlzZXIgbGVzIHBsdWdpbnMnLFxuICAgICAgJ3NldHRpbmdzLmdyb3Vwcy5hZGQucGxhY2Vob2xkZXInOiAnTm9tIGR1IGdyb3VwZScsXG4gICAgICAnc2V0dGluZ3MuZ3JvdXBzLmFkZC5zdWNjZXNzJzogJ0dyb3VwZSBjclx1MDBFOVx1MDBFOScsXG4gICAgICAnc2V0dGluZ3MuZ3JvdXBzLmFkZC5lcnJvcic6ICdFcnJldXIgbG9ycyBkZSBsYSBjclx1MDBFOWF0aW9uJyxcbiAgICAgIC8vIFBsdWdpbnMgTWFuYWdlbWVudFxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMudGl0bGUnOiAnR2VzdGlvbiBkZXMgcGx1Z2lucycsXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5zZWFyY2gucGxhY2Vob2xkZXInOiAnUmVjaGVyY2hlciBkZXMgcGx1Z2lucy4uLicsXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5vcHRpb25zLnN0YXR1cyc6ICdTdGF0dXQnLFxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuc3RhdHVzLmV4cGxvcmluZyc6ICdFbiBleHBsb3JhdGlvbicsXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5zdGF0dXMuYWN0aXZlJzogJ0FjdGlmJyxcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLnN0YXR1cy5pbmFjdGl2ZSc6ICdJbmFjdGlmJyxcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLm9wdGlvbnMuZ3JvdXBzJzogJ0dyb3VwZXMnLFxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuZ3JvdXBzLm5vbmUnOiAnU2FucyBncm91cGUnLFxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuZ3JvdXBzLnVwZGF0ZWQnOiAnR3JvdXBlcyBkdSBwbHVnaW4ge3RpdGxlfSBtaXMgXHUwMEUwIGpvdXIgZGUge2Zyb219IHZlcnMge3RvfScsXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5ncm91cHMuZXJyb3InOiAnRXJyZXVyIGxvcnMgZGUgbGEgbWlzZSBcdTAwRTAgam91ciBkZXMgZ3JvdXBlcycsXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5vcHRpb25zLnJhdGluZyc6ICdOb3RlJyxcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLm9wdGlvbnMudXJnZW5jeSc6ICdVcmdlbmNlJyxcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLm9wdGlvbnMuaW1wb3J0YW5jZSc6ICdJbXBvcnRhbmNlJyxcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLmRlbGV0ZS5idXR0b24nOiAnU3VwcHJpbWVyIGxlIHBsdWdpbicsXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5kZWxldGUuY29uZmlybSc6ICdTdXBwcmltZXIgbGUgcGx1Z2luJyxcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLmRlbGV0ZS5jb25maXJtTWVzc2FnZSc6ICdcdTAwQ0F0ZXMtdm91cyBzXHUwMEZCciBkZSB2b3Vsb2lyIHN1cHByaW1lciB7dGl0bGV9ID8nLFxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuZGVsZXRlLmNhbmNlbCc6ICdBbm51bGVyJyxcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLmRlbGV0ZWQnOiAnUGx1Z2luIHt0aXRsZX0gc3VwcHJpbVx1MDBFOScsXG4gICAgICAvLyBQbHVnaW4gQWN0aW9ucyAmIFRvb2x0aXBzXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5hY3RpdmF0ZS50b29sdGlwJzogJ0FjdGl2ZXIgbGUgcGx1Z2luJyxcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLmRlYWN0aXZhdGUudG9vbHRpcCc6ICdEXHUwMEU5c2FjdGl2ZXIgbGUgcGx1Z2luJyxcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLnRvZ2dsZS50b29sdGlwJzogJ0FmZmljaGVyL01hc3F1ZXIgbGVzIG9wdGlvbnMnLFxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuYWN0aXZhdGVkJzogJ1BsdWdpbiB7dGl0bGV9IGFjdGl2XHUwMEU5JyxcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLmRlYWN0aXZhdGVkJzogJ1BsdWdpbiB7dGl0bGV9IGRcdTAwRTlzYWN0aXZcdTAwRTknLFxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuYWRkLm5hbWUnOiAnQWpvdXRlciB1biBwbHVnaW4nLFxuICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuYWRkLmRlc2MnOiAnQWpvdXRlciB1biBub3V2ZWF1IHBsdWdpbiBcdTAwRTAgZ1x1MDBFOXJlcicsXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5hZGQucGxhY2Vob2xkZXInOiAnTm9tIGR1IHBsdWdpbicsXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5hZGQuc3VjY2Vzcyc6ICdQbHVnaW4gYWpvdXRcdTAwRTkgYXZlYyBzdWNjXHUwMEU4cycsXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5hZGQuZXJyb3InOiAnRXJyZXVyIGxvcnMgZGUgbFxcJ2Fqb3V0IGR1IHBsdWdpbicsXG4gICAgICAnc2V0dGluZ3MucGx1Z2lucy5yYXRpbmcudG9vbHRpcCc6ICdOb3RlciBkZSAxIFx1MDBFMCA1JyxcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLnVyZ2VuY3kudG9vbHRpcCc6ICdEXHUwMEU5ZmluaXIgbFxcJ3VyZ2VuY2UgKDE6IEZhaWJsZSwgMjogTW95ZW5uZSwgMzogSGF1dGUpJyxcbiAgICAgICdzZXR0aW5ncy5wbHVnaW5zLmltcG9ydGFuY2UudG9vbHRpcCc6ICdEXHUwMEU5ZmluaXIgbFxcJ2ltcG9ydGFuY2UgKDE6IEZhaWJsZSwgMjogTW95ZW5uZSwgMzogSGF1dGUpJyxcbiAgIH1cbn07XG5cbmV4cG9ydCBjbGFzcyBUcmFuc2xhdGlvbnMge1xuICAgcHJpdmF0ZSBjdXJyZW50TGFuZzogc3RyaW5nO1xuXG4gICBjb25zdHJ1Y3Rvcihpbml0aWFsTGFuZzogc3RyaW5nID0gJ2ZyJykge1xuICAgICAgdGhpcy5jdXJyZW50TGFuZyA9IGluaXRpYWxMYW5nO1xuICAgfVxuXG4gICBzZXRMYW5ndWFnZShsYW5nOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgIHRoaXMuY3VycmVudExhbmcgPSBsYW5nO1xuICAgfVxuXG4gICB0KGtleTogVHJhbnNsYXRpb25LZXkpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuIHRyYW5zbGF0aW9uc1t0aGlzLmN1cnJlbnRMYW5nXT8uW2tleV0gfHwgdHJhbnNsYXRpb25zWydlbiddW2tleV0gfHwga2V5O1xuICAgfVxufVxuIiwgImltcG9ydCB7IFBsdWdpbiwgTm90aWNlIH0gZnJvbSAnb2JzaWRpYW4nO1xuaW1wb3J0IHsgU2V0dGluZ3MgfSBmcm9tICcuL1NldHRpbmdzJztcbmltcG9ydCB7IFRyYW5zbGF0aW9ucyB9IGZyb20gJy4vVHJhbnNsYXRpb25zJztcbmltcG9ydCB7IFZpZXdNb2RlIH0gZnJvbSAnLi9WaWV3TW9kZSc7XG5cbmV4cG9ydCBjbGFzcyBIb3RrZXlzIHtcbiAgIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBwbHVnaW46IFBsdWdpbixcbiAgICAgIHByaXZhdGUgc2V0dGluZ3M6IFNldHRpbmdzLFxuICAgICAgcHJpdmF0ZSB0cmFuc2xhdGlvbnM6IFRyYW5zbGF0aW9ucyxcbiAgICAgIHByaXZhdGUgdmlld01vZGU6IFZpZXdNb2RlXG4gICApIHt9XG5cbiAgIHJlZ2lzdGVySG90a2V5cygpIHtcbiAgICAgIC8vIE91dnJpciBsZSBkYXNoYm9hcmRcbiAgICAgIHRoaXMucGx1Z2luLmFkZENvbW1hbmQoe1xuICAgICAgICAgaWQ6ICdvcGVuLXBsdWdpbnMtZGFzaGJvYXJkJyxcbiAgICAgICAgIG5hbWU6IHRoaXMudHJhbnNsYXRpb25zLnQoJ2NvbW1hbmRzLm9wZW5EYXNoYm9hcmQnKSxcbiAgICAgICAgIGljb246ICdsYXlvdXQtZ3JpZCcsXG4gICAgICAgICBjYWxsYmFjazogYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgIGNvbnN0IG1vZGUgPSBhd2FpdCBTZXR0aW5ncy5nZXRWaWV3TW9kZSgpO1xuICAgICAgICAgICAgICAgYXdhaXQgdGhpcy52aWV3TW9kZS5zZXRWaWV3KG1vZGUpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tIb3RrZXlzXScsIGVycm9yKTtcbiAgICAgICAgICAgICAgIG5ldyBOb3RpY2UodGhpcy50cmFuc2xhdGlvbnMudCgnZXJyb3JzLm9wZW5EYXNoYm9hcmQnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICB9LFxuICAgICAgICAgaG90a2V5czogW3sgbW9kaWZpZXJzOiBbJ0FsdCddLCBrZXk6ICdQJyB9XVxuICAgICAgfSk7XG4gICB9XG59XG4iLCAiaW1wb3J0IHsgSXRlbVZpZXcsIFdvcmtzcGFjZUxlYWYsIFBsdWdpbiB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB7IFRWaWV3TW9kZSwgSVBsdWdpbiB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgU2V0dGluZ3MgfSBmcm9tICcuL1NldHRpbmdzJztcbmltcG9ydCB7IFRyYW5zbGF0aW9ucyB9IGZyb20gJy4vVHJhbnNsYXRpb25zJztcblxuZXhwb3J0IGNsYXNzIERhc2hib2FyZCBleHRlbmRzIEl0ZW1WaWV3IHtcbiAgICBwcml2YXRlIHRyYW5zbGF0aW9uczogVHJhbnNsYXRpb25zO1xuICAgIHByaXZhdGUgcGx1Z2luczogSVBsdWdpbltdID0gW107XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgbGVhZjogV29ya3NwYWNlTGVhZixcbiAgICAgICAgcHJpdmF0ZSBzZXR0aW5nczogU2V0dGluZ3MsXG4gICAgICAgIHRyYW5zbGF0aW9uczogVHJhbnNsYXRpb25zLFxuICAgICAgICBwcml2YXRlIHBsdWdpbjogUGx1Z2luXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKGxlYWYpO1xuICAgICAgICB0aGlzLnRyYW5zbGF0aW9ucyA9IHRyYW5zbGF0aW9ucztcbiAgICB9XG5cbiAgICBnZXRWaWV3VHlwZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ3BsdWdpbmZsb3d6LXZpZXcnO1xuICAgIH1cblxuICAgIGdldERpc3BsYXlUZXh0KCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyYW5zbGF0aW9ucy50KCdkYXNoYm9hcmQudGl0bGUnKTtcbiAgICB9XG5cbiAgICBhc3luYyBvbk9wZW4oKSB7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyRWwuY2hpbGRyZW5bMV0gYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgIGNvbnRhaW5lci5lbXB0eSgpO1xuICAgICAgICBcbiAgICAgICAgLy8gQ2hhcmdlciBsZXMgcGx1Z2luc1xuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgdGhpcy5wbHVnaW4ubG9hZERhdGEoKTtcbiAgICAgICAgdGhpcy5wbHVnaW5zID0gZGF0YT8ucGx1Z2lucyB8fCBbXTtcbiAgICAgICAgXG4gICAgICAgIC8vIFV0aWxpc2VyIGxhIGZvbmN0aW9uIHV0aWxpdGFpcmVcbiAgICAgICAgcmVuZGVyUGx1Z2luTGlzdChjb250YWluZXIsIHRoaXMucGx1Z2lucywgdGhpcy50cmFuc2xhdGlvbnMpO1xuICAgIH1cblxuICAgIGFzeW5jIG9uQ2xvc2UoKSB7XG4gICAgICAgIC8vIE5ldHRveWFnZSBzaSBuXHUwMEU5Y2Vzc2FpcmVcbiAgICB9XG59XG4iLCAiaW1wb3J0IHsgUGx1Z2luLCBXb3Jrc3BhY2VMZWFmLCBNb2RhbCwgU2V0dGluZywgUHJvZ3Jlc3NCYXJDb21wb25lbnQgfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgeyBUVmlld01vZGUsIElQbHVnaW4gfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IFNldHRpbmdzIH0gZnJvbSAnLi9TZXR0aW5ncyc7XG5pbXBvcnQgeyBEYXNoYm9hcmQgfSBmcm9tICcuL0Rhc2hib2FyZCc7XG5pbXBvcnQgeyBUcmFuc2xhdGlvbnMgfSBmcm9tICcuL1RyYW5zbGF0aW9ucyc7XG5cbmV4cG9ydCBjbGFzcyBWaWV3TW9kZSB7XG4gICBwcml2YXRlIGN1cnJlbnRWaWV3OiBEYXNoYm9hcmQgfCBudWxsID0gbnVsbDtcbiAgIHByaXZhdGUgY3VycmVudE1vZGU6IFRWaWV3TW9kZSB8IG51bGwgPSBudWxsO1xuICAgcHJpdmF0ZSBhY3RpdmVMZWFmOiBXb3Jrc3BhY2VMZWFmIHwgbnVsbCA9IG51bGw7XG4gICBwcml2YXRlIGxlYWZJZDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gICBwcml2YXRlIHRyYW5zbGF0aW9uczogVHJhbnNsYXRpb25zO1xuICAgcHJpdmF0ZSBjdXJyZW50Vmlld01vZGU6ICdsaXN0JyB8ICdjYXJkcycgPSAnbGlzdCc7XG4gICBwcml2YXRlIHBsdWdpbnM6IElQbHVnaW5bXSA9IFtdO1xuXG4gICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBsdWdpbjogUGx1Z2luKSB7XG4gICAgICB0aGlzLnRyYW5zbGF0aW9ucyA9IG5ldyBUcmFuc2xhdGlvbnMoKTtcbiAgICAgIC8vIEluaXRpYWxpc2VyIGxlcyBtb2RlcyBkZXB1aXMgbGVzIHNldHRpbmdzXG4gICAgICBTZXR0aW5ncy5sb2FkU2V0dGluZ3MoKS50aGVuKHNldHRpbmdzID0+IHtcbiAgICAgICAgIHRoaXMuY3VycmVudE1vZGUgPSBzZXR0aW5ncy5jdXJyZW50TW9kZTtcbiAgICAgICAgIHRoaXMuY3VycmVudFZpZXdNb2RlID0gc2V0dGluZ3MuZGVmYXVsdFZpZXdNb2RlIHx8ICdsaXN0JzsgLy8gVmFsZXVyIHBhciBkXHUwMEU5ZmF1dCBzaSBub24gZFx1MDBFOWZpbmllXG4gICAgICB9KTtcbiAgICAgIC8vIE5ldHRveWVyIGxlcyBhbmNpZW5uZXMgbGVhZnMgYXUgZFx1MDBFOW1hcnJhZ2VcbiAgICAgIHRoaXMuY2xvc2VDdXJyZW50VmlldygpO1xuICAgfVxuXG4gICBwcml2YXRlIGFzeW5jIGNsb3NlQ3VycmVudFZpZXcoKSB7XG4gICAgICBpZiAodGhpcy5jdXJyZW50Vmlldykge1xuICAgICAgICAgY29uc3QgbGVhdmVzID0gdGhpcy5wbHVnaW4uYXBwLndvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoJ3BsdWdpbmZsb3d6LXZpZXcnKTtcbiAgICAgICAgIGxlYXZlcy5mb3JFYWNoKGxlYWYgPT4ge1xuICAgICAgICAgICAgaWYgKGxlYWYudmlldyBpbnN0YW5jZW9mIERhc2hib2FyZCkge1xuICAgICAgICAgICAgICAgbGVhZi5kZXRhY2goKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH0pO1xuICAgICAgICAgdGhpcy5jdXJyZW50VmlldyA9IG51bGw7XG4gICAgICAgICB0aGlzLmFjdGl2ZUxlYWYgPSBudWxsO1xuICAgICAgICAgdGhpcy5sZWFmSWQgPSBudWxsO1xuICAgICAgfVxuICAgfVxuXG4gICBwcml2YXRlIGFzeW5jIGdldExlYWZGb3JNb2RlKG1vZGU6IFRWaWV3TW9kZSk6IFByb21pc2U8V29ya3NwYWNlTGVhZiB8IG51bGw+IHtcbiAgICAgIGNvbnN0IHdvcmtzcGFjZSA9IHRoaXMucGx1Z2luLmFwcC53b3Jrc3BhY2U7XG4gICAgICBcbiAgICAgIC8vIEZlcm1lciB0b3V0ZXMgbGVzIHZ1ZXMgRGFzaGJvYXJkIGV4aXN0YW50ZXNcbiAgICAgIGNvbnN0IGV4aXN0aW5nTGVhdmVzID0gd29ya3NwYWNlLmdldExlYXZlc09mVHlwZSgncGx1Z2luZmxvd3otdmlldycpO1xuICAgICAgZXhpc3RpbmdMZWF2ZXMuZm9yRWFjaChsZWFmID0+IHtcbiAgICAgICAgIGlmIChsZWFmLnZpZXcgaW5zdGFuY2VvZiBEYXNoYm9hcmQpIHtcbiAgICAgICAgICAgIGxlYWYuZGV0YWNoKCk7XG4gICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgbGV0IGxlYWY6IFdvcmtzcGFjZUxlYWYgfCBudWxsID0gbnVsbDtcbiAgICAgIHN3aXRjaCAobW9kZSkge1xuICAgICAgICAgY2FzZSAnc2lkZWJhcic6XG4gICAgICAgICAgICBsZWFmID0gd29ya3NwYWNlLmdldFJpZ2h0TGVhZihmYWxzZSkgPz8gd29ya3NwYWNlLmdldExlYWYoJ3NwbGl0Jyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgIGNhc2UgJ3BvcHVwJzpcbiAgICAgICAgICAgIGNvbnN0IG1vZGFsID0gbmV3IE1vZGFsKHRoaXMucGx1Z2luLmFwcCk7XG4gICAgICAgICAgICBtb2RhbC5jb250YWluZXJFbC5hZGRDbGFzcygncGx1Z2luZmxvd3otbW9kYWwnKTtcbiAgICAgICAgICAgIG1vZGFsLnRpdGxlRWwuc2V0VGV4dCh0aGlzLnRyYW5zbGF0aW9ucy50KCdkYXNoYm9hcmQudGl0bGUnKSk7XG5cbiAgICAgICAgICAgIC8vIENoYXJnZXIgbGVzIHBsdWdpbnNcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCB0aGlzLnBsdWdpbi5sb2FkRGF0YSgpO1xuICAgICAgICAgICAgdGhpcy5wbHVnaW5zID0gZGF0YT8ucGx1Z2lucyB8fCBbXTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gUmVuZHJlIGRpcmVjdGVtZW50IGRhbnMgbGUgY29udGVudEVsIGRlIGxhIG1vZGFsZVxuICAgICAgICAgICAgdGhpcy5yZW5kZXJDb250ZW50KG1vZGFsLmNvbnRlbnRFbCk7XG5cbiAgICAgICAgICAgIG1vZGFsLm9wZW4oKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgY2FzZSAndGFiJzpcbiAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBsZWFmID0gd29ya3NwYWNlLmdldExlYWYoJ3NwbGl0Jyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGxlYWY7XG4gICB9XG5cbiAgIGFzeW5jIHNldFZpZXcobW9kZTogVFZpZXdNb2RlKSB7XG4gICAgICBpZiAobW9kZSA9PT0gdGhpcy5jdXJyZW50TW9kZSAmJiB0aGlzLmN1cnJlbnRWaWV3ICYmIHRoaXMuYWN0aXZlTGVhZikge1xuICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBhd2FpdCB0aGlzLmNsb3NlQ3VycmVudFZpZXcoKTtcblxuICAgICAgY29uc3QgbGVhZiA9IGF3YWl0IHRoaXMuZ2V0TGVhZkZvck1vZGUobW9kZSk7XG4gICAgICBcbiAgICAgIGlmIChsZWFmICYmIG1vZGUgIT09ICdwb3B1cCcpIHtcbiAgICAgICAgIGF3YWl0IGxlYWYuc2V0Vmlld1N0YXRlKHtcbiAgICAgICAgICAgIHR5cGU6ICdwbHVnaW5mbG93ei12aWV3JyxcbiAgICAgICAgICAgIGFjdGl2ZTogdHJ1ZSxcbiAgICAgICAgICAgIHN0YXRlOiB7IFxuICAgICAgICAgICAgICAgbW9kZTogbW9kZSxcbiAgICAgICAgICAgICAgIGxlYWZJZDogdGhpcy5sZWFmSWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH0pO1xuXG4gICAgICAgICB0aGlzLmN1cnJlbnRWaWV3ID0gbGVhZi52aWV3IGFzIERhc2hib2FyZDtcbiAgICAgICAgIHRoaXMuYWN0aXZlTGVhZiA9IGxlYWY7XG4gICAgICAgICB0aGlzLnBsdWdpbi5hcHAud29ya3NwYWNlLnJldmVhbExlYWYobGVhZik7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY3VycmVudE1vZGUgPSBtb2RlO1xuICAgICAgLy8gU2F1dmVnYXJkZXIgbGUgbm91dmVhdSBtb2RlIGRhbnMgbGVzIHNldHRpbmdzXG4gICAgICBhd2FpdCBTZXR0aW5ncy5zYXZlU2V0dGluZ3MoeyBjdXJyZW50TW9kZTogbW9kZSB9KTtcbiAgIH1cblxuICAgZ2V0QWN0aXZlTGVhZigpOiBXb3Jrc3BhY2VMZWFmIHwgbnVsbCB7XG4gICAgICByZXR1cm4gdGhpcy5hY3RpdmVMZWFmO1xuICAgfVxuXG4gICBnZXRDdXJyZW50TGVhZklkKCk6IHN0cmluZyB8IG51bGwge1xuICAgICAgcmV0dXJuIHRoaXMubGVhZklkO1xuICAgfVxuXG4gICBwcml2YXRlIHJlbmRlclBsdWdpbkxpc3QoY29udGFpbmVyOiBIVE1MRWxlbWVudCwgcGx1Z2luczogSVBsdWdpbltdKSB7XG4gICAgICBcbiAgICAgIC8vIExpc3RlIGRlcyBwbHVnaW5zXG4gICAgICBjb25zdCBwbHVnaW5zTGlzdCA9IGNvbnRhaW5lci5jcmVhdGVEaXYoJ3BsdWdpbmZsb3d6LXBsdWdpbnMtbGlzdCcpO1xuICAgICAgXG4gICAgICAvLyBWXHUwMEU5cmlmaWVyIHMnaWwgeSBhIGRlcyBwbHVnaW5zXG4gICAgICBpZiAoIXBsdWdpbnMgfHwgcGx1Z2lucy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgIHBsdWdpbnNMaXN0LmNyZWF0ZUVsKCdwJywge1xuICAgICAgICAgICAgdGV4dDogdGhpcy50cmFuc2xhdGlvbnMudCgnZGFzaGJvYXJkLm5vUGx1Z2lucycpLFxuICAgICAgICAgICAgY2xzOiAncGx1Z2luZmxvd3otbm8tcGx1Z2lucydcbiAgICAgICAgIH0pO1xuICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBBZmZpY2hlciB0b3VzIGxlcyBwbHVnaW5zXG4gICAgICBwbHVnaW5zLmZvckVhY2gocGx1Z2luID0+IHtcbiAgICAgICAgIGNvbnN0IHBsdWdpbkVsID0gcGx1Z2luc0xpc3QuY3JlYXRlRGl2KCdwbHVnaW5mbG93ei1wbHVnaW4taXRlbScpO1xuICAgICAgICAgXG4gICAgICAgICAvLyBFbi10XHUwMEVBdGUgZHUgcGx1Z2luXG4gICAgICAgICBjb25zdCBoZWFkZXJFbCA9IHBsdWdpbkVsLmNyZWF0ZURpdigncGx1Z2luZmxvd3otcGx1Z2luLWhlYWRlcicpO1xuICAgICAgICAgaGVhZGVyRWwuY3JlYXRlRWwoJ2g0JywgeyB0ZXh0OiBwbHVnaW4udGl0bGUgfSk7XG4gICAgICAgICBcbiAgICAgICAgIC8vIFRhZ3NcbiAgICAgICAgIGlmIChwbHVnaW4udGFncy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCB0YWdzRWwgPSBwbHVnaW5FbC5jcmVhdGVEaXYoJ3BsdWdpbmZsb3d6LXBsdWdpbi10YWdzJyk7XG4gICAgICAgICAgICBwbHVnaW4udGFncy5mb3JFYWNoKHRhZyA9PiB7XG4gICAgICAgICAgICAgICB0YWdzRWwuY3JlYXRlRWwoJ3NwYW4nLCB7IFxuICAgICAgICAgICAgICAgICAgdGV4dDogdGFnLFxuICAgICAgICAgICAgICAgICAgY2xzOiAncGx1Z2luZmxvd3otcGx1Z2luLXRhZydcbiAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICB9XG4gICAgICAgICBcbiAgICAgICAgIC8vIERlc2NyaXB0aW9uXG4gICAgICAgICBpZiAocGx1Z2luLmRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICBwbHVnaW5FbC5jcmVhdGVFbCgncCcsIHsgdGV4dDogcGx1Z2luLmRlc2NyaXB0aW9uIH0pO1xuICAgICAgICAgfVxuICAgICAgICAgXG4gICAgICAgICAvLyBTdGF0dXQgZXQgbm90ZXNcbiAgICAgICAgIGNvbnN0IGluZm9FbCA9IHBsdWdpbkVsLmNyZWF0ZURpdigncGx1Z2luZmxvd3otcGx1Z2luLWluZm8nKTtcbiAgICAgICAgIGluZm9FbC5jcmVhdGVFbCgnc3BhbicsIHsgXG4gICAgICAgICAgICB0ZXh0OiBgU3RhdHVzOiAke3BsdWdpbi5zdGF0dXMuam9pbignLCAnKX1gLFxuICAgICAgICAgICAgY2xzOiAncGx1Z2luZmxvd3otcGx1Z2luLXN0YXR1cydcbiAgICAgICAgIH0pO1xuICAgICAgICAgaWYgKHBsdWdpbi5yYXRpbmcgPiAwKSB7XG4gICAgICAgICAgICBpbmZvRWwuY3JlYXRlRWwoJ3NwYW4nLCB7IFxuICAgICAgICAgICAgICAgdGV4dDogYFJhdGluZzogJHtwbHVnaW4ucmF0aW5nfS81YCxcbiAgICAgICAgICAgICAgIGNsczogJ3BsdWdpbmZsb3d6LXBsdWdpbi1yYXRpbmcnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgIH1cblxuICAgICAgICAgLy8gUmF0aW5nIGF2ZWMgc2xpZGVyXG4gICAgICAgICB0aGlzLmNyZWF0ZVJhdGluZ0NvbnRyb2wocGx1Z2luRWwsIHBsdWdpbiwgZmFsc2UpO1xuICAgICAgfSk7XG4gICB9XG5cbiAgIHByaXZhdGUgcmVuZGVyUGx1Z2luQ2FyZHMoY29udGFpbmVyOiBIVE1MRWxlbWVudCwgcGx1Z2luczogSVBsdWdpbltdKSB7XG4gICAgICBcbiAgICAgIGNvbnN0IGNhcmRzR3JpZCA9IGNvbnRhaW5lci5jcmVhdGVEaXYoJ3BsdWdpbmZsb3d6LWNhcmRzLWdyaWQnKTtcbiAgICAgIFxuICAgICAgLy8gVlx1MDBFOXJpZmllciBzJ2lsIHkgYSBkZXMgcGx1Z2luc1xuICAgICAgaWYgKCFwbHVnaW5zIHx8IHBsdWdpbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICBjYXJkc0dyaWQuY3JlYXRlRWwoJ3AnLCB7XG4gICAgICAgICAgICB0ZXh0OiB0aGlzLnRyYW5zbGF0aW9ucy50KCdkYXNoYm9hcmQubm9QbHVnaW5zJyksXG4gICAgICAgICAgICBjbHM6ICdwbHVnaW5mbG93ei1uby1wbHVnaW5zJ1xuICAgICAgICAgfSk7XG4gICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnNvbGUubG9nKCdSZW5kZXJpbmcgY2FyZHMgZm9yIHBsdWdpbnM6JywgcGx1Z2lucyk7IC8vIERlYnVnXG5cbiAgICAgIHBsdWdpbnMuZm9yRWFjaChwbHVnaW4gPT4ge1xuICAgICAgICAgY29uc29sZS5sb2coJ0NyZWF0aW5nIGNhcmQgZm9yIHBsdWdpbjonLCBwbHVnaW4udGl0bGUpOyAvLyBEZWJ1Z1xuICAgICAgICAgY29uc3QgY2FyZCA9IGNhcmRzR3JpZC5jcmVhdGVEaXYoJ3BsdWdpbmZsb3d6LWNhcmQnKTtcbiAgICAgICAgIFxuICAgICAgICAgLy8gSGVhZGVyIGF2ZWMgYWN0aW9uc1xuICAgICAgICAgY29uc3QgY2FyZEhlYWRlciA9IGNhcmQuY3JlYXRlRGl2KCdwbHVnaW5mbG93ei1jYXJkLWhlYWRlcicpO1xuICAgICAgICAgY29uc3QgdGl0bGVFbCA9IGNhcmRIZWFkZXIuY3JlYXRlRWwoJ2gzJywgeyB0ZXh0OiBwbHVnaW4udGl0bGUgfSk7XG4gICAgICAgICBcbiAgICAgICAgIC8vIEJvdXRvbnMgZCdhY3Rpb25cbiAgICAgICAgIGNvbnN0IGFjdGlvbnMgPSBuZXcgU2V0dGluZyhjYXJkSGVhZGVyKTtcbiAgICAgICAgIGFjdGlvbnNcbiAgICAgICAgICAgIC5hZGRFeHRyYUJ1dHRvbihidG4gPT4gYnRuXG4gICAgICAgICAgICAgICAuc2V0SWNvbihwbHVnaW4uYWN0aXZhdGUgPyAnY2hlY2stY2lyY2xlJyA6ICdjaXJjbGUnKVxuICAgICAgICAgICAgICAgLnNldFRvb2x0aXAodGhpcy50cmFuc2xhdGlvbnMudChwbHVnaW4uYWN0aXZhdGUgPyBcbiAgICAgICAgICAgICAgICAgICdzZXR0aW5ncy5wbHVnaW5zLmRlYWN0aXZhdGUudG9vbHRpcCcgOiBcbiAgICAgICAgICAgICAgICAgICdzZXR0aW5ncy5wbHVnaW5zLmFjdGl2YXRlLnRvb2x0aXAnXG4gICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgcGx1Z2luLmFjdGl2YXRlID0gIXBsdWdpbi5hY3RpdmF0ZTtcbiAgICAgICAgICAgICAgICAgIGJ0bi5zZXRJY29uKHBsdWdpbi5hY3RpdmF0ZSA/ICdjaGVjay1jaXJjbGUnIDogJ2NpcmNsZScpO1xuICAgICAgICAgICAgICAgICAgYXdhaXQgU2V0dGluZ3Muc2F2ZVNldHRpbmdzKHRoaXMuc2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZSh0aGlzLnRyYW5zbGF0aW9ucy50KHBsdWdpbi5hY3RpdmF0ZSA/IFxuICAgICAgICAgICAgICAgICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuYWN0aXZhdGVkJyA6IFxuICAgICAgICAgICAgICAgICAgICAgJ3NldHRpbmdzLnBsdWdpbnMuZGVhY3RpdmF0ZWQnXG4gICAgICAgICAgICAgICAgICApLnJlcGxhY2UoJ3t0aXRsZX0nLCBwbHVnaW4udGl0bGUpKTtcbiAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAuYWRkRXh0cmFCdXR0b24oYnRuID0+IGJ0blxuICAgICAgICAgICAgICAgLnNldEljb24oJ21vcmUtdmVydGljYWwnKVxuICAgICAgICAgICAgICAgLnNldFRvb2x0aXAodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MucGx1Z2lucy5vcHRpb25zLnRvb2x0aXAnKSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICBcbiAgICAgICAgIC8vIERlc2NyaXB0aW9uXG4gICAgICAgICBpZiAocGx1Z2luLmRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICBjYXJkLmNyZWF0ZUVsKCdwJywgeyBcbiAgICAgICAgICAgICAgIHRleHQ6IHBsdWdpbi5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgIGNsczogJ3BsdWdpbmZsb3d6LWNhcmQtZGVzY3JpcHRpb24nXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgIH1cbiAgICAgICAgIFxuICAgICAgICAgLy8gRm9vdGVyIGF2ZWMgdGFncyBldCBzdGF0c1xuICAgICAgICAgY29uc3QgY2FyZEZvb3RlciA9IGNhcmQuY3JlYXRlRGl2KCdwbHVnaW5mbG93ei1jYXJkLWZvb3RlcicpO1xuICAgICAgICAgXG4gICAgICAgICAvLyBUYWdzXG4gICAgICAgICBpZiAocGx1Z2luLnRhZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgdGFnc0NvbnRhaW5lciA9IGNhcmRGb290ZXIuY3JlYXRlRGl2KCdwbHVnaW5mbG93ei1jYXJkLXRhZ3MnKTtcbiAgICAgICAgICAgIHBsdWdpbi50YWdzLmZvckVhY2godGFnID0+IHtcbiAgICAgICAgICAgICAgIHRhZ3NDb250YWluZXIuY3JlYXRlRWwoJ3NwYW4nLCB7IFxuICAgICAgICAgICAgICAgICAgdGV4dDogdGFnLFxuICAgICAgICAgICAgICAgICAgY2xzOiAncGx1Z2luZmxvd3otdGFnJ1xuICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgIH1cbiAgICAgICAgIFxuICAgICAgICAgLy8gU3RhdHNcbiAgICAgICAgIGNvbnN0IHN0YXRzID0gY2FyZEZvb3Rlci5jcmVhdGVEaXYoJ3BsdWdpbmZsb3d6LWNhcmQtc3RhdHMnKTtcbiAgICAgICAgIHN0YXRzLmNyZWF0ZUVsKCdzcGFuJywgeyBcbiAgICAgICAgICAgIHRleHQ6IHBsdWdpbi5zdGF0dXNbMF0sXG4gICAgICAgICAgICBjbHM6IGBwbHVnaW5mbG93ei1zdGF0dXMtJHtwbHVnaW4uc3RhdHVzWzBdfWBcbiAgICAgICAgIH0pO1xuXG4gICAgICAgICAvLyBSYXRpbmcgYXZlYyBwcm9ncmVzcyBiYXJcbiAgICAgICAgIHRoaXMuY3JlYXRlUmF0aW5nQ29udHJvbChjYXJkLCBwbHVnaW4sIHRydWUpO1xuICAgICAgfSk7XG4gICB9XG5cbiAgIHByaXZhdGUgY3JlYXRlUmF0aW5nQ29udHJvbChjb250YWluZXI6IEhUTUxFbGVtZW50LCBwbHVnaW46IElQbHVnaW4sIGlzQ2FyZDogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgICAgaWYgKGlzQ2FyZCkge1xuICAgICAgICAgICAvLyBWZXJzaW9uIENhcmQgYXZlYyBQcm9ncmVzcyBCYXJcbiAgICAgICAgICAgY29uc3QgcmF0aW5nQ29udGFpbmVyID0gY29udGFpbmVyLmNyZWF0ZURpdigncGx1Z2luZmxvd3otY2FyZC1yYXRpbmcnKTtcbiAgICAgICAgICAgY29uc3QgcmF0aW5nVGV4dCA9IHJhdGluZ0NvbnRhaW5lci5jcmVhdGVFbCgnc3BhbicsIHtcbiAgICAgICAgICAgICAgIHRleHQ6ICdcdTJCNTAgJyxcbiAgICAgICAgICAgICAgIGNsczogJ3BsdWdpbmZsb3d6LXJhdGluZy10ZXh0J1xuICAgICAgICAgICB9KTtcblxuICAgICAgICAgICBjb25zdCBwcm9ncmVzc0NvbnRhaW5lciA9IHJhdGluZ0NvbnRhaW5lci5jcmVhdGVEaXYoJ3Byb2dyZXNzLWNvbnRhaW5lcicpO1xuICAgICAgICAgICBjb25zdCBwcm9ncmVzc0JhciA9IHByb2dyZXNzQ29udGFpbmVyLmNyZWF0ZURpdigncHJvZ3Jlc3MtYmFyJyk7XG4gICAgICAgICAgIHByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gYCR7KHBsdWdpbi5yYXRpbmcgLyA1KSAqIDEwMH0lYDtcblxuICAgICAgICAgICBjb25zdCByYXRpbmdWYWx1ZSA9IHJhdGluZ0NvbnRhaW5lci5jcmVhdGVFbCgnc3BhbicsIHtcbiAgICAgICAgICAgICAgIHRleHQ6IGAke3BsdWdpbi5yYXRpbmd9LzVgLFxuICAgICAgICAgICAgICAgY2xzOiAncGx1Z2luZmxvd3otcmF0aW5nLXZhbHVlJ1xuICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAvLyBGb25jdGlvbiBwb3VyIG1ldHRyZSBcdTAwRTAgam91ciBsZSByYXRpbmdcbiAgICAgICAgICAgY29uc3QgdXBkYXRlUmF0aW5nID0gYXN5bmMgKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgIGNvbnN0IHJlY3QgPSBwcm9ncmVzc0NvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgICAgIGNvbnN0IHggPSBNYXRoLm1heCgwLCBNYXRoLm1pbihlLmNsaWVudFggLSByZWN0LmxlZnQsIHJlY3Qud2lkdGgpKTtcbiAgICAgICAgICAgICAgIGNvbnN0IG5ld1JhdGluZyA9IE1hdGgucm91bmQoKHggLyByZWN0LndpZHRoKSAqIDUpO1xuICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICBwbHVnaW4ucmF0aW5nID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oNSwgbmV3UmF0aW5nKSk7XG4gICAgICAgICAgICAgICBwcm9ncmVzc0Jhci5zdHlsZS53aWR0aCA9IGAkeyhwbHVnaW4ucmF0aW5nIC8gNSkgKiAxMDB9JWA7XG4gICAgICAgICAgICAgICByYXRpbmdWYWx1ZS5zZXRUZXh0KGAke3BsdWdpbi5yYXRpbmd9LzVgKTtcbiAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgYXdhaXQgU2V0dGluZ3Muc2F2ZVNldHRpbmdzKHRoaXMuc2V0dGluZ3MpO1xuICAgICAgICAgICB9O1xuXG4gICAgICAgICAgIC8vIFJlbmRyZSBsYSBwcm9ncmVzcyBiYXIgaW50ZXJhY3RpdmVcbiAgICAgICAgICAgcHJvZ3Jlc3NDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKGUpID0+IHtcbiAgICAgICAgICAgICAgIGlmIChlLmJ1dHRvbnMgPT09IDEpIHsgLy8gU2kgbGUgYm91dG9uIGdhdWNoZSBlc3QgZW5mb25jXHUwMEU5XG4gICAgICAgICAgICAgICAgICAgdXBkYXRlUmF0aW5nKGUpO1xuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICB9KTtcblxuICAgICAgICAgICBwcm9ncmVzc0NvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHVwZGF0ZVJhdGluZyk7XG5cbiAgICAgICAgICAgLy8gQWpvdXRlciB1biBzdHlsZSBhdSBzdXJ2b2xcbiAgICAgICAgICAgcHJvZ3Jlc3NDb250YWluZXIuc3R5bGUuY3Vyc29yID0gJ3BvaW50ZXInO1xuICAgICAgICAgICBwcm9ncmVzc0NvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgY29uc3QgcmVjdCA9IHByb2dyZXNzQ29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgICAgY29uc3QgeCA9IE1hdGgubWF4KDAsIE1hdGgubWluKGUuY2xpZW50WCAtIHJlY3QubGVmdCwgcmVjdC53aWR0aCkpO1xuICAgICAgICAgICAgICAgY29uc3QgaG92ZXJSYXRpbmcgPSBNYXRoLnJvdW5kKCh4IC8gcmVjdC53aWR0aCkgKiA1KTtcbiAgICAgICAgICAgICAgIHByb2dyZXNzQ29udGFpbmVyLnNldEF0dHJpYnV0ZSgndGl0bGUnLCBgJHtob3ZlclJhdGluZ30vNWApO1xuICAgICAgICAgICB9KTtcbiAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAvLyBWZXJzaW9uIExpc3QgYXZlYyBTbGlkZXJcbiAgICAgICAgICAgY29uc3QgcmF0aW5nQ29udGFpbmVyID0gY29udGFpbmVyLmNyZWF0ZURpdigncGx1Z2luZmxvd3otcmF0aW5nLWNvbnRhaW5lcicpO1xuICAgICAgICAgICBuZXcgU2V0dGluZyhyYXRpbmdDb250YWluZXIpXG4gICAgICAgICAgICAgICAuc2V0TmFtZSh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5wbHVnaW5zLm9wdGlvbnMucmF0aW5nJykpXG4gICAgICAgICAgICAgICAuYWRkU2xpZGVyKHNsaWRlciA9PiBzbGlkZXJcbiAgICAgICAgICAgICAgICAgICAuc2V0TGltaXRzKDAsIDUsIDEpXG4gICAgICAgICAgICAgICAgICAgLnNldFZhbHVlKHBsdWdpbi5yYXRpbmcpXG4gICAgICAgICAgICAgICAgICAgLnNldER5bmFtaWNUb29sdGlwKClcbiAgICAgICAgICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgIHBsdWdpbi5yYXRpbmcgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgU2V0dGluZ3Muc2F2ZVNldHRpbmdzKHRoaXMuc2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICApO1xuICAgICAgIH1cbiAgIH1cblxuICAgcHJpdmF0ZSByZW5kZXJDb250ZW50KGNvbnRhaW5lcjogSFRNTEVsZW1lbnQpIHtcbiAgICAgIGNvbnRhaW5lci5lbXB0eSgpO1xuICAgICAgXG4gICAgICAvLyBDb250YWluZXIgcHJpbmNpcGFsXG4gICAgICBjb25zdCBkYXNoYm9hcmRDb250YWluZXIgPSBjb250YWluZXIuY3JlYXRlRGl2KCdwbHVnaW5mbG93ei1kYXNoYm9hcmQtY29udGFpbmVyJyk7XG4gICAgICBcbiAgICAgIC8vIEhlYWRlciBhdmVjIHRpdHJlIGV0IHRvZ2dsZVxuICAgICAgY29uc3QgaGVhZGVyID0gZGFzaGJvYXJkQ29udGFpbmVyLmNyZWF0ZURpdigncGx1Z2luZmxvd3otaGVhZGVyJyk7XG4gICAgICBoZWFkZXIuY3JlYXRlRWwoJ2gyJywgeyB0ZXh0OiB0aGlzLnRyYW5zbGF0aW9ucy50KCdkYXNoYm9hcmQuaW5zdGFsbGVkUGx1Z2lucycpIH0pO1xuICAgICAgXG4gICAgICAvLyBCb3V0b24gZGUgY2hhbmdlbWVudCBkZSB2dWVcbiAgICAgIGNvbnN0IHZpZXdCdXR0b24gPSBoZWFkZXIuY3JlYXRlRWwoJ2J1dHRvbicsIHtcbiAgICAgICAgIGNsczogJ3BsdWdpbmZsb3d6LXZpZXctYnV0dG9uJyxcbiAgICAgICAgIHRleHQ6IHRoaXMudHJhbnNsYXRpb25zLnQoXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRWaWV3TW9kZSA9PT0gJ2NhcmRzJyBcbiAgICAgICAgICAgICAgID8gJ2Rhc2hib2FyZC5saXN0VmlldycgXG4gICAgICAgICAgICAgICA6ICdkYXNoYm9hcmQuY2FyZFZpZXcnXG4gICAgICAgICApXG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgdmlld0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jICgpID0+IHtcbiAgICAgICAgIHRoaXMuY3VycmVudFZpZXdNb2RlID0gdGhpcy5jdXJyZW50Vmlld01vZGUgPT09ICdjYXJkcycgPyAnbGlzdCcgOiAnY2FyZHMnO1xuICAgICAgICAgdmlld0J1dHRvbi5zZXRUZXh0KHRoaXMudHJhbnNsYXRpb25zLnQoXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRWaWV3TW9kZSA9PT0gJ2NhcmRzJyBcbiAgICAgICAgICAgICAgID8gJ2Rhc2hib2FyZC5saXN0VmlldycgXG4gICAgICAgICAgICAgICA6ICdkYXNoYm9hcmQuY2FyZFZpZXcnXG4gICAgICAgICApKTtcbiAgICAgICAgIFxuICAgICAgICAgLy8gU2F1dmVnYXJkZXIgbGUgbW9kZSBkJ2FmZmljaGFnZVxuICAgICAgICAgYXdhaXQgU2V0dGluZ3Muc2F2ZVNldHRpbmdzKHtcbiAgICAgICAgICAgIGRlZmF1bHRWaWV3TW9kZTogdGhpcy5jdXJyZW50Vmlld01vZGVcbiAgICAgICAgIH0pO1xuICAgICAgICAgXG4gICAgICAgICB0aGlzLnJlbmRlckNvbnRlbnQoY29udGFpbmVyKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBDb250ZW51IChsaXN0ZSBvdSBjYXJ0ZXMpXG4gICAgICBjb25zdCBjb250ZW50Q29udGFpbmVyID0gZGFzaGJvYXJkQ29udGFpbmVyLmNyZWF0ZURpdigncGx1Z2luZmxvd3otY29udGVudCcpO1xuICAgICAgaWYgKHRoaXMuY3VycmVudFZpZXdNb2RlID09PSAnY2FyZHMnKSB7XG4gICAgICAgICB0aGlzLnJlbmRlclBsdWdpbkNhcmRzKGNvbnRlbnRDb250YWluZXIsIHRoaXMucGx1Z2lucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgdGhpcy5yZW5kZXJQbHVnaW5MaXN0KGNvbnRlbnRDb250YWluZXIsIHRoaXMucGx1Z2lucyk7XG4gICAgICB9XG4gICB9XG59ICIsICJpbXBvcnQgeyBQbHVnaW4sIFBsdWdpbk1hbmlmZXN0IH0gZnJvbSAnb2JzaWRpYW4nO1xyXG5pbXBvcnQgeyBJUGx1Z2luLCBUUGx1Z2luU3RhdHVzIH0gZnJvbSAnLi90eXBlcyc7XHJcblxyXG5leHBvcnQgY2xhc3MgUGx1Z2luTWFuYWdlciB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBsdWdpbjogUGx1Z2luKSB7fVxyXG5cclxuICAgIGFzeW5jIGdldEluc3RhbGxlZFBsdWdpbnMoKTogUHJvbWlzZTxJUGx1Z2luW10+IHtcclxuICAgICAgICBjb25zdCBwbHVnaW5zOiBJUGx1Z2luW10gPSBbXTtcclxuICAgICAgICBjb25zdCBtYW5pZmVzdHMgPSBPYmplY3QuZW50cmllcyh0aGlzLnBsdWdpbi5hcHAucGx1Z2lucy5tYW5pZmVzdHMpIGFzIFtzdHJpbmcsIFBsdWdpbk1hbmlmZXN0XVtdO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdcdUQ4M0RcdUREMEMgUGx1Z2luTWFuYWdlciAtIERcdTAwRTl0ZWN0aW9uIGRlcyBwbHVnaW5zOicsIG1hbmlmZXN0cy5sZW5ndGgsICdwbHVnaW5zIHRyb3V2XHUwMEU5cycpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFBhcmNvdXJpciB0b3VzIGxlcyBwbHVnaW5zIGluc3RhbGxcdTAwRTlzXHJcbiAgICAgICAgZm9yIChjb25zdCBbaWQsIG1hbmlmZXN0XSBvZiBtYW5pZmVzdHMpIHtcclxuICAgICAgICAgICAgLy8gSWdub3JlciBub3RyZSBwcm9wcmUgcGx1Z2luXHJcbiAgICAgICAgICAgIGlmIChpZCA9PT0gdGhpcy5wbHVnaW4ubWFuaWZlc3QuaWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdcdUQ4M0RcdUREMEMgUGx1Z2luTWFuYWdlciAtIElnbm9yXHUwMEU5OicsIGlkLCAnKG5vdHJlIHBsdWdpbiknKTtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBwbHVnaW5zLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IG1hbmlmZXN0Lm5hbWUsXHJcbiAgICAgICAgICAgICAgICB1cmw6IG1hbmlmZXN0LmF1dGhvclVybCB8fCAnJyxcclxuICAgICAgICAgICAgICAgIHRhZ3M6IFtdLFxyXG4gICAgICAgICAgICAgICAgc3RhdHVzOiBbJ2V4cGxvcmluZycgYXMgVFBsdWdpblN0YXR1c10sXHJcbiAgICAgICAgICAgICAgICBhY3RpdmF0ZTogdGhpcy5wbHVnaW4uYXBwLnBsdWdpbnMuZ2V0UGx1Z2luKGlkKT8uZW5hYmxlZCB8fCBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBtYW5pZmVzdC5kZXNjcmlwdGlvbixcclxuICAgICAgICAgICAgICAgIHRyYW5zY3JpYmU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZ3JvdXA6IFtdLFxyXG4gICAgICAgICAgICAgICAgcmF0aW5nOiAwLFxyXG4gICAgICAgICAgICAgICAgdXJnZW5jeTogMSxcclxuICAgICAgICAgICAgICAgIGltcG9ydGFuY2U6IDEsXHJcbiAgICAgICAgICAgICAgICBtZE5vdGU6IGAke2lkfS5tZGBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdcdUQ4M0RcdUREMEMgUGx1Z2luTWFuYWdlciAtIEFqb3V0XHUwMEU5OicsIG1hbmlmZXN0Lm5hbWUsICcoJywgaWQsICcpJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygnXHVEODNEXHVERDBDIFBsdWdpbk1hbmFnZXIgLSBUb3RhbDonLCBwbHVnaW5zLmxlbmd0aCwgJ3BsdWdpbnMgYWpvdXRcdTAwRTlzJyk7XHJcbiAgICAgICAgcmV0dXJuIHBsdWdpbnM7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgc3luY1BsdWdpbnMoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ1x1RDgzRFx1REQwNCBQbHVnaW5NYW5hZ2VyIC0gRFx1MDBFOWJ1dCBkZSBsYSBzeW5jaHJvbmlzYXRpb24nKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBDaGFyZ2VyIGxlcyBkb25uXHUwMEU5ZXMgZXhpc3RhbnRlc1xyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCB0aGlzLnBsdWdpbi5sb2FkRGF0YSgpO1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRQbHVnaW5zID0gZGF0YT8ucGx1Z2lucyB8fCBbXTtcclxuICAgICAgICBjb25zb2xlLmxvZygnXHVEODNEXHVERDA0IFBsdWdpbk1hbmFnZXIgLSBQbHVnaW5zIGV4aXN0YW50czonLCBjdXJyZW50UGx1Z2lucy5sZW5ndGgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFJcdTAwRTljdXBcdTAwRTlyZXIgbGVzIHBsdWdpbnMgaW5zdGFsbFx1MDBFOXNcclxuICAgICAgICBjb25zdCBpbnN0YWxsZWRQbHVnaW5zID0gYXdhaXQgdGhpcy5nZXRJbnN0YWxsZWRQbHVnaW5zKCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ1x1RDgzRFx1REQwNCBQbHVnaW5NYW5hZ2VyIC0gUGx1Z2lucyBpbnN0YWxsXHUwMEU5czonLCBpbnN0YWxsZWRQbHVnaW5zLmxlbmd0aCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gRnVzaW9ubmVyIGxlcyBkb25uXHUwMEU5ZXNcclxuICAgICAgICBjb25zdCBtZXJnZWRQbHVnaW5zID0gaW5zdGFsbGVkUGx1Z2lucy5tYXAobmV3UGx1Z2luID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZXhpc3RpbmdQbHVnaW4gPSBjdXJyZW50UGx1Z2lucy5maW5kKHAgPT4gcC50aXRsZSA9PT0gbmV3UGx1Z2luLnRpdGxlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGV4aXN0aW5nUGx1Z2luID8geyAuLi5uZXdQbHVnaW4sIC4uLmV4aXN0aW5nUGx1Z2luIH0gOiBuZXdQbHVnaW47XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc29sZS5sb2coJ1x1RDgzRFx1REQwNCBQbHVnaW5NYW5hZ2VyIC0gUGx1Z2lucyBhcHJcdTAwRThzIGZ1c2lvbjonLCBtZXJnZWRQbHVnaW5zLmxlbmd0aCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gU2F1dmVnYXJkZXJcclxuICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlRGF0YSh7XHJcbiAgICAgICAgICAgIC4uLmRhdGEsXHJcbiAgICAgICAgICAgIHBsdWdpbnM6IG1lcmdlZFBsdWdpbnNcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zb2xlLmxvZygnXHVEODNEXHVERDA0IFBsdWdpbk1hbmFnZXIgLSBTeW5jaHJvbmlzYXRpb24gdGVybWluXHUwMEU5ZScpO1xyXG4gICAgfVxyXG59ICJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFBQUEsbUJBQTZCOzs7QUNBdEIsU0FBUyxpQkFBaUI7QUFDakMsUUFBTSxVQUFVLFNBQVMsY0FBYyxPQUFPO0FBQzlDLFVBQVEsS0FBSztBQUNiLFVBQVEsY0FBYztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUF1TXRCLFdBQVMsS0FBSyxZ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QyxXQUFXLEtBQWE7QUFDOUIsY0FBTSxhQUFhLFdBQVcsU0FBUyxNQUFNO0FBQzdDLGNBQU0sYUFBYUEsWUFBV0EsU0FBUSxTQUFTLE1BQU07QUFFckQsWUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZO0FBQzdCLGVBQUssS0FBSztBQUNWLHFCQUFXLG9CQUFvQixjQUFjLGdCQUFnQjtBQUM3RCxjQUFJQSxVQUFTO0FBQ1YsWUFBQUEsU0FBUSxvQkFBb0IsY0FBYyxnQkFBZ0I7QUFBQSxVQUM3RDtBQUFBLFFBQ0g7QUFBQSxNQUNIO0FBRUEsaUJBQVcsaUJBQWlCLGNBQWMsZ0JBQWdCO0FBQzFELFlBQU0sVUFBVyxLQUFhO0FBQzlCLFVBQUksU0FBUztBQUNWLGdCQUFRLGlCQUFpQixjQUFjLGdCQUFnQjtBQUFBLE1BQzFEO0FBQUEsSUFDSCxDQUFDO0FBRUQsbUJBQWU7QUFHZixVQUFNLGdCQUFnQixJQUFJLGNBQWMsSUFBSTtBQUM1QyxVQUFNLGNBQWMsWUFBWTtBQUFBLEVBQ25DO0FBQUEsRUFFQSxNQUFjLFVBQXlCO0FBQ3BDLFdBQU8sSUFBSSxRQUFRLENBQUMsWUFBWTtBQUM3QixVQUFJLENBQUMsS0FBSyxJQUFJLFdBQVc7QUFDdEIsbUJBQVcsU0FBUyxDQUFDO0FBQUEsTUFDeEIsT0FBTztBQUNKLGdCQUFRO0FBQUEsTUFDWDtBQUFBLElBQ0gsQ0FBQztBQUFBLEVBQ0o7QUFBQSxFQUVRLGVBQXFCO0FBbkloQztBQW9JTSxRQUFJO0FBQ0QsWUFBTSxXQUFTLGNBQVMsZ0JBQWdCLFNBQXpCLG1CQUErQixjQUFjLFdBQVcsU0FBUSxPQUFPO0FBQ3RGLGNBQVEsSUFBSSwwQkFBb0IsTUFBTTtBQUN0QyxXQUFLLGFBQWEsWUFBWSxNQUFNO0FBQUEsSUFDdkMsU0FBUyxPQUFPO0FBQ2IsY0FBUSxLQUFLLHVGQUE4RTtBQUMzRixXQUFLLGFBQWEsWUFBWSxJQUFJO0FBQUEsSUFDckM7QUFBQSxFQUNIO0FBQUEsRUFFQSxXQUFXO0FBQ1IsU0FBSyxJQUFJLFVBQVUsbUJBQW1CLGtCQUFrQjtBQUFBLEVBQzNEO0FBQ0g7IiwKICAibmFtZXMiOiBbImltcG9ydF9vYnNpZGlhbiIsICJ0cmFuc2xhdGlvbnMiLCAiX2EiLCAiaW1wb3J0X29ic2lkaWFuIiwgInRyYW5zbGF0aW9ucyIsICJpbXBvcnRfb2JzaWRpYW4iLCAidHJhbnNsYXRpb25zIiwgImltcG9ydF9vYnNpZGlhbiIsICJsZWFmIiwgIm1lbnVEb20iXQp9Cg==
