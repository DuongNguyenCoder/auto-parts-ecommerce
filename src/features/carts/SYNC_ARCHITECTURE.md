# Cart & Wishlist Sync Architecture

## Overview

This document describes the complete cart and wishlist synchronization system, which syncs local Zustand stores with the database while minimizing API calls through debouncing.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    CartWishlistSyncProvider                      │
│  Manages lifecycle of cart & wishlist sync (root layout)        │
└─────────────────────────────────────────────────────────────────┘
         │
         ├──────────────────────┬───────────────────────
         │                      │
    ┌────▼─────────────┐   ┌───▼─────────────┐
    │ Cart Flow        │   │ Wishlist Flow   │
    └────┬─────────────┘   └───┬─────────────┘
         │                      │
         │                      │
    ┌────▼──────────────────────▼──────────┐
    │ 1. User Login                         │
    │    ↓                                  │
    │ useInitializeCart/Wishlist            │
    │    ↓                                  │
    │ Fetch from DB (GET /api/carts)        │
    │    ↓                                  │
    │ Transform & Load to Zustand Store     │
    └───────────────────────────────────────┘
         │
         │
    ┌────▼──────────────────────────────────┐
    │ 2. User Updates (Add/Remove Item)     │
    │    ↓                                  │
    │ Zustand Store Updates (Local)         │
    │    ↓                                  │
    │ useCartSync/WishlistSync monitors     │
    │    ↓                                  │
    │ Debounce 3 seconds                    │
    │    ↓                                  │
    │ POST /api/carts/sync (full state)    │
    │ POST /api/wishlist/sync (full state) │
    └───────────────────────────────────────┘
         │
         │
    ┌────▼──────────────────────────────────┐
    │ 3. API Response                       │
    │    ↓                                  │
    │ Confirm sync success or log error     │
    │ (no need to update store again)       │
    └───────────────────────────────────────┘
```

## Key Components

### 1. API Endpoints (New)

- **POST /api/carts/sync** - Syncs entire cart state to DB
  - Deletes all old items and creates new ones
  - Validates all products exist
  - Returns updated cart

- **POST /api/wishlist/sync** - Syncs entire wishlist state to DB
  - Deletes all old items and creates new ones
  - Validates all products exist
  - Returns updated wishlist

### 2. Service Layer (Updated)

- **cartService.syncCart()** - Handles cart sync logic
  - Clears old items
  - Validates products
  - Creates new items from client state
- **wishlistService.syncWishlist()** - Handles wishlist sync logic
  - Clears old items
  - Validates products
  - Creates new items from client state

### 3. Sync Hooks

#### useInitializeCart & useInitializeWishlist

- Runs when user authenticates
- Fetches current DB state
- Transforms DB format → Zustand format
- Loads into store via replaceCart/replaceWishlist
- Merges any guest items if needed (future enhancement)

#### useCartSync & useWishlistSync

- Watches Zustand store for changes
- Debounces 3 seconds to batch updates
- Syncs entire state to DB on timeout
- Prevents concurrent syncs
- Logs errors but doesn't fail UI

### 4. Main Provider

#### CartWishlistSyncProvider

- Wraps entire app (in root layout)
- Orchestrates all sync hooks
- Single source of truth for sync logic
- Clean separation from UI components

## Data Flow Example

### Scenario: User logs in and adds items

1. **Login**

   ```
   useAuth().login() → sets isAuthenticated = true
   ```

2. **Initialization**

   ```
   useInitializeCart triggers (watches isAuthenticated)
   → GET /api/carts
   → cartApi.getCart() returns DB items
   → Transform: { id, productId, slug, quantity... }
   → useCartStore.replaceCart(transformedItems)
   → Local store now matches DB
   ```

3. **User adds item to cart**

   ```
   ProductCard.onAddToCart()
   → useCartStore.addItem(newItem)
   → Zustand updates local items
   → useCartSync detects change
   ```

4. **Debounce and Sync**
   ```
   useCartSync debounce timer: 0ms → 3000ms
   → User adds another item before 3s? Timer resets
   → After 3s of no changes:
      POST /api/carts/sync
      body: { items: [{productId, slug, quantity}...] }
   → Backend replaces all items in DB
   → Success logged, no UI change needed
   ```

## Schema Changes

### Cart Sync DTO

```typescript
SyncCartDTO {
  items: [
    {
      productId: number
      skuId?: string
      slug: string
      quantity: number
    }
  ]
}
```

### Wishlist Sync DTO

```typescript
SyncWishlistDTO {
  items: [
    {
      productId: number
      slug: string
    }
  ]
}
```

## Benefits of This Architecture

1. **Minimized API Calls** - Debounce reduces calls from 1-per-action to 1-per-3-seconds
2. **Atomic Sync** - Full state sync prevents inconsistencies
3. **Offline Support** - Local store works without DB until sync
4. **Clean Separation** - Sync logic isolated in provider/hooks
5. **Type Safe** - Full TypeScript validation via Zod schemas
6. **Scalable** - Easy to add more features (e.g., merge guest cart on login)
7. **No UI Coupling** - Sync happens silently in background

## Migration Path for Existing Carts

When deploying this feature:

1. Existing guest carts (in localStorage) remain untouched
2. On first login, user can see guest items in UI
3. When they add/remove items, debounce timer starts
4. After 3s or next action, sync sends guest items to DB
5. Future logins will load from DB (replaceCart overrides)

If you want to preserve guest items on first login:

- Modify useInitializeCart to merge instead of replace
- Use `mergeGuestCart()` action instead of `replaceCart()`

## Future Enhancements

1. **Merge guest cart on login**
   - Don't delete guest items
   - Instead merge with DB items
2. **Real-time sync indicator**
   - Show user "syncing..." status
   - Prevent leaving page during sync
3. **Conflict resolution**
   - If DB differs from what we sent, re-sync
   - Implement optimistic updates
4. **Offline queue**
   - Queue changes while offline
   - Replay on connection restored

## File Structure

```
src/
├── features/
│   ├── carts/
│   │   ├── api/
│   │   │   └── cart.api.ts (updated)
│   │   ├── hooks/
│   │   │   ├── use-cart-sync.ts (NEW)
│   │   │   └── use-initialize-cart.ts (NEW)
│   │   └── providers/
│   │       └── cart-wishlist-sync-provider.tsx (NEW)
│   └── wishlist/
│       ├── api/
│       │   └── wishlist.api.ts (updated)
│       └── hooks/
│           ├── use-wishlist-sync.ts (NEW)
│           └── use-initialize-wishlist.ts (NEW)
├── app/
│   ├── api/
│   │   ├── carts/
│   │   │   └── sync/
│   │   │       └── route.ts (NEW)
│   │   └── wishlist/
│   │       └── sync/
│   │           └── route.ts (NEW)
│   └── layout.tsx (updated)
├── server/
│   ├── controllers/
│   │   ├── carts.controller.ts (updated)
│   │   └── wishlist.controller.ts (updated)
│   └── services/
│       ├── carts.service.ts (updated)
│       └── wishlist.service.ts (updated)
└── validations/
    ├── cart.schema.ts (updated)
    └── wishlist.schema.ts (updated)
```

## Testing Checklist

- [ ] User login → cart/wishlist load from DB
- [ ] Add item → debounce timer starts
- [ ] Add another item before 3s → timer resets
- [ ] Wait 3s after last change → API call fires
- [ ] API sync succeeds → no UI errors
- [ ] User logout → stores persist (for guest)
- [ ] User login again → fresh DB data loads (replaces guest)
- [ ] Invalid product in sync request → proper error handling
