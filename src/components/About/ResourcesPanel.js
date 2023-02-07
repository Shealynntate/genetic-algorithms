import React from 'react';
import PropTypes from 'prop-types';
import {
  Link,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import Panel from '../settingsPanels/Panel';

function Resource({ title, link }) {
  return (
    <ListItem>
      <Link
        href={link}
        underline="hover"
      >
        {title}
      </Link>
    </ListItem>
  );
}

Resource.propTypes = {
  title: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};

// Analyzing the Performance of Mutation Operators to Solve the Traveling Salesman Problem
function ResourcesPanel() {
  return (
    <Panel label="Resources">
      <Typography>
        Here&apos;s a list of resources I used while working on this project
      </Typography>
      <List>
        <Resource
          link="https://cs.gmu.edu/~sean/book/metaheuristics/Essentials.pdf"
          title="Essentials of Metaheuristics"
        />
        <Resource
          link="https://www.egr.msu.edu/~kdeb/papers/k2012016.pdf"
          title="Analyzing Mutation Schemes for Real-Parameter Genetic Algorithms"
        />
        <Resource
          link="https://pdfs.semanticscholar.org/5a25/a4d30528160eef96adbce1d7b03507ebd3d7.pdf"
          title="Choosing Mutation and Crossover Ratios for Genetic Algorithms"
        />
        <Resource
          link="https://arxiv.org/pdf/1203.3099.pdf"
          title="Analyzing the Performance of Mutation Operators to Solve the Traveling Salesman Problem"
        />
        <Resource
          link="https://www.researchgate.net/publication/220862320_Initial_Population_for_Genetic_Algorithms_A_Metric_Approach"
          title="Initial Population for Genetic Algorithms: A Metric Approach"
        />
        <Resource
          link="https://www.researchgate.net/publication/220742263_Self-adaptive_simulated_binary_crossover_for_real-parameter_optimization"
          title="Self-Adaptive Simulated Binary Crossover for Real-Parameter Optimization"
        />
        <Resource
          link="http://gpbenchmarks.org/wp-content/uploads/2019/08/paper1.pdf"
          title="Genetic Programming Needs Better Benchmarks"
        />
      </List>
    </Panel>
  );
}

export default ResourcesPanel;
