import { hashPassword } from "better-auth/crypto";
import { db } from "@/db";
import { shoe, stockMovement } from "@/db/schema";
import { user, account } from "@/db/schema/auth";

// ── Seed users ────────────────────────────────────────────────────────────────

const SEED_USERS = [
  { id: crypto.randomUUID(), name: "Alice Admin", email: "alice@demo.com", password: "password123" },
  { id: crypto.randomUUID(), name: "Bob Store",   email: "bob@demo.com",   password: "password123" },
];

// ── Shoe templates ────────────────────────────────────────────────────────────

const SHOE_TEMPLATES = [
  { name: "Air Max 90",       brand: "Nike",    category: "Sneakers",  size: "42", color: "White/Red",  condition: "New",  sku: "NK-AM90-42",  costPrice: 85,  sellPrice: 130, quantity: 24, minStockAlert: 5  },
  { name: "Ultra Boost 22",   brand: "Adidas",  category: "Running",   size: "41", color: "Black",      condition: "New",  sku: "AD-UB22-41",  costPrice: 110, sellPrice: 180, quantity: 18, minStockAlert: 4  },
  { name: "Classic Leather",  brand: "Reebok",  category: "Lifestyle", size: "43", color: "White",      condition: "New",  sku: "RB-CL-43",    costPrice: 50,  sellPrice: 85,  quantity: 30, minStockAlert: 8  },
  { name: "Chuck Taylor",     brand: "Converse", category: "Sneakers", size: "40", color: "Black",      condition: "New",  sku: "CV-CT-40",    costPrice: 35,  sellPrice: 65,  quantity: 3,  minStockAlert: 5  },
  { name: "Old Skool",        brand: "Vans",    category: "Skate",     size: "42", color: "Black/White",condition: "New",  sku: "VN-OS-42",    costPrice: 40,  sellPrice: 75,  quantity: 0,  minStockAlert: 5  },
  { name: "574 Core",         brand: "New Balance", category: "Running", size: "44", color: "Grey",     condition: "New",  sku: "NB-574-44",   costPrice: 70,  sellPrice: 115, quantity: 12, minStockAlert: 4  },
  { name: "Gel-Kayano 30",    brand: "ASICS",   category: "Running",   size: "41", color: "Blue",       condition: "New",  sku: "AS-GK30-41",  costPrice: 100, sellPrice: 160, quantity: 7,  minStockAlert: 5  },
  { name: "Superstar",        brand: "Adidas",  category: "Lifestyle", size: "43", color: "White",      condition: "New",  sku: "AD-SS-43",    costPrice: 55,  sellPrice: 95,  quantity: 4,  minStockAlert: 6  },
  { name: "Air Force 1",      brand: "Nike",    category: "Lifestyle", size: "40", color: "White",      condition: "New",  sku: "NK-AF1-40",   costPrice: 75,  sellPrice: 120, quantity: 20, minStockAlert: 5  },
  { name: "Gel-Nimbus 25",    brand: "ASICS",   category: "Running",   size: "42", color: "Green",      condition: "New",  sku: "AS-GN25-42",  costPrice: 120, sellPrice: 190, quantity: 2,  minStockAlert: 4  },
  { name: "Pegasus 40",       brand: "Nike",    category: "Running",   size: "44", color: "Orange",     condition: "New",  sku: "NK-PG40-44",  costPrice: 90,  sellPrice: 140, quantity: 15, minStockAlert: 5  },
  { name: "Stan Smith",       brand: "Adidas",  category: "Lifestyle", size: "41", color: "White/Green",condition: "New",  sku: "AD-SM-41",    costPrice: 60,  sellPrice: 100, quantity: 9,  minStockAlert: 4  },
  { name: "Slip-On Pro",      brand: "Vans",    category: "Skate",     size: "43", color: "Navy",       condition: "Used", sku: "VN-SP-43",    costPrice: 25,  sellPrice: 55,  quantity: 6,  minStockAlert: 3  },
  { name: "Freestyle Hi",     brand: "Reebok",  category: "Lifestyle", size: "40", color: "Red",        condition: "New",  sku: "RB-FH-40",    costPrice: 45,  sellPrice: 80,  quantity: 11, minStockAlert: 5  },
  { name: "990v6",            brand: "New Balance", category: "Running", size: "42", color: "Grey",     condition: "New",  sku: "NB-990-42",   costPrice: 150, sellPrice: 235, quantity: 5,  minStockAlert: 3  },
];

// ── Movement log helpers ──────────────────────────────────────────────────────

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

async function seedMovements(userId: string, shoeId: string, qty: number) {
  const movements: (typeof stockMovement.$inferInsert)[] = [];

  // Initial stock-in
  movements.push({
    id: crypto.randomUUID(),
    shoeId,
    userId,
    type: "in",
    quantity: qty + 10,
    reason: "Initial stock",
    createdAt: daysAgo(28),
  });

  // A few sales (out) scattered over last 4 weeks
  for (let i = 0; i < 3; i++) {
    const sold = Math.floor(Math.random() * 4) + 1;
    movements.push({
      id: crypto.randomUUID(),
      shoeId,
      userId,
      type: "out",
      quantity: sold,
      reason: "Sale",
      createdAt: daysAgo(Math.floor(Math.random() * 25) + 1),
    });
  }

  // Occasional restock
  if (Math.random() > 0.5) {
    movements.push({
      id: crypto.randomUUID(),
      shoeId,
      userId,
      type: "in",
      quantity: 5,
      reason: "Restock",
      createdAt: daysAgo(Math.floor(Math.random() * 10) + 1),
    });
  }

  if (movements.length > 0) await db.insert(stockMovement).values(movements);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function seed() {
  console.log("🌱 Seeding database...");

  // Users
  for (const u of SEED_USERS) {
    const hashed = await hashPassword(u.password);

    await db.insert(user).values({
      id: u.id,
      name: u.name,
      email: u.email,
      emailVerified: true,
    }).onConflictDoNothing();

    await db.insert(account).values({
      id: crypto.randomUUID(),
      accountId: u.email,
      providerId: "credential",
      userId: u.id,
      password: hashed,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).onConflictDoNothing();

    console.log(`  ✓ User: ${u.email} / ${u.password}`);
  }

  // Shoes + movements for the first user
  const userId = SEED_USERS[0].id;

  for (const template of SHOE_TEMPLATES) {
    const [inserted] = await db.insert(shoe).values({
      id: crypto.randomUUID(),
      ...template,
      costPrice: String(template.costPrice),
      sellPrice: String(template.sellPrice),
      userId,
    }).returning({ id: shoe.id });

    await seedMovements(userId, inserted.id, template.quantity);
  }

  console.log(`  ✓ ${SHOE_TEMPLATES.length} shoes with stock movements`);
  console.log("✅ Done!");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
