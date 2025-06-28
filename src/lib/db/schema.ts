import { relations } from "drizzle-orm";
import { boolean, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: boolean('emailVerified').default(false),
  password: varchar('password', { length: 255 }),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const sessionId = pgTable("sessions",{
  id: varchar("id", {length: 255}).primaryKey(),
  userId: varchar("user_id", {length: 255})
  .references(()=>usersTable.id)
  .notNull(),
  token: varchar('token', {length:255}),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: varchar('ip_address',{length:255}),
  userAgent: text('user_agent'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const posts = pgTable('posts',{
  id: serial('id').primaryKey(),
  title: varchar('title', {length:255}).notNull(),
  description: varchar('description', {length:255}).notNull(),
  slug: varchar('slug', {length:255}).notNull().unique(),
  content: text("content").notNull(),
  authorId: varchar('author_id',{length:255})
  .references(()=> usersTable.id)
  .notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),

})

export const sessionsRelation = relations(sessionId, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionId.userId],
    references: [usersTable.id],
  }),
}));


export const usersRelation = relations(usersTable, ({ many }) => ({
  posts: many(posts),
}));
export const postsRelation = relations(posts, ({one}) => ({
  author : one(usersTable,{
    fields: [posts.authorId],
    references: [usersTable.id]
  }),
}))


export const schema = {
  usersTable,
  sessionId,
  posts
}