from huggingface_hub import InferenceClient
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
from PIL import Image
import pytesseract
import pdfplumber
import docx
from rapidfuzz import fuzz

import os
import re
import io
import json
from datetime import datetime



app = FastAPI()
api_key = os.environ.get("FIREWORKS_API_KEY")
client = InferenceClient(
     provider="fireworks-ai", #"nebius",
    api_key=api_key 
)
MODEL_ID = "meta-llama/Llama-4-Maverick-17B-128E-Instruct" #"Qwen/Qwen3-32B"

def es_similar(requisito: str, texto: str, umbral: int = 75) -> bool:
    return fuzz.partial_ratio(requisito.lower(), texto.lower()) >= umbral

def extraer_texto_de_pdf(pdf_bytes: bytes) -> str:
    texto_total = ""
    with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
        for page in pdf.pages:
            texto = page.extract_text()
            if texto:
                texto_total += texto + "\n"
            else:
                image = page.to_image(resolution=300).original
                texto_total += pytesseract.image_to_string(image, lang="spa") + "\n"
    return texto_total.strip()


def extraer_texto_de_imagen(imagen_bytes: bytes) -> str:
    imagen = Image.open(io.BytesIO(imagen_bytes))
    return pytesseract.image_to_string(imagen, lang="spa").strip()


def extraer_texto_de_docx(doc_bytes: bytes) -> str:
    doc_stream = io.BytesIO(doc_bytes)
    document = docx.Document(doc_stream)
    return "\n".join([p.text for p in document.paragraphs]).strip()

# - Evaluador con IA
def generar_observaciones_dinamicas_model(requisitos, texto_cv):
    fecha_actual = datetime.now().strftime("%d/%m/%Y")
    prompt = (
        "Eres un evaluador experto de currículums en español. A continuación se muestra el texto extraído de un CV y una lista de requisitos para un puesto.\n\n"
        f"Fecha actual: {fecha_actual}\n\n"
        f"Texto del CV:\n\"\"\"\n{texto_cv}\n\"\"\"\n\n"
        f"Requisitos:\n{json.dumps(requisitos, ensure_ascii=False)}\n\n"
        "Tu tarea es analizar si el texto del CV cumple con los requisitos indicados. Usa como referencia la fecha actual para estimar si el postulante tiene suficiente experiencia laboral.\n\n"
        "- Si un requisito pide una experiencia mínima en años, debes sumar toda la experiencia laboral relevante, aunque provenga de diferentes trabajos o prácticas.\n"
        "- Considera como inicio laboral el año de la primera experiencia relevante (aunque sea una práctica, si tiene funciones relacionadas).\n"
        "- Usa la fecha actual como referencia para calcular correctamente la duración.\n\n"
        "Devuelve exclusivamente las observaciones para los requisitos que NO se cumplan, usando el siguiente formato:\n\n"
        "[Requisito]: Observación breve en español.\n\n"
        "No pienses en voz alta, no expliques tu razonamiento. No escribas en inglés. Solo responde con la lista de observaciones en español siguiendo el formato indicado. No incluyas nada más."
    )

    promptQWen = (
        "Eres un evaluador experto de currículums en español. A continuación se muestra el texto extraído de un CV y una lista de requisitos para un puesto.\n\n"
        f"Fecha actual: {fecha_actual}\n\n"
        f"Texto del CV:\n\"\"\"\n{texto_cv}\n\"\"\"\n\n"
        f"Requisitos:\n{json.dumps(requisitos, ensure_ascii=False)}\n\n"
        "Tu tarea es analizar si el texto del CV cumple con los requisitos indicados. Usa como referencia la fecha actual para estimar si el postulante tiene suficiente experiencia laboral.\n\n"
        "- Si un requisito pide una experiencia mínima en años, debes sumar toda la experiencia laboral relevante, aunque provenga de diferentes trabajos o prácticas.\n"
        "- Considera como inicio laboral el año de la primera experiencia relevante (aunque sea una práctica, si tiene funciones relacionadas).\n"
        "- Usa la fecha actual como referencia para calcular correctamente la duración.\n\n"
        "Devuelve exclusivamente las observaciones para los requisitos que NO se cumplan, usando el siguiente formato:\n\n"
        "[Requisito]: Observación breve en español.\n\n"
        "Si TODOS los requisitos se cumplen, no devuelvas ninguna observación y responde solo con la palabra 'aprobado' en una línea aparte.\n"
        "Si hay algunos requisitos no cumplidos, devuelve las observaciones correspondientes y en la última línea una palabra que indique tu evaluación: 'observado' o 'rechazado'.\n\n"
        "No pienses en voz alta, no expliques tu razonamiento. No escribas en inglés. Solo responde con la lista de observaciones o la palabra de evaluación, sin nada más."
    )

    promptLLama = (
    "Eres un evaluador experto de currículums en español. A continuación se muestra el texto extraído de un CV y una lista de requisitos para un puesto.\n\n"
    f"Fecha actual: {fecha_actual}\n\n"
    f"Texto del CV:\n\"\"\"\n{texto_cv}\n\"\"\"\n\n"
    f"Requisitos:\n{json.dumps(requisitos, ensure_ascii=False)}\n\n"
    "Tu tarea es analizar si el texto del CV cumple con los requisitos indicados. Usa como referencia la fecha actual para estimar si el postulante tiene suficiente experiencia laboral.\n\n"
    "- Si un requisito pide una experiencia mínima en años, debes sumar toda la experiencia laboral relevante, aunque provenga de diferentes trabajos o prácticas.\n"
    "- Considera como inicio laboral el año de la primera experiencia relevante (aunque sea una práctica, si tiene funciones relacionadas).\n"
    "- Usa la fecha actual como referencia para calcular correctamente la duración.\n\n"
    "Devuelve exclusivamente lo siguiente:\n"
    "- Si todos los requisitos se cumplen, responde solo con la palabra 'aprobado' en una línea aparte.\n"
    "- Si alguno no se cumple, devuelve una línea por cada requisito incumplido con el formato: [Requisito]: Observación breve en español.\n"
    "- La última línea debe contener solo una palabra que indique el estado: 'observado' o 'rechazado'.\n\n"
    "No pienses en voz alta, no expliques nada, no escribas en inglés, no agregues nada más."
)
    
    try:
        completion = client.chat.completions.create(
            model=MODEL_ID,
            messages=[{"role": "user", "content": promptLLama}]
        )
        respuesta = completion.choices[0].message.content
       # observaciones = [
          #  line.strip() for line in respuesta.split("\n")
         #   if line.strip() and line.strip().startswith("[")
        #]
        return respuesta
    except Exception as e:
        print("Error al generar observaciones dinámicas:", e)
        return []


