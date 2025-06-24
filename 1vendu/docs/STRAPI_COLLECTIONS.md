# Collections Strapi - Favoris et Panier

Ce document explique comment créer et configurer les collections Strapi nécessaires pour les fonctionnalités de favoris et de panier.

## 1. Collection "Favorite" (Favoris)

### Création de la collection
1. Dans l'admin Strapi, aller dans **Content-Type Builder**
2. Créer une nouvelle **Collection Type** nommée `favorite`
3. Configurer les champs suivants :

### Champs de la collection Favorite
| Nom du champ | Type | Configuration |
|--------------|------|---------------|
| `user` | Relation | **Many to One** vers `User` (from users-permissions) |
| `product` | Relation | **Many to One** vers `Product` |

### Configuration des relations
- **user** : 
  - Type : Relation
  - Relation type : Many Favorites to One User
  - Target : User (from users-permissions)
  
- **product** :
  - Type : Relation  
  - Relation type : Many Favorites to One Product
  - Target : Product

### Permissions
Dans **Settings > Users & Permissions Plugin > Roles > Authenticated** :
- ✅ `find` (pour récupérer ses favoris)
- ✅ `create` (pour ajouter aux favoris)
- ✅ `delete` (pour supprimer des favoris)
- ❌ `update` (pas nécessaire)
- ❌ `findOne` (optionnel)

## 2. Collection "Cart" (Panier)

### Création de la collection
1. Dans l'admin Strapi, aller dans **Content-Type Builder**
2. Créer une nouvelle **Collection Type** nommée `cart`
3. Configurer les champs suivants :

### Champs de la collection Cart
| Nom du champ | Type | Configuration |
|--------------|------|---------------|
| `user` | Relation | **Many to One** vers `User` (from users-permissions) |
| `product` | Relation | **Many to One** vers `Product` |
| `quantity` | Number | **Integer**, Required, Default: 1 |

### Configuration des relations
- **user** : 
  - Type : Relation
  - Relation type : Many Carts to One User
  - Target : User (from users-permissions)
  
- **product** :
  - Type : Relation
  - Relation type : Many Carts to One Product  
  - Target : Product

- **quantity** :
  - Type : Number
  - Number format : integer
  - Required : Yes
  - Default value : 1

### Permissions
Dans **Settings > Users & Permissions Plugin > Roles > Authenticated** :
- ✅ `find` (pour récupérer son panier)
- ✅ `create` (pour ajouter au panier)
- ✅ `update` (pour modifier les quantités)
- ✅ `delete` (pour supprimer du panier)
- ❌ `findOne` (optionnel)

## 3. Modification de la collection "Product" (si nécessaire)

### Ajout des relations inverses (optionnel)
Si vous voulez pouvoir naviguer depuis un produit vers ses favoris/panier :

1. Ouvrir la collection `Product` 
2. Ajouter les champs suivants :

| Nom du champ | Type | Configuration |
|--------------|------|---------------|
| `favorites` | Relation | **One to Many** vers `Favorite` |
| `carts` | Relation | **One to Many** vers `Cart` |

## 4. Configuration des politiques (Policies)

### Politique pour les Favoris
Créer un fichier `src/policies/favorite-owner.js` :

```javascript
module.exports = async (policyContext, config, { strapi }) => {
  const { user } = policyContext.state;
  const { id } = policyContext.params;

  if (!user) {
    return false;
  }

  // Pour les opérations de création, pas besoin de vérifier
  if (policyContext.request.method === 'POST') {
    return true;
  }

  // Pour les autres opérations, vérifier que l'utilisateur est propriétaire
  const favorite = await strapi.entityService.findOne('api::favorite.favorite', id, {
    populate: ['user']
  });

  return favorite && favorite.user && favorite.user.id === user.id;
};
```

### Politique pour le Panier
Créer un fichier `src/policies/cart-owner.js` :

```javascript
module.exports = async (policyContext, config, { strapi }) => {
  const { user } = policyContext.state;
  const { id } = policyContext.params;

  if (!user) {
    return false;
  }

  // Pour les opérations de création, pas besoin de vérifier
  if (policyContext.request.method === 'POST') {
    return true;
  }

  // Pour les autres opérations, vérifier que l'utilisateur est propriétaire
  const cartItem = await strapi.entityService.findOne('api::cart.cart', id, {
    populate: ['user']
  });

  return cartItem && cartItem.user && cartItem.user.id === user.id;
};
```

