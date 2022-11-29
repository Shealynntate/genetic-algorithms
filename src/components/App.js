import React from 'react';
import {
  Box,
  Container,
  Grid,
  // Paper,
} from '@mui/material';
// import ParentSize from '@visx/responsive/lib/components/ParentSize';
import ControlPanel from './ControlPanel';
// import OverviewChart from './overviewChart/OverviewChart';
import theme from '../theme';
import Header from './Header';
import DisplayTabs from './DisplayTabs';

function App() {
  // const varianceRef = useRef([]);

  // let total = 0;
  // const count = varianceRef.current.length;
  // const start = Math.max(0, count - 5);
  // const end = Math.min(count - 1, start + 5);
  // for (let i = start; i <= end; ++i) {
  //   total += varianceRef.current[i];
  // }
  // const avg = total / 5;
  // if (avg < 0.008) {
  //   const rate = Math.min(1, mutation + 0.0025);
  //   console.log('Deviation too low, increasing mutation rate to ', rate);
  //   dispatch(setMutationRate(rate));
  // } else if (avg > 0.05) {
  //   const rate = Math.max(0, mutation - 0.0025);
  //   console.log('Deviation too high, decreating mutation rate to ', rate);
  //   dispatch(setMutationRate(rate));
  // }

  return (
    <div>
      <Header />
      <Container>
        <Grid container spacing={theme.spacing(2)} margin={theme.spacing(0)}>
          <Grid item xs={3}>
            <Box sx={{ display: 'flex' }}>
              <ControlPanel />
            </Box>
            {/* <Paper sx={{ height: 400 }}>
              <ParentSize>
                {({ ref }) => (
                  <OverviewChart
                    parentRef={ref}
                    tree={tree}
                    targetFitness={1}
                  />
                )}
              </ParentSize>
            </Paper> */}
          </Grid>
          <Grid item xs={9}>
            <DisplayTabs />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default App;
