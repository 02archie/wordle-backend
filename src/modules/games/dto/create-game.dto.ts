import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateGameDto {
  @IsNumber()
  @IsNotEmpty()
  player_id: number;

  @IsString()
  @MaxLength(5)
  @MinLength(5)
  @IsOptional()
  word_user: string;

  word: string;
}
