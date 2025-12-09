import React, { useState } from "react";
import { Phone, X } from "lucide-react";

// Floating emergency helpline button (bottom-left)
const EmergencyHelpFab = ({ theme }) => {
  const [open, setOpen] = useState(false);
  const helplines = [
    { label: "Emergency Services", number: "112" },
    { label: "AASRA (Suicide Prevention)", number: "+91-9820466726" },
    { label: "Vandrevala Foundation", number: "1860-2662-345" }
  ];

  return (
    <div className="fixed left-4 bottom-4 z-[1200] space-y-3">
      <div
        className={`rounded-lg shadow-lg overflow-hidden border border-cyan-200/40 ${
          open ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none translate-y-3"
        } transition-all duration-200 bg-white/90 dark:bg-slate-900/90 backdrop-blur`}
      >
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200/50 dark:border-slate-700/50">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow">
              <Phone className="w-3 h-3" />
            </span>
            <span className="text-[11px] font-semibold text-gray-800 dark:text-gray-100">
              Emergency Helplines
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-800"
            aria-label="Close helpline list"
          >
            <X className="w-3 h-3 text-gray-500" />
          </button>
        </div>

        <div className="px-3 py-2 space-y-1">
          {helplines.map((item) => (
            <a
              key={item.number}
              href={`tel:${item.number}`}
              className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-slate-800 dark:to-slate-800 hover:from-cyan-100 hover:to-blue-100 dark:hover:from-slate-700 dark:hover:to-slate-700 transition"
            >
              <div>
                <p className="text-[10px] font-semibold text-gray-800 dark:text-gray-100">{item.label}</p>
                <p className="text-[9px] text-cyan-700 dark:text-cyan-300">{item.number}</p>
              </div>
              <Phone className="w-3 h-3 text-cyan-600" />
            </a>
          ))}
          <p className="text-[9px] text-gray-500 dark:text-gray-400 text-center pt-0.5">
            Available 24/7
          </p>
        </div>
      </div>

      <button
        onClick={() => setOpen((v) => !v)}
        className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg flex items-center justify-center text-xl hover:scale-105 active:scale-95 transition"
        aria-label="Emergency helplines"
      >
        🚑
      </button>
    </div>
  );
};

export default EmergencyHelpFab;
