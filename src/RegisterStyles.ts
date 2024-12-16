export function registerStyles() {
const styleEl = document.createElement('style');
styleEl.id = 'pluginflowz-styles';
styleEl.textContent = `
    /* ===== CSS ===== */
    .pluginflowz-modal {
        width: 90vw;
        height: 90vh;
        max-width: 90vw;
        max-height: 90vh;
    }

    .pluginflowz-modal .modal-bg {
        background-color: rgba(0, 0, 0, 0.5);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100vw;
        height: 100vh;
    }

    .pluginflowz-modal-content {
        height: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
        z-index: 1;
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