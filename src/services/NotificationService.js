import toast from 'react-hot-toast';

class NotificationService {
  constructor() {
    this.subscriptions = new Map();
    this.notifications = [];
  }

  // Subscribe to specific notification types
  subscribe(type, callback) {
    if (!this.subscriptions.has(type)) {
      this.subscriptions.set(type, []);
    }
    this.subscriptions.get(type).push(callback);
  }

  // Unsubscribe from notifications
  unsubscribe(type, callback) {
    if (this.subscriptions.has(type)) {
      const callbacks = this.subscriptions.get(type);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Emit notification to subscribers
  emit(type, data) {
    if (this.subscriptions.has(type)) {
      this.subscriptions.get(type).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Notification callback error:', error);
        }
      });
    }
  }

  // Credit-specific notifications
  creditPurchased(amount) {
    const notification = {
      id: Date.now(),
      type: 'credit_purchased',
      title: 'Credits Purchased',
      message: `You successfully purchased ${amount} credits`,
      timestamp: new Date(),
      icon: '💳'
    };
    
    this.addNotification(notification);
    toast.success(notification.message);
    this.emit('credit_purchased', notification);
  }

  creditTransferred(amount, recipient) {
    const notification = {
      id: Date.now(),
      type: 'credit_transferred',
      title: 'Credits Transferred',
      message: `You transferred ${amount} credits to ${recipient}`,
      timestamp: new Date(),
      icon: '💸'
    };
    
    this.addNotification(notification);
    toast.success(notification.message);
    this.emit('credit_transferred', notification);
  }

  creditReceived(amount, sender) {
    const notification = {
      id: Date.now(),
      type: 'credit_received',
      title: 'Credits Received',
      message: `You received ${amount} credits from ${sender}`,
      timestamp: new Date(),
      icon: '💰'
    };
    
    this.addNotification(notification);
    toast.success(notification.message);
    this.emit('credit_received', notification);
  }

  sessionReminder(sessionData) {
    const notification = {
      id: Date.now(),
      type: 'session_reminder',
      title: 'Session Reminder',
      message: `Your session "${sessionData.skill}" starts in ${sessionData.timeUntil}`,
      timestamp: new Date(),
      icon: '⏰',
      urgent: true
    };
    
    this.addNotification(notification);
    toast(notification.message, {
      icon: '⏰',
      duration: 8000,
      style: {
        background: '#FEF3C7',
        color: '#92400E',
        border: '1px solid #F59E0B'
      }
    });
    this.emit('session_reminder', notification);
  }

  lowCreditsWarning(balance) {
    const notification = {
      id: Date.now(),
      type: 'low_credits',
      title: 'Low Credits Warning',
      message: `Your credit balance is low (${balance} credits remaining)`,
      timestamp: new Date(),
      icon: '⚠️'
    };
    
    this.addNotification(notification);
    toast.error(notification.message);
    this.emit('low_credits', notification);
  }

  // Generic notification system
  addNotification(notification) {
    this.notifications.unshift(notification);
    // Keep only last 50 notifications
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }
  }

  getNotifications() {
    return this.notifications;
  }

  markAsRead(id) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
    }
  }

  clearAll() {
    this.notifications = [];
  }

  // Browser notification API
  async requestPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  showBrowserNotification(title, options = {}) {
    if ('Notification' in window && Notification.permission === 'granted') {
      return new Notification(title, {
        icon: '/logo192.png',
        badge: '/logo192.png',
        ...options
      });
    }
  }
}

export default new NotificationService();
