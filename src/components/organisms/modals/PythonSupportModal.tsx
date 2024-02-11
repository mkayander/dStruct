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
} from "@mui/material";
import React from "react";

import { PythonLogoView } from "#/components/molecules/PythonLogoView";

import { GITHUB_URL } from "#/constants";

export type PythonSupportModalProps = DialogProps & {
  onClose: () => void;
};

export const PythonSupportModal: React.FC<PythonSupportModalProps> = ({
  onClose,
  ...props
}) => {
  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      {...props}
      onClose={onClose}
      PaperProps={{
        sx: {
          overflow: "visible",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "-32vh",
          width: "100%",
          height: 700,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            width: "100%",
            height: "100%",
            transform: "translate(-70px, -50px)",
            background: `radial-gradient(circle, rgba(100,100,255,0.2) 0%, transparent 60%)`,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            width: "100%",
            height: "100%",
            transform: "translate(70px, 50px)",
            background: `radial-gradient(circle, rgba(255,255,0,0.1) 0%, transparent 60%)`,
          }}
        />
        <PythonLogoView />
      </Box>
      <DialogTitle>Python Support</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <Close />
      </IconButton>
      <DialogContent dividers>
        <Box
          sx={{
            mt: 8,
            p: 2,
            backgroundColor: (theme) => alpha(theme.palette.primary.light, 0.1),
            backdropFilter: "blur(10px)",
            borderRadius: 2,
            border: `1px solid #ffffff10`,
          }}
        >
          <Typography variant="h5" textAlign="center" gutterBottom>
            Install and run dStruct worker to run Python code
          </Typography>
          <Typography gutterBottom>
            One of the key differences of dStruct is that it runs code locally.
            There is no competitive aspect, so no reason to judge your solutions
            in a single place. Therefore, you are free to run any code you want
            with a full power of your machine. It results in the fastest code
            execution experience possible.
          </Typography>
          <Typography gutterBottom>
            We run JavaScript code in a Web Worker, but for Python code you need
            to install and run the dStruct worker. Make sure you have NodeJS and
            Python3 installed on your machine as well.
          </Typography>
          <Typography gutterBottom>
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
          </Typography>
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
