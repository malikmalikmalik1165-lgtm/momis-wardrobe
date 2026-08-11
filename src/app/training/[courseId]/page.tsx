"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, BookOpen, MessageCircle, ArrowRight, Star, Target, Zap, TrendingUp } from "lucide-react";
import { useState } from "react";

const COURSES: Record<string, { name: string; icon: string; color: string; intro: string; lessons: { title: string; content: string[] }[] }> = {
  whatsapp: {
    name: "WhatsApp Marketing Mastery", icon: "💬", color: "from-green-500 to-emerald-600",
    intro: "WhatsApp Pakistan mein sabse zyada use hone wala app hai — 80%+ population isse use karti hai. Ye course aap ko sikhayega ke kaise WhatsApp se products sell karein aur customers banayein.",
    lessons: [
      { title: "Lesson 1: WhatsApp Business Setup", content: [
        "✅ Sabse pehle WhatsApp Business app download karein — ye normal WhatsApp se alag hai aur professional features deta hai.",
        "✅ Business Profile mein ye fill karein: Business Name (Momis Wardrobe by [Aap ka naam]), Category (Clothing/Fashion), Description, Address, Business Hours, aur Website link.",
        "✅ Catalogue feature mein apne top 10-20 products add karein with images aur prices — ye aap ka digital dukan hai.",
        "✅ Auto-reply set karein: 'Assalam o Alaikum! Shukriya message karne ka. Hum jald jawab denge. Humari website: momis-wardrobe-vert.vercel.app'",
        "✅ Quick Replies banayein common questions ke liye jaise pricing, delivery time, COD info wagairah.",
      ]},
      { title: "Lesson 2: WhatsApp Status Marketing", content: [
        "📱 Status sabse powerful free marketing tool hai — aap ke sab contacts dekhte hain!",
        "📱 Daily 5-10 product statuses lagayein — subah 9-10 AM aur shaam 7-9 PM best time hai.",
        "📱 Status mein ye formula use karein: Product Photo + Name + Price + 'COD Available' + 'DM to order'",
        "📱 Sirf products na lagayein — lifestyle shots, customer reviews, behind the scenes bhi daalen. Ye trust build karta hai.",
        "📱 Video status zyada engagement laata hai — 15-30 second ka product video banayein.",
        "📱 Har status par CTA (Call to Action) zaroor daalein: 'Order ke liye reply karein' ya 'Link in bio'",
      ]},
      { title: "Lesson 3: WhatsApp Groups Strategy", content: [
        "👥 Apne customers ka ek exclusive group banayein — naam rakhein 'Momis Wardrobe Deals'",
        "👥 Group mein daily 2-3 products share karein with prices — zyada na karein warna log chale jayenge.",
        "👥 Weekly ek exclusive group-only discount dein — isse members active rehte hain.",
        "👥 Group rules set karein: No spam, only admin posts (ya limited posting), respectful behavior.",
        "👥 Customer reviews group mein share karein — social proof bohot powerful hai.",
        "👥 New arrivals sabse pehle group mein announce karein — members ko VIP feel dein.",
      ]},
      { title: "Lesson 4: Broadcast Lists", content: [
        "📢 Broadcast list banayein — ye ek message bohot logon ko bhejta hai lekin private rehta hai (group nahi).",
        "📢 Important: Jo aap ka number save kiye hue hain sirf unhe broadcast jayega — isliye logon ko kahein number save karein.",
        "📢 Weekly ek broadcast bhejein: New arrivals, sale alerts, ya special offers.",
        "📢 Broadcast message short rakhein — 3-4 lines max with ek photo aur ek link.",
        "📢 Best time: Friday afternoon (weekend shopping mood) ya month ki pehli tarikh (salary aane par).",
      ]},
      { title: "Lesson 5: Customer Handling", content: [
        "🤝 Reply speed matter karta hai — 5 minute ke andar reply karne ki koshish karein.",
        "🤝 Har customer ko naam se address karein: 'Ji Ayesha, ye suit available hai...'",
        "🤝 Product ke baare mein poochne par detail mein batayein — fabric, fitting, wash care sab.",
        "🤝 'Sochti hoon' kehne par pressure na dein — 'Bilkul, sochein. Agar koi sawal ho to zaroor poochein' kahein.",
        "🤝 Order ke baad thank you message bhejein aur delivery ke baad feedback poochein.",
        "🤝 Unhappy customer ko politely handle karein — return/exchange offer karein, argue na karein.",
      ]},
      { title: "Lesson 6: WhatsApp Selling Scripts", content: [
        "📝 Greeting: 'Assalam o Alaikum [Name]! Kaise hain? Maine aap ke liye kuch beautiful products select kiye hain...'",
        "📝 Product Pitch: '[Product Name]\\nPrice: Rs. [X]\\n\\nFabric: [Detail]\\nSizes: [S/M/L]\\nDelivery: 3-5 din\\nCOD Available!\\n\\nOrder karne ke liye reply karein 😊'",
        "📝 Follow up (2 din baad): 'Hi [Name]! Wo [product] abhi available hai agar interested hon. Limited stock hai.'",
        "📝 After order: 'Shukriya [Name]! Aap ka order process ho raha hai. Tracking update jaldi milega. 🛍️'",
        "📝 Review request: 'Hi [Name]! Umeed hai product pasand aaya. Agar thora sa review de saken to bohot meharbani hogi! ⭐'",
      ]},
      { title: "Lesson 7: Growing Your Contact List", content: [
        "📈 Har interaction mein apna number share karein — visiting cards, social media bio, packaging slip par.",
        "📈 'Save our number for exclusive deals' ka message har jagah lagayein.",
        "📈 Family aur friends se shuru karein — unse kahein apne contacts ko refer karein.",
        "📈 Facebook groups mein value add karein aur subtly WhatsApp number mention karein.",
        "📈 QR code banayein jo direct WhatsApp chat open kare — ye print material par lagayein.",
      ]},
      { title: "Lesson 8: Analytics & Improvement", content: [
        "📊 Track karein: Kitne messages bheje, kitne replies aaye, kitne orders convert hue.",
        "📊 Best selling products note karein — un ko zyada promote karein.",
        "📊 Kaunse time par zyada responses aate hain — us time post karein.",
        "📊 Customer feedback se seekhein — kya pasand aata hai, kya nahi.",
        "📊 Monthly review karein: Sales target vs actual, new customers vs returning.",
        "📊 Top performing statuses ko repeat karein thore changes ke saath.",
      ]},
    ],
  },
  facebook: {
    name: "Facebook Marketing Complete Guide", icon: "📘", color: "from-blue-500 to-blue-700",
    intro: "Facebook Pakistan mein 50+ million users rakhta hai. Ye course aap ko sikhayega Facebook se professionally sell karna — page creation se ads tak.",
    lessons: [
      { title: "Lesson 1: Facebook Business Page Setup", content: [
        "📘 Personal profile se nahi, Business PAGE se sell karein — ye professional lagta hai.",
        "📘 Page naam rakhein: 'Momis Wardrobe by [Aap ka naam]' ya '[City] Fashion by [Name]'",
        "📘 Profile photo mein logo lagayein, cover photo mein best product collection ya sale banner.",
        "📘 About section pura bharein: Description, Phone, WhatsApp link, Website, Business hours.",
        "📘 CTA button set karein: 'Send Message' ya 'Shop Now' — ye visitors ko action lene par majboor karta hai.",
      ]},
      { title: "Lesson 2: Content Strategy", content: [
        "📝 Rule of 3: Har 3 posts mein — 1 product post, 1 lifestyle/tip post, 1 engagement post.",
        "📝 Product post: High quality photo + Price + Features + CTA ('DM to order')",
        "📝 Lifestyle post: Styling tips, fashion trends, seasonal guides — ye trust build karta hai.",
        "📝 Engagement post: Questions poochein, polls lagayein, 'Which one do you prefer?' type content.",
        "📝 Video content 3x zyada reach deta hai — product unboxing, try-on, behind the scenes.",
        "📝 Posting schedule: Daily 1-2 posts, best times 12-2 PM aur 8-10 PM.",
      ]},
      { title: "Lesson 3: Facebook Groups Marketing", content: [
        "👥 Buying/selling groups join karein apne city ke — 'Lahore Shopping', 'Karachi Deals' etc.",
        "👥 Group rules pehle parhein — kuch groups mein direct selling allowed nahi hoti.",
        "👥 Value add karein pehle — dosron ke posts par helpful comments karein. Phir apne products share karein.",
        "👥 Apna group bhi banayein: 'Affordable Fashion Deals [City]' — isme regular deals post karein.",
        "👥 Group mein photos ke saath always price mention karein — 'DM for price' se log irritate hote hain.",
      ]},
      { title: "Lesson 4: Facebook Marketplace", content: [
        "🏪 Marketplace par product list karna FREE hai aur local buyers dikhte hain.",
        "🏪 Category sahi select karein, photos clear lagayein, price mention karein.",
        "🏪 Description mein ye zaroor likhein: Size options, Delivery available, COD accepted, WhatsApp number.",
        "🏪 Marketplace listings ko refresh karein har 2-3 din mein — naye listings upar aati hain.",
        "🏪 Customer messages ka quick reply dein — Marketplace mein response time rating dikhta hai.",
      ]},
      { title: "Lesson 5: Facebook Reels & Stories", content: [
        "🎬 Reels ab Facebook par bhi bohot important hain — ye organic reach badhata hai.",
        "🎬 15-30 second ki product videos banayein — trending audio use karein.",
        "🎬 Before/after reveals, outfit transitions, product unboxing — ye viral content types hain.",
        "🎬 Stories mein polls, questions, countdowns use karein — engagement badhta hai.",
        "🎬 Story mein 'Swipe Up' ya 'Link in comments' karein website par traffic bhejne ke liye.",
      ]},
      { title: "Lesson 6: Facebook Live Selling", content: [
        "🔴 Live selling Pakistan mein bohot popular hai — customers real time mein products dekhte hain.",
        "🔴 Schedule announce karein pehle — 'Aaj raat 8 PM par LIVE sale! Miss mat karein!'",
        "🔴 Products organized rakhein — ek ek karke dikhayein with price clearly batayein.",
        "🔴 Comments parhte rahein — engagement se algorithm boost milta hai.",
        "🔴 Live ke dauran special discount offer karein — urgency creates sales!",
        "🔴 Recording save karein aur page par post karein — jo live miss kiye woh baad mein dekh sakein.",
      ]},
      { title: "Lesson 7: Paid Advertising Basics", content: [
        "💰 Facebook Ads se targeted audience tak pohunch sakte hain — Rs. 500-1000 se shuru karein.",
        "💰 Boost Post: Sabse asaan — acha performing post ko boost karein specific audience ko.",
        "💰 Target audience set karein: Women, 18-45, Pakistan, Interests: Fashion/Shopping/Online Shopping.",
        "💰 Image ad mein clear product photo, price, aur strong CTA ('Shop Now') hona chahiye.",
        "💰 Rs. 200-300/day se test karein — 3-5 din chalne dein, results dekhen, phir scale karein.",
        "💰 Conversion tracking lagayein — kitne log ad se website par aaye aur kitne ne order kiya.",
      ]},
      { title: "Lesson 8: Engagement & Community Building", content: [
        "❤️ Har comment ka reply karein — algorithm ko signal jata hai ke aap active hain.",
        "❤️ User-generated content share karein — customers ki photos (permission le kar) post karein.",
        "❤️ Contests run karein: 'Share this post, tag 3 friends, win a free dupatta!'",
        "❤️ Behind the scenes content share karein — packing orders, new stock arrival, team photos.",
        "❤️ Customer testimonials highlight karein — screenshot ya video review post karein.",
        "❤️ Consistent rakhein — daily posting se algorithm aap ko prefer karta hai.",
      ]},
      { title: "Lesson 9: Analytics & Growth Tracking", content: [
        "📊 Page Insights check karein weekly — reach, engagement, follower growth dekhen.",
        "📊 Best performing posts identify karein — un jaise aur content banayein.",
        "📊 Peak hours note karein — jab audience zyada active ho tab post karein.",
        "📊 Competitor pages observe karein — kya kaam kar raha hai market mein.",
        "📊 Monthly goals set karein: Followers, Engagement rate, Orders from Facebook.",
      ]},
      { title: "Lesson 10: Common Mistakes to Avoid", content: [
        "❌ Sirf product photos post karna — boring lagta hai, mix content zaruri hai.",
        "❌ Low quality photos — always good lighting aur clear images use karein.",
        "❌ Price na mention karna — 'DM for price' se customers irritate hote hain.",
        "❌ Comments ignore karna — ye biggest mistake hai, har comment ka reply dein.",
        "❌ Bohot zyada post karna — din mein 3 se zyada posts spammy lagti hain.",
        "❌ Negative feedback par argue karna — politely resolve karein, public mein argue na karein.",
      ]},
    ],
  },
  instagram: {
    name: "Instagram Marketing Pro Guide", icon: "📸", color: "from-pink-500 to-purple-600",
    intro: "Instagram visual platform hai — fashion products ke liye PERFECT hai. Ye course aap ko sikhayega Reels, Stories aur Posts se sales kaise karein.",
    lessons: [
      { title: "Lesson 1: Instagram Business Profile", content: [
        "📸 Personal account ko Business ya Creator account mein switch karein — insights milenge.",
        "📸 Bio mein ye likhein: What you sell + USP + CTA. Example: '✨ Women's Fashion | COD 🇵🇰 | Free Delivery 5K+ | 👇 Shop Now'",
        "📸 Bio mein website link lagayein. Multiple links ke liye Linktree use karein.",
        "📸 Highlights banayein: New Arrivals, Reviews, Size Guide, How to Order, Sale — ye permanent stories hain.",
        "📸 Profile photo mein logo ya consistent brand image use karein.",
      ]},
      { title: "Lesson 2: Content Creation", content: [
        "🎨 Instagram par QUALITY matters — blurry ya dark photos mat lagayein.",
        "🎨 Natural light mein photos lein — window ke paas best lighting milti hai.",
        "🎨 Flat lay photography try karein — products ko flat surface par arrange karke upar se photo lein.",
        "🎨 Consistent color theme rakhein — aap ka feed visually appealing hona chahiye.",
        "🎨 Canva app se professional graphics banayein — free hai aur bohot asaan hai.",
        "🎨 User-generated content (customer photos) sabse powerful content type hai.",
      ]},
      { title: "Lesson 3: Reels Strategy", content: [
        "🎬 Reels ab Instagram ka KING hai — sabse zyada reach Reels se milti hai.",
        "🎬 Trending audio use karein — Reels section mein arrow icon wale audios trending hain.",
        "🎬 Content ideas: Outfit transitions, Product reveals, Packing orders, Before/After styling.",
        "🎬 First 1-3 seconds mein hook dein — 'Wait for it!' ya surprising visual se shuru karein.",
        "🎬 Text overlay lagayein — bohot log bina sound ke dekhte hain.",
        "🎬 15-30 seconds ideal length hai — short aur engaging rakhein.",
        "🎬 Daily 1-2 Reels post karne ki koshish karein — consistency zaroori hai.",
      ]},
      { title: "Lesson 4: Hashtag Strategy", content: [
        "# 20-25 hashtags use karein har post par — mix of popular aur niche hashtags.",
        "# Popular: #PakistaniFashion #OnlineShopping #WomensFashion #LawnSuits #EidCollection",
        "# Niche: #PakistaniSuits #DesiFashion #AffordableFashion #CODPakistan #MomisWardrobe",
        "# Location hashtags: #LahoreStyle #KarachiFashion #IslamabadShopping",
        "# Hashtags first comment mein daalein — caption clean rehta hai.",
        "# Har mahine hashtags update karein — trending hashtags change hote rehte hain.",
      ]},
      { title: "Lesson 5: Stories & Engagement", content: [
        "📱 Daily 5-10 stories lagayein — ye aap ko followers ke feed mein top par rakhta hai.",
        "📱 Interactive stickers use karein: Polls, Questions, Quiz, Countdown — engagement badhata hai.",
        "📱 Behind the scenes content stories mein daalen — packing, new stock, daily routine.",
        "📱 Story mein product tag aur link sticker use karein — direct shopping enable karta hai.",
        "📱 Customer reviews ka screenshot stories mein lagayein — social proof powerful hai.",
      ]},
      { title: "Lesson 6: DM Selling & Closing", content: [
        "💬 DMs mein professional lekin friendly rakhein — 'Ji, ye suit Rs. 3,500 mein available hai.'",
        "💬 Product details, size guide, aur delivery info turant share karein — delay se customer lose hota hai.",
        "💬 Quick reply templates set karein common questions ke liye.",
        "💬 Follow up karein 24-48 hours baad: 'Hi! Wo suit abhi available hai, shall I process your order?'",
        "💬 Payment aur delivery clearly explain karein — COD mention karna na bhoolein.",
      ]},
      { title: "Lesson 7: Collaborations & Influencers", content: [
        "🤝 Micro-influencers (1K-10K followers) ke saath collaborate karein — affordable aur effective.",
        "🤝 Barter deal karein: Free product ke badale mein post/story/reel — budget friendly!",
        "🤝 Influencer ki audience check karein — kya woh aap ke target market se match karti hai?",
        "🤝 Other businesses ke saath cross-promotion karein — complementary brands ke saath.",
        "🤝 Giveaways run karein influencers ke saath — followers badhte hain rapidly.",
      ]},
      { title: "Lesson 8: Instagram Shopping Setup", content: [
        "🛍 Instagram Shop set karein — directly products tag ho sakte hain posts aur stories mein.",
        "🛍 Product catalogue Facebook Commerce Manager se connect karein.",
        "🛍 Har post mein product tags lagayein — tap kare to price aur details dikhein.",
        "🛍 Shop tab aap ke profile par dikhayi dega — easy browsing for customers.",
      ]},
      { title: "Lesson 9: Growth & Analytics", content: [
        "📊 Instagram Insights weekly check karein — reach, impressions, profile visits, website clicks.",
        "📊 Best performing content type identify karein — Reels vs Posts vs Stories.",
        "📊 Follower demographics dekhen — age, gender, location, active hours.",
        "📊 Monthly content calendar banayein — planned content consistent hota hai.",
        "📊 Competitor analysis karein — kya kaam kar raha hai unke liye? Adapt karein (copy nahi!).",
      ]},
    ],
  },
  tiktok: {
    name: "TikTok Marketing Guide", icon: "🎵", color: "from-gray-900 to-gray-700",
    intro: "TikTok Pakistan mein rapidly grow kar raha hai. Short videos se products viral ho sakte hain. Ye course sikhayega kaise TikTok se sales karein.",
    lessons: [
      { title: "Lesson 1: TikTok Business Setup", content: [
        "🎵 Business account banayein — analytics aur promotional tools milenge.",
        "🎵 Bio mein clearly likhein kya sell karte hain + WhatsApp number ya website link.",
        "🎵 Profile photo professional rakhein — logo ya brand image.",
        "🎵 First 5-10 videos consistent niche mein banayein — algorithm ko samajhne dein aap kya content karte hain.",
      ]},
      { title: "Lesson 2: Viral Content Formula", content: [
        "🔥 Hook (0-3 sec): Pehle 3 seconds mein viewer ko rokein — surprising visual, bold text, ya question.",
        "🔥 Value (3-15 sec): Product dikhayein, features batayein, ya problem solve karein.",
        "🔥 CTA (last 3 sec): 'Follow for more', 'Link in bio', 'Comment your size'.",
        "🔥 Trending sounds use karein — For You page par jaane ka chance 10x barh jata hai.",
        "🔥 Text overlay zaroor lagayein — 80% viewers bina sound ke dekhte hain.",
        "🔥 15-30 seconds ideal length hai — shorter videos zyada complete hoti hain.",
      ]},
      { title: "Lesson 3: Content Ideas for Fashion", content: [
        "👗 Outfit transitions (get ready with me) — bohot viral hoti hain.",
        "👗 Product unboxing — 'Let me show you what I got!' style.",
        "👗 Before/After styling — simple to glam transformation.",
        "👗 'Things under Rs. 2000' — budget-friendly collections.",
        "👗 Packing orders ASMR — satisfying videos, customers ko trust milta hai.",
        "👗 Customer reactions/reviews — real feedback powerful hai.",
        "👗 Day in my life as a reseller — relatable content jo connect karta hai.",
      ]},
      { title: "Lesson 4: Hashtags & Discoverability", content: [
        "# Mix use karein: Trending + Niche + Branded hashtags.",
        "# Trending: #fyp #foryou #viral #trending #pakistani",
        "# Niche: #PakistaniFashion #OnlineShopping #AffordableFashion #CODPakistan",
        "# Branded: #MomisWardrobe #MomisStyle",
        "# 3-5 relevant hashtags enough hain — zyada mat lagayein.",
      ]},
      { title: "Lesson 5: Growing Followers Fast", content: [
        "📈 Consistency sabse zaruri hai — daily 1-3 videos post karein.",
        "📈 Trending sounds IMMEDIATELY use karein jab new aayein — early adopters ko zyada reach milti hai.",
        "📈 Comments ka reply dein with videos — ye new content bhi ban jata hai aur engagement bhi badhta hai.",
        "📈 Duet aur stitch features use karein viral videos ke saath — unki audience aap ko bhi dikhti hai.",
        "📈 Cross-promote karein — TikTok videos ko Instagram Reels aur WhatsApp status par bhi lagayein.",
      ]},
      { title: "Lesson 6: TikTok Shop & Selling", content: [
        "🛒 TikTok Shop available ho to zaroor set karein — direct video se purchase ho sakta hai.",
        "🛒 Live selling TikTok par bohot powerful hai — evening 8-10 PM best time hai.",
        "🛒 Products ko video mein naturally use karein — hard selling se better hai soft selling.",
        "🛒 Customer testimonials share karein — 'Look what our customer got!' style content.",
        "🛒 Bio mein WhatsApp link daalein — interested viewers direct message kar sakein.",
      ]},
      { title: "Lesson 7: Analytics & Optimization", content: [
        "📊 TikTok Analytics mein dekhen: Video views, watch time, audience demographics.",
        "📊 Jo videos 100% watch time paayein — un jaise aur banayein.",
        "📊 Best posting times note karein — jab audience zyada active ho tab post karein.",
        "📊 A/B test karein — same product, different styles mein dikhayein, dekhen kya zyada chalta hai.",
        "📊 Followers vs views ratio track karein — agar views zyada hain lekin followers kam to CTA improve karein.",
      ]},
    ],
  },
  snapchat: {
    name: "Snapchat Marketing Guide", icon: "👻", color: "from-yellow-400 to-amber-500",
    intro: "Snapchat young Pakistani audience (15-30 age) mein popular hai. Stories aur Spotlight se products promote karein.",
    lessons: [
      { title: "Lesson 1: Snapchat for Business", content: [
        "👻 Public profile banayein — ye aap ko discoverable banata hai non-friends ke liye bhi.",
        "👻 Bitmoji customize karein — brand personality reflect kare.",
        "👻 Story frequency: Daily 5-8 snaps — zyada na karein warna skip ho jayenge.",
        "👻 Best time: Morning 8-10 AM aur Evening 7-10 PM — jab log casually browse karte hain.",
      ]},
      { title: "Lesson 2: Story Content Strategy", content: [
        "📸 Behind the scenes content — packing, new arrivals, daily business routine.",
        "📸 Quick product showcases — 5-10 seconds mein product dikhayein with text overlay price ke saath.",
        "📸 Day-in-my-life format — relatable content jo personal connection banata hai.",
        "📸 Snap streaks maintain karein close customers ke saath — relationship building!",
        "📸 AR lenses aur filters use karein — fun content zyada engage hota hai.",
      ]},
      { title: "Lesson 3: Spotlight for Reach", content: [
        "🌟 Spotlight Snapchat ka TikTok hai — short viral videos jo millions tak pohunch sakti hain.",
        "🌟 Fashion transitions, product reveals, packing videos — ye Spotlight par acha perform karte hain.",
        "🌟 Vertical 9:16 ratio, 60 seconds max, catchy first 2 seconds.",
        "🌟 Trending sounds use karein — discoverability badhti hai.",
        "🌟 Regular post karein — consistency se Spotlight algorithm aap ko prefer karta hai.",
      ]},
      { title: "Lesson 4: Direct Selling on Snapchat", content: [
        "💰 Story par product daalen → interested log screenshot ya reply karenge → conversation shuru!",
        "💰 Chat mein product details bhejein — photos, sizes, price, delivery info.",
        "💰 'Screenshot to order' ya 'Reply YES to order' — easy CTA for Snapchat audience.",
        "💰 Snap Map par apna location share karein agar local customers target kar rahe hain.",
        "💰 Exclusive Snapchat-only deals offer karein — 'Only for my Snap fam!' — exclusivity sells!",
      ]},
      { title: "Lesson 5: Growing on Snapchat", content: [
        "📈 Snapcode ko Instagram bio, WhatsApp status, Facebook par share karein.",
        "📈 'Add me on Snap for exclusive deals' — ye messaging use karein across platforms.",
        "📈 Snap streaks maintain karein — ye regular touchpoints hain customers ke saath.",
        "📈 Collaborate karein Snapchat influencers ke saath — shoutouts ya takeovers.",
        "📈 Content ko Spotlight mein bhi daalen — new audience discover kare aap ko.",
      ]},
    ],
  },
  general: {
    name: "Complete Reselling Business Guide", icon: "🎓", color: "from-rose-500 to-pink-600",
    intro: "Zero se shuru karke professional reseller banne tak ka complete roadmap. Har wo cheez jo aap ko chahiye apna online fashion business chalane ke liye.",
    lessons: [
      { title: "Lesson 1: Reselling Kya Hai?", content: [
        "🎓 Reselling matlab: Aap kisi company ke products apne margin ke saath sell karte hain — bina inventory rakhe!",
        "🎓 Momis Wardrobe aap ko products deta hai, aap customers dhoondhte hain, order hone par commission milta hai.",
        "🎓 Investment: ZERO — koi stock rakhne ki zaroorat nahi, koi delivery karne ki zaroorat nahi.",
        "🎓 Aap ka kaam: Products share karna, customers se baat karna, orders convert karna.",
        "🎓 Ye ek REAL business hai — bohot Pakistani women is se monthly 15,000-50,000+ kama rahi hain.",
      ]},
      { title: "Lesson 2: Getting Started — First Steps", content: [
        "1️⃣ Momis Wardrobe Team Portal par register karein (/team) — bilkul FREE hai.",
        "1️⃣ Apna unique referral code milega — ye aap ki identity hai business mein.",
        "1️⃣ Products browse karein Team Portal mein — dekhen kya sell karna hai.",
        "1️⃣ WhatsApp Business app download karein aur professional profile banayein.",
        "1️⃣ Apne 50-100 qarebi contacts ki list banayein — ye aap ke first potential customers hain.",
        "1️⃣ Pehle hafte ka target: 5 logon ko personally message karein products ke baare mein.",
      ]},
      { title: "Lesson 3: Pricing Strategy", content: [
        "💰 Momis Wardrobe aap ko base price deta hai — upar apna margin add karein.",
        "💰 Recommended margin: 15-25% — itna add karein ke customer ko bhi sahi lage aur aap ko bhi faida ho.",
        "💰 Example: Base price Rs. 2,000 → Aap Rs. 2,500 mein bechein → Rs. 500 aap ka profit!",
        "💰 Commission bhi milega upar se — 10-20% based on aap ka level.",
        "💰 Competitor prices check karein — bohot zyada margin na rakhein warna customer nahi aayega.",
        "💰 Sale items par kam margin rakhein — volume se zyada kamayein.",
      ]},
      { title: "Lesson 4: Finding Your First Customers", content: [
        "🎯 Family aur friends — sabse pehle inhe batayein ke aap ye karte hain.",
        "🎯 WhatsApp status — daily products lagayein, log dekh kar poochenge.",
        "🎯 Facebook groups — city-based shopping groups mein products share karein.",
        "🎯 Neighbors aur community — word of mouth sabse powerful marketing hai.",
        "🎯 Office/university colleagues — jo women hain unhe personally show karein.",
        "🎯 Ek customer se 3 aur aate hain — acha service dein, woh apne friends ko batayenge.",
      ]},
      { title: "Lesson 5: Building Trust & Credibility", content: [
        "🤝 Customer ko COD offer karein — 'Pehle product dekhein, phir payment karein' — is se trust badhta hai.",
        "🤝 Honest rahein product ke baare mein — agar koi limitation hai to batayein, exaggerate na karein.",
        "🤝 Delivery timeline sahi batayein — jhooti delivery date se customer upset hoga.",
        "🤝 Customer reviews collect karein — screenshot le kar share karein naye customers ke saath.",
        "🤝 Professional baat karein — spelling mistakes, rude responses se bachein.",
        "🤝 Return/exchange offer karein — ye customer ko confident banata hai order karne mein.",
      ]},
      { title: "Lesson 6: Scaling Your Business", content: [
        "📈 Phase 1 (Month 1-2): Family, friends, WhatsApp contacts — 5-10 sales target.",
        "📈 Phase 2 (Month 3-4): Facebook groups, Instagram shuru — 15-25 sales target.",
        "📈 Phase 3 (Month 5-6): Consistent social media, repeat customers — 30-50 sales target.",
        "📈 Phase 4 (Month 7+): Multiple platforms, own following — 50+ sales, team building shuru.",
        "📈 Repeat customers par focus karein — naya customer laana 5x mehnga hai retain karne se.",
        "📈 Apni niche identify karein — kya sell karna aap ko acha lagta hai? Us par focus karein.",
      ]},
      { title: "Lesson 7: Time Management", content: [
        "⏰ Daily 2-3 hours kaafi hain agar efficiently kaam karein.",
        "⏰ Morning (30 min): Status update karein, new products check karein.",
        "⏰ Afternoon (30 min): Messages reply karein, orders process karein.",
        "⏰ Evening (1 hr): Content create karein, social media post karein, customer follow-up.",
        "⏰ Weekly planning karein — kaunse products promote karne hain, kaunse posts banane hain.",
        "⏰ Batch working karein — ek waqt mein sab photos le lein, phir sab captions likh lein.",
      ]},
      { title: "Lesson 8: Handling Difficult Situations", content: [
        "😰 Customer order cancel kare: Politely poochein reason, agar size/color issue hai to exchange offer karein.",
        "😰 Product late deliver ho: Customer ko actively update dein — silence worst hai.",
        "😰 Negative feedback: 'Shukriya feedback ka. Hum improve karenge.' — defensive na hon.",
        "😰 Customer ghayab ho jaye: 2-3 din baad gentle follow up karein, phir chor dein — pushy na hon.",
        "😰 Return request: Politely process karein — ek acha experience wala customer 5 aur laata hai.",
      ]},
      { title: "Lesson 9: Financial Management", content: [
        "💵 Har sale ka record rakhein — Excel ya notebook mein.",
        "💵 Track karein: Product cost, selling price, profit, commission earned.",
        "💵 Monthly profit/loss calculate karein — kya kaam kar raha hai, kya nahi.",
        "💵 Commission claim regularly karein — monthly basis par WhatsApp par request karein.",
        "💵 Reinvest karein — kuch profit se paid ads try karein ya better content tools lein.",
      ]},
      { title: "Lesson 10: Advanced Strategies", content: [
        "🚀 Apni khud ki brand identity banayein — sirf resell na karein, brand build karein.",
        "🚀 Email list build karein — repeat marketing ke liye powerful tool hai.",
        "🚀 Seasonal campaigns plan karein — Eid, 14 August, wedding season, winter collection.",
        "🚀 Cross-selling karein — suit ke saath matching dupatta, bag, jewellery suggest karein.",
        "🚀 Upselling karein — customer ko better quality (higher price) option bhi dikhayein.",
        "🚀 Apni team build karein — sub-resellers recruit karein aur unke sales se bhi kamayein!",
      ]},
      { title: "Lesson 11: Legal & Ethical Guidelines", content: [
        "⚖️ Misleading claims na karein — product description honest honi chahiye.",
        "⚖️ Customer data private rakhein — unke numbers ya details share na karein.",
        "⚖️ Copyrighted content use na karein — apna original content banayein.",
        "⚖️ Tax awareness rakhein — agar income ek limit se zyada ho to tax file karna zaruri hai.",
        "⚖️ Momis Wardrobe ki terms follow karein — Terms page par complete policies hain.",
      ]},
      { title: "Lesson 12: Your Action Plan", content: [
        "📋 Week 1: Register on Team Portal, setup WhatsApp Business, share first 5 products.",
        "📋 Week 2: Join 5 Facebook groups, post daily on WhatsApp status, first sale target.",
        "📋 Week 3: Instagram account create, first Reel banayein, 3 sales target.",
        "📋 Week 4: Analyze what worked, double down on best channel, 5 sales target.",
        "📋 Month 2: Consistent daily posting, 10+ sales target, first team member recruit.",
        "📋 Month 3: Multi-platform presence, 20+ sales, Bronze level achieve karein!",
        "📋 Remember: Consistency > Perfection. Daily chhota sa effort bhi bohot bada result deta hai. START KAREIN! 🚀",
      ]},
    ],
  },
};

