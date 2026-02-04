import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto{
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @IsString()
    @Transform(({ value }) => value?.trim())
    firstName: string;

    @IsNotEmpty({ message: 'El apellido es obligatorio' })
    @IsString()
    @Transform(({ value }) => value?.trim())
    lastName: string;

    @IsEmail({}, { message: 'Email inválido' })
    @IsNotEmpty({ message: 'El email es obligatorio' })
    @Transform(({ value }) => value?.toLowerCase().trim())
    email: string;

    @IsString()
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La contraseña debe contener mayúsculas, minúsculas y números o caracteres especiales',
    })
    password: string;

    @IsNotEmpty({ message: 'El tipo de documento es obligatorio' })
    @IsString()
    documentType: string;

    @IsNotEmpty({ message: 'El número de documento es obligatorio' })
    @Matches(/^[0-9]+$/, { message: 'El número de documento debe contener solo números' })
    documentNumber: string;

    @IsNotEmpty({ message: 'La dirección es obligatoria' })
    @IsString()
    address: string;

    @IsNotEmpty({ message: 'El número de teléfono es obligatorio' })
    phoneNumber: string;

}