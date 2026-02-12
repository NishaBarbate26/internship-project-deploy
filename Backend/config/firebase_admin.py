import os
import json
import firebase_admin
from firebase_admin import credentials

firebase_key = os.environ.get("FIREBASE_SERVICE_ACCOUNT")

if not firebase_admin._apps:
    cred = credentials.Certificate(json.loads(firebase_key))
    firebase_admin.initialize_app(cred)
