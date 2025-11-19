import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IsString } from 'class-validator';


@Injectable()
export class PokemonService {
  
  
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>

  ){}

  async create(createPokemonDto: CreatePokemonDto) {

    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
   
   
   
    try{
    const pokemon = await this.pokemonModel.create(createPokemonDto)
    return pokemon;

    }catch(error){
      
          this.handleExceptions(error)

    }
   
    


  }

   findAll() {
    
    const pokemon =  this.pokemonModel.find();

    return pokemon;

  }

  async findOne(term: string) {
    
   

    let pokemon: Pokemon;

    if( !isNaN(+term)){

      pokemon = await this.pokemonModel.findOne({no: term})

    }


    if( !pokemon && isValidObjectId(term)){
      
      pokemon = await this.pokemonModel.findById(term);
    
    } 

    


    if(!pokemon)
      pokemon = await this.pokemonModel.findOne({name: term.toLocaleLowerCase().trim()})

    if(!pokemon) throw new NotFoundException('Elemento no encontrado')

    
    return pokemon;
    

  }


  async update(no: string, updatePokemonDto: UpdatePokemonDto) 
  {
          
          const pokemon = await this.findOne(no)

          if(updatePokemonDto.name)
          updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();

   
    try{

          
          

          await pokemon.updateOne(updatePokemonDto)

          return {...pokemon.toJSON(), ...updatePokemonDto};
      }catch(error){

          this.handleExceptions(error)

      }



  }

  

  

  async remove(id: string) {
   
    // const pok = await this.findOne(id)
    // await pok.deleteOne();

    const { deletedCount} = await this.pokemonModel.deleteOne({_id:id});
    
    if(deletedCount === 0) throw new BadRequestException(`Pokemon con id: ${id} not found`)
    return ;
  }


  private handleExceptions(error: any){

 if(error.code === 11000)
          throw new BadRequestException(`Pokeomon  existe ${JSON.stringify(error.keyValue)}`)

    console.log(error);
    throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`)


  }


}