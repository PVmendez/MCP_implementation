import { Injectable, NotFoundException } from '@nestjs/common';
import { MCPTool } from './interfaces/mcp-tool.interface';
import { TodoItemsService } from '../todo_lists/todo-items.service';
import { TodoListsService } from '../todo_lists/todo_lists.service';
import { AIService } from './ai.service';

@Injectable()
export class MCPService {
  private tools: MCPTool[] = [];

  constructor(
    private readonly todoItemsService: TodoItemsService,
    private readonly todoListsService: TodoListsService,
    private readonly aiService: AIService,
  ) {
    this.initializeTools();
  }

  private initializeTools() {
    this.tools = [
      {
        name: 'create_todo_item',
        description: 'Crear un nuevo item en una lista específica',
        parameters: [
          {
            name: 'list_name',
            type: 'string',
            description: 'Nombre de la lista donde se creará el item',
            required: true,
          },
          {
            name: 'description',
            type: 'string',
            description: 'Descripción del item a crear',
            required: true,
          },
        ],
        execute: async (params) => {
          const list = await this.todoListsService.findByName(params.list_name);
          const todoItem = await this.todoItemsService.create(
            list.id.toString(),
            { description: params.description },
          );
          return {
            message: `Item "${params.description}" creado en la lista "${params.list_name}"`,
            item: todoItem,
          };
        },
      },
      {
        name: 'complete_todo_item',
        description: 'Marcar un item como completado',
        parameters: [
          {
            name: 'item_id',
            type: 'string',
            description: 'ID del item a completar',
            required: true,
          },
        ],
        execute: async (params) => {
          const todoItem = await this.todoItemsService.update(params.item_id, {
            completed: true,
          });
          return {
            message: `Item "${todoItem.description}" marcado como completado`,
            item: todoItem,
          };
        },
      },
      {
        name: 'update_todo_item',
        description: 'Actualizar la descripción de un item',
        parameters: [
          {
            name: 'item_id',
            type: 'string',
            description: 'ID del item a actualizar',
            required: true,
          },
          {
            name: 'description',
            type: 'string',
            description: 'Nueva descripción del item',
            required: true,
          },
        ],
        execute: async (params) => {
          const todoItem = await this.todoItemsService.update(params.item_id, {
            description: params.description,
          });
          return {
            message: `Item actualizado a "${params.description}"`,
            item: todoItem,
          };
        },
      },
      {
        name: 'delete_todo_item',
        description: 'Eliminar un item de una lista',
        parameters: [
          {
            name: 'item_id',
            type: 'string',
            description: 'ID del item a eliminar',
            required: true,
          },
        ],
        execute: async (params) => {
          await this.todoItemsService.remove(params.item_id);
          return { message: `Item "${params.item_id}" eliminado` };
        },
      },
    ];
  }

  getTools(): Omit<MCPTool, 'execute'>[] {
    return this.tools.map(({ execute, ...tool }) => tool);
  }

  async processNaturalLanguage(prompt: string): Promise<any> {
    try {
      const interpretation = await this.aiService.interpretPrompt(prompt);
      return this.executeTool(interpretation.action, interpretation.parameters);
    } catch (error) {
      throw new Error(
        'No pude entender el comando. Por favor, intenta con una frase diferente.',
      );
    }
  }

  async executeTool(
    toolName: string,
    params: Record<string, any>,
  ): Promise<any> {
    const tool = this.tools.find((t) => t.name === toolName);
    if (!tool) {
      throw new Error(`Herramienta "${toolName}" no encontrada`);
    }

    const missingParams = tool.parameters
      .filter((p) => p.required && !params[p.name])
      .map((p) => p.name);

    if (missingParams.length > 0) {
      throw new Error(
        `Faltan los siguientes parámetros requeridos: ${missingParams.join(
          ', ',
        )}`,
      );
    }

    return tool.execute(params);
  }
}
