"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Award, Truck, Users, MessageCircle, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="pt-[calc(2.5rem+4rem)] sm:pt-[calc(2.5rem+5rem)]">
      {/* Hero */}
      <div className="relative bg-warm-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="https://images.pexels.com/photos/19092930/pexels-photo-19092930.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1600"
            alt="Fashion"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <h1
            className="font-serif text-4xl sm:text-5xl lg:text-6xl mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Momis Wardrobe
          </h1>
          <p className="text-warm-gray-300 text-lg sm:text-xl max-w-2xl mx-auto">
            Elegant fashion for the modern Pakistani woman
          </p>
        </div>
      </div>

      {/* Story */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-rose-500 text-sm tracking-widest uppercase">Our Story</span>
            <h2
              className="font-serif text-3xl sm:text-4xl text-warm-gray-900 mt-2 mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Fashion Jo Aap Ko
              <br />Special Feel Karae
            </h2>
            <div className="space-y-4 text-warm-gray-600 leading-relaxed">
              <p>
                Momis Wardrobe ki shuruaat ek simple khwaab se hui — har Pakistani 
                woman ko affordable prices par premium quality fashion provide karna.
              </p>
              <p>
                Hum samajhte hain ke aap ka style aap ki personality ka hissa hai. 
                Isliye hum carefully curate karte hain har piece jo humari collection 
                mein aata hai — elegant dresses se le kar trendy bags aur shoes tak.
              </p>
              <p>
                Aaj hum proud hain ke hazaron khush customers humari family ka hissa 
                hain. Aap ka trust humari sabse bari achievement hai! ❤️
              </p>
            </div>
          </div>
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
            <Image
              src="https://images.pexels.com/photos/17559253/pexels-photo-17559253.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800"
              alt="Elegant fashion"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-warm-gray-50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2
              className="font-serif text-3xl text-warm-gray-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Kyun Choose Karein Momis Wardrobe?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Award className="text-rose-500" size={32} />,
                title: "Premium Quality",
                desc: "Har product quality checked hai. Fabric, stitching, finishing — sab best hai."
              },
              {
                icon: <Truck className="text-rose-500" size={32} />,
                title: "All Pakistan Delivery",
                desc: "Lahore se Quetta tak, har sheher mein COD ke saath delivery."
              },
              {
                icon: <Heart className="text-rose-500" size={32} />,
                title: "Customer Love",
                desc: "Hazaron satisfied customers jo baar baar aate hain."
              },
              {
                icon: <Users className="text-rose-500" size={32} />,
                title: "Style Guidance",
                desc: "Confused ho? WhatsApp karein, hum styling tips dete hain!"
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-warm-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-warm-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-warm-gray-900 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2
            className="font-serif text-3xl sm:text-4xl mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Ready to Shop?
          </h2>
          <p className="text-warm-gray-400 mb-8">
            Explore our latest collection and find your perfect style!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 bg-white text-warm-gray-900 px-8 py-3.5 rounded-full font-semibold hover:bg-rose-50 transition-colors"
            >
              Shop Now <ArrowRight size={18} />
            </Link>
            <a
              href="https://wa.me/923295578925"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-green-600 transition-colors"
            >
              <MessageCircle size={18} /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
