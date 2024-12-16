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
var import_obsidian4 = require("obsidian");

// obsidian-PluginFlowz/src/RegisterStyles.ts
function registerStyles() {
  const styleEl = document.createElement("style");
  styleEl.id = "MYPLUGIN-styles";
  styleEl.textContent = `
    /* ===== CSS ===== */
    .dashboard-container {
    padding: 20px;
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
var ViewMode = class {
  constructor(plugin) {
    this.plugin = plugin;
    this.currentView = null;
    this.currentMode = null;
    this.activeLeaf = null;
    this.leafId = null;
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
    var _a, _b;
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
        const activeLeaf = (_b = workspace.getMostRecentLeaf()) != null ? _b : workspace.getLeaf("split");
        leaf = workspace.createLeafBySplit(activeLeaf, "horizontal", true);
        break;
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
var PluginFlowz = class extends import_obsidian4.Plugin {
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
      const menu = new import_obsidian4.Menu();
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL21haW4udHMiLCAic3JjL1JlZ2lzdGVyU3R5bGVzLnRzIiwgInNyYy9TZXR0aW5ncy50cyIsICJzcmMvVHJhbnNsYXRpb25zLnRzIiwgInNyYy9Ib3RrZXlzLnRzIiwgInNyYy9EYXNoYm9hcmQudHMiLCAic3JjL1ZpZXdNb2RlLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyBQbHVnaW4sIE1lbnUgfSBmcm9tICdvYnNpZGlhbic7XHJcbmltcG9ydCB7IFRWaWV3TW9kZSB9IGZyb20gJy4vdHlwZXMnO1xyXG5pbXBvcnQgeyByZWdpc3RlclN0eWxlcyB9IGZyb20gJy4vUmVnaXN0ZXJTdHlsZXMnO1xyXG5pbXBvcnQgeyBTZXR0aW5ncywgU2V0dGluZ3NUYWIsIERFRkFVTFRfU0VUVElOR1MgfSBmcm9tICcuL1NldHRpbmdzJ1xyXG5pbXBvcnQgeyBUcmFuc2xhdGlvbnMgfSBmcm9tICcuL1RyYW5zbGF0aW9ucyc7XHJcbmltcG9ydCB7IEhvdGtleXMgfSBmcm9tICcuL0hvdGtleXMnO1xyXG5pbXBvcnQgeyBEYXNoYm9hcmQgfSBmcm9tICcuL0Rhc2hib2FyZCc7XHJcbmltcG9ydCB7IFZpZXdNb2RlIH0gZnJvbSAnLi9WaWV3TW9kZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbHVnaW5GbG93eiBleHRlbmRzIFBsdWdpbiB7XHJcbiAgIHByaXZhdGUgdmlld01vZGUhOiBWaWV3TW9kZTtcclxuICAgc2V0dGluZ3MhOiBTZXR0aW5ncztcclxuICAgcHJpdmF0ZSB0cmFuc2xhdGlvbnM6IFRyYW5zbGF0aW9ucyA9IG5ldyBUcmFuc2xhdGlvbnMoKTtcclxuICAgcHJpdmF0ZSBob3RrZXlzITogSG90a2V5cztcclxuICAgcHJpdmF0ZSBkYXNoYm9hcmQhOiBEYXNoYm9hcmQ7XHJcblxyXG4gICBwcml2YXRlIGluaXRpYWxpemVWaWV3KCkge1xyXG4gICAgICB0aGlzLnJlZ2lzdGVyVmlldyhcclxuICAgICAgICAgXCJwbHVnaW5mbG93ei12aWV3XCIsXHJcbiAgICAgICAgIChsZWFmKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZpZXcgPSBuZXcgRGFzaGJvYXJkKGxlYWYsIHRoaXMuc2V0dGluZ3MsIHRoaXMudHJhbnNsYXRpb25zKTtcclxuICAgICAgICAgICAgdGhpcy5kYXNoYm9hcmQgPSB2aWV3O1xyXG4gICAgICAgICAgICByZXR1cm4gdmlldztcclxuICAgICAgICAgfVxyXG4gICAgICApO1xyXG4gICB9XHJcblxyXG4gICBhc3luYyBvbmxvYWQoKSB7XHJcbiAgICAgIGF3YWl0IHRoaXMubG9hZEFwcCgpO1xyXG5cclxuICAgICAgLy8gSW5pdGlhbGlzYXRpb25cclxuICAgICAgU2V0dGluZ3MuaW5pdGlhbGl6ZSh0aGlzKTtcclxuICAgICAgXHJcbiAgICAgIC8vIEluaXRpYWxpc2VyIGxlcyB0cmFkdWN0aW9uc1xyXG4gICAgICB0aGlzLmxvYWRMYW5ndWFnZSgpO1xyXG5cclxuICAgICAgLy8gSW5pdGlhbGlzZXIgVmlld01vZGUgYXZhbnQgZGUgbCd1dGlsaXNlclxyXG4gICAgICB0aGlzLnZpZXdNb2RlID0gbmV3IFZpZXdNb2RlKHRoaXMpO1xyXG4gICAgICBcclxuICAgICAgLy8gSW5pdGlhbGlzZXIgbGVzIGhvdGtleXNcclxuICAgICAgdGhpcy5ob3RrZXlzID0gbmV3IEhvdGtleXMoXHJcbiAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgIFNldHRpbmdzLFxyXG4gICAgICAgICB0aGlzLnRyYW5zbGF0aW9ucyxcclxuICAgICAgICAgdGhpcy52aWV3TW9kZVxyXG4gICAgICApO1xyXG4gICAgICB0aGlzLmhvdGtleXMucmVnaXN0ZXJIb3RrZXlzKCk7XHJcbiAgICAgIFxyXG4gICAgICB0aGlzLmluaXRpYWxpemVWaWV3KCk7XHJcblxyXG4gICAgICB0aGlzLmFkZFNldHRpbmdUYWIobmV3IFNldHRpbmdzVGFiKFxyXG4gICAgICAgICB0aGlzLmFwcCxcclxuICAgICAgICAgdGhpcyxcclxuICAgICAgICAgREVGQVVMVF9TRVRUSU5HUyxcclxuICAgICAgICAgdGhpcy52aWV3TW9kZSxcclxuICAgICAgICAgdGhpcy50cmFuc2xhdGlvbnNcclxuICAgICAgKSk7XHJcblxyXG4gICAgICAvLyBDclx1MDBFOWF0aW9uIGR1IG1lbnVcclxuICAgICAgY29uc3QgcmliYm9uSWNvbiA9IHRoaXMuYWRkUmliYm9uSWNvbihcclxuICAgICAgICAgJ2xheW91dC1ncmlkJyxcclxuICAgICAgICAgJ1BsdWdpbkZsb3d6JywgXHJcbiAgICAgICAgIGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbW9kZSA9IGF3YWl0IFNldHRpbmdzLmdldFZpZXdNb2RlKCk7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMudmlld01vZGUuc2V0Vmlldyhtb2RlKTtcclxuICAgICAgICAgfVxyXG4gICAgICApO1xyXG5cclxuICAgICAgcmliYm9uSWNvbi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgKCkgPT4ge1xyXG4gICAgICAgICBjb25zdCBtZW51ID0gbmV3IE1lbnUoKTtcclxuXHJcbiAgICAgICAgIGNvbnN0IGNyZWF0ZU1lbnVJdGVtID0gKHRpdGxlOiBzdHJpbmcsIGljb246IHN0cmluZywgbW9kZTogVFZpZXdNb2RlKSA9PiB7XHJcbiAgICAgICAgICAgIG1lbnUuYWRkSXRlbSgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICBpdGVtLnNldFRpdGxlKHRpdGxlKVxyXG4gICAgICAgICAgICAgICAgICAuc2V0SWNvbihpY29uKVxyXG4gICAgICAgICAgICAgICAgICAub25DbGljayhhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMudmlld01vZGUuc2V0Vmlldyhtb2RlKTtcclxuICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICB9O1xyXG5cclxuICAgICAgICAgY3JlYXRlTWVudUl0ZW0oXCJEYXNoYm9hcmQgVGFiXCIsIFwidGFiXCIsIFwidGFiXCIgYXMgVFZpZXdNb2RlKTtcclxuICAgICAgICAgY3JlYXRlTWVudUl0ZW0oXCJEYXNoYm9hcmQgU2lkZWJhclwiLCBcImxheW91dC1zaWRlYmFyLXJpZ2h0XCIsIFwic2lkZWJhclwiIGFzIFRWaWV3TW9kZSk7XHJcbiAgICAgICAgIGNyZWF0ZU1lbnVJdGVtKFwiRGFzaGJvYXJkIFBvcHVwXCIsIFwibGF5b3V0LXRvcFwiLCBcInBvcHVwXCIgYXMgVFZpZXdNb2RlKTtcclxuXHJcbiAgICAgICAgIGNvbnN0IGljb25SZWN0ID0gcmliYm9uSWNvbi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICAgbWVudS5zaG93QXRQb3NpdGlvbih7IFxyXG4gICAgICAgICAgICB4OiBpY29uUmVjdC5sZWZ0LCBcclxuICAgICAgICAgICAgeTogaWNvblJlY3QudG9wIC0gMTBcclxuICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICBjb25zdCBoYW5kbGVNb3VzZUxlYXZlID0gKGU6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gZS5yZWxhdGVkVGFyZ2V0IGFzIE5vZGU7XHJcbiAgICAgICAgICAgIGNvbnN0IG1lbnVEb20gPSAobWVudSBhcyBhbnkpLmRvbTtcclxuICAgICAgICAgICAgY29uc3QgaXNPdmVySWNvbiA9IHJpYmJvbkljb24uY29udGFpbnModGFyZ2V0KTtcclxuICAgICAgICAgICAgY29uc3QgaXNPdmVyTWVudSA9IG1lbnVEb20gJiYgbWVudURvbS5jb250YWlucyh0YXJnZXQpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKCFpc092ZXJJY29uICYmICFpc092ZXJNZW51KSB7XHJcbiAgICAgICAgICAgICAgIG1lbnUuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICByaWJib25JY29uLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBoYW5kbGVNb3VzZUxlYXZlKTtcclxuICAgICAgICAgICAgICAgaWYgKG1lbnVEb20pIHtcclxuICAgICAgICAgICAgICAgICAgbWVudURvbS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgaGFuZGxlTW91c2VMZWF2ZSk7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICB9O1xyXG5cclxuICAgICAgICAgcmliYm9uSWNvbi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgaGFuZGxlTW91c2VMZWF2ZSk7XHJcbiAgICAgICAgIGNvbnN0IG1lbnVEb20gPSAobWVudSBhcyBhbnkpLmRvbTtcclxuICAgICAgICAgaWYgKG1lbnVEb20pIHtcclxuICAgICAgICAgICAgbWVudURvbS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgaGFuZGxlTW91c2VMZWF2ZSk7XHJcbiAgICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICByZWdpc3RlclN0eWxlcygpO1xyXG4gICB9XHJcblxyXG4gICBwcml2YXRlIGFzeW5jIGxvYWRBcHAoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICBpZiAoIXRoaXMuYXBwLndvcmtzcGFjZSkge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KHJlc29sdmUsIDApO1xyXG4gICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgIH1cclxuXHJcbiAgIHByaXZhdGUgbG9hZExhbmd1YWdlKCk6IHZvaWQge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgICBjb25zdCBsb2NhbGUgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQubGFuZz8udG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKCdmcicpID8gJ2ZyJyA6ICdlbic7XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKCdMYW5ndWUgZFx1MDBFOXRlY3RcdTAwRTllOicsIGxvY2FsZSk7XHJcbiAgICAgICAgIHRoaXMudHJhbnNsYXRpb25zLnNldExhbmd1YWdlKGxvY2FsZSk7XHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgIGNvbnNvbGUud2FybignRXJyZXVyIGxvcnMgZGUgbGEgZFx1MDBFOXRlY3Rpb24gZGUgbGEgbGFuZ3VlLCB1dGlsaXNhdGlvbiBkdSBmcmFuXHUwMEU3YWlzIHBhciBkXHUwMEU5ZmF1dCcpO1xyXG4gICAgICAgICB0aGlzLnRyYW5zbGF0aW9ucy5zZXRMYW5ndWFnZSgnZnInKTtcclxuICAgICAgfVxyXG4gICB9XHJcblxyXG4gICBvbnVubG9hZCgpIHtcclxuICAgICAgdGhpcy5hcHAud29ya3NwYWNlLmRldGFjaExlYXZlc09mVHlwZShcInBsdWdpbmZsb3d6LXZpZXdcIik7XHJcbiAgIH1cclxufVxyXG4iLCAiZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyU3R5bGVzKCkge1xuY29uc3Qgc3R5bGVFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG5zdHlsZUVsLmlkID0gJ01ZUExVR0lOLXN0eWxlcyc7XG5zdHlsZUVsLnRleHRDb250ZW50ID0gYFxuICAgIC8qID09PT09IENTUyA9PT09PSAqL1xuICAgIC5kYXNoYm9hcmQtY29udGFpbmVyIHtcbiAgICBwYWRkaW5nOiAyMHB4O1xuICAgIH1cblxuICAgIC5wbHVnaW5zLWxpc3Qge1xuICAgIGRpc3BsYXk6IGdyaWQ7XG4gICAgZ2FwOiAyMHB4O1xuICAgIHBhZGRpbmc6IDIwcHggMDtcbiAgICB9XG5cbiAgICAucGx1Z2luLWl0ZW0ge1xuICAgIGJhY2tncm91bmQ6IHZhcigtLWJhY2tncm91bmQtc2Vjb25kYXJ5KTtcbiAgICBwYWRkaW5nOiAxNXB4O1xuICAgIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgICB9IFxuYDtcblxuZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVucmVnaXN0ZXJTdHlsZXMoKSB7XG5jb25zdCBzdHlsZUVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3lvdXR1YmUtcGxheWVyLXN0eWxlcycpO1xuaWYgKHN0eWxlRWwpIHtcbiAgICBzdHlsZUVsLnJlbW92ZSgpO1xufVxufSAiLCAiaW1wb3J0IHsgQXBwLCBQbHVnaW4sIFBsdWdpblNldHRpbmdUYWIsIFNldHRpbmd9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB7IFZpZXdNb2RlIH0gZnJvbSAnLi9WaWV3TW9kZSc7XG5pbXBvcnQgeyBUcmFuc2xhdGlvbnMgfSBmcm9tICcuL1RyYW5zbGF0aW9ucyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRGVmYXVsdFNldHRpbmdzIHtcbiAgIGxhbmd1YWdlOiBzdHJpbmc7XG4gICBjdXJyZW50TW9kZTogVFZpZXdNb2RlO1xuICAgYWN0aXZlTGVhZklkOiBzdHJpbmcgfCBudWxsO1xufVxuXG5leHBvcnQgdHlwZSBUVmlld01vZGUgPSAndGFiJyB8ICdzaWRlYmFyJyB8ICdwb3B1cCc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX1NFVFRJTkdTOiBEZWZhdWx0U2V0dGluZ3MgPSB7XG4gICBsYW5ndWFnZTogJ2ZyJyxcbiAgIGN1cnJlbnRNb2RlOiAndGFiJyxcbiAgIGFjdGl2ZUxlYWZJZDogbnVsbCxcbn07XG5cbmV4cG9ydCBjbGFzcyBTZXR0aW5ncyB7XG4gICBwcml2YXRlIHN0YXRpYyBwbHVnaW46IFBsdWdpbjtcbiAgIHByaXZhdGUgc3RhdGljIHNldHRpbmdzOiBEZWZhdWx0U2V0dGluZ3M7XG5cbiAgIHN0YXRpYyBpbml0aWFsaXplKHBsdWdpbjogUGx1Z2luKSB7XG4gICAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcbiAgIH1cblxuICAgc3RhdGljIGFzeW5jIGxvYWRTZXR0aW5ncygpOiBQcm9taXNlPERlZmF1bHRTZXR0aW5ncz4ge1xuICAgICAgY29uc3Qgc2F2ZWREYXRhID0gYXdhaXQgdGhpcy5wbHVnaW4ubG9hZERhdGEoKTtcbiAgICAgIHRoaXMuc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX1NFVFRJTkdTLCBzYXZlZERhdGEgfHwge30pO1xuICAgICAgcmV0dXJuIHRoaXMuc2V0dGluZ3M7XG4gICB9XG5cbiAgIHN0YXRpYyBhc3luYyBzYXZlU2V0dGluZ3Moc2V0dGluZ3M6IFBhcnRpYWw8RGVmYXVsdFNldHRpbmdzPikge1xuICAgICAgdGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24odGhpcy5zZXR0aW5ncyB8fCBERUZBVUxUX1NFVFRJTkdTLCBzZXR0aW5ncyk7XG4gICAgICBhd2FpdCB0aGlzLnBsdWdpbi5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKTtcbiAgIH1cblxuICAgc3RhdGljIGFzeW5jIHJlZnJlc2goKSB7XG4gICAgICBpZiAodGhpcy5wbHVnaW4gJiYgJ3JlZnJlc2gnIGluIHRoaXMucGx1Z2luKSB7XG4gICAgICAgICBhd2FpdCAodGhpcy5wbHVnaW4gYXMgYW55KS5yZWZyZXNoKCk7XG4gICAgICB9XG4gICB9XG5cbiAgIHN0YXRpYyBhc3luYyBnZXRWaWV3TW9kZSgpOiBQcm9taXNlPFRWaWV3TW9kZT4ge1xuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHRoaXMucGx1Z2luLmxvYWREYXRhKCk7XG4gICAgICByZXR1cm4gKGRhdGE/LmN1cnJlbnRNb2RlIHx8IERFRkFVTFRfU0VUVElOR1MuY3VycmVudE1vZGUpIGFzIFRWaWV3TW9kZTtcbiAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFNldHRpbmdzVGFiIGV4dGVuZHMgUGx1Z2luU2V0dGluZ1RhYiB7XG4gICBwbHVnaW46IFBsdWdpbjtcbiAgIHNldHRpbmdzOiBEZWZhdWx0U2V0dGluZ3M7XG5cbiAgIGNvbnN0cnVjdG9yKFxuICAgICAgYXBwOiBBcHAsIFxuICAgICAgcGx1Z2luOiBQbHVnaW4sIFxuICAgICAgc2V0dGluZ3M6IERlZmF1bHRTZXR0aW5ncywgXG4gICAgICBwcml2YXRlIHZpZXdNb2RlOiBWaWV3TW9kZSxcbiAgICAgIHByaXZhdGUgdHJhbnNsYXRpb25zOiBUcmFuc2xhdGlvbnNcbiAgICkge1xuICAgICAgc3VwZXIoYXBwLCBwbHVnaW4pO1xuICAgICAgdGhpcy5wbHVnaW4gPSBwbHVnaW47XG4gICAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3M7XG4gICB9XG5cbiAgIGRpc3BsYXkoKTogdm9pZCB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lckVsIH0gPSB0aGlzO1xuICAgICAgY29udGFpbmVyRWwuZW1wdHkoKTtcblxuICAgICAgLy8gRHJvcGRvd24gcG91ciBjaG9pc2lyIGxlIG1vZGUgZCdhZmZpY2hhZ2VcbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgLnNldE5hbWUodGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MuZGVmYXVsdFZpZXdNb2RlJykpXG4gICAgICAgICAuc2V0RGVzYyh0aGlzLnRyYW5zbGF0aW9ucy50KCdzZXR0aW5ncy5kZWZhdWx0Vmlld01vZGVEZXNjJykpXG4gICAgICAgICAuYWRkRHJvcGRvd24oZHJvcGRvd24gPT4gZHJvcGRvd25cbiAgICAgICAgICAgIC5hZGRPcHRpb24oJ3RhYicsIHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLnRhYicpKVxuICAgICAgICAgICAgLmFkZE9wdGlvbignc2lkZWJhcicsIHRoaXMudHJhbnNsYXRpb25zLnQoJ3NldHRpbmdzLnNpZGViYXInKSlcbiAgICAgICAgICAgIC5hZGRPcHRpb24oJ3BvcHVwJywgdGhpcy50cmFuc2xhdGlvbnMudCgnc2V0dGluZ3MucG9wdXAnKSlcbiAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnNldHRpbmdzLmN1cnJlbnRNb2RlKVxuICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5jdXJyZW50TW9kZSA9IHZhbHVlIGFzIFRWaWV3TW9kZTtcbiAgICAgICAgICAgICAgIGF3YWl0IFNldHRpbmdzLnNhdmVTZXR0aW5ncyh7IGN1cnJlbnRNb2RlOiB2YWx1ZSBhcyBUVmlld01vZGUgfSk7XG4gICAgICAgICAgICAgICBhd2FpdCB0aGlzLnZpZXdNb2RlLnNldFZpZXcodmFsdWUgYXMgVFZpZXdNb2RlKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgfVxufSIsICJleHBvcnQgdHlwZSBUcmFuc2xhdGlvbktleSA9IFxyXG4gICAvLyBEYXNoYm9hcmRcclxuICAgfCAnZGFzaGJvYXJkLnRpdGxlJ1xyXG4gICB8ICdkYXNoYm9hcmQuZGVzY3JpcHRpb24nXHJcbiAgIHwgJ2Rhc2hib2FyZC52aWV3TW9kZSdcclxuICAgfCAnZGFzaGJvYXJkLnZpZXdNb2RlRGVzYydcclxuICAgfCAnZGFzaGJvYXJkLnZpZXdNb2RlVGFiJ1xyXG4gICB8ICdkYXNoYm9hcmQudmlld01vZGVTaWRlYmFyJ1xyXG4gICB8ICdkYXNoYm9hcmQudmlld01vZGVQb3B1cCdcclxuICAgLy8gTm90aWNlc1xyXG4gICB8ICdub3RpY2VzLnNhdmVkJ1xyXG4gICB8ICdub3RpY2VzLmVycm9yJ1xyXG4gICB8ICdub3RpY2VzLnN1Y2Nlc3MnXHJcbiAgIHwgJ25vdGljZXMuZmVhdHVyZUVuYWJsZWQnXHJcbiAgIHwgJ25vdGljZXMuZmVhdHVyZURpc2FibGVkJ1xyXG4gICAvLyBDb21tYW5kc1xyXG4gICAvLyBFcnJvcnNcclxuICAgLy8gU2V0dGluZ3NcclxuICAgfCAnc2V0dGluZ3MuZGVmYXVsdFZpZXdNb2RlJ1xyXG4gICB8ICdzZXR0aW5ncy5kZWZhdWx0Vmlld01vZGVEZXNjJ1xyXG4gICB8ICdzZXR0aW5ncy50YWInXHJcbiAgIHwgJ3NldHRpbmdzLnNpZGViYXInXHJcbiAgIHwgJ3NldHRpbmdzLnBvcHVwJ1xyXG5cclxuZXhwb3J0IGNvbnN0IHRyYW5zbGF0aW9uczogeyBbbGFuZzogc3RyaW5nXTogUmVjb3JkPFRyYW5zbGF0aW9uS2V5LCBzdHJpbmc+IH0gPSB7XHJcbiAgIGVuOiB7XHJcbiAgICAgIC8vIERhc2hib2FyZFxyXG4gICAgICAnZGFzaGJvYXJkLnRpdGxlJzogJ1BsdWdpbkZsb3d6JyxcclxuICAgICAgJ2Rhc2hib2FyZC5kZXNjcmlwdGlvbic6ICdQbHVnaW5GbG93eiBpcyBhIHBsdWdpbiBmb3IgT2JzaWRpYW4gdGhhdCBhbGxvd3MgeW91IHRvIG1hbmFnZSB5b3VyIHZpZGVvcy4nLFxyXG4gICAgICAnZGFzaGJvYXJkLnZpZXdNb2RlJzogJ1ZpZXcgTW9kZScsXHJcbiAgICAgICdkYXNoYm9hcmQudmlld01vZGVEZXNjJzogJ0Nob29zZSBob3cgdmlkZW9zIHdpbGwgb3BlbiBieSBkZWZhdWx0JyxcclxuICAgICAgJ2Rhc2hib2FyZC52aWV3TW9kZVRhYic6ICdUYWInLFxyXG4gICAgICAnZGFzaGJvYXJkLnZpZXdNb2RlU2lkZWJhcic6ICdTaWRlYmFyJyxcclxuICAgICAgJ2Rhc2hib2FyZC52aWV3TW9kZVBvcHVwJzogJ1BvcHVwJyxcclxuICAgICAgLy8gTm90aWNlc1xyXG4gICAgICAnbm90aWNlcy5zYXZlZCc6ICdcdTI3MDUgU2V0dGluZ3Mgc2F2ZWQnLFxyXG4gICAgICAnbm90aWNlcy5lcnJvcic6ICdcdTI3NEMgRXJyb3I6IHttZXNzYWdlfScsXHJcbiAgICAgICdub3RpY2VzLnN1Y2Nlc3MnOiAnXHUyNzA1IE9wZXJhdGlvbiBzdWNjZXNzZnVsJyxcclxuICAgICAgJ25vdGljZXMuZmVhdHVyZUVuYWJsZWQnOiAnXHUyNzA1IEZlYXR1cmUgZW5hYmxlZCcsXHJcbiAgICAgICdub3RpY2VzLmZlYXR1cmVEaXNhYmxlZCc6ICdcdTI3NEMgRmVhdHVyZSBkaXNhYmxlZCcsXHJcbiAgICAgIC8vIENvbW1hbmRzXHJcbiAgICAgIC8vIEVycm9yc1xyXG4gICAgICAvLyBTZXR0aW5nc1xyXG4gICAgICAnc2V0dGluZ3MuZGVmYXVsdFZpZXdNb2RlJzogJ0RlZmF1bHQgVmlldyBNb2RlJyxcclxuICAgICAgJ3NldHRpbmdzLmRlZmF1bHRWaWV3TW9kZURlc2MnOiAnQ2hvb3NlIGhvdyB2aWRlb3Mgd2lsbCBvcGVuIGJ5IGRlZmF1bHQnLFxyXG4gICAgICAnc2V0dGluZ3MudGFiJzogJ1RhYicsXHJcbiAgICAgICdzZXR0aW5ncy5zaWRlYmFyJzogJ1NpZGViYXInLFxyXG4gICAgICAnc2V0dGluZ3MucG9wdXAnOiAnUG9wdXAnLFxyXG4gICB9LFxyXG4gICBmcjoge1xyXG4gICAgICAvLyBEYXNoYm9hcmRcclxuICAgICAgJ2Rhc2hib2FyZC50aXRsZSc6ICdQbHVnaW5GbG93eicsXHJcbiAgICAgICdkYXNoYm9hcmQuZGVzY3JpcHRpb24nOiAnUGx1Z2luRmxvd3ogZXN0IHVuIHBsdWdpbiBwb3VyIE9ic2lkaWFuIHF1aSB2b3VzIHBlcm1ldCBkZSBnXHUwMEU5cmVyIHZvcyB2aWRcdTAwRTlvcy4nLFxyXG4gICAgICAnZGFzaGJvYXJkLnZpZXdNb2RlJzogJ01vZGUgZFxcJ2FmZmljaGFnZScsXHJcbiAgICAgICdkYXNoYm9hcmQudmlld01vZGVEZXNjJzogJ0Nob2lzaXNzZXogY29tbWVudCBsZXMgdmlkXHUwMEU5b3Mgc1xcJ291dnJpcm9udCBwYXIgZFx1MDBFOWZhdXQnLFxyXG4gICAgICAnZGFzaGJvYXJkLnZpZXdNb2RlVGFiJzogJ09uZ2xldCcsXHJcbiAgICAgICdkYXNoYm9hcmQudmlld01vZGVTaWRlYmFyJzogJ0JhcnJlIGxhdFx1MDBFOXJhbGUnLFxyXG4gICAgICAnZGFzaGJvYXJkLnZpZXdNb2RlUG9wdXAnOiAnRmVuXHUwMEVBdHJlIGNvbnRleHR1ZWxsZScsXHJcbiAgICAgIC8vIE5vdGljZXNcclxuICAgICAgJ25vdGljZXMuc2F2ZWQnOiAnXHUyNzA1IFBhcmFtXHUwMEU4dHJlcyBzYXV2ZWdhcmRcdTAwRTlzJyxcclxuICAgICAgJ25vdGljZXMuZXJyb3InOiAnXHUyNzRDIEVycmV1cjoge21lc3NhZ2V9JyxcclxuICAgICAgJ25vdGljZXMuc3VjY2Vzcyc6ICdcdTI3MDUgT3BcdTAwRTlyYXRpb24gclx1MDBFOXVzc2llJyxcclxuICAgICAgJ25vdGljZXMuZmVhdHVyZUVuYWJsZWQnOiAnXHUyNzA1IEZvbmN0aW9ubmFsaXRcdTAwRTkgYWN0aXZcdTAwRTllJyxcclxuICAgICAgJ25vdGljZXMuZmVhdHVyZURpc2FibGVkJzogJ1x1Mjc0QyBGb25jdGlvbm5hbGl0XHUwMEU5IGRcdTAwRTlzYWN0aXZcdTAwRTllJyxcclxuICAgICAgLy8gQ29tbWFuZHNcclxuICAgICAgLy8gRXJyb3JzXHJcbiAgICAgIC8vIFNldHRpbmdzXHJcbiAgICAgICdzZXR0aW5ncy5kZWZhdWx0Vmlld01vZGUnOiAnTW9kZSBkXFwnYWZmaWNoYWdlIHBhciBkXHUwMEU5ZmF1dCcsXHJcbiAgICAgICdzZXR0aW5ncy5kZWZhdWx0Vmlld01vZGVEZXNjJzogJ0Nob2lzaXNzZXogY29tbWVudCBsZXMgdmlkXHUwMEU5b3Mgc1xcJ291dnJpcm9udCBwYXIgZFx1MDBFOWZhdXQnLFxyXG4gICAgICAnc2V0dGluZ3MudGFiJzogJ09uZ2xldCcsXHJcbiAgICAgICdzZXR0aW5ncy5zaWRlYmFyJzogJ0JhcnJlIGxhdFx1MDBFOXJhbGUnLFxyXG4gICAgICAnc2V0dGluZ3MucG9wdXAnOiAnRmVuXHUwMEVBdHJlIGNvbnRleHR1ZWxsZScsXHJcbiAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBjbGFzcyBUcmFuc2xhdGlvbnMge1xyXG4gICBwcml2YXRlIGN1cnJlbnRMYW5nOiBzdHJpbmc7XHJcblxyXG4gICBjb25zdHJ1Y3Rvcihpbml0aWFsTGFuZzogc3RyaW5nID0gJ2ZyJykge1xyXG4gICAgICB0aGlzLmN1cnJlbnRMYW5nID0gaW5pdGlhbExhbmc7XHJcbiAgIH1cclxuXHJcbiAgIHNldExhbmd1YWdlKGxhbmc6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICB0aGlzLmN1cnJlbnRMYW5nID0gbGFuZztcclxuICAgfVxyXG5cclxuICAgdChrZXk6IFRyYW5zbGF0aW9uS2V5KTogc3RyaW5nIHtcclxuICAgICAgcmV0dXJuIHRyYW5zbGF0aW9uc1t0aGlzLmN1cnJlbnRMYW5nXT8uW2tleV0gfHwgdHJhbnNsYXRpb25zWydlbiddW2tleV0gfHwga2V5O1xyXG4gICB9XHJcbn1cclxuIiwgImltcG9ydCB7IFBsdWdpbiwgTm90aWNlIH0gZnJvbSAnb2JzaWRpYW4nO1xuaW1wb3J0IHsgU2V0dGluZ3MgfSBmcm9tICcuL1NldHRpbmdzJztcbmltcG9ydCB7IFRyYW5zbGF0aW9ucyB9IGZyb20gJy4vVHJhbnNsYXRpb25zJztcbmltcG9ydCB7IFZpZXdNb2RlIH0gZnJvbSAnLi9WaWV3TW9kZSc7XG5cbmV4cG9ydCBjbGFzcyBIb3RrZXlzIHtcbiAgIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBwbHVnaW46IFBsdWdpbixcbiAgICAgIHByaXZhdGUgc2V0dGluZ3M6IFNldHRpbmdzLFxuICAgICAgcHJpdmF0ZSB0cmFuc2xhdGlvbnM6IFRyYW5zbGF0aW9ucyxcbiAgICAgIHByaXZhdGUgdmlld01vZGU6IFZpZXdNb2RlXG4gICApIHt9XG5cbiAgIHByaXZhdGUgaGFuZGxlQ29tbWFuZEVycm9yKGVycm9yOiB1bmtub3duKSB7XG4gICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBDb21tYW5kRXJyb3IpIHtcbiAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tIb3RrZXlzXScsIGVycm9yKTtcbiAgICAgICAgIG5ldyBOb3RpY2UodGhpcy50cmFuc2xhdGlvbnMudChgZXJyb3JzLiR7ZXJyb3IuY29kZX1gKSk7XG4gICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH1cbiAgICAgIHRocm93IGVycm9yO1xuICAgfVxuXG4gICByZWdpc3RlckhvdGtleXMoKSB7XG4gICAgICAvLyBPdXZyaXIgbGUgZGFzaGJvYXJkXG4gICAgICB0aGlzLnBsdWdpbi5hZGRDb21tYW5kKHtcbiAgICAgICAgIGlkOiAnb3Blbi1wbHVnaW5zLWRhc2hib2FyZCcsXG4gICAgICAgICBuYW1lOiB0aGlzLnRyYW5zbGF0aW9ucy50KCdjb21tYW5kcy5vcGVuRGFzaGJvYXJkJyksXG4gICAgICAgICBpY29uOiAnZGFzaGJvYXJkJyxcbiAgICAgICAgIGNhbGxiYWNrOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgY29uc3QgbW9kZSA9IGF3YWl0IFNldHRpbmdzLmdldFZpZXdNb2RlKCk7XG4gICAgICAgICAgICAgICBhd2FpdCB0aGlzLnZpZXdNb2RlLnNldFZpZXcobW9kZSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVDb21tYW5kRXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgfSxcbiAgICAgICAgIGhvdGtleXM6IFt7IG1vZGlmaWVyczogWydBbHQnXSwga2V5OiAnUCcgfV1cbiAgICAgIH0pO1xuICAgfVxufVxuIiwgImltcG9ydCB7IEl0ZW1WaWV3LCBXb3Jrc3BhY2VMZWFmIH0gZnJvbSAnb2JzaWRpYW4nO1xyXG5pbXBvcnQgeyBUVmlld01vZGUgfSBmcm9tICcuL3R5cGVzJztcclxuaW1wb3J0IHsgU2V0dGluZ3MgfSBmcm9tICcuL1NldHRpbmdzJztcclxuaW1wb3J0IHsgVHJhbnNsYXRpb25zIH0gZnJvbSAnLi9UcmFuc2xhdGlvbnMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIERhc2hib2FyZCBleHRlbmRzIEl0ZW1WaWV3IHtcclxuICAgIHByaXZhdGUgdHJhbnNsYXRpb25zOiBUcmFuc2xhdGlvbnM7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgbGVhZjogV29ya3NwYWNlTGVhZixcclxuICAgICAgICBwcml2YXRlIHNldHRpbmdzOiBTZXR0aW5ncyxcclxuICAgICAgICB0cmFuc2xhdGlvbnM6IFRyYW5zbGF0aW9uc1xyXG4gICAgKSB7XHJcbiAgICAgICAgc3VwZXIobGVhZik7XHJcbiAgICAgICAgdGhpcy50cmFuc2xhdGlvbnMgPSB0cmFuc2xhdGlvbnM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Vmlld1R5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gJ3BsdWdpbmZsb3d6LXZpZXcnO1xyXG4gICAgfVxyXG5cclxuICAgIGdldERpc3BsYXlUZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudHJhbnNsYXRpb25zLnQoJ2Rhc2hib2FyZC50aXRsZScpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIG9uT3BlbigpIHtcclxuICAgICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLmNvbnRhaW5lckVsLmNoaWxkcmVuWzFdIGFzIEhUTUxFbGVtZW50O1xyXG4gICAgICAgIGNvbnRhaW5lci5lbXB0eSgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGF3YWl0IHRoaXMucmVuZGVyRGFzaGJvYXJkKGNvbnRhaW5lcik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhc3luYyByZW5kZXJEYXNoYm9hcmQoY29udGFpbmVyOiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgIGNvbnN0IGRhc2hib2FyZENvbnRhaW5lciA9IGNvbnRhaW5lci5jcmVhdGVEaXYoJ2Rhc2hib2FyZC1jb250YWluZXInKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBFbi10XHUwMEVBdGUgYXZlYyBsZSB0aXRyZVxyXG4gICAgICAgIGRhc2hib2FyZENvbnRhaW5lci5jcmVhdGVFbCgnaDInLCB7IFxyXG4gICAgICAgICAgICB0ZXh0OiB0aGlzLnRyYW5zbGF0aW9ucy50KCdkYXNoYm9hcmQuaW5zdGFsbGVkUGx1Z2lucycpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gTGlzdGUgZGVzIHBsdWdpbnNcclxuICAgICAgICBjb25zdCBwbHVnaW5zTGlzdCA9IGRhc2hib2FyZENvbnRhaW5lci5jcmVhdGVEaXYoJ3BsdWdpbnMtbGlzdCcpO1xyXG4gICAgICAgIGF3YWl0IHRoaXMucmVuZGVyUGx1Z2luc0xpc3QocGx1Z2luc0xpc3QpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYXN5bmMgcmVuZGVyUGx1Z2luc0xpc3QoY29udGFpbmVyOiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgIGNvbnN0IGluc3RhbGxlZFBsdWdpbnMgPSBBcnJheS5mcm9tKHRoaXMuYXBwLnBsdWdpbnMuZW5hYmxlZFBsdWdpbnMpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGluc3RhbGxlZFBsdWdpbnMuZm9yRWFjaChwbHVnaW5JZCA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBsdWdpbiA9IHRoaXMuYXBwLnBsdWdpbnMucGx1Z2luc1twbHVnaW5JZF07XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlUGx1Z2luSXRlbShjb250YWluZXIsIHBsdWdpbik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVQbHVnaW5JdGVtKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIHBsdWdpbjogYW55KSB7XHJcbiAgICAgICAgY29uc3QgcGx1Z2luSXRlbSA9IGNvbnRhaW5lci5jcmVhdGVEaXYoJ3BsdWdpbi1pdGVtJyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcGx1Z2luSXRlbS5jcmVhdGVFbCgnaDMnLCB7IHRleHQ6IHBsdWdpbi5tYW5pZmVzdC5uYW1lIH0pO1xyXG4gICAgICAgIHBsdWdpbkl0ZW0uY3JlYXRlRWwoJ3AnLCB7IHRleHQ6IHBsdWdpbi5tYW5pZmVzdC5kZXNjcmlwdGlvbiB9KTtcclxuICAgICAgICBwbHVnaW5JdGVtLmNyZWF0ZUVsKCdzbWFsbCcsIHsgXHJcbiAgICAgICAgICAgIHRleHQ6IHRoaXMudHJhbnNsYXRpb25zLnQoJ2Rhc2hib2FyZC52ZXJzaW9uJywge1xyXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogcGx1Z2luLm1hbmlmZXN0LnZlcnNpb25cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvbkNsb3NlKCkge1xyXG4gICAgICAgIC8vIE5ldHRveWFnZSBzaSBuXHUwMEU5Y2Vzc2FpcmVcclxuICAgIH1cclxufVxyXG4iLCAiaW1wb3J0IHsgUGx1Z2luLCBXb3Jrc3BhY2VMZWFmIH0gZnJvbSAnb2JzaWRpYW4nO1xyXG5pbXBvcnQgeyBUVmlld01vZGUgfSBmcm9tICcuL3R5cGVzJztcclxuaW1wb3J0IHsgU2V0dGluZ3MgfSBmcm9tICcuL1NldHRpbmdzJztcclxuaW1wb3J0IHsgRGFzaGJvYXJkIH0gZnJvbSAnLi9EYXNoYm9hcmQnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFZpZXdNb2RlIHtcclxuICAgcHJpdmF0ZSBjdXJyZW50VmlldzogRGFzaGJvYXJkIHwgbnVsbCA9IG51bGw7XHJcbiAgIHByaXZhdGUgY3VycmVudE1vZGU6IFRWaWV3TW9kZSB8IG51bGwgPSBudWxsO1xyXG4gICBwcml2YXRlIGFjdGl2ZUxlYWY6IFdvcmtzcGFjZUxlYWYgfCBudWxsID0gbnVsbDtcclxuICAgcHJpdmF0ZSBsZWFmSWQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgY29uc3RydWN0b3IocHJpdmF0ZSBwbHVnaW46IFBsdWdpbikge1xyXG4gICAgICAvLyBJbml0aWFsaXNlciBsZSBtb2RlIGRlcHVpcyBsZXMgc2V0dGluZ3NcclxuICAgICAgU2V0dGluZ3MubG9hZFNldHRpbmdzKCkudGhlbihzZXR0aW5ncyA9PiB7XHJcbiAgICAgICAgIHRoaXMuY3VycmVudE1vZGUgPSBzZXR0aW5ncy5jdXJyZW50TW9kZTtcclxuICAgICAgfSk7XHJcbiAgICAgIC8vIE5ldHRveWVyIGxlcyBhbmNpZW5uZXMgbGVhZnMgYXUgZFx1MDBFOW1hcnJhZ2VcclxuICAgICAgdGhpcy5jbG9zZUN1cnJlbnRWaWV3KCk7XHJcbiAgIH1cclxuXHJcbiAgIHByaXZhdGUgYXN5bmMgY2xvc2VDdXJyZW50VmlldygpIHtcclxuICAgICAgaWYgKHRoaXMuY3VycmVudFZpZXcpIHtcclxuICAgICAgICAgY29uc3QgbGVhdmVzID0gdGhpcy5wbHVnaW4uYXBwLndvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoJ3BsdWdpbmZsb3d6LXZpZXcnKTtcclxuICAgICAgICAgbGVhdmVzLmZvckVhY2gobGVhZiA9PiB7XHJcbiAgICAgICAgICAgIGlmIChsZWFmLnZpZXcgaW5zdGFuY2VvZiBEYXNoYm9hcmQpIHtcclxuICAgICAgICAgICAgICAgbGVhZi5kZXRhY2goKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICB9KTtcclxuICAgICAgICAgdGhpcy5jdXJyZW50VmlldyA9IG51bGw7XHJcbiAgICAgICAgIHRoaXMuYWN0aXZlTGVhZiA9IG51bGw7XHJcbiAgICAgICAgIHRoaXMubGVhZklkID0gbnVsbDtcclxuICAgICAgfVxyXG4gICB9XHJcblxyXG4gICBwcml2YXRlIGdldExlYWZGb3JNb2RlKG1vZGU6IFRWaWV3TW9kZSk6IFdvcmtzcGFjZUxlYWYge1xyXG4gICAgICBjb25zdCB3b3Jrc3BhY2UgPSB0aGlzLnBsdWdpbi5hcHAud29ya3NwYWNlO1xyXG4gICAgICBcclxuICAgICAgLy8gRmVybWVyIHRvdXRlcyBsZXMgdnVlcyBEYXNoYm9hcmQgZXhpc3RhbnRlc1xyXG4gICAgICBjb25zdCBleGlzdGluZ0xlYXZlcyA9IHdvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoJ3BsdWdpbmZsb3d6LXZpZXcnKTtcclxuICAgICAgZXhpc3RpbmdMZWF2ZXMuZm9yRWFjaChsZWFmID0+IHtcclxuICAgICAgICAgaWYgKGxlYWYudmlldyBpbnN0YW5jZW9mIERhc2hib2FyZCkge1xyXG4gICAgICAgICAgICBsZWFmLmRldGFjaCgpO1xyXG4gICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBcclxuICAgICAgbGV0IGxlYWY6IFdvcmtzcGFjZUxlYWY7XHJcbiAgICAgIHN3aXRjaCAobW9kZSkge1xyXG4gICAgICAgICBjYXNlICdzaWRlYmFyJzpcclxuICAgICAgICAgICAgbGVhZiA9IHdvcmtzcGFjZS5nZXRSaWdodExlYWYoZmFsc2UpID8/IHdvcmtzcGFjZS5nZXRMZWFmKCdzcGxpdCcpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgY2FzZSAncG9wdXAnOlxyXG4gICAgICAgICAgICBjb25zdCBhY3RpdmVMZWFmID0gd29ya3NwYWNlLmdldE1vc3RSZWNlbnRMZWFmKCkgPz8gd29ya3NwYWNlLmdldExlYWYoJ3NwbGl0Jyk7XHJcbiAgICAgICAgICAgIGxlYWYgPSB3b3Jrc3BhY2UuY3JlYXRlTGVhZkJ5U3BsaXQoYWN0aXZlTGVhZiwgJ2hvcml6b250YWwnLCB0cnVlKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgIGNhc2UgJ3RhYic6XHJcbiAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIGxlYWYgPSB3b3Jrc3BhY2UuZ2V0TGVhZignc3BsaXQnKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBsZWFmO1xyXG4gICB9XHJcblxyXG4gICBhc3luYyBzZXRWaWV3KG1vZGU6IFRWaWV3TW9kZSkge1xyXG4gICAgICBpZiAobW9kZSA9PT0gdGhpcy5jdXJyZW50TW9kZSAmJiB0aGlzLmN1cnJlbnRWaWV3ICYmIHRoaXMuYWN0aXZlTGVhZikge1xyXG4gICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGF3YWl0IHRoaXMuY2xvc2VDdXJyZW50VmlldygpO1xyXG5cclxuICAgICAgY29uc3QgbGVhZiA9IHRoaXMuZ2V0TGVhZkZvck1vZGUobW9kZSk7XHJcbiAgICAgIGF3YWl0IGxlYWYuc2V0Vmlld1N0YXRlKHtcclxuICAgICAgICAgdHlwZTogJ3BsdWdpbmZsb3d6LXZpZXcnLFxyXG4gICAgICAgICBhY3RpdmU6IHRydWUsXHJcbiAgICAgICAgIHN0YXRlOiB7IFxyXG4gICAgICAgICAgICBtb2RlOiBtb2RlLFxyXG4gICAgICAgICAgICBsZWFmSWQ6IHRoaXMubGVhZklkXHJcbiAgICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLmN1cnJlbnRNb2RlID0gbW9kZTtcclxuICAgICAgLy8gU2F1dmVnYXJkZXIgbGUgbm91dmVhdSBtb2RlIGRhbnMgbGVzIHNldHRpbmdzXHJcbiAgICAgIGF3YWl0IFNldHRpbmdzLnNhdmVTZXR0aW5ncyh7IGN1cnJlbnRNb2RlOiBtb2RlIH0pO1xyXG4gICAgICBcclxuICAgICAgdGhpcy5jdXJyZW50VmlldyA9IGxlYWYudmlldyBhcyBEYXNoYm9hcmQ7XHJcbiAgICAgIHRoaXMuYWN0aXZlTGVhZiA9IGxlYWY7XHJcbiAgICAgIHRoaXMucGx1Z2luLmFwcC53b3Jrc3BhY2UucmV2ZWFsTGVhZihsZWFmKTtcclxuICAgfVxyXG5cclxuICAgZ2V0QWN0aXZlTGVhZigpOiBXb3Jrc3BhY2VMZWFmIHwgbnVsbCB7XHJcbiAgICAgIHJldHVybiB0aGlzLmFjdGl2ZUxlYWY7XHJcbiAgIH1cclxuXHJcbiAgIGdldEN1cnJlbnRMZWFmSWQoKTogc3RyaW5nIHwgbnVsbCB7XHJcbiAgICAgIHJldHVybiB0aGlzLmxlYWZJZDtcclxuICAgfVxyXG59ICJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFBQUEsbUJBQTZCOzs7QUNBdEIsU0FBUyxpQkFBaUI7QUFDakMsUUFBTSxVQUFVLFNBQVMsY0FBYyxPQUFPO0FBQzlDLFVBQVEsS0FBSztBQUNiLFVBQVEsY0FBYztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFtQnRCLFdBQVMsS0FBSyxZQUFZLE9BQU87QUFDakM7OztBQ3ZCQSxzQkFBc0Q7QUFZL0MsSUFBTSxtQkFBb0M7QUFBQSxFQUM5QyxVQUFVO0FBQUEsRUFDVixhQUFhO0FBQUEsRUFDYixjQUFjO0FBQ2pCO0FBRU8sSUFBTSxXQUFOLE1BQWU7QUFBQSxFQUluQixPQUFPLFdBQVcsUUFBZ0I7QUFDL0IsU0FBSyxTQUFTO0FBQUEsRUFDakI7QUFBQSxFQUVBLGFBQWEsZUFBeUM7QUFDbkQsVUFBTSxZQUFZLE1BQU0sS0FBSyxPQUFPLFNBQVM7QUFDN0MsU0FBSyxXQUFXLE9BQU8sT0FBTyxDQUFDLEdBQUcsa0JBQWtCLGFBQWEsQ0FBQyxDQUFDO0FBQ25FLFdBQU8sS0FBSztBQUFBLEVBQ2Y7QUFBQSxFQUVBLGFBQWEsYUFBYSxVQUFvQztBQUMzRCxTQUFLLFdBQVcsT0FBTyxPQUFPLEtBQUssWUFBWSxrQkFBa0IsUUFBUTtBQUN6RSxVQUFNLEtBQUssT0FBTyxTQUFTLEtBQUssUUFBUTtBQUFBLEVBQzNDO0FBQUEsRUFFQSxhQUFhLFVBQVU7QUFDcEIsUUFBSSxLQUFLLFVBQVUsYUFBYSxLQUFLLFFBQVE7QUFDMUMsWUFBTyxLQUFLLE9BQWUsUUFBUTtBQUFBLElBQ3RDO0FBQUEsRUFDSDtBQUFBLEVBRUEsYUFBYSxjQUFrQztBQUM1QyxVQUFNLE9BQU8sTUFBTSxLQUFLLE9BQU8sU0FBUztBQUN4QyxZQUFRLDZCQUFNLGdCQUFlLGlCQUFpQjtBQUFBLEVBQ2pEO0FBQ0g7QUFFTyxJQUFNLGNBQU4sY0FBMEIsaUNBQWlCO0FBQUEsRUFJL0MsWUFDRyxLQUNBLFFBQ0EsVUFDUSxVQUNBQyxlQUNUO0FBQ0MsVUFBTSxLQUFLLE1BQU07QUFIVDtBQUNBLHdCQUFBQTtBQUdSLFNBQUssU0FBUztBQUNkLFNBQUssV0FBVztBQUFBLEVBQ25CO0FBQUEsRUFFQSxVQUFnQjtBQUNiLFVBQU0sRUFBRSxZQUFZLElBQUk7QUFDeEIsZ0JBQVksTUFBTTtBQUdsQixRQUFJLHdCQUFRLFdBQVcsRUFDbkIsUUFBUSxLQUFLLGFBQWEsRUFBRSwwQkFBMEIsQ0FBQyxFQUN2RCxRQUFRLEtBQUssYUFBYSxFQUFFLDhCQUE4QixDQUFDLEVBQzNELFlBQVksY0FBWSxTQUNyQixVQUFVLE9BQU8sS0FBSyxhQUFhLEVBQUUsY0FBYyxDQUFDLEVBQ3BELFVBQVUsV0FBVyxLQUFLLGFBQWEsRUFBRSxrQkFBa0IsQ0FBQyxFQUM1RCxVQUFVLFNBQVMsS0FBSyxhQUFhLEVBQUUsZ0JBQWdCLENBQUMsRUFDeEQsU0FBUyxLQUFLLFNBQVMsV0FBVyxFQUNsQyxTQUFTLE9BQU8sVUFBVTtBQUN4QixXQUFLLFNBQVMsY0FBYztBQUM1QixZQUFNLFNBQVMsYUFBYSxFQUFFLGFBQWEsTUFBbUIsQ0FBQztBQUMvRCxZQUFNLEtBQUssU0FBUyxRQUFRLEtBQWtCO0FBQUEsSUFDakQsQ0FBQyxDQUFDO0FBQUEsRUFFWDtBQUNIOzs7QUM3RE8sSUFBTSxlQUFtRTtBQUFBLEVBQzdFLElBQUk7QUFBQTtBQUFBLElBRUQsbUJBQW1CO0FBQUEsSUFDbkIseUJBQXlCO0FBQUEsSUFDekIsc0JBQXNCO0FBQUEsSUFDdEIsMEJBQTBCO0FBQUEsSUFDMUIseUJBQXlCO0FBQUEsSUFDekIsNkJBQTZCO0FBQUEsSUFDN0IsMkJBQTJCO0FBQUE7QUFBQSxJQUUzQixpQkFBaUI7QUFBQSxJQUNqQixpQkFBaUI7QUFBQSxJQUNqQixtQkFBbUI7QUFBQSxJQUNuQiwwQkFBMEI7QUFBQSxJQUMxQiwyQkFBMkI7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUkzQiw0QkFBNEI7QUFBQSxJQUM1QixnQ0FBZ0M7QUFBQSxJQUNoQyxnQkFBZ0I7QUFBQSxJQUNoQixvQkFBb0I7QUFBQSxJQUNwQixrQkFBa0I7QUFBQSxFQUNyQjtBQUFBLEVBQ0EsSUFBSTtBQUFBO0FBQUEsSUFFRCxtQkFBbUI7QUFBQSxJQUNuQix5QkFBeUI7QUFBQSxJQUN6QixzQkFBc0I7QUFBQSxJQUN0QiwwQkFBMEI7QUFBQSxJQUMxQix5QkFBeUI7QUFBQSxJQUN6Qiw2QkFBNkI7QUFBQSxJQUM3QiwyQkFBMkI7QUFBQTtBQUFBLElBRTNCLGlCQUFpQjtBQUFBLElBQ2pCLGlCQUFpQjtBQUFBLElBQ2pCLG1CQUFtQjtBQUFBLElBQ25CLDBCQUEwQjtBQUFBLElBQzFCLDJCQUEyQjtBQUFBO0FBQUE7QUFBQTtBQUFBLElBSTNCLDRCQUE0QjtBQUFBLElBQzVCLGdDQUFnQztBQUFBLElBQ2hDLGdCQUFnQjtBQUFBLElBQ2hCLG9CQUFvQjtBQUFBLElBQ3BCLGtCQUFrQjtBQUFBLEVBQ3JCO0FBQ0g7QUFFTyxJQUFNLGVBQU4sTUFBbUI7QUFBQSxFQUd2QixZQUFZLGNBQXNCLE1BQU07QUFDckMsU0FBSyxjQUFjO0FBQUEsRUFDdEI7QUFBQSxFQUVBLFlBQVksTUFBb0I7QUFDN0IsU0FBSyxjQUFjO0FBQUEsRUFDdEI7QUFBQSxFQUVBLEVBQUUsS0FBNkI7QUF0RmxDO0FBdUZNLGFBQU8sa0JBQWEsS0FBSyxXQUFXLE1BQTdCLG1CQUFpQyxTQUFRLGFBQWEsSUFBSSxFQUFFLEdBQUcsS0FBSztBQUFBLEVBQzlFO0FBQ0g7OztBQ3pGQSxJQUFBQyxtQkFBK0I7QUFLeEIsSUFBTSxVQUFOLE1BQWM7QUFBQSxFQUNsQixZQUNXLFFBQ0EsVUFDQUMsZUFDQSxVQUNUO0FBSlM7QUFDQTtBQUNBLHdCQUFBQTtBQUNBO0FBQUEsRUFDUjtBQUFBLEVBRUssbUJBQW1CLE9BQWdCO0FBQ3hDLFFBQUksaUJBQWlCLGNBQWM7QUFDaEMsY0FBUSxNQUFNLGFBQWEsS0FBSztBQUNoQyxVQUFJLHdCQUFPLEtBQUssYUFBYSxFQUFFLFVBQVUsTUFBTSxJQUFJLEVBQUUsQ0FBQztBQUN0RCxZQUFNO0FBQUEsSUFDVDtBQUNBLFVBQU07QUFBQSxFQUNUO0FBQUEsRUFFQSxrQkFBa0I7QUFFZixTQUFLLE9BQU8sV0FBVztBQUFBLE1BQ3BCLElBQUk7QUFBQSxNQUNKLE1BQU0sS0FBSyxhQUFhLEVBQUUsd0JBQXdCO0FBQUEsTUFDbEQsTUFBTTtBQUFBLE1BQ04sVUFBVSxZQUFZO0FBQ25CLFlBQUk7QUFDRCxnQkFBTSxPQUFPLE1BQU0sU0FBUyxZQUFZO0FBQ3hDLGdCQUFNLEtBQUssU0FBUyxRQUFRLElBQUk7QUFBQSxRQUNuQyxTQUFTLE9BQU87QUFDYixlQUFLLG1CQUFtQixLQUFLO0FBQUEsUUFDaEM7QUFBQSxNQUNIO0FBQUEsTUFDQSxTQUFTLENBQUMsRUFBRSxXQUFXLENBQUMsS0FBSyxHQUFHLEtBQUssSUFBSSxDQUFDO0FBQUEsSUFDN0MsQ0FBQztBQUFBLEVBQ0o7QUFDSDs7O0FDdkNBLElBQUFDLG1CQUF3QztBQUtqQyxJQUFNLFlBQU4sY0FBd0IsMEJBQVM7QUFBQSxFQUdwQyxZQUNJLE1BQ1EsVUFDUkMsZUFDRjtBQUNFLFVBQU0sSUFBSTtBQUhGO0FBSVIsU0FBSyxlQUFlQTtBQUFBLEVBQ3hCO0FBQUEsRUFFQSxjQUFzQjtBQUNsQixXQUFPO0FBQUEsRUFDWDtBQUFBLEVBRUEsaUJBQXlCO0FBQ3JCLFdBQU8sS0FBSyxhQUFhLEVBQUUsaUJBQWlCO0FBQUEsRUFDaEQ7QUFBQSxFQUVBLE1BQU0sU0FBUztBQUNYLFVBQU0sWUFBWSxLQUFLLFlBQVksU0FBUyxDQUFDO0FBQzdDLGNBQVUsTUFBTTtBQUVoQixVQUFNLEtBQUssZ0JBQWdCLFNBQVM7QUFBQSxFQUN4QztBQUFBLEVBRUEsTUFBYyxnQkFBZ0IsV0FBd0I7QUFDbEQsVUFBTSxxQkFBcUIsVUFBVSxVQUFVLHFCQUFxQjtBQUdwRSx1QkFBbUIsU0FBUyxNQUFNO0FBQUEsTUFDOUIsTUFBTSxLQUFLLGFBQWEsRUFBRSw0QkFBNEI7QUFBQSxJQUMxRCxDQUFDO0FBR0QsVUFBTSxjQUFjLG1CQUFtQixVQUFVLGNBQWM7QUFDL0QsVUFBTSxLQUFLLGtCQUFrQixXQUFXO0FBQUEsRUFDNUM7QUFBQSxFQUVBLE1BQWMsa0JBQWtCLFdBQXdCO0FBQ3BELFVBQU0sbUJBQW1CLE1BQU0sS0FBSyxLQUFLLElBQUksUUFBUSxjQUFjO0FBRW5FLHFCQUFpQixRQUFRLGNBQVk7QUFDakMsWUFBTSxTQUFTLEtBQUssSUFBSSxRQUFRLFFBQVEsUUFBUTtBQUNoRCxXQUFLLGlCQUFpQixXQUFXLE1BQU07QUFBQSxJQUMzQyxDQUFDO0FBQUEsRUFDTDtBQUFBLEVBRVEsaUJBQWlCLFdBQXdCLFFBQWE7QUFDMUQsVUFBTSxhQUFhLFVBQVUsVUFBVSxhQUFhO0FBRXBELGVBQVcsU0FBUyxNQUFNLEVBQUUsTUFBTSxPQUFPLFNBQVMsS0FBSyxDQUFDO0FBQ3hELGVBQVcsU0FBUyxLQUFLLEVBQUUsTUFBTSxPQUFPLFNBQVMsWUFBWSxDQUFDO0FBQzlELGVBQVcsU0FBUyxTQUFTO0FBQUEsTUFDekIsTUFBTSxLQUFLLGFBQWEsRUFBRSxxQkFBcUI7QUFBQSxRQUMzQyxTQUFTLE9BQU8sU0FBUztBQUFBLE1BQzdCLENBQUM7QUFBQSxJQUNMLENBQUM7QUFBQSxFQUNMO0FBQUEsRUFFQSxNQUFNLFVBQVU7QUFBQSxFQUVoQjtBQUNKOzs7QUNoRU8sSUFBTSxXQUFOLE1BQWU7QUFBQSxFQU1uQixZQUFvQixRQUFnQjtBQUFoQjtBQUxwQixTQUFRLGNBQWdDO0FBQ3hDLFNBQVEsY0FBZ0M7QUFDeEMsU0FBUSxhQUFtQztBQUMzQyxTQUFRLFNBQXdCO0FBSTdCLGFBQVMsYUFBYSxFQUFFLEtBQUssY0FBWTtBQUN0QyxXQUFLLGNBQWMsU0FBUztBQUFBLElBQy9CLENBQUM7QUFFRCxTQUFLLGlCQUFpQjtBQUFBLEVBQ3pCO0FBQUEsRUFFQSxNQUFjLG1CQUFtQjtBQUM5QixRQUFJLEtBQUssYUFBYTtBQUNuQixZQUFNLFNBQVMsS0FBSyxPQUFPLElBQUksVUFBVSxnQkFBZ0Isa0JBQWtCO0FBQzNFLGFBQU8sUUFBUSxVQUFRO0FBQ3BCLFlBQUksS0FBSyxnQkFBZ0IsV0FBVztBQUNqQyxlQUFLLE9BQU87QUFBQSxRQUNmO0FBQUEsTUFDSCxDQUFDO0FBQ0QsV0FBSyxjQUFjO0FBQ25CLFdBQUssYUFBYTtBQUNsQixXQUFLLFNBQVM7QUFBQSxJQUNqQjtBQUFBLEVBQ0g7QUFBQSxFQUVRLGVBQWUsTUFBZ0M7QUFsQzFEO0FBbUNNLFVBQU0sWUFBWSxLQUFLLE9BQU8sSUFBSTtBQUdsQyxVQUFNLGlCQUFpQixVQUFVLGdCQUFnQixrQkFBa0I7QUFDbkUsbUJBQWUsUUFBUSxDQUFBQyxVQUFRO0FBQzVCLFVBQUlBLE1BQUssZ0JBQWdCLFdBQVc7QUFDakMsUUFBQUEsTUFBSyxPQUFPO0FBQUEsTUFDZjtBQUFBLElBQ0gsQ0FBQztBQUVELFFBQUk7QUFDSixZQUFRLE1BQU07QUFBQSxNQUNYLEtBQUs7QUFDRixnQkFBTyxlQUFVLGFBQWEsS0FBSyxNQUE1QixZQUFpQyxVQUFVLFFBQVEsT0FBTztBQUNqRTtBQUFBLE1BQ0gsS0FBSztBQUNGLGNBQU0sY0FBYSxlQUFVLGtCQUFrQixNQUE1QixZQUFpQyxVQUFVLFFBQVEsT0FBTztBQUM3RSxlQUFPLFVBQVUsa0JBQWtCLFlBQVksY0FBYyxJQUFJO0FBQ2pFO0FBQUEsTUFDSCxLQUFLO0FBQUEsTUFDTDtBQUNHLGVBQU8sVUFBVSxRQUFRLE9BQU87QUFDaEM7QUFBQSxJQUNOO0FBRUEsV0FBTztBQUFBLEVBQ1Y7QUFBQSxFQUVBLE1BQU0sUUFBUSxNQUFpQjtBQUM1QixRQUFJLFNBQVMsS0FBSyxlQUFlLEtBQUssZUFBZSxLQUFLLFlBQVk7QUFDbkU7QUFBQSxJQUNIO0FBRUEsVUFBTSxLQUFLLGlCQUFpQjtBQUU1QixVQUFNLE9BQU8sS0FBSyxlQUFlLElBQUk7QUFDckMsVUFBTSxLQUFLLGFBQWE7QUFBQSxNQUNyQixNQUFNO0FBQUEsTUFDTixRQUFRO0FBQUEsTUFDUixPQUFPO0FBQUEsUUFDSjtBQUFBLFFBQ0EsUUFBUSxLQUFLO0FBQUEsTUFDaEI7QUFBQSxJQUNILENBQUM7QUFFRCxTQUFLLGNBQWM7QUFFbkIsVUFBTSxTQUFTLGFBQWEsRUFBRSxhQUFhLEtBQUssQ0FBQztBQUVqRCxTQUFLLGNBQWMsS0FBSztBQUN4QixTQUFLLGFBQWE7QUFDbEIsU0FBSyxPQUFPLElBQUksVUFBVSxXQUFXLElBQUk7QUFBQSxFQUM1QztBQUFBLEVBRUEsZ0JBQXNDO0FBQ25DLFdBQU8sS0FBSztBQUFBLEVBQ2Y7QUFBQSxFQUVBLG1CQUFrQztBQUMvQixXQUFPLEtBQUs7QUFBQSxFQUNmO0FBQ0g7OztBTnZGQSxJQUFxQixjQUFyQixjQUF5Qyx3QkFBTztBQUFBLEVBQWhEO0FBQUE7QUFHRyxTQUFRLGVBQTZCLElBQUksYUFBYTtBQUFBO0FBQUEsRUFJOUMsaUJBQWlCO0FBQ3RCLFNBQUs7QUFBQSxNQUNGO0FBQUEsTUFDQSxDQUFDLFNBQVM7QUFDUCxjQUFNLE9BQU8sSUFBSSxVQUFVLE1BQU0sS0FBSyxVQUFVLEtBQUssWUFBWTtBQUNqRSxhQUFLLFlBQVk7QUFDakIsZUFBTztBQUFBLE1BQ1Y7QUFBQSxJQUNIO0FBQUEsRUFDSDtBQUFBLEVBRUEsTUFBTSxTQUFTO0FBQ1osVUFBTSxLQUFLLFFBQVE7QUFHbkIsYUFBUyxXQUFXLElBQUk7QUFHeEIsU0FBSyxhQUFhO0FBR2xCLFNBQUssV0FBVyxJQUFJLFNBQVMsSUFBSTtBQUdqQyxTQUFLLFVBQVUsSUFBSTtBQUFBLE1BQ2hCO0FBQUEsTUFDQTtBQUFBLE1BQ0EsS0FBSztBQUFBLE1BQ0wsS0FBSztBQUFBLElBQ1I7QUFDQSxTQUFLLFFBQVEsZ0JBQWdCO0FBRTdCLFNBQUssZUFBZTtBQUVwQixTQUFLLGNBQWMsSUFBSTtBQUFBLE1BQ3BCLEtBQUs7QUFBQSxNQUNMO0FBQUEsTUFDQTtBQUFBLE1BQ0EsS0FBSztBQUFBLE1BQ0wsS0FBSztBQUFBLElBQ1IsQ0FBQztBQUdELFVBQU0sYUFBYSxLQUFLO0FBQUEsTUFDckI7QUFBQSxNQUNBO0FBQUEsTUFDQSxZQUFZO0FBQ1QsY0FBTSxPQUFPLE1BQU0sU0FBUyxZQUFZO0FBQ3hDLGNBQU0sS0FBSyxTQUFTLFFBQVEsSUFBSTtBQUFBLE1BQ25DO0FBQUEsSUFDSDtBQUVBLGVBQVcsaUJBQWlCLGNBQWMsTUFBTTtBQUM3QyxZQUFNLE9BQU8sSUFBSSxzQkFBSztBQUV0QixZQUFNLGlCQUFpQixDQUFDLE9BQWUsTUFBYyxTQUFvQjtBQUN0RSxhQUFLLFFBQVEsQ0FBQyxTQUFTO0FBQ3BCLGVBQUssU0FBUyxLQUFLLEVBQ2YsUUFBUSxJQUFJLEVBQ1osUUFBUSxZQUFZO0FBQ2xCLGtCQUFNLEtBQUssU0FBUyxRQUFRLElBQUk7QUFBQSxVQUNuQyxDQUFDO0FBQUEsUUFDUCxDQUFDO0FBQUEsTUFDSjtBQUVBLHFCQUFlLGlCQUFpQixPQUFPLEtBQWtCO0FBQ3pELHFCQUFlLHFCQUFxQix3QkFBd0IsU0FBc0I7QUFDbEYscUJBQWUsbUJBQW1CLGNBQWMsT0FBb0I7QUFFcEUsWUFBTSxXQUFXLFdBQVcsc0JBQXNCO0FBQ2xELFdBQUssZUFBZTtBQUFBLFFBQ2pCLEdBQUcsU0FBUztBQUFBLFFBQ1osR0FBRyxTQUFTLE1BQU07QUFBQSxNQUNyQixDQUFDO0FBRUQsWUFBTSxtQkFBbUIsQ0FBQyxNQUFrQjtBQUN6QyxjQUFNLFNBQVMsRUFBRTtBQUNqQixjQUFNQyxXQUFXLEtBQWE7QUFDOUIsY0FBTSxhQUFhLFdBQVcsU0FBUyxNQUFNO0FBQzdDLGNBQU0sYUFBYUEsWUFBV0EsU0FBUSxTQUFTLE1BQU07QUFFckQsWUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZO0FBQzdCLGVBQUssS0FBSztBQUNWLHFCQUFXLG9CQUFvQixjQUFjLGdCQUFnQjtBQUM3RCxjQUFJQSxVQUFTO0FBQ1YsWUFBQUEsU0FBUSxvQkFBb0IsY0FBYyxnQkFBZ0I7QUFBQSxVQUM3RDtBQUFBLFFBQ0g7QUFBQSxNQUNIO0FBRUEsaUJBQVcsaUJBQWlCLGNBQWMsZ0JBQWdCO0FBQzFELFlBQU0sVUFBVyxLQUFhO0FBQzlCLFVBQUksU0FBUztBQUNWLGdCQUFRLGlCQUFpQixjQUFjLGdCQUFnQjtBQUFBLE1BQzFEO0FBQUEsSUFDSCxDQUFDO0FBRUQsbUJBQWU7QUFBQSxFQUNsQjtBQUFBLEVBRUEsTUFBYyxVQUF5QjtBQUNwQyxXQUFPLElBQUksUUFBUSxDQUFDLFlBQVk7QUFDN0IsVUFBSSxDQUFDLEtBQUssSUFBSSxXQUFXO0FBQ3RCLG1CQUFXLFNBQVMsQ0FBQztBQUFBLE1BQ3hCLE9BQU87QUFDSixnQkFBUTtBQUFBLE1BQ1g7QUFBQSxJQUNILENBQUM7QUFBQSxFQUNKO0FBQUEsRUFFUSxlQUFxQjtBQTlIaEM7QUErSE0sUUFBSTtBQUNELFlBQU0sV0FBUyxjQUFTLGdCQUFnQixTQUF6QixtQkFBK0IsY0FBYyxXQUFXLFNBQVEsT0FBTztBQUN0RixjQUFRLElBQUksMEJBQW9CLE1BQU07QUFDdEMsV0FBSyxhQUFhLFlBQVksTUFBTTtBQUFBLElBQ3ZDLFNBQVMsT0FBTztBQUNiLGNBQVEsS0FBSyx1RkFBOEU7QUFDM0YsV0FBSyxhQUFhLFlBQVksSUFBSTtBQUFBLElBQ3JDO0FBQUEsRUFDSDtBQUFBLEVBRUEsV0FBVztBQUNSLFNBQUssSUFBSSxVQUFVLG1CQUFtQixrQkFBa0I7QUFBQSxFQUMzRDtBQUNIOyIsCiAgIm5hbWVzIjogWyJpbXBvcnRfb2JzaWRpYW4iLCAidHJhbnNsYXRpb25zIiwgImltcG9ydF9vYnNpZGlhbiIsICJ0cmFuc2xhdGlvbnMiLCAiaW1wb3J0X29ic2lkaWFuIiwgInRyYW5zbGF0aW9ucyIsICJsZWFmIiwgIm1lbnVEb20iXQp9Cg==
