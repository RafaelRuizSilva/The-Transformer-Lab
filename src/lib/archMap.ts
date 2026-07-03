// Mapeia o índice da etapa (0-14) para o nó do diagrama de arquitetura (0-8)
export const ARCH_NODE_FOR_STEP: Record<number, number> = {
  0: 0, // entrada
  1: 0, // tokenização
  2: 1, // embeddings
  3: 1, // posição
  4: 2, // qkv
  5: 2, // scores
  6: 2, // softmax
  7: 2, // weighted values
  8: 2, // multi-head
  9: 3, // add & norm 1
  10: 4, // ffn
  11: 5, // add & norm 2
  12: 6, // logits
  13: 7, // probabilidades
  14: 8, // saída
}
