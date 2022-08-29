import style from './assets/style.css?exclude=true';
import { renderComponent } from './rendition-handler';

export function initialize(initComponentObj) {
    // Insert global styles
    const globalStyleElId = "ez-singleton";
    let styleEl = document.getElementById(globalStyleElId);
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = globalStyleElId;
        document.head.append(styleEl);
    }
    styleEl.append(style);

    // Assign querySelector string to be used as a property of the component
    initComponentObj.querySelector = initComponentObj.componentSpecs.selector;

    // Render init component now
    renderComponent(initComponentObj)
}