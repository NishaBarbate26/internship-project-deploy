from database.database import get_db_connection
import json
from datetime import datetime
from typing import List, Dict, Optional
import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
import re
import time


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

    cursor.execute("PRAGMA table_info(itineraries)")
    columns = [col[1] for col in cursor.fetchall()]
    has_updated_at = "updated_at" in columns

    if has_updated_at:
        cursor.execute(
            """
            INSERT INTO itineraries (
                user_id,
                destination,
                start_date,
                end_date,
                preferences,
                itinerary,
                created_at,
                updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                user_id,
                destination,
                start_date,
                end_date,
                json.dumps(preferences),
                json.dumps(itinerary),
                datetime.utcnow(),
                datetime.utcnow(),
            ),
        )
    else:
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
        itineraries.append(
            {
                "id": row[0],
                "destination": row[1],
                "start_date": row[2],
                "end_date": row[3],
                "itinerary": json.loads(row[4]),
                "created_at": row[5],
            }
        )

    return itineraries


# --------------------------------------------------
# GET SINGLE ITINERARY BY ID (with ownership validation)
# --------------------------------------------------
def get_itinerary_by_id(itinerary_id: int, user_email: str):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("PRAGMA table_info(itineraries)")
    columns = [col[1] for col in cursor.fetchall()]
    has_updated_at = "updated_at" in columns

    if has_updated_at:
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
                created_at,
                updated_at
            FROM itineraries
            WHERE id = ?
            """,
            (itinerary_id,),
        )
    else:
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

    if row[1] != user_email:
        return None

    result = {
        "id": row[0],
        "user_id": row[1],
        "destination": row[2],
        "start_date": row[3],
        "end_date": row[4],
        "preferences": json.loads(row[5]),
        "itinerary": json.loads(row[6]),
        "created_at": row[7],
    }

    if has_updated_at:
        result["updated_at"] = row[8]

    return result


# --------------------------------------------------
# CHAT HISTORY FUNCTIONS
# --------------------------------------------------
def get_chat_history(itinerary_id: int) -> List[Dict]:
    """Retrieve chat history for an itinerary"""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT id, role, content, created_at
        FROM chat_messages
        WHERE itinerary_id = ?
        ORDER BY created_at ASC
        """,
        (itinerary_id,),
    )

    rows = cursor.fetchall()
    conn.close()

    messages = []
    for row in rows:
        messages.append(
            {"id": row[0], "role": row[1], "content": row[2], "created_at": row[3]}
        )

    return messages


def save_chat_message(itinerary_id: int, role: str, content: str):
    """Save a chat message to the database"""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO chat_messages (itinerary_id, role, content, created_at)
        VALUES (?, ?, ?, ?)
        """,
        (itinerary_id, role, content, datetime.utcnow()),
    )

    conn.commit()
    message_id = cursor.lastrowid
    conn.close()

    return message_id


def update_itinerary_data(itinerary_id: int, updated_itinerary: dict):
    """Update the itinerary JSON and updated_at timestamp (if column exists)"""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("PRAGMA table_info(itineraries)")
    columns = [col[1] for col in cursor.fetchall()]
    has_updated_at = "updated_at" in columns

    if has_updated_at:
        cursor.execute(
            """
            UPDATE itineraries
            SET itinerary = ?, updated_at = ?
            WHERE id = ?
            """,
            (json.dumps(updated_itinerary), datetime.utcnow(), itinerary_id),
        )
    else:
        cursor.execute(
            """
            UPDATE itineraries
            SET itinerary = ?
            WHERE id = ?
            """,
            (json.dumps(updated_itinerary), itinerary_id),
        )

    conn.commit()
    conn.close()


