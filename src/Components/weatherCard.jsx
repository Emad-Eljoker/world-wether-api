import {
  Card,
  Button,
  Typography,
  Container,
  TextField,
  InputAdornment,
} from "@mui/material";
import {  useEffect, useState } from "react";
//icons
import CloudIcon from "@mui/icons-material/Cloud";
import SearchIcon from "@mui/icons-material/Search";

//External 
import axios from "axios";
import { useTranslation } from 'react-i18next';
import moment from "moment/moment";
import "moment/min/locales"



//data
const key = "e2a11bca70d259e73ca948d2d43a76a6";
let cancel = null;

export default function WeatherCard() {
   
  //Api
   const [date,setDate] =useState("")
  const [city, SetCity] = useState("cairo");
   const [weatherData, setWeatherData] = useState({});
  const [geoData, setGeoData] = useState({
    lon: "31.233334",
    lat: "30.033333",
    name:"Cairo"
  });

  // i18next
  const { t, i18n } = useTranslation();
  const { lat, lon } = geoData;

const [lang,Setlang] =useState("en")

 const direction = lang ==="ar"?"rtl":"ltr"
 
  //  let temp = weatherData.main?.temp;

function handlelang(){
  if(lang ==="ar"){
 i18n.changeLanguage('en')
 Setlang('en')
  

  }else{
     i18n.changeLanguage('ar')
 Setlang('ar')

  }
 

}

 function fetchWeather() {
  if (city.trim() !== "") {
    axios
      .get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${key}`
      )
      .then(function (res) {
        // لو البيانات راجعة فاضية، يعني المدينة غلط
        if (res.data.length === 0) {
          alert(" اسم المدينة غير صحيح، حاول مرة تانية");
          return;
        }

        const fetchData = res.data[0];
        setGeoData(fetchData);

        console.log("==== GEO Data ====");
        console.log(fetchData);
      })
      .catch(function (error) {
        console.log("خطأ أثناء الاتصال بـ API:", error);
        alert("حدث خطأ أثناء الاتصال بالخادم!");
      });
  } else {
    alert(" من فضلك اكتب اسم المدينة أولًا");
  }
}


useEffect(()=>{
   moment.locale(lang); 
   setDate(moment().format("dddd - Do MMM - YYYY"));
   // eslint-disable-next-line
 },[lang])

useEffect(() => {

  setDate(moment().format(" dddd - Do  MMM  - YYYY"))
  axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`,
      {
        cancelToken: new axios.CancelToken((can) => {
          cancel = can;
        }),
      }
    )
    .then(function (response) {
      console.log("====run server fetch data====");

      const data = response.data;
      setWeatherData({
        ...data,
        temp: Math.round(data.main.temp - 273.15),
        min: Math.round(data.main.temp_min - 273.15),
        max: Math.ceil(data.main.temp_max - 273.15),
        dis: data.weather[0].description,
        icon: data.weather[0].icon,
      });
      console.log(weatherData.temp);
    })
    .catch((error) => {
      if (axios.isCancel(error)) {
        console.log(" تم إلغاء الاتصال بشكل طبيعي");
      } else {
        console.error(" خطأ أثناء جلب البيانات:", error);
      }
    });

  return () => {
    cancel();
    console.log("Cancel Connection");
  };
  // eslint-disable-next-line
}, [geoData]);

  return (
    <Container maxWidth="sm">
      <Card
        sx={{
          padding: "10px",
          background: "rgba(30, 20, 212, 0.4)",
          color: "white",
          borderRadius: "12px",
          boxShadow: "0px 0px 7px rgba(0,0,0,0.4)",
        }}
      >
      <TextField
  value={city}
  onChange={(e) => SetCity(e.target.value)}
  onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
  placeholder="اكتب اسم المدينة"
  variant="outlined"
  sx={{
    mt: 2,
    mb: 2,
    width: "100%",
    bgcolor: "rgba(255,255,255,0.1)",
    borderRadius: 2,
    "& .MuiOutlinedInput-root": {
      "& fieldset, &:hover fieldset, &.Mui-focused fieldset": { border: "none" },
      color: "white",
    },
    "& input": { color: "white", textAlign: "center" },
  }}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <Button sx={{ color: "white" }} onClick={fetchWeather}>
          <SearchIcon />
          {t('بحث')}
        </Button>
      </InputAdornment>
    ),
  }}
/>



        {/* Header */}
        <div
          style={{
            display: "flex",
            direction: direction,
            alignItems: "center",
          }}
        >
          <Typography variant="h2" dir={direction} sx={{ ml: "30px" }}>
            {t(geoData.name)}
          </Typography>

          <Typography variant="h5" dir={direction} sx={{ mt: "30px" }}>
         {date}
          </Typography>

        </div>
        <hr />

        {/* body */}
        <div
          style={{
            display: "flex",
            justifyContent: "start",
            direction: direction,
            padding: "10px",
            // background:"green",
            position: "relative",
          }}
        >
          {/* right */}
          <div
            style={{
              display: "flex",

              flexDirection: "column",
              //  background:"red",
              alignItems: "flex-start",
            }}
          >
            <Typography variant="h2">
              {weatherData.temp}
   <img
                src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
                alt="weather"
                style={{ width: "100px" }}
              />
            </Typography>
            <Typography variant="h5" dir="rtl">
             {t(weatherData.dis)}
            </Typography>
            <Typography variant="p" dir="ltr" sx={{ mt: "40px", ml: "0px" }}>
            {weatherData.max} : {t('min')} : {weatherData.min} &nbsp;   |&nbsp; {t('max')}
            </Typography>
          </div>

          {/* left */}
          <div
            style={{
              direction: direction,
              // position: "absolute",
              // right: "63%",
              // bottom:"60px",
             display:"flex",
             justifyContent:"end",
             alignItems:"center",
             width:"40%"
            }}
          >
            <CloudIcon sx={{ fontSize: "120px" }} />
          </div>
        </div>
        {/* == body */}
      </Card>

      <Button
        sx={{
          fontFamily: "IBM",
          fontSize: "20px",
          color: "white",
          mt: "10px",
          ml: "20px",
          mr: "auto",
        }}
        variant="text"
        onClick={handlelang}
      >
       {lang ==="ar"?" انجليزي":"Arabic"}
      </Button>
    </Container>
  );
}
