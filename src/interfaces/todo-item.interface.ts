export interface TodoItem {
    id: string;
    description: string;
    completed: boolean;
    listId: string;
    createdAt: Date;
    updatedAt: Date;
} 