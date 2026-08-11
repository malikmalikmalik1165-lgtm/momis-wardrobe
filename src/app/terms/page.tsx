"use client";

import { FileText, Download, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  const handleDownload = () => {
    const text = `MOMIS WARDROBE — TERMS & CONDITIONS\n\nLast Updated: January 2026\n\n1. GENERAL TERMS\n- Momis Wardrobe ek Pakistani women's fashion e-commerce platform hai.\n- Website use karne ka matlab hai ke aap in terms se agree karte hain.\n- Hum apne terms kisi bhi waqt update kar sakte hain.\n\n2. ACCOUNT & REGISTRATION\n- Account banane ke liye valid Pakistani phone number chahiye.\n- Aap apne account ki security ke zimmedar hain.\n- Ek phone number se sirf ek account ban sakta hai.\n- False information dena account suspension ka sabab ban sakta hai.\n\n3. ORDERS & PAYMENT\n- Sab prices Pakistani Rupees (PKR) mein hain.\n- Cash on Delivery (COD) available hai all Pakistan mein.\n- Order place karne ke baad hum confirmation call karenge.\n- Hum kisi bhi order ko reject karne ka haq rakhte hain.\n- Delivery charges Rs. 250 hain. Rs. 5,000+ orders par free delivery.\n\n4. DELIVERY\n- Standard delivery 3-5 working days hai.\n- Remote areas mein 5-8 din lag sakte hain.\n- Delivery address ghalat hone par hum zimmedar nahi hain.\n\n5. RETURN & EXCHANGE POLICY\n- Delivery ke 7 din ke andar return/exchange request karein.\n- Product unused, unwashed aur original tags ke saath hona chahiye.\n- Sale items (50%+ discount) sirf exchange ho sakti hain.\n- Undergarments return nahi ho sakte.\n- Refund JazzCash/EasyPaisa/Bank Transfer se 3-5 din mein milega.\n\n6. TEAM MEMBER / RESELLER TERMS\n- Team program join karna free hai.\n- Commission 10-20% hai based on level.\n- Commission monthly basis par process hoga.\n- Misleading ya false marketing karna allowed nahi hai.\n- Momis Wardrobe ka naam use karte waqt professional conduct zaruri hai.\n- Admin kisi bhi member ko deactivate kar sakta hai.\n\n7. PRIVACY POLICY\n- Hum aap ka data secure rakhte hain (encrypted passwords).\n- Phone numbers sirf order processing ke liye use hote hain.\n- Hum aap ka data third parties ko nahi bechte.\n- WhatsApp messages sirf order updates ke liye hain.\n\n8. INTELLECTUAL PROPERTY\n- Website ka content, design aur branding Momis Wardrobe ki property hai.\n- Product images commercial use ke liye copy karna allowed nahi hai.\n\n9. DISCLAIMER\n- Product colors screen resolution ke hisaab se thore different ho sakte hain.\n- Hum website downtime ke liye zimmedar nahi hain.\n\n10. CONTACT\n- Phone/WhatsApp: 03295578925\n- WhatsApp Community: https://chat.whatsapp.com/B9JHotGfxhICVZASVkwUIa\n\n© 2026 Momis Wardrobe. All rights reserved.`;

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "Momis-Wardrobe-Terms-and-Policies.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pt-[calc(2rem+3.5rem)] sm:pt-[calc(2rem+5.5rem)]">
      <div className="bg-warm-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <Link href="/" className="text-warm-gray-500 text-xs hover:text-white mb-4 inline-flex items-center gap-1"><ArrowLeft size={12}/> Home</Link>
          <div className="flex items-center gap-3 mt-2">
            <Shield className="text-rose-400" size={28}/>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Terms & Policies</h1>
              <p className="text-warm-gray-400 text-sm">Last Updated: January 2026</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Download Button */}
        <button onClick={handleDownload}
          className="mb-8 flex items-center gap-2 bg-warm-gray-900 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-warm-gray-800 transition-colors">
          <Download size={16}/> Download Full Terms (TXT)
        </button>

        <div className="space-y-8">
          {[
            { title: "1. General Terms", content: "Momis Wardrobe ek Pakistani women's fashion e-commerce platform hai. Website use karne ka matlab hai ke aap in terms se agree karte hain. Hum apne terms kisi bhi waqt update kar sakte hain bina prior notice ke." },
            { title: "2. Account & Registration", content: "Account banane ke liye valid Pakistani phone number chahiye. OTP verification se phone verify hoga. Aap apne account ki security ke zimmedar hain — password kisi ko na batayein. Ek phone number se sirf ek account ban sakta hai. False information dena account suspension ka sabab ban sakta hai." },
            { title: "3. Orders & Payment", content: "Sab prices Pakistani Rupees (PKR) mein hain. Cash on Delivery (COD) available hai all Pakistan mein. Bank Transfer, JazzCash aur EasyPaisa bhi accept karte hain. Order place karne ke baad humari team confirmation call karegi. Hum kisi bhi order ko reject karne ka haq rakhte hain agar stock available na ho. Delivery charges Rs. 250 hain. Rs. 5,000 aur us se zyada ke orders par delivery free hai." },
            { title: "4. Delivery Information", content: "Standard delivery 3-5 working days hai major cities ke liye. Lahore aur Karachi mein 1-2 din mein delivery ho jati hai. Remote areas (Balochistan, GB, AJK) mein 5-8 working days lag sakte hain. Delivery address ghalat hone ki surat mein hum zimmedar nahi hon ge. Tracking ID order confirmation ke baad milegi." },
            { title: "5. Return & Exchange Policy", content: "Delivery ke 7 din ke andar return ya exchange request WhatsApp par karein (03295578925). Product unused, unwashed aur original tags ke saath hona chahiye. Size ya color ghalat aane par free exchange milega. Sale items (50%+ discount wale) sirf exchange ho sakti hain, refund nahi. Undergarments aur intimate items return nahi ho sakti. Refund JazzCash, EasyPaisa ya Bank Transfer se 3-5 working days mein process hoga." },
            { title: "6. Team Member / Reseller Terms", content: "Team program join karna bilkul free hai — koi investment nahi. Approval admin ki taraf se hoga. Commission 10-20% hai based on sales level (Starter se Royal tak). Commission monthly basis par process hoga JazzCash/EasyPaisa par. Misleading ya false marketing karna strictly allowed nahi hai. Momis Wardrobe ka naam use karte waqt professional aur respectful conduct zaruri hai. Admin kisi bhi waqt kisi bhi member ko bina notice deactivate kar sakta hai agar terms violate hon. Team members apna selling price set kar sakte hain lekin base price se kam nahi. Training materials sirf personal use ke liye hain — resale ya redistribution allowed nahi." },
            { title: "7. Privacy Policy", content: "Hum aap ka data secure rakhte hain — passwords bcrypt encryption se hashed hain. Phone numbers sirf order processing, OTP verification aur customer support ke liye use hote hain. Hum aap ka personal data kisi third party ko sell ya share nahi karte. WhatsApp messages sirf order updates, notifications aur support ke liye bheje jate hain. Aap kisi bhi waqt account delete karwa sakte hain WhatsApp par request kar ke." },
            { title: "8. Intellectual Property", content: "Website ka content, design, logo aur branding Momis Wardrobe ki exclusive property hai. Product images aur descriptions ko admin ki permission ke bina commercial use ke liye copy karna allowed nahi hai. Team members ko sirf provided sharing tools aur approved content use karna chahiye." },
            { title: "9. Disclaimer", content: "Product colors aap ki screen resolution aur settings ke hisaab se thore different ho sakte hain. Hum website downtime ya technical issues ke liye zimmedar nahi hain. Prices aur availability bina prior notice ke change ho sakti hain." },
            { title: "10. Contact Information", content: "Kisi bhi sawaal, complaint ya suggestion ke liye:\n📞 Phone/WhatsApp: 03295578925\n💬 Community: chat.whatsapp.com/B9JHotGfxhICVZASVkwUIa\n📍 Delivery: All Pakistan" },
          ].map((s) => (
            <div key={s.title} className="bg-white rounded-xl border border-warm-gray-100 p-5 sm:p-6">
              <h2 className="font-bold text-warm-gray-900 text-lg mb-3">{s.title}</h2>
              <p className="text-sm text-warm-gray-600 leading-relaxed whitespace-pre-line">{s.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-xs text-warm-gray-400">© 2026 Momis Wardrobe. All rights reserved.</p>
          <button onClick={handleDownload}
            className="mt-4 inline-flex items-center gap-2 bg-warm-gray-100 text-warm-gray-700 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-warm-gray-200">
            <Download size={14}/> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
