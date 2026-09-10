export const branches = [
  {
    id: "aviacion-civil",
    name: "Barbería Carlyn — Sucursal Aviación Civil",
    address: "Adolfo López Mateos 33, Aviación Civil, 43000 Huejutla de Reyes, Hgo.",
    barber: "Jael",
    hours: "Lunes a sábado: 9:00 AM - 8:00 PM",
    featured: true,
  },
  {
    id: "ex-glorieta",
    name: "Barbería Carlyn — Sucursal Ex-Glorieta",
    address: "Carretera Nacional México-Tampico Km 215 4, Santa Irene, 43000 Huejutla de Reyes, Hgo.",
    barber: "Chucky Barber",
    hours: "Martes a Jueves: 9:00 AM - 8:00 PM",
    featured: false,
  },
  {
    id: "tecoluco",
    name: "Barbería Carlyn — Sucursal Tecoluco",
    address: "Huejutla Tamazunchale 5 de Mayo, 43000 Huejutla de Reyes, Hgo.",
    barber: "Johan",
    hours: "Lunes a sábado: 9:00 AM - 8:00 PM",
    featured: false,
  },
];

export function branchMapsLink(branch: { name: string; address: string }) {
  return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(branch.name + ", " + branch.address);
}
