import {
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Switch,
} from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import type { DialogProps } from '@mui/material/Dialog/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import React from 'react';

type CreateProjectModalProps = DialogProps & {
  onClose: () => void;
};

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  onClose,
  ...props
}) => {
  return (
    <Dialog {...props} onClose={onClose}>
      <DialogTitle>👷‍♂️ Create New Project</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter a name for your new project. And other data.
        </DialogContentText>
        <FormGroup sx={{ mt: 1, gap: 2 }}>
          {/*<TextField*/}
          {/*  autoFocus*/}
          {/*  margin="dense"*/}
          {/*  id="proj-name"*/}
          {/*  label="Project Name"*/}
          {/*  type="text"*/}
          {/*  fullWidth*/}
          {/*  variant="outlined"*/}
          {/*/>*/}
          <FormControl fullWidth>
            <InputLabel id="new-proj-select-category-label">
              Category
            </InputLabel>
            <Select
              id="new-proj-select-category"
              labelId="new-proj-select-category-label"
              label="Category"
            >
              <MenuItem value={'Binary Tree'}>Binary Tree</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Public"
          />
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onClose}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};
