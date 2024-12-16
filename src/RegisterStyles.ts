export function registerStyles() {
const styleEl = document.createElement('style');
styleEl.id = 'MYPLUGIN-styles';
styleEl.textContent = `
    /* ===== CSS ===== */
    .dashboard-container {
    padding: 20px;
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