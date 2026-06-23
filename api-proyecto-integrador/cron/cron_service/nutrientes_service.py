from database import SessionLocal
from models.valoresNutrietes import ValoresNutrientes

class NutrienteService:

    def guardar_valores_nutrientes(
        self,
        fecha_hora,
        valor_1,
        valor_2,
        valor_3,
        valor_4
    ):

        session = SessionLocal()

        try:

            registro = ValoresNutrientes(
                fecha_hora=fecha_hora,
                valor_1=valor_1,
                valor_2=valor_2,
                valor_3=valor_3,
                valor_4=valor_4
            )

            session.add(registro)

            session.commit()

            return {
                "fecha_hora": registro.fecha_hora,
                "valor_1": registro.valor_1,
                "valor_2": registro.valor_2,
                "valor_3": registro.valor_3,
                "valor_4": registro.valor_4
            }

        except Exception:

            session.rollback()
            raise

        finally:

            session.close()