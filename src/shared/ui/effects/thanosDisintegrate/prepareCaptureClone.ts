import { copyInlineStyles } from "#/shared/ui/effects/thanosDisintegrate/copyInlineStyles";

/** Strips live-only effects and copies raster-friendly styles onto a capture clone. */
export const prepareCaptureClone = (element: HTMLElement): HTMLElement => {
  const clone = element.cloneNode(true) as HTMLElement;
  copyInlineStyles(element, clone);

  const computed = window.getComputedStyle(element);
  clone.style.margin = "0";
  clone.style.position = "relative";
  clone.style.transform = "none";
  clone.style.backdropFilter = "none";
  // Use setProperty: webkitBackdropFilter is not on CSSStyleDeclaration in strict TS DOM typings.
  clone.style.setProperty("-webkit-backdrop-filter", "none");
  clone.style.backgroundColor = computed.backgroundColor;
  clone.style.color = computed.color;
  clone.style.border = computed.border;
  clone.style.borderRadius = computed.borderRadius;
  clone.style.boxShadow = computed.boxShadow;

  const originalButtons = element.querySelectorAll("button");
  const cloneButtons = clone.querySelectorAll("button");
  cloneButtons.forEach((cloneButton, index) => {
    if (!(cloneButton instanceof HTMLElement)) {
      return;
    }

    const originalButton = originalButtons[index];
    const buttonStyle = window.getComputedStyle(originalButton ?? cloneButton);
    cloneButton.style.backgroundColor = buttonStyle.backgroundColor;
    cloneButton.style.color = buttonStyle.color;
    cloneButton.style.border = buttonStyle.border;
    cloneButton.style.borderRadius = buttonStyle.borderRadius;
    cloneButton.style.boxShadow = "none";
  });

  return clone;
};
