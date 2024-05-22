import { PartialType } from "@nestjs/mapped-types";
import { CreateChannelDto } from "./createChannelDto";
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from "class-validator";

export class UpdateChannelDto extends PartialType(CreateChannelDto) {
}
