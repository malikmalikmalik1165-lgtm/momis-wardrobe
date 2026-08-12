"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, X } from "lucide-react";

const CERT_TYPES = [
  { id: "welcome", icon: "🎉", name: "Welcome Certificate", desc: "Naye member ko welcome", color: "#0f766e", sub: "Official Team Member — Momis Wardrobe" },
  { id: "completion", icon: "📜", name: "Training Completion", desc: "Course complete karne par", color: "#1e40af", sub: "Social Media Marketing Training" },
  { id: "performance", icon: "⭐", name: "Best Performance", desc: "Outstanding sales", color: "#065f46", sub: "Outstanding Sales Performance" },
  { id: "appreciation", icon: "❤️", name: "Appreciation", desc: "Dedicated member", color: "#9f1239", sub: "Dedicated Team Member" },
  { id: "top_seller", icon: "🏅", name: "Top Seller Award", desc: "Monthly best", color: "#92400e", sub: "Monthly Best Performer" },
  { id: "rising_star", icon: "🚀", name: "Rising Star", desc: "Fastest growing", color: "#5b21b6", sub: "Fastest Growing Member" },
];

function buildCertHTML(name: string, date: string, note: string, title: string, sub: string, color: string, certId: string) {
  const noteHtml = note ? `<p style="font-size:12px;color:#57534e;margin-top:12px;font-style:italic">"${note}"</p>` : "";
  return `<!DOCTYPE html><html><head><title>Certificate - ${name}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{display:flex;align-items:center;justify-content:center;min-height:100vh;background:#f5f5f4;font-family:'Georgia',serif}
.cert{width:800px;background:white;border:3px solid ${color};padding:12px}
.ci{border:2px solid ${color}44;padding:50px 60px;text-align:center;min-height:520px;position:relative}
.c{position:absolute;width:40px;height:40px;border:3px solid ${color}}
.tl{top:8px;left:8px;border-right:none;border-bottom:none}.tr{top:8px;right:8px;border-left:none;border-bottom:none}
.bl{bottom:8px;left:8px;border-right:none;border-top:none}.br{bottom:8px;right:8px;border-left:none;border-top:none}
.lo{font-size:16px;color:#a8a29e;letter-spacing:3px;text-transform:uppercase;margin-bottom:20px}.lo b{color:${color}}
.ti{font-size:32px;color:${color};margin:10px 0;font-weight:400;letter-spacing:2px}
.su{font-size:14px;color:#78716c;letter-spacing:1px;margin-bottom:30px}
.pr{font-size:12px;color:#a8a29e;text-transform:uppercase;letter-spacing:3px}
.nm{font-size:38px;color:#1c1917;margin:15px 0;font-style:italic;border-bottom:2px solid ${color}33;padding-bottom:10px;display:inline-block;min-width:350px}
.de{font-size:13px;color:#57534e;line-height:1.8;max-width:500px;margin:20px auto}
.ft{display:flex;justify-content:space-between;align-items:flex-end;margin-top:40px}
.sb{text-align:center}.sl{width:150px;border-top:1px solid #1c1917;margin-top:40px;padding-top:6px}
.sn{font-size:11px;color:#1c1917;font-weight:bold}.st{font-size:9px;color:#78716c}
.sp{width:80px;height:80px;border:3px solid ${color};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:8px;color:${color};text-align:center;font-weight:bold;text-transform:uppercase;letter-spacing:1px;line-height:1.2;transform:rotate(-15deg);opacity:.7}
.id{font-size:9px;color:#d6d3d1;position:absolute;bottom:15px;right:20px}
@media print{body{background:white}.no-print{display:none!important}}
</style></head><body>
<div><div class="cert"><div class="ci">
<div class="c tl"></div><div class="c tr"></div><div class="c bl"></div><div class="c br"></div>
<div class="lo">Momis <b>Wardrobe</b></div>
<div class="ti">${title}</div><div class="su">${sub}</div>
<div class="pr">This certificate is proudly presented to</div>
<div class="nm">${name}</div>
<div class="de">In recognition of exceptional dedication, professional excellence, and valuable contribution to Momis Wardrobe's mission of empowering women through fashion entrepreneurship in Pakistan.</div>${noteHtml}
<div class="ft"><div class="sb"><div class="sl"><div class="sn">Momis Wardrobe</div><div class="st">Owner & CEO</div></div></div>
<div class="sp">MOMIS<br/>WARDROBE<br/>✦<br/>CERTIFIED</div>
<div class="sb"><div class="sl"><div class="sn">${date}</div><div class="st">Certificate ID: ${certId}</div></div></div></div>
<div class="id">${certId}</div>
</div></div>
<div class="no-print" style="text-align:center;margin-top:20px">
<button onclick="window.print()" style="background:#1c1917;color:white;border:none;padding:14px 40px;border-radius:8px;font-size:15px;cursor:pointer;font-weight:bold">🖨 Save as PDF</button>
<p style="font-size:11px;color:#a8a29e;margin-top:8px;font-family:sans-serif">Ctrl+P → Printer mein "Save as PDF" → Save</p>
</div></div></body></html>`;
}

