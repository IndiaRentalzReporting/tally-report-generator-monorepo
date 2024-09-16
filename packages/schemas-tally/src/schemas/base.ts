import { integer } from "drizzle-orm/pg-core";
import { date } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";
import { varchar } from "drizzle-orm/pg-core";
import { text, uuid } from "drizzle-orm/pg-core";

export const BaseSchema = {
    id : uuid("id").primaryKey().defaultRandom(),
    name : text("name").notNull()
}

export const TallyCommonSchema = ()=>{
    return {
        id : uuid("id").primaryKey().defaultRandom(),
        guid : varchar('guid', { length: 200 }).notNull(),
        companyId : varchar("companyId"),
        masterID: integer('masterID').notNull().unique(),
        alterID: integer('alterID').notNull(),
        sortOrder : integer("sortOrder").notNull(),
        lastSyncDate: date('lastSyncDate').notNull()
    }
}

export const TempTableCommonSchema = () => {
    return {
        id : uuid("id").primaryKey().defaultRandom(),
        guid : varchar('guid', { length: 200 }),
        companyId : varchar("companyId"),
        masterID: integer('masterID'),
        alterID: integer('alterID'),
        sortOrder : integer("sortOrder"),
        lastSyncDate : date("lastSyncDate")
    };
}