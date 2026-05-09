import pygame
from telas.tela import Tela

class CriarFase(Tela):
    def __init__(self):
        super().__init__()
        self.fonte = pygame.font.SysFont("Arial", 24)

        # Dados da Fase
        self.nome = ""
        self.enunciado = ""
        self.opcoes = [] 

        self.campo_ativo = "nome"
        self.btn_nova_opcao = pygame.Rect(50, 295, 120, 40)
        self.btn_salvar = pygame.Rect(50, 600, 200, 50)

    def handle_event(self, event):
        # Botão Nova Opção
        if event.type == pygame.MOUSEBUTTONDOWN:
            if self.btn_nova_opcao.collidepoint(event.pos):
                from telas.criar_opcao import CriarOpcao
                return CriarOpcao(self)
            
            if self.btn_salvar.collidepoint(event.pos):
                self.enviar_para_backend()

        # Entrada de Texto
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_TAB:
                self.campo_ativo = "enunciado" if self.campo_ativo == "nome" else "nome"

            elif event.key == pygame.K_BACKSPACE:
                if self.campo_ativo == "nome":
                    self.nome = self.nome[:-1]
                else:
                    self.enunciado = self.enunciado[:-1]
            
            else:
                if event.unicode.isprintable():
                    if self.campo_ativo == "nome":
                        self.nome += event.unicode
                    elif self.campo_ativo == "enunciado":
                        self.enunciado += event.unicode
        
        return None

    def enviar_para_backend(self):
        print(f"Salvando: {self.nome} com {len(self.opcoes)} opções.")

    def desenhar(self, screen):
        screen.fill(("#2C2448"))

        # Título
        titulo = self.fonte.render("Configuração da Fase", True, (255, 255, 255))
        screen.blit(titulo, (50, 30))

        # Campo Nome
        label_nome = self.fonte.render("Nome do Desafio", True, (200, 200, 200))
        screen.blit(label_nome, (50, 95))
        pygame.draw.rect(screen, ("#2F3356"), (50, 125, 600, 40), border_radius=5)
        txt_n = self.fonte.render(self.nome + ("|" if self.campo_ativo == "nome" else ""), True, (255, 255, 255))
        screen.blit(txt_n, (60, 130))

        # Campo Pergunta
        label_enun = self.fonte.render("Pergunta (Enunciado)", True, (200, 200, 200))
        screen.blit(label_enun, (50, 185))
        pygame.draw.rect(screen, ("#2F3356"), (50, 215, 600, 40), border_radius=5)
        txt_e = self.fonte.render(self.enunciado + ("|" if self.campo_ativo == "enunciado" else ""), True, (255, 255, 255))
        screen.blit(txt_e, (60, 220))

        # Seção Alternativas
        label_opt = self.fonte.render("Alternativas", True, (200, 200, 200))
        screen.blit(label_opt, (50, 295)) 
        
        # Botão + Novo
        pygame.draw.rect(screen, ("#4CAF50"), self.btn_nova_opcao, border_radius=8)
        txt_novo = self.fonte.render("+ Adicionar", True, (255, 255, 255))
        screen.blit(txt_novo, (self.btn_nova_opcao.x + 10, self.btn_nova_opcao.y + 5))

        for i, opt in enumerate(self.opcoes):
            cor = "#4CAF50" if opt['correta'] else (255, 255, 255)
            prefixo = "[CORRETA] " if opt['correta'] else f"{i+1}. "
            
            txt_surface = self.fonte.render(f"{prefixo}{opt['texto']}", True, cor)
            screen.blit(txt_surface, (60, 350 + (i * 40)))

        pygame.draw.rect(screen, "#5D4DA0", self.btn_salvar, border_radius=8)
        txt_save = self.fonte.render("SALVAR", True, (255, 255, 255))
        screen.blit(txt_save, (self.btn_salvar.x + 20, self.btn_salvar.y + 10))