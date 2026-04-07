import { Property } from '../models/Property';
import { PropertyStatus } from '../models/Enums';

export interface IPropertyService {
  addProperty(ownerId: string, title: string, description: string, price: number, addressData: any): Property;
  getAllProperties(): Property[];
  getPropertyById(propertyId: string): Property | undefined;
  updatePropertyStatus(propertyId: string, status: PropertyStatus): Property | null;
  verifyProperty(propertyId: string): Property | null;
}
