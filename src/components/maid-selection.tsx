import React from "react";

const MAIDS = [
  {
    name: "Marija Jović",
    desc: "Specijalista za održavanje higijene sa 5+ godina iskustva, Marija se fokusira na pedantnost i stvaranje harmoničnog doma za vaše opuštanje.",
    img: "/maid1.jpg",
    href: "/marija_kalendar"
  },
  {
    name: "Jelena Simić",
    desc: "Vedra, energična i detaljna – Jelena je stručnjak za organizaciju prostora koji pretvara haos u savršen red.",
    img: "/maid2.jpg",
    href: "/jelena_kalendar"
  },
  {
    name: "Milica Radić",
    desc: "Pedantna i uvek nasmejana, Milica se brine da svaki kutak vašeg doma blista, pružajući vam savršen mir nakon napornog dana.",
    img: "/maid3.jpg",
    href: "/milica_kalendar"
  }
];

export default function MaidSelection() {
  return (
    <section className="w-full py-[80px] md:py-[120px] px-[24px] md:px-[64px] bg-white">
      <div className="max-w-[1200px] mx-auto">
        {/* Grid koji na mobilnom ređa jednu ispod druge, a na desktopu tri u redu */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[48px] md:gap-[40px]">
          {MAIDS.map((maid, index) => (
            <a 
              key={index} 
              href={maid.href} 
              className="flex flex-col items-center group cursor-pointer transition-all"
            >
              {/* Kontejner za sliku sa zaobljenim ivicama (24px) */}
              <div className="relative aspect-[4/5] w-full rounded-[24px] overflow-hidden mb-[24px] md:mb-[32px] bg-gray-100">
                <img 
                  src={maid.img} 
                  alt={maid.name}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              
              {/* Tekstualni sadržaj - Centrirano (text-center) */}
              <div className="text-center px-2">
                <h3 className="text-[26px] md:text-[30px] font-medium text-black mb-[12px] tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                  {maid.name}
                </h3>
                <p className="text-[14px] md:text-[16px] text-[#666] leading-relaxed font-normal">
                  {maid.desc}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}