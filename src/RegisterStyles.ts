export function registerStyles() {
const styleEl = document.createElement('style');
styleEl.id = 'pluginflowz-styles';
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
        display: grid;
        grid-template-columns: auto 1fr auto;
        gap: 20px;
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
        transition: all 0.2s ease;
    }

    .progress-container:hover {
        height: 8px;
        background-color: var(--background-modifier-border-hover);
    }

    .progress-bar {
        height: 100%;
        background-color: var(--interactive-accent);
        transition: all 0.2s ease;
    }

    .progress-container:hover .progress-bar {
        background-color: var(--interactive-accent-hover);
    }

    .pluginflowz-rating-value {
        font-size: 12px;
        color: var(--text-muted);
        min-width: 32px;
        text-align: right;
    }

    .pluginflowz-rating-text:hover,
    .pluginflowz-rating-value:hover {
        opacity: 0.8;
    }

    .pluginflowz-tag {
        display: inline-flex;
        align-items: center;
        font-weight: 600;
        gap: 4px;
        padding: 2px 8px;
        background-color: var(--interactive-accent);
        color: var(--text-on-accent);
        border-radius: 12px;
        font-size: 12px;
        transition: all 0.2s ease;
        cursor: pointer;
    }

    .pluginflowz-tag:hover {
        background-color: var(--interactive-accent-hover);
    }

    .pluginflowz-tag-remove {
        cursor: pointer;
        opacity: 0.7;
        font-size: 14px;
        margin-left: 4px;
        color: inherit;
    }


    .pluginflowz-tag-status {
        background-color: var(--interactive-hover);
        color: var(--text-normal);
    }
        
    .pluginflowz-tag-status.exploring {
        background-color: var(--interactive-accent-hover);
        opacity: 0.6;
    }

    .pluginflowz-tag-status.active {
        background-color: var(--background-modifier-success);
        opacity: 0.6;
    }

    .pluginflowz-tag-status.inactive {
        background-color: var(--background-modifier-error);
        opacity: 0.6;
    }
    .pluginflowz-tag-status.ignoring {
        background-color: var(--background-modifier-border);
        opacity: 0.6;
    }

    .pluginflowz-search {
        max-width: 400px;
        margin: 0 auto;
        width: 100%;
    }
`;

document.head.appendChild(styleEl);
}

export function unregisterStyles() {
const styleEl = document.getElementById('pluginflowz-styles');
if (styleEl) {
    styleEl.remove();
}
} 