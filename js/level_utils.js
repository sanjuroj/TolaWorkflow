/*
  Some nice helper functions to help with date parsing and localization

  In the future it may make sense to use moment.js, luxon, or date-fns,
  but for now, just get by with the native browser APIs and save some bytes.

  Confusingly, native Date() objects are actually date/time objects.

  Surprisingly, the Django i18n/l10n JS tools do not provide access to the language code
  of the current language in use.
 */

// Returns a trimmed level ontology for display purposes
export function trimOntology(ontologyStr) {
    let ontologyArray = ontologyStr.split(".");
    return ontologyArray.slice(1).filter(i => i > 0).join(".")
}
