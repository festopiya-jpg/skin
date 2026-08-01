import io
import cv2
import numpy as np
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid
import base64
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL")
LLM_MODEL = os.getenv("LLM_MODEL", "llama-3.3-70b-versatile")

client = None
if OPENAI_API_KEY:
    client = OpenAI(
        api_key=OPENAI_API_KEY,
        base_url=OPENAI_BASE_URL
    )
# Import Grad-CAM
from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.image import show_cam_on_image
from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget

app = FastAPI(title="Skin Care XAI Diagnostic Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class XAIPredictionResponse(BaseModel):
    prediction_id: str
    disease: str
    confidence: float
    severity: str
    explanation: str
    differential_diagnosis: list[str]
    heatmap_base64: str
    detailed_research: str

# 1. Device Setup
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# 2. Model Initialization
# HAM10000 has 7 classes typically: ['akiec', 'bcc', 'bkl', 'df', 'mel', 'nv', 'vasc']
CLASSES = ['akiec (Actinic keratoses)', 'bcc (Basal cell carcinoma)', 'bkl (Benign keratosis-like lesions)', 
           'df (Dermatofibroma)', 'mel (Melanoma)', 'nv (Melanocytic nevi)', 'vasc (Vascular lesions)']

try:
    model = models.resnet50(pretrained=False)
    num_ftrs = model.fc.in_features
    model.fc = nn.Linear(num_ftrs, len(CLASSES))
    
    # Try to load weights if they exist (will load the fifth epoch once training finishes)
    model_path = "resnet50_ham10000_epoch_5.pth"
    if os.path.exists(model_path):
        model.load_state_dict(torch.load(model_path, map_location=device))
        print("Successfully loaded trained PyTorch model.")
    else:
        print("Warning: Model weights not found. Using untrained ResNet50 for demonstration.")
    
    model = model.to(device)
    model.eval()
    
    # Setup Grad-CAM. We target the last convolutional layer of ResNet50.
    target_layers = [model.layer4[-1]]
    cam = GradCAM(model=model, target_layers=target_layers)
    
except Exception as e:
    print(f"Error initializing model: {e}")
    model = None
    cam = None

# 3. Image Transforms
preprocess = transforms.Compose([
    transforms.Resize(224),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                         std=[0.229, 0.224, 0.225])
])

def generate_xai_heatmap(image: Image.Image, tensor: torch.Tensor, target_class_idx: int) -> str:
    """Generates real Grad-CAM heatmap using pytorch-grad-cam."""
    if cam is None:
        return ""
        
    # Generate CAM
    targets = [ClassifierOutputTarget(target_class_idx)]
    
    # The GradCAM call requires gradients enabled, so we do it outside the no_grad block in predict_skin_disease
    grayscale_cam = cam(input_tensor=tensor, targets=targets)[0, :]
    
    # Resize original PIL image to 224x224 to match CAM
    rgb_img = image.resize((224, 224))
    rgb_img = np.float32(rgb_img) / 255
    
    # Overlay CAM on image
    visualization = show_cam_on_image(rgb_img, grayscale_cam, use_rgb=True)
    
    # Convert to base64
    visualization_bgr = cv2.cvtColor(visualization, cv2.COLOR_RGB2BGR)
    _, buffer = cv2.imencode('.jpg', visualization_bgr)
    return base64.b64encode(buffer).decode('utf-8')

def generate_disease_research(disease_name: str) -> str:
    """Uses OpenAI API to generate comprehensive research on the identified disease."""
    if not client:
        return "AI Research unavailable: OPENAI_API_KEY is not set in backend/.env"
    try:
        sys_prompt = (
            "You are an expert dermatologist AI assistant. "
            "You MUST output your response in Markdown format using the exact following sections:\n"
            "## 1. Clinical Description\n"
            "(Brief description of the disease)\n"
            "## 2. Common Symptoms\n"
            "(List common symptoms)\n"
            "## 3. Recommended Medicines (Pharmacy)\n"
            "(List specific medical treatments, topical creams, or oral medications)\n"
            "## 4. Recommended Lab Tests (Lab Technician)\n"
            "(List specific biopsies, blood tests, or lab work required to confirm)\n"
            "## 5. Urgency Level\n"
            "(State the clinical urgency)"
        )
        response = client.chat.completions.create(
            model=LLM_MODEL,
            messages=[
                {"role": "system", "content": sys_prompt},
                {"role": "user", "content": f"Please provide a structured clinical research report on the skin condition: {disease_name}."}
            ],
            max_tokens=800
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Research generation failed: {str(e)}"

@app.post("/api/predict", response_model=XAIPredictionResponse)
async def predict_skin_disease(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")
        
    image_bytes = await file.read()
    
    try:
        # Load and Preprocess Image
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        input_tensor = preprocess(image).unsqueeze(0).to(device)
        
        if model is None:
            raise RuntimeError("Model is not initialized.")
            
        # We need gradients for Grad-CAM, so we temporarily enable grad on the input tensor
        input_tensor.requires_grad_(True)
        
        # Inference
        outputs = model(input_tensor)
        probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
        confidence, predicted_idx = torch.max(probabilities, 0)
        
        conf_val = confidence.item() * 100
        pred_idx_val = predicted_idx.item()
        disease_name = CLASSES[pred_idx_val]
            
        # Generate Grad-CAM Heatmap
        heatmap_b64 = generate_xai_heatmap(image, input_tensor, pred_idx_val)
        
        # Determine Severity (Mock logic for demonstration)
        severity = "Mild"
        if "mel" in disease_name.lower() or "bcc" in disease_name.lower():
            severity = "Severe"
        elif "akiec" in disease_name.lower():
            severity = "Moderate"
            
        # Differential Diagnosis (get top 3)
        top_prob, top_indices = torch.topk(probabilities, 3)
        diff_diag = [CLASSES[idx.item()] for idx in top_indices if idx.item() != pred_idx_val]
        
        # Generate Research
        detailed_research = generate_disease_research(disease_name)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI processing failed: {str(e)}")

    return XAIPredictionResponse(
        prediction_id=str(uuid.uuid4()),
        disease=disease_name,
        confidence=round(conf_val, 2),
        severity=severity,
        explanation=f"The AI ResNet model analyzed the image and predicted {disease_name} with {conf_val:.1f}% confidence. The heatmap highlights the exact pixels driving this decision.",
        differential_diagnosis=diff_diag,
        heatmap_base64=heatmap_b64,
        detailed_research=detailed_research
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
