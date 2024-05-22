import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsAlphanumeric,
  Matches,
  IsOptional,
} from "class-validator";

export class CreateChannelDto {
  @IsOptional()
  @IsString({ message: "Key must be a string" })
  @MinLength(6, { message: "Key must be at least 6 characters long" })
  key?: string;

  @IsString({ message: "State must be a string" })
  @IsNotEmpty({ message: "State cannot be empty" })
  state: string;

  @IsOptional()
  @IsString({ message: "Picture must be a string" })
  @Matches(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/, {
    message: "Picture must be a valid URL",
  })
  picture: string;

  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name cannot be empty" })
  @MinLength(3, { message: "Name must be at least 3 characters long" })
  @MaxLength(20, { message: "Name cannot be longer than 20 characters" })
  @Matches(/^[a-zA-Z_]+$/, { message: "Name can only contain alphabet characters and underscores" })
  name: string;

  @IsOptional()
  @IsString({ message: "Topic  must be a string" })
  @MinLength(3, { message: "Topic must be at least 3 characters long" })
  topic: string;
}
