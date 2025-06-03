import re
from datetime import datetime

MESES = {
    "enero": 1, "febrero": 2, "marzo": 3, "abril": 4, "mayo": 5, "junio": 6,
    "julio": 7, "agosto": 8, "septiembre": 9, "octubre": 10, "noviembre": 11, "diciembre": 12
}

def extraer_rangos_de_fechas(texto: str):
    regex = r"(" + "|".join(MESES.keys()) + r")\s+(\d{4})\s*-\s*(" + "|".join(MESES.keys()) + r")\s+(\d{4})"
    coincidencias = re.findall(regex, texto.lower())
    
    fechas = []
    for inicio_mes, inicio_año, fin_mes, fin_año in coincidencias:
        try:
            fecha_inicio = datetime(int(inicio_año), MESES[inicio_mes], 1)
            fecha_fin = datetime(int(fin_año), MESES[fin_mes], 1)
            fechas.append((fecha_inicio, fecha_fin))
        except:
            continue
    return fechas

def calcular_anios_experiencia(fechas):
    total_meses = 0
    for inicio, fin in fechas:
        delta = (fin.year - inicio.year) * 12 + (fin.month - inicio.month)
        total_meses += max(delta, 0)
    return round(total_meses / 12, 2)

def extraer_anios_del_requisito(req: str):
    req = req.lower()
    # Detecta "sin experiencia" directamente
    if "sin experiencia" in req:
        return 0
    # Detecta "x años", "x año", "x meses", etc.
    match = re.search(r"(\d+(?:[\.,]\d+)?)\s*(años|año|meses|mes)", req)
    if match:
        cantidad = float(match.group(1).replace(",", "."))
        unidad = match.group(2)
        if "mes" in unidad:
            return round(cantidad / 12, 2)
        return cantidad
    return None  # No se especifica duración exacta
