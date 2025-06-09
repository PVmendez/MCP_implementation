import { Injectable, NotFoundException } from '@nestjs/common';
import { TodoItem } from '../interfaces/todo-item.interface';
import { CreateTodoItemDto } from './dtos/create-todo-item.dto';
import { UpdateTodoItemDto } from './dtos/update-todo-item.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TodoItemsService {
  private todoItems: TodoItem[] = [];

  async create(
    listId: string,
    createTodoItemDto: CreateTodoItemDto,
  ): Promise<TodoItem> {
    const todoItem: TodoItem = {
      id: uuidv4(),
      listId,
      description: createTodoItemDto.description,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.todoItems.push(todoItem);
    return todoItem;
  }

  async findByListId(listId: string): Promise<TodoItem[]> {
    return this.todoItems.filter((item) => item.listId === listId);
  }

  async findOne(id: string): Promise<TodoItem> {
    const todoItem = this.todoItems.find((item) => item.id === id);
    if (!todoItem) {
      throw new NotFoundException(`Todo item with ID "${id}" not found`);
    }
    return todoItem;
  }

  async update(
    id: string,
    updateTodoItemDto: UpdateTodoItemDto,
  ): Promise<TodoItem> {
    const todoItem = await this.findOne(id);
    const index = this.todoItems.indexOf(todoItem);

    this.todoItems[index] = {
      ...todoItem,
      ...updateTodoItemDto,
      updatedAt: new Date(),
    };

    return this.todoItems[index];
  }

  async remove(id: string): Promise<void> {
    const index = this.todoItems.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`Todo item with ID "${id}" not found`);
    }
    this.todoItems.splice(index, 1);
  }
}
