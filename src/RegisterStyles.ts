export function registerStyles() {
const styleEl = document.createElement('style');
styleEl.id = 'pluginflowz-styles';
styleEl.textContent = `
    /* ===== CSS ===== */
    .modal-container.pluginflowz-modal {
        padding: 150px;
    }

    .modal-container.pluginflowz-modal .modal {
        width: calc(100vw - 500px);
        height: calc(100vh - 100px);
        max-width: calc(100vw - 500px);
        max-height: calc(100vh - 100px);
    }

    .modal-container.pluginflowz-modal .modal-bg {
        background-color: rgba(0, 0, 0, 0.5);
    }

    .modal-container.pluginflowz-modal .modal-content {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .pluginflowz-dashboard-container {
        padding: 20px;
        flex: 1;
        overflow-y: auto;
    }

    .pluginflowz-plugins-list {
        display: grid;
        gap: 20px;
        padding: 20px 0;
    }

    .pluginflowz-plugin-item {
        background: var(--background-secondary);
        padding: 15px;
        border-radius: 5px;
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