def analizar_resultado_modelo(texto_respuesta, requisitos: list[str]) -> dict:
    estados_posibles = ["aprobado", "observado", "rechazado"]

    # Dividir texto en líneas
    lineas = texto_respuesta.strip().split("\n")

    # Buscar estado al final o en cualquier parte del texto
    estado = None
    if lineas and lineas[-1].strip().lower() in estados_posibles:
        estado = lineas[-1].strip().lower()
        # Quitar la última línea que contiene el estado
        texto_limpio = "\n".join(lineas[:-1]).strip()
    else:
        texto_limpio = texto_respuesta.strip()
        texto_lower = texto_respuesta.lower()
        for est in estados_posibles:
            if est in texto_lower:
                estado = est
                break

    resultado = {
        "estado": estado,
        "observacion": texto_limpio
    }

    # Si está aprobado, añadimos la lista de requisitos que cumple (toda la lista)
    if estado == "aprobado":
        resultado["cumple"] = requisitos

    return resultado


# - Evaluador con IA usando observaciones dinámicas
@app.post("/evaluar_postulacion_cv")
async def evaluar_postulacion_model(
    file: UploadFile = File(...),
    vacante_json: str = Form(...)
):
    vacante = json.loads(vacante_json)
    contenido = await file.read()
    tipo = file.content_type

    if tipo == "application/pdf":
        texto = extraer_texto_de_pdf(contenido)
    elif tipo in ["image/jpeg", "image/png", "image/jpg"]:
        texto = extraer_texto_de_imagen(contenido)
    elif tipo in ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"]:
        texto = extraer_texto_de_docx(contenido)
    else:
        return JSONResponse(content={"error": "Formato de archivo no permitido."}, status_code=400)

    if not texto.strip():
        return JSONResponse(content={
            "estado": "nulo",
            "mensaje": "El CV está vacío o ilegible.",
            "porcentaje": 0,
            "cumple": [],
            "faltantes": [],
            "observaciones": "obsd - no se pudo leer el CV"
        }, status_code=200)

    requisitos = vacante.get("requisitos", [])

    observaciones = generar_observaciones_dinamicas_model(requisitos, texto)
  
    #print("respuesta del modelo", observaciones)
    resultado = analizar_resultado_modelo(observaciones, requisitos)
    return resultado

    