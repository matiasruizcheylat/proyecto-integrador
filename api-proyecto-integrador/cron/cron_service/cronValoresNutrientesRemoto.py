
import sys
import os

ROOT_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

sys.path.append(ROOT_DIR)

print(ROOT_DIR)



from datetime import datetime, timedelta
from cronProceso import ejecutar_proceso
import time


ultimo_ejecutado = None

#Se lee un archivo de monitoreo (en caso de que algo salga mal tenemos esto para comprobarlo)
LOG_FILE = "lector.log"

fecha = datetime.now().strftime("%Y-%m-%d")

archivo_estadisticas_ruta = (
    "estadisticas-hidroponia/" + fecha + ".txt"
)

os.makedirs(
    "estadisticas-hidroponia",
    exist_ok=True
)

MAX_REGISTROS = 144 #cada 3 dias se actualiza!!
MARGEN_MINUTOS = 1  #20



def escribir_log(mensaje):

    linea = f"[{datetime.now():%Y-%m-%d %H:%M:%S}] {mensaje}"
    try:
        with open(LOG_FILE, "r", encoding="utf-8") as f:
            lineas = f.readlines()
    except FileNotFoundError:
        lineas = []

    lineas.append(linea + "\n")

    if len(lineas) > MAX_REGISTROS:
        lineas = lineas[-MAX_REGISTROS:]

    with open(LOG_FILE, "w", encoding="utf-8") as f:
        f.writelines(lineas)




def escribir_archivo(guardado, horario):
    
    datos = (
        f"{horario}: "
        f"({guardado['fecha_hora']} | "
        f"{guardado['valor_1']} | "
        f"{guardado['valor_2']} | "
        f"{guardado['valor_3']} | "
        f"{guardado['valor_4']})"
    )
    
    print(datos)
    with open(archivo_estadisticas_ruta, "a", encoding="utf-8") as archivo: 
        archivo.write(datos+"\n")



import os



for intento in range(1, 11):
    horario = datetime.now().strftime("%H:%M")

    try: 
        print(f"Ejecutando: {horario}") 
        guardado=ejecutar_proceso()
        escribir_archivo(guardado, horario)
        escribir_log("Fin OK") 
        break
    except Exception as e: 
        escribir_log(f"ERROR: {e}") 

        # enviar_email(str(e)) 
        
    time.sleep(10)


