const startClock = () => {
  const clockEl = document.querySelector('h1.clock');
  const hour = clockEl.querySelector('span.hour');
  const timeDivider = clockEl.querySelector('span.divider');
  const minutes = clockEl.querySelector('span.minutes');
  const dateEl = document.querySelector('.date h2');

  let currTime = new Date();
  const date = currTime.toLocaleString('en-GB', { dateStyle: 'short' });
  dateEl.textContent = date;
  hour.textContent = formatTime(currTime.getHours());
  minutes.textContent = formatTime(currTime.getMinutes());

  setInterval(() => {
    currTime = new Date();
    
    timeDivider.classList.toggle('hidden');
    hour.textContent = formatTime(currTime.getHours());
    minutes.textContent = formatTime(currTime.getMinutes());
  }, 1000);
}

formatTime = (num) => {
  if (num < 10) num = '0' + num;
  return num;
}

const getWeather = async (lat, long) => {
  res = await fetch(`https://api.weather.gov/points/${lat},${long}`).then(res => {
    return res.json();
  });

  weather = await fetch(res.properties.forecastHourly).then(res => {
    return res.json();
  });

  console.log('forecast obj: ', weather);
  setWeather(weather.properties.periods[0]);
}

const setWeather = (timePeriod) => {
  const weatherEl = document.querySelector('.info-bar .weather');
  const degreeCel = ((timePeriod.temperature - 32) * 0.555).toPrecision(2);
  const tempText = `${timePeriod.temperature}\xB0F / ${degreeCel}\xB0C`;
  let weatherIcon;

  switch(timePeriod.shortForecast) {
    case 'Sunny':
    case 'Mostly Sunny':
      weatherIcon = '<i class="fas fa-sun"></i>';
      break;
    case 'Mostly Cloudy':
    case 'Cloudy':
    case 'Isolated Snow Showers':
    case 'Slight Chance Snow Showers':
    case 'Slight Chance Rain And Snow Showers':
    case 'Isolated Rain Showers':
      weatherIcon = '<i class="fas fa-cloud"></i>';
      break;
    case 'Partly Sunny':
    case 'Partly Cloudy':
      weatherIcon = '<i class="fas fa-cloud-sun"></i>';
      break;
    case 'Rain Showers':
    case 'Rain Showers Likely':
    case 'Rain':
    case 'Light Rain':
    case 'Light Rain Likely':
    case 'Isolated Showers':
    case 'Isolated Thunderstorms':
    case 'Isolated Showers And Thunderstorms':
    case 'Slight Chance Showers And Thunderstorms':
    case 'Slight Chance Thunderstorms':
    case 'Chance Freezing Drizzle':
    case 'Freezing Drizzle':
      weatherIcon = '<i class="fas fa-cloud-rain"></i>';
      break;
    case 'Slight Chance Light Rain':
    case 'Slight Chance Rain Showers':
    case 'Scattered Rain Showers':
    case 'Scattered Rain Showers Likely':
    case 'Chance Rain Showers':
    case 'Chance Light Rain' :
    case 'Chance Rain And Snow Showers':
      weatherIcon = '<i class="fas fa-cloud-sun-rain"></i>';
      break;
    case 'Stormy':
    case 'Rain And Snow':
      weatherIcon = '<i class="fas fa-cloud-showers-heavy"></i>';
      break;
    case 'Scattered Snow Showers':
    case 'Chance Snow Showers':
    case 'Snow Showers Likely':
    case 'Rain And Snow Showers Likely':
    case 'Patchy Blowing Snow':
    case 'Slight Chance Light Snow':
    case 'Chance Light Snow':
    case 'Light Snow Likely':
    case 'Light Snow':
    case 'Snow':
    case 'Heavy Snow':
    case 'Snow And Areas Of Blowing Snow':
    case 'Heavy Snow And Areas Of Blowing Snow':
    case 'Blizzard':
      weatherIcon = '<i class="fas fa-snowflake"></i>';
      break;
    case 'Clear':
    case 'Mostly Clear':
    case 'Partly Clear':
      weatherIcon = '<i class="fas fa-moon"></i>';
      break;
    case 'Chance Showers And Thunderstorms':
    case 'Chance Thunderstorms':
    case 'Showers And Thunderstorms Likely':
    case 'Thunderstorms Likely':
    case 'Showers And Thunderstorms':
    case 'Thunderstorms':
      weatherIcon = '<i class="fas fa-bolt"></i>';
      break;
    default:
      weatherIcon = '<i class="fas fa-sun"></i>';
  }
  weatherEl.querySelector('span').innerHTML = `${weatherIcon}&ensp;${tempText}`;
  weatherEl.classList.toggle('hidden');
}

const handleWindowDrag = () => {
  const el = document.querySelector('section.main');
  const dragEl = document.querySelector('div.drag-bar');

  if (localStorage.getItem('windowPos')) {
    initialPos = JSON.parse(localStorage.getItem('windowPos'));
    el.style.top = initialPos.Y;
    el.style.left = initialPos.X;
  }
  let pos1 = 0, pos2 = 0, mousePos1 = 0, mousePos2 = 0;

  const closeDragElement = () => {
    document.onmouseup = null;
    document.onmousemove = null;
    initialPos = localStorage.setItem('windowPos', JSON.stringify({
      X: el.style.left,
      Y: el.style.top
    }));
  }
  
  const elementDrag = (e) => {
    e.preventDefault();
    pos1 = mousePos1 - e.clientX;
    pos2 = mousePos2 - e.clientY;
    mousePos1 = e.clientX;
    mousePos2 = e.clientY;
    el.style.top = (el.offsetTop - pos2) + "px";
    el.style.left = (el.offsetLeft - pos1) + "px";
  }

  const dragMouseDown = (e) => {
    e.preventDefault();
    mousePos1 = e.clientX;
    mousePos2 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  dragEl.onmousedown = dragMouseDown;
};

const init = async () => {
  const LAT = 41.3723;
  const LONG = -75.5434;

  startClock();
  await getWeather(LAT, LONG);
}

init();
handleWindowDrag();
