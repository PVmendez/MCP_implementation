import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TodoListsModule } from './todo_lists/todo_lists.module';
import { MCPModule } from './mcp/mcp.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TodoListsModule,
    MCPModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
