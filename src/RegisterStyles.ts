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
        padding: 8px 0;
    }

    /* Progress Bar */
    .progress-container {
        flex: 1;
        padding: 2px 0;
        cursor: pointer;
    }

    /* Cibler la barre de progression elle-même */
    .progress-container > div {  /* Le conteneur créé par Obsidian */
        height: 8px !important;
        background-color: var(--background-modifier-border) !important;
        border-radius: 4px !important;
        overflow: hidden !important;
    }

    /* Cibler la partie remplie */
    .progress-container > div > div {  /* La barre de progression */
        background-color: var(--interactive-accent) !important;
        height: 100% !important;
        border-radius: 4px !important;
        transition: all 0.2s ease !important;
    }

    .progress-container:hover > div {
        height: 10px !important;
        background-color: var(--background-modifier-border-hover) !important;
    }

    .pluginflowz-card-rating {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 0;
    }

    .pluginflowz-rating-text {
        font-size: 14px;
        color: var(--text-muted);
    }

    .pluginflowz-rating-value {
        min-width: 45px;
        text-align: right;
        font-size: 14px;
        color: var(--text-muted);
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