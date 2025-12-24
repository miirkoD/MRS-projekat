import NavBar from "@/components/navbar";
import Footer from "../_components/footer";
import MaidSelection from "@/components/maid-selection";

export default function MaidSelectionPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="sticky top-0 z-50">
        <NavBar />
      </div>
      
      <main className="flex-grow">
        {/* Ovde možeš dodati i neki naslov stranice ako želiš */}
        <div className="py-10 text-center bg-gray-50">
          <h1 className="text-4xl font-bold text-black">Naši Eksperti</h1>
          <p className="text-gray-500 mt-2">Izaberite osobu koja najbolje odgovara vašim potrebama</p>
        </div>

        <MaidSelection />
      </main>

      <Footer />
    </div>
  );
}