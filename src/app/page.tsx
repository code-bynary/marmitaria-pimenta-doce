'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Stats {
  totalProducts: number;
  totalCustomers: number;
  totalSales: number;
  pendingPayables: number;
  totalReceivables: number;
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalCustomers: 0,
    totalSales: 0,
    pendingPayables: 0,
    totalReceivables: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [products, customers, sales, expenses] = await Promise.all([
        fetch('/api/products').then((r) => r.json()),
        fetch('/api/customers').then((r) => r.json()),
        fetch('/api/sales').then((r) => r.json()),
        fetch('/api/expenses').then((r) => r.json()),
      ]);

      const totalSales = sales.reduce((sum: number, sale: any) => sum + sale.totalAmount, 0);
      const pendingPayables = expenses
        .filter((e: any) => e.status === 'Pending')
        .reduce((sum: number, e: any) => sum + e.amount, 0);
      const totalReceivables = customers
        .filter((c: any) => c.balance > 0)
        .reduce((sum: number, c: any) => sum + c.balance, 0);

      setStats({
        totalProducts: products.length,
        totalCustomers: customers.length,
        totalSales,
        pendingPayables,
        totalReceivables,
      });
    } catch (error) {
      console.error('Failed to fetch stats', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Produtos Cadastrados',
      value: stats.totalProducts,
      color: 'hsl(var(--primary))',
      link: '/products',
    },
    {
      title: 'Clientes',
      value: stats.totalCustomers,
      color: 'hsl(var(--secondary))',
      link: '/customers',
    },
    {
      title: 'Total em Vendas',
      value: `R$ ${stats.totalSales.toFixed(2)}`,
      color: 'hsl(var(--success))',
      link: '/sales',
    },
    {
      title: 'Contas a Pagar',
      value: `R$ ${stats.pendingPayables.toFixed(2)}`,
      color: 'hsl(var(--error))',
      link: '/financial',
    },
    {
      title: 'Contas a Receber',
      value: `R$ ${stats.totalReceivables.toFixed(2)}`,
      color: 'hsl(var(--warning))',
      link: '/financial',
    },
  ];

  return (
    <div className="container">
      <h1 style={{ marginBottom: '0.5rem', fontSize: '2.5rem', color: 'hsl(var(--primary))' }}>
        Bem-vindo à Pimenta Doce
      </h1>
      <p style={{ marginBottom: '3rem', color: 'hsl(var(--text-secondary))', fontSize: '1.125rem' }}>
        Sistema de Gestão de Marmitaria
      </p>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginBottom: '3rem',
            }}
          >
            {statCards.map((card, index) => (
              <Link key={index} href={card.link} style={{ textDecoration: 'none' }}>
                <div
                  className="card"
                  style={{
                    cursor: 'pointer',
                    transition: 'all var(--transition-normal)',
                    borderLeft: `4px solid ${card.color}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  <small style={{ color: 'hsl(var(--text-secondary))', display: 'block', marginBottom: '0.5rem' }}>
                    {card.title}
                  </small>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: card.color }}>{card.value}</div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <Link href="/sales" style={{ textDecoration: 'none' }}>
              <div
                className="card"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-dark)) 100%)',
                  color: 'white',
                  cursor: 'pointer',
                  textAlign: 'center',
                  padding: '2rem',
                }}
              >
                <h2 style={{ marginBottom: '0.5rem' }}>Nova Venda</h2>
                <p style={{ opacity: 0.9 }}>Registrar nova venda</p>
              </div>
            </Link>

            <Link href="/financial" style={{ textDecoration: 'none' }}>
              <div
                className="card"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--secondary)) 0%, hsl(140 60% 30%) 100%)',
                  color: 'white',
                  cursor: 'pointer',
                  textAlign: 'center',
                  padding: '2rem',
                }}
              >
                <h2 style={{ marginBottom: '0.5rem' }}>Financeiro</h2>
                <p style={{ opacity: 0.9 }}>Gerenciar contas e pagamentos</p>
              </div>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