export default function CertificatesPage() {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const auth = localStorage.getItem("momis-admin-auth");
    if (auth !== "true") { window.location.href = "/admin"; return; }
    fetch("/api/admin/team").then(r => r.json()).then(d => { setTeamMembers(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const issueCert = (certType: typeof CERT_TYPES[0], prefillName?: string) => {
    const name = prompt("Certificate par NAAM likhein:", prefillName || "");
    if (!name) return;
    const date = prompt("DATE likhein:", new Date().toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" }));
    if (!date) return;
    const note = prompt("Extra Note (optional):", "") || "";
    const certId = `MW-CERT-${Date.now().toString(36).toUpperCase()}`;
    const html = buildCertHTML(name, date, note, certType.name, certType.sub, certType.color, certId);
    setPreview(html);
  };

  const printCert = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.print();
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><RefreshCw className="animate-spin text-warm-gray-300" size={32}/></div>;

  return (
    <div className="min-h-screen bg-warm-gray-50">
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="p-1.5 hover:bg-warm-gray-100 rounded-lg"><ArrowLeft size={18}/></Link>
            <h1 className="font-bold text-lg">🏆 Certificates</h1>
          </div>
          <Link href="/admin" className="text-xs text-rose-500 font-medium">← Admin Panel</Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Certificate Types Grid */}
        <h2 className="font-bold text-warm-gray-900 mb-4">Certificate Type Select Karein</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          {CERT_TYPES.map((c) => (
            <button key={c.id} onClick={() => issueCert(c)}
              className="bg-white rounded-xl border border-warm-gray-100 p-4 text-left hover:shadow-lg hover:border-rose-200 transition-all group active:scale-95">
              <span className="text-2xl">{c.icon}</span>
              <h3 className="font-bold text-sm text-warm-gray-900 mt-2 group-hover:text-rose-600">{c.name}</h3>
              <p className="text-[10px] text-warm-gray-400 mt-0.5">{c.desc}</p>
            </button>
          ))}
        </div>

        {/* Team Members Quick Issue */}
        {teamMembers.length > 0 && (
          <>
            <h2 className="font-bold text-warm-gray-900 mb-4">Team Members Ko Directly Issue Karein</h2>
            <div className="bg-white rounded-xl border overflow-hidden mb-8">
              {teamMembers.map((m: any) => (
                <div key={m.id} className="px-4 py-3 border-b border-warm-gray-50 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{m.name}</p>
                    <p className="text-xs text-warm-gray-500">{m.phone} · {m.totalSales} sales</p>
                  </div>
                  <select onChange={(e) => {
                    if (!e.target.value) return;
                    const cert = CERT_TYPES.find(c => c.id === e.target.value);
                    if (cert) issueCert(cert, m.name);
                    e.target.selectedIndex = 0;
                  }} className="text-xs bg-amber-100 text-amber-800 px-3 py-1.5 rounded-lg font-semibold cursor-pointer border-0">
                    <option value="">🏆 Issue ▾</option>
                    {CERT_TYPES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 rounded-xl p-5">
          <h3 className="font-bold text-blue-800 text-sm mb-2">📝 PDF Kaise Save Karein</h3>
          <ol className="text-xs text-blue-700 space-y-1">
            <li>1. Certificate type ya member select karein</li>
            <li>2. Naam, Date, Note likhein (edit kar sakte hain)</li>
            <li>3. Certificate neeche preview mein dikhega</li>
            <li>4. <strong>"🖨 Save as PDF"</strong> button click karein</li>
            <li>5. Printer mein <strong>"Save as PDF"</strong> select → Save</li>
            <li>6. PDF file WhatsApp par member ko bhejein! 🎉</li>
          </ol>
        </div>
      </div>

      {/* ═══ CERTIFICATE PREVIEW MODAL — SAME PAGE ═══ */}
      {preview && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 border-b bg-warm-gray-50">
              <h3 className="font-bold text-sm">Certificate Preview</h3>
              <div className="flex items-center gap-2">
                <button onClick={printCert}
                  className="bg-warm-gray-900 text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-warm-gray-800 active:scale-95">
                  🖨 Save as PDF
                </button>
                <button onClick={() => setPreview(null)} className="p-1.5 hover:bg-warm-gray-200 rounded-lg"><X size={18}/></button>
              </div>
            </div>
            <div className="flex-1 overflow-auto bg-warm-gray-100 p-4">
              <iframe
                ref={iframeRef}
                srcDoc={preview}
                className="w-full bg-white rounded-lg shadow-lg"
                style={{ minHeight: "600px", border: "none" }}
              />
            </div>
            <div className="px-5 py-3 border-t bg-warm-gray-50 text-center">
              <p className="text-[10px] text-warm-gray-400">"Save as PDF" click karein → Printer mein "Save as PDF" select → Save</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
