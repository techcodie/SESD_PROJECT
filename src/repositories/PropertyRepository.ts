import { Property } from '../models/Property';
import { IPropertyRepository } from '../interfaces/IPropertyRepository';

export class PropertyRepository implements IPropertyRepository {
  private static instance: PropertyRepository;
  private properties: Property[] = [];

  private constructor() {}

  public static getInstance(): PropertyRepository {
    if (!PropertyRepository.instance) {
      PropertyRepository.instance = new PropertyRepository();
    }
    return PropertyRepository.instance;
  }

  public save(property: Property): Property {
    this.properties.push(property);
    return property;
  }

  public update(propertyId: string, details: Partial<Property>): Property | null {
    const property = this.findById(propertyId);
    if (property) {
      property.updateListing(details);
      return property;
    }
    return null;
  }

  public findById(propertyId: string): Property | undefined {
    return this.properties.find(p => p.propertyId === propertyId);
  }

  public findAll(): Property[] {
    return this.properties;
  }
}
