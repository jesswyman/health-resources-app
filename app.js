function initMap(listener) {
  // Create the map.
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
    center: {lat: 42.032974, lng: -93.581543},
    mapId: 'a529bfebe6b1be4b',
  });

  // Load the stores GeoJSON onto the map.
  map.data.loadGeoJson('resources.geojson', {idPropertyName: 'ID'});

  const apiKey = '';
  const infoWindow = new google.maps.InfoWindow();

  // Show the information for a store when its marker is clicked.
  map.data.addListener('click', (event) => {
    const name = event.feature.getProperty('Name');
    const address = event.feature.getProperty('Full Address');
    const phone = event.feature.getProperty('Phone Number');
    const website = event.feature.getProperty('Website');
    const position = event.feature.getGeometry().get();
    const content = `
      <h2>${name}</h2><p>${address}</p>
      <p><b>Phone:</b> ${phone}<br/><b>Website:</b> ${website}</p>
    `;

    infoWindow.setContent(content);
    infoWindow.setPosition(position);
    infoWindow.setOptions({pixelOffset: new google.maps.Size(0, -30)});
    infoWindow.open(map);
  })
  // Build and add the search bar
  const card = document.createElement('div');
  const titleBar = document.createElement('div');
  const title = document.createElement('div');
  const container = document.createElement('div');
  const input = document.createElement('input');
  const options = {
    types: ['address'],
    componentRestrictions: {country: 'us'},
  };

  card.setAttribute('id', 'pac-card');
  title.setAttribute('id', 'title');
  title.textContent = 'Find your nearest resources';
  titleBar.appendChild(title);
  container.setAttribute('id', 'pac-container');
  input.setAttribute('id', 'pac-input');
  input.setAttribute('type', 'text');
  input.setAttribute('placeholder', 'Enter an address');
  container.appendChild(input);
  card.appendChild(titleBar);
  card.appendChild(container);
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

  // Make the search bar into a Places Autocomplete search bar and select
  // which detail fields should be returned about the place that
  // the user selects from the suggestions.
  const autocomplete = new google.maps.places.Autocomplete(input, options);

  autocomplete.setFields(
      ['address_components', 'geometry', 'name']);

  // Set the origin point when the user selects an address
  const originMarker = new google.maps.Marker({map: map});
  originMarker.setVisible(false);
  let originLocation = map.getCenter();

  autocomplete.addListener('place_changed', async () => {
    originMarker.setVisible(false);
    originLocation = map.getCenter();
    const place = autocomplete.getPlace();

    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert('No address available for input: \'' + place.name + '\'');
      return;
    }

    // Recenter the map to the selected address
    originLocation = place.geometry.location;
    map.setCenter(originLocation);
    map.setZoom(15);
    console.log(place);

    originMarker.setPosition(originLocation);
    originMarker.setVisible(false);

    return;
  });

}

