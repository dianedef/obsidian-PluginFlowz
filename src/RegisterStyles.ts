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
        grid-template-columns: 1fr auto;
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
        width: auto;
        white-space: nowrap;
    }

    .pluginflowz-view-button:hover {
        background-color: var(--interactive-accent-hover);
    }

    .pluginflowz-rating-container,
    .pluginflowz-card-rating {
        margin-top: 10px;
    }

    /* ===== Card Header ===== */

    .pluginflowz-card-header .setting-item-control {
        cursor: pointer;
    }

    /* Style pour la checkbox */
    .checkbox-container {
        cursor: pointer;
    }
    
    .checkbox-container input[type="checkbox"] {
        cursor: pointer;
    }

    /* Style pour le bouton de paramètres supplémentaires */
    .extra-setting-button {
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.2s ease;
    }

    .extra-setting-button:hover {
        opacity: 1;
    }

    /* ===== Rating ===== */
    
    .pluginflowz-rating-container .setting-item,
    .pluginflowz-card-rating .setting-item {
        border: none;
        padding: 0;
    }

    .pluginflowz-card-rating .setting-item-name {
        font-size: 16px;
        padding: 0;
    }

    .pluginflowz-card-header .setting-item {
        border: none;
        padding: 0;
    }

    /* Ajout du style pour le toggle */
    .pluginflowz-card-header .setting-item-control {
        cursor: pointer;
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
        padding: 8px 0;
        margin: -8px 0;
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

    .pluginflowz-rating-value {
        font-size: 14px;
        color: var(--text-muted);
        min-width: 32px;
        text-align: right;
    }

    .pluginflowz-rating-text,
    .pluginflowz-rating-value {
        transition: all 0.2s ease;
        font-size: 16px;
        cursor: pointer;
    }

    .pluginflowz-rating-text:hover,
    .pluginflowz-rating-value:hover {
        transform: scale(1.4);
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
        color: white;
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
        opacity: 0.8;
    }

    .pluginflowz-search {
        width: 100%;
        max-width: 400px;
        margin: 0 auto;
    }

    .pluginflowz-search-input {
        width: 100%;
        height: 32px;
        padding: 4px 12px;
        border-radius: 16px;
        border: 1px solid var(--background-modifier-border);
        background-color: var(--background-primary);
        color: var(--text-normal);
        font-size: 14px;
        transition: all 0.2s ease;
    }

    .pluginflowz-search-input:focus {
        outline: none;
        border-color: var(--interactive-accent);
        box-shadow: 0 0 0 2px var(--background-modifier-border-hover);
    }

    .pluginflowz-search-input::placeholder {
        color: var(--text-muted);
    }

    .pluginflowz-filters {
        display: flex;
        justify-content: space-between;
        padding: 0 20px;
        margin-bottom: 20px;
        gap: 20px;
        align-items: center;
    }

    .pluginflowz-filter-groups,
    .pluginflowz-filter-status,
    .pluginflowz-filter-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
    }

    .pluginflowz-filter-status {
        flex: 0 0 auto;
    }

    .pluginflowz-filter-tag {
        opacity: 0.6;
        cursor: pointer;
    }

    .pluginflowz-filter-tag.active {
        opacity: 1;
        background-color: var(--interactive-accent);
        color: var(--text-on-accent);
    }

    .pluginflowz-filter-all,
    .pluginflowz-filter-none {
        opacity: 1;
    }

    .pluginflowz-filter-all {
        background-color: var(--background-modifier-success-hover);
    }

    .pluginflowz-filter-none {
        background-color: var(--background-modifier-error-hover);
    }

    .pluginflowz-rating-text,
    .pluginflowz-rating-value,
    .pluginflowz-tag-status {
        transition: all 0.2s ease;
    }

    .pluginflowz-rating-text:hover,
    .pluginflowz-rating-value:hover {
        transform: scale(1.1);
        color: var(--interactive-accent);
    }

    .pluginflowz-tag-status:hover {
        transform: scale(1.1);
        opacity: 1 !important;
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
    }


    /* ===== Plugin Header ===== */
    .pluginflowz-plugin-header,
    .pluginflowz-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
    }

    .pluginflowz-plugin-header .setting-item,
    .pluginflowz-card-header .setting-item {
        border: none;
        padding: 0;
    }

    .pluginflowz-tag-removable:hover {
        background-color: var(--background-modifier-error-hover);
        cursor: pointer;
    }

    .pluginflowz-filter-separator {
        width: 1px;
        height: 20px;
        background-color: var(--background-modifier-border);
        margin: 0 8px;
    }

    .pluginflowz-card-status-container {
        margin: 4px 0;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    /* ===== Tri-State Toggle ===== */
    .tri-state-toggle {
        position: relative;
        width: 80px;
        height: 28px;
        background-color: var(--background-modifier-border);
        border-radius: 14px;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        padding: 2px;
    }

    .tri-state-slider {
        position: absolute;
        width: 24px;
        height: 24px;
        background-color: var(--background-modifier-border-hover);
        border-radius: 12px;
        transition: transform 0.2s ease;
    }

    .tri-state-slider.left {
        transform: translateX(0);
        background-color: var(--background-modifier-error);
    }

    .tri-state-slider.middle {
        transform: translateX(28px);
        background-color: var(--background-modifier-border-hover);
    }

    .tri-state-slider.right {
        transform: translateX(56px);
        background-color: var(--background-modifier-success);
    }

    .tri-state-position {
        width: 24px;
        height: 24px;
        z-index: 1;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-muted);
        transition: color 0.2s ease;
    }

    .tri-state-position:hover {
        color: var(--text-normal);
    }

    .tri-state-icon {
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .tri-state-toggle:hover .tri-state-slider {
        background-color: var(--interactive-accent-hover);
    }

    .tri-state-toggle:hover .tri-state-slider.left {
        background-color: var(--background-modifier-error-hover);
    }

    .tri-state-toggle:hover .tri-state-slider.right {
        background-color: var(--background-modifier-success-hover);
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