import { Injectable, OnModuleDestroy } from '@nestjs/common';
import * as mysql from 'mysql2/promise';


@Injectable()
export class DatabaseService implements OnModuleDestroy {
    private pool: mysql.Pool;
    constructor() {
        this.pool = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'Siddi1507',
            database: 'saas_server_main',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });
    }

    async callProcedure<T = any>(procedureName: string, params: any[] = [],): Promise<T[]> {
        const placeholders = params.map(() => '?').join(',');
        const sql = `CALL ${procedureName}(${placeholders});`;
        const [rows] = await this.pool.query(sql, params);

        return rows[0] as T[];
    }

    async onModuleDestroy() {
    await this.pool.end();
    }
}