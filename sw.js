// Service Worker for ChronicCare AI

// On install, activate immediately
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  self.skipWaiting();
});

// On activate, take control of all clients
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(self.clients.claim());
});

// This listener is for actual Push API messages from a server.
// While the current app uses client-side scheduling, this makes the app future-proof.
self.addEventListener('push', (event) => {
    console.log('Service Worker: Push Received.');
    const data = event.data ? event.data.json() : { title: 'ChronicCare AI', body: 'You have a new notification.' };
    
    const options = {
        body: data.body,
        icon: 'https://cdn-icons-png.flaticon.com/512/3602/3602157.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/3602/3602157.png'
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Listen for the notification click event
self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Notification clicked.');
    event.notification.close();
    
    // This logic attempts to focus on an existing tab or open a new one
    event.waitUntil(
        clients.matchAll({ type: "window" }).then((clientList) => {
            for (const client of clientList) {
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});
