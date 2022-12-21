import React from 'react';
import {
  Button, List, ListItem, Paper, Typography,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { serializePopulation } from '../../features/simulation/sagas';
import {
  deleteSimulation,
  duplicateSimulation,
  setCurrentSimulation,
  updateCurrentSimulation,
  useGetSavedSimulations,
} from '../../globals/database';
import store from '../../store';
import { useDisableSaveSimulation } from '../../hooks';
import { rehydrate } from '../../features/developer/developerSlice';

function DatabasePanel() {
  const simulations = useGetSavedSimulations() || [];
  const isSaveDisabled = useDisableSaveSimulation();
  const dispatch = useDispatch();

  const saveSimulation = () => {
    const state = store.getState();
    const population = serializePopulation(); // TODO: Fix, move population into context
    updateCurrentSimulation(population, state);
  };

  const onRestore = async (id) => {
    const { population, reduxState } = await setCurrentSimulation(id);
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
      <Typography>Database info</Typography>
      <Button
        onClick={saveSimulation}
        variant="contained"
        disabled={isSaveDisabled}
        sx={{ display: 'block' }}
      >
        Save Simulation
      </Button>
      {simulations.length && (
        <List>
          {simulations.map(({ id, name, createdOn }) => (
            <ListItem key={id}>
              <Typography>{name}</Typography>
              <Typography>{new Date(createdOn).toLocaleString()}</Typography>
              <Button onClick={() => onRestore(id)}>Restore</Button>
              <Button onClick={() => onClone(id)}>Clone</Button>
              <Button onClick={() => onDelete(id)}>Delete</Button>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}

export default DatabasePanel;
