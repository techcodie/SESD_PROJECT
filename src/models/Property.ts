import { Address } from './Address';
import { PropertyStatus } from './Enums';

export class Property {
  constructor(
    public propertyId: string,
    public ownerId: string,
    public title: string,
    public description: string,
    public price: number,
    public status: PropertyStatus,
    public location: Address
  ) {}

  public updateListing(details: Partial<Property>) {
    Object.assign(this, details);
  }
}
