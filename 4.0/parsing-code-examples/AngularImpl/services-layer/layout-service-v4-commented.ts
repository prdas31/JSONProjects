import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  /**
   * Applies the specified layout to a container element
   * @param container The container element to apply the layout to
   * @param layout The layout configuration
   */
  applyLayout(container: HTMLElement, layout: LayoutConfig) {
    switch (layout.type) {
      case 'grid':
        this.applyGridLayout(container, layout);
        break;
      case 'tabs':
        this.applyTabLayout(container, layout);
        break;
      case 'sections':
        this.applySectionLayout(container, layout);
        break;
      default:
        console.warn(`Unsupported layout type: ${layout.type}`);
    }
  }

  /**
   * Applies a grid layout to the container
   * @param container The container element
   * @param layout The grid layout configuration
   */
  private applyGridLayout(container: HTMLElement, layout: GridLayout) {
    this.renderer.setStyle(container, 'display', 'grid');
    this.renderer.setStyle(container, 'grid-template-columns', `repeat(${layout.columns}, 1fr)`);
    if (layout.gap) {
      this.renderer.setStyle(container, 'gap', layout.gap);
    }
  }

  /**
   * Applies a tab layout to the container
   * @param container The container element
   * @param layout The tab layout configuration
   */
  private applyTabLayout(container: HTMLElement, layout: TabLayout) {
    // This is a simplified implementation. In a real-world scenario,
    // you might want to use a more robust tab component.
    const tabContainer = this.renderer.createElement('div');
    this.renderer.addClass(tabContainer, 'tab-container');

    const contentContainer = this.renderer.createElement('div');
    this.renderer.addClass(contentContainer, 'tab-content');

    layout.tabs.forEach((tab, index) => {
      const tabElement = this.renderer.createElement('button');
      this.renderer.setProperty(tabElement, 'textContent', tab.label);
      this.renderer.listen(tabElement, 'click', () => this.showTab(contentContainer, index));

      const contentElement = this.renderer.createElement('div');
      this.renderer.setProperty(contentElement, 'id', `tab-${index}`);
      this.renderer.setStyle(contentElement, 'display', index === 0 ? 'block' : 'none');

      this.renderer.appendChild(tabContainer, tabElement);
      this.renderer.appendChild(contentContainer, contentElement);
    });

    this.renderer.appendChild(container, tabContainer);
    this.renderer.appendChild(container, contentContainer);
  }

  /**
   * Applies a section layout to the container
   * @param container The container element
   * @param layout The section layout configuration
   */
  private applySectionLayout(container: HTMLElement, layout: SectionLayout) {
    layout.sections.forEach(section => {
      const sectionElement = this.renderer.createElement('section');
      const headingElement = this.renderer.createElement('h2');
      this.renderer.setProperty(headingElement, 'textContent', section.title);
      
      this.renderer.appendChild(sectionElement, headingElement);
      this.renderer.appendChild(container, sectionElement);
    });
  }

  /**
   * Shows the selected tab and hides others
   * @param container The tab content container
   * @param selectedIndex The index of the selected tab
   */
  private showTab(container: HTMLElement, selectedIndex: number) {
    const tabs = container.children;
    for (let i = 0; i < tabs.length; i++) {
      this.renderer.setStyle(tabs[i], 'display', i === selectedIndex ? 'block' : 'none');
    }
  }
}

interface LayoutConfig {
  type: 'grid' | 'tabs' | 'sections';
  columns?: number;
}

interface GridLayout extends LayoutConfig {
  type: 'grid';
  columns: number;
  gap?: string;
}

interface TabLayout extends LayoutConfig {
  type: 'tabs';
  tabs: { label: string }[];
}

interface SectionLayout extends LayoutConfig {
  type: 'sections';
  sections: { title: string }[];
}
