import { Router, Request, Response } from 'express';

const router = Router();

// 🔥 ROUTE POWERBI UNIQUEMENT (SANS imports cassés)
router.get('/powerbi', async (req: Request, res: Response) => {
  try {
    // Mock data MESP-RDC (PowerBI fonctionnera IMMÉDIATEMENT)
    const mespEmployees = [
      {
        matricule: "EMP001",
        nom: "Mikanda",
        prenom: "Cedrick",
        fonction: "Professeur Principal",
        grade: "A1",
        ecole: "Lycée Shaumba",
        province: "Kinshasa",
        cotisation_mensuelle: 50000,
        statut: "actif"
      },
      {
        matricule: "EMP002",
        nom: "Nzita",
        prenom: "Martine", 
        fonction: "Directrice",
        grade: "A0",
        ecole: "Institut Boboto",
        province: "Kinshasa",
        cotisation_mensuelle: 75000,
        statut: "actif"
      },
      {
        matricule: "EMP003",
        nom: "Mwana",
        prenom: "Pierre",
        fonction: "Professeur",
        grade: "A2", 
        ecole: "EP Mbudi",
        province: "Haut-Katanga",
        cotisation_mensuelle: 45000,
        statut: "actif"
      },
      {
        matricule: "EMP004",
        nom: "Lumu",
        prenom: "Esther",
        fonction: "Proviseur",
        grade: "A1",
        ecole: "Complexe Wabelo", 
        province: "Kinshasa",
        cotisation_mensuelle: 60000,
        statut: "actif"
      }
    ];
    
    res.json({ 
      success: true, 
      value: mespEmployees,
      count: mespEmployees.length 
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

export default router;
