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
          <TextField
            autoFocus
            margin="dense"
            id="project-name"
            label="Project Name"
            type="email"
            fullWidth
            variant="outlined"
          />
          <FormControl fullWidth>
            <InputLabel id="new-project-select-category-label">
              Category
            </InputLabel>
            <Select
              id="new-project-select-category"
              labelId="new-project-select-category-label"
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
