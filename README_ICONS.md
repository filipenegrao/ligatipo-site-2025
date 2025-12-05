# Importando Fonte Variable de Ícones

## 📦 Setup

### 1. Coloque o arquivo da fonte em:
```
ligatipo/public/fonts/ligatipo-icons.woff2
```

(ou outro formato: `.ttf`, `.otf`, `.woff`)

### 2. Atualize o arquivo `app/fonts.scss` com:
- Nome correto da fonte (em `font-family`)
- Caminho correto do arquivo (em `src`)
- Os 4 caracteres/glifos do seu font (nos exemplos `.icon-add`, `.icon-edit`, etc)

### 3. Importe o SCSS em `app/globals.scss`:
```scss
@import './fonts.scss';
```

## 🎨 Como Usar nos Componentes

### Opção 1: Com classe + pseudo-elemento `::before`
```jsx
<button className="icon icon-edit">
  Editar
</button>
```

**CSS/SCSS:**
```scss
.icon-edit::before {
    @include icon('✎'); // ou o caractere do seu font
}
```

### Opção 2: Direto no elemento
```jsx
<span className="icon">✎</span>
```

### Opção 3: Com atributo data
```jsx
<button data-icon="✎" className="icon-button">
  Ação
</button>
```

```scss
.icon-button::before {
    content: attr(data-icon);
    @include icon('');
}
```

## 🔤 Mapeando seus 4 Glifos

Se sua fonte tem 4 ícones específicos, crie nomes semânticos:

```scss
// No seu fonts.scss
.icon-plus::before { @include icon('U+0001'); }    // Substitua pelo unicode do seu glifo
.icon-minus::before { @include icon('U+0002'); }
.icon-check::before { @include icon('U+0003'); }
.icon-close::before { @include icon('U+0004'); }
```

## 📝 Dicas

- **Font Weight**: Como é variable, você pode usar `font-weight: 400` para normal, `600` para bold, etc
- **Font Size**: Use `font-size` normal, os ícones respeitam o tamanho
- **Cores**: Herdam a cor do texto automaticamente
- **Alinhamento**: Classe `.icon` já traz `line-height: 1` e `display: inline-block`

## ✅ Exemplo Prático

```jsx
// components/admin/IconButton.js
import styles from './IconButton.module.scss';

export default function IconButton({ icon, label, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`${styles.btn} icon icon-${icon}`}
      title={label}
    >
      {label}
    </button>
  );
}
```

```scss
// components/admin/IconButton.module.scss
@use "../../app/fonts.scss" as *;

.btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border: none;
    background: transparent;
    
    &::before {
        font-size: 1.2rem;
    }
}
```

```jsx
// Usar em componentes
<IconButton icon="edit" label="Editar" onClick={handleEdit} />
<IconButton icon="delete" label="Deletar" onClick={handleDelete} />
```

## 🚀 Next Steps

1. Coloque seu arquivo `.woff2` em `/public/fonts/`
2. Atualize `app/fonts.scss` com os nomes corretos
3. Importe em `globals.scss`
4. Use nos componentes com as classes `.icon-*`

Se precisar de ajuda com os caracteres Unicode específicos da sua fonte, me avise! 🎯
