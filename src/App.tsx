import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Map } from './components/Map/Map';

import { useEffect } from 'react';
import { setPlanes } from './services/workerClient';
import planesData from './data/sample_planes_with_heading.json';
import { buildValidPlanesList } from './planeUtils/plane.normalize';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export  function App() {
  useEffect(() => {
  setPlanes(buildValidPlanesList(planesData))
}, [])
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Map />
    </ThemeProvider>
  );
}
