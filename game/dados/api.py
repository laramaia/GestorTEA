import requests

class FaseService:
    BASE_URL = "http://localhost:5055/api"

    @staticmethod
    def buscar_todas_fases():
        try:
            response = requests.get(f"{FaseService.BASE_URL}/fases")
            response.raise_for_status() # Lança erro se o status não for 2xx
            return response.json() 
        except requests.exceptions.RequestException as e:
            print(f"Erro ao conectar com o backend: {e}")
            return []

    @staticmethod
    def buscar_detalhes_fase(fase_id):
        try:
            response = requests.get(f"{FaseService.BASE_URL}/fases/{fase_id}")
            if response.status_code == 200:
                return response.json()
            return None
        except requests.exceptions.RequestException:
            return None
        
    