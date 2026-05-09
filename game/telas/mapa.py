import pygame
from telas.tela import Tela
from componentes.sidebar import Sidebar
from dados.api import FaseService
from telas.criar_fase import CriarFase

class Mapa(Tela):
    def __init__(self):
        super().__init__()
        self.sidebar = Sidebar(320, 720)
        self.casinha = pygame.image.load("assets/casinha.png").convert_alpha()
        self.casinha = pygame.transform.scale(self.casinha, (180, 180))
        self.casinha_pos = (500, 110)
        self.botao_proxima_fase = pygame.image.load("assets/botao_proxima_fase.png")
        self.botao_proxima_fase = pygame.transform.scale(self.botao_proxima_fase, (80, 80))
        self.botao_proxima_fase_pos = (500, 400)
        self.rect_botao = self.botao_proxima_fase.get_rect(topleft=self.botao_proxima_fase_pos)

    def handle_event(self, event):
        if event.type == pygame.MOUSEBUTTONDOWN:
            mouse_pos = event.pos

            # botão da sidebar
            if self.sidebar.handle_event(event):
                    return CriarFase()

            # botão do mapa
            if self.rect_botao.collidepoint(mouse_pos):
                dados_da_api = FaseService.buscar_detalhes_fase(1)
                
                if dados_da_api:
                    return Fase(dados_da_api)
        
        return None

    def desenhar(self, screen):
        screen.fill("#3D3267")
        self.sidebar.desenhar(screen)
        screen.blit(self.casinha, self.casinha_pos)
        screen.blit(self.botao_proxima_fase, self.botao_proxima_fase_pos)