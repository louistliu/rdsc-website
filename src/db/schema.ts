import { pgTable, text, timestamp, integer, uuid } from 'drizzle-orm/pg-core';

export const events = pgTable('events', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  venue: text('venue').notNull(),
  city: text('city').notNull(),
  date: text('date').notNull(),
  time: text('time').notNull(),
  mapsUrl: text('maps_url').notNull(),
  imageUrls: text('image_urls').array().notNull().default([]), // For UploadThing multiple pictures
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const ticketTiers = pgTable('ticket_tiers', {
  id: uuid('id').defaultRandom().primaryKey(),
  eventId: uuid('event_id')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  price: integer('price').notNull(), // In cents (e.g., 2000 = $20.00)
  capacity: integer('capacity').notNull(),
  ticketsSold: integer('tickets_sold').notNull().default(0), // Tracks how many have been sold
  stripePriceId: text('stripe_price_id').notNull(), // Links to the Stripe Price Object
});
