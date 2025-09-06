import React from "react";

import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

interface Props {
  title: string;
  children: React.ReactNode;
  buttonText: string;
  open: boolean;
  handleClose: () => void;
  sx?: any;
}

const DisplayDialog: React.FC<Props> = ({
  open,
  handleClose,
  title,
  children,
  buttonText,
  sx,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth="xs"
      PaperProps={{ sx: { width: 420 } }}
    >
      <DialogTitle id="alert-dialog-title" sx={sx}>
        {title}
      </DialogTitle>
      <DialogContent sx={sx}>
        <DialogContentText id="alert-dialog-description">
          {children}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={sx}>
        {/* <Button onClick={handleClose}>Disagree</Button> */}
        <Button onClick={handleClose} autoFocus>
          {buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DisplayDialog;
