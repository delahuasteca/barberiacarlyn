export function whatsappLink(message = "Hola, quiero agendar con Carlyn.") {
  return `https://wa.me/527712613445?text=${encodeURIComponent(message)}`;
}
