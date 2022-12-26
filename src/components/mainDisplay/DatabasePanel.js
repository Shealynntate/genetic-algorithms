import React from 'react';
import {
  Button, Container, Divider, Grid, IconButton, Paper, Tooltip, Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import RestoreIcon from '@mui/icons-material/Restore';
import { useDispatch } from 'react-redux';
import { useTheme } from '@emotion/react';
import { serializePopulation } from '../../features/simulation/sagas';
import {
  deleteSimulation,
  duplicateSimulation,
  restoreSimulation,
  saveCurrentSimulation,
  useGetSavedSimulations,
} from '../../globals/database';
import store from '../../store';
import { useDisableSaveSimulation } from '../../hooks';
import { rehydrate } from '../../features/developer/developerSlice';

function DatabasePanel() {
  const simulations = useGetSavedSimulations() || [];
  const isSaveDisabled = useDisableSaveSimulation();
  const dispatch = useDispatch();
  const theme = useTheme();

  const saveSimulation = () => {
    const state = store.getState();
    const population = serializePopulation(); // TODO: Fix, move population into context
    saveCurrentSimulation(population, state);
  };

  const onRestore = async (id) => {
    const { population, reduxState } = await restoreSimulation(id);
    dispatch(rehydrate({ population, ...reduxState }));
  };

  const onDelete = async (id) => {
    deleteSimulation(id);
  };

  const onClone = async (id) => {
    duplicateSimulation(id);
  };

  return (
    <Paper>
      <Button
        onClick={saveSimulation}
        variant="contained"
        disabled={isSaveDisabled}
        sx={{ display: 'block', mb: `${theme.spacing(1)}`, mx: 'auto' }}
      >
        Save Simulation
      </Button>
      {simulations.length && (
        <Container>
          <Grid container direction="row" spacing={1}>
            <Grid item xs={3}><Typography>Name</Typography></Grid>
            <Grid item xs={3}><Typography>Lasted Updated</Typography></Grid>
            <Grid item xs={3}><Typography>Created On</Typography></Grid>
            <Grid item xs={3}><Typography> </Typography></Grid>
          </Grid>
          <Divider />
          {simulations.map(({
            id,
            name,
            createdOn,
            lastUpdated,
          }) => (
            <Grid container direction="row" spacing={1} key={id}>
              <Grid item xs={3}>
                <Typography>{name}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>{new Date(lastUpdated).toLocaleString()}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>{new Date(createdOn).toLocaleString()}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Tooltip title="Set as current run">
                  <IconButton onClick={() => onRestore(id)}>
                    <RestoreIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Duplicate run">
                  <IconButton onClick={() => onClone(id)}>
                    <FileCopyIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete run">
                  <IconButton color="error" onClick={() => onDelete(id)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          ))}
        </Container>
      )}
    </Paper>
  );
}

export default DatabasePanel;
