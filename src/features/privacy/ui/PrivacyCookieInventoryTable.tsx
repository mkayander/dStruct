import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";

import {
  COOKIE_INVENTORY_ROW_IDS,
  type CookieInventoryRowId,
} from "#/features/privacy/constants/cookieInventory";
import type { TranslationFunctions } from "#/i18n/i18n-types";

type PrivacyCookieInventoryTableProps = {
  LL: TranslationFunctions;
};

type CookieRowLabels = {
  name: string;
  provider: string;
  purpose: string;
  duration: string;
  type: string;
};

const getCookieRowLabels = (
  LL: TranslationFunctions,
  rowId: CookieInventoryRowId,
): CookieRowLabels => {
  switch (rowId) {
    case "session":
      return {
        name: LL.PRIVACY_COOKIE_SESSION_NAME(),
        provider: LL.PRIVACY_COOKIE_SESSION_PROVIDER(),
        purpose: LL.PRIVACY_COOKIE_SESSION_PURPOSE(),
        duration: LL.PRIVACY_COOKIE_SESSION_DURATION(),
        type: LL.PRIVACY_COOKIE_SESSION_TYPE(),
      };
    case "csrf":
      return {
        name: LL.PRIVACY_COOKIE_CSRF_NAME(),
        provider: LL.PRIVACY_COOKIE_CSRF_PROVIDER(),
        purpose: LL.PRIVACY_COOKIE_CSRF_PURPOSE(),
        duration: LL.PRIVACY_COOKIE_CSRF_DURATION(),
        type: LL.PRIVACY_COOKIE_CSRF_TYPE(),
      };
    case "leetcode":
      return {
        name: LL.PRIVACY_COOKIE_LEETCODE_NAME(),
        provider: LL.PRIVACY_COOKIE_LEETCODE_PROVIDER(),
        purpose: LL.PRIVACY_COOKIE_LEETCODE_PURPOSE(),
        duration: LL.PRIVACY_COOKIE_LEETCODE_DURATION(),
        type: LL.PRIVACY_COOKIE_LEETCODE_TYPE(),
      };
    case "consentRecord":
      return {
        name: LL.PRIVACY_COOKIE_CONSENT_RECORD_NAME(),
        provider: LL.PRIVACY_COOKIE_CONSENT_RECORD_PROVIDER(),
        purpose: LL.PRIVACY_COOKIE_CONSENT_RECORD_PURPOSE(),
        duration: LL.PRIVACY_COOKIE_CONSENT_RECORD_DURATION(),
        type: LL.PRIVACY_COOKIE_CONSENT_RECORD_TYPE(),
      };
    case "locale":
      return {
        name: LL.PRIVACY_COOKIE_LOCALE_NAME(),
        provider: LL.PRIVACY_COOKIE_LOCALE_PROVIDER(),
        purpose: LL.PRIVACY_COOKIE_LOCALE_PURPOSE(),
        duration: LL.PRIVACY_COOKIE_LOCALE_DURATION(),
        type: LL.PRIVACY_COOKIE_LOCALE_TYPE(),
      };
    case "playgroundPath":
      return {
        name: LL.PRIVACY_COOKIE_PLAYGROUND_PATH_NAME(),
        provider: LL.PRIVACY_COOKIE_PLAYGROUND_PATH_PROVIDER(),
        purpose: LL.PRIVACY_COOKIE_PLAYGROUND_PATH_PURPOSE(),
        duration: LL.PRIVACY_COOKIE_PLAYGROUND_PATH_DURATION(),
        type: LL.PRIVACY_COOKIE_PLAYGROUND_PATH_TYPE(),
      };
    case "analytics":
      return {
        name: LL.PRIVACY_COOKIE_ANALYTICS_NAME(),
        provider: LL.PRIVACY_COOKIE_ANALYTICS_PROVIDER(),
        purpose: LL.PRIVACY_COOKIE_ANALYTICS_PURPOSE(),
        duration: LL.PRIVACY_COOKIE_ANALYTICS_DURATION(),
        type: LL.PRIVACY_COOKIE_ANALYTICS_TYPE(),
      };
    case "materialIcons":
      return {
        name: LL.PRIVACY_COOKIE_MATERIAL_ICONS_NAME(),
        provider: LL.PRIVACY_COOKIE_MATERIAL_ICONS_PROVIDER(),
        purpose: LL.PRIVACY_COOKIE_MATERIAL_ICONS_PURPOSE(),
        duration: LL.PRIVACY_COOKIE_MATERIAL_ICONS_DURATION(),
        type: LL.PRIVACY_COOKIE_MATERIAL_ICONS_TYPE(),
      };
  }
};

export const PrivacyCookieInventoryTable: React.FC<
  PrivacyCookieInventoryTableProps
> = ({ LL }) => {
  return (
    <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
      <Table size="small" aria-label={LL.PRIVACY_COOKIE_TABLE_CAPTION()}>
        <TableHead>
          <TableRow>
            <TableCell>{LL.PRIVACY_COOKIE_TABLE_COL_NAME()}</TableCell>
            <TableCell>{LL.PRIVACY_COOKIE_TABLE_COL_PROVIDER()}</TableCell>
            <TableCell>{LL.PRIVACY_COOKIE_TABLE_COL_PURPOSE()}</TableCell>
            <TableCell>{LL.PRIVACY_COOKIE_TABLE_COL_DURATION()}</TableCell>
            <TableCell>{LL.PRIVACY_COOKIE_TABLE_COL_TYPE()}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {COOKIE_INVENTORY_ROW_IDS.map((rowId) => {
            const row = getCookieRowLabels(LL, rowId);
            return (
              <TableRow key={rowId}>
                <TableCell component="th" scope="row">
                  <Typography variant="body2" component="code">
                    {row.name}
                  </Typography>
                </TableCell>
                <TableCell>{row.provider}</TableCell>
                <TableCell>{row.purpose}</TableCell>
                <TableCell>{row.duration}</TableCell>
                <TableCell>{row.type}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
