import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class SignInDto{
    @IsEmail({}, {message: 'Email invalido'})
    @IsNotEmpty({message: 'El email es obligatorio'})
    @Transform(({ value }) => value?.toLowerCase().trim())
    email: string;

    @IsNotEmpty({message: 'La contraseña es obligatoria'})
    @IsString()
    @MinLength(8, {message: 'La contraseña debe tener al menos 8 caracteres'})
    password: string;
}