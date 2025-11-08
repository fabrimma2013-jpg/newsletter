// A flag to ensure permission is requested only once per session.
let permissionRequested = false;

/**
 * Registers the service worker and requests notification permission.
 * This should be called once when the application initializes after login.
 */
export const setupNotifications = async () => {
  if (!('serviceWorker' in navigator) || !('Notification' in window)) {
    console.error('Push notifications are not supported in this browser.');
    return;
  }
  
  // Register the service worker
  try {
    // Use a relative path and specify the scope to avoid cross-origin issues in sandboxed environments.
    await navigator.serviceWorker.register('./sw.js', { scope: './' });
  } catch (error) {
    console.error('Service Worker registration failed:', error);
  }
  
  // Request permission
  if (Notification.permission === 'default' && !permissionRequested) {
      permissionRequested = true;
      await Notification.requestPermission();
  }
};


/**
 * Shows a local notification via the registered service worker.
 * @param title The title of the notification.
 * @param options The notification options (body, tag, etc.).
 */
// FIX: Add `timestamp` to the allowed options, as `ServiceWorkerRegistration.showNotification` supports it
// even if the global `NotificationOptions` type doesn't include it in all library versions.
export const showNotification = async (title: string, options: NotificationOptions & { timestamp?: number }) => {
    if (Notification.permission !== 'granted') {
        console.warn(`Notification permission is ${Notification.permission}. Cannot show notification.`);
        // Optionally, you could fall back to an in-app alert here if desired.
        return;
    }

    try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
            await registration.showNotification(title, {
                ...options,
                // A generic medical icon for the notification
                icon: 'https://cdn-icons-png.flaticon.com/512/3602/3602157.png',
                badge: 'https://cdn-icons-png.flaticon.com/512/3602/3602157.png',
            });
        } else {
            console.error("Service worker registration not found. Cannot display notification.");
        }
    } catch (error) {
        console.error("Error showing notification: ", error);
    }
};