import { Close } from "@mui/icons-material";
import {
  alpha,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  type DialogProps,
  DialogTitle,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import { type OrbitControls as ThreeOrbitControls } from "three-stdlib";

import { useMobileLayout } from "#/shared/hooks/useMobileLayout";
import { PythonLogoView } from "#/shared/ui/molecules/PythonLogoView";

import { GITHUB_URL } from "#/constants";

export const PYTHON_SUPPORT_MODAL_ID = "python-support";

export type PythonSupportModalProps = DialogProps & {
  onClose: () => void;
};

export const PythonSupportModal: React.FC<PythonSupportModalProps> = ({
  onClose,
  ...props
}) => {
  const theme = useTheme();
  const isMobile = useMobileLayout();
  const controlsRef = React.useRef<ThreeOrbitControls>(null);

  const handleMouseMove = (event: React.MouseEvent) => {
    const azimuthalAngle =
      ((window.innerWidth - event.clientX) / window.innerWidth) * Math.PI -
      Math.PI / 2;

    const polarAngle =
      ((window.innerHeight - event.clientY) / window.innerHeight) * Math.PI;

    if (controlsRef.current) {
      controlsRef.current.setAzimuthalAngle(azimuthalAngle);
      controlsRef.current.setPolarAngle(polarAngle);
    }
  };

  useEffect(() => {
    if (!controlsRef.current || isMobile) return;

    controlsRef.current.setAzimuthalAngle(Math.PI / 7);
    controlsRef.current.setPolarAngle(Math.PI / 1.5);
  }, [isMobile]);

  return (
    <Dialog
      maxWidth="lg"
      onClose={onClose}
      PaperProps={{
        sx: {
          overflow: "visible",
          marginTop: isMobile ? 0 : "15vh",
        },
      }}
      onMouseMove={handleMouseMove}
      {...props}
    >
      <Box
        sx={{
          position: "fixed",
          top: isMobile ? "-32px" : "-6%",
          left: 0,
          width: "100%",
          height: isMobile ? 470 : "70%",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            height: "100%",
            aspectRatio: "1/1",
            transform: "translate(-50%, -50%) translate(-70px, -50px)",
            background:
              "radial-gradient(circle, #3675A955 0%, transparent 60%)",
            animation: "fade-in 0.5s ease-in-out",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            height: "100%",
            aspectRatio: "1/1",
            transform: "translate(-50%, -50%) translate(70px, 50px)",
            background:
              "radial-gradient(circle, #FFD54F22 0%, transparent 60%)",
            animation: "fade-in 0.5s ease-in-out",
          }}
        />
        <PythonLogoView controlsRef={controlsRef} />
      </Box>
      <DialogTitle>Python Support</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        }}
      >
        <Close />
      </IconButton>
      <DialogContent
        dividers
        sx={{
          "&::-webkit-scrollbar": {
            zIndex: 10,
          },
        }}
      >
        <Box
          sx={{
            mt: isMobile ? 32 : 8,
            p: 2,
            backgroundColor: alpha(theme.palette.primary.light, 0.1),
            backdropFilter: "blur(10px)",
            borderRadius: 2,
            border: `1px solid #ffffff10`,
            maxHeight: "45vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h4" textAlign="center" gutterBottom>
            {isMobile
              ? "Open this page on desktop to run Python code!"
              : "Install and run dStruct worker to run Python code!"}
          </Typography>
          <Typography gutterBottom>
            🚀 One of the key differences of dStruct is that it runs code
            locally. There is no competitive aspect, so no reason to judge your
            solutions in a single place. Therefore, you are free to run any code
            you want with a full power of your machine. It results in the
            fastest code execution experience possible.
          </Typography>
          <Typography gutterBottom>
            🐍 We run JavaScript code in a Web Worker, but for Python code you
            need to install and run the dStruct standalone worker. Make sure you
            have NodeJS and Python3 installed on your machine as well.
          </Typography>
          <Typography gutterBottom fontWeight={600}>
            🚧 Currently this standalone worker is under development and not
            published to NPM yet. You can contribute to the development of the
            worker by visiting the GitHub repository.
          </Typography>

          {/* <Typography gutterBottom>
            It is easy to install and run the dStruct worker. Just follow the
            instructions below:
          </Typography>
          <Typography>
            <ol>
              <li>
                Download and install the dStruct worker from the releases page.
              </li>
              <li>
                Open a terminal and navigate to the folder where you installed
                the dStruct worker.
              </li>
              <li>
                Run the command `dstruct-worker` to start the dStruct worker.
              </li>
              <li>You can now run Python code on dStruct.</li>
            </ol>
          </Typography> */}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button href={GITHUB_URL} target="_blank">
          Contribute
        </Button>
      </DialogActions>
    </Dialog>
  );
};
