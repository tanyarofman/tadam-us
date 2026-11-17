export const SITE = {
  // International format, digits only. Temporary: Ilan's number (054-2428362) until there is a business line.
  whatsappNumber: "972542428362",
  whatsappMessage: "היי! אשמח לשמוע על טדאם! לאירוע שלנו",
};

export const whatsappLink = (text = SITE.whatsappMessage) =>
  `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(text)}`;
