from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
import app.db.models as models
from app.deps import get_db
import app.schemas as schemas
from app.utils import hash_password
from pydantic import UUID4
from typing import List
from app.utils import sendEmail
# used for reminding a return of empty list etc
import logging
# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')


router = APIRouter()
# NOTE : THIS FILE MIGHT BE THE MOST IMPORTANT OUT OF ALL ROUTERS.
# NOTE : Adminler sudo/accept çağırırsa direk onay/ ret atabiliyor, admin/accept çağırırsa adviser onayı gerekiyor.
# Bunu şu yüzden yaptım, admin önce gelcek basacak bi tura onaya mesela (düz admin/accept kullanıp) "adviser henüz kabul etmemiş onaylamak istiyor musunuz" dedikten sonra evet derse "SUDO" kullanmış olacak


# ERROR RESOLVED (multiple requests for the same timestamp from the same highschool are not possible nows)
# send fair request
# TODO
@router.post("/send_fair_request/", response_model=schemas.Fair)
def send_fair_request(fair: schemas.FairCreate, db: Session = Depends(get_db)):

    db_fairs = db.query(models.Fair).filter(models.Fair.high_school_name == fair.high_school_name, models.Fair.date == fair.date).first()
    if db_fairs:
        raise HTTPException(status_code=400, detail=f"Böyle bir tur zaten var, muhtemelen duplicate form atılmış.")

    db_school = (
        db.query(models.School)
        .filter(
            models.School.school_name == fair.high_school_name
        )
        .first()
    )

    if db_school is None:
        raise HTTPException(status_code=400, detail="Okul bulunamadı")

    current_date = datetime.now()
    if fair.date < current_date + timedelta(weeks=2):
        raise HTTPException(status_code=400, detail="Tur tarihi, formun gönderildiği tarihten en az 2 hafta sonra olmalıdır.")

    # Prepare the fair data without duplicating `high_school_name`
    fair_data = fair.dict()
    fair_data["school_email"] = db_school.email
    fair_data["high_school_name"] = db_school.school_name

    # Create a new Fair instance
    new_fair = models.Fair(**fair_data)

    db.add(new_fair)
    db.commit()
    db.refresh(new_fair)
    return new_fair


# ADVISER accept fair request
# TESTED
# fairların default confirmation ı "PENDING" , adviser BTO ONAY ya da BTO RET yapıyor
# adviser accept, reject ve sonra Dilek Hoca accept reject edebiliyor, bunlara göre confirmation state değişiyor 4 tane metod ediyor her biri için
@router.post("/advisor/accept_fair/{fair_id}", response_model=schemas.Fair)
def adviser_accept_form(fair_id: int, feedback: str, db: Session = Depends(get_db)):
    # get the form  with id
    db_fair = db.query(models.Fair).filter(models.Fair.id == fair_id).first()
    #if form not found, throw error
    if not db_fair:
        raise HTTPException(status_code=400, detail=f'id\'si = {fair_id} olan tur bulunamadı.')
    #if form is already confirmed or passed throw error
    if db_fair.confirmation != "PENDING": # error prone
        raise HTTPException(status_code=400, detail="Tur daha önceden değerlendirilmiş")
    #TODO > 60 sa error 
     
    # adviser accepts the form.
    db_fair.confirmation = "BTO ONAY"
    db_fair.feedback = feedback
     # Commit the changes to the database
    try:
        db.commit()
        db.refresh(db_fair)  
    except Exception as e:
        db.rollback()  # Roll back the session in case of an error
        raise HTTPException(status_code=500, detail="Tur onaylama işlemi başarısız oldu")

    
    return db_fair


