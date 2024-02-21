import { MenuItem, Select, type SelectChangeEvent } from "@mui/material";
import Image from "next/image";

import JavaScriptLogo from "#/components/molecules/CodeRunner/assets/javaScriptLogo.svg";
import PythonLogo from "#/components/molecules/CodeRunner/assets/pythonLogo.svg";
import type { ProgrammingLanguage } from "#/hooks/useCodeExecution";

export type EditorLanguageSelectProps = {
  language: ProgrammingLanguage | "";
  handleLanguageChange: (event: SelectChangeEvent<ProgrammingLanguage>) => void;
};

export const EditorLanguageSelect: React.FC<EditorLanguageSelectProps> = ({
  language,
  handleLanguageChange,
}) => {
  return (
    <Select
      size="small"
      value={language}
      onChange={handleLanguageChange}
      sx={{
        height: 32,
        width: 48,
        overflow: "hidden",
        fontSize: "8px",
        "& [data-testid=ArrowDropDownIcon]": {
          marginRight: "-6px",
        },
        "& [role=combobox]": {
          padding: "8px",
          color: "transparent",
          "& > svg": {
            color: "text.primary",
          },
        },
      }}
    >
      <MenuItem value="javascript">
        <Image
          src={JavaScriptLogo}
          alt="JavaScript Logo"
          width={16}
          height={16}
        />
        &nbsp; JavaScript
      </MenuItem>
      <MenuItem value="python">
        <Image src={PythonLogo} alt="Python Logo" width={16} height={16} />
        &nbsp; Python
      </MenuItem>
    </Select>
  );
};
