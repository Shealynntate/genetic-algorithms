import React, {
  createContext, useCallback, useContext, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import Population from '../models/population';

const PopulationContext = createContext();

// TODO: Might not need this, can delete
function PopulationProvider({ children }) {
  const [population, setPopulation] = useState();

  const create = useCallback(async (params) => {
    const pop = new Population(params);
    await pop.initialize();
    setPopulation(pop);
  });

  const serialize = useCallback(() => population.serialize());

  const value = useMemo(() => ({ population, create, serialize }), [population]);

  return (
    <PopulationContext.Provider value={value}>
      {children}
    </PopulationContext.Provider>
  );
}

PopulationProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

const usePopulation = () => {
  const context = useContext(PopulationContext);
  if (context === undefined) {
    throw new Error('usePopulation must be used within a PopulationProvider');
  }
  return context;
};

export { PopulationProvider, usePopulation };
