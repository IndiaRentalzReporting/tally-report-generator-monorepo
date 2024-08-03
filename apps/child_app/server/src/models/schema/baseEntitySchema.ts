import { pgEnum, integer, boolean, uuid, serial, varchar, timestamp } from "drizzle-orm/pg-core";

export const EntityStatus = pgEnum("status", ["deleted", "approved", "active", "inactive"]);

export const EntityTimestamps = {
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()),
    deletedAt: timestamp("deletedAt"),
    approvedAt: timestamp("approvedAt")
};

export const BaseEntitySchema = {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 200 }).notNull(),
    status: EntityStatus("status"),
    isReadonly: boolean("isReadonly").notNull().default(false),
    ...EntityTimestamps
}

