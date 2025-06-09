import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { TodoItemsService } from './todo-items.service';
import { CreateTodoItemDto } from './dtos/create-todo-item.dto';
import { UpdateTodoItemDto } from './dtos/update-todo-item.dto';
import { TodoItem } from '../interfaces/todo-item.interface';

@Controller('todo-lists/:listId/items')
export class TodoItemsController {
  constructor(private readonly todoItemsService: TodoItemsService) {}

  @Post()
  async create(
    @Param('listId') listId: string,
    @Body() createTodoItemDto: CreateTodoItemDto,
  ): Promise<TodoItem> {
    return this.todoItemsService.create(listId, createTodoItemDto);
  }

  @Get()
  async findAll(@Param('listId') listId: string): Promise<TodoItem[]> {
    return this.todoItemsService.findByListId(listId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTodoItemDto: UpdateTodoItemDto,
  ): Promise<TodoItem> {
    return this.todoItemsService.update(id, updateTodoItemDto);
  }

  @Put(':id/complete')
  async complete(@Param('id') id: string): Promise<TodoItem> {
    return this.todoItemsService.update(id, { completed: true });
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.todoItemsService.remove(id);
  }
}