# --------------------------------------------------
# SMART FALLBACK: Create modification without LLM
# --------------------------------------------------
def upgrade_to_luxury(day: dict, destination: str) -> dict:
    """Upgrade a day's activities to high/luxury budget"""
    upgraded = dict(day)

    if (
        "hotel" in upgraded.get("morning", "").lower()
        or "check-in" in upgraded.get("morning", "").lower()
    ):
        upgraded["morning"] = (
            upgraded["morning"]
            .replace("hotel", "luxury 5-star hotel")
            .replace("check-in", "VIP check-in at luxury resort")
        )
    if (
        "walk" in upgraded.get("morning", "").lower()
        or "explore" in upgraded.get("morning", "").lower()
    ):
        upgraded["morning"] = (
            f"Private guided tour of {destination}'s exclusive morning spots with luxury transport"
        )
    if "market" in upgraded.get("morning", "").lower():
        upgraded["morning"] = (
            f"Private shopping experience at {destination}'s high-end boutiques with personal shopper"
        )

    if (
        "museum" in upgraded.get("afternoon", "").lower()
        or "tour" in upgraded.get("afternoon", "").lower()
    ):
        upgraded["afternoon"] = (
            f"Private VIP museum tour with expert guide, skip-the-line access"
        )
    elif (
        "beach" in upgraded.get("afternoon", "").lower()
        or "relax" in upgraded.get("afternoon", "").lower()
    ):
        upgraded["afternoon"] = (
            "Private beach cabana with butler service and premium amenities"
        )
    elif (
        "sightsee" in upgraded.get("afternoon", "").lower()
        or "visit" in upgraded.get("afternoon", "").lower()
    ):
        upgraded["afternoon"] = (
            f"Luxury private car tour of {destination}'s landmarks with champagne service"
        )
    else:
        upgraded["afternoon"] = (
            f"Exclusive high-end experience: {upgraded.get('afternoon', 'Leisure time')} with premium service"
        )

    if (
        "dinner" in upgraded.get("evening", "").lower()
        or "restaurant" in upgraded.get("evening", "").lower()
    ):
        upgraded["evening"] = (
            f"Michelin-starred dinner experience at {destination}'s finest restaurant with wine pairing"
        )
    elif (
        "show" in upgraded.get("evening", "").lower()
        or "entertainment" in upgraded.get("evening", "").lower()
    ):
        upgraded["evening"] = (
            f"VIP box seats at premium show with backstage access and champagne"
        )
    else:
        upgraded["evening"] = (
            f"Sunset cocktail reception at luxury rooftop bar followed by gourmet dining"
        )

    if (
        "local" in upgraded.get("food", "").lower()
        or "street" in upgraded.get("food", "").lower()
    ):
        upgraded["food"] = (
            f"Fine dining: {upgraded['food'].replace('street food', 'gourmet cuisine').replace('local', 'premium local')}"
        )
    else:
        upgraded["food"] = (
            f"Gourmet dining experience: {upgraded.get('food', ' chef tasting menu')}"
        )

    if upgraded.get("notes"):
        upgraded["notes"] = (
            f"All bookings include VIP service and premium transfers. {upgraded['notes']}"
        )
    else:
        upgraded["notes"] = (
            "Includes private transfers, priority access, and concierge service"
        )

    return upgraded


def downgrade_to_budget(day: dict, destination: str) -> dict:
    """Downgrade a day's activities to low/budget"""
    upgraded = dict(day)

    if (
        "luxury" in upgraded.get("morning", "").lower()
        or "private" in upgraded.get("morning", "").lower()
    ):
        upgraded["morning"] = (
            upgraded["morning"]
            .replace("luxury", "comfortable")
            .replace("private", "self-guided")
        )
    if "tour" in upgraded.get("morning", "").lower():
        upgraded["morning"] = (
            f"Self-guided walking tour of {destination} using free map app"
        )

    if (
        "vip" in upgraded.get("afternoon", "").lower()
        or "private" in upgraded.get("afternoon", "").lower()
    ):
        upgraded["afternoon"] = (
            upgraded["afternoon"].replace("VIP", "Standard").replace("private", "group")
        )
    if (
        "car" in upgraded.get("afternoon", "").lower()
        or "transport" in upgraded.get("afternoon", "").lower()
    ):
        upgraded["afternoon"] = (
            f"Public transport exploration of {destination} (buy day pass)"
        )

    if (
        "michelin" in upgraded.get("evening", "").lower()
        or "fine dining" in upgraded.get("evening", "").lower()
    ):
        upgraded["evening"] = (
            "Casual dinner at highly-rated local eatery or food market"
        )

    upgraded["food"] = (
        f"Budget-friendly: {upgraded.get('food', 'local street food and markets')}"
    )

    upgraded["notes"] = (
        "Budget travel tips: Use public transport, book attractions online for discounts"
    )

    return upgraded


