<template>
  <div class="bg-surface p-6 rounded-2xl shadow-sm border border-line mt-8">
    <h4 class="font-bold text-ink mb-4 text-sm flex items-center gap-2">
      <svg class="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
      Ruta Histórica
    </h4>

    <div id="biblical-map" class="h-[400px] w-full rounded-xl z-0 relative shadow-inner"></div>

    <p class="text-[10px] text-ink-faint mt-3 text-center uppercase tracking-wider">Trayectoria cronológica del personaje</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

const props = defineProps({
  locations: {
    type: Array,
    required: true
  }
})

onMounted(async () => {
  if (process.client && props.locations && props.locations.length > 0) {
    
    const L = (await import('leaflet')).default
    await import('leaflet/dist/leaflet.css')

    const map = L.map('biblical-map', { attributionControl: false })
    
    // Nueva capa base de CARTO (Más limpia, con nombres internacionales/español)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors © CARTO'
    }).addTo(map)

    const latlngs = []

    // Iteramos para crear los marcadores numerados
    props.locations.forEach((loc, index) => {
      const point = [loc.lat, loc.lng]
      latlngs.push(point)
      
      // Creación del icono dinámico con el número correspondiente (1, 2, 3...)
      const numberedIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #146B63; color: white; width: 28px; height: 28px; border-radius: 50%; border: 2px solid white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2); display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 13px;">${index + 1}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14], // Centra el círculo exacto en la coordenada
        popupAnchor: [0, -14]
      })
      
      L.marker(point, { icon: numberedIcon }).addTo(map)
        .bindPopup(`<div class="text-center"><b style="color:#146B63" class="block mb-1">Paso ${index + 1}</b> ${loc.name}</div>`)
    })

    // Dibujar la trayectoria
    if (latlngs.length > 1) {
      const polyline = L.polyline(latlngs, { 
        color: '#146B63',
        weight: 3, 
        dashArray: '8, 8', // Patrón de guiones más elegante
        opacity: 0.8
      }).addTo(map)
      
      // Enfocar el mapa con un poco más de "padding" para que los marcadores no toquen los bordes
      map.fitBounds(polyline.getBounds(), { padding: [50, 50] })
    } else if (latlngs.length === 1) {
      map.setView(latlngs[0], 6)
    }
  }
})
</script>

<style>
/* Forzar que el mapa respete los bordes redondeados y limpiar clases nativas */
.leaflet-container {
  border-radius: 0.75rem;
  z-index: 10;
}
.custom-div-icon {
  background: transparent;
  border: none;
}
</style>