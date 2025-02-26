from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
import app.db.models as models
from app.deps import get_db
import app.schemas as schemas
from app.utils import hash_password
from pydantic import UUID4
from typing import List
# used for reminding a return of empty list etc
import logging
# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

router = APIRouter()

#TODO add notifications
@router.post("/add/{user_id}")
async def add_notification(notification: schemas.NotificationCreate, db: Session = Depends(get_db)):
    # Create a new notification instance
    new_notification = models.Notification(
        title = notification.title,  # Generate a unique ID for the notification
        user_id=notification.user_id,
        message=notification.message,
        seen=notification.seen
    )
    
    # Add and commit to the database
    try:
        db.add(new_notification)
        db.commit()
        db.refresh(new_notification)  # Refresh to get the latest state from the DB
        return {"success": True, "notification": new_notification}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to add notification: {str(e)}")



#TODO mark as seen
@router.patch("/mark_seen/{notification_id}")
def mark_as_seen(notification_id: int, db: Session = Depends(get_db)):
    notification = db.query(models.Notification).filter(models.Notification.id == notification_id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    notification.seen = True
    db.commit()
    return {"message": "Notification marked as seen"}


#TODO remove notifications
@router.delete("/delete/{notification_id}")
def delete_notification(notification_id: int, db: Session = Depends(get_db)):
    notification = db.query(models.Notification).filter(models.Notification.id == notification_id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    db.delete(notification)
    db.commit()
    return {"message": "Notification deleted"}


#TODO show User Notifications with user_id
@router.get("/get/{user_id}")
def get_notifications(user_id: UUID4, db: Session = Depends(get_db)):
    notifications = db.query(models.Notification).filter(models.Notification.user_id == user_id).order_by(models.Notification.created_at.desc()).all()
    return notifications


#TODO show notification by id
