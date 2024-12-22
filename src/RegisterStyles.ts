export function registerStyles() {
const styleEl = document.createElement('style');
styleEl.id = 'pluginflowz-styles';
styleEl.textContent = `

    /* ===== Header & Navigation ===== */
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

    /* ===== Messages & Notifications ===== */
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

    /* ===== Notes Display ===== */
    .pluginflowz-note-content {
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

    .pluginflowz-modal-content {
        height: 100%;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        overflow-y: auto;
    }

    .pluginflowz-modal-button-container {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
    }

    .pluginflowz-modal-close-button::before {
        content: none;
    }

    .pluginflowz-modal-close-button {
        position: absolute;
        top: 8px;
        right: 8px;
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text-muted);
        font-size: 1.6em;
        line-height: 1;
        padding: 4px;
        border-radius: 4px;
    }

    .pluginflowz-modal-close-button:hover {
        color: var(--text-error);
        background: var(--background-modifier-error);
    }

    /* ===== Form Elements ===== */
    .pluginflowz-modal input {
        width: 100%;
        padding: 8px;
        border: 1px solid var(--background-modifier-border);
        border-radius: 4px;
        background-color: var(--background-primary);
        color: var(--text-normal);
    }

    .pluginflowz-modal button {
        padding: 6px 12px;
        border-radius: 4px;
        border: 1px solid var(--background-modifier-border);
        background-color: var(--background-primary);
        color: var(--text-normal);
        cursor: pointer;
    }

    .pluginflowz-modal button.mod-cta {
        background-color: var(--interactive-accent);
        color: var(--text-on-accent);
        border: none;
    }

    /* ===== Layout & Container ===== */
    .pluginflowz-dashboard-container {
        padding: 20px;
        flex: 1;
        overflow-y: auto;
    }

    /* En mode popup */
    .pluginflowz-modal-container .pluginflowz-dashboard-container {
        height: 100%;
    }

    /* En mode tab/sidebar */
    .pluginflowz-workspace-leaf-content[data-type="pluginflowz-view"] .pluginflowz-dashboard-container {
        height: 100%;
    }

    /* ===== Search Input ===== */
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

    /* ===== Plugin Item Structure ===== */
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

    /* ===== Plugin Description ===== */
    .pluginflowz-plugin-description {
        color: var(--text-muted);
        font-size: 14px;
        margin: 8px 0;
    }

    /* ===== Cards Grid Layout ===== */
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

    /* ===== Card Structure ===== */
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

    /* ===== Header Settings ===== */
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

    /* ===== View Button ===== */
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

    /* ===== Progress Container ===== */
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

    .pluginflowz-progress-container {
        flex: 1;
        height: 4px;
        background-color: var(--background-modifier-border);
        border-radius: 2px;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .pluginflowz-progress-container:hover {
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
    .pluginflowz-tri-state-toggle {
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

    .pluginflowz-tri-state-slider {
        position: absolute;
        width: 24px;
        height: 24px;
        background-color: var(--background-modifier-border-hover);
        border-radius: 12px;
        transition: transform 0.2s ease;
    }

    .pluginflowz-tri-state-slider.left {
        transform: translateX(0);
        background-color: var(--background-modifier-error);
    }

    .pluginflowz-tri-state-slider.middle {
        transform: translateX(28px);
        background-color: var(--interactive-accent);
    }

    .pluginflowz-tri-state-slider.right {
        transform: translateX(56px);
        background-color: var(--background-modifier-success);
    }

    .pluginflowz-tri-state-position {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;
        cursor: pointer;
        color: var(--text-muted);
        transition: color 0.2s ease;
    }

    .pluginflowz-tri-state-position:hover {
        color: var(--text-normal);
    }

    .pluginflowz-tri-state-icon {
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .pluginflowz-tri-state-toggle:hover .pluginflowz-tri-state-slider.left {
        background-color: var(--background-modifier-error-hover);
    }

    .pluginflowz-tri-state-toggle:hover .pluginflowz-tri-state-slider.middle {
        background-color: var(--interactive-accent-hover);
    }

    .pluginflowz-tri-state-toggle:hover .pluginflowz-tri-state-slider.right {
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

    .pluginflowz-spinner {
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

    .pluginflowz-more-vertical {
        font-size: 18px;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;
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
        width: 40px;
        height: 24px;
        border-radius: 12px;
        background-color: var(--background-modifier-border);
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
        padding: 2px;
        display: flex;
        align-items: center;
    }

    .pluginflowz-toggle-button.active {
        background-color: var(--interactive-accent);
    }

    .pluginflowz-toggle-slider {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 20px;
        height: 20px;
        background-color: var(--background-primary);
        border-radius: 50%;
        transition: transform 0.3s ease;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .pluginflowz-toggle-button.active .pluginflowz-toggle-slider {
        transform: translateX(16px);
    }

    .pluginflowz-toggle-button:hover {
        opacity: 0.85;
    }

    .pluginflowz-toggle-button:hover .pluginflowz-toggle-slider {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    /* ===== Options Menu ===== */
    .pluginflowz-options-menu {
        position: fixed;
        background-color: var(--background-primary);
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        min-width: 200px;
        z-index: 9999;
        padding: 8px;
    }

    .pluginflowz-options-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .pluginflowz-option-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        border: none;
        background: none;
        width: 100%;
        text-align: left;
        cursor: pointer;
        color: var(--text-normal);
        border-radius: 4px;
        font-size: 14px;
        transition: all 0.15s ease;
    }

    .pluginflowz-option-item:hover {
        background-color: var(--background-secondary);
    }

    .pluginflowz-option-item.danger {
        color: var(--text-error);
    }

    .pluginflowz-option-item.danger:hover {
        background-color: var(--background-modifier-error);
        color: var(--text-on-accent);
    }

    .pluginflowz-option-separator {
        height: 1px;
        background-color: var(--background-modifier-border);
        margin: 4px 0;
    }

    .pluginflowz-option-icon {
        font-size: 1.2em;
        width: 24px;
        text-align: center;
    }

    /* ===== Checkbox Controls ===== */
    .pluginflowz-checkbox-container {
        cursor: pointer;
    }
    
    .pluginflowz-checkbox-container input[type="checkbox"] {
        cursor: pointer;
    }

    /* ===== Settings Button ===== */
    .pluginflowz-extra-setting-button {
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.2s ease;
    }

    .pluginflowz-extra-setting-button:hover {
        opacity: 1;
    }

    /* ===== Rating Control ===== */
    .pluginflowz-rating-control {
        position: relative;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .pluginflowz-stars {
        display: flex;
        flex-direction: row-reverse;
        gap: 2px;
        z-index: 1;
    }

    .pluginflowz-star {
        cursor: pointer;
        color: var(--text-muted);
        transition: all 0.2s ease;
        font-size: 16px;
    }

    .pluginflowz-star:hover,
    .pluginflowz-star:hover ~ .pluginflowz-star {
        transform: scale(1.2);
        color: var(--text-accent);
    }

    .pluginflowz-star.filled {
        color: var(--text-accent);
    }

    .pluginflowz-reset {
        position: relative;
        cursor: pointer;
        color: var(--text-muted);
        font-size: 1.2em;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        margin-right: 4px;
        z-index: 2;
    }

    .pluginflowz-reset:hover {
        color: var(--text-error);
        transform: scale(1.2);
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