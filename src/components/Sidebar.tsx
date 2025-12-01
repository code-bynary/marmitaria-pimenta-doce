import Link from 'next/link';
import styles from './Sidebar.module.css';

const menuItems = [
  { label: 'Dashboard', href: '/' },
  { label: 'Vendas', href: '/sales' },
  { label: 'Cardápio', href: '/menu' },
  { label: 'Produtos', href: '/products' },
  { label: 'Insumos', href: '/ingredients' },
  { label: 'Clientes', href: '/customers' },
  { label: 'Fornecedores', href: '/suppliers' },
  { label: 'Financeiro', href: '/financial' },
];

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <h2>Pimenta Doce</h2>
      </div>
      <nav className={styles.nav}>
        <ul>
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={styles.link}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
