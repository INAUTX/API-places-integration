import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { firstValueFrom } from 'rxjs';
import { NearbyPlace } from '@prisma/client';

@Injectable()
export class PlacesService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async getCoordinates(address: string): Promise<{ lat: number; lng: number }> {
    try {
      const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

      const response = await firstValueFrom(this.httpService.get(url));
      const location = response.data.results[0]?.geometry.location;

      if (!location) {
        throw new Error(
          'No se encontraron coordenadas para la dirección proporcionada.',
        );
      }

      return { lat: location.lat, lng: location.lng };
    } catch (error) {
      throw new Error(`Error al obtener las coordenadas: ${error.message}`);
    }
  }

  async getNearbyPlaces(lat: number, lng: number): Promise<any[]> {
    try {
      const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
      const radius = 1000;
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&key=${apiKey}`;

      const response = await firstValueFrom(this.httpService.get(url));
      return response.data.results;
    } catch (error) {
      throw new Error(`Error al obtener lugares cercanos: ${error.message}`);
    }
  }

  async findAndSavePlaces(id: string, address: string) {
    const { lat, lng } = await this.getCoordinates(address);
    const places = await this.getNearbyPlaces(lat, lng);

    const placeData = places.map((place) => ({
      externalId: id,
      address: address,
      latitude: lat,
      longitude: lng,
      placeName: place.name,
      placeType: place.types[0] || 'unknown',
    }));

    await this.prisma.nearbyPlace.createMany({
      data: placeData,
    });

    return placeData;
  }

  async softDelete(id: number): Promise<void>{
    const placeData = await this.prisma.nearbyPlace.findUnique({
      where: {id: id},
    })

    if(!placeData){
      throw new Error(`Not found place for id: ${id}`);
    }
    await this.prisma.nearbyPlace.update({
      where: {id: id},
      data: {deletedAt: new Date()},
    });
  }

  async restore(id: number): Promise<NearbyPlace>{
    return this.prisma.nearbyPlace.update({
      where: {id},
      data: {deletedAt: null},
    });
  }
}
