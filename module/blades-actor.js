import { bladesRoll } from "./blades-roll.js";
import { BladesHelpers } from "./blades-helpers.js";

/**
 * Extend the basic Actor
 * @extends {Actor}
 */
export class BladesActor extends Actor {

  /** @override */
  static async create(data, options={}) {

    data.prototypeToken = data.prototypeToken || {};

    // For Crew and Character set the Token to sync with charsheet.
    switch (data.type) {
      case 'character':
      case 'crew':
      case '\uD83D\uDD5B clock':
        data.prototypeToken.actorLink = true;
        break;
    }

    return super.create(data, options);
  }

  /** @override */
  getRollData() {
    const rollData = super.getRollData();

    rollData.dice_amount = this.getAttributeDiceToThrow();

    return rollData;
  }

  /* -------------------------------------------- */
  /**
   * Calculate Attribute Dice to throw.
   */
  getAttributeDiceToThrow() {

    // Calculate Dice to throw.
    let dice_amount = {};
    dice_amount['BITD.Vice'] = 4;

    for (var attribute_name in this.system.attributes) {
      dice_amount[attribute_name] = 0;
      for (var skill_name in this.system.attributes[attribute_name].skills) {
        dice_amount[skill_name] = parseInt(this.system.attributes[attribute_name].skills[skill_name]['value'][0])

        // We add a +1d for every skill higher than 0.
        if (dice_amount[skill_name] > 0) {
          dice_amount[attribute_name]++;
        }
      }
      // Vice dice roll uses lowest attribute dice amount
      if (dice_amount[attribute_name] < dice_amount['BITD.Vice'] ) {
        dice_amount['BITD.Vice'] = dice_amount[attribute_name];
      }
    }

    return dice_amount;
  }

  /* -------------------------------------------- */

  rollAttributePopup(attribute_name) {
    let attribute_label = game.i18n.localize(BladesHelpers.getRollLabel(attribute_name));
    let args = {attribute_label: attribute_label,
                isAttrAction : BladesHelpers.isAttributeAction(attribute_name),
                mods : this.createListOfDiceMods(-3,+3,0)};
    console.log(args)
    renderTemplate("systems/battendown-drop/templates/popups/roll.html", args).then(content=>{
                      new Dialog({
                        title: game.i18n.format('BITD.Roll', {attr:attribute_label}),
                        content: content,
                        buttons: {
                          yes: {
                            icon: "<i class='fas fa-check'></i>",
                            label: game.i18n.format('BITD.Roll',{attr:attribute_label}),
                            callback: async (html) => {
                              let modifier = parseInt(html.find('[name="mod"]')[0].value);
                              let position = html.find('[name="pos"]')[0].value;
                              let effect = html.find('[name="fx"]')[0].value;
                              let note = html.find('[name="note"]')[0].value;
                              await this.rollAttribute(attribute_name, modifier, position, effect, note);
                            }
                          },
                          no: {
                            icon: "<i class='fas fa-times'></i>",
                            label: game.i18n.localize('BITD.Cancel'),
                          },
                        },
                        default: "yes",
                      }).render(true);
                    });
  }
    
    

  /* -------------------------------------------- */

  async rollAttribute(attribute_name = "", additional_dice_amount = 0, position, effect, note) {

    let dice_amount = 0;
    if (attribute_name !== "") {
      let roll_data = this.getRollData();
      dice_amount += roll_data.dice_amount[attribute_name];
    }
    else {
      dice_amount = 1;
    }
    dice_amount += additional_dice_amount;

    await bladesRoll(dice_amount, attribute_name, position, effect, note, this.system.stress.value);
  }

  /* -------------------------------------------- */

  /**
   * Create <options> for available actions
   *  which can be performed.
   */
  createListOfActions() {

    let text, attribute, skill;
    let attributes = this.system.attributes;

    for ( attribute in attributes ) {

      const skills = attributes[attribute].skills;

      text += `<optgroup label="${attribute} Actions">`;
      text += `<option value="${attribute}">${attribute} (Resist)</option>`;

      for ( skill in skills ) {
        text += `<option value="${skill}">${skill}</option>`;
      }

      text += `</optgroup>`;

    }

    return text;

  }

  /* -------------------------------------------- */

  /**
   * Creates <options> modifiers for dice roll.
   *
   * @param {int} rs
   *  Min die modifier
   * @param {int} re
   *  Max die modifier
   * @param {int} s
   *  Selected die
   */
  createListOfDiceMods(rs, re, s) {
    var out = []
    s =  s || 0;

    for (var i = rs; i <= re; i++ ) {
      out.push({val:i,selected:i==s})
    }
    console.log(out)
    return out;
  }

  /* -------------------------------------------- */

}