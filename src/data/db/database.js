import * as SQLite from 'expo-sqlite';

let db = null;

export const getDatabase = async () => {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('marketshop.db');
  await initDatabase(db);
  return db;
};

const initDatabase = async (database) => {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT NOT NULL,
      category TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT NOT NULL,
      date TEXT NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      items TEXT NOT NULL,
      total REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY DEFAULT 1,
      name TEXT NOT NULL DEFAULT 'Utilisateur',
      email TEXT NOT NULL DEFAULT 'utilisateur@email.com',
      phone TEXT NOT NULL DEFAULT '',
      dark_mode INTEGER NOT NULL DEFAULT 0
    );
  `);

  const profile = await database.getFirstAsync('SELECT * FROM profile WHERE id = 1');
  if (!profile) {
    await database.runAsync(
      "INSERT INTO profile (id, name, email, phone, dark_mode) VALUES (1, 'Utilisateur', 'utilisateur@email.com', '', 0)"
    );
  }
};

// ========== CART ==========
export const getCartItems = async () => {
  const database = await getDatabase();
  return database.getAllAsync('SELECT * FROM cart_items');
};

export const insertCartItem = async (item) => {
  const database = await getDatabase();
  const existing = await database.getFirstAsync(
    'SELECT * FROM cart_items WHERE product_id = ?',
    [item.product_id]
  );
  if (existing) {
    await database.runAsync(
      'UPDATE cart_items SET quantity = ? WHERE product_id = ?',
      [existing.quantity + item.quantity, item.product_id]
    );
  } else {
    await database.runAsync(
      'INSERT INTO cart_items (product_id, title, price, image, category, quantity) VALUES (?, ?, ?, ?, ?, ?)',
      [item.product_id, item.title, item.price, item.image, item.category, item.quantity]
    );
  }
};

export const updateCartQuantity = async (id, quantity) => {
  const database = await getDatabase();
  if (quantity <= 0) {
    await database.runAsync('DELETE FROM cart_items WHERE id = ?', [id]);
  } else {
    await database.runAsync('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, id]);
  }
};

export const deleteCartItem = async (id) => {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM cart_items WHERE id = ?', [id]);
};

export const clearCart = async () => {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM cart_items');
};

// ========== ORDERS ==========
export const getOrders = async () => {
  const database = await getDatabase();
  const rows = await database.getAllAsync('SELECT * FROM orders ORDER BY date DESC');
  return rows.map((row) => ({
    ...row,
    items: JSON.parse(row.items),
  }));
};

export const insertOrder = async (order) => {
  const database = await getDatabase();
  await database.runAsync(
    'INSERT INTO orders (order_number, date, full_name, phone, address, city, items, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [
      order.order_number,
      order.date,
      order.full_name,
      order.phone,
      order.address,
      order.city,
      JSON.stringify(order.items),
      order.total,
    ]
  );
};

export const clearOrders = async () => {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM orders');
};

// ========== PROFILE ==========
export const getProfile = async () => {
  const database = await getDatabase();
  return database.getFirstAsync('SELECT * FROM profile WHERE id = 1');
};

export const updateProfile = async (profile) => {
  const database = await getDatabase();
  await database.runAsync(
    'UPDATE profile SET name = ?, email = ?, phone = ?, dark_mode = ? WHERE id = 1',
    [profile.name, profile.email, profile.phone, profile.dark_mode ? 1 : 0]
  );
};

export const clearAllData = async () => {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM cart_items');
  await database.runAsync('DELETE FROM orders');
  await database.runAsync(
    "UPDATE profile SET name = 'Utilisateur', email = 'utilisateur@email.com', phone = '' WHERE id = 1"
  );
};
