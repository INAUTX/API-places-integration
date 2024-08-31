import { Controller, Post, Body, Delete, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { PlacesService } from './places.service';
import { NearbyPlace } from '@prisma/client';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post()
  async findAndSavePlaces(@Body() data: { id: string; address: string }) {
    const { id, address } = data;
    const savedPlaces = await this.placesService.findAndSavePlaces(id, address);
    return savedPlaces;
  }

  @Delete()
  async softDelete(@Param('id', ParseIntPipe) id: number){
    await this.placesService.softDelete(id);
    return { message: 'Place deleted successfully' };
  }

  @Patch()
  async restore(@Param('id') id: string): Promise<NearbyPlace>{
    return this.placesService.restore(+id);
  }
}

