import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { SignInDto } from './dto/sign-in.dto';
import { RolesService } from 'src/modules/roles/roles.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        private rolesService: RolesService,
    ) {}

    async signIn(signInDto: SignInDto) {
        const { email, password } = signInDto;

        // Buscar usuario por email
        const user = await this.userService.findByEmail(email);
        
        if (!user) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }

        // Verificar contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }

        // Generar token JWT
        const payload = { 
            sub: user.id,
            email: user.email,
            rolId: user.roleId,
        };

        return {
            access_token: await this.jwtService.signAsync(payload),
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                roleId: user.roleId,
            },
        };
    }

    async register(registerDto: RegisterDto) {
        try {
            // Verificar si el email ya existe
            const existingUser = await this.userService.findByEmail(registerDto.email);
            
            if (existingUser) {
                throw new ConflictException('El email ya está registrado');
            }

            const defaultRole = await this.rolesService.getDefaultRole();

            const user = await this.userService.create({
                ...registerDto,
                roleId: defaultRole.id,
            });

            // Generar token automáticamente después del registro
            const payload = { 
                sub: user.id,
                email: user.email,
                roleId: user.roleId,
            };

            return {
                access_token: await this.jwtService.signAsync(payload),
                user,
            };
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            
            console.error('Error en registro:', error);
            throw new BadRequestException(error.message || 'Error al registrar el usuario');
        }
    }

    async validateUser(userId: number) {
        return this.userService.findOne(userId);
    }
}
