# telas/criar_opcao.py
import pygame
from telas.tela import Tela

class CriarOpcao(Tela):
    def __init__(self, tela_pai):
        super().__init__()
        self.tela_pai = tela_pai # Guarda a tela de CriarFase para voltar depois
        self.texto = ""
        self.correta = False
        self.fonte = pygame.font.SysFont("Arial", 24)

    def handle_event(self, event):
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_RETURN:
                # Salva a opção na lista da tela pai e volta
                self.tela_pai.opcoes.append({"texto": self.texto, "correta": self.correta})
                return self.tela_pai
            
            elif event.key == pygame.K_BACKSPACE:
                self.texto = self.texto[:-1]
            else:
                if event.unicode.isprintable():
                    self.texto += event.unicode
        return None

    def desenhar(self, screen):
        overlay = pygame.Surface((1280, 680), pygame.SRCALPHA)
        overlay.fill((0, 0, 0, 150)) # Preto com 150 de opacidade
        screen.blit(overlay, (0, 0))

        modal_rect = pygame.Rect(390, 200, 500, 250)
        pygame.draw.rect(screen, "#3D3267", modal_rect, border_radius=15)
        pygame.draw.rect(screen, "#5D4DA0", modal_rect, width=2, border_radius=15)

        label_surface = self.fonte.render("Texto da Alternativa:", True, (200, 200, 200))
        screen.blit(label_surface, (modal_rect.x + 40, modal_rect.y + 40))

        input_rect = pygame.Rect(modal_rect.x + 40, modal_rect.y + 80, 420, 45)
        pygame.draw.rect(screen, "#2F3356", input_rect, border_radius=8)

        texto_surface = self.fonte.render(self.texto, True, (255, 255, 255))
        screen.blit(texto_surface, (input_rect.x + 10, input_rect.y + 10))

        dica_surface = self.fonte.render("Pressione ENTER para confirmar", True, (100, 100, 100))
        screen.blit(dica_surface, (modal_rect.x + 40, modal_rect.y + 180))