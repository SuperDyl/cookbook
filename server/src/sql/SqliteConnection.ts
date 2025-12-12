import { DatabaseSync } from 'node:sqlite';

export default class SqliteConnection {
    private _db: DatabaseSync;

    constructor(path: string) {
        this._db = new DatabaseSync(path);
    }

    public transaction(transactionCallback: () => 'commit' | 'rollback'): 'commit' | 'rollback' {
        const savepointName = `save_${crypto.randomUUID().replaceAll(/-/g,'_')};`;
        this.exec(`savepoint ${savepointName};`);
        try {
            const result = transactionCallback();
            if (result === 'commit') {
                this.exec(`release savepoint ${savepointName};`);
            } else {
                this.exec(`rollback to savepoint ${savepointName};`);
            }
            return result;
        } catch (e: unknown) {
            console.error('Received error during transaction, rolling back', e);
            this.exec(`rollback to savepoint ${savepointName};`);
            throw e;
        }
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

    public exec(sql: string): void {
        this._db.exec(sql);
    }

    public bulk(strings: TemplateStringsArray, ...parameterLists: any[][])
        : { changes: number, lastInsertRowid: number }[] {
        const results: { changes: number, lastInsertRowid: number }[] = [];

        this.transaction(() => {
            const statement = this._db.prepare(strings.join('?'));
            for (let i = 0; i < parameterLists[0].length; i++) {
                const parameters = parameterLists.map(list => list[i]);
                results.push(statement.run(...parameters) as { changes: number, lastInsertRowid: number });
            }

            return 'commit';
        });

        return results;
    }
}
