import { Request, Response } from 'express';
import { PropertyService } from '../services/PropertyService';
import { PropertyStatus } from '../models/Enums';

export class PropertyController {
  private propertyService: PropertyService;

  constructor() {
    this.propertyService = new PropertyService();
  }

  public addProperty = (req: Request, res: Response): void => {
    try {
      const { ownerId, title, description, price, address } = req.body;

      if (!ownerId || !title || !price || !address) {
        res.status(400).json({ error: 'ownerId, title, price, and address are required' });
        return;
      }

      const property = this.propertyService.addProperty(
        ownerId,
        title,
        description || '',
        price,
        address
      );
      res.status(201).json(property);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  public getAllProperties = (req: Request, res: Response): void => {
    const properties = this.propertyService.getAllProperties();
    res.json(properties);
  };

  public getProperty = (req: Request, res: Response): void => {
    const property = this.propertyService.getPropertyById(req.params.id);
    if (!property) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }
    res.json(property);
  };

  public verifyProperty = (req: Request, res: Response): void => {
    const property = this.propertyService.verifyProperty(req.params.id);
    if (!property) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }
    res.json(property);
  };

  public updateStatus = (req: Request, res: Response): void => {
    const { status } = req.body;
    const validStatuses = Object.values(PropertyStatus);

    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
      return;
    }

    const property = this.propertyService.updatePropertyStatus(req.params.id, status);
    if (!property) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }
    res.json(property);
  };

  public deleteProperty = (req: Request, res: Response): void => {
    const success = this.propertyService.deleteProperty(req.params.id);
    if (success) {
      res.json({ message: 'Property deleted' });
    } else {
      res.status(404).json({ error: 'Property not found' });
    }
  };

  public updateProperty = (req: Request, res: Response): void => {
    const property = this.propertyService.updateProperty(req.params.id, req.body);
    if (property) {
      res.json(property);
    } else {
      res.status(404).json({ error: 'Property not found' });
    }
  };
}