export default function CoursePage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const course = COURSES[courseId];
  const [openLesson, setOpenLesson] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);

  if (!course) return (
    <div className="pt-40 text-center min-h-screen">
      <h1 className="text-2xl mb-4">Course not found</h1>
      <Link href="/training" className="text-rose-500">← Back to Training</Link>
    </div>
  );

  const toggleComplete = (idx: number) => {
    setCompleted(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  };

  const progress = Math.round((completed.length / course.lessons.length) * 100);

  return (
    <div className="pt-[calc(2rem+3.5rem)] sm:pt-[calc(2rem+5.5rem)] min-h-screen bg-warm-gray-50">
      {/* Header */}
      <div className={`bg-gradient-to-r ${course.color} text-white`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <Link href="/training" className="text-white/60 text-xs hover:text-white inline-flex items-center gap-1 mb-4">
            <ArrowLeft size={12}/> All Courses
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{course.icon}</span>
            <h1 className="text-2xl sm:text-3xl font-bold">{course.name}</h1>
          </div>
          <p className="text-white/80 text-sm max-w-2xl mb-4">{course.intro}</p>
          <div className="flex items-center gap-4 text-xs">
            <span>{course.lessons.length} Lessons</span>
            <span>•</span>
            <span>{progress}% Complete</span>
          </div>
          {/* Progress bar */}
          <div className="mt-3 bg-white/20 rounded-full h-2 max-w-md">
            <div className="bg-white rounded-full h-2 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Lessons */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="space-y-3">
          {course.lessons.map((lesson, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-warm-gray-100 overflow-hidden">
              <button onClick={() => setOpenLesson(openLesson === idx ? -1 : idx)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-warm-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <button onClick={(e) => { e.stopPropagation(); toggleComplete(idx); }}
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      completed.includes(idx) ? "bg-green-500 border-green-500 text-white" : "border-warm-gray-300"
                    }`}>
                    {completed.includes(idx) && <CheckCircle size={14}/>}
                  </button>
                  <span className={`text-sm font-semibold ${completed.includes(idx) ? "text-green-600" : "text-warm-gray-900"}`}>
                    {lesson.title}
                  </span>
                </div>
                <ArrowRight size={14} className={`text-warm-gray-400 transition-transform ${openLesson === idx ? "rotate-90" : ""}`}/>
              </button>

              {openLesson === idx && (
                <div className="px-5 pb-5 border-t border-warm-gray-50">
                  <div className="pl-10 pt-4 space-y-3">
                    {lesson.content.map((point, i) => (
                      <p key={i} className="text-sm text-warm-gray-600 leading-relaxed">{point}</p>
                    ))}
                  </div>
                  <div className="pl-10 mt-4 flex gap-2">
                    <button onClick={() => toggleComplete(idx)}
                      className={`text-xs font-semibold px-4 py-2 rounded-lg transition-colors ${
                        completed.includes(idx) ? "bg-green-100 text-green-700" : "bg-warm-gray-100 text-warm-gray-600 hover:bg-green-100 hover:text-green-700"
                      }`}>
                      {completed.includes(idx) ? "✓ Completed" : "Mark Complete"}
                    </button>
                    {idx < course.lessons.length - 1 && (
                      <button onClick={() => setOpenLesson(idx + 1)}
                        className="text-xs font-semibold px-4 py-2 rounded-lg bg-warm-gray-900 text-white hover:bg-warm-gray-800">
                        Next Lesson →
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Completion */}
        {progress === 100 && (
          <div className="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-8 text-center">
            <span className="text-4xl">🎉</span>
            <h2 className="text-2xl font-bold mt-3">Course Complete!</h2>
            <p className="text-green-100 mt-2">Mubarak ho! Ab in skills ko apply karein aur sales shuru karein!</p>
            <Link href="/team" className="inline-flex items-center gap-2 bg-white text-green-700 px-6 py-3 rounded-xl font-bold mt-4 hover:bg-green-50">
              Team Portal → Start Selling
            </Link>
          </div>
        )}

        {/* Help */}
        <div className="mt-8 bg-green-50 rounded-xl p-5 text-center">
          <p className="text-sm text-warm-gray-700 mb-3">Koi sawaal? Expert se poochein!</p>
          <a href="https://wa.me/923295578925?text=Training%20course%20ke%20baare%20mein%20help%20chahiye" target="_blank"
            className="inline-flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-green-600">
            <MessageCircle size={14}/> WhatsApp Help
          </a>
        </div>
      </div>
    </div>
  );
}