def make_day_relaxing(day: dict, day_num: int, destination: str) -> dict:
    """Convert a day to relaxing activities"""
    relaxed = dict(day)

    relaxed["title"] = f"Relaxation Day {day_num}"
    relaxed["morning"] = (
        f"Late wake-up at {destination} resort, leisurely breakfast with scenic views, optional yoga session"
    )
    relaxed["afternoon"] = (
        f"Spa treatment and wellness activities OR peaceful {destination} gardens/park visit with picnic"
    )
    relaxed["evening"] = (
        "Sunset viewing at quiet spot, early dinner at peaceful restaurant, stargazing or reading"
    )
    relaxed["food"] = "Healthy, organic meals at wellness café or resort restaurant"
    relaxed["notes"] = (
        "No rush today - move at your own pace. Spa appointments recommended. Perfect for recharging."
    )

    return relaxed


def create_relaxing_day(day_num: int, destination: str) -> dict:
    """Create a new relaxing day from scratch"""
    return {
        "day": day_num,
        "title": f"Relaxation & Wellness Day {day_num}",
        "morning": f"Sleep in and enjoy a leisurely breakfast at your accommodation. Morning meditation or yoga session at {destination}'s wellness center. Gentle stroll through quiet botanical gardens.",
        "afternoon": f"Spa treatment (massage or facial) at premium wellness center. Relax by the pool or enjoy a slow-paced cultural experience like a tea ceremony. Light lunch at health-focused café.",
        "evening": f"Sunset viewing at a peaceful, less-crowded viewpoint. Dinner at a quiet, intimate restaurant with calming ambiance. Early night to fully recharge.",
        "food": f"Organic smoothie bowl for breakfast, quinoa salad and herbal tea for lunch, grilled fish with vegetables for dinner",
        "notes": f"No tight schedules today. Book spa treatments in advance. This day is designed for complete relaxation and recharging your energy before continuing your {destination} adventure.",
    }


def create_smart_modification(
    user_message: str, current_itinerary: dict, preferences: dict
) -> Dict:
    """
    When API limit is reached, create a logical modification based on keywords.
    Handles combined requests (add day + modify existing).
    """
    message_lower = user_message.lower()
    modified_itinerary = dict(current_itinerary)

    if "days" not in modified_itinerary or not isinstance(
        modified_itinerary["days"], list
    ):
        modified_itinerary["days"] = []

    days = modified_itinerary["days"]
    destination = preferences.get("destination", "this destination")
    current_budget = preferences.get("budget", "medium").lower()

    changes_made = []

    # 1. HANDLE ADD DAY REQUESTS (check first)
    should_add_day = False
    add_day_relaxing = False

    if any(
        phrase in message_lower
        for phrase in [
            "add day",
            "extend trip",
            "one more day",
            "extra day",
            "additional day",
        ]
    ):
        should_add_day = True
        if "relax" in message_lower:
            add_day_relaxing = True

    if should_add_day and days:
        new_day_num = len(days) + 1

        # Check if user specified which day number (e.g., "day 3")
        day_mentioned = re.search(r"day\s*(\d+)", message_lower)
        if day_mentioned:
            requested_day = int(day_mentioned.group(1))
            new_day_num = requested_day if requested_day > len(days) else len(days) + 1

        if add_day_relaxing:
            new_day = create_relaxing_day(new_day_num, destination)
            changes_made.append(
                f"Added relaxing Day {new_day_num} with spa and wellness activities"
            )
        else:
            # Generic new day
            new_day = {
                "day": new_day_num,
                "title": f"Exploration Day {new_day_num}",
                "morning": f"Discover hidden gems in {destination}",
                "afternoon": f"Local experiences and sightseeing",
                "evening": f"Dinner and nightlife in {destination}",
                "food": "Local specialties",
                "notes": "Added as requested",
            }
            changes_made.append(f"Added Day {new_day_num}")

        days.append(new_day)
        modified_itinerary["overview"] = (
            modified_itinerary.get("overview", "") + f" Extended to {new_day_num} days."
        )

    # 2. HANDLE MODIFY EXISTING DAYS (e.g., "update day 2", "make day 2 relaxing")
    specific_day_match = re.search(
        r"(?:update|modify|change)\s+day\s*(\d+)", message_lower
    )
    make_relaxing = "relax" in message_lower or "slow" in message_lower

    if specific_day_match:
        day_to_modify = int(specific_day_match.group(1))
        if 1 <= day_to_modify <= len(days):
            if make_relaxing:
                days[day_to_modify - 1] = make_day_relaxing(
                    days[day_to_modify - 1], day_to_modify, destination
                )
                changes_made.append(
                    f"Converted Day {day_to_modify} to a relaxing schedule"
                )
            elif "luxury" in message_lower or "high" in message_lower:
                days[day_to_modify - 1] = upgrade_to_luxury(
                    days[day_to_modify - 1], destination
                )
                changes_made.append(
                    f"Upgraded Day {day_to_modify} to luxury experiences"
                )

    # 3. HANDLE "ALL DAYS" or "ACCORDINGLY" requests (when adding day affects previous days)
    if "accordingly" in message_lower or "update" in message_lower:
        # If we added a relaxing day, maybe make previous day less intense
        if add_day_relaxing and len(days) >= 2:
            # Make the day before the new last day slightly more relaxed
            prev_day_idx = len(days) - 2  # Second to last day
            if (
                "hike" in days[prev_day_idx].get("morning", "").lower()
                or "busy" in days[prev_day_idx].get("notes", "").lower()
            ):
                days[prev_day_idx]["notes"] = (
                    "Adjusted for better pacing before relaxation day. "
                    + days[prev_day_idx].get("notes", "")
                )
                changes_made.append(
                    f"Adjusted Day {prev_day_idx + 1} for better trip flow"
                )

    # 4. HANDLE BUDGET UPDATES
    if "budget" in message_lower or "luxury" in message_lower:
        if any(
            word in message_lower for word in ["high", "luxury", "expensive", "upgrade"]
        ):
            modified_itinerary["days"] = [
                upgrade_to_luxury(day, destination) for day in days
            ]
            changes_made.append("Upgraded entire itinerary to luxury budget")
        elif any(word in message_lower for word in ["low", "cheap", "budget", "save"]):
            modified_itinerary["days"] = [
                downgrade_to_budget(day, destination) for day in days
            ]
            changes_made.append("Adjusted itinerary for budget-conscious travel")

    # Build response message
    if changes_made:
        response_msg = (
            "I've made the following changes to your itinerary: "
            + "; ".join(changes_made)
            + "."
        )
    else:
        response_msg = f"I've processed your request: '{user_message}'. Your itinerary has been adjusted where possible."

    return {
        "response_message": response_msg
        + " (Note: AI temporarily unavailable, using smart fallback)",
        "updated_itinerary": modified_itinerary,
    }


