import en from "../en";
import { extendDictionary } from "../i18n-util";

const de = extendDictionary(en, {
  CHOOSE_LOCALE: "Sprache auswählen...",
  EDIT_AND_SAVE: "Bearbeite und speicher <code>pages/index.tsx</code> um neu zu laden.",
  HI: "Hallo {name}!",
  SELECTED_LOCALE: "Ausgewählte Sprache:",
  TODAY: "Heute ist {date|weekday}",
  YOUR_NAME: "Dein Name:"
});

export default de;
