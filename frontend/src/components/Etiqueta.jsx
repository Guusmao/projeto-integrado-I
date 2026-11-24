import { formatarMoeda, formatarPercentual, calcularPrecoComDesconto } from '../util'

// A etiqueta amarela de gôndola: o mesmo desenho na consulta e na prévia do cadastro.
export default function Etiqueta({ preco, desconto, compacta = false }) {
  const temDesconto = Number(desconto) > 0
  const comDesconto = calcularPrecoComDesconto(preco, desconto)
  const [reais, centavos] = formatarMoeda(preco).replace('R$', '').trim().split(',')

  return (
    <div className={`etiqueta ${compacta ? 'etiqueta-compacta' : ''}`}>
      <p className="etiqueta-rotulo">Preço de venda à vista</p>
      <p className="etiqueta-preco" aria-label={formatarMoeda(preco)}>
        <span className="etiqueta-moeda">R$</span>
        <span>{reais}</span>
        <span className="etiqueta-centavos">,{centavos}</span>
      </p>

      {temDesconto && (
        <div className="etiqueta-desconto">
          <p>
            Com {formatarPercentual(desconto)} de desconto
            <strong className="block etiqueta-preco-desconto">{formatarMoeda(comDesconto)}</strong>
          </p>
          <p className="etiqueta-economia">
            Economiza {formatarMoeda(Number(preco) - comDesconto)}
          </p>
        </div>
      )}
    </div>
  )
}
