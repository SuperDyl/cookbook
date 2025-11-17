import { DatabaseSync } from 'node:sqlite';

export default class Connection {
    private _db: DatabaseSync;

    constructor(path: string) {
        this._db = new DatabaseSync(path);
    }

    public all<T>(strings: TemplateStringsArray, ...parameters: any[]): T[] {
        const statement = this._db.prepare(strings.join('?'));
        return statement.all(...parameters) as T[];
    }

    public get<T>(strings: TemplateStringsArray, ...parameters: any[]): T | undefined {
        const statement = this._db.prepare(strings.join('?'));
        return statement.get(...parameters) as T | undefined;
    }

    public run(strings: TemplateStringsArray, ...parameters: any[]): { changes: number, lastInsertRowid: number } {
        const statement = this._db.prepare(strings.join('?'));
        return statement.run(...parameters) as { changes: number, lastInsertRowid: number };
    }
}
