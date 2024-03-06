/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function() {

  // Define template paths to load
  const templatePaths = [

    // Actor Sheet Partials
    "systems/battendown-drop/templates/parts/coins.html",
    "systems/battendown-drop/templates/parts/attributes.html",
    "systems/battendown-drop/templates/parts/turf-list.html",
    "systems/battendown-drop/templates/parts/cohort-block.html",
    "systems/battendown-drop/templates/parts/factions.html",
    "systems/battendown-drop/templates/parts/active-effects.html",
  ];

  // Load the template parts
  return loadTemplates(templatePaths);
};
