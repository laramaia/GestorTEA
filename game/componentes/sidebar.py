import pygame

class Sidebar:
    def __init__(self, largura, altura):
        self.largura = largura
        self.altura = altura
        self.retangulo = pygame.Rect(0, 0, largura, altura)
        self.cor_fundo = "#2B2348" 
        self.btn_adicionar_fase = pygame.Rect(80, 200, 150, 45) # 150, 45
        self.fonte = pygame.font.SysFont("arial", 18)

    def handle_event(self, event):
        if event.type == pygame.MOUSEBUTTONDOWN:
            if self.btn_adicionar_fase.collidepoint(event.pos):
                return True
        return False

    def desenhar(self, screen):
        pygame.draw.rect(screen, self.cor_fundo, self.retangulo)
        pygame.draw.rect(screen, "#423769", self.btn_adicionar_fase, border_radius=15)
        texto = self.fonte.render("Criar fase", True, "white")
        texto_rect = texto.get_rect(center=self.btn_adicionar_fase.center)
        screen.blit(texto, texto_rect)