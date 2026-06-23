import random

from cron_service.nutrientes_service import NutrienteService
from datetime import datetime

def ejecutar_proceso():


    service = NutrienteService()

    resultado= service.guardar_valores_nutrientes(
        datetime.now(),
        random.uniform(0, 100),
        random.uniform(0, 100),
        random.uniform(0, 100),
        random.uniform(0, 100)
    )
    return resultado