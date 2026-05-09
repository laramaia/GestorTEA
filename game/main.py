import pygame
from telas.mapa import Mapa
import sys

sys.dont_write_bytecode = True

pygame.init()
screen = pygame.display.set_mode((1280, 680))
clock = pygame.time.Clock()

tela_atual = Mapa()

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        nova_tela = tela_atual.handle_event(event)
        if nova_tela is not None:
            tela_atual = nova_tela

    tela_atual.update()
    tela_atual.desenhar(screen)

    pygame.display.flip()
    clock.tick(60)

pygame.quit()