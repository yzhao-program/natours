/* eslint-disable */
export const displayMap = (locations) => {
  let map = L.map('map', { doubleClickZoom: 'center' });
  map.zoomControl.setPosition('topright');

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const positions = [];
  locations.forEach((loc) => {
    const position = [loc.coordinates[1], loc.coordinates[0]];
    positions.push(position);
    L.marker(position)
      .addTo(map)
      .bindPopup(`<h1>Day ${loc.day}: ${loc.description}</h1>`, {
        autoClose: false,
      })
      .openPopup();
  });

  const bounds = L.latLngBounds(positions).pad(0.5);
  map.fitBounds(bounds);

  map.scrollWheelZoom.disable();
};
