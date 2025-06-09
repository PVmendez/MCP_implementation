export interface MCPTool {
    name: string;
    description: string;
    parameters: {
        name: string;
        type: string;
        description: string;
        required: boolean;
    }[];
    execute: (params: Record<string, any>) => Promise<any>;
} 