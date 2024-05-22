import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "../create-user.dto/create-user.dto";
import {IsString, IsNotEmpty, MinLength, MaxLength, Matches } from "class-validator";

export class UpdateUserDto extends PartialType(CreateUserDto)
{
    @IsString({ message: "Name must be a string" })
    @IsNotEmpty({ message: "Name cannot be empty" })
    @MinLength(3, { message: "Name must be at least 3 characters long" })
    @MaxLength(20, { message: "Name cannot be longer than 20 characters" })
    @Matches(/^[a-zA-Z_]+$/, { message: "Name can only contain alphabet characters and underscores" })
    name: string;

    @IsString({ message: "Middlename must be a string" })
    @IsNotEmpty({ message: "Middlename cannot be empty" })
    @MinLength(3, { message: "Middlename must be at least 3 characters long" })
    @MaxLength(20, { message: "Middlename cannot be longer than 20 characters" })
    @Matches(/^[a-zA-Z_]+$/, { message: "Middlename can only contain alphabet characters and underscores" })
    middlename: string;
}
