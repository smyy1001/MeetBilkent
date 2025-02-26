from fastapi import FastAPI, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
import app.db.models as models
from app.deps import get_db
from app.utils import hash_password
import app.schemas as schemas
from typing import List
from datetime import datetime, timedelta
from pydantic import UUID4
# used for reminding a return of empty list etc
import logging
# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

router = APIRouter()

# add school
@router.post("/add/", response_model=schemas.School)
def create_school(school: schemas.SchoolCreate, db: Session = Depends(get_db)):

    db_school = (
        db.query(models.School)
        .filter(models.School.school_name == school.school_name)
        .first()
    )
    if db_school:
        raise HTTPException(status_code=400, detail="Bu email ile bir okul zaten var")

    # hashed_password = hash_password(school.password)
    db_school = models.School(
        **school.dict(exclude={"password"})
    )
    db.add(db_school)
    db.commit()
    db.refresh(db_school)
    return db_school


# delete school
@router.delete("/delete/{school_id}", response_model=schemas.School)
def delete_school(school_id: int, db: Session = Depends(get_db)):
    db_school = db.query(models.School).filter(models.School.id == school_id).first()
    if not db_school:
        raise HTTPException(status_code=404, detail="Okul bulunamadı")
    db.delete(db_school)
    db.commit()
    db.refresh(db_school)
    return db_school


# show all school
@router.get("/all/", response_model=List[schemas.School])
def get_all_schools(db: Session = Depends(get_db)):
    schools = db.query(models.School).all()
    return schools


# show school
@router.get("/show_school/{school_id}", response_model=schemas.School)
def show_school(school_id: int, db: Session = Depends(get_db)):
    db_school = db.query(models.School).filter(models.School.id == school_id).first()
    if not db_school:
        raise HTTPException(
            status_code=404, detail=f"Okul id si {school_id} olan bir okul bulunamadı."
        )
    return db_school


@router.get("/show/{school_user_id}", response_model=schemas.School)
def show_school(school_user_id: UUID4, db: Session = Depends(get_db)):
    db_school = db.query(models.School).filter(models.School.user_id == school_user_id).first()
    if not db_school:
        raise HTTPException(
            status_code=404, detail=f"Okul id si {school_user_id} olan bir okul bulunamadı."
        )
    return db_school

# give rate
@router.post("/rate_school/{school_id}", response_model=schemas.School)
def give_rate(school_id: int, school_rate: int, db: Session = Depends(get_db)):
    db_school = db.query(models.School).filter(models.School.id == school_id).first()
    if not db_school:
        raise HTTPException(
            status_code=404, detail=f"Okul id si {school_id} olan bir okul bulunamadı."
        )
    if school_rate < 1 or school_rate > 10:
        raise HTTPException(status_code=400, detail="Rate 1 ile 10 arasında olmalı.")

    db_school.rate = school_rate
    db.commit()
    db.refresh(db_school)
    return db_school


@router.put("/edit/{school_id}", response_model=schemas.School)
def edit_school(
    school_id: UUID4, school: schemas.SchoolBase, db: Session = Depends(get_db)
):
    # Fetch the school record from the database
    db_school = (
        db.query(models.School).filter(models.School.user_id == school_id).first()
    )
    if not db_school:
        raise HTTPException(
            status_code=404, detail=f"Bu id({school_id}) ile bir school bulunamadı."
        )

    # Update other school fields
    for key, value in school.dict(exclude={"notes"}, exclude_unset=True).items():
        setattr(db_school, key, value)

    # Handle notes update
    if school.notes:
        for note in school.notes:
            # If the note already exists, update it
            db_note = db.query(models.Note).filter(models.Note.id == note.id).first()
            if db_note:
                db_note.content = note.content
                db_note.created_at = note.created_at
            else:
                new_note = models.Note(
                    content=note.content,
                    created_at=note.created_at or datetime.datetime.utcnow(),
                    school_id=db_school.id,
                )
                db.add(new_note)

    db.commit()  # Save all changes
    db.refresh(db_school)  # Refresh the school to reflect updates
    logging.debug(f"School with id {school_id} has been updated, including notes.")
    return db_school


# Add a new note
@router.post("/{school_id}/add_note", response_model=schemas.Note)
def add_note(school_id: int, note: schemas.NoteCreate, db: Session = Depends(get_db)):
    db_school = db.query(models.School).filter(models.School.id == school_id).first()
    if not db_school:
        raise HTTPException(status_code=404, detail="Okul bulunamadı")

    db_note = models.Note(content=note.content, school_id=school_id)
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note


# Fetch notes for a school
@router.get("/{school_id}/fetch_notes", response_model=List[schemas.Note])
def fetch_notes(school_id: int, db: Session = Depends(get_db)):
    notes = db.query(models.Note).filter(models.Note.school_id == school_id).all()
    return notes


# Delete a note
@router.delete("/delete_node/notes/{note_id}", response_model=schemas.Note)
def delete_note(note_id: int, db: Session = Depends(get_db)):
    db_note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Not bulunamadı")

    db.delete(db_note)
    db.commit()
    return db_note
