import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


@Injectable()
export class SeedService {
 

  private readonly axios: AxiosInstance = axios;

  constructor(

    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>

  ){}

  async executeSeed(){

        await  this.pokemonModel.deleteMany({});

    const {data} = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650' )
    
    // const insertarPromisesArray = [];

    const pokemonToInsert: {name: string, no:number}[] = [];

      data.results.map(({name, url}) => {
      
     const segments = url.split('/');
      const no = +segments[segments.length-2];
      

      

      console.log({name,no})
      // const Pokemon = await this.pokemonModel.create({name, no});
      // return {name, no};  

      // insertarPromisesArray.push( this.pokemonModel.create({name, no}));

        pokemonToInsert.push({name, no});
    });
   
    // await Promise.all(pokemonToInsert);
    

      this.pokemonModel.insertMany(pokemonToInsert);

    //await this.pokemonModel.deleteMany({});
   // const pokemons = await this.pokemonModel.insertMany(seedData)

    return "Seed Ejectuado";
    

  }

}
