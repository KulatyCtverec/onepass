import React from "react";

export default function TicketTypes() {
  return (
    <div className="bg-primary-600 p-5 rounded-2xl text-white">
      <h2 className="text-2xl font-bold mb-4">Typy lístků</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-secondary-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Standardní lístek</h3>
          <p className="text-secondary-400">
            Standardní lístek pro všechny události
          </p>
          <p className="text-secondary-300">Cena: 100 Kč</p>
        </div>
        <div className="bg-secondary-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">VIP lístek</h3>
          <p className="text-secondary-400">VIP lístek pro všechny události</p>
          <p className="text-secondary-300">Cena: 200 Kč</p>
        </div>
      </div>
    </div>
  );
}
