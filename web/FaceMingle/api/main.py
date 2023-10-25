from fastapi import FastAPI, HTTPException , UploadFile , File
from model import FaceSwapper

import json
import base64
import cv2
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI()

# ------------------------- #
# sudo uvicorn main:app --host 0.0.0.0 --port 80 --reload
# ------------------------- #

# Add CORS middleware with appropriate configurations
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],  # You can restrict the allowed HTTP methods if necessary
    allow_headers=["*"],  # You can specify specific allowed headers if needed
    allow_credentials=True,  # Set this to True if your frontend sends credentials (e.g., cookies) with requests  
)

@app.get("/api/python")
def python():
    return "Ping is working"

image_swapper = FaceSwapper("./model_source/inswapper_128.onnx")

@app.get("/api/check")
def check():
    print(image_swapper)
    return "check" 

@app.post('/api/swap-image')
async def swap_image(face_to_swap: UploadFile = File(...), real_image: UploadFile = File(...)):
    try:
        print("got images")
        face_bytes = await face_to_swap.read()
        real_bytes = await real_image.read()
        print("changed it to bytes")

        # Convert the bytes to numpy arrays
        face_to_swap_array = cv2.imdecode(np.frombuffer(face_bytes, np.uint8), cv2.IMREAD_COLOR)
        real_image_array = cv2.imdecode(np.frombuffer(real_bytes, np.uint8), cv2.IMREAD_COLOR)

        base64_image = image_swapper.swap_image_from_request(face_to_swap_array, real_image_array)
        print("Got Base 64 Image")
        if base64_image is None:
            error_msg = "Image swapping failed. Sorry. We will fix it soon."
            return JSONResponse(status_code=400, content={"error": error_msg})
        
        return JSONResponse(content={"result_image": base64_image}, status_code=200)

    except Exception as e:

        return JSONResponse(status_code=500, content={"error": str(e)})


# @app.post('/api/poster')
# async def post_images(face_to_swap: UploadFile = File(...), real_image: UploadFile = File(...)):
#     try:
#         face_bytes = await face_to_swap.read()
#         real_bytes = await real_image.read()

#         face_to_swap_array = cv2.imdecode(np.frombuffer(face_bytes, np.uint8), cv2.IMREAD_COLOR)
#         real_image_array = cv2.imdecode(np.frombuffer(real_bytes, np.uint8), cv2.IMREAD_COLOR)

#         if face_to_swap_array is None or real_image_array is None:
#             raise HTTPException(status_code=400, detail="Sorry, images can't be processed")
        
#         processed_face_image = face_to_swap_array# Implement your processing logic here
        
#         # Convert the processed image back to bytes
#         _, processed_image_bytes = cv2.imencode('.jpg', processed_face_image)
            
#         return JSONResponse(
#             content={"message": "Images received and processed successfully", "processed_face_image": processed_image_bytes.tolist()},
#             status_code=200
#         )
#     except Exception as e:
#         return JSONResponse(content={"error": str(e)}, status_code=500)