# ADVISER reject fair request
# TESTED
# yukarıdakine baya benziyor sadece confirmation BTO RET oluyor
@router.post("/advisor/reject_fair/{fair_id}", response_model=schemas.Fair)
def adviser_reject_form(fair_id: int, feedback: str, db: Session = Depends(get_db)):
    # get the form  with id
    db_fair = db.query(models.Fair).filter(models.Fair.id == fair_id).first()
    # if form not found, throw error
    if not db_fair:
        raise HTTPException(status_code=400, detail=f'id\'si = {fair_id} olan tur bulunamadı.')
    # if form is already confirmed or passed throw error
    if db_fair.confirmation != "PENDING": # error prone
        raise HTTPException(status_code=400, detail="Tur daha önceden değerlendirilmiş")

    # adviser rejects the form.
    db_fair.confirmation = "BTO RET"
    db_fair.feedback = feedback

    # commit the changes to the database
    try:
        db.commit()
        db.refresh(db_fair)  
    except Exception as e:
        db.rollback()  # Roll back the session in case of an error
        raise HTTPException(status_code=500, detail="Tur ret işlemi başarısız oldu")
    
    receiver_email = db_fair.school_email
    feedback = db_fair.feedback
    # Send the email
    message = (
        f"Üzülerek bildiririz ki, fuar başvurunuz \"{feedback}\" nedeniyle reddedilmiştir. "
        "Lütfen formu gözden geçirin ve tekrar deneyin.\n\n"
        "İyi Günler Dileriz,\nBilkent Tanıtım Ofisi"
    )

    # Send the email
    sendEmail(
        subject="Bilkent Fuar Başvuru Güncellemesi",
        message=message,  # Ensure this is a string
        receiver_email=receiver_email
    )

    return db_fair


# ADMIN accept fair request
# TESTED
@router.post("/admin/accept_fair/{fair_id}", response_model=schemas.Fair)
def accept_fair(
    fair_id: int, feedback: str, db: Session = Depends(get_db)
):
    # get the form  with id
    db_fair = db.query(models.Fair).filter(models.Fair.id == fair_id).first()
    # if form not found, throw error
    if not db_fair:
        raise HTTPException(
            status_code=400, detail=f"id'si = {fair_id} olan tur bulunamadı."
        )
    # if form is already confirmed or passed throw error
    if db_fair.confirmation != "BTO ONAY": # error prone
        raise HTTPException(status_code=400, detail="Turu adviser onaylamamış, ya da daha önce bir admin değerlendirmiş")

    # ADMIN accepts the form.
    db_fair.confirmation = "ONAY"
    db_fair.feedback = feedback
    # Commit the changes to the database
    try:
        db.commit()
        db.refresh(db_fair)  
    except Exception as e:
        db.rollback()  # Roll back the session in case of an error
        raise HTTPException(status_code=500, detail="Tur onaylama işlemi başarısız oldu")

    receiver_email = db_fair.school_email

    
    # Send the email
    sendEmail(
        subject="Bilkent Fuar Başvuru Güncellemesi",
        message="Bilkent fuar başvurunuz kabul edilmiştir, detaylara websitesi üzerinden ulaşabilirsiniz.\n\nİyi Günler Dileriz,\nBilkent Tanıtım Ofisi",
        receiver_email=receiver_email
    )


   
    
    return db_fair


# TODO ADMIN reject fair request
# TESTED
@router.post("/admin/reject_fair/{fair_id}", response_model=schemas.Fair)
def reject_fair(fair_id: int, feedback: str, db: Session = Depends(get_db)):
    # get the form  with id
    db_fair = db.query(models.Fair).filter(models.Fair.id == fair_id).first()
    # if form not found, throw error
    if not db_fair:
        raise HTTPException(status_code=400, detail=f'id\'si = {fair_id} olan tur bulunamadı.')
    # if form is already confirmed or passed, throw error
    if db_fair.confirmation != "BTO RET" and db_fair.confirmation != "BTO ONAY": # both BTO RET and BTO ONAY are acceptable.
        raise HTTPException(status_code=400, detail="Turu adviser değerlendirmemiş, ya da daha önce bir admin değerlendirmiş.")

    # ADMIN rejects the form.
    db_fair.confirmation = "RET"
    db_fair.feedback = feedback
    # Commit the changes to the database
    try:
        db.commit()
        db.refresh(db_fair)  
    except Exception as e:
        db.rollback()  # Roll back the session in case of an error
        logging.error(f"Error while rejecting fair: {e}")
        raise HTTPException(status_code=500, detail="Tur onaylama işlemi başarısız oldu")

    logging.info(f"Fair with ID {fair_id} rejected successfully.")

    receiver_email = db_fair.school_email
    feedback = db_fair.feedback
    # Send the email
    message = (
        f"Üzülerek bildiririz ki, fuar başvurunuz \"{feedback}\" nedeniyle reddedilmiştir. "
        "Lütfen formu gözden geçirin ve tekrar deneyin.\n\n"
        "İyi Günler Dileriz,\nBilkent Tanıtım Ofisi"
    )

    # Send the email
    sendEmail(
        subject="Bilkent Fuar Başvuru Güncellemesi",
        message=message,  # Ensure this is a string
        receiver_email=receiver_email
    )

    return db_fair


