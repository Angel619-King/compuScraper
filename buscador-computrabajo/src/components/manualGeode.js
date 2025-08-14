// Este archivo proporciona una base de datos manual de coordenadas para ubicaciones comunes.
// Su propósito es acelerar el proceso de geocodificación y reducir la dependencia de APIs externas.

export const manualCoordinates = {
  // Ciudad de México y zonas
  'ciudad de mexico': { lat: 19.4326, lng: -99.1332 },
  'cdmx': { lat: 19.4326, lng: -99.1332 },
  'mexico city': { lat: 19.4326, lng: -99.1332 },
  'df': { lat: 19.4326, lng: -99.1332 },
  'el retono': { lat: 19.371773, lng: -99.1249 },
  'ampliacion las aguilas': { lat: 19.4326, lng: -99.1332 },
  'azcapotzalco': { lat: 19.4877, lng: -99.1817 },
  'mariano escobedo': { lat: 19.4453, lng: -99.1814 },
  'bosques de tetlameya': { lat: 19.2987, lng: -99.1540 },
  'santa fe': { lat: 19.3598, lng: -99.2598 },
  'polanco': { lat: 19.4338, lng: -99.1964 },
  'roma norte': { lat: 19.4189, lng: -99.1677 },
  'roma': { lat: 19.4189, lng: -99.1677 },
  'condesa': { lat: 19.4103, lng: -99.1712 },
  'centro historico': { lat: 19.4342, lng: -99.1386 },
  'centro': { lat: 19.4342, lng: -99.1386 },
  'coyoacan': { lat: 19.3467, lng: -99.1618 },
  'del valle': { lat: 19.3906, lng: -99.1656 },
  'insurgentes sur': { lat: 19.3715, lng: -99.1624 },
  'insurgentes': { lat: 19.3715, lng: -99.1624 },
  'zona rosa': { lat: 19.4242, lng: -99.1647 },
  'benito juarez': { lat: 19.3723, lng: -99.1590 },
  'miguel hidalgo': { lat: 19.4267, lng: -99.2028 },
  'cuauhtemoc': { lat: 19.4342, lng: -99.1386 },
  'alvaro obregon': { lat: 19.3598, lng: -99.2598 },
  'naucalpan': { lat: 19.4786, lng: -99.2386 },
  'tlalnepantla': { lat: 19.5398, lng: -99.1954 },
  'tlalpan' : {lat :19.244786,lng: -99.2009},
  'nezahualcoyotl': { lat: 19.4006, lng: -99.0152 },
  'ecatepec': { lat: 19.6019, lng: -99.0609 },
  
  // Estados principales
  'guadalajara': { lat: 20.6597, lng: -103.3496 },
  'gdl': { lat: 20.6597, lng: -103.3496 },
  'jalisco': { lat: 20.6597, lng: -103.3496 },
  'zapopan': { lat: 20.7214, lng: -103.3918 },
  
  'monterrey': { lat: 25.6866, lng: -100.3161 },
  'mty': { lat: 25.6866, lng: -100.3161 },
  'nuevo leon': { lat: 25.6866, lng: -100.3161 },
  'san pedro garza garcia': { lat: 25.6488, lng: -100.4079 },
  'san pedro': { lat: 25.6488, lng: -100.4079 },
  'santa catarina': { lat: 25.6744, lng: -100.4593 },
  
  'queretaro': { lat: 20.5888, lng: -100.3899 },
  'qro': { lat: 20.5888, lng: -100.3899 },
  'qto': { lat: 20.5888, lng: -100.3899 },
  
  'puebla': { lat: 19.0414, lng: -98.2063 },
  'heroica puebla de zaragoza': { lat: 19.0414, lng: -98.2063 },
  
  'tijuana': { lat: 32.5149, lng: -117.0382 },
  'baja california': { lat: 32.5149, lng: -117.0382 },
  
  'cancun': { lat: 21.1619, lng: -86.8515 },
  'quintana roo': { lat: 21.1619, lng: -86.8515 },
  'playa del carmen': { lat: 20.6296, lng: -87.0739 },
  
  'merida': { lat: 20.9674, lng: -89.5926 },
  'yucatan': { lat: 20.9674, lng: -89.5926 },
  
  'aguascalientes': { lat: 21.8853, lng: -102.2916 },
  'ags': { lat: 21.8853, lng: -102.2916 },
  
  'leon': { lat: 21.1250, lng: -101.6890 },
  'guanajuato': { lat: 21.0190, lng: -101.2574 },
  'gto': { lat: 21.0190, lng: -101.2574 },
  'celaya': { lat: 20.5289, lng: -100.8157 },
  'irapuato': { lat: 20.6767, lng: -101.3542 },
  
  'morelia': { lat: 19.7069, lng: -101.1955 },
  'michoacan': { lat: 19.7069, lng: -101.1955 },
  
  'toluca': { lat: 19.2926, lng: -99.6568 },
  'estado de mexico': { lat: 19.2926, lng: -99.6568 },
  'edomex': { lat: 19.2926, lng: -99.6568 },
  'metepec': { lat: 19.2665, lng: -99.6025 },
  
  'cuernavaca': { lat: 18.9186, lng: -99.2342 },
  'morelos': { lat: 18.9186, lng: -99.2342 },
  
  'pachuca': { lat: 20.1011, lng: -98.7591 },
  'hidalgo': { lat: 20.1011, lng: -98.7591 },
  
  'xalapa': { lat: 19.5438, lng: -96.9102 },
  'veracruz': { lat: 19.1738, lng: -96.1342 },
  'ver': { lat: 19.1738, lng: -96.1342 },
  'coatzacoalcos': { lat: 18.1340, lng: -94.4610 },
  
  'oaxaca': { lat: 17.0732, lng: -96.7266 },
  'oax': { lat: 17.0732, lng: -96.7266 },
  
  'chihuahua': { lat: 28.6353, lng: -106.0889 },
  'chih': { lat: 28.6353, lng: -106.0889 },
  'ciudad juarez': { lat: 31.6904, lng: -106.4245 },
  
  'hermosillo': { lat: 29.0729, lng: -110.9559 },
  'sonora': { lat: 29.0729, lng: -110.9559 },
  
  'saltillo': { lat: 25.4232, lng: -101.0053 },
  'coahuila': { lat: 25.4232, lng: -101.0053 },
  'torreon': { lat: 25.5428, lng: -103.4068 },
  
  'san luis potosi': { lat: 22.1565, lng: -100.9855 },
  'slp': { lat: 22.1565, lng: -100.9855 },
  
  'tampico': { lat: 22.2906, lng: -97.8375 },
  'tamaulipas': { lat: 22.2906, lng: -97.8375 },
  'reynosa': { lat: 26.0734, lng: -98.2841 },
  'matamoros': { lat: 25.8699, lng: -97.5046 },
  
  'mexicali': { lat: 32.6245, lng: -115.4523 },
  'ensenada': { lat: 31.8667, lng: -116.5833 },
  
  'culiacan': { lat: 24.7993, lng: -107.3938 },
  'sinaloa': { lat: 24.7993, lng: -107.3938 },
  'mazatlan': { lat: 23.2494, lng: -106.4103 },
  
  'durango': { lat: 24.0277, lng: -104.6532 },
  'dgo': { lat: 24.0277, lng: -104.6532 },
  
  'zacatecas': { lat: 22.7674, lng: -102.5833 },
  'zac': { lat: 22.7674, lng: -102.5833 },
  
  'villahermosa': { lat: 17.9892, lng: -92.9475 },
  'tabasco': { lat: 17.9892, lng: -92.9475 },
  
  'tuxtla gutierrez': { lat: 16.7516, lng: -93.1161 },
  'chiapas': { lat: 16.7516, lng: -93.1161 },
  
  'campeche': { lat: 19.8301, lng: -90.5349 },
  'camp': { lat: 19.8301, lng: -90.5349 },
  
  'la paz': { lat: 24.1426, lng: -110.3128 },
  'baja california sur': { lat: 24.1426, lng: -110.3128 },
  'bcs': { lat: 24.1426, lng: -110.3128 },
  
  'colima': { lat: 19.2433, lng: -103.7240 },
  'col': { lat: 19.2433, lng: -103.7240 },
  'manzanillo': { lat: 19.1141, lng: -104.3188 },
  
  'tepic': { lat: 21.5041, lng: -104.8955 },
  'nayarit': { lat: 21.5041, lng: -104.8955 },
  
  'tlaxcala': { lat: 19.3139, lng: -98.2404 },
  'tlax': { lat: 19.3139, lng: -98.2404 }
};

