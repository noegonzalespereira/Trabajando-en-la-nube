import { ApiProperty } from '@nestjs/swagger';

export class CreateItemDto {
  @ApiProperty({ example: 'Laptop Pro', description: 'Nombre del producto' })
  name!: string;

  @ApiProperty({ example: 'Core i7, 16GB RAM', required: false })
  description?: string;

  @ApiProperty({ example: 10, description: 'Cantidad en inventario' })
  quantity!: number;
}