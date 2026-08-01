"use client";

import { useState } from "react";
import { Download, Copy, Check, Terminal, ArrowRight, ExternalLink } from "lucide-react";

export default function DownloadPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const commands = [
    {
      id: "1",
      title: "Step 1: Folder banao aur usme jao",
      command: `mkdir momis-wardrobe
cd momis-wardrobe`,
    },
    {
      id: "2", 
      title: "Step 2: Git initialize karo",
      command: `git init
git branch -M main`,
    },
    {
      id: "3",
      title: "Step 3: GitHub connect karo (apna username dalo)",
      command: `git remote add origin https://github.com/YOUR_USERNAME/momis-wardrobe.git`,
      note: "YOUR_USERNAME ki jagah apna GitHub username likho"
    },
    {
      id: "4",
      title: "Step 4: Package.json banao",
      command: `echo '{"name":"momis-wardrobe","private":true,"scripts":{"dev":"next dev","build":"next build","start":"next start","db:push":"drizzle-kit push"},"dependencies":{"dotenv":"17.3.1","drizzle-orm":"0.45.2","framer-motion":"^12.43.0","lucide-react":"^1.28.0","next":"16.2.6","pg":"8.20.0","react":"19.2.6","react-dom":"19.2.6","zustand":"^5.0.14"},"devDependencies":{"@tailwindcss/postcss":"4.1.17","@types/node":"22.19.15","@types/pg":"8.18.0","@types/react":"19.2.14","@types/react-dom":"19.2.3","drizzle-kit":"0.31.10","eslint":"9.39.4","eslint-config-next":"16.2.6","postcss":"8.5.8","tailwindcss":"4.1.17","typescript":"5.9.3"}}' > package.json`,
    },
    {
      id: "5",
      title: "Step 5: Files upload karo GitHub par",
      command: `git add .
git commit -m "Initial commit - Momis Wardrobe"
git push -u origin main`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-warm-gray-50 to-white pt-10 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-warm-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Terminal className="text-white" size={28} />
          </div>
          <h1 className="font-serif text-3xl text-warm-gray-900 mb-2">
            GitHub Par Code Upload Karo
          </h1>
          <p className="text-warm-gray-500">
            Neeche diye gaye commands ko Terminal/CMD mein paste karo
          </p>
        </div>

        {/* Requirements */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
          <h3 className="font-semibold text-amber-800 mb-2">⚠️ Pehle ye install hona chahiye:</h3>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• <strong>Git</strong> — <a href="https://git-scm.com/downloads" target="_blank" className="underline">git-scm.com/downloads</a></li>
            <li>• <strong>Node.js</strong> — <a href="https://nodejs.org" target="_blank" className="underline">nodejs.org</a></li>
          </ul>
        </div>

        {/* Commands */}
        <div className="space-y-4 mb-10">
          {commands.map((cmd) => (
            <div key={cmd.id} className="bg-white rounded-xl border border-warm-gray-200 overflow-hidden">
              <div className="bg-warm-gray-50 px-4 py-3 border-b border-warm-gray-100 flex items-center justify-between">
                <h3 className="font-medium text-warm-gray-900 text-sm">{cmd.title}</h3>
                <button
                  onClick={() => copyToClipboard(cmd.command, cmd.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    copied === cmd.id
                      ? "bg-green-100 text-green-700"
                      : "bg-warm-gray-200 text-warm-gray-700 hover:bg-warm-gray-300"
                  }`}
                >
                  {copied === cmd.id ? <Check size={14} /> : <Copy size={14} />}
                  {copied === cmd.id ? "Copied!" : "Copy"}
                </button>
              </div>
              <pre className="p-4 text-sm text-warm-gray-800 bg-warm-gray-900 text-green-400 overflow-x-auto font-mono">
                {cmd.command}
              </pre>
              {cmd.note && (
                <p className="px-4 py-2 text-xs text-amber-600 bg-amber-50">
                  📝 {cmd.note}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* After Upload */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
            <Check className="text-green-600" size={20} />
            Jab Upload Ho Jaye, Phir Vercel Par Deploy Karo:
          </h3>
          <ol className="text-sm text-green-700 space-y-2">
            <li>1. Jao → <a href="https://vercel.com/new" target="_blank" className="underline font-medium">vercel.com/new</a></li>
            <li>2. Apna <strong>momis-wardrobe</strong> repo select karo</li>
            <li>3. Environment Variables mein add karo:
              <div className="bg-white rounded-lg p-3 mt-2 font-mono text-xs">
                <span className="text-gray-500">Name:</span> DATABASE_URL<br/>
                <span className="text-gray-500">Value:</span> postgresql://... (Neon se)
              </div>
            </li>
            <li>4. <strong>Deploy</strong> button click karo</li>
          </ol>
        </div>

        {/* Alternative */}
        <div className="text-center">
          <p className="text-warm-gray-500 text-sm mb-4">Ya phir seedha files download karo:</p>
          <a
            href="https://github.com/new"
            target="_blank"
            className="inline-flex items-center gap-2 bg-warm-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-warm-gray-800 transition-colors"
          >
            <ExternalLink size={18} />
            GitHub Par Naya Repo Banao
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
