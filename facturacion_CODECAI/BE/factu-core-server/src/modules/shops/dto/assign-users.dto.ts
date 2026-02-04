import { IsArray, IsInt, ArrayMinSize } from 'class-validator';

export class AssignUsersDto {
  @IsArray({ message: 'userIds debe ser un arreglo' })
  @ArrayMinSize(1, { message: 'Debe proporcionar al menos un usuario' })
  @IsInt({ each: true, message: 'Cada ID de usuario debe ser un número entero' })
  userIds: number[];
}
