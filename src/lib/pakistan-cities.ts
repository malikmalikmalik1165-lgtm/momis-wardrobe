export interface CityData {
  name: string;
  province: string;
  postalCode: string;
  deliveryDays: string;
  deliveryCharge: number;
}

export const PAKISTAN_CITIES: CityData[] = [
  // Punjab
  { name: "Lahore", province: "Punjab", postalCode: "54000", deliveryDays: "1-2", deliveryCharge: 250 },
  { name: "Rawalpindi", province: "Punjab", postalCode: "46000", deliveryDays: "2-3", deliveryCharge: 250 },
  { name: "Faisalabad", province: "Punjab", postalCode: "38000", deliveryDays: "2-3", deliveryCharge: 250 },
  { name: "Multan", province: "Punjab", postalCode: "60000", deliveryDays: "2-3", deliveryCharge: 250 },
  { name: "Gujranwala", province: "Punjab", postalCode: "52250", deliveryDays: "2-3", deliveryCharge: 250 },
  { name: "Sialkot", province: "Punjab", postalCode: "51310", deliveryDays: "2-3", deliveryCharge: 250 },
  { name: "Bahawalpur", province: "Punjab", postalCode: "63100", deliveryDays: "3-4", deliveryCharge: 250 },
  { name: "Sargodha", province: "Punjab", postalCode: "40100", deliveryDays: "2-3", deliveryCharge: 250 },
  { name: "Sahiwal", province: "Punjab", postalCode: "57000", deliveryDays: "2-3", deliveryCharge: 250 },
  { name: "Rahim Yar Khan", province: "Punjab", postalCode: "64200", deliveryDays: "3-4", deliveryCharge: 250 },
  { name: "Sheikhupura", province: "Punjab", postalCode: "39350", deliveryDays: "2-3", deliveryCharge: 250 },
  { name: "Jhang", province: "Punjab", postalCode: "35200", deliveryDays: "3-4", deliveryCharge: 250 },
  { name: "Dera Ghazi Khan", province: "Punjab", postalCode: "32200", deliveryDays: "3-5", deliveryCharge: 250 },
  { name: "Gujrat", province: "Punjab", postalCode: "50700", deliveryDays: "2-3", deliveryCharge: 250 },
  { name: "Jhelum", province: "Punjab", postalCode: "49600", deliveryDays: "2-3", deliveryCharge: 250 },
  { name: "Kasur", province: "Punjab", postalCode: "55050", deliveryDays: "2-3", deliveryCharge: 250 },
  { name: "Okara", province: "Punjab", postalCode: "56300", deliveryDays: "2-3", deliveryCharge: 250 },
  { name: "Mianwali", province: "Punjab", postalCode: "42200", deliveryDays: "3-4", deliveryCharge: 250 },
  { name: "Hafizabad", province: "Punjab", postalCode: "52110", deliveryDays: "2-3", deliveryCharge: 250 },
  { name: "Chiniot", province: "Punjab", postalCode: "35400", deliveryDays: "2-3", deliveryCharge: 250 },
  { name: "Attock", province: "Punjab", postalCode: "43600", deliveryDays: "2-3", deliveryCharge: 250 },
  { name: "Vehari", province: "Punjab", postalCode: "61100", deliveryDays: "3-4", deliveryCharge: 250 },
  { name: "Muzaffargarh", province: "Punjab", postalCode: "34200", deliveryDays: "3-4", deliveryCharge: 250 },
  { name: "Layyah", province: "Punjab", postalCode: "31200", deliveryDays: "3-5", deliveryCharge: 250 },
  { name: "Khanewal", province: "Punjab", postalCode: "58150", deliveryDays: "3-4", deliveryCharge: 250 },
  { name: "Bhakkar", province: "Punjab", postalCode: "30000", deliveryDays: "3-5", deliveryCharge: 250 },
  { name: "Toba Tek Singh", province: "Punjab", postalCode: "36050", deliveryDays: "2-3", deliveryCharge: 250 },
  { name: "Pakpattan", province: "Punjab", postalCode: "57400", deliveryDays: "3-4", deliveryCharge: 250 },
  { name: "Narowal", province: "Punjab", postalCode: "51600", deliveryDays: "3-4", deliveryCharge: 250 },
  { name: "Chakwal", province: "Punjab", postalCode: "48800", deliveryDays: "3-4", deliveryCharge: 250 },
  { name: "Mandi Bahauddin", province: "Punjab", postalCode: "50400", deliveryDays: "2-3", deliveryCharge: 250 },
  { name: "Lodhran", province: "Punjab", postalCode: "59320", deliveryDays: "3-5", deliveryCharge: 250 },
  { name: "Khushab", province: "Punjab", postalCode: "41000", deliveryDays: "3-4", deliveryCharge: 250 },
  { name: "Nankana Sahib", province: "Punjab", postalCode: "39100", deliveryDays: "2-3", deliveryCharge: 250 },
  // Sindh
  { name: "Karachi", province: "Sindh", postalCode: "74000", deliveryDays: "2-3", deliveryCharge: 250 },
  { name: "Hyderabad", province: "Sindh", postalCode: "71000", deliveryDays: "3-4", deliveryCharge: 250 },
  { name: "Sukkur", province: "Sindh", postalCode: "65200", deliveryDays: "3-5", deliveryCharge: 250 },
  { name: "Larkana", province: "Sindh", postalCode: "77150", deliveryDays: "3-5", deliveryCharge: 250 },
  { name: "Nawabshah", province: "Sindh", postalCode: "67450", deliveryDays: "3-5", deliveryCharge: 250 },
  { name: "Mirpur Khas", province: "Sindh", postalCode: "69000", deliveryDays: "3-5", deliveryCharge: 250 },
  { name: "Jacobabad", province: "Sindh", postalCode: "79000", deliveryDays: "4-6", deliveryCharge: 250 },
  { name: "Shikarpur", province: "Sindh", postalCode: "78100", deliveryDays: "4-6", deliveryCharge: 250 },
  { name: "Khairpur", province: "Sindh", postalCode: "66020", deliveryDays: "3-5", deliveryCharge: 250 },
  { name: "Thatta", province: "Sindh", postalCode: "73130", deliveryDays: "3-5", deliveryCharge: 250 },
  // KPK
  { name: "Peshawar", province: "KPK", postalCode: "25000", deliveryDays: "3-4", deliveryCharge: 250 },
  { name: "Mardan", province: "KPK", postalCode: "23200", deliveryDays: "3-5", deliveryCharge: 250 },
  { name: "Abbottabad", province: "KPK", postalCode: "22010", deliveryDays: "3-5", deliveryCharge: 250 },
  { name: "Mansehra", province: "KPK", postalCode: "21300", deliveryDays: "4-5", deliveryCharge: 250 },
  { name: "Swat (Mingora)", province: "KPK", postalCode: "19130", deliveryDays: "4-6", deliveryCharge: 250 },
  { name: "Kohat", province: "KPK", postalCode: "26000", deliveryDays: "3-5", deliveryCharge: 250 },
  { name: "Dera Ismail Khan", province: "KPK", postalCode: "29050", deliveryDays: "4-6", deliveryCharge: 250 },
  { name: "Nowshera", province: "KPK", postalCode: "24100", deliveryDays: "3-5", deliveryCharge: 250 },
  { name: "Swabi", province: "KPK", postalCode: "23430", deliveryDays: "3-5", deliveryCharge: 250 },
  { name: "Haripur", province: "KPK", postalCode: "22620", deliveryDays: "3-5", deliveryCharge: 250 },
  { name: "Charsadda", province: "KPK", postalCode: "24420", deliveryDays: "3-5", deliveryCharge: 250 },
  { name: "Bannu", province: "KPK", postalCode: "28100", deliveryDays: "4-6", deliveryCharge: 250 },
  // Islamabad
  { name: "Islamabad", province: "ICT", postalCode: "44000", deliveryDays: "2-3", deliveryCharge: 250 },
  // Balochistan
  { name: "Quetta", province: "Balochistan", postalCode: "87300", deliveryDays: "4-6", deliveryCharge: 250 },
  { name: "Gwadar", province: "Balochistan", postalCode: "91200", deliveryDays: "5-7", deliveryCharge: 250 },
  { name: "Turbat", province: "Balochistan", postalCode: "92600", deliveryDays: "5-7", deliveryCharge: 250 },
  { name: "Khuzdar", province: "Balochistan", postalCode: "89100", deliveryDays: "5-7", deliveryCharge: 250 },
  { name: "Hub", province: "Balochistan", postalCode: "90150", deliveryDays: "4-6", deliveryCharge: 250 },
  { name: "Sibi", province: "Balochistan", postalCode: "82000", deliveryDays: "5-7", deliveryCharge: 250 },
  { name: "Zhob", province: "Balochistan", postalCode: "85200", deliveryDays: "5-7", deliveryCharge: 250 },
  // AJK
  { name: "Muzaffarabad", province: "AJK", postalCode: "13100", deliveryDays: "4-6", deliveryCharge: 250 },
  { name: "Mirpur (AJK)", province: "AJK", postalCode: "10250", deliveryDays: "3-5", deliveryCharge: 250 },
  { name: "Rawalakot", province: "AJK", postalCode: "12350", deliveryDays: "4-6", deliveryCharge: 250 },
  { name: "Kotli", province: "AJK", postalCode: "11600", deliveryDays: "4-6", deliveryCharge: 250 },
  // Gilgit-Baltistan
  { name: "Gilgit", province: "GB", postalCode: "15100", deliveryDays: "5-7", deliveryCharge: 250 },
  { name: "Skardu", province: "GB", postalCode: "16100", deliveryDays: "5-8", deliveryCharge: 250 },
  { name: "Hunza", province: "GB", postalCode: "15700", deliveryDays: "6-8", deliveryCharge: 250 },
];

export function getCityByName(name: string): CityData | undefined {
  return PAKISTAN_CITIES.find(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  );
}

export function searchCities(query: string): CityData[] {
  if (!query) return PAKISTAN_CITIES;
  const q = query.toLowerCase();
  return PAKISTAN_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.province.toLowerCase().includes(q) ||
      c.postalCode.includes(q)
  );
}
