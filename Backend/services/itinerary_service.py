from database.database import get_db_connection
import json
from datetime import datetime

# --------------------------------------------------
# SAVE ITINERARY
# --------------------------------------------------
def save_itinerary(
    user_id: str,
    destination: str,
    start_date: str,
    end_date: str,
    preferences: dict,
    itinerary: dict,
):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO itineraries (
            user_id,
            destination,
            start_date,
            end_date,
            preferences,
            itinerary,
            created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (
            user_id,
            destination,
            start_date,
            end_date,
            json.dumps(preferences),
            json.dumps(itinerary),
            datetime.utcnow(),
        ),
    )

    conn.commit()
    itinerary_id = cursor.lastrowid
    conn.close()

    return itinerary_id


# --------------------------------------------------
# GET ITINERARIES BY USER EMAIL
# --------------------------------------------------
def get_itineraries_by_user(user_email: str):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            id,
            destination,
            start_date,
            end_date,
            itinerary,
            created_at
        FROM itineraries
        WHERE user_id = ?
        ORDER BY created_at DESC
        """,
        (user_email,),
    )

    rows = cursor.fetchall()
    conn.close()

    itineraries = []

    for row in rows:
        itineraries.append({
            "id": row[0],
            "destination": row[1],
            "start_date": row[2],
            "end_date": row[3],
            "itinerary": json.loads(row[4]),
            "created_at": row[5],
        })

    return itineraries


# --------------------------------------------------
# GET SINGLE ITINERARY BY ID (with ownership validation)
# --------------------------------------------------
def get_itinerary_by_id(itinerary_id: int, user_email: str):
    """
    Retrieve a single itinerary by ID.
    Returns the itinerary data if found and belongs to user_email.
    Returns None if not found or doesn't belong to user.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            id,
            user_id,
            destination,
            start_date,
            end_date,
            preferences,
            itinerary,
            created_at
        FROM itineraries
        WHERE id = ?
        """,
        (itinerary_id,),
    )

    row = cursor.fetchone()
    conn.close()

    if not row:
        return None

    # Check ownership - ensure users can only access their own itineraries
    if row[1] != user_email:
        return None

    return {
        "id": row[0],
        "user_id": row[1],
        "destination": row[2],
        "start_date": row[3],
        "end_date": row[4],
        "preferences": json.loads(row[5]),
        "itinerary": json.loads(row[6]),
        "created_at": row[7],
    }