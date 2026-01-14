
import jwt from 'jsonwebtoken';
import { EmployeeService } from './EmployeeService';

// Clé secrète pour signer les tokens (devrait être dans .env)
const JWT_SECRET = process.env.JWT_SECRET || 'mesp_super_secret_key_2024_change_me';

export class AuthService {
  private employeeService = new EmployeeService();

  async loginUser(email: string, pass: string) {
    // 1. Chercher l'utilisateur (Utilisation de Mock Data pour l'instant)
    const employees = await this.employeeService.getAllEmployees();
    const user = employees.find(e => e.email.toLowerCase() === email.toLowerCase());

    // 2. Vérification simplifiée (En prod: utiliser bcrypt.compare)
    // Ici, on accepte le mot de passe 'admin' ou le mot de passe stocké si on a simulé une création
    const isValid = user && (pass === 'admin' || user.password === pass);

    if (!isValid) {
      throw new Error('Identifiants invalides');
    }

    // 3. Générer le Token JWT
    const token = jwt.sign(
      { id: user!.id, role: user!.role, email: user!.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // 4. Retourner les infos (sans le mot de passe)
    const { password, ...userWithoutPassword } = user as any;

    return {
      user: userWithoutPassword,
      token
    };
  }
}
