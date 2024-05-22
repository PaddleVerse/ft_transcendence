import { IsString, IsNotEmpty, MinLength, MaxLength, IsAlphanumeric, Matches } from "class-validator";

export class CreateUserDto 
{
    @IsString({ message: "Nickname must be a string" })
    @IsNotEmpty({ message: "Nickname cannot be empty" })
    @MinLength(3, { message: "Nickname must be at least 3 characters long" })
    @MaxLength(20, { message: "Nickname cannot be longer than 20 characters" })
    @Matches(/^[a-zA-Z_]+$/, { message: "Nickname can only contain alphabet characters and underscores" })
    nickname: string;
    
    @IsString({ message: "Password must be a string" })
    @IsNotEmpty({ message: "Password cannot be empty" })
    @MinLength(6, { message: "Password must be at least 6 characters long" })
    @MaxLength(20, { message: "Password cannot be longer than 20 characters" })
    @IsAlphanumeric()
    password: string;

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
