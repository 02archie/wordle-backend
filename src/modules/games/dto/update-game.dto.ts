import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateGameDto {
  @IsNotEmpty()
  id: number;

  @IsNumber()
  attempts: number;

  @IsNumber()
  points: number;

  games: number;

  @IsNumber()
  games_won: number;

  @IsString()
  @MaxLength(5)
  @MinLength(5)
  @IsNotEmpty()
  word_user: string;
}
