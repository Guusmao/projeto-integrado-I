export const formatarMoeda = (valor) =>
  (Number(valor) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export const calcularPrecoComDesconto = (preco, desconto) => {
  const p = Number(preco) || 0
  return p - (p * ((Number(desconto) || 0) / 100))
}

export const formatarPercentual = (valor) =>
  `${(Number(valor) || 0).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%`
