import { Controller, Post, Body, Get } from '@nestjs/common';
import { PlacesService } from './places.service';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post() //verify if the user is admin
  async findAndSavePlaces(@Body() data: { id: string; address: string }) {
    const { id, address } = data;
    const savedPlaces = await this.placesService.findAndSavePlaces(id, address);
    return savedPlaces;
  }
  @Get()
  async getNearbyPlaces(@Body() data: { address: string }) {
    const { address } = data;
    const result = await this.placesService.getSavedPlacesByAddress(address);
    return result
  }
}
