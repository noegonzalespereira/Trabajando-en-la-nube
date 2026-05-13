import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemsService {
  private items: Item[] = [];
  private idCounter = 1;

  create(createItemDto: CreateItemDto) {
    const newItem: Item = {
      id: this.idCounter++,
      ...createItemDto,
    };
    this.items.push(newItem);
    return newItem;
  }

  findAll() {
    return this.items;
  }

  findOne(id: number) {
    const item = this.items.find((item) => item.id === id);
    if (!item) throw new NotFoundException(`Item con id ${id} no encontrado`);
    return item;
  }

  update(id: number, updateItemDto: UpdateItemDto) {
    const itemIndex = this.items.findIndex((item) => item.id === id);
    if (itemIndex === -1) throw new NotFoundException(`Item con id ${id} no encontrado`);
    
    this.items[itemIndex] = { ...this.items[itemIndex], ...updateItemDto };
    return this.items[itemIndex];
  }

  remove(id: number) {
    const itemIndex = this.items.findIndex((item) => item.id === id);
    if (itemIndex === -1) throw new NotFoundException(`Item  no encontrado`);
    
    this.items.splice(itemIndex, 1);
    console.log(this.items);

    return { deleted: true };
  }
}