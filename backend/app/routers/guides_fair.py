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


# request guideness
# assign guides to specific fairs,
# NOTE turns assign's status to 'REQUESTED'. NOTE REMEMBER status can only take "REQUESTED" or "NONE"
@router.post("/request_guideness/{guide_id}/{fair_id}", response_model=schemas.GuideFair)
def request_guideness(guide_id: UUID4, fair_id: int, db: Session = Depends(get_db)):
    # check if guide exists
    db_guide = db.query(models.Guide).filter(models.Guide.user_id == guide_id).first()
    if not db_guide:
        raise HTTPException(
            status_code=404, detail="Verilen guide_id ile bir rehber bulunamadı."
        )
    # check if fair exists
    db_fair = db.query(models.Fair).filter(models.Fair.id == fair_id).first()
    if not db_fair:
        raise HTTPException(
            status_code=404, detail="Verilen fair_id ile bir tur bulunamadı." # 400 = bad request, 404 not fount
        )    
    # check if the guide has already been assigned, or requested to the task
    # db_guidefair = db.query(models.GuideFair).filter(models.GuideFair.guide_id == guide_id, models.GuideFair.fair_id == fair_id).first()

    db_guidefair = db.query(models.GuideFair).filter(
        models.GuideFair.guide_id == guide_id,
        models.GuideFair.fair_id == fair_id
    ).first()
    # zaten request atmışsa
    if db_guidefair and (db_guidefair.status == "REQUESTED"):
    # if guide_has_fair:
        raise HTTPException(
            status_code=409, detail=f"Bu rehber (id = {guide_id}) bu tura (id = {fair_id}) zaten request vermiş." # 409 = conflict
        )
    # tur zaten işleme alınmışsa, ret ya da onay almışsa yani.
    if (db_fair.confirmation != "BTO ONAY"): # tur 'PENDING' değilse adviser zaten işlemiş demektir, guide a açık değildir.
        raise HTTPException(
            status_code=409, detail=f"Bu tur (id = {fair_id})  istek atmaya açık değil, durumu {db_fair.confirmation}" # 409 = conflict
        )      
    # if eveything works correctly, now we can assign the guide to the fair (add these values to the GuideFair)
    new_request = models.GuideFair(guide_id = guide_id,fair_id =fair_id, status = "REQUESTED") 

    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    return new_request

# TODO cancel a guide's assigned fair
@router.delete("/cancel_guides_assigned_fair/{guide_id}/{fair_id}")
def cancel_assigned_fair(guide_id: UUID4, fair_id: int, db: Session = Depends(get_db)):
    # check if guide exists
    db_guide = db.query(models.Guide).filter(models.Guide.user_id == guide_id).first()
    if not db_guide:
        raise HTTPException(
            status_code=404, detail=f"Verilen guide_id (id = {guide_id}) ile bir rehber bulunamadı."
        )  
    # check if fair exists
    db_fair = db.query(models.Fair).filter(models.Fair.id == fair_id).first()
    if not db_fair:
        raise HTTPException(
            status_code=404, detail=f"Verilen fair_id (id = {fair_id}) ile bir tur bulunamadı."
        )
    # find the guide-fair assignment
    db_guidefair = db.query(models.GuideFair).filter(
        models.GuideFair.guide_id == guide_id, 
        models.GuideFair.fair_id == fair_id
    ).first()
    
    if not db_guidefair or db_guidefair.status != "ASSIGNED":
        raise HTTPException(
            status_code=404, detail=f"Rehber (id = {guide_id}) için bu tur (id = {fair_id}) atanmış değil."
        )
    
    # delete the guide-fair assignment from the table
    db.delete(db_guidefair)
    db.commit()
    
    return {"detail": "Atama başarıyla iptal edildi."}


# TODO cancel a guide's requested fair
@router.delete("/cancel_guides_requested_fair/{guide_id}/{fair_id}")
def cancel_requested_fair(guide_id: UUID4, fair_id: int, db: Session = Depends(get_db)):
    # check if guide exists
    db_guide = db.query(models.Guide).filter(models.Guide.user_id == guide_id).first()
    if not db_guide:
        raise HTTPException(
            status_code=404, detail=f"Verilen guide_id (id = {guide_id}) ile bir rehber bulunamadı."
        )  
    # check if fair exists
    db_fair = db.query(models.Fair).filter(models.Fair.id == fair_id).first()
    if not db_fair:
        raise HTTPException(
            status_code=404, detail=f"Verilen fair_id (id = {fair_id}) ile bir tur bulunamadı."
        )
    # find the guide-fair request
    db_guidefair = db.query(models.GuideFair).filter(
        models.GuideFair.guide_id == guide_id, 
        models.GuideFair.fair_id == fair_id
    ).first()
    
    if not db_guidefair or db_guidefair.status != "REQUESTED":
        raise HTTPException(
            status_code=404, detail=f"Rehber (id = {guide_id}) için bu tur (id = {fair_id}) talep edilmemiş."
        )
    
    # delete the guide-fair request from the table
    db.delete(db_guidefair)
    db.commit()
    
    return {"detail": "Tur talebi başarıyla iptal edildi."}


