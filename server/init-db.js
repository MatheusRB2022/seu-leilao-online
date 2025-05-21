const db = require('./db');

// Initialize categories
const categories = [
    { name: 'Veículos', slug: 'veiculos' },
    { name: 'Imóveis', slug: 'imoveis' },
    { name: 'Eletrônicos', slug: 'eletronicos' },
    { name: 'Arte', slug: 'arte' },
    { name: 'Joias', slug: 'joias' },
    { name: 'Colecionáveis', slug: 'colecionaveis' }
];

// Insert categories
categories.forEach(category => {
    db.run(
        'INSERT OR IGNORE INTO categories (name, slug) VALUES (?, ?)',
        [category.name, category.slug],
        (err) => {
            if (err) {
                console.error('Error inserting category:', err);
            } else {
                console.log('Category added:', category.name);
            }
        }
    );
});

console.log('Database initialized with sample categories.');
