import { Property } from '../models/Property';
import { PropertyStatus } from '../models/Enums';

export interface IPropertyRepository {
  save(property: Property): Property;
  update(propertyId: string, details: Partial<Property>): Property | null;
  findById(propertyId: string): Property | undefined;
  findAll(): Property[];
}
