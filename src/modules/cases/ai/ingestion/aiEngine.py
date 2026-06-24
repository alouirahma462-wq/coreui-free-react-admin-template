import cv2
import pytesseract
import re
import json
import sys
import math

# =========================
# CLEAN
# =========================
def clean(text):
    text = re.sub(r"[^\u0600-\u06FF0-9a-zA-Z\s]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()

# =========================
# OCR
# =========================
def ocr(image_path):
    img = cv2.imread(image_path)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.bilateralFilter(gray, 9, 75, 75)
    gray = cv2.resize(gray, None, fx=2.5, fy=2.5)

    text = pytesseract.image_to_string(
        gray,
        lang="ara",
        config="--oem 3 --psm 6"
    )

    return clean(text)

# =========================
# FACTS
# =========================
def extract_facts(text):
    return [s.strip() for s in re.split(r"[\.،\n]", text) if len(s.strip()) > 10]

# =========================
# CLASSIFIER
# =========================
def classify(text):
    if any(w in text for w in ["جريمة", "سجن", "عقوبة"]):
        return "جزائي"
    if any(w in text for w in ["عقد", "التزام", "ملكية"]):
        return "مدني"
    if "إدارة" in text:
        return "إداري"
    return "عام"

# =========================
# SMART LEGAL SCORE (AI-STYLE)
# =========================
def probability_judgment(facts, text):

    base = len(facts)

    risk_keywords = ["جريمة", "قتل", "سرقة", "تزوير"]
    civil_keywords = ["عقد", "التزام", "تعويض"]

    risk_score = sum(1 for w in risk_keywords if w in text)
    civil_score = sum(1 for w in civil_keywords if w in text)

    probability_guilt = min(0.95, (base * 0.05) + (risk_score * 0.2))
    probability_civil_win = min(0.95, (base * 0.04) + (civil_score * 0.25))

    return {
        "probability_guilt": round(probability_guilt, 2),
        "probability_civil_win": round(probability_civil_win, 2)
    }

# =========================
# LEGAL REASONING ENGINE
# =========================
def judge(facts, case_type, text):

    probs = probability_judgment(facts, text)

    if probs["probability_guilt"] > 0.7:
        decision = "إدانة مرجحة 🟢"
    elif probs["probability_guilt"] > 0.4:
        decision = "قضية غير محسومة 🟡"
    else:
        decision = "براءة محتملة 🔴"

    return {
        "case_type": case_type,
        "decision": decision,
        "probabilities": probs,
        "confidence": round(len(facts) / 20, 2)
    }

# =========================
# MAIN
# =========================
def run(image_path):

    text = ocr(image_path)
    case_type = classify(text)
    facts = extract_facts(text)

    return {
        "text": text,
        "case_type": case_type,
        "facts": facts,
        "judgment": judge(facts, case_type, text)
    }

# =========================
# OUTPUT
# =========================
if __name__ == "__main__":
    path = sys.argv[1]
    print(json.dumps(run(path), ensure_ascii=False))
