import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { RadarMap } from './components/RadarMap/RadarMap';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export  function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <RadarMap />
    </ThemeProvider>
  );
}
