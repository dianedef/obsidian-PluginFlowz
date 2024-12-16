export function registerStyles() {
const styleEl = document.createElement('style');
styleEl.id = 'MYPLUGIN-styles';
styleEl.textContent = `
    /* ===== CSS ===== */
    .modal {
        width: 90vw;
        height: 90vh;
        max-width: 90vw;
        max-height: 90vh;
    }

    .modal-content {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .dashboard-container {
        padding: 20px;
        flex: 1;
        overflow-y: auto;
    }

    .plugins-list {
        display: grid;
        gap: 20px;
        padding: 20px 0;
    }

    .plugin-item {
        background: var(--background-secondary);
        padding: 15px;
        border-radius: 5px;
    } 
`;

document.head.appendChild(styleEl);
}

export function unregisterStyles() {
const styleEl = document.getElementById('youtube-player-styles');
if (styleEl) {
    styleEl.remove();
}
} 