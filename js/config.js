/* ============================================================
   STORE SETTINGS: the only file you need to edit to go live.
   ============================================================ */
window.STORE = {
  name: "TheFortunateStore",                       // your brand name
  tagline: "Premium fashion for every style",

  // Where order alerts go
  whatsapp: "2348000000000",                // your WhatsApp number: country code + number, no + or spaces
  email: "hello@thefortunatestore.com",   // your email (shown on the Contact page)
  location: "Lagos, Nigeria",             // shown on the Contact page

  // Automatic email alert for every order and message (free at formspree.io):
  // create a form there, paste its link here. Orders will arrive in your inbox.
  formEndpoint: "https://formspree.io/f/XXXXXXXX",

  // Payments go straight to YOUR Paystack account (paystack.com).
  // Paste your PUBLIC key here (starts with pk_live_ or pk_test_). Never paste the secret key.
  paystackKey: "pk_test_XXXXXXXXXXXXXXXX",

  currency: "₦",
  deliveryFee: 2000,                        // flat delivery fee
  freeDeliveryOver: 50000                  // orders above this get free delivery (0 to switch off)
};
