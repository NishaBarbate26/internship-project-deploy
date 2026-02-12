import os
import json
import firebase_admin
from firebase_admin import credentials

if not firebase_admin._apps:

    firebase_key = os.environ.get("FIREBASE_SERVICE_ACCOUNT")

    if firebase_key:
        # 🔹 Production (Render)
        cred = credentials.Certificate(json.loads(firebase_key))
    else:
        # 🔹 Local development
        cred = credentials.Certificate("firebase_service_account.json")

    firebase_admin.initialize_app(cred)
