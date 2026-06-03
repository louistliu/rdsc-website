import "server-only";
import { stripe } from "./stripe";
import { notFound } from "next/navigation";

export async function getEvents() {
  const products = await stripe.products.list({
    active: true,
    limit: 10,
    expand: ["data.default_price"],
  });

  return products.data;
}

export async function getEventById(id: string) {
  try {
    const product = await stripe.products.retrieve(id);

    const prices = await stripe.prices.list({
      product: id,
      active: true,
    });

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      imageUrl: product.images[0] || null,

      ticketOptions: prices.data.map((price) => ({
        priceId: price.id,
        priceDisplay: price.unit_amount
          ? `€${(price.unit_amount / 100).toFixed(2)}`
          : "Free",
      })),
    };
  } catch (error) {
    console.error("Error fetching event:", error);
    notFound();
  }
}
