/**
 * Extend the basic ItemSheet
 * @extends {ItemSheet}
 */
import {onManageActiveEffect, prepareActiveEffectCategories} from "./effects.js";
import { BladesActiveEffect } from "./blades-active-effect.js";

export class BladesTriggerSheet extends BladesItemSheet {
/** @override */
  get template() {
    return "systems/battendown-drop/templates/items/influence_trigger.html";
  }

  /* -------------------------------------------- */

  /** @override */
	activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;
  }
}