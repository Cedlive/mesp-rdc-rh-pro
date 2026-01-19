const mongoose = require('mongoose');
const axios = require('axios');

async function seedMESP() {
  console.log('🚀 === SEED MESP-RDC COMPLET ===');
  
  try {
    // 1. Connexion MongoDB
    await mongoose.connect('mongodb://localhost:27017/mesp_rdc');
    console.log('✅ MongoDB connecté: mesp_rdc');
    
    // 2. GÉNÉRER 1000 ENSEIGNANTS MESP
    console.log('📊 Génération 1000 enseignants...');
    const enseignants = [];
    const prenoms = ['Joseph','Marie','Pierre','Esther','Jean','Martine','Paul','Sarah','David','Rachel'];
    const ecoles = ['Lycée Shaumba','Institut Boboto','EP Mbudi','Complexe Wabelo','Lycée Toolz','EP Kintambo','Institut Ngaliema','Ecole Alliance','Lycée Bambote','EP Bondeko'];
    const provinces = ['Kinshasa','Haut-Katanga','Tshopo','Kasaï','Équateur','Nord-Kivu'];
    
    for(let i = 1; i <= 1000; i++) {
      enseignants.push({
        matricule: `EMP${String(i).padStart(3,'0')}`,
        nom: `Enseignant${i}`,
        prenom: prenoms[i % 10],
        fonction: i % 10 === 0 ? 'Directeur' : (i % 5 === 0 ? 'Proviseur' : 'Professeur'),
        grade: i % 3 === 0 ? 'A1' : (i % 6 === 0 ? 'A0' : 'A2'),
        ecole: ecoles[i % 10],
        province: provinces[i % 6],
        telephone: `+24398${String(1000000 + i).slice(-6)}`,
        email: `emp${i}@mesp.cd`,
        cotisation_mensuelle: 40000 + (i % 50 * 1000),
        statut: i % 20 === 0 ? 'suspendu' : 'actif',
        date_embauche: new Date(2018 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
      });
    }
    
    // 3. HOPITAUX PARTENAIRES (10)
    const hopitaux = [
      {nom: "Clinique Médico-Chirurgicale Pigeon", ville: "Kinshasa", niveau: "L3", capacite: 250, services: ["Chirurgie", "Maternité"]},
      {nom: "Hôpital Monkole", ville: "Kinshasa", niveau: "L3", capacite: 320, services: ["Cardiologie", "Pédiatrie"]},
      {nom: "Maternité Biamba", ville: "Kinshasa", niveau: "L2", capacite: 180, services: ["Maternité", "Gynécologie"]},
      {nom: "Clinique Nganda", ville: "Lubumbashi", niveau: "L3", capacite: 200, services: ["Urgences", "Chirurgie"]},
      {nom: "Hôpital Sendwe", ville: "Lubumbashi", niveau: "L3", capacite: 450, services: ["Réanimation", "Neuro"]},
      {nom: "Centre Hospitalier Kisangani", ville: "Kisangani", niveau: "L2", capacite: 150, services: ["Médecine Générale"]},
      {nom: "Clinique de Kasaï", ville: "Kananga", niveau: "L2", capacite: 120, services: ["Pédiatrie", "Maternité"]},
      {nom: "Hôpital de Mbandaka", ville: "Mbandaka", niveau: "L3", capacite: 280, services: ["Chirurgie", "Infectiologie"]},
      {nom: "Centre Médical Goma", ville: "Goma", niveau: "L2", capacite: 200, services: ["Urgences", "Traumatologie"]},
      {nom: "Hôpital de Beni", ville: "Beni", niveau: "L1", capacite: 80, services: ["Médecine Générale"]}
    ];
    
    // 4. PAIE Janvier 2026 (100 premiers)
    const paie = enseignants.slice(0,100).map(emp => ({
      matricule: emp.matricule,
      mois: "2026-01",
      montant_brut: emp.cotisation_mensuelle * 15 + 500000,
      cotisation_mesp: emp.cotisation_mensuelle,
      net_payer: emp.cotisation_mensuelle * 14 + 500000,
      date_paiement: new Date('2026-01-15')
    }));
    
    // 5. COTISATIONS (récapitulatif)
    const cotisations = [
      {mois: "2026-01", total_recu: 4850000, prevu: 5000000, taux_recouvrement: 97},
      {mois: "2025-12", total_recu: 4620000, prevu: 5000000, taux_recouvrement: 92.4},
      {mois: "2025-11", total_recu: 4780000, prevu: 5000000, taux_recouvrement: 95.6}
    ];
    
    // 6. INSERTION PARALLÈLE
    console.log('💾 Insertion des données...');
    
    // Enseignants via API
    await axios.post('http://localhost:5001/api/employes/batch', {data: enseignants});
    
    // Direct MongoDB pour autres collections
    const db = mongoose.connection.db;
    await db.collection('hopitaux').insertMany(hopitaux);
    await db.collection('paie').insertMany(paie);
    await db.collection('cotisations').insertMany(cotisations);
    
    // Écoles (extrait des enseignants)
    const uniqueEcoles = [...new Set(enseignants.map(e => e.ecole))].map((ecole, i) => ({
      nom: ecole,
      province: enseignants.find(e => e.ecole === ecole).province,
      enseignants: enseignants.filter(e => e.ecole === ecole).length,
      directeurs: enseignants.filter(e => e.ecole === ecole && e.fonction === 'Directeur').length
    }));
    await db.collection('ecoles').insertMany(uniqueEcoles);
    
    // Communications (annonces)
    const communications = [
      {titre: "🚨 CAMPAGNE ADHÉSION 2026", contenu: "Inscription avant 31 Mars!", date: new Date('2026-01-19'), type: "important"},
      {titre: "Nouveaux hôpitaux partenaires", contenu: "Monkole + Biamba agréés", date: new Date('2026-01-15'), type: "info"}
    ];
    await db.collection('communications').insertMany(communications);
    
    console.log('🎉 === SEED MESP-RDC TERMINÉ ===');
    console.log(`✅ 1000 enseignants`);
    console.log(`✅ 10 hôpitaux partenaires`);
    console.log(`✅ 100 paies Janvier 2026`);
    console.log(`✅ 3 rapports cotisations`);
    console.log(`✅ ${uniqueEcoles.length} écoles`);
    console.log(`✅ 2 communications`);
    
  } catch (error) {
    console.error('❌ ERREUR SEED:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedMESP();
