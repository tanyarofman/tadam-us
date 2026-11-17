export const SITE = {
  // International format, digits only. Temporary: Ilan's number (054-2428362) until there is a business line.
  whatsappNumber: "972542428362",
  whatsappMessage: "היי! אשמח לשמוע על טדאם! לאירוע שלנו",
  /** Contact emails (privacy page). Lead-form submissions are emailed to both by Netlify (Forms → notifications). */
  contactEmails: ["tanyarofman@gmail.com", "leibov@gmail.com"],
  /** WhatsApp number as people read it */
  whatsappDisplay: "054-2428362",
};

export const whatsappLink = (text = SITE.whatsappMessage) =>
  `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(text)}`;
