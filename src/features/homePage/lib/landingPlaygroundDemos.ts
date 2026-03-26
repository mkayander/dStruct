import AccountTree from "@mui/icons-material/AccountTree";
import Hub from "@mui/icons-material/Hub";
import MapIcon from "@mui/icons-material/Map";
import ViewModule from "@mui/icons-material/ViewModule";

/**
 * Curated playground deep-links on the marketing home page.
 * Keep in sync with deployed example projects (see public-dumps / production DB).
 */
export const LANDING_PLAYGROUND_DEMOS = [
  {
    id: "tree",
    href: "/playground/invert-binary-tree?view=code",
    Icon: AccountTree,
  },
  {
    id: "graph",
    href: "/playground/find-if-path-exists-in-graph?view=code",
    Icon: Hub,
  },
  {
    id: "grid",
    href: "/playground/shortest-path-in-binary-matrix?view=code",
    Icon: ViewModule,
  },
  {
    id: "trie",
    href: "/playground/trie?view=code",
    Icon: MapIcon,
  },
] as const;

/** Primary hero CTA: first curated demo (binary tree). */
export const LANDING_PRIMARY_PLAYGROUND_HREF = LANDING_PLAYGROUND_DEMOS[0].href;
