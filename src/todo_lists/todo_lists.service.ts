import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoListDto } from './dtos/create-todo_list';
import { UpdateTodoListDto } from './dtos/update-todo_list';
import { TodoList } from '../interfaces/todo_list.interface';

@Injectable()
export class TodoListsService {
  private readonly todolists: TodoList[];

  constructor(todoLists: TodoList[] = []) {
    this.todolists = todoLists;
  }

  all(): TodoList[] {
    return this.todolists;
  }

  get(id: number): TodoList {
    return this.todolists.find((x) => x.id === Number(id));
  }

  findByName(name: string): TodoList {
    const list = this.todolists.find((x) => x.name === name);
    if (!list) {
      throw new NotFoundException(`Lista "${name}" no encontrada`);
    }
    return list;
  }

  create(dto: CreateTodoListDto): TodoList {
    const todoList: TodoList = {
      id: this.nextId(),
      name: dto.name,
    };

    this.todolists.push(todoList);

    return todoList;
  }

  update(id: number, dto: UpdateTodoListDto): TodoList {
    const todolist = this.todolists.find((x) => x.id == Number(id));

    todolist.name = dto.name;

    return todolist;
  }

  delete(id: number): void {
    const index = this.todolists.findIndex((x) => x.id == Number(id));

    if (index > -1) {
      this.todolists.splice(index, 1);
    }
  }

  private nextId(): number {
    const last = this.todolists
      .map((x) => x.id)
      .sort()
      .reverse()[0];

    return last ? last + 1 : 1;
  }
}
