export class Tag {
    private container: HTMLElement;

    constructor(
        container: HTMLElement,
        private text: string,
        private onClick?: () => void
    ) {
        this.container = container.createEl('span', {
            cls: 'pluginflowz-tag',
            text: this.text
        });
        this.render();
    }

    private render() {
        if (this.onClick) {
            this.container.addEventListener('click', this.onClick);
        }
    }

    public setText(text: string) {
        this.text = text;
        this.container.textContent = text;
    }

    public getText(): string {
        return this.text;
    }
} 