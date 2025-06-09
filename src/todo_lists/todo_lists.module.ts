import { Module } from '@nestjs/common';
import { TodoListsController } from './todo_lists.controller';
import { TodoListsService } from './todo_lists.service';
import { TodoItemsController } from './todo-items.controller';
import { TodoItemsService } from './todo-items.service';

@Module({
  imports: [],
  controllers: [TodoListsController, TodoItemsController],
  providers: [
    {
      provide: TodoListsService,
      useFactory: () => {
        return new TodoListsService([
          { id: 1, name: 'Personal' },
          { id: 2, name: 'Trabajo' },
          { id: 3, name: 'Compras' }
        ]);
      }
    },
    TodoItemsService
  ],
  exports: [TodoListsService, TodoItemsService]
})
export class TodoListsModule {}
