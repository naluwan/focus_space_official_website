import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';
import { Db } from 'mongodb';

export interface IAdmin {
  _id?: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'superadmin';
  createdAt?: Date;
  updatedAt?: Date;
}

class AdminModel {
  private db: Db | null = null;

  async getDb() {
    if (!this.db) {
      const client = await clientPromise;
      this.db = client.db('focus_space');
    }
    return this.db;
  }

  async collection() {
    const db = await this.getDb();
    return db.collection<IAdmin>('admins');
  }

  async findByEmail(email: string): Promise<IAdmin | null> {
    const admins = await this.collection();
    return await admins.findOne({ email });
  }

  async create(adminData: Omit<IAdmin, '_id' | 'createdAt' | 'updatedAt'>): Promise<IAdmin> {
    const admins = await this.collection();
    
    // Hash password
    const hashedPassword = await bcrypt.hash(adminData.password, 12);
    
    const newAdmin = {
      ...adminData,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await admins.insertOne(newAdmin);
    return { ...newAdmin, _id: result.insertedId.toString() };
  }

  async validatePassword(inputPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(inputPassword, hashedPassword);
  }

  async initializeDefaultAdmin(): Promise<void> {
    const defaultEmail = 'focusspace4648@gmail.com';
    const existingAdmin = await this.findByEmail(defaultEmail);
    
    if (!existingAdmin) {
      await this.create({
        email: defaultEmail,
        password: 'f22588228f',
        name: 'Focus Space Admin',
        role: 'superadmin',
      });
      console.log('Default admin account created');
    }
  }
}

const adminModel = new AdminModel();
export default adminModel;