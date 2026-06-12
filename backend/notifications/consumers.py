"""
WebSocket consumers for notifications app.
Handles real-time notification delivery.
"""

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async


class NotificationConsumer(AsyncWebsocketConsumer):
    """WebSocket consumer for real-time notifications."""
    
    async def connect(self):
        """Handle WebSocket connection."""
        if self.scope["user"].is_anonymous:
            await self.close()
            return
        
        self.user_id = str(self.scope["user"].id)
        self.user_group_name = f'user_{self.user_id}'
        
        # Join user's notification group
        await self.channel_layer.group_add(
            self.user_group_name,
            self.channel_name
        )
        
        await self.accept()
    
    async def disconnect(self, close_code):
        """Handle WebSocket disconnection."""
        # Leave user's notification group
        await self.channel_layer.group_discard(
            self.user_group_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        """Receive message from WebSocket (e.g., mark as read)."""
        data = json.loads(text_data)
        action = data.get('action')
        
        if action == 'mark_read':
            notification_id = data.get('notification_id')
            await self.mark_notification_as_read(notification_id)
    
    async def send_notification(self, event):
        """Send notification to WebSocket."""
        notification = event['notification']
        
        await self.send(text_data=json.dumps({
            'type': 'notification',
            'notification': notification,
        }))
    
    async def notification_update(self, event):
        """Send notification update to WebSocket."""
        await self.send(text_data=json.dumps({
            'type': 'update',
            'unread_count': event['unread_count'],
        }))
    
    @database_sync_to_async
    def mark_notification_as_read(self, notification_id):
        """Mark notification as read in database."""
        from notifications.models import Notification
        try:
            notification = Notification.objects.get(
                id=notification_id,
                recipient_id=self.scope["user"].id
            )
            notification.is_read = True
            notification.save()
        except Notification.DoesNotExist:
            pass
