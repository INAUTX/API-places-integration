import { Controller, Post, Body } from '@nestjs/common';
import { PlacesService } from './places.service';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post()
  async findAndSavePlaces(@Body() data: { id: string; address: string }) {
    const { id, address } = data;
    const savedPlaces = await this.placesService.findAndSavePlaces(id, address);
    return savedPlaces;
  }
}
