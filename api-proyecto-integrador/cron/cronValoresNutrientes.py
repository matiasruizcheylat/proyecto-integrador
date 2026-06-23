
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


HORAS=0
MINUTOS=0
SEGUNDOS=10

ultimo_ejecutado = None

#Se lee un archivo de monitoreo (en caso de que algo salga mal tenemos esto para comprobarlo)
LOG_FILE = "lector.log"

fecha = datetime.now().strftime("%Y-%m-%d")

archivo_estadisticas_ruta="estadisticas-hidroponia/"+fecha+".txt"

MAX_REGISTROS = 144 #cada 3 dias se actualiza!!
MARGEN_MINUTOS = 1  #20


HORARIOS=[
    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "10:50",
    "10:52",
    "10:54",
    "10:56",
    "10:58",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00"
]



def debe_ejecutar():

    ahora = datetime.now()

    for horario in HORARIOS:

        hora_programada = datetime.strptime(
            horario,
            "%H:%M"
        ).replace(
            year=ahora.year,
            month=ahora.month,
            day=ahora.day
        )

        diferencia = (
            ahora - hora_programada
        ).total_seconds()

        if 0 <= diferencia <= MARGEN_MINUTOS * 60:
            return horario

    return None


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


intervalo = timedelta(
    hours=HORAS,
    minutes=MINUTOS,
    seconds=SEGUNDOS
)

proxima_ejecucion = datetime.now()


while True:

    horario = debe_ejecutar() 
    
    if horario and horario != ultimo_ejecutado:

        escribir_log("Inicio de ejecución")

        try: 
            print(f"Ejecutando: {horario}") 
            guardado=ejecutar_proceso()
            escribir_archivo(guardado, horario)
            escribir_log("Fin OK") 
        except Exception as e: 
            escribir_log(f"ERROR: {e}") 
            # enviar_email(str(e)) 
        
        ultimo_ejecutado = horario
    
    time.sleep(10)

