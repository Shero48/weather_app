let city = document.getElementById("text");
let detail = document.getElementsByClassName("detail");
let area;
let load = false;
let api='weather-api_key';
const clear = "./image/sun.png";
const snow = "./image/snow.png";
const rain = "./image/rain.png";
const cloud = "./image/cloud.png";
const drizzle = "./image/drizzle_or_rain.png";
let deg = false;
let degree;
const weatheicon = {
  "01d": clear,
  "01n": clear,
  "02d": cloud,
  "02n": cloud,
  "03d": drizzle,
  "03n": cloud,
  "04d": drizzle,
  "04n": drizzle,
  "09d": rain,
  "09n": rain,
  "10d": rain,
  "10n": rain,
  "13d": snow,
  "10n": snow,
};
let err_msg = `<div class="icon"><i class="fa-solid fa-circle-exclamation"></i></div>
<span class="warn">Location not found</span>`;
const get_loc = () => {
  load = true;
  detail[0].innerHTML = "Please wait ...";
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=${api}`)
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      area = res;
      city.value = "";
      load = false;
      console.log(area, load);
      detail[0].innerHTML = "";
      degree = ((area.wind.deg - 32) * 5) / 9;
      value = deg ? `${degree}°F` : `${area.wind.deg}°C`;
      display();
    })
    .catch((err) => (detail[0].innerHTML = err_msg));
};
const cur_pos = () => {
  let isloc = false;

  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
  navigator.permissions
    .query({ name: "geolocation" })
    .then((res) => {
      console.log(res);
      if (res.state == "denied") {
        alert("Enable your location");
        return;
      } else {
        isloc = true;
        console.log(isloc);
        if (isloc == true) {
          console.log("run");
          detail[0].innerHTML = "Please wait ...";
          navigator.geolocation.getCurrentPosition(success, error, options);
          function success(pos) {
            console.log(pos.coords.latitude);
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&appid=${api}`)
              .then((res) => {
                return res.json();
              })
              .then((res) => {
                area = res;
                load = false;
                console.log(area, load);
                detail[0].innerHTML = "";
                degree = ((area.wind.deg - 32) * 5) / 9;
                value = deg ? `${degree}°F` : `${area.wind.deg}°C`;
                display();
              })
              .catch((err) => (detail[0].innerHTML = err_msg));
          }
          function error(err) {
            console.log(err);
          }
        }
      }
    })
    .catch((err) => console.log(err));
};
let value;
const change = () => {
  deg = deg ? false : true;
  value = deg ? `${degree}°F` : `${area.wind.deg}°C`;
  console.log(value, deg);
};
const display = () => {
  if ((load == false && area != undefined) || "") {
    console.log(area, "area");
    console.log(24 % new Date().getHours(area.sys.sunrise));
    let sunrise = 24 % new Date().getHours(area.sys.sunrise);
    let sunset = 24 % new Date().getHours(area.sys.sunset);
    degree = ((area.wind.deg - 32) * 5) / 9;
    let output = `<h2>${area.weather[0].main}</h2>
                <div class="image">
                    <img src=${
                      weatheicon[area.weather[0].icon] || clear
                    } title="weather_image"/>
                </div>
                <h1>${area.name}</h1>
                <h2>${area.sys.country}</h2>
                <div onclick='change()'>${value}</div>
                <div class="footer">
                    <div class="gri">
                        <div class="tit">sunrise</div>
                        <span class="val">${sunrise} am</span>
                    </div>
                    <div class="gri">
                        <div class="tit">sunset</div>
                        <span class="val">${sunset} pm</span>
                    </div>
                    <div class="gri">
                        <div class="tit">wind</div>
                        <span class="val">${area.wind.speed} km/h</span>
                    </div>
                    <div class="gri">
                        <div class="tit">humidity</div>
                        <span class="val">${area.main.humidity}%</span>
                    </div>
                </div>`;
    console.log(area.cod);
    detail[0].innerHTML = area.cod == 404 ? err_msg : output;
  } 
};
