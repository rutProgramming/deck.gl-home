import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect } from 'react';
import { setPlanes } from './services/workerClient';
import planesData from './data/sample_planes_with_heading.json';
import { buildValidPlanesList } from './planeUtils/plane.normalize';
import { MapRendererContext } from './components/Map/IMapRenderer';
import { mapRenderer } from './components/Map/MapRenderer';
import { Box } from '@mui/material';
import { PlaneEditor } from './components/PlaneEditor/PlaneEditor';
import { PlanesPanel } from './components/PlanesPanel/PlanesPanel';
import { Map } from './components/Map/Map';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export function App() {
  useEffect(() => {
    setPlanes(buildValidPlanesList(planesData))
  }, [])
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <MapRendererContext.Provider value={mapRenderer}>
        {/* <Map /> */}
          <Box style={{ width: "100vw", height: "100vh", position: "relative" }}>
            <Map />
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
