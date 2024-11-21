// Inicializar o mapa
const map = L.map('map').setView([-15.7942, -47.8822], 4); // Coordenadas iniciais (Brasil)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Selecionar o elemento de hover
const hoverImage = document.getElementById('hover-image');

// Função para carregar os dados CSV
function loadCSVData(csvFile) {
    console.log(`Carregando arquivo CSV: ${csvFile}`);
    Papa.parse(csvFile, {
        download: true,
        header: true,
        complete: function(results) {
            console.log('Dados carregados:', results.data);
            addMarkers(results.data);
        },
        error: function(error) {
            console.error("Erro ao carregar CSV:", error);
        }
    });
}

// Adicionar marcadores no mapa
function addMarkers(data) {
    if (!data || data.length === 0) {
        console.error("Nenhum dado disponível para exibir marcadores.");
        return;
    }

    data.forEach(location => {
        if (location.lat && location.lng) {
            const lat = parseFloat(location.lat);
            const lng = parseFloat(location.lng);

            if (isNaN(lat) || isNaN(lng)) {
                console.warn(`Coordenadas inválidas para: ${location.name}`);
                return;
            }

            const marker = L.marker([lat, lng]).addTo(map);

            // Eventos de mouse para exibir/ocultar a imagem
            marker.on('mouseover', function(e) {
                console.log(`Mouse sobre: ${location.name}`);
                hoverImage.src = location.image; // Atualizar a fonte da imagem
                hoverImage.style.left = `${e.originalEvent.pageX + 10}px`;
                hoverImage.style.top = `${e.originalEvent.pageY + 10}px`;
                hoverImage.style.display = 'block';
            });

            marker.on('mousemove', function(e) {
                hoverImage.style.left = `${e.originalEvent.pageX + 10}px`;
                hoverImage.style.top = `${e.originalEvent.pageY + 10}px`;
            });

            marker.on('mouseout', function() {
                hoverImage.style.display = 'none'; // Esconder a imagem
            });
        } else {
            console.warn("Dados insuficientes para criar marcador:", location);
        }
    });
}

// Carregar o arquivo CSV (substitua pelo caminho do seu arquivo)
loadCSVData('locations.csv');
