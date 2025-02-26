from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from .base import Base
import os
import uuid
from uuid import uuid4
from dotenv import load_dotenv
from .models import (
    Tour,
    Advisor,
    Guide,
    GuideTour,
    User,
    School,
    Fair,
    Admin,
    Notification,
    GuideFair
)
from datetime import datetime

load_dotenv()
DATABASE_URL = f"postgresql://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}@{os.getenv('POSTGRES_HOST')}:{os.getenv('DOCKER_POSTGRES_PORT')}/{os.getenv('POSTGRES_DATABASE')}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db():
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()

    users = [
        User(
            id=uuid.uuid4(),
            username="asd",
            password="$2y$10$XhRBIvINLngVwpV1qi51UeWEky1T4wq2omqDovUnj9oZOtl7eUVJe",
        ),  # 0
        User(id=uuid.uuid4(), username="furkan", password="asd"),  # 1
        User(id=uuid.uuid4(), username="sumeyyhe", password="asd"),  # 2
        User(
            id=uuid.uuid4(),
            username="bireykoleji@birey.com",
            password="$2y$10$XhRBIvINLngVwpV1qi51UeWEky1T4wq2omqDovUnj9oZOtl7eUVJe",
        ),  # 3
        User(id=uuid.uuid4(), username="fen@çağlayan.com", password="password123"),  # 4
        User(
            id=uuid.uuid4(), username="kucukcalik@gmail.com", password="password123"
        ),  # 5
        User(id=uuid.uuid4(), username="ankara@ted.com", password="password123"),  # 6
        User(id=uuid.uuid4(), username="izmir@final.com", password="password123"),  # 7
        User(
            id=uuid.uuid4(), username="antalya@bahcesehir.edu", password="password123"
        ),  # 8
        User(
            id=uuid.uuid4(), username="trabzon@dogakoleji.com", password="password123"
        ),  # 9
        User(
            id=uuid.uuid4(),
            username="istanbul@enkaokullari.com",
            password="password123",
        ),  # 10
        User(
            id=uuid.uuid4(), username="saintjoseph@fsl.com", password="password123"
        ),  # 11
        User(
            id=uuid.uuid4(), username="eryaman@ozelfen.com", password="password123"
        ),  # 12
        User(
            id=uuid.uuid4(),
            username="ahmet.yilmaz@ug.bilkent.edu.tr",
            password="$2y$10$XhRBIvINLngVwpV1qi51UeWEky1T4wq2omqDovUnj9oZOtl7eUVJe",
        ),  # 13
        User(
            id=uuid.uuid4(),
            username="sumeyye.kaya@ug.bilkent.edu.tr",
            password="$2y$10$XhRBIvINLngVwpV1qi51UeWEky1T4wq2omqDovUnj9oZOtl7eUVJe",
        ),  # 14
        User(
            id=uuid.uuid4(),
            username="ali.demir@ug.bilkent.edu.tr",
            password="$2y$10$XhRBIvINLngVwpV1qi51UeWEky1T4wq2omqDovUnj9oZOtl7eUVJe",
        ),  # 15
        User(
            id=uuid.uuid4(),
            username="fatma.celik@ug.bilkent.edu.tr",
            password="$2y$10$XhRBIvINLngVwpV1qi51UeWEky1T4wq2omqDovUnj9oZOtl7eUVJe",
        ),  # 16
        User(
            id=uuid.uuid4(),
            username="mehmet.yildiz@ug.bilkent.edu.tr",
            password="$2y$10$XhRBIvINLngVwpV1qi51UeWEky1T4wq2omqDovUnj9oZOtl7eUVJe",
        ),  # 17
        User(
            id=uuid.uuid4(),
            username="esra.kaya@ug.bilkent.edu.tr",
            password="password123",
        ),  # 18
        User(
            id=uuid.uuid4(),
            username="cem.yildirim@ug.bilkent.edu.tr",
            password="password123",
        ),  # 19
        User(
            id=uuid.uuid4(),
            username="nehir.demir@ug.bilkent.edu.tr",
            password="password123",
        ),  # 20
        User(
            id=uuid.uuid4(),
            username="emir.sari@ug.bilkent.edu.tr",
            password="password123",
        ),  # 21
        User(
            id=uuid.uuid4(),
            username="meral.aydin@ug.bilkent.edu.tr",
            password="password123",
        ),  # 22
        User(
            id=uuid.uuid4(),
            username="arda.yucel@ug.bilkent.edu.tr",
            password="password123",
        ),  # 23
        User(
            id=uuid.uuid4(),
            username="eylul.erdem@ug.bilkent.edu.tr",
            password="password123",
        ),  # 24
        User(
            id=uuid.uuid4(),
            username="bora.gunes@ug.bilkent.edu.tr",
            password="password123",
        ),  # 25
        User(
            id=uuid.uuid4(),
            username="dilara.uslu@ug.bilkent.edu.tr",
            password="password123",
        ),  # 26
        User(
            id=uuid.uuid4(),
            username="berk.celik@ug.bilkent.edu.tr",
            password="password123",
        ),  # 27
        User(
            id=uuid.uuid4(),
            username="selin.aksoy@ug.bilkent.edu.tr",
            password="password123",
        ),  # 28
        User(
            id=uuid.uuid4(),
            username="efe.tan@ug.bilkent.edu.tr",
            password="password123",
        ),  # 29
        User(
            id=uuid.uuid4(),
            username="aylin.gok@ug.bilkent.edu.tr",
            password="password123",
        ),  # 30
        User(
            id=uuid.uuid4(),
            username="sarp.ates@ug.bilkent.edu.tr",
            password="password123",
        ),  # 31
        User(
            id=uuid.uuid4(),
            username="eda.vural@ug.bilkent.edu.tr",
            password="password123",
        ),  # 32
        User(
            id=uuid.uuid4(),
            username="duru.sen@ug.bilkent.edu.tr",
            password="password123",
        ),  # 33
        User(
            id=uuid.uuid4(),
            username="kerem.ozkan@ug.bilkent.edu.tr",
            password="$2y$10$XhRBIvINLngVwpV1qi51UeWEky1T4wq2omqDovUnj9oZOtl7eUVJe",
        ),  # 34
        User(
            id=uuid.uuid4(),
            username="furkan.basibuyuk@ug.bilkent.edu.tr",
            password="$2y$10$XhRBIvINLngVwpV1qi51UeWEky1T4wq2omqDovUnj9oZOtl7eUVJe",
        ),  # 353
    ]
    db.add_all(users)
    db.commit()  # Commit users to the database first to satisfy foreign key constraints

    advisors = [
        Advisor(
            name="Ahmet Yılmaz",
            user_id=users[13].id,
            username="ahmet.yilmaz@ug.bilkent.edu.tr",
            iban_no="TR34 0006 2000 0001 2345 6789 02",
            profile_picture_url="https://randomuser.me/api/portraits/lego/9.jpg",
            department="MBG",
            phone="0531234567",
            responsible_day=["Monday"],
        ),
        Advisor(
            name="Sümeyye Kaya",
            user_id=users[14].id,
            username="sumeyye.kaya@ug.bilkent.edu.tr",
            iban_no="TR367 0006 2000 0001 2445 6889 12",
            profile_picture_url="profilePhoto2.png",
            department="ME",
            phone="0535675567",
            responsible_day=["Friday"],
        ),
        Advisor(
            name="Ali Demir",
            user_id=users[15].id,
            department="IE",
            iban_no="TR367 0059 2000 0001 2745 6889 12",
            username="ali.demir@ug.bilkent.edu.tr",
            profile_picture_url="https://randomuser.me/api/portraits/lego/1.jpg",
            phone="0531122334",
            responsible_day=["Tuesday"],
        ),
        Advisor(
            name="Fatma Çelik",
            user_id=users[16].id,
            department="EEE",
            iban_no="TR367 0028 2000 0007 2345 1889 12",
            profile_picture_url="profilePhoto1.png",
            username="fatma.celik@ug.bilkent.edu.tr",
            phone="0534455667",
            responsible_day=["Thursday"],
        ),
        Advisor(
            name="Mehmet Yıldız",
            user_id=users[17].id,
            department="CS",
            iban_no="TR367 0028 2000 1007 2247 4889 12",
            profile_picture_url="profilePhoto3.png",
            username="mehmet.yildiz@ug.bilkent.edu.tr",
            phone="0537788990",
            responsible_day=["Wednesday", "Saturday", "Sunday"],
        ),
    ]
    db.add_all(advisors)
    db.commit()

    admins = [
        Admin(
            name="admin",
            user_id=users[25].id,
            id=users[25].id,
            email="furkan.basibuyuk@ug.bilkent.edu.tr",
            phone="0531234567",
        ),
    ]
    db.add_all(admins)
    db.commit()

    guides = [
        Guide(
            id=users[18].id,
            user_id=users[18].id,
            name="Esra Kaya",
            department="Math",
            username="esra.kaya@ug.bilkent.edu.tr",
            available_time="10:00-18:00",
            phone="05435678901",
            profile_picture_url="https://randomuser.me/api/portraits/lego/7.jpg",
            guide_rating=9,
            tour_count=15,
            total_ratings=10,
            rating_sum=90,
            emergency_contact_name="Mehmet Ali Aksoy",
            emergency_contact_phone="05435678902",
            start_date="2023-05-15",
            isactive=True,
            end_date=None,
            iban_no="TR12 0006 2000 0001 2345 6789 01",
        ),
        Guide(
            id=users[19].id,
            user_id=users[19].id,
            name="Cem Yıldırım",
            department="Phys",
            username="cem.yildirim@ug.bilkent.edu.tr",
            tour_count=20,
            profile_picture_url="https://randomuser.me/api/portraits/lego/9.jpg",
            available_time="11:00-19:00",
            phone="05437890123",
            guide_rating=7,
            isactive=True,
            total_ratings=7,
            rating_sum=49,
            emergency_contact_name="Ahmet Burak Kılıçkaya",
            emergency_contact_phone="05437890124",
            start_date="2022-12-01",
            end_date=None,
            iban_no="TR34 0006 2000 0001 2345 6789 02",
        ),
        Guide(
            id=users[20].id,
            user_id=users[20].id,
            name="Nehir Demir",
            department="IAED",
            username="nehir.demir@ug.bilkent.edu.tr",
            tour_count=25,
            profile_picture_url="https://randomuser.me/api/portraits/lego/9.jpg",
            available_time="09:00-17:00",
            phone="05432223344",
            guide_rating=10,
            isactive=True,
            total_ratings=20,
            rating_sum=200,
            emergency_contact_name="Ali Gülbahçe",
            emergency_contact_phone="05432223345",
            start_date="2023-02-01",
            end_date=None,
            iban_no="TR56 0006 2000 0001 2345 6789 03",
        ),
        Guide(
            id=users[21].id,
            user_id=users[21].id,
            name="Emir Sarı",
            department="CS",
            username="emir.sari@ug.bilkent.edu.tr",
            tour_count=5,
            profile_picture_url="https://randomuser.me/api/portraits/lego/1.jpg",
            available_time="08:00-16:00",
            phone="05435556677",
            guide_rating=6,
            isactive=True,
            total_ratings=5,
            rating_sum=30,
            emergency_contact_name="Fatma Çelik",
            emergency_contact_phone="05435556678",
            start_date="2022-08-01",
            end_date=None,
            iban_no="TR78 0006 2000 0001 2345 6789 04",
        ),
        Guide(
            id=users[22].id,
            user_id=users[22].id,
            name="Meral Aydın",
            department="CS",
            username="meral.aydin@ug.bilkent.edu.tr",
            tour_count=30,
            available_time="10:00-18:00",
            phone="05436667788",
            guide_rating=9,
            profile_picture_url="https://randomuser.me/api/portraits/lego/9.jpg",
            isactive=True,
            total_ratings=15,
            rating_sum=135,
            emergency_contact_name="Sümeyye Acar",
            emergency_contact_phone="05436667789",
            start_date="2023-01-01",
            end_date=None,
            iban_no="TR90 0006 2000 0001 2345 6789 05",
        ),
        Guide(
            id=users[23].id,
            user_id=users[23].id,
            name="Arda Yücel",
            department="EEE",
            username="arda.yucel@ug.bilkent.edu.tr",
            tour_count=10,
            available_time="08:00-16:00",
            profile_picture_url="https://randomuser.me/api/portraits/lego/9.jpg",
            phone="05437778899",
            guide_rating=8,
            isactive=True,
            total_ratings=10,
            rating_sum=80,
            emergency_contact_name="Mehmet Can Afsuroğlu",
            emergency_contact_phone="05437778900",
            start_date="2023-03-01",
            end_date=None,
            iban_no="TR11 0006 2000 0001 2345 6789 06",
        ),
        Guide(
            id=users[24].id,
            user_id=users[24].id,
            name="Eylül Erdem",
            username="eylul.erdem@ug.bilkent.edu.tr",
            tour_count=8,
            department="LAW",
            available_time="09:00-17:00",
            phone="05438889900",
            guide_rating=7,
            isactive=True,
            profile_picture_url="https://randomuser.me/api/portraits/lego/7.jpg",
            total_ratings=8,
            rating_sum=56,
            emergency_contact_name="Ali Kutu",
            emergency_contact_phone="05438889901",
            start_date="2023-04-01",
            end_date=None,
            iban_no="TR22 0006 2000 0001 2345 6789 07",
        ),
        Guide(
            id=users[25].id,
            user_id=users[25].id,
            name="Bora Güneş",
            department="LAW",
            username="bora.gunes@ug.bilkent.edu.tr",
            profile_picture_url="https://randomuser.me/api/portraits/lego/9.jpg",
            tour_count=12,
            available_time="10:00-18:00",
            phone="05439900011",
            guide_rating=6,
            isactive=True,
            total_ratings=12,
            rating_sum=72,
            emergency_contact_name="Zeynep koçak",
            emergency_contact_phone="05439900012",
            start_date="2023-05-01",
            end_date=None,
            iban_no="TR33 0006 2000 0001 2345 6789 08",
        ),
        Guide(
            id=users[26].id,
            user_id=users[26].id,
            name="Dilara Uslu",
            profile_picture_url="https://randomuser.me/api/portraits/lego/1.jpg",
            department="LAW",
            username="dilara.uslu@ug.bilkent.edu.tr",
            tour_count=7,
            available_time="11:00-19:00",
            phone="05440011122",
            guide_rating=8,
            isactive=True,
            total_ratings=7,
            rating_sum=56,
            emergency_contact_name="Can Çelik",
            emergency_contact_phone="05440011123",
            start_date="2023-06-01",
            end_date=None,
            iban_no="TR44 0006 2000 0001 2345 6789 09",
        ),
        Guide(
            id=users[27].id,
            user_id=users[27].id,
            name="Berk Çelik",
            department="IE",
            profile_picture_url="https://randomuser.me/api/portraits/lego/2.jpg",
            username="berk.celik@ug.bilkent.edu.tr",
            tour_count=5,
            available_time="08:00-16:00",
            phone="05441122233",
            guide_rating=9,
            isactive=True,
            total_ratings=5,
            rating_sum=45,
            emergency_contact_name="Deniz Acar",
            emergency_contact_phone="05441122234",
            start_date="2023-07-01",
            end_date=None,
            iban_no="TR55 0006 2000 0001 2345 6789 10",
        ),
        Guide(
            id=users[28].id,
            user_id=users[28].id,
            name="Selin Aksoy",
            profile_picture_url="https://randomuser.me/api/portraits/lego/3.jpg",
            department="ME",
            username="selin.aksoy@ug.bilkent.edu.tr",
            tour_count=18,
            available_time="09:00-17:00",
            phone="05442233344",
            guide_rating=7,
            isactive=True,
            total_ratings=18,
            rating_sum=126,
            emergency_contact_name="Ece Başıbüyük",
            emergency_contact_phone="05442233345",
            start_date="2023-08-01",
            end_date=None,
            iban_no="TR66 0006 2000 0001 2345 6789 11",
        ),
        Guide(
            id=users[29].id,
            user_id=users[29].id,
            name="Efe Tan",
            username="efe.tan@ug.bilkent.edu.tr",
            tour_count=14,
            profile_picture_url="https://randomuser.me/api/portraits/lego/4.jpg",
            department="ME",
            available_time="10:00-18:00",
            phone="05443344455",
            guide_rating=10,
            isactive=False,
            total_ratings=14,
            rating_sum=140,
            emergency_contact_name="Murat Kara",
            emergency_contact_phone="05443344456",
            start_date="2023-09-01",
            end_date="2024-01-01",
            iban_no="TR77 0006 2000 0001 2345 6789 12",
        ),
        Guide(
            id=users[30].id,
            user_id=users[30].id,
            name="Aylin Gök",
            department="EEE",
            username="aylin.gok@ug.bilkent.edu.tr",
            tour_count=10,
            available_time="08:00-16:00",
            phone="05444455566",
            guide_rating=9,
            isactive=False,
            total_ratings=10,
            rating_sum=90,
            profile_picture_url="https://randomuser.me/api/portraits/lego/5.jpg",
            emergency_contact_name="Leyla Can",
            emergency_contact_phone="05444455567",
            start_date="2023-10-01",
            end_date="2024-02-01",
            iban_no="TR88 0006 2000 0001 2345 6789 13",
        ),
        Guide(
            id=users[31].id,
            user_id=users[31].id,
            name="Sarp Ateş",
            department="Math",
            username="sarp.ates@ug.bilkent.edu.tr",
            tour_count=8,
            available_time="09:00-17:00",
            phone="05445566677",
            profile_picture_url="https://randomuser.me/api/portraits/lego/6.jpg",
            guide_rating=6,
            isactive=False,
            total_ratings=8,
            rating_sum=48,
            emergency_contact_name="Aylin Güzel",
            emergency_contact_phone="05445566678",
            start_date="2023-11-01",
            end_date="2024-03-01",
            iban_no="TR99 0006 2000 0001 2345 6789 14",
        ),
        Guide(
            id=users[32].id,
            user_id=users[32].id,
            department="ARCH",
            name="Eda Vural",
            username="eda.vural@ug.bilkent.edu.tr",
            profile_picture_url="https://randomuser.me/api/portraits/lego/7.jpg",
            tour_count=12,
            available_time="10:00-18:00",
            phone="05446677788",
            guide_rating=7,
            isactive=False,
            total_ratings=12,
            rating_sum=84,
            emergency_contact_name="Selim Koyuncu",
            emergency_contact_phone="05446677789",
            start_date="2023-12-01",
            end_date="2024-04-01",
            iban_no="TR10 0006 2000 0001 2345 6789 15",
        ),
        Guide(
            id=users[33].id,
            user_id=users[33].id,
            department="AMER",
            name="Duru Şen",
            username="duru.sen@ug.bilkent.edu.tr",
            tour_count=6,
            available_time="08:00-16:00",
            phone="05447788899",
            guide_rating=8,
            isactive=False,
            total_ratings=6,
            profile_picture_url="https://randomuser.me/api/portraits/lego/8.jpg",
            rating_sum=48,
            emergency_contact_name="Bora Karlı",
            emergency_contact_phone="05447788900",
            start_date="2023-09-01",
            end_date="2024-05-01",
            iban_no="TR11 0006 2000 0001 2345 6789 16",
        ),
        Guide(
            id=users[34].id,
            user_id=users[34].id,
            name="Kerem Özkan",
            department="ELIT",
            username="kerem.ozkan@ug.bilkent.edu.tr",
            puantaj_check=True,
            available_time="09:00-17:00",
            phone="05431234567",
            guide_rating=8,
            total_ratings=1,
            profile_picture_url="https://randomuser.me/api/portraits/lego/6.jpg",
            rating_sum=8,
            tour_count=10,
            emergency_contact_name="Veli Kavlak",
            emergency_contact_phone="05431234568",
            start_date="2024-01-01",
            isactive=True,
            end_date=None,
            iban_no="TR12 0006 2000 0001 2345 6789 17",
        ),
    ]
    db.add_all(guides)
    db.commit()

    schools = [
        School(
            user_id=users[3].id,
            school_name="Özel Keçiören Birey Anadolu Lisesi",
            city="Ankara",
            email="bireykoleji@birey.com",  # Same as username
            profile_picture_url="https://randomuser.me/api/portraits/lego/2.jpg",
            rate=9,
            username="bireykoleji@birey.com",
            user_role="admin",
            user_phone="05431234567",
            notes=[],
        ),
        School(
            user_id=users[4].id,
            school_name="Özel Çağlayan Fen Lisesi",
            city="Ankara",
            email="fen@çağlayan.com",  # Same as username
            profile_picture_url="https://randomuser.me/api/portraits/lego/7.jpg",
            rate=8,
            username="fen@çağlayan.com",
            user_role="admin",
            user_phone="05435678901",
            notes=[],
        ),
        School(
            user_id=users[5].id,
            school_name="Nuh Mehmet Küçükçalık Anadolu Lisesi",
            profile_picture_url="https://randomuser.me/api/portraits/lego/1.jpg",
            city="Kayseri",
            email="kucukcalik@gmail.com",  # Same as username
            rate=6,
            username="kucukcalik@gmail.com",
            user_role="admin",
            user_phone="05169210123",
            notes=[],
        ),
        School(
            user_id=users[6].id,
            school_name="TED Ankara Koleji Vakfı Okulları",
            city="Ankara",
            profile_picture_url="https://randomuser.me/api/portraits/lego/2.jpg",
            email="ankara@ted.com",  # Same as username
            rate=9,
            username="ankara@ted.com",
            user_role="admin",
            user_phone="05435212231",
            notes=[],
        ),
        School(
            user_id=users[7].id,
            school_name="Final Okulları İzmir Kampüsü",
            city="İzmir",
            email="izmir@final.com",  # Same as username
            profile_picture_url="https://randomuser.me/api/portraits/lego/1.jpg",
            rate=8,
            username="izmir@final.com",
            user_role="admin",
            user_phone="05437651234",
            notes=[],
        ),
        School(
            user_id=users[8].id,
            school_name="Bahçeşehir Koleji Antalya Kampüsü",
            city="Antalya",
            email="antalya@bahcesehir.edu",  # Same as username
            rate=9,
            username="antalya@bahcesehir.edu",
            profile_picture_url="https://randomuser.me/api/portraits/lego/4.jpg",
            user_role="admin",
            user_phone="05431122334",
            notes=[],
        ),
        School(
            user_id=users[9].id,
            school_name="Doğa Koleji Trabzon Kampüsü",
            city="Trabzon",
            email="trabzon@dogakoleji.com",  # Same as username
            rate=8,
            profile_picture_url="https://randomuser.me/api/portraits/lego/6.jpg",
            username="trabzon@dogakoleji.com",
            user_role="admin",
            user_phone="05439876543",
            notes=[],
        ),
        School(
            user_id=users[10].id,
            school_name="Enka Okulları İstanbul",
            city="İstanbul",
            email="istanbul@enkaokullari.com",  # Same as username
            rate=10,
            username="istanbul@enkaokullari.com",
            profile_picture_url="https://randomuser.me/api/portraits/lego/5.jpg",
            user_role="admin",
            user_phone="05431245896",
            notes=[],
        ),
        School(
            user_id=users[11].id,
            school_name="Saint Joseph Fransız Lisesi",
            city="İstanbul",
            email="saintjoseph@fsl.com",  # Same as username
            profile_picture_url="https://randomuser.me/api/portraits/lego/1.jpg",
            rate=10,
            username="saintjoseph@fsl.com",
            user_role="admin",
            user_phone="05438765432",
            notes=[],
        ),
        School(
            user_id=users[12].id,
            school_name="Özel Eryaman Fen ve Anadolu Lisesi",
            city="Ankara",
            email="eryaman@ozelfen.com",  # Same as username
            rate=7,
            username="eryaman@ozelfen.com",
            profile_picture_url="https://randomuser.me/api/portraits/lego/7.jpg",
            user_role="admin",
            user_phone="05431234987",
            notes=[],
        ),
    ]
    db.add_all(schools)
    db.commit()

    # Dummy data for notifications with title
    notifications = [
        # Notification(
        #     user_id=users[3].id,  # Assuming you are generating UUIDs for guides
        #     title="Yeni Tur Planı",
        #     message="Yeni bir tur planlandı. Detayları panonuzdan kontrol edebilirsiniz.",
        #     seen=False,
        #     created_at=datetime.now(),
        # ),
        # Notification(
        #     user_id=users[3].id,
        #     title="Fuara Duyuru",
        #     message="Cuma günü yapılacak fuarı unutmayın. Hazırlığınızı tamamladığınızdan emin olun.",
        #     seen=True,
        #     created_at=datetime.now(),
        # ),
        # Notification(
        #     user_id=users[3].id,
        #     title="Profil Güncelleme",
        #     message="Profil bilgilerinizi başarıyla güncellediniz.",
        #     seen=False,
        #     created_at=datetime.now(),
        # ),
        # Notification(
        #     user_id=users[3].id,
        #     title="Yeni Başvuru",
        #     message="Yeni bir başvuru aldınız. Zamanınız olduğunda gözden geçirebilirsiniz.",
        #     seen=False,
        #     created_at=datetime.now(),
        # ),
        # Notification(
        #     user_id=users[3].id,
        #     title="Yeni Rehber Eklendi",
        #     message="Ekibinize yeni bir rehber eklendi. Profilini kontrol edebilirsiniz.",
        #     seen=True,
        #     created_at=datetime.now(),
        # ),
        # Notification(
        #     user_id=users[2].id,  # Assuming you are generating UUIDs for guides
        #     title="Yeni Tur Planı",
        #     message="Yeni bir tur planlandı. Detayları panonuzdan kontrol edebilirsiniz.",
        #     seen=False,
        #     created_at=datetime.now(),
        # ),
        # Notification(
        #     user_id=users[2].id,
        #     title="Fuara Duyuru",
        #     message="Cuma günü yapılacak fuarı unutmayın. Hazırlığınızı tamamladığınızdan emin olun.",
        #     seen=True,
        #     created_at=datetime.now(),
        # ),
        # Notification(
        #     user_id=users[2].id,
        #     title="Profil Güncelleme",
        #     message="Profil bilgilerinizi başarıyla güncellediniz.",
        #     seen=False,
        #     created_at=datetime.now(),
        # ),
        # Notification(
        #     user_id=users[2].id,
        #     title="Yeni Başvuru",
        #     message="Yeni bir başvuru aldınız. Zamanınız olduğunda gözden geçirebilirsiniz.",
        #     seen=False,
        #     created_at=datetime.now(),
        # ),
        # Notification(
        #     user_id=users[1].id,
        #     title="Yeni Rehber Eklendi",
        #     message="Ekibinize yeni bir rehber eklendi. Profilini kontrol edebilirsiniz.",
        #     seen=True,
        #     created_at=datetime.now(),
        # ),
        # Notification(
        #     user_id=users[1].id,  # Assuming you are generating UUIDs for guides
        #     title="Yeni Tur Planı",
        #     message="Yeni bir tur planlandı. Detayları panonuzdan kontrol edebilirsiniz.",
        #     seen=False,
        #     created_at=datetime.now(),
        # ),
        # Notification(
        #     user_id=users[1].id,
        #     title="Fuara Duyuru",
        #     message="Cuma günü yapılacak fuarı unutmayın. Hazırlığınızı tamamladığınızdan emin olun.",
        #     seen=True,
        #     created_at=datetime.now(),
        # ),
        # Notification(
        #     user_id=users[1].id,
        #     title="Profil Güncelleme",
        #     message="Profil bilgilerinizi başarıyla güncellediniz.",
        #     seen=False,
        #     created_at=datetime.now(),
        # ),
        # Notification(
        #     user_id=users[1].id,
        #     title="Yeni Başvuru",
        #     message="Yeni bir başvuru aldınız. Zamanınız olduğunda gözden geçirebilirsiniz.",
        #     seen=False,
        #     created_at=datetime.now(),
        # ),
        # Notification(
        #     user_id=users[1].id,
        #     title="Yeni Rehber Eklendi",
        #     message="Ekibinize yeni bir rehber eklendi. Profilini kontrol edebilirsiniz.",
        #     seen=True,
        #     created_at=datetime.now(),
        # ),
    ]

    # Adding notifications to the database
    db.add_all(notifications)
    db.commit()

    fairs = [
        Fair(
            confirmation="PENDING",
            date="2025-12-02 14:30:00",
            city="Ankara",
            school_id=schools[4].user_id,
            high_school_name="TED Ankara Koleji Vakfı Okulları",
            teacher_name="Ahmet Şen",
            teacher_phone_number="05435212231",
            student_count=4,
            school_email="ankara@ted.com",
        ),
        Fair(
            confirmation="PENDING",
            date="2024-12-29 13:00:00",
            city="Kayseri",
            school_id=schools[9].user_id,
            high_school_name="Özel Eryaman Fen ve Anadolu Lisesi",
            teacher_name="Zeynep Kaya",
            teacher_phone_number="05431234987",
            student_count=3,
            school_email="eryaman@ozelfen.com",
        ),
        Fair(
            confirmation="BTO ONAY",
            date="2024-12-26 11:30:00",
            city="Ankara",
            school_id=schools[2].user_id,
            high_school_name="Nuh Mehmet Küçükçalık Anadolu Lisesi",
            teacher_name="Furkan Ünlü",
            teacher_phone_number="05169210123",
            student_count=3,
            school_email="kucukcalik@gmail.com",
        ),
        Fair(
            confirmation="BTO ONAY",
            date="2025-2-25 09:45:00",
            city="Ankara",
            school_id=schools[1].user_id,
            high_school_name="Özel Çağlayan Fen Lisesi",
            teacher_name="Sümeyye Gül",
            teacher_phone_number="05435678901",
            student_count=5,
            school_email="fen@çağlayan.com",
        ),
        Fair(
            confirmation="RET",
            date="2024-12-15 10:00:00",
            city="İstanbul",
            school_id=schools[4].user_id,
            high_school_name="Final Okulları İzmir Kampüsü",
            teacher_name="Mehmet Yılmaz",
            teacher_phone_number="05437651234",
            student_count=6,
            school_email="izmir@final.com",
        ),
        Fair(
            confirmation="BTO RET",
            date="2024-12-16 14:00:00",
            city="Antalya",
            school_id=schools[5].user_id,
            high_school_name="Bahçeşehir Koleji Antalya Kampüsü",
            teacher_name="Ayşe Acar",
            teacher_phone_number="05431122334",
            student_count=7,
            school_email="antalya@bahcesehir.edu",
        ),
        Fair(
            confirmation="ONAY",
            date="2024-12-28 16:30:00",
            city="Ankara",
            school_id=schools[0].user_id,
            high_school_name="Özel Keçiören Birey Anadolu Lisesi",
            teacher_name="Ömer Faruk Ateş",
            teacher_phone_number="05431234567",
            student_count=2,
            school_email="bireykoleji@birey.com",
        ),
        Fair(
            confirmation="ONAY",
            date="2024-12-29 13:00:00",
            city="Kayseri",
            school_id=schools[7].user_id,
            high_school_name="Enka Okulları İstanbul",
            teacher_name="Ömer Kalem",
            teacher_phone_number="05786964567",
            student_count=2,
            school_email="istanbul@enkaokullari.com",
        ),
        Fair(
            confirmation="ONAY",
            date="2024-12-10 10:30:00",  # Tarihi geçmiş
            city="Trabzon",
            school_id=schools[6].user_id,
            high_school_name="Doğa Koleji Trabzon Kampüsü",
            teacher_name="Ali Demir",
            teacher_phone_number="05439876543",
            student_count=3,
            school_email="trabzon@dogakoleji.com",
        ),
        Fair(
            confirmation="ONAY",
            date="2024-11-15 14:15:00",  # Tarihi geçmiş
            city="İstanbul",
            school_id=schools[8].user_id,
            high_school_name="Saint Joseph Fransız Lisesi",
            teacher_name="Fatma Çelik",
            teacher_phone_number="05438765432",
            student_count=4,
            school_email="saintjoseph@fsl.com",
        ),
    ]

    db.add_all(fairs)
    db.commit()
    # Create some initial data for tours
    tours = [
        Tour(
            confirmation="BTO ONAY",
            date="2025-12-22 13:30:00",
            city="Ankara",
            school_id=schools[4].user_id,
            high_school_name="TED Ankara Koleji Vakfı Okulları",
            teacher_name="Ahmet Şen",
            teacher_phone_number="05435212231",
            student_count=160,
            school_email="ankara@ted.com",
        ),
        Tour(
            confirmation="BTO ONAY",
            date="2024-12-29 9:00:00",
            city="Kayseri",
            school_id=schools[9].user_id,
            high_school_name="Özel Eryaman Fen ve Anadolu Lisesi",
            teacher_name="Zeynep Kaya",
            teacher_phone_number="05431234987",
            student_count=190,
            school_email="eryaman@ozelfen.com",
        ),
        Tour(
            confirmation="PENDING",
            date="2025-01-02 11:00:00",
            city="Ankara",
            school_id=schools[2].user_id,
            high_school_name="Nuh Mehmet Küçükçalık Anadolu Lisesi",
            teacher_name="Furkan Ünlü",
            teacher_phone_number="05169210123",
            student_count=70,
            school_email="kucukcalik@gmail.com",
        ),
        Tour(
            confirmation="PENDING",
            date="2025-02-25 09:00:00",
            city="Ankara",
            school_id=schools[1].user_id,
            high_school_name="Özel Çağlayan Fen Lisesi",
            teacher_name="Sümeyye Gül",
            teacher_phone_number="05435678901",
            student_count=140,
            school_email="fen@çağlayan.com",
        ),
        Tour(
            confirmation="BTO RET",
            date="2025-01-03 11:00:00",
            city="İstanbul",
            school_id=schools[4].user_id,
            high_school_name="Final Okulları İzmir Kampüsü",
            teacher_name="Mehmet Yılmaz",
            teacher_phone_number="05437651234",
            student_count=60,
            school_email="izmir@final.com",
        ),
        Tour(
            confirmation="RET",
            date="2025-01-10 16:00:00",
            city="Antalya",
            school_id=schools[5].user_id,
            high_school_name="Bahçeşehir Koleji Antalya Kampüsü",
            teacher_name="Ayşe Acar",
            teacher_phone_number="05431122334",
            student_count=120,
            school_email="antalya@bahcesehir.edu",
        ),
        Tour(
            confirmation="ONAY",
            date="2024-12-16 13:30:00",  # Tarihi geçmiş
            city="Ankara",
            school_id=schools[0].user_id,
            high_school_name="Özel Keçiören Birey Anadolu Lisesi",
            teacher_name="Ömer Faruk Ateş",
            teacher_phone_number="05431234567",
            student_count=100,
            school_email="bireykoleji@birey.com",
        ),
        Tour(
            confirmation="ONAY",
            date="2024-12-10 11:00:00",
            city="Kayseri",
            school_id=schools[7].user_id,
            high_school_name="Enka Okulları İstanbul",
            teacher_name="Ömer",
            teacher_phone_number="0786964567",
            student_count=80,
            school_email="school1@example.com",
        ),
        Tour(
            confirmation="ONAY",
            date="2025-01-20 13:30:00",
            city="Trabzon",
            school_id=schools[6].user_id,
            high_school_name="Doğa Koleji Trabzon Kampüsü",
            teacher_name="Ali Demir",
            teacher_phone_number="05439876543",
            student_count=180,
            school_email="trabzon@dogakoleji.com",
        ),
        Tour(
            confirmation="ONAY",
            date="2025-01-15 16:00:00",
            city="İstanbul",
            school_id=schools[8].user_id,
            high_school_name="Saint Joseph Fransız Lisesi",
            teacher_name="Fatma Çelik",
            teacher_phone_number="05438765432",
            student_count=60,
            school_email="saintjoseph@fsl.com",
        ),
    ]
    db.add_all(tours)
    db.commit()

    # Create and add guides_tours
    guides_tours = [
        GuideTour(guide_id=guides[0].user_id, tour_id=tours[2].id, status="ASSIGNED"),
        GuideTour(guide_id=guides[1].user_id, tour_id=tours[0].id, status="ASSIGNED"),
        GuideTour(guide_id=guides[1].user_id, tour_id=tours[1].id, status="REQUESTED"),
        GuideTour(guide_id=guides[2].user_id, tour_id=tours[0].id, status="ASSIGNED"),
        GuideTour(guide_id=guides[1].user_id, tour_id=tours[3].id, status="REQUESTED"),
        GuideTour(guide_id=guides[16].user_id, tour_id=tours[6].id, status="ASSIGNED"),
        GuideTour(guide_id=guides[0].user_id, tour_id=tours[6].id, status="ASSIGNED"),
    ]
    db.add_all(guides_tours)
    db.commit()

    # Create and add guides_tours
    guides_fairs = [
        GuideFair(guide_id=guides[0].user_id, fair_id=fairs[2].id, status="ASSIGNED"),
        GuideFair(guide_id=guides[16].user_id, fair_id=fairs[6].id, status="REQUESTED"),
    ]
    db.add_all(guides_fairs)
    db.commit()

    db.commit()
    db.close()
