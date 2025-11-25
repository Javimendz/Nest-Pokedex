import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, Min, MinLength } from "class-validator";

export class PaginationDto{


    
    @IsOptional()
    @Min(1)
    @IsNumber()
    limit?: number;

    @IsOptional()
    @IsPositive()
    @IsNumber()

    @Min(0)
    offset?: number;


}