import { pgTable, text, timestamp, integer, serial } from 'drizzle-orm/pg-core';

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  venue: text('venue').notNull(),
  city: text('city').notNull(),
  address: text('address').notNull(),
  date: text('date').notNull(),
  time: text('time').notNull(),
  mapsUrl: text('maps_url').notNull(),
  stripeProductId: text('stripe_product_id').notNull().default(''), 
  imageUrls: text('image_urls').array().notNull().default([]), 
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const ticketTiers = pgTable('ticket_tiers', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  price: integer('price').notNull(), 
  capacity: integer('capacity').notNull(),
  ticketsSold: integer('tickets_sold').notNull().default(0),
  stripePriceId: text('stripe_price_id').notNull(),
});
