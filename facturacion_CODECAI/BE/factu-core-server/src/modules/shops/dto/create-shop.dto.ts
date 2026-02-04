import { IsNotEmpty, IsEmail, IsString, MinLength, MaxLength, Matches, IsOptional, IsArray, IsInt } from 'class-validator';

export class CreateShopDto {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  name: string;

  @IsNotEmpty({ message: 'La dirección es requerida' })
  @IsString()
  @MinLength(5, { message: 'La dirección debe tener al menos 5 caracteres' })
  address: string;

  @IsNotEmpty({ message: 'El teléfono es requerido' })
  @Matches(/^[0-9]{9,15}$/, { message: 'El teléfono debe contener entre 9 y 15 dígitos' })
  phoneNumber: string;

  @IsNotEmpty({ message: 'El país es requerido' })
  @IsString()
  country: string;

  @IsNotEmpty({ message: 'La ciudad es requerida' })
  @IsString()
  city: string;

  @IsNotEmpty({ message: 'El RUC es requerido' })
  @Matches(/^[0-9]{13}$/, { message: 'El RUC debe tener exactamente 13 dígitos' })
  ruc: string;

  @IsNotEmpty({ message: 'El email es requerido' })
  @IsEmail({}, { message: 'El email no es válido' })
  email: string;

  @IsOptional()
  @IsArray({ message: 'userIds debe ser un arreglo' })
  @IsInt({ each: true, message: 'Cada ID de usuario debe ser un número entero' })
  userIds?: number[]; // IDs de usuarios a asociar con la tienda
}
