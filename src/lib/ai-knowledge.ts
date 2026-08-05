export interface FAQEntry {
  keywords: string[];
  answer: string;
}

export const MW_FAQS: FAQEntry[] = [
  // Greetings
  { keywords: ["hello", "hi", "salam", "assalam", "aoa", "hey", "helo"], answer: "Wa Alaikum Assalam! 🌸 Main Momi hoon, Momis Wardrobe ki AI assistant. Kaise help karun? Aap products, delivery, returns ya kisi bhi cheez ke baare mein pooch sakte hain!" },

  // Store info
  { keywords: ["store", "shop", "dukan", "kya bechte", "kya milta", "products"], answer: "Momis Wardrobe par Women's Fashion milta hai! 👗 Stitched & Unstitched Suits, Cosmetics, Handbags, Shoes, Jewellery, Undergarments, 14 August Special aur bohot kuch. Dekhen: /shop" },
  { keywords: ["number", "phone", "call", "contact", "rabta"], answer: "📞 Humara number: 03295578925\nWhatsApp par message karein ya direct call karein!\nContact page: /contact" },
  { keywords: ["whatsapp", "community", "group"], answer: "💬 Humari WhatsApp Community join karein new arrivals aur deals ke liye!\n👉 https://chat.whatsapp.com/B9JHotGfxhICVZASVkwUIa\n\nYa direct order ke liye: wa.me/923295578925" },

  // Delivery
  { keywords: ["delivery", "shipping", "kitne din", "kab aaye", "time", "days"], answer: "🚚 Delivery Time:\n• Lahore/Karachi: 1-2 din\n• Islamabad/Rawalpindi: 2-3 din\n• Other cities: 3-5 din\n• Remote areas: 5-8 din\n\nDelivery charge Rs. 250, Rs. 5,000+ par FREE! 💯" },
  { keywords: ["charges", "delivery charge", "kitna lagta", "dc", "shipping cost"], answer: "💵 Delivery charges:\n• Rs. 250 flat — sab cities\n• Rs. 5,000+ order par FREE delivery! 🎉\n• Cash on Delivery (COD) available hai." },
  { keywords: ["cod", "cash on delivery", "cash", "payment"], answer: "💵 Haan! Cash on Delivery (COD) available hai all Pakistan mein!\n\nPayment options:\n• Cash on Delivery ✅ (Most popular)\n• Bank Transfer\n• JazzCash / EasyPaisa" },
  { keywords: ["free delivery", "free shipping", "muft"], answer: "🚚 Rs. 5,000 ya us se zyada ke order par delivery bilkul FREE hai! All Pakistan mein. 🎉" },

  // Returns
  { keywords: ["return", "wapas", "refund", "exchange", "change", "size change", "wrong"], answer: "🔄 7-Day Return/Exchange Policy:\n• Delivery ke 7 din mein return karein\n• Product unused ho, tags lage hon\n• Size/color exchange FREE hai\n• Refund: JazzCash/EasyPaisa mein 1-2 din\n\nWhatsApp par request karein: 03295578925" },
  { keywords: ["return policy", "policy"], answer: "📋 Full Return Policy: /return-policy\n\n• 7 din return window\n• Free exchange for size/color\n• Sale items sirf exchange\n• Undergarments non-returnable\n\nKoi issue? WhatsApp: 03295578925" },

  // Order tracking
  { keywords: ["track", "tracking", "order kahan", "parcel", "status", "kahan hai"], answer: "📦 Order track karne ke liye:\n👉 /track page par jayein\n• Tracking ID (MW-XXXXXX) ya phone number daalein\n• Status dikhega: Pending → Confirmed → Shipped → Delivered\n\nTracking ID checkout ke baad milta hai." },
  { keywords: ["order", "kaise order", "order karna", "buy", "khareed"], answer: "🛍️ Order karne ke 2 tareeqe:\n\n1️⃣ Website se: Product choose → Add to Bag → Checkout → COD select → Done!\n\n2️⃣ WhatsApp se: 03295578925 par product ka naam bhejein, hum process kar denge!\n\nDono mein COD available hai. 💵" },

  // Account
  { keywords: ["account", "register", "signup", "login"], answer: "👤 Account banayein: /account\n• Phone number + OTP verification\n• Orders history dekhen\n• Wishlist save karein\n• Password bhool gaye? OTP se reset karein" },
  { keywords: ["password", "bhool", "forgot", "reset"], answer: "🔑 Password reset karna hai?\n1. /account jayein\n2. 'Password bhool gaye?' click karein\n3. Phone number daalein\n4. OTP aayega → verify karein\n5. Naya password set karein\n\nDone! ✅" },

  // Team/Earning
  { keywords: ["earn", "kama", "paise", "income", "team", "join", "resell", "reseller"], answer: "💼 Ghar baithay earn karein — bina investment ke!\n\n• Products share karein WhatsApp/FB par\n• Customer aap ka referral code checkout mein dale\n• Har sale par 10-20% commission!\n• Levels: Starter → Bronze → Silver → Gold → Diamond 💎\n\nJoin karein: /team" },
  { keywords: ["referral", "code", "commission", "refer"], answer: "👥 Referral Code kaise kaam karta hai:\n1. Team Portal (/team) se register karein\n2. Apna unique code milega (e.g., AYE4523)\n3. Customers ko code dein\n4. Wo checkout mein code daalein\n5. Aap ko 10-20% commission milega! 💰" },
  { keywords: ["prize", "reward", "certificate", "bonus"], answer: "🏆 Team Rewards:\n• 🥉 3 sales: Rs. 500 bonus\n• 🥈 10 sales: Rs. 2,000 + free product\n• 🥇 25 sales: Rs. 5,000 + certificate\n• 💎 50 sales: Rs. 15,000 + gift hamper\n• 👑 100 sales: Rs. 50,000 + gold certificate\n\nTeam Portal: /team → Rewards tab" },

  // Size
  { keywords: ["size", "measurement", "naap", "fitting"], answer: "📏 Size Guide: /size-guide\n\n• Dresses: XS to XXL (chest, waist, hip inches mein)\n• Shoes: EU 36-41\n\n💡 Tip: Agar 2 sizes ke beech mein hon to bari size lein.\n\nConfuse hain? WhatsApp par apni measurements bhejein: 03295578925" },

  // Discount
  { keywords: ["discount", "code", "coupon", "offer", "sale"], answer: "🏷️ Discount chahiye?\n• Sale page: /sale (up to 30% OFF!)\n• Checkout mein discount code daalein\n• WhatsApp Community join karein exclusive codes ke liye!\n👉 https://chat.whatsapp.com/B9JHotGfxhICVZASVkwUIa" },

  // Specific categories
  { keywords: ["stitched", "ready", "suit"], answer: "👗 Ready-to-wear stitched suits available hain! Rs. 1,279 se shuru.\nSizes: S, M, L, XL, XXL\n\nDekhen: /shop?category=women-s-stitched" },
  { keywords: ["unstitched", "fabric", "kapra", "lawn"], answer: "🧵 Unstitched fabric suits Rs. 1,430 se! Digital print, embroidered, lawn — sab available.\n\nDekhen: /shop?category=women-s-unstitched" },
  { keywords: ["cosmetic", "makeup", "lipstick", "beauty"], answer: "💄 Cosmetics & Makeup: Lipsticks, brush sets, full face kits — sab available!\nRs. 800 se shuru.\n\nDekhen: /shop?category=cosmetics" },
  { keywords: ["bag", "handbag", "purse"], answer: "👜 Stylish handbags: Shoulder bags, crossbody, totes — Rs. 1,900 se!\n\nDekhen: /shop?category=handbags" },
  { keywords: ["shoe", "heel", "sandal", "joota"], answer: "👠 Fashion heels & sandals: Rs. 1,750 se! Sizes: 36-41\n\nDekhen: /shop?category=shoes" },
  { keywords: ["jewel", "earring", "necklace", "ring"], answer: "💍 Fashion jewellery: Gold plated sets, earrings, bridal sets — Rs. 700 se!\n\nDekhen: /shop?category=jewellery" },
  { keywords: ["14 august", "azadi", "independence", "jashn"], answer: "🇵🇰 14 August Special Collection! Green & white themed suits, accessories.\nRs. 1,149 se!\n\nDekhen: /shop?category=14-august-special" },

  // Thanks
  { keywords: ["thanks", "shukriya", "thank you", "shukria", "ok", "thx"], answer: "Aap ka shukriya! 🌸 Kuch aur poochna ho to zaroor poochein. Happy shopping at Momis Wardrobe! ❤️" },
  { keywords: ["bye", "allah hafiz", "khuda hafiz", "good bye"], answer: "Allah Hafiz! 🌙 Momis Wardrobe par aane ka shukriya. Jab bhi zaroorat ho, hum yahan hain! ❤️\n\nWhatsApp: 03295578925" },
];

export function findAnswer(message: string): string {
  const lower = message.toLowerCase().trim();

  // Check each FAQ
  let bestMatch: FAQEntry | null = null;
  let bestScore = 0;

  for (const faq of MW_FAQS) {
    let score = 0;
    for (const kw of faq.keywords) {
      if (lower.includes(kw.toLowerCase())) {
        score += kw.length; // Longer keyword matches = better
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = faq;
    }
  }

  if (bestMatch && bestScore >= 2) {
    return bestMatch.answer;
  }

  // Default response
  return "Hmm, ye sawaal meri understanding se bahar hai 🤔\n\nAap ye kar sakte hain:\n• WhatsApp par poochein: 03295578925\n• Call karein direct\n• /contact page par jayein\n\nYa phir delivery, returns, order, team ke baare mein poochein — mujhe ye sab aata hai! 😊";
}