# assign guides to specific fairs,
# NOTE turns assign's status to 'ASSIGNED'. NOTE REMEMBER status can only take "REQUESTED" or "NONE"
@router.post("/assign_guide/{guide_id}/{fair_id}", response_model=schemas.GuideFair)
def assign_guides(guide_id: UUID4, fair_id: int, db: Session = Depends(get_db)):
    #check if guide exists
    db_guide = db.query(models.Guide).filter(models.Guide.user_id == guide_id).first()
    if not db_guide:
        raise HTTPException(
            status_code=404, detail="Verilen guide_id ile bir rehber bulunamadı."
        )
    #check if fair exists
    db_fair = db.query(models.Fair).filter(models.Fair.id == fair_id).first()
    if not db_fair:
        raise HTTPException(
            status_code=404, detail="Verilen fair_id ile bir tur bulunamadı." # 400 = bad request, 404 not fount
        )    
    #check if the guide has already been assigned to the task 
    db_guidefair = db.query(models.GuideFair).filter(models.GuideFair.guide_id == guide_id,models.GuideFair.fair_id == fair_id).first()
    if db_guidefair and (db_guidefair.status == "ASSIGNED"): # guide-fair zaten varsa ve 'ASSIGNED' sa hata vermeli. NOTE : eğer 'REQUESTED' sa gerek yok, 
        raise HTTPException(
            status_code=409, detail="Bu rehbere bu tur zaten verilmiş." # 409 = conflict
        )
    
     # If guide-fair status is REQUESTED, update it to ASSIGNED
    if db_guidefair and db_guidefair.status == "REQUESTED":
        db_guidefair.status = "ASSIGNED"
        db.commit()
        db.refresh(db_guidefair)
        return db_guidefair
    
    # if eveything works correctly, now we can assign the guide to the fair (add these values to the GuideFair)
    new_assign = models.GuideFair(guide_id = guide_id,fair_id =fair_id, status = "ASSIGNED") 
    
        
    db.add(new_assign)
    db.commit()
    db.refresh(new_assign)
    
    # Assign'landıktan sonra kalan bütün requestleri silsek daha mı iyi olur? ---HAYIR ÇALIŞMAZ !!
    # db.query(models.GuideFair).filter(
    #     models.GuideFair.fair_id == fair_id,
    #     models.GuideFair.status == "REQUESTED",
    #     models.GuideFair.guide_id != guide_id  # Exclude the current guide
    # ).delete()
    
    db.commit() 
    return new_assign


# TODO show guide assigns
# gets the pairs with guide_id AND "ASSIGNED" status in GuideFair table.
@router.get("/show_guide_assigns/{guide_id}/", response_model=List[schemas.Fair])
def show_assigned_guides(guide_id: UUID4, db: Session = Depends(get_db)):
    #check if guide exists
    db_guide = db.query(models.Guide).filter(models.Guide.user_id == guide_id).first()
    if not db_guide:
        raise HTTPException(
            status_code=404, detail=f"Verilen guide_id (id = {guide_id}) ile bir rehber bulunamadı."
        )  
    # get the guide's fairs
    db_fairs = db.query(models.Fair).join(models.GuideFair).filter(models.GuideFair.guide_id == guide_id,models.GuideFair.status== "ASSIGNED").all()
    # empty listse log gönderiyoruz
    if not db_fairs:
        logging.debug(f"guide with id = {guide_id} has NO ASSIGNED fairs.")
    # if we find the (guide-fair) then we are good to go :) return the assignments
    return db_fairs


# ON IT
# TODO show guide requests
# gets the pairs with guide_id AND "REQUESTED" status in GuideFair table.
@router.get("/show_guide_requests/{guide_id}/", response_model=List[schemas.Fair])
def show_guide_requests(guide_id: UUID4, db: Session = Depends(get_db)):
    #check if guide exists
    db_guide = db.query(models.Guide).filter(models.Guide.user_id == guide_id).first()
    if not db_guide:
        raise HTTPException(
            status_code=404, detail=f"Verilen guide_id (id = {guide_id}) ile bir rehber bulunamadı."
        )  
    # get the guide's fairs
    db_fairs = db.query(models.Fair).join(models.GuideFair).filter(models.GuideFair.guide_id == guide_id,models.GuideFair.status== "REQUESTED").all()
    # empty listse log gönderiyoruz
    if not db_fairs:
        logging.debug(f"guide with id = {guide_id} has NO REQUESTED fairs.")
    # if we find the (guide-fair) then we are good to go :) return the assignments
    return db_fairs


