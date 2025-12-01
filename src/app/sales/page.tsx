'use client';

import { useState, useEffect } from 'react';

interface Product {
    id: number;
    name: string;
    price: number;
}

interface Customer {
    id: number;
    name: string;
}

interface SaleItem {
    productId: string;
    quantity: string;
    unitPrice: string;
}

export default function SalesPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [items, setItems] = useState<SaleItem[]>([{ productId: '', quantity: '1', unitPrice: '' }]);
    const [customerId, setCustomerId] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [paymentStatus, setPaymentStatus] = useState('Paid');

    useEffect(() => {
        fetchProducts();
        fetchCustomers();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products', error);
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

    const handleProductChange = (index: number, productId: string) => {
        const product = products.find((p) => p.id === parseInt(productId));
        const updated = [...items];
        updated[index] = {
            ...updated[index],
            productId,
            unitPrice: product ? product.price.toString() : '',
        };
        setItems(updated);
    };

    const updateItem = (index: number, field: string, value: string) => {
        const updated = [...items];
        updated[index] = { ...updated[index], [field]: value };
        setItems(updated);
    };

    const addItem = () => {
        setItems([...items, { productId: '', quantity: '1', unitPrice: '' }]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => {
            const price = parseFloat(item.unitPrice) || 0;
            const qty = parseInt(item.quantity) || 0;
            return sum + price * qty;
        }, 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validItems = items.filter((item) => item.productId && item.quantity && item.unitPrice);

        if (validItems.length === 0) {
            alert('Adicione pelo menos um produto à venda');
            return;
        }

        try {
            const res = await fetch('/api/sales', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerId: customerId || null,
                    items: validItems,
                    paymentMethod,
                    paymentStatus,
                }),
            });

            if (res.ok) {
                alert('Venda registrada com sucesso!');
                setItems([{ productId: '', quantity: '1', unitPrice: '' }]);
                setCustomerId('');
                setPaymentMethod('Cash');
                setPaymentStatus('Paid');
            } else {
                alert('Erro ao registrar venda');
            }
        } catch (error) {
            console.error('Failed to create sale', error);
            alert('Erro ao registrar venda');
        }
    };

    const total = calculateTotal();

    return (
        <div className="container">
            <h1 style={{ marginBottom: '2rem', fontSize: '2rem', color: 'hsl(var(--primary))' }}>
                Lançamento de Vendas
            </h1>

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                            Cliente (Opcional)
                        </label>
                        <select
                            className="input"
                            value={customerId}
                            onChange={(e) => setCustomerId(e.target.value)}
                        >
                            <option value="">Venda balcão / Sem cliente</option>
                            {customers.map((customer) => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <h3 style={{ marginBottom: '1rem', fontWeight: '600' }}>Produtos</h3>
                    {items.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
                                gap: '1rem',
                                marginBottom: '0.5rem',
                                alignItems: 'center',
                            }}
                        >
                            <select
                                className="input"
                                value={item.productId}
                                onChange={(e) => handleProductChange(index, e.target.value)}
                                required
                            >
                                <option value="">Selecione um produto</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                className="input"
                                placeholder="Qtd"
                                value={item.quantity}
                                onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                required
                                min="1"
                            />
                            <input
                                type="number"
                                step="0.01"
                                className="input"
                                placeholder="Preço"
                                value={item.unitPrice}
                                onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                                required
                            />
                            <div style={{ fontWeight: '600' }}>
                                R$ {((parseFloat(item.unitPrice) || 0) * (parseInt(item.quantity) || 0)).toFixed(2)}
                            </div>
                            <button
                                type="button"
                                onClick={() => removeItem(index)}
                                className="btn btn-outline"
                                style={{ color: 'hsl(var(--error))', borderColor: 'hsl(var(--error))' }}
                            >
                                ✕
                            </button>
                        </div>
                    ))}

                    <button type="button" onClick={addItem} className="btn btn-outline" style={{ marginTop: '0.5rem' }}>
                        + Adicionar Produto
                    </button>

                    <div
                        style={{
                            marginTop: '2rem',
                            paddingTop: '1rem',
                            borderTop: '2px solid hsl(var(--border))',
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr',
                            gap: '1rem',
                        }}
                    >
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                                Forma de Pagamento
                            </label>
                            <select className="input" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                <option value="Cash">Dinheiro</option>
                                <option value="Card">Cartão</option>
                                <option value="Pix">Pix</option>
                                <option value="Transfer">Transferência</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                                Status do Pagamento
                            </label>
                            <select className="input" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
                                <option value="Paid">Pago</option>
                                <option value="Pending">Pendente</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Total</label>
                            <div
                                style={{
                                    fontSize: '2rem',
                                    fontWeight: '700',
                                    color: 'hsl(var(--success))',
                                    lineHeight: '1.5',
                                }}
                            >
                                R$ {total.toFixed(2)}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{
                            marginTop: '2rem',
                            width: '100%',
                            padding: 'var(--spacing-md) var(--spacing-lg)',
                            fontSize: '1.125rem',
                        }}
                    >
                        Finalizar Venda
                    </button>
                </form>
            </div>
        </div>
    );
}
