import { Controller, Get, Post, Body } from '@nestjs/common';
import { MCPService } from './mcp.service';

@Controller('mcp')
export class MCPController {
    constructor(private readonly mcpService: MCPService) {}

    @Get('tools')
    getTools() {
        return this.mcpService.getTools();
    }

    @Post('execute')
    async executeTool(
        @Body() body: { tool: string; parameters: Record<string, any> }
    ) {
        return this.mcpService.executeTool(body.tool, body.parameters);
    }

    @Post('prompt')
    async processPrompt(
        @Body() body: { prompt: string }
    ) {
        return this.mcpService.processNaturalLanguage(body.prompt);
    }
} 