# TODO show UPCOMING (Guide-Fair) Combinations
# guides UPCOMING fairs
@router.get("/upcoming_fairs/{guide_id}/", response_model=List[schemas.Fair])
def upcoming_fairs(guide_id: UUID4, db: Session = Depends(get_db)):
    #şu anki zamanı aldık
    current_datetime = datetime.now()
    
    #check if guide exists
    db_guide = db.query(models.Guide).filter(models.Guide.user_id == guide_id).first()
    if not db_guide:
        raise HTTPException(
            status_code=404, detail=f"Verilen guide_id (id = {guide_id}) ile bir rehber bulunamadı."
        )  
    # sadece gelecekteki turları alıyoruz  : NOTE (models.Fair.date > current_datetime)
    upcoming_fairs = (
        db.query(models.Fair)
        .join(models.GuideFair)
        .filter(models.GuideFair.guide_id == guide_id,models.GuideFair.status == "ASSIGNED", models.Fair.date > current_datetime)
        .all()
    )
    # empty listse log gönderiyoruz
    if not upcoming_fairs:
        logging.debug(f"guide with id = {guide_id} has no future fairs.")
    # if we find the (guide-fair) then we are good to go :) return the assignments
    return upcoming_fairs

# TODO show PAST  (Guide-Fair) Combinations
# guides UPCOMING fairs
@router.get("/past_fairs/{guide_id}/", response_model=List[schemas.Fair])
def past_fairs(guide_id: UUID4, db: Session = Depends(get_db)):
    #şu anki zamanı aldık
    current_datetime = datetime.now()
    
    #check if guide exists
    db_guide = db.query(models.Guide).filter(models.Guide.user_id == guide_id).first()
    if not db_guide:
        raise HTTPException(
            status_code=404, detail=f"Verilen guide_id (id = {guide_id}) ile bir rehber bulunamadı."
        )  
    # sadece gelecekteki turları alıyoruz  : NOTE (models.Fair.date > current_datetime)
    upcoming_fairs = (
        db.query(models.Fair)
        .join(models.GuideFair)
        .filter(models.GuideFair.guide_id == guide_id,models.GuideFair.status == "ASSIGNED", models.Fair.date < current_datetime)
        .all()
    )
    # empty listse log gönderiyoruz
    if not upcoming_fairs:
        logging.debug(f"guide with id = {guide_id} has no past fairs.")
    # if we find the (guide-fair) then we are good to go :) return the assignments
    return upcoming_fairs


# guides all fairs
@router.get("/all/{guide_id}/", response_model=List[schemas.Fair])
def show_guide_all_fairs(guide_id: UUID4, db: Session = Depends(get_db)):
    #check if guide exists
    db_guide = db.query(models.Guide).filter(models.Guide.user_id == guide_id).first()
    if not db_guide:
        raise HTTPException(
            status_code=404, detail=f"Verilen guide_id (id = {guide_id}) ile bir rehber bulunamadı."
        )  
    # get the guide's all fairs
    db_fair = db.query(models.Fair).join(models.GuideFair).filter(models.GuideFair.guide_id == guide_id).all()
    # empty listse log gönderiyoruz
    if not db_fair:
        logging.debug(f"guide with id = {guide_id} has no associated fairs.")
    # if we find the (guide-fair) then we are good to go :) return the assignments
    return db_fair


# TODO
@router.get("/guides_fairs/{guide_id}/", response_model=List[schemas.GuideFair])
def show_all_guide_fairs(guide_id: UUID4, db: Session = Depends(get_db)):
    # Check if guide exists
    db_guide = db.query(models.Guide).filter(models.Guide.user_id == guide_id).first()
    if not db_guide:
        raise HTTPException(
            status_code=404, detail=f"Verilen guide_id (id = {guide_id}) ile bir rehber bulunamadı."
        )  
    
    # Get the guide's all fairs
    db_guidefair = db.query(models.GuideFair).filter(models.GuideFair.guide_id == guide_id).all()
    
    # Log if no associated fairs are found
    if not db_guidefair:
        logging.info(f"Guide with id = {guide_id} has no associated fairs.")
    
    # Return the guide-fair assignments
    return db_guidefair


# TODO show a specific (Guide-Fair) with given id
# ON IT
@router.get("/show/{guide_id}/{fair_id}", response_model=schemas.GuideFair)
def show_one_fair(guide_id: UUID4, fair_id: int, db: Session = Depends(get_db)):
    #check if guide exists
    db_guide = db.query(models.Guide).filter(models.Guide.user_id == guide_id).first()
    if not db_guide:
        raise HTTPException(
            status_code=404, detail=f"Verilen guide_id (id = {guide_id}) ile bir rehber bulunamadı."
        )  
        
    #get the fair
    db_fair = db.query(models.Fair).filter(models.Fair.id == fair_id).first()
    if not db_fair:
        raise HTTPException(
            status_code=404, detail=f"Verilen fair_id (id = {fair_id}) ile bir tur bulunamadı."
        )      
    # get the guide's all fairs
    db_guidefair = db.query(models.GuideFair).filter(models.GuideFair.guide_id == guide_id,models.GuideFair.fair_id == fair_id ).first()
    # empty listse log gönderiyoruz
    if not db_guidefair:
        logging.debug(f"guide with id = {guide_id} has no associated fairs.")
    # if we find the (guide-fair) then we are good to go :) return the assignments
    return db_guidefair


# get all
@router.get("/all", response_model=List[schemas.GuideFair])
def show_all_fairs(db: Session = Depends(get_db)):
    db_fairs = db.query(models.GuideFair).all()
    return db_fairs
