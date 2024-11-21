// Inicializar o mapa
const map = L.map('map').setView([-15.7942, -47.8822], 4); // Coordenadas iniciais (Brasil)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Função para carregar os dados CSV
function loadCSVData(csvFile) {
    Papa.parse(csvFile, {
        download: true,
        header: true,
        complete: function(results) {
            addMarkers(results.data);
        },
        error: function(error) {
            console.error("Erro ao carregar CSV:", error);
        }
    });
}

// Adicionar marcadores no mapa
function addMarkers(data) {
    data.forEach(location => {
        if (location.lat && location.lng) {
            const lat = parseFloat(location.lat);
            const lng = parseFloat(location.lng);

            if (isNaN(lat) || isNaN(lng)) {
                console.warn(`Coordenadas inválidas para: ${location.name}`);
                return;
            }

            // Conteúdo do popup com a imagem
            const popupContent = `
                <div>
                    <h4>${location.name}</h4>
                    <img src="${location.image}" alt="${location.name}" class="popup-image" />
                </div>
            `;

            // Criar marcador e vincular popup
            const marker = L.marker([lat, lng]).addTo(map);
            marker.bindPopup(popupContent);
        } else {
            console.warn("Dados insuficientes para criar marcador:", location);
        }
    });
}

// Carregar o arquivo CSV (substitua pelo caminho do seu arquivo)
loadCSVData('locations.csv');
