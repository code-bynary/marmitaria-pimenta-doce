'use client';

import { useState, useEffect } from 'react';

interface Supplier {
    id: number;
    name: string;
}

interface Expense {
    id: number;
    description: string;
    amount: number;
    supplier: Supplier | null;
    paymentMethod: string | null;
    status: string;
    dueDate: string | null;
    paidDate: string | null;
    createdAt: string;
}

interface Customer {
    id: number;
    name: string;
    balance: number;
}

export default function FinancialPage() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'payable' | 'receivable'>('payable');
    const [showExpenseForm, setShowExpenseForm] = useState(false);
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        supplierId: '',
        paymentMethod: 'Cash',
        status: 'Pending',
        dueDate: '',
        paidDate: '',
    });

    useEffect(() => {
        fetchExpenses();
        fetchCustomers();
        fetchSuppliers();
    }, []);

    const fetchExpenses = async () => {
        try {
            const res = await fetch('/api/expenses');
            const data = await res.json();
            setExpenses(data);
        } catch (error) {
            console.error('Failed to fetch expenses', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomers = async () => {
        try {
            const res = await fetch('/api/customers');
            const data = await res.json();
            setCustomers(data);
        } catch (error) {
            console.error('Failed to fetch customers', error);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const res = await fetch('/api/suppliers');
            const data = await res.json();
            setSuppliers(data);
        } catch (error) {
            console.error('Failed to fetch suppliers', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setFormData({
                    description: '',
                    amount: '',
                    supplierId: '',
                    paymentMethod: 'Cash',
                    status: 'Pending',
                    dueDate: '',
                    paidDate: '',
                });
                setShowExpenseForm(false);
                fetchExpenses();
            }
        } catch (error) {
            console.error('Failed to create expense', error);
        }
    };

    const markExpenseAsPaid = async (id: number) => {
        try {
            const res = await fetch(`/api/expenses/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: 'Paid',
                    paidDate: new Date().toISOString(),
                }),
            });

            if (res.ok) {
                fetchExpenses();
            }
        } catch (error) {
            console.error('Failed to update expense', error);
        }
    };

    const pendingExpenses = expenses.filter((e) => e.status === 'Pending');
    const paidExpenses = expenses.filter((e) => e.status === 'Paid');
    const debtors = customers.filter((c) => c.balance > 0);

    return (
        <div className="container">
            <h1 style={{ marginBottom: '2rem', fontSize: '2rem', color: 'hsl(var(--primary))' }}>
                Controle Financeiro
            </h1>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => setActiveTab('payable')}
                    className={`btn ${activeTab === 'payable' ? 'btn-primary' : 'btn-outline'}`}
                >
                    Contas a Pagar
                </button>
                <button
                    onClick={() => setActiveTab('receivable')}
                    className={`btn ${activeTab === 'receivable' ? 'btn-primary' : 'btn-outline'}`}
                >
                    Contas a Receber / Devedores
                </button>
            </div>

            {activeTab === 'payable' && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2>Contas a Pagar</h2>
                        <button onClick={() => setShowExpenseForm(!showExpenseForm)} className="btn btn-primary">
                            {showExpenseForm ? 'Cancelar' : '+ Nova Despesa'}
                        </button>
                    </div>

                    {showExpenseForm && (
                        <div className="card" style={{ marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem' }}>Nova Despesa</h3>
                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Descrição</label>
                                        <input
                                            type="text"
                                            className="input"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            required
                                            placeholder="Descrição da despesa"
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Valor</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="input"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                            required
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Fornecedor</label>
                                        <select
                                            className="input"
                                            value={formData.supplierId}
                                            onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                                        >
                                            <option value="">Sem fornecedor</option>
                                            {suppliers.map((supplier) => (
                                                <option key={supplier.id} value={supplier.id}>
                                                    {supplier.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Forma de Pagamento</label>
                                        <select
                                            className="input"
                                            value={formData.paymentMethod}
                                            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                        >
                                            <option value="Cash">Dinheiro</option>
                                            <option value="Card">Cartão</option>
                                            <option value="Pix">Pix</option>
                                            <option value="Transfer">Transferência</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Status</label>
                                        <select
                                            className="input"
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        >
                                            <option value="Pending">Pendente</option>
                                            <option value="Paid">Pago</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Data de Vencimento</label>
                                        <input
                                            type="date"
                                            className="input"
                                            value={formData.dueDate}
                                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                        />
                                    </div>
                                    {formData.status === 'Paid' && (
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Data de Pagamento</label>
                                            <input
                                                type="date"
                                                className="input"
                                                value={formData.paidDate}
                                                onChange={(e) => setFormData({ ...formData, paidDate: e.target.value })}
                                            />
                                        </div>
                                    )}
                                </div>

                                <button type="submit" className="btn btn-primary">
                                    Salvar Despesa
                                </button>
                            </form>
                        </div>
                    )}

                    <div className="card" style={{ marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem', color: 'hsl(var(--error))' }}>
                            Pendentes (R$ {pendingExpenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)})
                        </h3>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Descrição</th>
                                        <th>Fornecedor</th>
                                        <th>Valor</th>
                                        <th>Vencimento</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingExpenses.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} style={{ textAlign: 'center' }}>
                                                Nenhuma despesa pendente
                                            </td>
                                        </tr>
                                    ) : (
                                        pendingExpenses.map((expense) => (
                                            <tr key={expense.id}>
                                                <td>{expense.description}</td>
                                                <td>{expense.supplier?.name || '-'}</td>
                                                <td style={{ fontWeight: '600' }}>R$ {expense.amount.toFixed(2)}</td>
                                                <td>{expense.dueDate ? new Date(expense.dueDate).toLocaleDateString('pt-BR') : '-'}</td>
                                                <td>
                                                    <button
                                                        onClick={() => markExpenseAsPaid(expense.id)}
                                                        className="btn btn-primary"
                                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                                                    >
                                                        Marcar como Pago
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="card">
                        <h3 style={{ marginBottom: '1rem', color: 'hsl(var(--success))' }}>
                            Pagas (R$ {paidExpenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)})
                        </h3>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Descrição</th>
                                        <th>Fornecedor</th>
                                        <th>Valor</th>
                                        <th>Data de Pagamento</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paidExpenses.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} style={{ textAlign: 'center' }}>
                                                Nenhuma despesa paga
                                            </td>
                                        </tr>
                                    ) : (
                                        paidExpenses.slice(0, 10).map((expense) => (
                                            <tr key={expense.id}>
                                                <td>{expense.description}</td>
                                                <td>{expense.supplier?.name || '-'}</td>
                                                <td style={{ fontWeight: '600' }}>R$ {expense.amount.toFixed(2)}</td>
                                                <td>{expense.paidDate ? new Date(expense.paidDate).toLocaleDateString('pt-BR') : '-'}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'receivable' && (
                <div className="card">
                    <h2 style={{ marginBottom: '1rem' }}>Clientes Devedores</h2>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Cliente</th>
                                    <th>Telefone</th>
                                    <th>Saldo Devedor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {debtors.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} style={{ textAlign: 'center' }}>
                                            Nenhum cliente devedor
                                        </td>
                                    </tr>
                                ) : (
                                    debtors.map((customer) => (
                                        <tr key={customer.id}>
                                            <td>{customer.name}</td>
                                            <td>{customers.find((c) => c.id === customer.id) ? 'N/A' : '-'}</td>
                                            <td style={{ fontWeight: '600', color: 'hsl(var(--error))' }}>
                                                R$ {customer.balance.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div style={{ marginTop: '1.5rem', padding: 'var(--spacing-md)', backgroundColor: 'hsl(var(--primary-light))', borderRadius: 'var(--radius-md)' }}>
                        <strong>Total a Receber:</strong>{' '}
                        <span style={{ fontSize: '1.25rem', color: 'hsl(var(--error))', fontWeight: '700' }}>
                            R$ {debtors.reduce((sum, c) => sum + c.balance, 0).toFixed(2)}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
