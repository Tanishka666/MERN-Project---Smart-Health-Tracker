from model_loader import load_model

model = load_model()

def predict_health(data):
    features = [data.get('heart_rate'), data.get('steps'), data.get('glucose')]
    prediction = model.predict([features])[0]
    return {
        "user_id": data.get("user_id"),
        "prediction": prediction,
        "features": features
    }
