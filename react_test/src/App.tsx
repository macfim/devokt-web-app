import { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridSelectionModel } from "@mui/x-data-grid";
import {
  Typography,
  Container,
  Box,
  IconButton,
  Button,
  Stack,
  Alert,
  ButtonGroup,
  CircularProgress,
} from "@mui/material";

import {
  TrashIcon as DeleteIcon,
  PencilSquareIcon as EditIcon,
  PlusIcon as AddIcon,
  ArrowPathIcon as ReloadIcon,
} from "@heroicons/react/24/solid";

import CreateDialog from "./components/CreateDialog";
import EditDialog from "./components/EditDialog";
import RemoveDialog from "./components/RemoveDialog";

import { IRows, INewClient, EAlertStatus } from "./utils/interfaces";
import { EClientsStatus } from "./utils/enums";

import {
  getAllClients,
  createClient,
  deleteClient,
  updateClient,
} from "./api/clients";

import { useAlert } from "./hooks/useAlert";
import { useAutoAnimate } from "@formkit/auto-animate/react";

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
  const [clientsStatus, setClientsStatus] = useState<EClientsStatus>(
    EClientsStatus.loading
  );

  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState<boolean>(false);

  const [selectedClient, setSelectedClient] = useState<GridSelectionModel>([]);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  const { alerts, removeAlert, notifie } = useAlert();

  const [alertQueue] = useAutoAnimate();

  useEffect(() => {
    setClientsStatus(EClientsStatus.loading);

    (async () => {
      const response = await getAllClients();

      if ((response.status = 200)) setClientsStatus(EClientsStatus.success);

      setClients(
        response.data.data.map((client) => ({
          id: client.id,
          ...client.attributes,
        }))
      );
    })();
  }, [refreshCount]);

  const addClient = async (newClient: INewClient) => {
    const response = await createClient(newClient);
    const { id, attributes } = response.data.data;

    setClients((prev) => [...prev, { id, ...attributes }]);
    notifie(
      EAlertStatus.success,
      `Added client \'${attributes.nom} ${attributes.prenom}\'`
    );
  };

  const editClient = async (
    toUpdateClientId: number,
    newClient: INewClient
  ) => {
    const response = await updateClient(toUpdateClientId, newClient);
    const { id, attributes } = response.data.data;

    setClients(
      clients.filter((client) => {
        if (client.id === id) {
          return { id, ...newClient };
        } else {
          return client;
        }
      })
    );

    notifie(
      EAlertStatus.success,
      `Edited client \'${attributes.nom} ${attributes.prenom}\'`
    );
  };

  const removeClient = async (clientIdToRemove: number) => {
    const response = await deleteClient(clientIdToRemove);
    const { id, attributes } = response.data.data;

    setClients((prev) => prev.filter((client) => client.id !== id));

    notifie(
      EAlertStatus.success,
      `Deleted client \'${attributes.nom} ${attributes.prenom}\'`
    );
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
          justifyContent="space-between"
        >
          <ButtonGroup color="inherit" variant="outlined">
            <Button
              startIcon={<AddIcon width="20px" />}
              sx={{ paddingBlock: "auto" }}
              onClick={() => setShowAddDialog(true)}
            >
              ADD CLIENT
            </Button>
            {selectedClient.length === 1 && (
              <>
                <Button
                  startIcon={<EditIcon width="20px" />}
                  sx={{ paddingBlock: "auto" }}
                  onClick={() => setShowEditDialog(true)}
                >
                  EDIT CLIENT
                </Button>
                <Button
                  startIcon={<DeleteIcon width="20px" />}
                  sx={{ paddingBlock: "auto" }}
                  onClick={() => setShowRemoveDialog(true)}
                >
                  REMOVE CLIENTS
                </Button>
              </>
            )}
          </ButtonGroup>
          <Box>
            {clientsStatus === EClientsStatus.loading ? (
              "loading"
            ) : (
              <IconButton onClick={() => setRefreshCount((prev) => ++prev)}>
                <ReloadIcon width="20px" />
              </IconButton>
            )}
          </Box>
        </Stack>
        <DataGrid
          aria-label="clients"
          rows={clients}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          autoHeight
          localeText={{
            noRowsLabel: clientsStatus,
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
            "&.MuiDataGrid-root .MuiDataGrid-row:hover": {
              cursor: "pointer",
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
      <Stack
        ref={alertQueue}
        direction="column"
        sx={{ position: "absolute", top: "1rem", minWidth: "20rem" }}
        spacing=".5rem"
      >
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            severity={alert.status}
            onClose={() => removeAlert(alert.id)}
          >
            {alert.content}
          </Alert>
        ))}
      </Stack>
    </Container>
  );
};

export default App;
