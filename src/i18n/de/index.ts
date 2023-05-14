import en from "../en";
import { extendDictionary } from "../i18n-util";

const de = extendDictionary(en, {
  CHOOSE_LOCALE: "Sprache auswählen...",
  HI: "Hallo {name}!",
  EDIT_AND_SAVE:
    "Bearbeite und speicher <code>pages/index.tsx</code> um neu zu laden.",
  YOUR_NAME: "Dein Name:",
  SELECTED_LOCALE: "Ausgewählte Sprache:",
  TODAY: "Heute ist {date|weekday}",
});

export default de;
