'use client';

import { useState, useEffect } from 'react';

interface ProductIngredient {
    id: number;
    ingredientId: number;
    quantity: number;
    ingredient: {
        id: number;
        name: string;
        unit: string;
        cost: number;
    };
}

interface Product {
    id: number;
    name: string;
    description: string | null;
    price: number;
    ingredients: ProductIngredient[];
}

export default function MenuPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
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

    const calculateProductCost = (product: Product) => {
        return product.ingredients.reduce((total, pi) => {
            return total + pi.ingredient.cost * pi.quantity;
        }, 0);
    };

    return (
        <div className="container">
            <h1 style={{ marginBottom: '0.5rem', fontSize: '2.5rem', color: 'hsl(var(--primary))', textAlign: 'center' }}>
                Cardápio Pimenta Doce
            </h1>
            <p style={{ marginBottom: '3rem', color: 'hsl(var(--text-secondary))', fontSize: '1.125rem', textAlign: 'center' }}>
                Nossos produtos disponíveis
            </p>

            {loading ? (
                <p style={{ textAlign: 'center' }}>Carregando...</p>
            ) : products.length === 0 ? (
                <div className="card" style={{ textAlign: 'center' }}>
                    <p>Nenhum produto no cardápio ainda.</p>
                </div>
            ) : (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '1.5rem',
                    }}
                >
                    {products.map((product) => {
                        const cost = calculateProductCost(product);
                        const margin = ((product.price - cost) / product.price) * 100;

                        return (
                            <div
                                key={product.id}
                                className="card"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'transform var(--transition-normal), box-shadow var(--transition-normal)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                                }}
                            >
                                <h3 style={{ marginBottom: '0.5rem', color: 'hsl(var(--primary))', fontSize: '1.5rem' }}>
                                    {product.name}
                                </h3>
                                {product.description && (
                                    <p style={{ color: 'hsl(var(--text-secondary))', marginBottom: '1rem', fontSize: '0.875rem' }}>
                                        {product.description}
                                    </p>
                                )}

                                <div
                                    style={{
                                        marginTop: 'auto',
                                        paddingTop: '1rem',
                                        borderTop: '1px solid hsl(var(--border))',
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.875rem' }}>Custo:</span>
                                        <span style={{ fontWeight: '600' }}>R$ {cost.toFixed(2)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.875rem' }}>Margem:</span>
                                        <span
                                            style={{
                                                fontWeight: '600',
                                                color: margin > 0 ? 'hsl(var(--success))' : 'hsl(var(--error))',
                                            }}
                                        >
                                            {margin.toFixed(1)}%
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginTop: '1rem',
                                            paddingTop: '1rem',
                                            borderTop: '1px solid hsl(var(--border))',
                                        }}
                                    >
                                        <span style={{ fontWeight: '600', fontSize: '1rem' }}>Preço:</span>
                                        <span
                                            style={{
                                                fontSize: '1.75rem',
                                                fontWeight: '700',
                                                color: 'hsl(var(--success))',
                                            }}
                                        >
                                            R$ {product.price.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
