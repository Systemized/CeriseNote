export interface List {
    _id: string;
    name: string;
    userId: string;
    createdAt: Date;
}

export interface Task {
    title: string;
    desc?: string;
    status: 'complete' | 'incomplete';
    userId: string;
    listId: string;
    createdAt: Date;
}
