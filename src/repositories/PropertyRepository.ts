import { Property } from '../models/Property';
import { IPropertyRepository } from '../interfaces/IPropertyRepository';
import { PropertyStatus } from '../models/Enums';
import { Address } from '../models/Address';

export class PropertyRepository implements IPropertyRepository {
  private static instance: PropertyRepository;
  private properties: Property[] = [
    new Property('PROP-MOCK-1', 'USR-MOCK-2', 'Luxury Villa in Suburbs', 'A beautiful 4BHK villa with a private pool, garden, and smart home systems.', 25000000, PropertyStatus.AVAILABLE, new Address('ADDR-1', '10 Palm Ave', 'Mumbai', 'Maharashtra', '400050')),
    new Property('PROP-MOCK-2', 'USR-MOCK-2', 'Cozy Studio Apartment', 'Perfect for young professionals. Fully furnished and close to the metro station.', 4500000, PropertyStatus.PENDING_VERIFICATION, new Address('ADDR-2', '42 Main St', 'Pune', 'Maharashtra', '411001')),
    new Property('PROP-MOCK-3', 'USR-MOCK-4', 'Sea View Penthouse', 'Breathtaking ocean views from the 45th floor. Features a private terrace and premium interiors.', 85000000, PropertyStatus.AVAILABLE, new Address('ADDR-3', 'Marine Drive', 'Mumbai', 'Maharashtra', '400020')),
    new Property('PROP-MOCK-4', 'USR-MOCK-5', 'Modern 2BHK Flat', 'Spacious flat in a gated community with gym, pool, and 24/7 security.', 8500000, PropertyStatus.AVAILABLE, new Address('ADDR-4', 'Whitefield', 'Bangalore', 'Karnataka', '560066')),
    new Property('PROP-MOCK-5', 'USR-MOCK-4', 'Commercial Retail Space', 'Prime location shop space on the main highway. Perfect for retail or cafe.', 12000000, PropertyStatus.SOLD, new Address('ADDR-5', 'MG Road', 'Delhi', 'Delhi', '110001')),
    new Property('PROP-MOCK-6', 'USR-MOCK-2', 'Mountain Retreat Cabin', 'A quiet 3-bedroom cabin overlooking the mountains. Excellent for weekend getaways.', 15000000, PropertyStatus.AVAILABLE, new Address('ADDR-6', 'Hillside Way', 'Shimla', 'Himachal', '171001')),
    new Property('PROP-MOCK-7', 'USR-MOCK-4', 'Urban Smart Loft', 'Top floor loft with high ceilings and integrated AI lighting. Near the business district.', 11500000, PropertyStatus.AVAILABLE, new Address('ADDR-7', 'Tech Park Rd', 'Hyderabad', 'Telangana', '500081')),
    new Property('PROP-MOCK-8', 'USR-MOCK-5', 'Spacious Family Home', 'Classic 5BHK suburban home featuring a large backyard, newly renovated kitchen.', 32000000, PropertyStatus.AVAILABLE, new Address('ADDR-8', 'Oak Avenue', 'Chennai', 'Tamil Nadu', '600020')),
    new Property('PROP-MOCK-9', 'USR-MOCK-8', 'Student Shared Apartment', 'Budget-friendly 3BHK close to the university campus. Ideal for sharing.', 3500000, PropertyStatus.AVAILABLE, new Address('ADDR-9', 'Campus Drive', 'Pune', 'Maharashtra', '411005')),
    new Property('PROP-MOCK-10', 'USR-MOCK-2', 'Beachfront Condominium', 'Stunning 2BHK condo just steps away from the beach. Resort-style amenities included.', 42000000, PropertyStatus.AVAILABLE, new Address('ADDR-10', 'Coastal Highway', 'Goa', 'Goa', '403001')),
    new Property('PROP-MOCK-11', 'USR-MOCK-11', 'Forest Edge Villa', 'Immersive 3BHK luxury lodge built seamlessly into the lush evergreen forest edge.', 21000000, PropertyStatus.AVAILABLE, new Address('ADDR-11', 'Pine Crest', 'Dehradun', 'Uttarakhand', '248001')),
    new Property('PROP-MOCK-12', 'USR-MOCK-13', 'Downtown Highrise', 'Expansive 1-bedroom luxury suite atop the premier downtown tower with helipad access.', 65000000, PropertyStatus.PENDING_VERIFICATION, new Address('ADDR-12', 'Corporate Blvd', 'Mumbai', 'Maharashtra', '400013')),
    new Property('PROP-MOCK-13', 'USR-MOCK-15', 'Lakefront Estate', 'Massive 8BHK sprawling estate featuring a boathouse and private shoreline.', 125000000, PropertyStatus.AVAILABLE, new Address('ADDR-13', 'Lake View Rd', 'Udaipur', 'Rajasthan', '313001')),
    new Property('PROP-MOCK-14', 'USR-MOCK-8', 'Suburban Townhouse', 'Affordable 2-story family home nestled inside a peaceful green gated community.', 7200000, PropertyStatus.SOLD, new Address('ADDR-14', 'Maple Street', 'Chandigarh', 'Punjab', '160017')),
    new Property('PROP-MOCK-15', 'USR-MOCK-11', 'Eco-friendly Earthship', 'Off-grid sustainable home featuring solar tracking arrays and hydro-recycling.', 18500000, PropertyStatus.AVAILABLE, new Address('ADDR-15', 'Solar Way', 'Auroville', 'Tamil Nadu', '605101')),
    new Property('PROP-MOCK-16', 'USR-MOCK-5', 'Historic Colonial Manor', 'Beautifully preserved colonial architecture offering 6 large suites and ballroom.', 95000000, PropertyStatus.AVAILABLE, new Address('ADDR-16', 'Heritage Square', 'Kolkata', 'West Bengal', '700001'))
  ];

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

  public deleteProperty(propertyId: string): boolean {
    const initialLength = this.properties.length;
    this.properties = this.properties.filter(p => p.propertyId !== propertyId);
    return this.properties.length < initialLength;
  }
}
