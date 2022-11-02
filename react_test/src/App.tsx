import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridSelectionModel } from "@mui/x-data-grid";
import {
  Typography,
  Container,
  Box,
  IconButton,
  Button,
  Stack,
} from "@mui/material";

import {
  TrashIcon as DeleteIcon,
  PencilSquareIcon as EditIcon,
  PlusIcon as AddIcon,
} from "@heroicons/react/24/solid";

import CreateDialog from "./components/CreateDialog";
import EditDialog from "./components/EditDialog";
import RemoveDialog from "./components/removeDialog";

import { IRows, INewClient } from "./utils/interfaces";

import {
  getAllClients,
  createClient,
  deleteClient,
  updateClient,
} from "./api/clients";

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    description: "Le id du client",
    flex: 1,
  },
  {
    field: "nom",
    headerName: "Nom",
    description: "Le nom du client",
    flex: 1,
  },
  {
    field: "prenom",
    headerName: "Prenom",
    description: "Le prenom de client",
    flex: 1,
  },
  {
    field: "tel",
    headerName: "Telephone",
    description: "Le telephone du client",
    flex: 1,
  },
];

const App = () => {
  const [clients, setClients] = useState<IRows[]>([]);

  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState<boolean>(false);

  const [selectedClient, setSelectedClient] = useState<GridSelectionModel>([]);

  useEffect(() => {
    (async () => {
      const response = await getAllClients();

      setClients(
        response.data.data.map((client) => ({
          id: client.id,
          ...client.attributes,
        }))
      );
    })();
  }, []);

  const addClient = async (newClient: INewClient) => {
    const response = await createClient(newClient);
    const { id, attributes } = response.data.data;

    setClients((prev) => [...prev, { id, ...attributes }]);
  };

  const editClient = async (
    toUpdateClientId: number,
    newClient: INewClient
  ) => {
    const response = await updateClient(toUpdateClientId, newClient);
    const { id } = response.data.data;

    setClients(
      clients.filter((client) => {
        if (client.id === id) {
          console.log({ id, ...newClient });
          return { id, ...newClient };
        } else {
          return client;
        }
      })
    );
  };

  const removeClient = async (clientIdToRemove: number) => {
    const response = await deleteClient(clientIdToRemove);
    const id = response.data.data.id;

    setClients((prev) => prev.filter((client) => client.id !== id));
  };

  return (
    <Container>
      <Typography
        variant="h2"
        component="h1"
        textAlign="center"
        fontWeight="400"
        marginTop="3rem"
        marginBottom="1.5rem"
      >
        Clients
      </Typography>
      <Box width="100%" height="auto">
        <Stack
          direction="row"
          spacing=".5rem"
          display="flex"
          marginBottom=".5rem"
        >
          <Button
            variant="text"
            color="inherit"
            startIcon={<AddIcon width="20px" />}
            sx={{ paddingBlock: "auto" }}
            onClick={() => setShowAddDialog(true)}
          >
            ADD CLIENT
          </Button>
          {selectedClient.length === 1 && (
            <>
              <Button
                variant="text"
                color="inherit"
                startIcon={<EditIcon width="20px" />}
                sx={{ paddingBlock: "auto" }}
                onClick={() => setShowEditDialog(true)}
              >
                EDIT CLIENT
              </Button>
              <Button
                variant="text"
                color="inherit"
                startIcon={<DeleteIcon width="20px" />}
                sx={{ paddingBlock: "auto" }}
                onClick={() => setShowRemoveDialog(true)}
              >
                REMOVE CLIENTS
              </Button>
            </>
          )}
        </Stack>
        <DataGrid
          aria-label="clients"
          rows={clients}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          autoHeight
          localeText={{
            noRowsLabel: "loading",
          }}
          onSelectionModelChange={(newSelectionModel) => {
            setSelectedClient(newSelectionModel);
          }}
          selectionModel={selectedClient}
          disableColumnSelector
          sx={{
            "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
              outline: "none !important",
            },
          }}
        />
      </Box>
      <CreateDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        addClient={addClient}
      />
      <EditDialog
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        editClient={editClient}
        selectedClient={selectedClient}
      />
      <RemoveDialog
        open={showRemoveDialog}
        onClose={() => setShowRemoveDialog(false)}
        removeClient={removeClient}
        selectedClient={selectedClient}
      />
    </Container>
  );
};

export default App;
