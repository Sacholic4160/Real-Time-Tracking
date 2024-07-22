const socket = io();


const map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map)


const markers = {}

socket.on('initial-locations', (riders) => {
    riders.forEach(rider => {
        const marker = L.marker([rider.latitude, rider.longitude]).addTo(map).bindPopup(rider.name)
        markers[rider.id] = marker
    });
})

socket.on('update-location', (data) => {
    const { id, latitude, longitude } = data;
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);

    }
    else {
        const marker = L.marker([latitude, longitude]).addTo(map).bindPopup(data.name)
        markers[id] = marker
    }
})
socket.on('user-disconnected', (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id]
    }
})


if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            fetch('/update-location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: YOUR_RIDER_ID, latitude, longitude })
            });
        },
        (error) => {
            console.error('Error getting location', error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    )
}

