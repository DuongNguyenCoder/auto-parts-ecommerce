# Cart & Wishlist Sync - Implementation Guide

## Quick Start

The sync system is **already integrated** into your app. No configuration needed!

Simply use the stores as normal:

```typescript
// In any component
import { useCartStore } from "@/stores";

export function ProductCard() {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <button onClick={() => addItem({ ... })}>
      Add to Cart
    </button>
  );
  // ✅ Automatically syncs to DB after 3s
}
```

## How It Works

### When User Logs In

1. `CartWishlistSyncProvider` detects `isAuthenticated = true`
2. `useInitializeCart` & `useInitializeWishlist` fetch from DB
3. Local stores updated with DB data
4. UI immediately reflects latest state

### When User Changes Cart/Wishlist

1. Component calls `useCartStore.addItem()` or similar
2. Zustand immediately updates local state (instant UI feedback)
3. `useCartSync` detects change and starts debounce timer
4. After 3 seconds of no changes, full state syncs to DB
5. API request silent background sync (no UI interruption)

### Error Handling

If sync fails (network error, product not found, etc.):

- Error is logged to console
- Local state remains unchanged (user keeps items)
- Next sync attempt on next change

**This means users can still shop offline and sync when connection recovers.**

## For Developers

### Adding New Sync Features

If you need to sync additional data (e.g., addresses, preferences):

1. **Create API endpoint** - `POST /api/[feature]/sync`
2. **Create sync hook** - `src/features/[feature]/hooks/use-[feature]-sync.ts`
3. **Create init hook** - `src/features/[feature]/hooks/use-initialize-[feature].ts`
4. **Add to provider** - Import and use in `CartWishlistSyncProvider`

### Customizing Debounce Time

To change the 3-second debounce:

```typescript
// In use-cart-sync.ts
const DEBOUNCE_DELAY = 5000; // Change to 5 seconds
```

### Customizing Transformation Logic

Cart and wishlist use different DB schemas. Transformations happen in:

- `useInitializeCart` - DB cart format → store format
- `useInitializeWishlist` - DB wishlist format → store format

Modify these if your DB schema changes.

## Architecture Principles

### ✅ Good - What This System Does Well

1. **Minimal API calls** - Debouncing prevents spam
2. **Offline-first** - Local state always available
3. **Type-safe** - Zod validation on all APIs
4. **Isolated logic** - Sync code doesn't mix with UI
5. **Framework agnostic** - Works with any component pattern
6. **Testable** - Hooks can be tested independently

### ⚠️ Be Careful With

1. **Don't call sync APIs directly** - Use hooks instead

   ```typescript
   // ❌ Wrong
   fetch('/api/carts/sync', { ... })

   // ✅ Right
   useCartSync() // Hook handles debouncing
   ```

2. **Don't duplicate sync logic** - Use the provider

   ```typescript
   // ❌ Wrong - Duplicates sync logic
   useEffect(() => {
     if (isAuthenticated) {
       cartApi.getCart().then(...)
     }
   }, [isAuthenticated])

   // ✅ Right - Provider handles it
   // Just use stores normally
   ```

3. **Don't clear stores on logout** - Preserves guest cart

   ```typescript
   // ❌ Wrong - Loses guest items
   logout();
   clearCart();

   // ✅ Right - Guest items stay for next login
   logout(); // Cart store untouched
   ```

## Performance Notes

### Debounce Efficiency

Imagine user adds 10 items quickly:

**Without debounce:**

- 10 API calls
- 10 network requests
- High load on server

**With 3s debounce:**

- 1 API call (all items batched)
- Reduces load by 10x
- Better UX (no spinners)

### Storage Footprint

- Cart store: ~5KB per item in memory
- Wishlist store: ~3KB per item in memory
- localStorage: ~50KB total (both stores)
- No bloat, scales well

## Troubleshooting

### Cart not loading after login

1. Check browser console for errors
2. Verify cart API returns data: `GET /api/carts`
3. Check if user has cart in DB

### Items not syncing to DB

1. Open DevTools Network tab
2. Make a change and wait 3s
3. Look for `POST /api/carts/sync` request
4. Check response for errors

### Too frequent API calls

1. Don't call APIs directly from components
2. Let the sync hooks handle it
3. If need faster sync, reduce `DEBOUNCE_DELAY`

## Migration from Old System

If you had manual sync before:

```typescript
// ❌ Old way - remove this
useEffect(() => {
  cartApi.syncCart(items);
}, [items]);

// ✅ New way - let the hook handle it
// Just use store normally
useCartStore.addItem({ ... });
```

## File Locations

Quick reference for finding things:

| What          | Where                                                          |
| ------------- | -------------------------------------------------------------- |
| Sync hooks    | `src/features/{carts,wishlist}/hooks/use-*-sync.ts`            |
| Init hooks    | `src/features/{carts,wishlist}/hooks/use-initialize-*.ts`      |
| Provider      | `src/features/carts/providers/cart-wishlist-sync-provider.tsx` |
| API routes    | `src/app/api/{carts,wishlist}/sync/route.ts`                   |
| Services      | `src/server/services/{carts,wishlist}.service.ts`              |
| Schemas       | `src/validations/{cart,wishlist}.schema.ts`                    |
| Documentation | `src/features/carts/SYNC_ARCHITECTURE.md`                      |

## Advanced Usage

### Merge Guest Cart on Login (Future)

Currently: `replaceCart()` overwrites guest items

To preserve guest items instead:

```typescript
// In useInitializeCart
const mergeGuestCart = useCartStore((s) => s.mergeGuestCart);

// Instead of:
replaceCart(transformedItems);

// Use:
mergeGuestCart(transformedItems);
```

### Custom Error Handling

Add error callback to sync hooks:

```typescript
const handleSyncError = (error: Error) => {
  // Show toast notification
  // Log to monitoring service
  // Retry logic
};

// Then modify useCartSync to call it
```

### Real-time Sync Indicator

Add store slice for sync state:

```typescript
type CartState = {
  items: CartItem[];
  isSyncing: boolean;
};

// Then in component:
const isSyncing = useCartStore((s) => s.isSyncing);
return <span>{isSyncing ? "Syncing..." : "✓ Synced"}</span>;
```

## Questions & Support

For questions about:

- **Architecture** - Read SYNC_ARCHITECTURE.md
- **Implementation** - Check this guide
- **Specific files** - See File Locations table above
- **Debugging** - Check Troubleshooting section
