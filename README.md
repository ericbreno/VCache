# VCache - Simple lightweight timed cache for js

## How to Use
```
// You may pass timeout and a name for the cache. Both are optionals, default timeout is 5000 ms
// Timeout and name cannot be updated later
const cache = VCache(60 * 1000);
cache.put("key", "value");
cache.get("key"); // "value"

cache.putIfAbsent("key", "newValue");
cache.get("key"); // "value"
```

### Other methods
You may find useful, but usually will not call.

Hits: Succesfully accessed an object from the cache.
Misses: Tried to access an object not present (or expired) from cache.
```
cache.getHit(); 
cache.getMissed(); 
```

Gets actual size of the cache (counts all the items not expired, doesn't remove expired items, doesn't count as hit or miss).
```
cache.count(); 
```

Checks if this key is present and not expired in cache (removes expired objects, counts as hit or miss).
```
cache.contains(key);
```

Gets cache's name and timeout.
```
cache.getName();
cache.getTimeout();
```

## Timeout
Objects are partial lazy-removed from cache, being deleted when tried to get retrieved or after an arbitrary number of add operations in cache, then the GC runs (complexity of approx O(n + nlog n), with n as cache total size). Object Timeout is refreshed everytime the object is accessed (with put, get or contains).

## Dependencies
None

## About
I like caches
