const storage = chrome.storage.local;

const tabs = await chrome.tabs.query({currentWindow: true});
const currentUrls = tabs.map((tab) => tab.url);
const currentTabs = {
  stringID: generateString(),
  urls: currentUrls
}

function generateString() {
  const randomIndex = Math.floor(Math.random() * emojis.length);
  return emojis[randomIndex];
}

function getRandomEmoji() {
  const randomIndex = Math.floor(Math.random() * emojis.length);
  return emojis[randomIndex];
}

function getLocationName() {

  if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(async (position) => {

      const { latitude, longitude } = position.coords;
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng= ${latitude},${longitude}&key=AIzaSyCEhVHgTYBu8jnphrWEMZH4Jb-yM-4rmQE`);
      const data = await response.json();

      // Access first result
      if (data.results.length === 0) {
        console.log("No results found.");
      }
      else {
        const result = data.results[0];

        // Filter components of the address that we want
        const requiredTypes = ["neighborhood", "sublocality", "locality", "administrative_area_level_7", "administrative_area_level_6", "administrative_area_level_5", "administrative_area_level_4", "administrative_area_level_3", "administrative_area_level_2", "administrative_area_level_1", "country"];

        const placeName = result.address_components.find(component =>
          component.types.some(type => requiredTypes.includes(type))
        )?.long_name || null;

        const placeNameElement = document.getElementById("placeName");
        placeNameElement.textContent = placeName;
        return placeName;
      }
    });
  }
  else {
    console.log('Geolocation is not supported');
  }
}

function getDate() {
  const currentDate = new Date();
  return currentDate.toLocaleDateString();
}

storage.set({ savedUrls: currentUrls }, function() {
  console.log('URLs saved successfully');
});

storage.get('savedUrls', function(result) {
  const savedUrls = result.savedUrls;
  console.log('Retrieved URLs:', savedUrls);
});

const template = document.getElementById("listItemTemplate");
const elements = new Set();