## 5. Configuration des routes

### Routes pour les Favoris
Dans `src/api/favorite/routes/favorite.js` :

```javascript
module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/favorites',
      handler: 'favorite.find',
      config: {
        policies: ['global::user-context']
      }
    },
    {
      method: 'POST',
      path: '/favorites',
      handler: 'favorite.create',
      config: {
        policies: ['global::user-context']
      }
    },
    {
      method: 'DELETE',
      path: '/favorites/:id',
      handler: 'favorite.delete',
      config: {
        policies: ['global::favorite-owner']
      }
    }
  ]
};
```

### Routes pour le Panier
Dans `src/api/cart/routes/cart.js` :

```javascript
module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/carts',
      handler: 'cart.find',
      config: {
        policies: ['global::user-context']
      }
    },
    {
      method: 'POST',
      path: '/carts',
      handler: 'cart.create',
      config: {
        policies: ['global::user-context']
      }
    },
    {
      method: 'PUT',
      path: '/carts/:id',
      handler: 'cart.update',
      config: {
        policies: ['global::cart-owner']
      }
    },
    {
      method: 'DELETE',
      path: '/carts/:id',
      handler: 'cart.delete',
      config: {
        policies: ['global::cart-owner']
      }
    }
  ]
};
```

## 6. Contrôleurs personnalisés

### Contrôleur pour les Favoris
Modifier `src/api/favorite/controllers/favorite.js` :

```javascript
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::favorite.favorite', ({ strapi }) => ({
  async find(ctx) {
    const user = ctx.state.user;
    
    const favorites = await strapi.entityService.findMany('api::favorite.favorite', {
      filters: { user: user.id },
      populate: ['product']
    });

    return { data: favorites };
  },

  async create(ctx) {
    const user = ctx.state.user;
    const { product } = ctx.request.body.data;

    // Vérifier si le produit n'est pas déjà en favoris
    const existingFavorite = await strapi.entityService.findMany('api::favorite.favorite', {
      filters: { 
        user: user.id,
        product: product 
      }
    });

    if (existingFavorite.length > 0) {
      return ctx.badRequest('Ce produit est déjà dans vos favoris');
    }

    const favorite = await strapi.entityService.create('api::favorite.favorite', {
      data: {
        user: user.id,
        product: product
      },
      populate: ['product']
    });

    return { data: favorite };
  }
}));
```

### Contrôleur pour le Panier
Modifier `src/api/cart/controllers/cart.js` :

```javascript
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::cart.cart', ({ strapi }) => ({
  async find(ctx) {
    const user = ctx.state.user;
    
    const cartItems = await strapi.entityService.findMany('api::cart.cart', {
      filters: { user: user.id },
      populate: ['product']
    });

    return { data: cartItems };
  },

  async create(ctx) {
    const user = ctx.state.user;
    const { product, quantity = 1 } = ctx.request.body.data;

    const cartItem = await strapi.entityService.create('api::cart.cart', {
      data: {
        user: user.id,
        product: product,
        quantity: quantity
      },
      populate: ['product']
    });

    return { data: cartItem };
  }
}));
```

## 7. Politique pour le contexte utilisateur

Créer `src/policies/user-context.js` :

```javascript
module.exports = async (policyContext, config, { strapi }) => {
  const { user } = policyContext.state;
  
  if (!user) {
    return false;
  }

  return true;
};
```

## 8. Tests de validation

### Test des Favoris
```bash
# Ajouter un favori
curl -X POST http://localhost:1337/api/favorites \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"data": {"product": 1}}'

# Récupérer les favoris
curl -X GET http://localhost:1337/api/favorites \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test du Panier
```bash
# Ajouter au panier
curl -X POST http://localhost:1337/api/carts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"data": {"product": 1, "quantity": 2}}'

# Récupérer le panier
curl -X GET http://localhost:1337/api/carts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Résumé des étapes

1. ✅ Créer les collections `Favorite` et `Cart`
2. ✅ Configurer les relations avec `User` et `Product`
3. ✅ Définir les permissions appropriées
4. ✅ Implémenter les politiques de sécurité
5. ✅ Personnaliser les contrôleurs si nécessaire
6. ✅ Tester les endpoints

Une fois ces collections créées et configurées, les fonctions API React Native pourront interagir avec Strapi pour gérer les favoris et le panier des utilisateurs. 