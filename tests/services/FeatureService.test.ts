import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FeatureService } from '../../src/core/services/FeatureService';
import { EventName } from '../../src/core/types/events';

describe('FeatureService', () => {
    let service: FeatureService;
    let mockEventBus: any;
    let mockErrorService: any;

    beforeEach(() => {
        // Reset les mocks
        vi.clearAllMocks();
        
        // Réinitialiser l'instance
        // @ts-ignore - Accès à la propriété privée pour les tests
        FeatureService.instance = undefined;
        
        service = FeatureService.getInstance();
        mockEventBus = service['eventBus'];
        mockErrorService = service['errorService'];
    });

    it('should be a singleton', () => {
        const instance1 = FeatureService.getInstance();
        const instance2 = FeatureService.getInstance();
        expect(instance1).toBe(instance2);
    });

    it('should initialize with feature disabled', () => {
        expect(service.isEnabled()).toBe(false);
    });

    it('should handle settings update', () => {
        service['handleSettingsUpdate']({ enableFeature: true, advanced: {} });
        expect(service.isEnabled()).toBe(true);
    });

    it('should handle feature enable without error', () => {
        service['enable']();
        expect(mockErrorService.handleError).not.toHaveBeenCalled();
    });

    it('should handle feature disable without error', () => {
        service['disable']();
        expect(mockErrorService.handleError).not.toHaveBeenCalled();
    });

    it('should handle errors when enabling feature', () => {
        const error = new Error('Test error');
        vi.spyOn(service as any, 'enable').mockImplementationOnce(() => {
            throw error;
        });

        service['handleSettingsUpdate']({ enableFeature: true, advanced: {} });

        expect(mockErrorService.handleError).toHaveBeenCalledWith({
            type: 'feature',
            message: 'Failed to enable feature',
            originalError: error
        });
    });

    it('should handle errors when disabling feature', () => {
        const error = new Error('Test error');
        vi.spyOn(service as any, 'disable').mockImplementationOnce(() => {
            throw error;
        });

        service['handleSettingsUpdate']({ enableFeature: false, advanced: {} });

        expect(mockErrorService.handleError).toHaveBeenCalledWith({
            type: 'feature',
            message: 'Failed to disable feature',
            originalError: error
        });
    });
}); 