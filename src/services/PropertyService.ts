import { PropertyRepository } from '../repositories/PropertyRepository';
import { Property } from '../models/Property';
import { Address } from '../models/Address';
import { PropertyStatus } from '../models/Enums';
import { IPropertyService } from '../interfaces/IPropertyService';
import { v4 as uuidv4 } from 'uuid';

export class PropertyService implements IPropertyService {
  private propertyRepository: PropertyRepository;

  constructor() {
    this.propertyRepository = PropertyRepository.getInstance();
  }

  public addProperty(
    ownerId: string,
    title: string,
    description: string,
    price: number,
    addressData: any
  ): Property {
    const address = new Address(
      uuidv4(),
      addressData.street,
      addressData.city,
      addressData.state,
      addressData.zipCode
    );

    const property = new Property(
      uuidv4(),
      ownerId,
      title,
      description,
      price,
      PropertyStatus.PENDING_VERIFICATION,
      address
    );

    return this.propertyRepository.save(property);
  }

  public getAllProperties(): Property[] {
    return this.propertyRepository.findAll();
  }

  public getPropertyById(propertyId: string): Property | undefined {
    return this.propertyRepository.findById(propertyId);
  }

  public updatePropertyStatus(propertyId: string, status: PropertyStatus): Property | null {
    return this.propertyRepository.update(propertyId, { status });
  }

  public verifyProperty(propertyId: string): Property | null {
    return this.propertyRepository.update(propertyId, { status: PropertyStatus.AVAILABLE });
  }
}
