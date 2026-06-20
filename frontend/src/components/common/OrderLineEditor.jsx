import { Plus, Search, Trash2 } from 'lucide-react'

const numberFormatter = new Intl.NumberFormat('ko-KR')

export function OrderLineEditor({
  lines = [],
  onChange,
  onPickItem,
  readOnly = false,
  title = '주문 품목',
  description = '품목을 추가하고 수량과 단가를 입력하세요.',
  emptyMessage = '등록된 품목이 없습니다. 행 추가 버튼으로 품목을 추가하세요.',
}) {
  const totalAmount = lines.reduce((sum, line) => sum + lineAmount(line), 0)
  const totalQuantity = lines.reduce((sum, line) => sum + toNumber(line.orderQuantity), 0)

  const updateLine = (index, patch) => {
    onChange(lines.map((line, i) => (i === index ? { ...line, ...patch } : line)))
  }

  const addLine = () => {
    onChange([...lines, { itemId: '', itemCode: '', itemName: '', orderQuantity: 1, unitPrice: 0 }])
  }

  const removeLine = (index) => {
    onChange(lines.filter((_, i) => i !== index))
  }

  const handlePick = (index) => {
    onPickItem?.((item) => {
      updateLine(index, {
        itemId: item.id,
        itemCode: item.itemCode,
        itemName: item.itemName,
        unitPrice: toNumber(lines[index]?.unitPrice) || toNumber(item.purchasePrice) || toNumber(item.salesPrice) || 0,
      })
    })
  }

  return (
    <section className="order-line-editor">
      <div className="order-line-editor-head">
        <div className="detail-section-title">
          <strong>{title}</strong>
          <span>{description}</span>
        </div>
        {!readOnly ? (
          <button type="button" className="icon-text-button" onClick={addLine}>
            <Plus size={15} />
            <span>행 추가</span>
          </button>
        ) : null}
      </div>

      <div className="order-line-table-wrap">
        <table className="order-line-table">
          <colgroup>
            <col style={{ width: '48px' }} />
            <col style={{ width: '210px' }} />
            <col />
            <col style={{ width: '120px' }} />
            <col style={{ width: '140px' }} />
            <col style={{ width: '150px' }} />
            {!readOnly ? <col style={{ width: '56px' }} /> : null}
          </colgroup>
          <thead>
            <tr>
              <th>No</th>
              <th>품목 코드</th>
              <th>품목명</th>
              <th className="num">수량</th>
              <th className="num">단가</th>
              <th className="num">금액</th>
              {!readOnly ? <th aria-label="삭제" /> : null}
            </tr>
          </thead>
          <tbody>
            {lines.length === 0 ? (
              <tr>
                <td className="order-line-empty" colSpan={readOnly ? 6 : 7}>{emptyMessage}</td>
              </tr>
            ) : (
              lines.map((line, index) => (
                <tr key={index}>
                  <td className="num muted">{index + 1}</td>
                  <td>
                    <div className="order-line-code">
                      <input value={line.itemCode ?? ''} readOnly placeholder="품목 선택" />
                      {!readOnly ? (
                        <button type="button" className="field-lookup-button" aria-label="품목 조회" onClick={() => handlePick(index)}>
                          <Search size={13} />
                        </button>
                      ) : null}
                    </div>
                  </td>
                  <td><input value={line.itemName ?? ''} readOnly placeholder="품목명" /></td>
                  <td className="num">
                    <input
                      className="num"
                      type="number"
                      min="0"
                      readOnly={readOnly}
                      value={line.orderQuantity ?? 0}
                      onChange={(e) => updateLine(index, { orderQuantity: e.target.value })}
                    />
                  </td>
                  <td className="num">
                    <input
                      className="num"
                      type="number"
                      min="0"
                      readOnly={readOnly}
                      value={line.unitPrice ?? 0}
                      onChange={(e) => updateLine(index, { unitPrice: e.target.value })}
                    />
                  </td>
                  <td className="num amount">{numberFormatter.format(lineAmount(line))}</td>
                  {!readOnly ? (
                    <td className="num">
                      <button type="button" className="order-line-remove" aria-label="행 삭제" onClick={() => removeLine(index)}>
                        <Trash2 size={15} />
                      </button>
                    </td>
                  ) : null}
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr>
              <td className="num" colSpan={3}>합계</td>
              <td className="num">{numberFormatter.format(totalQuantity)}</td>
              <td />
              <td className="num amount">{numberFormatter.format(totalAmount)}</td>
              {!readOnly ? <td /> : null}
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  )
}

function lineAmount(line) {
  return toNumber(line.orderQuantity) * toNumber(line.unitPrice)
}

function toNumber(value) {
  if (value === undefined || value === null || value === '') return 0
  const n = Number(value)
  return Number.isNaN(n) ? 0 : n
}
