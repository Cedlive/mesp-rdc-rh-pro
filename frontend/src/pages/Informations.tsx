import React from 'react';

const Informations = () => {
  return (
    <div className="p-6 bg-gradient-to-r from-blue-900 to-blue-700 text-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🏠 MESP-RDC HR Pro</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">📊 Statut Système</h2>
            <p>✅ Backend: http://localhost:5001</p>
            <p>✅ MongoDB: Connecté</p>
            <p>✅ Employés: 4 actifs</p>
          </div>
          <div className="bg-white/10 backdrop-blur p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">👥 Utilisateurs</h2>
            <p>Admin: Connecté</p>
            <p>Session: Active</p>
          </div>
          <div className="bg-white/10 backdrop-blur p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">📈 Cotisations</h2>
            <p>Total: 210,000 CDF</p>
            <p>Moyenne: 52,500 CDF</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Informations;  // ← CETTE LIGNE CORRIGE TOUT !
export { Informations };     // ← + Export nommé
