'use client';

import { useState, useEffect } from 'react';

interface Ingredient {
    id: number;
    name: string;
    unit: string;
    cost: number;
}

export default function IngredientsPage() {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        unit: 'kg',
        cost: '',
    });

    useEffect(() => {
        fetchIngredients();
    }, []);

    const fetchIngredients = async () => {
        try {
            const res = await fetch('/api/ingredients');
            const data = await res.json();
            setIngredients(data);
        } catch (error) {
            console.error('Failed to fetch ingredients', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/ingredients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setFormData({ name: '', unit: 'kg', cost: '' });
                fetchIngredients();
            }
        } catch (error) {
            console.error('Failed to create ingredient', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir este insumo?')) return;

        try {
            const res = await fetch(`/api/ingredients/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                fetchIngredients();
            }
        } catch (error) {
            console.error('Failed to delete ingredient', error);
        }
    };

    return (
        <div className="container">
            <h1 style={{ marginBottom: '2rem', fontSize: '2rem', color: 'hsl(var(--primary))' }}>
                Cadastro de Insumos
            </h1>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>Novo Insumo</h2>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nome</label>
                        <input
                            type="text"
                            className="input"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            placeholder="Ex: Arroz"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Unidade</label>
                        <select
                            className="input"
                            value={formData.unit}
                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        >
                            <option value="kg">KG</option>
                            <option value="g">G</option>
                            <option value="l">L</option>
                            <option value="ml">ML</option>
                            <option value="un">Unidade</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Custo</label>
                        <input
                            type="number"
                            step="0.01"
                            className="input"
                            value={formData.cost}
                            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                            required
                            placeholder="0.00"
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
                                <th>Unidade</th>
                                <th>Custo</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center' }}>Carregando...</td>
                                </tr>
                            ) : ingredients.length === 0 ? (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center' }}>Nenhum insumo cadastrado.</td>
                                </tr>
                            ) : (
                                ingredients.map((ingredient) => (
                                    <tr key={ingredient.id}>
                                        <td>{ingredient.name}</td>
                                        <td>{ingredient.unit}</td>
                                        <td>R$ {ingredient.cost.toFixed(2)}</td>
                                        <td>
                                            <button
                                                onClick={() => handleDelete(ingredient.id)}
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
