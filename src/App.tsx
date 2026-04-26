import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect } from 'react';
import planesData from './data/sample_planes_with_heading.json';
import carsData from './data/cars.json';
import { mapRenderer, MapRendererContext } from './components/Map/IMapRenderer';
import { Box } from '@mui/material';
import { PlaneEditor } from './components/PlaneEditor/PlaneEditor';
import { PlanesPanel } from './components/PlanesPanel/PlanesPanel';
import {  MapView } from './components/Map/MapView';
import { setMapObjects } from './services/workerClient';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export function App() {
  useEffect(() => {
   setMapObjects({
      plane: planesData,
      car: carsData
   })
  }, [])
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <MapRendererContext.Provider value={mapRenderer}>
        <Box style={{ width: "100vw", height: "100vh", position: "relative" }}>
          <MapView />
          <Box style={{ position: "absolute", top: 16, right: 100, zIndex: 10 }}>
            <PlaneEditor />
          </Box>
          <Box style={{ position: "absolute", bottom: 16, left: 100, zIndex: 10 }}>
            <PlanesPanel />
          </Box>
        </Box>
      </MapRendererContext.Provider>
    </ThemeProvider>
  );
}
