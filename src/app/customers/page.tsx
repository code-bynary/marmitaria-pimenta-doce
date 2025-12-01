'use client';

import { useState, useEffect } from 'react';

interface Customer {
    id: number;
    name: string;
    phone: string | null;
    address: string | null;
    balance: number;
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
    });

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await fetch('/api/customers');
            const data = await res.json();
            setCustomers(data);
        } catch (error) {
            console.error('Failed to fetch customers', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/customers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setFormData({ name: '', phone: '', address: '' });
                fetchCustomers();
            }
        } catch (error) {
            console.error('Failed to create customer', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir este cliente?')) return;

        try {
            const res = await fetch(`/api/customers/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                fetchCustomers();
            }
        } catch (error) {
            console.error('Failed to delete customer', error);
        }
    };

    return (
        <div className="container">
            <h1 style={{ marginBottom: '2rem', fontSize: '2rem', color: 'hsl(var(--primary))' }}>
                Cadastro de Clientes
            </h1>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>Novo Cliente</h2>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr auto', gap: '1rem', alignItems: 'end' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nome</label>
                        <input
                            type="text"
                            className="input"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            placeholder="Nome do cliente"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Telefone</label>
                        <input
                            type="text"
                            className="input"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="(99) 99999-9999"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Endereço</label>
                        <input
                            type="text"
                            className="input"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Rua, número, bairro"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Adicionar
                    </button>
                </form>
            </div>

            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Telefone</th>
                                <th>Endereço</th>
                                <th>Saldo</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center' }}>Carregando...</td>
                                </tr>
                            ) : customers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center' }}>Nenhum cliente cadastrado.</td>
                                </tr>
                            ) : (
                                customers.map((customer) => (
                                    <tr key={customer.id}>
                                        <td>{customer.name}</td>
                                        <td>{customer.phone || '-'}</td>
                                        <td>{customer.address || '-'}</td>
                                        <td style={{
                                            color: customer.balance > 0 ? 'hsl(var(--error))' : 'hsl(var(--success))',
                                            fontWeight: '600'
                                        }}>
                                            R$ {customer.balance.toFixed(2)}
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleDelete(customer.id)}
                                                className="btn btn-outline"
                                                style={{ color: 'hsl(var(--error))', borderColor: 'hsl(var(--error))', padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
