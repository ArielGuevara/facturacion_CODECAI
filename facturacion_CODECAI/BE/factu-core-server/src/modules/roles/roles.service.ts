import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from '../../prisma.service'; 

@Injectable()
export class RolesService {

  constructor(private prisma: PrismaService) {}

  async create(data: CreateRoleDto) {

    const existingRole = await this.prisma.role.findFirst({
      where: {name: data.name},
    });

    if (existingRole){
      throw new ConflictException(`El rol ${data.name} ya existe.`);
    }

    return this.prisma.role.create({
      data,
    });
  }

  findAll() {
    return this.prisma.role.findMany({
      include:{
        _count:{
          select:{users: true}, //cuenta los usuarios por rol
        },
      },
    });
  }

  async findByName(name: string){
    const roleExisting = await this.prisma.role.findFirst({
      where: {name},
    })
    if (!roleExisting){
      throw new NotFoundException(`Rol con nombre ${name} no encontrado.`);
    }
    return roleExisting;
  }

  async findOne(id: number) {
    const role = await this.prisma.role.findUnique({
      where:{id},
    })

    if (!role){
      throw new NotFoundException(`Rol con ID ${id} no encontrado.`);
    }

    return role;
  }

  async update(id: number, data: UpdateRoleDto) {

    await this.findOne(id);

    if(data.name){
      const existingRole = await this.prisma.role.findFirst({
        where:{
          name: data.name,
          NOT: {id}, //excluir el rol actual
        }
      });

      if (existingRole) {
        throw new ConflictException('Ya existe un rol con ese nombre');
      }
    }

    return this.prisma.role.update({
      where: {id},
      data,
    });
  }

  async remove(id: number) {

    await this.findOne(id);

    const usersCount = await this.prisma.user.count({
      where: {roleId: id},
    });

    if (usersCount > 0){
      throw new ConflictException('No se puede eliminar el rol porque hay usuarios asociados a él.')
    }

    return this.prisma.role.delete({
      where: {id},
    });
  }


  async getDefaultRole(){
    const defaultRoleName = 'Usuario';
    const defaultRole = await this.prisma.role.findFirst({
      where: {name: defaultRoleName},
    });

    if(!defaultRole){
      throw new NotFoundException(`No existe un rol por defecto configurado (${defaultRoleName})`)
    }
    return defaultRole;
  }
}
