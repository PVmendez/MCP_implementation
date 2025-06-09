import { Module } from '@nestjs/common';
import { MCPController } from './mcp.controller';
import { MCPService } from './mcp.service';
import { AIService } from './ai.service';
import { TodoListsModule } from '../todo_lists/todo_lists.module';

@Module({
    imports: [TodoListsModule],
    controllers: [MCPController],
    providers: [MCPService, AIService],
})
export class MCPModule {} 