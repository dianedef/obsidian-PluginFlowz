import { App } from 'obsidian';
import ObsidianBoilerplate from '../src/main';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { DEFAULT_SETTINGS } from '../src/core/types/settings';
import { getTranslation } from '../src/i18n/translations';
import { EventName } from '../src/core/types/events';

// Mock SettingsTab
vi.mock('../src/ui/SettingsTab', () => ({
    SettingsTab: vi.fn().mockImplementation(function(app, plugin) {
        this.app = app;
        this.plugin = plugin;
        this.display = vi.fn();
        return this;
    })
}));

// Mock Plugin
vi.mock('obsidian', () => {
    const mockApp = {
        workspace: {
            on: vi.fn(),
            trigger: vi.fn()
        }
    };

    const MockPlugin = vi.fn().mockImplementation(function(app, manifest) {
        this.app = app;
        this.manifest = manifest;
        this.loadData = vi.fn().mockResolvedValue({});
        this.saveData = vi.fn().mockResolvedValue(undefined);
        this.addSettingTab = vi.fn();
    });

    return {
        App: vi.fn(() => mockApp),
        Plugin: MockPlugin,
        Notice: vi.fn(),
        PluginSettingTab: vi.fn()
    };
});

// Mock EventBusService
vi.mock('../src/core/services/EventBusService', () => {
    const mockEventBus = {
        on: vi.fn(),
        emit: vi.fn(),
        getInstance: vi.fn()
    };
    return {
        EventBusService: {
            getInstance: () => mockEventBus
        }
    };
});

describe('ObsidianBoilerplate Plugin', () => {
    const manifest = { version: '1.0.0' };
    let app: App;
    let plugin: ObsidianBoilerplate;

    beforeEach(() => {
        app = new App();
        plugin = new ObsidianBoilerplate(app, manifest);
    });

    describe('Settings Management', () => {
        it('should load default settings', async () => {
            expect(plugin.settings).toEqual(DEFAULT_SETTINGS);
        });

        it('should save settings', async () => {
            const newSettings = { 
                ...DEFAULT_SETTINGS, 
                enableFeature: true,
                advanced: { customOption: 'test' }
            };
            plugin.settings = newSettings;
            await plugin.saveSettings();
            expect(plugin.saveData).toHaveBeenCalledWith(newSettings);
        });
    });

    describe('Translation System', () => {
        it('should return correct translation for existing key', () => {
            const translation = getTranslation('settings.title');
            expect(translation).not.toBe('settings.title');
            expect(typeof translation).toBe('string');
        });

        it('should return key for non-existing translation', () => {
            const nonExistingKey = 'nonexistent.key';
            const translation = getTranslation(nonExistingKey);
            expect(translation).toBe(nonExistingKey);
        });

        it('should handle nested translation keys correctly', () => {
            const translation = getTranslation('settings.advanced');
            expect(translation).not.toBe('settings.advanced');
            expect(typeof translation).toBe('string');
        });
    });

    describe('Event Handling', () => {
        it('should emit settings updated event on load', async () => {
            await plugin.loadSettings();
            expect(plugin.eventBus.emit).toHaveBeenCalledWith(
                EventName.SETTINGS_UPDATED,
                { settings: DEFAULT_SETTINGS }
            );
        });

        it('should emit settings events on save', async () => {
            await plugin.saveSettings();
            expect(plugin.eventBus.emit).toHaveBeenCalledWith(
                EventName.SETTINGS_UPDATED,
                { settings: plugin.settings }
            );
            expect(plugin.eventBus.emit).toHaveBeenCalledWith(
                EventName.SETTINGS_SAVED
            );
        });
    });
}); 