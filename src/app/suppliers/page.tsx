'use client';

import { useState, useEffect } from 'react';

interface Supplier {
    id: number;
    name: string;
    contact: string | null;
}

export default function SuppliersPage() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
    });

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const res = await fetch('/api/suppliers');
            const data = await res.json();
            setSuppliers(data);
        } catch (error) {
            console.error('Failed to fetch suppliers', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/suppliers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setFormData({ name: '', contact: '' });
                fetchSuppliers();
            }
        } catch (error) {
            console.error('Failed to create supplier', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir este fornecedor?')) return;

        try {
            const res = await fetch(`/api/suppliers/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                fetchSuppliers();
            }
        } catch (error) {
            console.error('Failed to delete supplier', error);
        }
    };

    return (
        <div className="container">
            <h1 style={{ marginBottom: '2rem', fontSize: '2rem', color: 'hsl(var(--primary))' }}>
                Cadastro de Fornecedores
            </h1>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>Novo Fornecedor</h2>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr auto', gap: '1rem', alignItems: 'end' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nome</label>
                        <input
                            type="text"
                            className="input"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            placeholder="Ex: Distribuidora ABC"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Contato</label>
                        <input
                            type="text"
                            className="input"
                            value={formData.contact}
                            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                            placeholder="Telefone ou e-mail"
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
                                <th>Contato</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={3} style={{ textAlign: 'center' }}>Carregando...</td>
                                </tr>
                            ) : suppliers.length === 0 ? (
                                <tr>
                                    <td colSpan={3} style={{ textAlign: 'center' }}>Nenhum fornecedor cadastrado.</td>
                                </tr>
                            ) : (
                                suppliers.map((supplier) => (
                                    <tr key={supplier.id}>
                                        <td>{supplier.name}</td>
                                        <td>{supplier.contact || '-'}</td>
                                        <td>
                                            <button
                                                onClick={() => handleDelete(supplier.id)}
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
