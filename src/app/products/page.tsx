'use client';

import { useState, useEffect } from 'react';

interface Ingredient {
    id: number;
    name: string;
    unit: string;
    cost: number;
}

interface ProductIngredient {
    id: number;
    ingredientId: number;
    quantity: number;
    ingredient: Ingredient;
}

interface Product {
    id: number;
    name: string;
    description: string | null;
    price: number;
    ingredients: ProductIngredient[];
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
    });
    const [selectedIngredients, setSelectedIngredients] = useState<Array<{ ingredientId: string; quantity: string }>>([
        { ingredientId: '', quantity: '' },
    ]);

    useEffect(() => {
        fetchProducts();
        fetchIngredients();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchIngredients = async () => {
        try {
            const res = await fetch('/api/ingredients');
            const data = await res.json();
            setIngredients(data);
        } catch (error) {
            console.error('Failed to fetch ingredients', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const validIngredients = selectedIngredients.filter(
                (ing) => ing.ingredientId && ing.quantity
            );

            const res = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    ingredients: validIngredients,
                }),
            });

            if (res.ok) {
                setFormData({ name: '', description: '', price: '' });
                setSelectedIngredients([{ ingredientId: '', quantity: '' }]);
                setShowForm(false);
                fetchProducts();
            }
        } catch (error) {
            console.error('Failed to create product', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir este produto?')) return;

        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                fetchProducts();
            }
        } catch (error) {
            console.error('Failed to delete product', error);
        }
    };

    const addIngredientRow = () => {
        setSelectedIngredients([...selectedIngredients, { ingredientId: '', quantity: '' }]);
    };

    const removeIngredientRow = (index: number) => {
        setSelectedIngredients(selectedIngredients.filter((_, i) => i !== index));
    };

    const updateIngredient = (index: number, field: string, value: string) => {
        const updated = [...selectedIngredients];
        updated[index] = { ...updated[index], [field]: value };
        setSelectedIngredients(updated);
    };

    const calculateProductCost = (product: Product) => {
        return product.ingredients.reduce((total, pi) => {
            return total + (pi.ingredient.cost * pi.quantity);
        }, 0);
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', color: 'hsl(var(--primary))' }}>
                    Cadastro de Produtos
                </h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn btn-primary"
                >
                    {showForm ? 'Cancelar' : '+ Novo Produto'}
                </button>
            </div>

            {showForm && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Novo Produto</h2>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nome</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    placeholder="Nome do produto"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Descrição</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Descrição (opcional)"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Preço de Venda</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="input"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Composição de Custos</h3>
                        {selectedIngredients.map((ing, index) => (
                            <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '1rem', marginBottom: '0.5rem' }}>
                                <select
                                    className="input"
                                    value={ing.ingredientId}
                                    onChange={(e) => updateIngredient(index, 'ingredientId', e.target.value)}
                                >
                                    <option value="">Selecione um insumo</option>
                                    {ingredients.map((ingredient) => (
                                        <option key={ingredient.id} value={ingredient.id}>
                                            {ingredient.name} ({ingredient.unit})
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="input"
                                    placeholder="Quantidade"
                                    value={ing.quantity}
                                    onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeIngredientRow(index)}
                                    className="btn btn-outline"
                                    style={{ color: 'hsl(var(--error))', borderColor: 'hsl(var(--error))' }}
                                >
                                    Remover
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addIngredientRow}
                            className="btn btn-outline"
                            style={{ marginTop: '0.5rem' }}
                        >
                            + Adicionar Insumo
                        </button>

                        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                            <button type="submit" className="btn btn-primary">
                                Salvar Produto
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="btn btn-outline"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card">
                <h2 style={{ marginBottom: '1rem' }}>Produtos Cadastrados</h2>
                {loading ? (
                    <p>Carregando...</p>
                ) : products.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'hsl(var(--text-secondary))' }}>Nenhum produto cadastrado.</p>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {products.map((product) => {
                            const totalCost = calculateProductCost(product);
                            const margin = product.price - totalCost;
                            const marginPercent = (margin / product.price) * 100;

                            return (
                                <div
                                    key={product.id}
                                    style={{
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: 'var(--radius-md)',
                                        padding: 'var(--spacing-lg)',
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ marginBottom: '0.5rem', color: 'hsl(var(--primary))' }}>{product.name}</h3>
                                            {product.description && (
                                                <p style={{ color: 'hsl(var(--text-secondary))', marginBottom: '1rem' }}>
                                                    {product.description}
                                                </p>
                                            )}

                                            <div style={{ marginTop: '1rem' }}>
                                                <strong>Composição:</strong>
                                                <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem' }}>
                                                    {product.ingredients.map((pi) => (
                                                        <li key={pi.id} style={{ color: 'hsl(var(--text-secondary))' }}>
                                                            {pi.ingredient.name}: {pi.quantity} {pi.ingredient.unit} - R${' '}
                                                            {(pi.ingredient.cost * pi.quantity).toFixed(2)}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        <div style={{ textAlign: 'right', minWidth: '200px' }}>
                                            <div style={{ marginBottom: '0.5rem' }}>
                                                <small style={{ color: 'hsl(var(--text-secondary))' }}>Custo Total:</small>
                                                <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>R$ {totalCost.toFixed(2)}</div>
                                            </div>
                                            <div style={{ marginBottom: '0.5rem' }}>
                                                <small style={{ color: 'hsl(var(--text-secondary))' }}>Preço de Venda:</small>
                                                <div style={{ fontSize: '1.25rem', fontWeight: '600', color: 'hsl(var(--success))' }}>
                                                    R$ {product.price.toFixed(2)}
                                                </div>
                                            </div>
                                            <div style={{ marginBottom: '1rem' }}>
                                                <small style={{ color: 'hsl(var(--text-secondary))' }}>Margem:</small>
                                                <div style={{ fontSize: '1rem', fontWeight: '600', color: margin > 0 ? 'hsl(var(--success))' : 'hsl(var(--error))' }}>
                                                    R$ {margin.toFixed(2)} ({marginPercent.toFixed(1)}%)
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="btn btn-outline"
                                                style={{ color: 'hsl(var(--error))', borderColor: 'hsl(var(--error))', width: '100%' }}
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
