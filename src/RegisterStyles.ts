export function registerStyles() {
const styleEl = document.createElement('style');
styleEl.id = 'pluginflowz-styles';
styleEl.textContent = `

    .pluginflowz-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    }

    .pluginflowz-header-buttons {
    display: flex;
    gap: 0.5rem;
    }

    .pluginflowz-view-button {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    }

    /* ===== No Plugins ===== */
    .pluginflowz-no-plugins,
    .pluginflowz-no-results {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    text-align: center;
    padding: 2rem;
    color: var(--text-muted);
    width: 100%;
    }

    .pluginflowz-plugin-note {
        margin-top: 1rem;
        padding: 1rem;
        background-color: var(--background-secondary);
        border-radius: 4px;
        margin-left: 1rem;
    }

    .note-content {
        font-size: 0.9em;
        line-height: 1.4;
        white-space: pre-wrap;
    }

    .pluginflowz-card-note {
        margin-top: 1rem;
        padding: 1rem;
        background-color: var(--background-secondary);
        border-radius: 4px;
    }

    .note-content {
        font-size: 0.9em;
        line-height: 1.4;
        white-space: pre-wrap;
    }

    /* ===== Modal ===== */

    .pluginflowz-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .pluginflowz-modal .modal {
        width: calc(100vw - 200px);
        height: calc(100vh - 100px);
        max-width: calc(100vw - 200px);
        max-height: calc(100vh - 100px);
        background-color: var(--background-primary);
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .pluginflowz-modal .modal-content {
        height: 100%;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        overflow-y: auto;
    }

    .modal-button-container {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
    }

    /* ===== Form Elements ===== */
    .modal input {
        width: 100%;
        padding: 8px;
        border: 1px solid var(--background-modifier-border);
        border-radius: 4px;
        background-color: var(--background-primary);
        color: var(--text-normal);
    }

    .modal button {
        padding: 6px 12px;
        border-radius: 4px;
        border: 1px solid var(--background-modifier-border);
        background-color: var(--background-primary);
        color: var(--text-normal);
        cursor: pointer;
    }

    .modal button.mod-cta {
        background-color: var(--interactive-accent);
        color: var(--text-on-accent);
        border: none;
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

    /* Nouvelle structure de la vue liste */
    .pluginflowz-plugin-top-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
    }

    .pluginflowz-plugin-left {
        flex: 1;
    }

    .pluginflowz-plugin-left h4 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
    }

    .pluginflowz-plugin-right .setting-item {
        border: none;
        padding: 0;
    }

    .pluginflowz-plugin-bottom-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
    }

    .pluginflowz-plugin-bottom-row .pluginflowz-plugin-tags {
        display: flex;
        gap: 4px;
        flex-wrap: wrap;
        justify-content: flex-end;
    }

    .pluginflowz-plugin-description {
        color: var(--text-muted);
        font-size: 14px;
        margin: 8px 0;
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
        transform: scale(1.1);
        color: var(--interactive-accent);
    }

    /* ===== Tags ===== */
    .pluginflowz-tag {
        display: inline-flex;
        align-items: center;
        font-weight: 500;
        padding: 4px 12px;
        margin: 2px;
        border-radius: 16px;
        font-size: 13px;
        background-color: var(--background-modifier-border);
        color: var(--text-normal);
        transition: all 0.2s ease;
    }

    .pluginflowz-tag-removable {
        cursor: pointer;
        padding-right: 4px;
    }

    .pluginflowz-tag-removable:hover {
        background-color: var(--background-modifier-error-hover);
        color: var(--text-on-accent);
    }

    .pluginflowz-tag-remove {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 14px;
        line-height: 1;
        transition: all 0.2s ease;
    }

    .pluginflowz-tag:hover,
    .pluginflowz-tag.selected {
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    }

    /* Status Tags - Common styles */
    .pluginflowz-tag-status,
    .pluginflowz-filter-tag.pluginflowz-tag-status {
        font-weight: 600;
        letter-spacing: 0.3px;
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 0.8em;
        cursor: pointer;
        transition: all 0.2s ease;
    }
        
    .pluginflowz-tag-status.exploring,
    .pluginflowz-filter-tag.pluginflowz-tag-status.exploring {
        background-color: var(--interactive-accent);
        color: var(--text-on-accent);
        opacity: 0.75;
    }

    .pluginflowz-tag-status.active,
    .pluginflowz-filter-tag.pluginflowz-tag-status.active {
        background-color: var(--background-modifier-success);
        color: var(--text-on-accent);
        opacity: 0.75;
    }

    .pluginflowz-tag-status.inactive,
    .pluginflowz-filter-tag.pluginflowz-tag-status.inactive {
        background-color: var(--background-modifier-error);
        color: var(--text-on-accent);
        opacity: 0.75;
    }

    .pluginflowz-tag-status.ignoring,
    .pluginflowz-filter-tag.pluginflowz-tag-status.ignoring {
        background-color: var(--background-modifier-border);
        color: var(--text-muted);
        opacity: 0.9;
    }

    .pluginflowz-tag-status:hover,
    .pluginflowz-tag-status.selected,
    .pluginflowz-filter-tag.pluginflowz-tag-status:hover,
    .pluginflowz-filter-tag.pluginflowz-tag-status.selected {
        opacity: 1;
        transform: translateY(-1px) scale(1.05);
    }

    /* Filter Tags Container */
    .pluginflowz-filter-tags,
    .pluginflowz-filter-status,
    .pluginflowz-filter-groups {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        padding: 4px;
        align-items: center;
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

    .pluginflowz-tag-status:hover,
    .pluginflowz-tag-status.selected {
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

    .pluginflowz-loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(var(--background-primary-rgb), 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 100;
    }

    .pluginflowz-loading-spinner {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        color: var(--text-accent);
    }

    .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid var(--background-modifier-border);
        border-top: 4px solid var(--text-accent);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .pluginflowz-no-plugins {
        text-align: center;
        color: var(--text-muted);
        padding: 32px;
    }

    .pluginflowz-search-input:disabled,
    .pluginflowz-view-button:disabled,
    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    /* ===== Card Actions ===== */
    .pluginflowz-card-actions {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .pluginflowz-more-button {
        background: none;
        border: none;
        padding: 4px;
        cursor: pointer;
        color: var(--text-muted);
        transition: color 0.2s ease;
    }

    .pluginflowz-more-button:hover {
        color: var(--text-normal);
    }

    .more-vertical {
        font-size: 18px;
        line-height: 1;
    }

    .pluginflowz-add-tag {
        background: none;
        border: 1px solid var(--background-modifier-border);
        border-radius: 16px;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: var(--text-muted);
        transition: all 0.2s ease;
    }

    .pluginflowz-add-tag:hover {
        background-color: var(--background-modifier-hover);
        color: var(--text-normal);
    }

    /* ===== Plugin List Item ===== */
    .pluginflowz-plugin-rating {
        margin-top: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .pluginflowz-plugin-status-container {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    /* ===== Toggle Button ===== */
    .pluginflowz-toggle-button {
        position: relative;
        width: 36px;
        height: 20px;
        border-radius: 10px;
        background-color: var(--background-modifier-border);
        border: none;
        cursor: pointer;
        transition: background-color 0.3s ease;
        padding: 2px;
    }

    .pluginflowz-toggle-button.active {
        background-color: var(--interactive-accent);
    }

    .toggle-slider {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 16px;
        height: 16px;
        background-color: var(--background-primary);
        border-radius: 50%;
        transition: transform 0.3s ease;
    }

    .active .toggle-slider {
        transform: translateX(16px);
    }

    /* ===== Rating Control ===== */
    .rating-control {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .stars {
        display: flex;
        gap: 2px;
    }

    .star {
        cursor: pointer;
        color: var(--text-muted);
        transition: color 0.2s ease;
    }

    .star.filled {
        color: var(--text-accent);
    }

    .reset {
        cursor: pointer;
        color: var(--text-muted);
        font-size: 0.8em;
    }

    .reset:hover {
        color: var(--text-normal);
    }

    /* ===== Options Menu ===== */
    .pluginflowz-options-menu {
        position: absolute;
        background-color: var(--background-primary);
        border: 1px solid var(--background-modifier-border);
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        min-width: 200px;
    }

    .pluginflowz-options-list {
        display: flex;
        flex-direction: column;
        padding: 4px;
    }

    .pluginflowz-option-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        border: none;
        background: none;
        width: 100%;
        text-align: left;
        cursor: pointer;
        color: var(--text-normal);
        border-radius: 4px;
    }

    .pluginflowz-option-item:hover {
        background-color: var(--background-modifier-hover);
    }

    .pluginflowz-option-item.danger {
        color: var(--text-error);
    }

    .pluginflowz-option-item.danger:hover {
        background-color: var(--background-modifier-error);
    }

    .pluginflowz-option-separator {
        height: 1px;
        background-color: var(--background-modifier-border);
        margin: 4px 0;
    }

    .option-icon {
        font-size: 1.2em;
        width: 24px;
        text-align: center;
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