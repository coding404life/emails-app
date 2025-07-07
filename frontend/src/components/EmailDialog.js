import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Grid,
  Typography,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const EmailDialog = ({ open, onClose, form, onFormChange, onSubmit }) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography variant="h6">Compose Email</Typography>
      <IconButton onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </DialogTitle>
    <DialogContent dividers>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="To"
            value={form.to}
            onChange={(e) => onFormChange("to", e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="CC"
            value={form.cc}
            onChange={(e) => onFormChange("cc", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="BCC"
            value={form.bcc}
            onChange={(e) => onFormChange("bcc", e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Subject"
            value={form.subject}
            onChange={(e) => onFormChange("subject", e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Body"
            value={form.body}
            onChange={(e) => onFormChange("body", e.target.value)}
            multiline
            rows={8}
            required
          />
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button
        onClick={onSubmit}
        variant="contained"
        disabled={!form.to || !form.subject || !form.body}
      >
        Send
      </Button>
    </DialogActions>
  </Dialog>
);

export default EmailDialog;
