// Service Worker for Mediz Healthcare App
const CACHE_NAME = 'mediz-cache-v1';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/icons/icon.svg',
  '/icons/icon-192x192.svg',
  '/icons/icon-512x512.svg',
  '/icons/apple-touch-icon.svg',
  '/icons/scan-96x96.svg',
  '/icons/meds-96x96.svg',
  '/icons/badge-96x96.svg'
];

// Install event - precache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!currentCaches.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network first with cache fallback strategy
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and API requests (we want fresh data for those)
  if (
    event.request.method !== 'GET' || 
    event.request.url.includes('/api/')
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone the response to cache it and return it
        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => {
            // Only cache successful responses
            if (response.status === 200) {
              cache.put(event.request, responseToCache);
            }
          });
        return response;
      })
      .catch(() => {
        // If network fetch fails, try to get from cache
        return caches.match(event.request)
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // If the resource wasn't in the cache, fallback to a basic offline page
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/offline.html');
            }
            return new Response('Network error occurred', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Handle background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'medication-updates') {
    event.waitUntil(syncMedicationUpdates());
  }
});

// Background sync function for medication updates
async function syncMedicationUpdates() {
  // Implementation for offline medication logs
  try {
    const offlineUpdates = await getOfflineUpdates();
    
    if (offlineUpdates && offlineUpdates.length > 0) {
      for (const update of offlineUpdates) {
        await fetch('/api/medications/logs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(update),
        });
      }
      await clearOfflineUpdates();
    }
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

// Helper function to get stored offline updates
async function getOfflineUpdates() {
  return new Promise((resolve) => {
    const openRequest = indexedDB.open('mediz-offline', 1);
    
    openRequest.onupgradeneeded = () => {
      const db = openRequest.result;
      if (!db.objectStoreNames.contains('updates')) {
        db.createObjectStore('updates', { keyPath: 'id', autoIncrement: true });
      }
    };
    
    openRequest.onsuccess = () => {
      const db = openRequest.result;
      const transaction = db.transaction('updates', 'readonly');
      const store = transaction.objectStore('updates');
      const getRequest = store.getAll();
      
      getRequest.onsuccess = () => {
        resolve(getRequest.result);
      };
      
      getRequest.onerror = () => {
        console.error('Failed to get offline updates');
        resolve([]);
      };
    };
    
    openRequest.onerror = () => {
      console.error('Failed to open offline database');
      resolve([]);
    };
  });
}

// Helper function to clear stored offline updates
async function clearOfflineUpdates() {
  return new Promise((resolve) => {
    const openRequest = indexedDB.open('mediz-offline', 1);
    
    openRequest.onsuccess = () => {
      const db = openRequest.result;
      const transaction = db.transaction('updates', 'readwrite');
      const store = transaction.objectStore('updates');
      const clearRequest = store.clear();
      
      clearRequest.onsuccess = () => {
        resolve(true);
      };
      
      clearRequest.onerror = () => {
        console.error('Failed to clear offline updates');
        resolve(false);
      };
    };
    
    openRequest.onerror = () => {
      console.error('Failed to open offline database');
      resolve(false);
    };
  });
}

// Push notification support
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-96x96.png',
    data: {
      url: data.url || '/'
    },
    vibrate: [100, 50, 100],
    actions: [
      {
        action: 'view',
        title: 'View'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'dismiss') {
    return;
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((windowClients) => {
        const url = event.notification.data.url;
        
        // If a window is already open, focus it and navigate
        for (const client of windowClients) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Otherwise open a new window
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});