# --------------------------------------------------
# LANGCHAIN CHAT PROCESSING
# --------------------------------------------------
def extract_json_from_text(text: str) -> dict:
    """Extract JSON from text."""
    text = text.strip()

    if "```json" in text:
        try:
            json_part = text.split("```json")[1].split("```")[0].strip()
            return json.loads(json_part)
        except:
            pass

    if "```" in text:
        try:
            json_part = text.split("```")[1].split("```")[0].strip()
            return json.loads(json_part)
        except:
            pass

    try:
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1 and end > start:
            return json.loads(text[start : end + 1])
    except:
        pass

    try:
        return json.loads(text)
    except:
        pass

    return {}


def process_chat_modification(
    itinerary_id: int,
    user_message: str,
    current_itinerary: dict,
    preferences: dict,
    chat_history: List[Dict],
) -> Dict:
    """
    Process chat message using LangChain and Gemini LLM.
    Handles BOTH itinerary changes AND preference updates.
    """

    models_to_try = ["gemini-2.5-flash-lite"]

    for model_name in models_to_try:
        try:
            print(f"Trying model: {model_name}")

            llm = ChatGoogleGenerativeAI(
                model=model_name,
                temperature=0.1,
                convert_system_message_to_human=True,
                max_retries=2,
                request_timeout=30,
            )

            current_itinerary_str = json.dumps(current_itinerary, indent=2)
            current_preferences_str = json.dumps(preferences, indent=2)

            history_str = ""
            if chat_history:
                for msg in chat_history[-2:]:
                    role = "User" if msg["role"] == "user" else "Assistant"
                    history_str += f"{role}: {msg['content']}\n"

            prompt_text = f"""
You are a travel itinerary backend API.
Return ONLY valid JSON. No explanation text.

CURRENT PREFERENCES:
{current_preferences_str}

CURRENT ITINERARY:
{current_itinerary_str}

CHAT HISTORY:
{history_str}

USER REQUEST:
"{user_message}"

INSTRUCTIONS:
- If user mentions travellers, budget, style, pace → update preferences
- If user mentions days, activities, schedule → update itinerary
- Always return FULL itinerary and FULL preferences

REQUIRED JSON FORMAT:
{{
  "response_message": "Short confirmation of what changed",
  "updated_preferences": {{
    "travellers": 1,
    "budget": "low | medium | high",
    "travel_style": "relaxed | balanced | packed"
  }},
  "updated_itinerary": {{
    "overview": "...",
    "days": [
      {{
        "day": 1,
        "title": "...",
        "morning": "...",
        "afternoon": "...",
        "evening": "...",
        "food": "...",
        "notes": "..."
      }}
    ]
  }}
}}
"""

            response = llm.invoke([HumanMessage(content=prompt_text)])
            response_text = response.content.strip()

            print(f"Model response: {response_text[:300]}...")

            result = extract_json_from_text(response_text)

            if (
                result
                and "updated_itinerary" in result
                and "updated_preferences" in result
                and "response_message" in result
            ):
                updated_itinerary = result["updated_itinerary"]
                updated_preferences = result["updated_preferences"]

                # Normalize itinerary days
                if isinstance(updated_itinerary.get("days"), list):
                    for i, day in enumerate(updated_itinerary["days"]):
                        day.setdefault("day", i + 1)
                        for field in [
                            "title",
                            "morning",
                            "afternoon",
                            "evening",
                            "food",
                            "notes",
                        ]:
                            day.setdefault(field, "")

                print("LLM update successful")

                return {
                    "response_message": result["response_message"],
                    "updated_itinerary": updated_itinerary,
                    "updated_preferences": updated_preferences,
                }

        except Exception as e:
            print(f"Model failed: {str(e)[:150]}...")
            continue

    # 🔴 FALLBACK (no LLM)
    print("Using smart fallback")

    fallback = create_smart_modification(user_message, current_itinerary, preferences)

    return {
        "response_message": fallback["response_message"],
        "updated_itinerary": fallback["updated_itinerary"],
        "updated_preferences": preferences,  # preferences unchanged in fallback
    }


