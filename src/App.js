
import './App.css';
// import Mybtn from './Components/Mybtn';
// import AccessAlarmIcon from '@mui/icons-material/AccessAlarm'
import { createTheme,ThemeProvider } from '@mui/material/styles';
import WeatherCard from './Components/weatherCard';
function App() {
  const theme = createTheme ({
    typography:{
      fontFamily:['IBM'],
   allVariants: {
      fontWeight: 400,
    },
    }
  })

  return (
    <ThemeProvider theme={theme}>
    <div className="App">
<WeatherCard/>
    </div>
    </ThemeProvider>
  );
}

export default App;


