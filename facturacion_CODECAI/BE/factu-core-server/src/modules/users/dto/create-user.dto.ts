import { IsEmail, IsNotEmpty, MinLength, Matches, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
 @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @Transform(({ value }) => value?.trim())
  firstName: string;

  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @Transform(({ value }) => value?.trim())
  lastName: string;

  @IsEmail({}, { message: 'Email inválido' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'La contraseña debe contener mayúsculas, minúsculas y números o caracteres especiales',
  })
  password: string;

  @IsNotEmpty({ message: 'El tipo de documento es obligatorio' })
  documentType: string;

  @IsNotEmpty({ message: 'El número de documento es obligatorio' })
  @Matches(/^[0-9]+$/, { message: 'El número de documento debe contener solo números' })
  documentNumber: string;

  @IsNotEmpty({ message: 'El número de teléfono es obligatorio' })
  phoneNumber: string;

  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  address: string;
  
  @IsInt({ message: 'El rol debe ser un número entero' })
  @IsNotEmpty({ message: 'El rol es obligatorio' })
  roleId: number;
}
