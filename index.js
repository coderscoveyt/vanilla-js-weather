const URL_CONST = "http://api.weatherapi.com/v1/current.json";

async function getData(url) {
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

const cityInput = document.querySelector(".search > input[type='search']");
const searchDiv = document.querySelector('.search');

async function displayData(url) {
  try {
    const data = await getData(url);
    if (data && data.error) return displayError(data?.error?.message);
    showData(data);
  } catch (error) {
    console.log("ERROR", { error });
  }
}

function showData({ current, location }) {
  removeAllMains();
  const item = document.createElement('main');
  item.classList.add('main-item');
  
  const conditionBlock = document.createElement('article');
  conditionBlock.classList.add('condition-block');
  const condImg = document.createElement('img');
  condImg.src = `https:${current.condition.icon}`;
  condImg.alt = current.condition.text;
  const condText = document.createElement('p');
  condText.textContent = current.condition.text;
  conditionBlock.appendChild(condImg);
  conditionBlock.appendChild(condText);

  const temperatureBlock = document.createElement('article');
  temperatureBlock.classList.add("temperature-block")
  const tempText = document.createTextNode(`It's currently ${current.temp_c}°C (${current.temp_f}°F), `);
  const tempFeelsLikeText = document.createTextNode(`but feels more like ${current.feelslike_c}°C (${current.feelslike_f}°F)`);
  temperatureBlock.appendChild(tempText);
  temperatureBlock.appendChild(tempFeelsLikeText);

  const windSpeedBlock = document.createElement('article');
  windSpeedBlock.classList.add("wind-block");
  const windText = document.createTextNode(`Wind: ${current.wind_kph} (${current.wind_mph}) / ${current.wind_dir}`);
  windSpeedBlock.appendChild(windText);
  
  const locationBlock = document.createElement('article');
  locationBlock.classList.add("location-block");
  const city = document.createTextNode(`${location.name}`);
  const country = document.createTextNode(`${location.country}, `);
  const geolocation = document.createElement('p');
  geolocation.textContent = `Lat: ${location.lat}, Lng: ${location.lon}`;
  locationBlock.appendChild(country);
  locationBlock.appendChild(city);
  locationBlock.appendChild(geolocation);

  item.appendChild(conditionBlock);
  item.appendChild(locationBlock);
  item.appendChild(temperatureBlock);
  item.appendChild(windSpeedBlock);

  document.body.insertAdjacentElement('afterend', item);
}

function displayError(msg = "Generic Error Message") {
  removeAllMains();
  const errorContainer = document.createElement("main");
  errorContainer.classList.add("error-container");
  const closeBtn = document.createElement('span');
  closeBtn.classList.add('error-close-btn');
  closeBtn.textContent = "✖";
  function closeBtnEvent() {
    errorContainer.remove();
    closeBtn.removeEventListener('click', closeBtnEvent);
  }
  closeBtn.addEventListener('click', closeBtnEvent);
  const paragraph = document.createTextNode(msg);
  errorContainer.appendChild(closeBtn);
  errorContainer.appendChild(paragraph);
  document.body.insertAdjacentElement('afterend', errorContainer);
}

// Event Listeners

cityInput.addEventListener('keydown', async (e) => {
  switch (e.key) {
    case "Enter":
      const text = cityInput.value;
      const newUrl = `${URL_CONST}?key=${API_KEY}&q=${text}&aqi=no`;
      await displayData(newUrl);
      break;
    default: break;
  }
});

// Utilities

function removeAllMains() {
  const mains = document.querySelectorAll('main');
  Array.from(mains).forEach((item) => item.remove());
}