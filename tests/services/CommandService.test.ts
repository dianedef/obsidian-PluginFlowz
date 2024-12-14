import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CommandService } from '../../src/core/services/CommandService';
import { EventName } from '../../src/core/types/events';
import { Plugin } from 'obsidian';

describe('CommandService', () => {
    let service: CommandService;
    let mockPlugin: Plugin;
    let mockEventBus: any;
    let mockErrorService: any;

    beforeEach(() => {
        // Reset les mocks
        vi.clearAllMocks();
        
        // Mock du plugin Obsidian
        mockPlugin = {
            addCommand: vi.fn().mockReturnValue({ id: 'test-command' }),
        } as unknown as Plugin;

        // Réinitialiser l'instance
        // @ts-ignore - Accès à la propriété privée pour les tests
        CommandService.instance = undefined;
        
        service = CommandService.getInstance(mockPlugin);
        mockEventBus = service['eventBus'];
        mockErrorService = service['errorService'];
    });

    describe('Initialization', () => {
        it('should be a singleton', () => {
            const instance1 = CommandService.getInstance(mockPlugin);
            const instance2 = CommandService.getInstance(mockPlugin);
            expect(instance1).toBe(instance2);
        });

        it('should throw error if initialized without plugin', () => {
            // @ts-ignore - Accès à la propriété privée pour les tests
            CommandService.instance = undefined;
            expect(() => CommandService.getInstance()).toThrow('Plugin instance required');
        });

        it('should register default commands on init', () => {
            expect(mockPlugin.addCommand).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: 'toggle-feature'
                })
            );
        });
    });

    describe('Command Registration', () => {
        it('should register new command', () => {
            const command = {
                id: 'test-command',
                name: 'Test Command',
                callback: vi.fn()
            };

            service.registerCommand(command);

            expect(mockPlugin.addCommand).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: command.id,
                    name: command.name
                })
            );
        });

        it('should not register duplicate command', () => {
            const command = {
                id: 'test-command',
                name: 'Test Command',
                callback: vi.fn()
            };

            service.registerCommand(command);
            service.registerCommand(command);

            expect(mockPlugin.addCommand).toHaveBeenCalledTimes(2); // Une fois pour init() et une fois pour notre test
        });

        it('should handle command with hotkeys', () => {
            const command = {
                id: 'test-command',
                name: 'Test Command',
                hotkeys: [{ modifiers: ['Mod', 'Shift'], key: 'T' }],
                callback: vi.fn()
            };

            service.registerCommand(command);

            expect(mockPlugin.addCommand).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: command.id,
                    hotkeys: command.hotkeys
                })
            );
        });
    });

    describe('Command Execution', () => {
        it('should execute command callback', () => {
            const callback = vi.fn();
            const command = {
                id: 'test-command',
                name: 'Test Command',
                callback
            };

            service.registerCommand(command);

            // Récupérer le callback enregistré et l'exécuter
            const registeredCommand = mockPlugin.addCommand.mock.calls[1][0];
            registeredCommand.callback();

            expect(callback).toHaveBeenCalled();
        });

        it('should handle command execution error', () => {
            const error = new Error('Test error');
            const callback = vi.fn().mockImplementation(() => {
                throw error;
            });

            const command = {
                id: 'test-command',
                name: 'Test Command',
                callback
            };

            service.registerCommand(command);

            // Récupérer le callback enregistré et l'exécuter
            const registeredCommand = mockPlugin.addCommand.mock.calls[1][0];
            registeredCommand.callback();

            expect(mockErrorService.handleError).toHaveBeenCalledWith({
                type: 'command',
                message: expect.any(String),
                originalError: error
            });
        });
    });

    describe('Command Management', () => {
        it('should unregister command', () => {
            const command = {
                id: 'test-command',
                name: 'Test Command',
                callback: vi.fn()
            };

            service.registerCommand(command);
            service.unregisterCommand(command.id);

            // Vérifier que la commande n'est plus dans la Map
            expect(service['commands'].has(command.id)).toBe(false);
        });

        it('should clear all commands', () => {
            const commands = [
                { id: 'cmd1', name: 'Command 1', callback: vi.fn() },
                { id: 'cmd2', name: 'Command 2', callback: vi.fn() }
            ];

            commands.forEach(cmd => service.registerCommand(cmd));
            service.clearCommands();

            expect(service['commands'].size).toBe(0);
        });
    });

    describe('Feature Toggle Command', () => {
        it('should emit toggle event', () => {
            // Récupérer le callback de la commande toggle-feature
            const toggleCommand = mockPlugin.addCommand.mock.calls[0][0];
            toggleCommand.callback();

            expect(mockEventBus.emit).toHaveBeenCalledWith(EventName.TOGGLE_FEATURE);
        });

        it('should handle toggle error', () => {
            const error = new Error('Toggle error');
            mockEventBus.emit.mockImplementationOnce(() => {
                throw error;
            });

            // Récupérer le callback de la commande toggle-feature
            const toggleCommand = mockPlugin.addCommand.mock.calls[0][0];
            toggleCommand.callback();

            expect(mockErrorService.handleError).toHaveBeenCalledWith({
                type: 'command',
                message: expect.any(String),
                originalError: error
            });
        });
    });
}); 