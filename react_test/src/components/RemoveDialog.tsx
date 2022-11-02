import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";

const RemoveDialog = ({ open, onClose, removeClient, selectedClient }: any) => {
  const handleRemove = () => {
    removeClient(selectedClient[0]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{"Are you sure"}</DialogTitle>
      <DialogActions>
        <Button onClick={handleRemove}>YES</Button>
        <Button onClick={onClose}>NO</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RemoveDialog;
