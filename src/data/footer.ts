export type FooterField = {
  group: string;
  key: string;
  label: string;
  fallback: string;
  multiline?: boolean;
};

export const footerFields: FooterField[] = [
  { group: "Introduction", key: "footer_name", label: "Gallery name", fallback: "Voxartgallery" },
  {
    group: "Introduction",
    key: "footer_tagline",
    label: "Introduction",
    fallback: "Voxartgallery presents contemporary art. TAO BUTAO is one of its artists, crumpling metal into reliefs. Exhibitions include Resilience and Blueprint.",
    multiline: true,
  },
  { group: "Social", key: "instagram_url", label: "Instagram URL", fallback: "https://www.instagram.com/tao_butao" },
  { group: "Social", key: "facebook_url", label: "Facebook URL", fallback: "https://www.facebook.com/taobutao82" },
  { group: "Explore", key: "footer_explore_label", label: "Column heading", fallback: "Explore" },
  { group: "Explore", key: "footer_link_auctions", label: "Auctions", fallback: "Auctions" },
  { group: "Explore", key: "footer_link_exhibitions", label: "Exhibitions", fallback: "Exhibitions" },
  { group: "Explore", key: "footer_link_artists", label: "Artists", fallback: "Artists" },
  { group: "Explore", key: "footer_link_stories", label: "Stories", fallback: "Stories" },
  { group: "Explore", key: "footer_link_galleries", label: "Our galleries", fallback: "Our galleries" },
  { group: "Services", key: "footer_services_label", label: "Column heading", fallback: "Services" },
  { group: "Services", key: "footer_link_buy", label: "How to buy", fallback: "How to buy" },
  { group: "Services", key: "footer_link_sell", label: "How to sell", fallback: "How to sell" },
  { group: "Services", key: "footer_link_estimate", label: "Request an estimate", fallback: "Request an estimate" },
  { group: "Services", key: "footer_link_contact", label: "Contact us", fallback: "Contact us" },
  { group: "Services", key: "footer_link_faq", label: "FAQ", fallback: "FAQ" },
  { group: "Services", key: "footer_link_about", label: "About us", fallback: "About us" },
  { group: "Visit", key: "footer_client_label", label: "Desktop column heading", fallback: "Client services" },
  { group: "Visit", key: "footer_visit_label", label: "Visit heading", fallback: "Visit" },
  {
    group: "Visit",
    key: "gallery_address",
    label: "Address, one line each",
    fallback: "Art Anton, G/F, S Maison at Conrad\nMarina Way, MOA Complex\n1300 Pasay City, PH",
    multiline: true,
  },
  { group: "Visit", key: "contact_phone", label: "Phone", fallback: "" },
  { group: "Visit", key: "footer_enquiries_label", label: "Enquiries heading", fallback: "Enquiries" },
  { group: "Visit", key: "contact_email", label: "Email shown in the footer", fallback: "tommydreamchaser@gmail.com" },
  { group: "Visit", key: "contact_mailto", label: "Email link", fallback: "mailto:tommydreamchaser@gmail.com" },
  { group: "Visit", key: "footer_hours_label", label: "Office hours heading", fallback: "Office hours" },
  { group: "Visit", key: "visit_hours", label: "Office hours, one line each", fallback: "Visits follow the exhibition schedule.", multiline: true },
  { group: "Bottom line", key: "footer_copyright", label: "Copyright", fallback: "© MMXXVI · Voxartgallery" },
  { group: "Bottom line", key: "footer_credit", label: "Credit", fallback: "Designed by Tomiwa Olaide" },
];
