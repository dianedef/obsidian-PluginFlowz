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
  styleEl.id = "MYPLUGIN-styles";
  styleEl.textContent = `
    /* ===== CSS ===== */
    .modal {
        width: 90vw;
        height: 90vh;
        max-width: 90vw;
        max-height: 90vh;
    }

    .modal-content {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .dashboard-container {
        padding: 20px;
        flex: 1;
        overflow-y: auto;
    }

    .plugins-list {
        display: grid;
        gap: 20px;
        padding: 20px 0;
    }

    .plugin-item {
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
  currentMode: "tab",
  activeLeafId: null
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
    this.settings = settings;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian.Setting(containerEl).setName(this.translations.t("settings.defaultViewMode")).setDesc(this.translations.t("settings.defaultViewModeDesc")).addDropdown((dropdown) => dropdown.addOption("tab", this.translations.t("settings.tab")).addOption("sidebar", this.translations.t("settings.sidebar")).addOption("popup", this.translations.t("settings.popup")).setValue(this.settings.currentMode).onChange(async (value) => {
      this.settings.currentMode = value;
      await Settings.saveSettings({ currentMode: value });
      await this.viewMode.setView(value);
    }));
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
    "settings.defaultViewModeDesc": "Choose how videos will open by default",
    "settings.tab": "Tab",
    "settings.sidebar": "Sidebar",
    "settings.popup": "Popup"
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
    "settings.defaultViewModeDesc": "Choisissez comment les vid\xE9os s'ouvriront par d\xE9faut",
    "settings.tab": "Onglet",
    "settings.sidebar": "Barre lat\xE9rale",
    "settings.popup": "Fen\xEAtre contextuelle"
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
  handleCommandError(error) {
    if (error instanceof CommandError) {
      console.error("[Hotkeys]", error);
      new import_obsidian2.Notice(this.translations.t(`errors.${error.code}`));
      throw error;
    }
    throw error;
  }
  registerHotkeys() {
    this.plugin.addCommand({
      id: "open-plugins-dashboard",
      name: this.translations.t("commands.openDashboard"),
      icon: "dashboard",
      callback: async () => {
        try {
          const mode = await Settings.getViewMode();
          await this.viewMode.setView(mode);
        } catch (error) {
          this.handleCommandError(error);
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
    let leaf;
    switch (mode) {
      case "sidebar":
        leaf = (_a = workspace.getRightLeaf(false)) != null ? _a : workspace.getLeaf("split");
        break;
      case "popup":
        const modal = new import_obsidian4.Modal(this.plugin.app);
        modal.titleEl.setText(this.translations.t("dashboard.title"));
        const container = modal.contentEl.createDiv("dashboard-container");
        const view = new Dashboard(workspace.getLeaf("split"), Settings, this.translations);
        view.onOpen();
        modal.onClose = () => {
          view.onClose();
        };
        modal.open();
        return workspace.getLeaf("split");
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
    await leaf.setViewState({
      type: "pluginflowz-view",
      active: true,
      state: {
        mode,
        leafId: this.leafId
      }
    });
    this.currentMode = mode;
    await Settings.saveSettings({ currentMode: mode });
    this.currentView = leaf.view;
    this.activeLeaf = leaf;
    this.plugin.app.workspace.revealLeaf(leaf);
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL21haW4udHMiLCAic3JjL1JlZ2lzdGVyU3R5bGVzLnRzIiwgInNyYy9TZXR0aW5ncy50cyIsICJzcmMvVHJhbnNsYXRpb25zLnRzIiwgInNyYy9Ib3RrZXlzLnRzIiwgInNyYy9EYXNoYm9hcmQudHMiLCAic3JjL1ZpZXdNb2RlLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyBQbHVnaW4sIE1lbnUgfSBmcm9tICdvYnNpZGlhbic7XHJcbmltcG9ydCB7IFRWaWV3TW9kZSB9IGZyb20gJy4vdHlwZXMnO1xyXG5pbXBvcnQgeyByZWdpc3RlclN0eWxlcyB9IGZyb20gJy4vUmVnaXN0ZXJTdHlsZXMnO1xyXG5pbXBvcnQgeyBTZXR0aW5ncywgU2V0dGluZ3NUYWIsIERFRkFVTFRfU0VUVElOR1MgfSBmcm9tICcuL1NldHRpbmdzJ1xyXG5pbXBvcnQgeyBUcmFuc2xhdGlvbnMgfSBmcm9tICcuL1RyYW5zbGF0aW9ucyc7XHJcbmltcG9ydCB7IEhvdGtleXMgfSBmcm9tICcuL0hvdGtleXMnO1xyXG5pbXBvcnQgeyBEYXNoYm9hcmQgfSBmcm9tICcuL0Rhc2hib2FyZCc7XHJcbmltcG9ydCB7IFZpZXdNb2RlIH0gZnJvbSAnLi9WaWV3TW9kZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbHVnaW5GbG93eiBleHRlbmRzIFBsdWdpbiB7XHJcbiAgIHByaXZhdGUgdmlld01vZGUhOiBWaWV3TW9kZTtcclxuICAgc2V0dGluZ3MhOiBTZXR0aW5ncztcclxuICAgcHJpdmF0ZSB0cmFuc2xhdGlvbnM6IFRyYW5zbGF0aW9ucyA9IG5ldyBUcmFuc2xhdGlvbnMoKTtcclxuICAgcHJpdmF0ZSBob3RrZXlzITogSG90a2V5cztcclxuICAgcHJpdmF0ZSBkYXNoYm9hcmQhOiBEYXNoYm9hcmQ7XHJcblxyXG4gICBwcml2YXRlIGluaXRpYWxpemVWaWV3KCkge1xyXG4gICAgICB0aGlzLnJlZ2lzdGVyVmlldyhcclxuICAgICAgICAgXCJwbHVnaW5mbG93ei12aWV3XCIsXHJcbiAgICAgICAgIChsZWFmKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZpZXcgPSBuZXcgRGFzaGJvYXJkKGxlYWYsIHRoaXMuc2V0dGluZ3MsIHRoaXMudHJhbnNsYXRpb25zKTtcclxuICAgICAgICAgICAgdGhpcy5kYXNoYm9hcmQgPSB2aWV3O1xyXG4gICAgICAgICAgICByZXR1cm4gdmlldztcclxuICAgICAgICAgfVxyXG4gICAgICApO1xyXG4gICB9XHJcblxyXG4gICBhc3luYyBvbmxvYWQoKSB7XHJcbiAgICAgIGF3YWl0IHRoaXMubG9hZEFwcCgpO1xyXG5cclxuICAgICAgLy8gSW5pdGlhbGlzYXRpb25cclxuICAgICAgU2V0dGluZ3MuaW5pdGlhbGl6ZSh0aGlzKTtcclxuICAgICAgXHJcbiAgICAgIC8vIEluaXRpYWxpc2VyIGxlcyB0cmFkdWN0aW9uc1xyXG4gICAgICB0aGlzLmxvYWRMYW5ndWFnZSgpO1xyXG5cclxuICAgICAgLy8gSW5pdGlhbGlzZXIgVmlld01vZGUgYXZhbnQgZGUgbCd1dGlsaXNlclxyXG4gICAgICB0aGlzLnZpZXdNb2RlID0gbmV3IFZpZXdNb2RlKHRoaXMpO1xyXG4gICAgICBcclxuICAgICAgLy8gSW5pdGlhbGlzZXIgbGVzIGhvdGtleXNcclxuICAgICAgdGhpcy5ob3RrZXlzID0gbmV3IEhvdGtleXMoXHJcbiAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgIFNldHRpbmdzLFxyXG4gICAgICAgICB0aGlzLnRyYW5zbGF0aW9ucyxcclxuICAgICAgICAgdGhpcy52aWV3TW9kZVxyXG4gICAgICApO1xyXG4gICAgICB0aGlzLmhvdGtleXMucmVnaXN0ZXJIb3RrZXlzKCk7XHJcbiAgICAgIFxyXG4gICAgICB0aGlzLmluaXRpYWxpemVWaWV3KCk7XHJcblxyXG4gICAgICB0aGlzLmFkZFNldHRpbmdUYWIobmV3IFNldHRpbmdzVGFiKFxyXG4gICAgICAgICB0aGlzLmFwcCxcclxuICAgICAgICAgdGhpcyxcclxuICAgICAgICAgREVGQVVMVF9TRVRUSU5HUyxcclxuICAgICAgICAgdGhpcy52aWV3TW9kZSxcclxuICAgICAgICAgdGhpcy50cmFuc2xhdGlvbnNcclxuICAgICAgKSk7XHJcblxyXG4gICAgICAvLyBDclx1MDBFOWF0aW9uIGR1IG1lbnVcclxuICAgICAgY29uc3QgcmliYm9uSWNvbiA9IHRoaXMuYWRkUmliYm9uSWNvbihcclxuICAgICAgICAgJ2xheW91dC1ncmlkJyxcclxuICAgICAgICAgJ1BsdWdpbkZsb3d6JywgXHJcbiAgICAgICAgIGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbW9kZSA9IGF3YWl0IFNldHRpbmdzLmdldFZpZXdNb2RlKCk7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMudmlld01vZGUuc2V0Vmlldyhtb2RlKTtcclxuICAgICAgICAgfVxyXG4gICAgICApO1xyXG5cclxuICAgICAgcmliYm9uSWNvbi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgKCkgPT4ge1xyXG4gICAgICAgICBjb25zdCBtZW51ID0gbmV3IE1lbnUoKTtcclxuXHJcbiAgICAgICAgIGNvbnN0IGNyZWF0ZU1lbnVJdGVtID0gKHRpdGxlOiBzdHJpbmcsIGljb246IHN0cmluZywgbW9kZTogVFZpZXdNb2RlKSA9PiB7XHJcbiAgICAgICAgICAgIG1lbnUuYWRkSXRlbSgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICBpdGVtLnNldFRpdGxlKHRpdGxlKVxyXG4gICAgICAgICAgICAgICAgICAuc2V0SWNvbihpY29uKVxyXG4gICAgICAgICAgICAgICAgICAub25DbGljayhhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMudmlld01vZGUuc2V0Vmlldyhtb2RlKTtcclxuICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICB9O1xyXG5cclxuICAgICAgICAgY3JlYXRlTWVudUl0ZW0oXCJEYXNoYm9hcmQgVGFiXCIsIFwidGFiXCIsIFwidGFiXCIgYXMgVFZpZXdNb2RlKTtcclxuICAgICAgICAgY3JlYXRlTWVudUl0ZW0oXCJEYXNoYm9hcmQgU2lkZWJhclwiLCBcImxheW91dC1zaWRlYmFyLXJpZ2h0XCIsIFwic2lkZWJhclwiIGFzIFRWaWV3TW9kZSk7XHJcbiAgICAgICAgIGNyZWF0ZU1lbnVJdGVtKFwiRGFzaGJvYXJkIFBvcHVwXCIsIFwibGF5b3V0LXRvcFwiLCBcInBvcHVwXCIgYXMgVFZpZXdNb2RlKTtcclxuXHJcbiAgICAgICAgIGNvbnN0IGljb25SZWN0ID0gcmliYm9uSWNvbi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICAgbWVudS5zaG93QXRQb3NpdGlvbih7IFxyXG4gICAgICAgICAgICB4OiBpY29uUmVjdC5sZWZ0LCBcclxuICAgICAgICAgICAgeTogaWNvblJlY3QudG9wIC0gMTBcclxuICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICBjb25zdCBoYW5kbGVNb3VzZUxlYXZlID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gZS5yZWxhdGVkVGFyZ2V0IGFzIE5vZGU7XHJcbiAgICAgICAgICAgIGNvbnN0IG1lbnVEb20gPSAobWVudSBhcyBhbnkpLmRvbTtcclxuICAgICAgICAgICAgY29uc3QgaXNPdmVySWNvbiA9IHJpYmJvbkljb24uY29udGFpbnModGFyZ2V0KTtcclxuICAgICAgICAgICAgY29uc3QgaXNPdmVyTWVudSA9IG1lbnVEb20gJiYgbWVudURvbS5jb250YWlucyh0YXJnZXQpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKCFpc092ZXJJY29uICYmICFpc092ZXJNZW51KSB7XHJcbiAgICAgICAgICAgICAgIG1lbnUuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICByaWJib25JY29uLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBoYW5kbGVNb3VzZUxlYXZlKTtcclxuICAgICAgICAgICAgICAgaWYgKG1lbnVEb20pIHtcclxuICAgICAgICAgICAgICAgICAgbWVudURvbS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgaGFuZGxlTW91c2VMZWF2ZSk7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICB9O1xyXG5cclxuICAgICAgICAgcmliYm9uSWNvbi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgaGFuZGxlTW91c2VMZWF2ZSk7XHJcbiAgICAgICAgIGNvbnN0IG1lbnVEb20gPSAobWVudSBhcyBhbnkpLmRvbTtcclxuICAgICAgICAgaWYgKG1lbnVEb20pIHtcclxuICAgICAgICAgICAgbWVudURvbS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgaGFuZGxlTW91c2VMZWF2ZSk7XHJcbiAgICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICByZWdpc3RlclN0eWxlcygpO1xyXG4gICB9XHJcblxyXG4gICBwcml2YXRlIGFzeW5jIGxvYWRBcHAoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICBpZiAoIXRoaXMuYXBwLndvcmtzcGFjZSkge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KHJlc29sdmUsIDApO1xyXG4gICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgIH1cclxuXHJcbiAgIHByaXZhdGUgbG9hZExhbmd1YWdlKCk6IHZvaWQge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgICBjb25zdCBsb2NhbGUgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQubGFuZz8udG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKCdmcicpID8gJ2ZyJyA6ICdlbic7XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKCdMYW5ndWUgZFx1MDBFOXRlY3RcdTAwRTllOicsIGxvY2FsZSk7XHJcbiAgICAgICAgIHRoaXMudHJhbnNsYXRpb25zLnNldExhbmd1YWdlKGxvY2FsZSk7XHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgIGNvbnNvbGUud2FybignRXJyZXVyIGxvcnMgZGUgbGEgZFx1MDBFOXRlY3Rpb24gZGUgbGEgbGFuZ3VlLCB1dGlsaXNhdGlvbiBkdSBmcmFuXHUwMEU3YWlzIHBhciBkXHUwMEU5ZmF1dCcpO1xyXG4gICAgICAgICB0aGlzLnRyYW5zbGF0aW9ucy5zZXRMYW5ndWFnZSgnZnInKTtcclxuICAgICAgfVxyXG4gICB9XHJcblxyXG4gICBvbnVubG9hZCgpIHtcclxuICAgICAgdGhpcy5hcHAud29ya3NwYWNlLmRldGFjaExlYXZlc09mVHlwZShcInBsdWdpbmZsb3d6LXZpZXdcIik7XHJcbiAgIH1cclxufVxyXG4iLCAiZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyU3R5bGVzKCkge1xuY29uc3Qgc3R5bGVFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG5zdHlsZUVsLmlkID0gJ01ZUExVR0lOLXN0eWxlcyc7XG5zdHlsZUVsLnRleHRDb250ZW50ID0gYFxuICAgIC8qID09PT09IENTUyA9PT09PSAqL1xuICAgIC5tb2RhbCB7XG4gICAgICAgIHdpZHRoOiA5MHZ3O1xuICAgICAgICBoZWlnaHQ6IDkwdmg7XG4gICAgICAgIG1heC13aWR0aDogOTB2dztcbiAgICAgICAgbWF4LWhlaWdodDogOTB2aDtcbiAgICB9XG5cbiAgICAubW9kYWwtY29udGVudCB7XG4gICAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICB9XG5cbiAgICAuZGFzaGJvYXJkLWNvbnRhaW5lciB7XG4gICAgICAgIHBhZGRpbmc6IDIwcHg7XG4gICAgICAgIGZsZXg6IDE7XG4gICAgICAgIG92ZXJmbG93LXk6IGF1dG87XG4gICAgfVxuXG4gICAgLnBsdWdpbnMtbGlzdCB7XG4gICAgICAgIGRpc3BsYXk6IGdyaWQ7XG4gICAgICAgIGdhcDogMjBweDtcbiAgICAgICAgcGFkZGluZzogMjBweCAwO1xuICAgIH1cblxuICAgIC5wbHVnaW4taXRlbSB7XG4gICAgICAgIGJhY2tncm91bmQ6IHZhcigtLWJhY2tncm91bmQtc2Vjb25kYXJ5KTtcbiAgICAgICAgcGFkZGluZzogMTVweDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNXB4O1xuICAgIH0gXG5gO1xuXG5kb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlRWwpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5yZWdpc3RlclN0eWxlcygpIHtcbmNvbnN0IHN0eWxlRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgneW91dHViZS1wbGF5ZXItc3R5bGVzJyk7XG5pZiAoc3R5bGVFbCkge1xuICAgIHN0eWxlRWwucmVtb3ZlKCk7XG59XG59ICIsICJpbXBvcnQgeyBBcHAsIFBsdWdpbiwgUGx1Z2luU2V0dGluZ1RhYiwgU2V0dGluZ30gZnJvbSAnb2JzaWRpYW4nO1xuaW1wb3J0IHsgVmlld01vZGUgfSBmcm9tICcuL1ZpZXdNb2RlJztcbmltcG9ydCB7IFRyYW5zbGF0aW9ucyB9IGZyb20gJy4vVHJhbnNsYXRpb25zJztcblxuZXhwb3J0IGludGVyZmFjZSBEZWZhdWx0U2V0dGluZ3Mge1xuICAgbGFuZ3VhZ2U6IHN0cmluZztcbiAgIGN1cnJlbnRNb2RlOiBUVmlld01vZGU7XG4gICBhY3RpdmVMZWFmSWQ6IHN0cmluZyB8IG51bGw7XG59XG5cbmV4cG9ydCB0eXBlIFRWaWV3TW9kZSA9ICd0YWInIHwgJ3NpZGViYXInIHwgJ3BvcHVwJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfU0VUVElOR1M6IERlZmF1bHRTZXR0aW5ncyA9IHtcbiAgIGxhbmd1YWdlOiAnZnInLFxuICAgY3VycmVudE1vZGU6ICd0YWInLFxuICAgYWN0aXZlTGVhZklkOiBudWxsLFxufTtcblxuZXhwb3J0IGNsYXNzIFNldHRpbmdzIHtcbiAgIHByaXZhdGUgc3RhdGljIHBsdWdpbjogUGx1Z2luO1xuICAgcHJpdmF0ZSBzdGF0aWMgc2V0dGluZ3M6IERlZmF1bHRTZXR0aW5ncztcblxuICAgc3RhdGljIGluaXRpYWxpemUocGx1Z2luOiBQbHVnaW4pIHtcbiAgICAgIHRoaXMucGx1Z2luID0gcGx1Z2luO1xuICAgfVxuXG4gICBzdGF0aWMgYXN5bmMgbG9hZFNldHRpbmdzKCk6IFByb21pc2U8RGVmYXVsdFNldHRpbmdzPiB7XG4gICAgICBjb25zdCBzYXZlZERhdGEgPSBhd2FpdCB0aGlzLnBsdWdpbi5sb2FkRGF0YSgpO1xuICAgICAgdGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfU0VUVElOR1MsIHNhdmVkRGF0YSB8fCB7fSk7XG4gICAgICByZXR1cm4gdGhpcy5zZXR0aW5ncztcbiAgIH1cblxuICAgc3RhdGljIGFzeW5jIHNhdmVTZXR0aW5ncyhzZXR0aW5nczogUGFydGlhbDxEZWZhdWx0U2V0dGluZ3M+KSB7XG4gICAgICB0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih0aGlzLnNldHRpbmdzIHx8IERFRkFVTFRfU0VUVElOR1MsIHNldHRpbmdzKTtcbiAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVEYXRhKHRoaXMuc2V0dGluZ3MpO1xuICAgfVxuXG4gICBzdGF0aWMgYXN5bmMgcmVmcmVzaCgpIHtcbiAgICAgIGlmICh0aGlzLnBsdWdpbiAmJiAncmVmcmVzaCcgaW4gdGhpcy5wbHVnaW4pIHtcbiAgICAgICAgIGF3YWl0ICh0aGlzLnBsdWdpbiBhcyBhbnkpLnJlZnJlc2goKTtcbiAgICAgIH1cbiAgIH1cblxuICAgc3RhdGljIGFzeW5jIGdldFZpZXdNb2RlKCk6IFByb21pc2U8VFZpZXdNb2RlPiB7XG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgdGhpcy5wbHVnaW4ubG9hZERhdGEoKTtcbiAgICAgIHJldHVybiAoZGF0YT8uY3VycmVudE1vZGUgfHwgREVGQVVMVF9TRVRUSU5HUy5jdXJyZW50TW9kZSkgYXMgVFZpZXdNb2RlO1xuICAgfVxufVxuXG5leHBvcnQgY2xhc3MgU2V0dGluZ3NUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcbiAgIHBsdWdpbjogUGx1Z2luO1xuICAgc2V0dGluZ3M6IERlZmF1bHRTZXR0aW5ncztcblxuICAgY29uc3RydWN0b3IoXG4gICAgICBhcHA6IEFwcCwgXG4gICAgICBwbHVnaW46IFBsdWdpbiwgXG4gICAgICBzZXR0aW5nczogRGVmYXVsdFNldHRpbmdzLCBcbiAgICAgIHByaXZhdGUgdmlld01vZGU6IFZpZXdNb2RlLFxuICAgICAgcHJpdmF0ZSB0cmFuc2xhdGlvbnM6IFRyYW5zbGF0aW9uc1xuICAgKSB7XG4gICAgICBzdXBlcihhcHAsIHBsdWdpbik7XG4gICAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcbiAgICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5ncztcbiAgIH1cblxuICAgZGlzcGxheSgpOiB2b2lkIHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyRWwgfSA9IHRoaXM7XG4gICAgICBjb250YWluZXJFbC5lbXB0eSgpO1xuXG4gICAgICAvLyBEcm9wZG93biBwb3VyIGNob2lzaXIgbGUgbW9kZSBkJ2FmZmljaGFnZVxuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAuc2V0TmFtZSh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5kZWZhdWx0Vmlld01vZGUnKSlcbiAgICAgICAgIC5zZXREZXNjKHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLmRlZmF1bHRWaWV3TW9kZURlc2MnKSlcbiAgICAgICAgIC5hZGREcm9wZG93bihkcm9wZG93biA9PiBkcm9wZG93blxuICAgICAgICAgICAgLmFkZE9wdGlvbigndGFiJywgdGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MudGFiJykpXG4gICAgICAgICAgICAuYWRkT3B0aW9uKCdzaWRlYmFyJywgdGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3Muc2lkZWJhcicpKVxuICAgICAgICAgICAgLmFkZE9wdGlvbigncG9wdXAnLCB0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5wb3B1cCcpKVxuICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMuc2V0dGluZ3MuY3VycmVudE1vZGUpXG4gICAgICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzLmN1cnJlbnRNb2RlID0gdmFsdWUgYXMgVFZpZXdNb2RlO1xuICAgICAgICAgICAgICAgYXdhaXQgU2V0dGluZ3Muc2F2ZVNldHRpbmdzKHsgY3VycmVudE1vZGU6IHZhbHVlIGFzIFRWaWV3TW9kZSB9KTtcbiAgICAgICAgICAgICAgIGF3YWl0IHRoaXMudmlld01vZGUuc2V0Vmlldyh2YWx1ZSBhcyBUVmlld01vZGUpO1xuICAgICAgICAgICAgfSkpO1xuXG4gICB9XG59IiwgImV4cG9ydCB0eXBlIFRyYW5zbGF0aW9uS2V5ID0gXHJcbiAgIC8vIERhc2hib2FyZFxyXG4gICB8ICdkYXNoYm9hcmQudGl0bGUnXHJcbiAgIHwgJ2Rhc2hib2FyZC5kZXNjcmlwdGlvbidcclxuICAgfCAnZGFzaGJvYXJkLnZpZXdNb2RlJ1xyXG4gICB8ICdkYXNoYm9hcmQudmlld01vZGVEZXNjJ1xyXG4gICB8ICdkYXNoYm9hcmQudmlld01vZGVUYWInXHJcbiAgIHwgJ2Rhc2hib2FyZC52aWV3TW9kZVNpZGViYXInXHJcbiAgIHwgJ2Rhc2hib2FyZC52aWV3TW9kZVBvcHVwJ1xyXG4gICAvLyBOb3RpY2VzXHJcbiAgIHwgJ25vdGljZXMuc2F2ZWQnXHJcbiAgIHwgJ25vdGljZXMuZXJyb3InXHJcbiAgIHwgJ25vdGljZXMuc3VjY2VzcydcclxuICAgfCAnbm90aWNlcy5mZWF0dXJlRW5hYmxlZCdcclxuICAgfCAnbm90aWNlcy5mZWF0dXJlRGlzYWJsZWQnXHJcbiAgIC8vIENvbW1hbmRzXHJcbiAgIHwgJ2NvbW1hbmRzLm9wZW5EYXNoYm9hcmQnXHJcbiAgIC8vIEVycm9yc1xyXG4gICAvLyBTZXR0aW5nc1xyXG4gICB8ICdzZXR0aW5ncy5kZWZhdWx0Vmlld01vZGUnXHJcbiAgIHwgJ3NldHRpbmdzLmRlZmF1bHRWaWV3TW9kZURlc2MnXHJcbiAgIHwgJ3NldHRpbmdzLnRhYidcclxuICAgfCAnc2V0dGluZ3Muc2lkZWJhcidcclxuICAgfCAnc2V0dGluZ3MucG9wdXAnXHJcblxyXG5leHBvcnQgY29uc3QgdHJhbnNsYXRpb25zOiB7IFtsYW5nOiBzdHJpbmddOiBSZWNvcmQ8VHJhbnNsYXRpb25LZXksIHN0cmluZz4gfSA9IHtcclxuICAgZW46IHtcclxuICAgICAgLy8gRGFzaGJvYXJkXHJcbiAgICAgICdkYXNoYm9hcmQudGl0bGUnOiAnUGx1Z2luRmxvd3onLFxyXG4gICAgICAnZGFzaGJvYXJkLmRlc2NyaXB0aW9uJzogJ1BsdWdpbkZsb3d6IGlzIGEgcGx1Z2luIGZvciBPYnNpZGlhbiB0aGF0IGFsbG93cyB5b3UgdG8gbWFuYWdlIHlvdXIgdmlkZW9zLicsXHJcbiAgICAgICdkYXNoYm9hcmQudmlld01vZGUnOiAnVmlldyBNb2RlJyxcclxuICAgICAgJ2Rhc2hib2FyZC52aWV3TW9kZURlc2MnOiAnQ2hvb3NlIGhvdyB2aWRlb3Mgd2lsbCBvcGVuIGJ5IGRlZmF1bHQnLFxyXG4gICAgICAnZGFzaGJvYXJkLnZpZXdNb2RlVGFiJzogJ1RhYicsXHJcbiAgICAgICdkYXNoYm9hcmQudmlld01vZGVTaWRlYmFyJzogJ1NpZGViYXInLFxyXG4gICAgICAnZGFzaGJvYXJkLnZpZXdNb2RlUG9wdXAnOiAnUG9wdXAnLFxyXG4gICAgICAvLyBOb3RpY2VzXHJcbiAgICAgICdub3RpY2VzLnNhdmVkJzogJ1x1MjcwNSBTZXR0aW5ncyBzYXZlZCcsXHJcbiAgICAgICdub3RpY2VzLmVycm9yJzogJ1x1Mjc0QyBFcnJvcjoge21lc3NhZ2V9JyxcclxuICAgICAgJ25vdGljZXMuc3VjY2Vzcyc6ICdcdTI3MDUgT3BlcmF0aW9uIHN1Y2Nlc3NmdWwnLFxyXG4gICAgICAnbm90aWNlcy5mZWF0dXJlRW5hYmxlZCc6ICdcdTI3MDUgRmVhdHVyZSBlbmFibGVkJyxcclxuICAgICAgJ25vdGljZXMuZmVhdHVyZURpc2FibGVkJzogJ1x1Mjc0QyBGZWF0dXJlIGRpc2FibGVkJyxcclxuICAgICAgLy8gQ29tbWFuZHNcclxuICAgICAgJ2NvbW1hbmRzLm9wZW5EYXNoYm9hcmQnOiAnT3BlbiBEYXNoYm9hcmQnLFxyXG4gICAgICAvLyBFcnJvcnNcclxuICAgICAgLy8gU2V0dGluZ3NcclxuICAgICAgJ3NldHRpbmdzLmRlZmF1bHRWaWV3TW9kZSc6ICdEZWZhdWx0IFZpZXcgTW9kZScsXHJcbiAgICAgICdzZXR0aW5ncy5kZWZhdWx0Vmlld01vZGVEZXNjJzogJ0Nob29zZSBob3cgdmlkZW9zIHdpbGwgb3BlbiBieSBkZWZhdWx0JyxcclxuICAgICAgJ3NldHRpbmdzLnRhYic6ICdUYWInLFxyXG4gICAgICAnc2V0dGluZ3Muc2lkZWJhcic6ICdTaWRlYmFyJyxcclxuICAgICAgJ3NldHRpbmdzLnBvcHVwJzogJ1BvcHVwJyxcclxuICAgfSxcclxuICAgZnI6IHtcclxuICAgICAgLy8gRGFzaGJvYXJkXHJcbiAgICAgICdkYXNoYm9hcmQudGl0bGUnOiAnUGx1Z2luRmxvd3onLFxyXG4gICAgICAnZGFzaGJvYXJkLmRlc2NyaXB0aW9uJzogJ1BsdWdpbkZsb3d6IGVzdCB1biBwbHVnaW4gcG91ciBPYnNpZGlhbiBxdWkgdm91cyBwZXJtZXQgZGUgZ1x1MDBFOXJlciB2b3MgdmlkXHUwMEU5b3MuJyxcclxuICAgICAgJ2Rhc2hib2FyZC52aWV3TW9kZSc6ICdNb2RlIGRcXCdhZmZpY2hhZ2UnLFxyXG4gICAgICAnZGFzaGJvYXJkLnZpZXdNb2RlRGVzYyc6ICdDaG9pc2lzc2V6IGNvbW1lbnQgbGVzIHZpZFx1MDBFOW9zIHNcXCdvdXZyaXJvbnQgcGFyIGRcdTAwRTlmYXV0JyxcclxuICAgICAgJ2Rhc2hib2FyZC52aWV3TW9kZVRhYic6ICdPbmdsZXQnLFxyXG4gICAgICAnZGFzaGJvYXJkLnZpZXdNb2RlU2lkZWJhcic6ICdCYXJyZSBsYXRcdTAwRTlyYWxlJyxcclxuICAgICAgJ2Rhc2hib2FyZC52aWV3TW9kZVBvcHVwJzogJ0Zlblx1MDBFQXRyZSBjb250ZXh0dWVsbGUnLFxyXG4gICAgICAvLyBOb3RpY2VzXHJcbiAgICAgICdub3RpY2VzLnNhdmVkJzogJ1x1MjcwNSBQYXJhbVx1MDBFOHRyZXMgc2F1dmVnYXJkXHUwMEU5cycsXHJcbiAgICAgICdub3RpY2VzLmVycm9yJzogJ1x1Mjc0QyBFcnJldXI6IHttZXNzYWdlfScsXHJcbiAgICAgICdub3RpY2VzLnN1Y2Nlc3MnOiAnXHUyNzA1IE9wXHUwMEU5cmF0aW9uIHJcdTAwRTl1c3NpZScsXHJcbiAgICAgICdub3RpY2VzLmZlYXR1cmVFbmFibGVkJzogJ1x1MjcwNSBGb25jdGlvbm5hbGl0XHUwMEU5IGFjdGl2XHUwMEU5ZScsXHJcbiAgICAgICdub3RpY2VzLmZlYXR1cmVEaXNhYmxlZCc6ICdcdTI3NEMgRm9uY3Rpb25uYWxpdFx1MDBFOSBkXHUwMEU5c2FjdGl2XHUwMEU5ZScsXHJcbiAgICAgIC8vIENvbW1hbmRzXHJcbiAgICAgICdjb21tYW5kcy5vcGVuRGFzaGJvYXJkJzogJ091dnJpciBsZSB0YWJsZWF1IGRlIGJvcmQnLFxyXG4gICAgICAvLyBFcnJvcnNcclxuICAgICAgLy8gU2V0dGluZ3NcclxuICAgICAgJ3NldHRpbmdzLmRlZmF1bHRWaWV3TW9kZSc6ICdNb2RlIGRcXCdhZmZpY2hhZ2UgcGFyIGRcdTAwRTlmYXV0JyxcclxuICAgICAgJ3NldHRpbmdzLmRlZmF1bHRWaWV3TW9kZURlc2MnOiAnQ2hvaXNpc3NleiBjb21tZW50IGxlcyB2aWRcdTAwRTlvcyBzXFwnb3V2cmlyb250IHBhciBkXHUwMEU5ZmF1dCcsXHJcbiAgICAgICdzZXR0aW5ncy50YWInOiAnT25nbGV0JyxcclxuICAgICAgJ3NldHRpbmdzLnNpZGViYXInOiAnQmFycmUgbGF0XHUwMEU5cmFsZScsXHJcbiAgICAgICdzZXR0aW5ncy5wb3B1cCc6ICdGZW5cdTAwRUF0cmUgY29udGV4dHVlbGxlJyxcclxuICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNsYXNzIFRyYW5zbGF0aW9ucyB7XHJcbiAgIHByaXZhdGUgY3VycmVudExhbmc6IHN0cmluZztcclxuXHJcbiAgIGNvbnN0cnVjdG9yKGluaXRpYWxMYW5nOiBzdHJpbmcgPSAnZnInKSB7XHJcbiAgICAgIHRoaXMuY3VycmVudExhbmcgPSBpbml0aWFsTGFuZztcclxuICAgfVxyXG5cclxuICAgc2V0TGFuZ3VhZ2UobGFuZzogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuY3VycmVudExhbmcgPSBsYW5nO1xyXG4gICB9XHJcblxyXG4gICB0KGtleTogVHJhbnNsYXRpb25LZXkpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gdHJhbnNsYXRpb25zW3RoaXMuY3VycmVudExhbmddPy5ba2V5XSB8fCB0cmFuc2xhdGlvbnNbJ2VuJ11ba2V5XSB8fCBrZXk7XHJcbiAgIH1cclxufVxyXG4iLCAiaW1wb3J0IHsgUGx1Z2luLCBOb3RpY2UgfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgeyBTZXR0aW5ncyB9IGZyb20gJy4vU2V0dGluZ3MnO1xuaW1wb3J0IHsgVHJhbnNsYXRpb25zIH0gZnJvbSAnLi9UcmFuc2xhdGlvbnMnO1xuaW1wb3J0IHsgVmlld01vZGUgfSBmcm9tICcuL1ZpZXdNb2RlJztcblxuZXhwb3J0IGNsYXNzIEhvdGtleXMge1xuICAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIHBsdWdpbjogUGx1Z2luLFxuICAgICAgcHJpdmF0ZSBzZXR0aW5nczogU2V0dGluZ3MsXG4gICAgICBwcml2YXRlIHRyYW5zbGF0aW9uczogVHJhbnNsYXRpb25zLFxuICAgICAgcHJpdmF0ZSB2aWV3TW9kZTogVmlld01vZGVcbiAgICkge31cblxuICAgcHJpdmF0ZSBoYW5kbGVDb21tYW5kRXJyb3IoZXJyb3I6IHVua25vd24pIHtcbiAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIENvbW1hbmRFcnJvcikge1xuICAgICAgICAgY29uc29sZS5lcnJvcignW0hvdGtleXNdJywgZXJyb3IpO1xuICAgICAgICAgbmV3IE5vdGljZSh0aGlzLnRyYW5zbGF0aW9ucy50KGBlcnJvcnMuJHtlcnJvci5jb2RlfWApKTtcbiAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgfVxuICAgICAgdGhyb3cgZXJyb3I7XG4gICB9XG5cbiAgIHJlZ2lzdGVySG90a2V5cygpIHtcbiAgICAgIC8vIE91dnJpciBsZSBkYXNoYm9hcmRcbiAgICAgIHRoaXMucGx1Z2luLmFkZENvbW1hbmQoe1xuICAgICAgICAgaWQ6ICdvcGVuLXBsdWdpbnMtZGFzaGJvYXJkJyxcbiAgICAgICAgIG5hbWU6IHRoaXMudHJhbnNsYXRpb25zLnQoJ2NvbW1hbmRzLm9wZW5EYXNoYm9hcmQnKSxcbiAgICAgICAgIGljb246ICdkYXNoYm9hcmQnLFxuICAgICAgICAgY2FsbGJhY2s6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICBjb25zdCBtb2RlID0gYXdhaXQgU2V0dGluZ3MuZ2V0Vmlld01vZGUoKTtcbiAgICAgICAgICAgICAgIGF3YWl0IHRoaXMudmlld01vZGUuc2V0Vmlldyhtb2RlKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICB0aGlzLmhhbmRsZUNvbW1hbmRFcnJvcihlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICB9LFxuICAgICAgICAgaG90a2V5czogW3sgbW9kaWZpZXJzOiBbJ0FsdCddLCBrZXk6ICdQJyB9XVxuICAgICAgfSk7XG4gICB9XG59XG4iLCAiaW1wb3J0IHsgSXRlbVZpZXcsIFdvcmtzcGFjZUxlYWYgfSBmcm9tICdvYnNpZGlhbic7XHJcbmltcG9ydCB7IFRWaWV3TW9kZSB9IGZyb20gJy4vdHlwZXMnO1xyXG5pbXBvcnQgeyBTZXR0aW5ncyB9IGZyb20gJy4vU2V0dGluZ3MnO1xyXG5pbXBvcnQgeyBUcmFuc2xhdGlvbnMgfSBmcm9tICcuL1RyYW5zbGF0aW9ucyc7XHJcblxyXG5leHBvcnQgY2xhc3MgRGFzaGJvYXJkIGV4dGVuZHMgSXRlbVZpZXcge1xyXG4gICAgcHJpdmF0ZSB0cmFuc2xhdGlvbnM6IFRyYW5zbGF0aW9ucztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBsZWFmOiBXb3Jrc3BhY2VMZWFmLFxyXG4gICAgICAgIHByaXZhdGUgc2V0dGluZ3M6IFNldHRpbmdzLFxyXG4gICAgICAgIHRyYW5zbGF0aW9uczogVHJhbnNsYXRpb25zXHJcbiAgICApIHtcclxuICAgICAgICBzdXBlcihsZWFmKTtcclxuICAgICAgICB0aGlzLnRyYW5zbGF0aW9ucyA9IHRyYW5zbGF0aW9ucztcclxuICAgIH1cclxuXHJcbiAgICBnZXRWaWV3VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiAncGx1Z2luZmxvd3otdmlldyc7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RGlzcGxheVRleHQoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50cmFuc2xhdGlvbnMudCgnZGFzaGJvYXJkLnRpdGxlJyk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25PcGVuKCkge1xyXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyRWwuY2hpbGRyZW5bMV0gYXMgSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgY29udGFpbmVyLmVtcHR5KCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgYXdhaXQgdGhpcy5yZW5kZXJEYXNoYm9hcmQoY29udGFpbmVyKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFzeW5jIHJlbmRlckRhc2hib2FyZChjb250YWluZXI6IEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgY29uc3QgZGFzaGJvYXJkQ29udGFpbmVyID0gY29udGFpbmVyLmNyZWF0ZURpdignZGFzaGJvYXJkLWNvbnRhaW5lcicpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIEVuLXRcdTAwRUF0ZSBhdmVjIGxlIHRpdHJlXHJcbiAgICAgICAgZGFzaGJvYXJkQ29udGFpbmVyLmNyZWF0ZUVsKCdoMicsIHsgXHJcbiAgICAgICAgICAgIHRleHQ6IHRoaXMudHJhbnNsYXRpb25zLnQoJ2Rhc2hib2FyZC5pbnN0YWxsZWRQbHVnaW5zJylcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBMaXN0ZSBkZXMgcGx1Z2luc1xyXG4gICAgICAgIGNvbnN0IHBsdWdpbnNMaXN0ID0gZGFzaGJvYXJkQ29udGFpbmVyLmNyZWF0ZURpdigncGx1Z2lucy1saXN0Jyk7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5yZW5kZXJQbHVnaW5zTGlzdChwbHVnaW5zTGlzdCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhc3luYyByZW5kZXJQbHVnaW5zTGlzdChjb250YWluZXI6IEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgY29uc3QgaW5zdGFsbGVkUGx1Z2lucyA9IEFycmF5LmZyb20odGhpcy5hcHAucGx1Z2lucy5lbmFibGVkUGx1Z2lucyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaW5zdGFsbGVkUGx1Z2lucy5mb3JFYWNoKHBsdWdpbklkID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcGx1Z2luID0gdGhpcy5hcHAucGx1Z2lucy5wbHVnaW5zW3BsdWdpbklkXTtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVQbHVnaW5JdGVtKGNvbnRhaW5lciwgcGx1Z2luKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVBsdWdpbkl0ZW0oY29udGFpbmVyOiBIVE1MRWxlbWVudCwgcGx1Z2luOiBhbnkpIHtcclxuICAgICAgICBjb25zdCBwbHVnaW5JdGVtID0gY29udGFpbmVyLmNyZWF0ZURpdigncGx1Z2luLWl0ZW0nKTtcclxuICAgICAgICBcclxuICAgICAgICBwbHVnaW5JdGVtLmNyZWF0ZUVsKCdoMycsIHsgdGV4dDogcGx1Z2luLm1hbmlmZXN0Lm5hbWUgfSk7XHJcbiAgICAgICAgcGx1Z2luSXRlbS5jcmVhdGVFbCgncCcsIHsgdGV4dDogcGx1Z2luLm1hbmlmZXN0LmRlc2NyaXB0aW9uIH0pO1xyXG4gICAgICAgIHBsdWdpbkl0ZW0uY3JlYXRlRWwoJ3NtYWxsJywgeyBcclxuICAgICAgICAgICAgdGV4dDogdGhpcy50cmFuc2xhdGlvbnMudCgnZGFzaGJvYXJkLnZlcnNpb24nLCB7XHJcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiBwbHVnaW4ubWFuaWZlc3QudmVyc2lvblxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIG9uQ2xvc2UoKSB7XHJcbiAgICAgICAgLy8gTmV0dG95YWdlIHNpIG5cdTAwRTljZXNzYWlyZVxyXG4gICAgfVxyXG59XHJcbiIsICJpbXBvcnQgeyBQbHVnaW4sIFdvcmtzcGFjZUxlYWYsIE1vZGFsIH0gZnJvbSAnb2JzaWRpYW4nO1xyXG5pbXBvcnQgeyBUVmlld01vZGUgfSBmcm9tICcuL3R5cGVzJztcclxuaW1wb3J0IHsgU2V0dGluZ3MgfSBmcm9tICcuL1NldHRpbmdzJztcclxuaW1wb3J0IHsgRGFzaGJvYXJkIH0gZnJvbSAnLi9EYXNoYm9hcmQnO1xyXG5pbXBvcnQgeyBUcmFuc2xhdGlvbnMgfSBmcm9tICcuL1RyYW5zbGF0aW9ucyc7XHJcblxyXG5leHBvcnQgY2xhc3MgVmlld01vZGUge1xyXG4gICBwcml2YXRlIGN1cnJlbnRWaWV3OiBEYXNoYm9hcmQgfCBudWxsID0gbnVsbDtcclxuICAgcHJpdmF0ZSBjdXJyZW50TW9kZTogVFZpZXdNb2RlIHwgbnVsbCA9IG51bGw7XHJcbiAgIHByaXZhdGUgYWN0aXZlTGVhZjogV29ya3NwYWNlTGVhZiB8IG51bGwgPSBudWxsO1xyXG4gICBwcml2YXRlIGxlYWZJZDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XHJcbiAgIHByaXZhdGUgdHJhbnNsYXRpb25zOiBUcmFuc2xhdGlvbnM7XHJcblxyXG4gICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBsdWdpbjogUGx1Z2luKSB7XHJcbiAgICAgIHRoaXMudHJhbnNsYXRpb25zID0gbmV3IFRyYW5zbGF0aW9ucygpO1xyXG4gICAgICAvLyBJbml0aWFsaXNlciBsZSBtb2RlIGRlcHVpcyBsZXMgc2V0dGluZ3NcclxuICAgICAgU2V0dGluZ3MubG9hZFNldHRpbmdzKCkudGhlbihzZXR0aW5ncyA9PiB7XHJcbiAgICAgICAgIHRoaXMuY3VycmVudE1vZGUgPSBzZXR0aW5ncy5jdXJyZW50TW9kZTtcclxuICAgICAgfSk7XHJcbiAgICAgIC8vIE5ldHRveWVyIGxlcyBhbmNpZW5uZXMgbGVhZnMgYXUgZFx1MDBFOW1hcnJhZ2VcclxuICAgICAgdGhpcy5jbG9zZUN1cnJlbnRWaWV3KCk7XHJcbiAgIH1cclxuXHJcbiAgIHByaXZhdGUgYXN5bmMgY2xvc2VDdXJyZW50VmlldygpIHtcclxuICAgICAgaWYgKHRoaXMuY3VycmVudFZpZXcpIHtcclxuICAgICAgICAgY29uc3QgbGVhdmVzID0gdGhpcy5wbHVnaW4uYXBwLndvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoJ3BsdWdpbmZsb3d6LXZpZXcnKTtcclxuICAgICAgICAgbGVhdmVzLmZvckVhY2gobGVhZiA9PiB7XHJcbiAgICAgICAgICAgIGlmIChsZWFmLnZpZXcgaW5zdGFuY2VvZiBEYXNoYm9hcmQpIHtcclxuICAgICAgICAgICAgICAgbGVhZi5kZXRhY2goKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICB9KTtcclxuICAgICAgICAgdGhpcy5jdXJyZW50VmlldyA9IG51bGw7XHJcbiAgICAgICAgIHRoaXMuYWN0aXZlTGVhZiA9IG51bGw7XHJcbiAgICAgICAgIHRoaXMubGVhZklkID0gbnVsbDtcclxuICAgICAgfVxyXG4gICB9XHJcblxyXG4gICBwcml2YXRlIGdldExlYWZGb3JNb2RlKG1vZGU6IFRWaWV3TW9kZSk6IFdvcmtzcGFjZUxlYWYge1xyXG4gICAgICBjb25zdCB3b3Jrc3BhY2UgPSB0aGlzLnBsdWdpbi5hcHAud29ya3NwYWNlO1xyXG4gICAgICBcclxuICAgICAgLy8gRmVybWVyIHRvdXRlcyBsZXMgdnVlcyBEYXNoYm9hcmQgZXhpc3RhbnRlc1xyXG4gICAgICBjb25zdCBleGlzdGluZ0xlYXZlcyA9IHdvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoJ3BsdWdpbmZsb3d6LXZpZXcnKTtcclxuICAgICAgZXhpc3RpbmdMZWF2ZXMuZm9yRWFjaChsZWFmID0+IHtcclxuICAgICAgICAgaWYgKGxlYWYudmlldyBpbnN0YW5jZW9mIERhc2hib2FyZCkge1xyXG4gICAgICAgICAgICBsZWFmLmRldGFjaCgpO1xyXG4gICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBcclxuICAgICAgbGV0IGxlYWY6IFdvcmtzcGFjZUxlYWY7XHJcbiAgICAgIHN3aXRjaCAobW9kZSkge1xyXG4gICAgICAgICBjYXNlICdzaWRlYmFyJzpcclxuICAgICAgICAgICAgbGVhZiA9IHdvcmtzcGFjZS5nZXRSaWdodExlYWYoZmFsc2UpID8/IHdvcmtzcGFjZS5nZXRMZWFmKCdzcGxpdCcpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgY2FzZSAncG9wdXAnOlxyXG4gICAgICAgICAgICBjb25zdCBtb2RhbCA9IG5ldyBNb2RhbCh0aGlzLnBsdWdpbi5hcHApO1xyXG4gICAgICAgICAgICBtb2RhbC50aXRsZUVsLnNldFRleHQodGhpcy50cmFuc2xhdGlvbnMudCgnZGFzaGJvYXJkLnRpdGxlJykpO1xyXG4gICAgICAgICAgICBjb25zdCBjb250YWluZXIgPSBtb2RhbC5jb250ZW50RWwuY3JlYXRlRGl2KCdkYXNoYm9hcmQtY29udGFpbmVyJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHZpZXcgPSBuZXcgRGFzaGJvYXJkKHdvcmtzcGFjZS5nZXRMZWFmKCdzcGxpdCcpLCBTZXR0aW5ncywgdGhpcy50cmFuc2xhdGlvbnMpO1xyXG4gICAgICAgICAgICB2aWV3Lm9uT3BlbigpO1xyXG4gICAgICAgICAgICBtb2RhbC5vbkNsb3NlID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICB2aWV3Lm9uQ2xvc2UoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgbW9kYWwub3BlbigpO1xyXG4gICAgICAgICAgICByZXR1cm4gd29ya3NwYWNlLmdldExlYWYoJ3NwbGl0Jyk7XHJcbiAgICAgICAgIGNhc2UgJ3RhYic6XHJcbiAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIGxlYWYgPSB3b3Jrc3BhY2UuZ2V0TGVhZignc3BsaXQnKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBsZWFmO1xyXG4gICB9XHJcblxyXG4gICBhc3luYyBzZXRWaWV3KG1vZGU6IFRWaWV3TW9kZSkge1xyXG4gICAgICBpZiAobW9kZSA9PT0gdGhpcy5jdXJyZW50TW9kZSAmJiB0aGlzLmN1cnJlbnRWaWV3ICYmIHRoaXMuYWN0aXZlTGVhZikge1xyXG4gICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGF3YWl0IHRoaXMuY2xvc2VDdXJyZW50VmlldygpO1xyXG5cclxuICAgICAgY29uc3QgbGVhZiA9IHRoaXMuZ2V0TGVhZkZvck1vZGUobW9kZSk7XHJcbiAgICAgIGF3YWl0IGxlYWYuc2V0Vmlld1N0YXRlKHtcclxuICAgICAgICAgdHlwZTogJ3BsdWdpbmZsb3d6LXZpZXcnLFxyXG4gICAgICAgICBhY3RpdmU6IHRydWUsXHJcbiAgICAgICAgIHN0YXRlOiB7IFxyXG4gICAgICAgICAgICBtb2RlOiBtb2RlLFxyXG4gICAgICAgICAgICBsZWFmSWQ6IHRoaXMubGVhZklkXHJcbiAgICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLmN1cnJlbnRNb2RlID0gbW9kZTtcclxuICAgICAgLy8gU2F1dmVnYXJkZXIgbGUgbm91dmVhdSBtb2RlIGRhbnMgbGVzIHNldHRpbmdzXHJcbiAgICAgIGF3YWl0IFNldHRpbmdzLnNhdmVTZXR0aW5ncyh7IGN1cnJlbnRNb2RlOiBtb2RlIH0pO1xyXG4gICAgICBcclxuICAgICAgdGhpcy5jdXJyZW50VmlldyA9IGxlYWYudmlldyBhcyBEYXNoYm9hcmQ7XHJcbiAgICAgIHRoaXMuYWN0aXZlTGVhZiA9IGxlYWY7XHJcbiAgICAgIHRoaXMucGx1Z2luLmFwcC53b3Jrc3BhY2UucmV2ZWFsTGVhZihsZWFmKTtcclxuICAgfVxyXG5cclxuICAgZ2V0QWN0aXZlTGVhZigpOiBXb3Jrc3BhY2VMZWFmIHwgbnVsbCB7XHJcbiAgICAgIHJldHVybiB0aGlzLmFjdGl2ZUxlYWY7XHJcbiAgIH1cclxuXHJcbiAgIGdldEN1cnJlbnRMZWFmSWQoKTogc3RyaW5nIHwgbnVsbCB7XHJcbiAgICAgIHJldHVybiB0aGlzLmxlYWZJZDtcclxuICAgfVxyXG59ICJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFBQUEsbUJBQTZCOzs7QUNBdEIsU0FBUyxpQkFBaUI7QUFDakMsUUFBTSxVQUFVLFNBQVMsY0FBYyxPQUFPO0FBQzlDLFVBQVEsS0FBSztBQUNiLFVBQVEsY0FBYztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFrQ3RCLFdBQVMsS0FBSyxZQUFZLE9BQU87QUFDakM7OztBQ3RDQSxzQkFBc0Q7QUFZL0MsSUFBTSxtQkFBb0M7QUFBQSxF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QUM7QUFFRCxtQkFBZTtBQUFBLEVBQ2xCO0FBQUEsRUFFQSxNQUFjLFVBQXlCO0FBQ3BDLFdBQU8sSUFBSSxRQUFRLENBQUMsWUFBWTtBQUM3QixVQUFJLENBQUMsS0FBSyxJQUFJLFdBQVc7QUFDdEIsbUJBQVcsU0FBUyxDQUFDO0FBQUEsTUFDeEIsT0FBTztBQUNKLGdCQUFRO0FBQUEsTUFDWDtBQUFBLElBQ0gsQ0FBQztBQUFBLEVBQ0o7QUFBQSxFQUVRLGVBQXFCO0FBOUhoQztBQStITSxRQUFJO0FBQ0QsWUFBTSxXQUFTLGNBQVMsZ0JBQWdCLFNBQXpCLG1CQUErQixjQUFjLFdBQVcsU0FBUSxPQUFPO0FBQ3RGLGNBQVEsSUFBSSwwQkFBb0IsTUFBTTtBQUN0QyxXQUFLLGFBQWEsWUFBWSxNQUFNO0FBQUEsSUFDdkMsU0FBUyxPQUFPO0FBQ2IsY0FBUSxLQUFLLHVGQUE4RTtBQUMzRixXQUFLLGFBQWEsWUFBWSxJQUFJO0FBQUEsSUFDckM7QUFBQSxFQUNIO0FBQUEsRUFFQSxXQUFXO0FBQ1IsU0FBSyxJQUFJLFVBQVUsbUJBQW1CLGtCQUFrQjtBQUFBLEVBQzNEO0FBQ0g7IiwKICAibmFtZXMiOiBbImltcG9ydF9vYnNpZGlhbiIsICJ0cmFuc2xhdGlvbnMiLCAiaW1wb3J0X29ic2lkaWFuIiwgInRyYW5zbGF0aW9ucyIsICJpbXBvcnRfb2JzaWRpYW4iLCAidHJhbnNsYXRpb25zIiwgImltcG9ydF9vYnNpZGlhbiIsICJsZWFmIiwgIm1lbnVEb20iXQp9Cg==