// Esta función limpia el texto de la ubicación para que pueda ser comparado
// con las claves del objeto manualCoordinates.
const cleanLocationForMapping = (ubicacion) => {
  if (!ubicacion || ubicacion === "No disponible") {
    return null;
  }
  return ubicacion
    .toLowerCase()
    .replace(/^en\s*/i, '') // Elimina la palabra "en " al inicio
    .replace(/\s*,.*$/, '') // Elimina todo lo que viene después de la primera coma
    .replace(/\s+/g, ' ')   // Reemplaza múltiples espacios por uno solo
    .replace(/[áàâä]/g, 'a')
    .replace(/[éèêë]/g, 'e')
    .replace(/[íìîï]/g, 'i')
    .replace(/[óòôö]/g, 'o')
    .replace(/[úùûü]/g, 'u')
    .replace(/ñ/g, 'n')
    .trim();
};

// Esta es la función principal que busca las coordenadas manualmente.
// Retorna las coordenadas si las encuentra, de lo contrario retorna null.
export const geocodeLocationManual = (ubicacion) => {
  const cleaned = cleanLocationForMapping(ubicacion);
  
  if (!cleaned) {
    console.log(`Ubicación no válida: "${ubicacion}"`);
    return null;
  }

  // Buscar coincidencia exacta
  if (manualCoordinates[cleaned]) {
    const coords = manualCoordinates[cleaned];
    console.log(`🎉 Encontrado en coordenadas manuales: "${ubicacion}" -> [${coords.lat}, ${coords.lng}]`);
    return coords;
  }

  // Buscar coincidencia parcial (la ubicación contiene una palabra clave del mapa)
  for (const [key, coords] of Object.entries(manualCoordinates)) {
    if (cleaned.includes(key)) {
      console.log(`🎉 Coincidencia parcial en manual: "${ubicacion}" contiene "${key}" -> [${coords.lat}, ${coords.lng}]`);
      return coords;
    }
  }

  // Buscar coincidencia parcial inversa (la palabra clave contiene la ubicación)
  for (const [key, coords] of Object.entries(manualCoordinates)) {
    if (key.includes(cleaned)) {
      console.log(`🎉 Coincidencia parcial en manual: "${key}" contiene "${cleaned}" -> [${coords.lat}, ${coords.lng}]`);
      return coords;
    }
  }

  console.log(`🔎 No se encontró en coordenadas manuales: "${cleaned}". Se intentará con la API externa.`);
  return null;
};
