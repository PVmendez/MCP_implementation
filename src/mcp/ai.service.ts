import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AIService {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    async interpretPrompt(prompt: string): Promise<{ action: string; parameters: Record<string, any> }> {
        const systemPrompt = `Eres un asistente que ayuda a interpretar comandos para una aplicación de lista de tareas.
Las acciones disponibles son:
1. create_todo_item (parámetros: list_name, description)
2. complete_todo_item (parámetros: item_id)
3. update_todo_item (parámetros: item_id, description)
4. delete_todo_item (parámetros: item_id)

Analiza el comando del usuario y devuelve un JSON con la acción y los parámetros correspondientes.
Por ejemplo:
Usuario: "Agregar comprar leche a la lista del supermercado"
Respuesta: {"action": "create_todo_item", "parameters": {"list_name": "supermercado", "description": "comprar leche"}}`;

        const userMessage = `Interpreta este comando: ${prompt}`;

        try {
            const completion = await this.openai.chat.completions.create({
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userMessage }
                ],
                model: 'gpt-3.5-turbo',
                response_format: { type: 'json_object' }
            });

            const response = JSON.parse(completion.choices[0].message.content);
            return response;
        } catch (error) {
            console.error('Error al interpretar el prompt:', error);
            throw new Error('No pude entender el comando. Por favor, intenta con una frase diferente.');
        }
    }
} 