import postgres from 'postgres';
import { drizzle , PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { BadRequestError } from '@trg_package/errors';

export class ConnectionManager {
  private static instance: ConnectionManager;

  private connectionPools: Map<string, {
    client: PostgresJsDatabase<any>;
    connection: postgres.Sql;
    lastAccessed: number;
  }> = new Map();

  private constructor() {
    setInterval(() => this.cleanupIdleConnections(), 1000 * 60 * 5);
  }

  public static getInstance(): ConnectionManager {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager();
    }
    return ConnectionManager.instance;
  }

  public getOrCreateConnection<T extends Record<string, unknown>>(
    id: string,
    URL: string,
    schema: T,
    options: {
      DB_MIGRATING: boolean;
      DB_SEEDING: boolean;
    }
  ): { client: PostgresJsDatabase<T>; connection: postgres.Sql } {
    const existingPool = this.connectionPools.get(id);

    if (existingPool) {
      existingPool.lastAccessed = Date.now();
      return {
        client: existingPool.client,
        connection: existingPool.connection
      };
    }

    try {
      const connection = postgres(URL, {
        max: options.DB_MIGRATING || options.DB_SEEDING ? 1 : 10,
        idle_timeout: 1000 * 60 * 15, // Close idle connections after 5 minutes
        connect_timeout: 1000 * 60, // 30-second timeout for new connections
      });

      const client = drizzle(connection, {
        schema,
        logger: true
      });

      this.connectionPools.set(id, {
        client,
        connection,
        lastAccessed: Date.now()
      });
      console.log(`Created connection for ${id}`);

      return { client, connection };
    } catch (e) {
      throw new BadRequestError(
        `Could not create Database client with URL - ${URL}: ${e}`
      );
    }
  }

  private async cleanupIdleConnections() {
    const now = Date.now();
    const idleTimeout = 1000 * 60 * 30;

    for (const [id, pool] of this.connectionPools.entries()) {
      if (now - pool.lastAccessed > idleTimeout) {
        try {
          await pool.connection.end();
          this.connectionPools.delete(id);
          console.log(`Closed connection for ${id}`);
        } catch (error) {
          console.error(`Error closing connection for tenant ${id}:`, error);
        }
      }
    }
  }

  public async closeConnection(id: string): Promise<void> {
    const pool = this.connectionPools.get(id);
    if (pool) {
      try {
        await pool.connection.end();
        this.connectionPools.delete(id);
        console.log(`Closed connection for ${id}`);
      } catch (error) {
        console.error(`Error closing connection for tenant ${id}:`, error);
      }
    }
  }

  public async closeAllConnections(): Promise<void> {
    for (const [id] of this.connectionPools.entries()) {
      await this.closeConnection(id);
    }
  }
}