#  SUDO ACCEPT FAIRS
#  TESTED
@router.post("/sudo/accept_fair/{fair_id}", response_model=schemas.Fair)
def sudo_accept_fair(fair_id: int, feedback: str , db: Session = Depends(get_db)):
    # get the form  with id
    db_fair = db.query(models.Fair).filter(models.Fair.id == fair_id).first()
    # if form not found, throw error
    if not db_fair:
        raise HTTPException(
            status_code=400, detail=f"id'si = {fair_id} olan tur bulunamadı."
        )
    # if form is already confirmed or passed throw error
    # DO IT ANYWAY

    # ADMIN accepts the form.
    db_fair.confirmation = "ONAY"
    db_fair.feedback = feedback
    # Commit the changes to the database
    try:
        db.commit()
        db.refresh(db_fair)  
    except Exception as e:
        db.rollback()  # Roll back the session in case of an error
        raise HTTPException(status_code=500, detail="Tur onaylama işlemi başarısız oldu")

    receiver_email = db_fair.school_email
    # Send the email
    sendEmail(
        subject="Bilkent Fuar Başvuru Güncellemesi",
        message="Bilkent fuar başvurunuz kabul edilmiştir, detaylara websitesi üzerinden ulaşabilirsiniz.\n\nİyi Günler Dileriz,\nBilkent Tanıtım Ofisi",
        receiver_email=receiver_email
    )
    return db_fair

# SUDO REJECT
# TESTED
@router.post("/sudo/reject_fair/{fair_id}", response_model=schemas.Fair)
def sudo_reject_fair(fair_id: int, feedback: str, db: Session = Depends(get_db)):
    # get the form  with id
    db_fair = db.query(models.Fair).filter(models.Fair.id == fair_id).first()
    # if form not found, throw error
    if not db_fair:
        raise HTTPException(status_code=400, detail=f'id\'si = {fair_id} olan tur bulunamadı.')
    # if form is already confirmed or passed throw error
    # SUDO -> DO IT ANYWAY

    # ADMIN REJECTS the form.
    db_fair.confirmation = "RET"
    db_fair.feedback = feedback
    # Commit the changes to the database
    try:
        db.commit()
        db.refresh(db_fair)  
    except Exception as e:
        db.rollback()  # Roll back the session in case of an error
        raise HTTPException(status_code=500, detail="Tur onaylama işlemi başarısız oldu")
    
    receiver_email = db_fair.school_email
    feedback = db_fair.feedback
    # Send the email
    message = (
        f"Üzülerek bildiririz ki, fuar başvurunuz \"{feedback}\" nedeniyle reddedilmiştir. "
        "Lütfen formu gözden geçirin ve tekrar deneyin.\n\n"
        "İyi Günler Dileriz,\nBilkent Tanıtım Ofisi"
    )

    # Send the email
    sendEmail(
        subject="Bilkent Fuar Başvuru Güncellemesi",
        message=message,  # Ensure this is a string
        receiver_email=receiver_email
    )

    return db_fair


