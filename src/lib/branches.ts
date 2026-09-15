export const branches = [
  {
    id: "aviacion-civil",
    mapsUrl: "https://maps.app.goo.gl/eFiFQdVjH1j1cmr86",
    name: "Barbería Carlyn — Sucursal Aviación Civil",
    address: "Adolfo López Mateos 33, Aviación Civil, 43000 Huejutla de Reyes, Hgo.",
    barber: "Jael",
    hours: "Lunes a sábado: 9:00 AM - 8:00 PM",
    featured: true,
  },
  {
    id: "ex-glorieta",
    mapsUrl: "https://maps.app.goo.gl/gXseXXVcrJTq7D7d8",
    name: "Barbería Carlyn — Sucursal Ex-Glorieta",
    address: "Carretera Nacional México-Tampico Km 215 4, Santa Irene, 43000 Huejutla de Reyes, Hgo.",
    barber: "Chucky Barber",
    hours: "Jueves a Martes: 9:00 AM - 8:00 PM",
    featured: false,
  },
  {
    id: "tecoluco",
    mapsUrl: "https://maps.app.goo.gl/71zFemsin8cXQpyX9",
    name: "Barbería Carlyn — Sucursal Tecoluco",
    address: "Huejutla Tamazunchale 5 de Mayo, 43000 Huejutla de Reyes, Hgo.",
    barber: "Johan",
    hours: "Lunes a sábado: 9:00 AM - 8:00 PM",
    featured: false,
  },
];

export const studioMapsUrl = "https://maps.app.goo.gl/ENEbUNng6wBGMJfW6";

export function branchMapsLink(branch: { mapsUrl: string }) {
  return branch.mapsUrl;
}
