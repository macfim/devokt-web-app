import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  TextField,
  Stack,
  Button,
  IconButton,
  DialogTitle,
} from "@mui/material";
import { XMarkIcon as CloseIcon } from "@heroicons/react/24/outline";

import { INewClient } from "../utils/interfaces";

const DEFAULT_NEWCLIENT = {
  nom: "",
  prenom: "",
  tel: "",
};

const EditDialog = ({ open, onClose, editClient, selectedClient }: any) => {
  const [newClient, setNewClient] = useState<INewClient>(DEFAULT_NEWCLIENT);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    editClient(selectedClient[0], newClient);
    setNewClient(DEFAULT_NEWCLIENT);
    onClose();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewClient((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            paddingBlock: ".2rem",
          }}
        >
          Update
          <IconButton onClick={onClose}>
            <CloseIcon width="24px" />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Stack component="form" spacing="1rem" onSubmit={handleSubmit}>
          <Stack direction="row" spacing="1rem">
            <TextField
              required
              name="nom"
              label="Nom"
              value={newClient.nom}
              onChange={handleChange}
            />
            <TextField
              required
              name="prenom"
              label="Prenom"
              value={newClient.prenom}
              onChange={handleChange}
            />
          </Stack>
          <TextField
            required
            name="tel"
            label="Telephone"
            value={newClient.tel}
            onChange={handleChange}
          />
          <Button variant="contained" color="inherit" type="submit">
            EDIT CLIENT
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;
