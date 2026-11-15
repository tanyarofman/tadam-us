export const SITE = {
  // TODO: replace with the real WhatsApp number (international format, digits only)
  whatsappNumber: "972500000000",
  whatsappMessage: "היי! אשמח לשמוע על טדאם! לאירוע שלנו",
};

export const whatsappLink = (text = SITE.whatsappMessage) =>
  `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(text)}`;
