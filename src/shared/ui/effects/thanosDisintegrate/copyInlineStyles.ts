/** Recursively copies computed styles onto a cloned subtree for SVG capture. */
export const copyInlineStyles = (source: Element, target: Element): void => {
  if (!(source instanceof HTMLElement) || !(target instanceof HTMLElement)) {
    return;
  }

  const computed = window.getComputedStyle(source);
  for (let index = 0; index < computed.length; index++) {
    const property = computed.item(index);
    target.style.setProperty(
      property,
      computed.getPropertyValue(property),
      computed.getPropertyPriority(property),
    );
  }

  const sourceChildren = source.children;
  const targetChildren = target.children;
  for (let index = 0; index < sourceChildren.length; index++) {
    const sourceChild = sourceChildren[index];
    const targetChild = targetChildren[index];
    if (sourceChild && targetChild) {
      copyInlineStyles(sourceChild, targetChild);
    }
  }
};
