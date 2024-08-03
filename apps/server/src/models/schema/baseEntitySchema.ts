import { boolean } from "drizzle-orm/pg-core";
import { pgEnum, integer, serial, varchar, timestamp } from "drizzle-orm/pg-core";

export const EntityStatus = pgEnum("status", ["deleted", "approved", "active", "inactive"]);

export const EntityTimestamps = {
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()),
    deletedAt: timestamp("deletedAt"),
    approvedAt: timestamp("approvedAt")
};

export const BaseEntitySchema = {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 200 }).notNull(),
    status: EntityStatus("status"),
    ...EntityTimestamps
}

export const DefaultEntitySchema = {
    ...BaseEntitySchema,
    isHidden: boolean("isHidden").default(false)
}