def process_chat_and_update(
    itinerary_id: int, user_email: str, user_message: str
) -> Dict:
    """
    Full chat workflow:
    - Save user message
    - Process LLM
    - Update itinerary
    - Update preferences
    - Return everything to frontend
    """

    itinerary_data = get_itinerary_by_id(itinerary_id, user_email)
    if not itinerary_data:
        raise ValueError("Itinerary not found or access denied")

    current_itinerary = itinerary_data["itinerary"]
    current_preferences = itinerary_data["preferences"]

    chat_history = get_chat_history(itinerary_id)

    # Save user message
    save_chat_message(itinerary_id, "user", user_message)

    result = process_chat_modification(
        itinerary_id=itinerary_id,
        user_message=user_message,
        current_itinerary=current_itinerary,
        preferences=current_preferences,
        chat_history=chat_history,
    )

    # Save assistant message
    save_chat_message(itinerary_id, "assistant", result["response_message"])

    update_itinerary_data(itinerary_id, result["updated_itinerary"])

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE itineraries SET preferences = ? WHERE id = ?",
        (json.dumps(result["updated_preferences"]), itinerary_id),
    )
    conn.commit()
    conn.close()

    print(f"Updated itinerary + preferences for itinerary {itinerary_id}")

    return {
        "success": True,
        "response_message": result["response_message"],
        "updated_itinerary": result["updated_itinerary"],
        "updated_preferences": result["updated_preferences"],
        "chat_history": get_chat_history(itinerary_id),
    }


# --------------------------------------------------
# NEW: DELETE ITINERARY (Cascading)
# --------------------------------------------------
def delete_itinerary(itinerary_id: int, user_email: str) -> bool:
    """
    Deletes the itinerary and all associated chat history.
    Validates ownership before performing deletion.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # First check ownership
        cursor.execute("SELECT user_id FROM itineraries WHERE id = ?", (itinerary_id,))
        row = cursor.fetchone()

        if not row or row[0] != user_email:
            return False

        # Delete associated chat messages first (data integrity)
        cursor.execute(
            "DELETE FROM chat_messages WHERE itinerary_id = ?", (itinerary_id,)
        )

        # Delete the itinerary itself
        cursor.execute("DELETE FROM itineraries WHERE id = ?", (itinerary_id,))

        conn.commit()
        return True
    except Exception as e:
        print(f"Database error during deletion: {e}")
        conn.rollback()
        return False
    finally:
        conn.close()
