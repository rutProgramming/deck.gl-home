import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { RadarMap } from './components/RadarMap/RadarMap';

import { useEffect } from 'react';
import { ingestPlanes } from './services/workerClient';
import planesData from './data/sample_planes_with_heading.json';
import { buildValidPlanesList } from './domain/plane.normalize';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export  function App() {
  useEffect(() => {
  ingestPlanes(buildValidPlanesList(planesData))
}, [])
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <RadarMap />
    </ThemeProvider>
  );
}