""" already exists in guides_fair.py 
 #show guide fairs
 #see the guides's own fairs, returns [] if not found
@router.get("/show_guide_fairs/{guide_id}", response_model=List[schemas.Fair])
def show_guide_fairs(guide_id: UUID4, db: Session = Depends(get_db)):
    # we get all the fair ids from the junction table.
    db_fairs = (
        db.query(models.GuideFair.fair_id)
        .filter(models.GuideFair.guide_id == guide_id)
        .all()
    )
    # check if anything exists
    if not db_fairs:
        logging.debug("see own fairs is empty")
        return []  # => maybe we can return "Burada henüz bir şey yok."
        # raise HTTPException(status_code=401, detail="Verilen guide_id ile eşleşen bir tane bile fair bulunamadı. :)")
    # we need to convert the fair_ids into fairs from Fairs :) right now fairs look like this => [(1,), (2,), (3,)]
    fair_ids = [fair_id[0] for fair_id in db_fairs]  # [1,2,3]
    # now select the fairs with corresponding fair_ids
    fairs = db.query(models.Fair).filter(models.Fair.id.in_(fair_ids)).all()
    return fairs

 """
# show all
# TESTED
# see the guides's own fairs, returns [] if not found
@router.get("/all/", response_model=List[schemas.Fair])
def show_all_fairs( db: Session = Depends(get_db)):
    # we get all the fair ids from the junction table.
    db_fairs = (
        db.query(models.Fair)
        .all()
    )
    # check if anything exists
    if not db_fairs:
        logging.debug("see own fairs is empty")  # => maybe we can return "Burada henüz bir şey yok."
    return db_fairs

# TESTED
# see the guides's own fairs, returns [] if not found
@router.get("/show/{fair_id}", response_model=schemas.Fair)
def show_one_fair( fair_id: int, db: Session = Depends(get_db)):
    db_fair = (
        db.query(models.Fair).filter(models.Fair.id == fair_id)
        .first()
    )
    # check if anything exists
    if not db_fair:
        logging.debug("fair is not found")  # => maybe we can return "Burada henüz bir şey yok."
        raise HTTPException(status_code=404, detail=f"Verilen fair_id ={fair_id} ile eşleşen bir fair bulunamadı.")
    return db_fair

# TESTED
# NOTE  Call this function with 'date' specified! Otherwise will throw e
# see the guides's own fairs, returns [] if not found
@router.patch("/edit/{fair_id}", response_model=schemas.Fair)
def edit_fair( fair_id: int, fair: schemas.FairBase, db: Session = Depends(get_db)):
    # find the fair
    db_fair = db.query(models.Fair).filter(models.Fair.id == fair_id).first()
    # check if anything exists
    if not db_fair:
        logging.debug("fair is not found")  # => maybe we can return "Burada henüz bir şey yok."
        raise HTTPException(status_code=404, detail=f"Verilen fair_id ={fair_id} ile eşleşen bir fair bulunamadı.")
    for key, value in fair.dict(exclude_unset=True).items():
        setattr(db_fair, key, value)

    # Commit the changes to the database
    try:
        db.commit()
        db.refresh(db_fair)
    except Exception as e:
        db.rollback()  # Roll back the session in case of an error
        logging.error(f"Error while updating fair: {e}")
        raise HTTPException(status_code=500, detail="Failed to update the fair.")

    logging.info(f"Fair with ID {fair_id} updated successfully.")
    return db_fair


@router.get("/all/accepted/", response_model=List[schemas.Fair])
def show_all_fairs2(db: Session = Depends(get_db)):
    db_fairs = db.query(models.Fair).filter(models.Fair.confirmation == "ONAY").all()
    # check if anything exists
    if not db_fairs:
        logging.debug(
            "see own fairs is empty"
        )  # => maybe we can return "Burada henüz bir şey yok."
    return db_fairs


@router.get(
    "/all/accepted_school/{high_school_name}", response_model=List[schemas.Fair]
)
def show_all_fairs3(high_school_name: str, db: Session = Depends(get_db)):
    db_fairs = (
        db.query(models.Fair)
        .filter(models.Fair.confirmation == "ONAY")
        .filter(models.Fair.high_school_name == high_school_name)
        .all()
    )
    # check if anything exists
    if not db_fairs:
        logging.debug(
            "see own fairs is empty"
        )  # => maybe we can return "Burada henüz bir şey yok."
    return db_fairs