import type { CartItemConfiguration, SelectedImage, SelectedSection, SelectedAlteration } from "@/types/cart.types";

/**
 * Calculates the total price for a given model configuration.
 */
export function calculateConfigurationPrice(config: CartItemConfiguration): number {
  if (!config || !config.modelImages) return 0;

  return config.modelImages.reduce((imageTotal: number, image: SelectedImage) => {
    return imageTotal + image.sections.reduce((sectionTotal: number, section: SelectedSection) => {
      return sectionTotal + section.alterations.reduce((altTotal: number, alt: SelectedAlteration) => {
        return altTotal + (alt.price || 0);
      }, 0);
    }, 0);
  }, 0);
}
