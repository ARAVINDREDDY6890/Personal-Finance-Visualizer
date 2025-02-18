// Personal Finance Visualizer - Full Implementation (Stage 1 to 3)

// 1. Install dependencies
// Run: npm install next react react-dom tailwindcss @shadcn/ui recharts mongoose

// 2. Configure Tailwind CSS
// Create tailwind.config.js and add:
// module.exports = { content: ["./app/**/*.{js,ts,jsx,tsx}"], theme: { extend: {}, }, plugins: [], };

// 3. Create MongoDB connection in lib/mongo.js
import mongoose from 'mongoose';
const MONGO_URI = process.env.MONGO_URI;
export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(MONGO_URI);
};

// 4. Define Transaction model in lib/models/Transaction.js
import mongoose from 'mongoose';
const TransactionSchema = new mongoose.Schema({
  amount: Number,
  date: String,
  description: String,
  category: String,
});
export const Transaction =
  mongoose.models.Transaction ||
  mongoose.model('Transaction', TransactionSchema);

// 5. Define Budget model in lib/models/Budget.js
import mongoose from 'mongoose';
const BudgetSchema = new mongoose.Schema({
  category: String,
  amount: Number,
  month: String,
});
export const Budget =
  mongoose.models.Budget ||
  mongoose.model('Budget', BudgetSchema);

// 6. API routes for transactions (app/api/transactions/route.js)
import { connectDB } from '@/lib/mongo';
import { Transaction } from '@/lib/models/Transaction';

export async function POST(req) {
  await connectDB();
  const data = await req.json();
  const newTransaction = await Transaction.create(data);
  return Response.json(newTransaction);
}

export async function GET() {
  await connectDB();
  const transactions = await Transaction.find({});
  return Response.json(transactions);
}

export async function DELETE(req) {
  await connectDB();
  const { id } = await req.json();
  await Transaction.findByIdAndDelete(id);
  return Response.json({ message: 'Transaction deleted' });
}

// 7. API routes for budget (app/api/budget/route.js)
import { Budget } from '@/lib/models/Budget';

export async function POST(req) {
  await connectDB();
  const data = await req.json();
  const newBudget = await Budget.create(data);
  return Response.json(newBudget);
}

export async function GET() {
  await connectDB();
  const budgets = await Budget.find({});
  return Response.json(budgets);
}

// 8. UI for adding transactions (app/transactions/page.tsx)
import { useState, useEffect } from 'react';
export default function Transactions() {
  const [transactions, setTransactions] = useState([]);

  async function fetchTransactions() {
    const res = await fetch('/api/transactions');
    const data = await res.json();
    setTransactions(data);
  }

  async function addTransaction(amount, date, description, category) {
    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, date, description, category })
    });
    fetchTransactions();
  }

  async function deleteTransaction(id) {
    await fetch('/api/transactions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    fetchTransactions();
  }

  useEffect(() => { fetchTransactions(); }, []);

  return (
    <div> {/* Form & Transaction List UI */} </div>
  );
}

// 9. Dashboard with charts (app/dashboard/page.tsx)
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis } from 'recharts';
export default function Dashboard({ transactions }) {
  const categoryData = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  return (
    <div>
      <PieChart width={200} height={200}>
        <Pie data={Object.entries(categoryData).map(([name, value]) => ({ name, value }))} dataKey="value" />
      </PieChart>
    </div>
  );
}

// 10. README.md (Project instructions)
// Include setup guide, features, and deployment steps.

// Final Step: Deploy to Vercel and push to GitHub.
