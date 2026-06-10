import Grid from 'tui-grid'
import 'tui-grid/dist/tui-grid.css'
import { useEffect, useMemo, useRef } from 'react'

Grid.applyTheme('clean', {
  grid: {
    border: '#cfd8e3',
  },
  header: {
    background: '#f3f6fa',
    border: '#cfd8e3',
    text: '#172033',
  },
  row: {
    even: {
      background: '#ffffff',
    },
    odd: {
      background: '#f8fafc',
    },
    hover: {
      background: '#eff6ff',
    },
  },
  cell: {
    normal: {
      border: '#cfd8e3',
      text: '#27364a',
    },
    header: {
      border: '#cfd8e3',
      text: '#172033',
    },
    selectedHeader: {
      background: '#dbeafe',
    },
    focused: {
      border: '#2563eb',
    },
  },
})

export function WmsGrid({
  columns,
  data,
  fillHeight = false,
  minBodyHeight = 300,
  onRowDoubleClick,
  rowHeaders = ['rowNum'],
  summaryColumns = [],
}) {
  const containerRef = useRef(null)
  const gridRef = useRef(null)
  const onRowDoubleClickRef = useRef(onRowDoubleClick)
  const summary = useMemo(() => buildSummary(summaryColumns), [summaryColumns])

  useEffect(() => {
    onRowDoubleClickRef.current = onRowDoubleClick
  }, [onRowDoubleClick])

  useEffect(() => {
    if (!containerRef.current) {
      return undefined
    }

    gridRef.current = new Grid({
      el: containerRef.current,
      data: [],
      columns,
      rowHeaders,
      bodyHeight: minBodyHeight,
      minBodyHeight,
      rowHeight: 32,
      minRowHeight: 32,
      scrollX: true,
      scrollY: true,
      columnOptions: {
        resizable: true,
      },
      summary,
    })

    gridRef.current.on('dblclick', () => {
      if (!onRowDoubleClickRef.current || !gridRef.current) {
        return
      }

      const focusedCell = gridRef.current.getFocusedCell()

      if (focusedCell.rowKey == null) {
        return
      }

      const row = gridRef.current.getRow(focusedCell.rowKey)

      if (row) {
        onRowDoubleClickRef.current(row)
      }
    })

    return () => {
      gridRef.current.destroy()
      gridRef.current = null
    }
  }, [columns, minBodyHeight, rowHeaders, summary])

  useEffect(() => {
    if (!fillHeight || !containerRef.current) {
      return undefined
    }

    const updateBodyHeight = () => {
      if (!containerRef.current) return

      const availableHeight = containerRef.current.clientHeight
      const nextBodyHeight = Math.max(minBodyHeight, availableHeight - 40)

      if (gridRef.current?.setBodyHeight) {
        gridRef.current.setBodyHeight(nextBodyHeight)
      }
    }

    updateBodyHeight()

    const observer = new ResizeObserver(updateBodyHeight)
    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [fillHeight, minBodyHeight])

  useEffect(() => {
    if (!gridRef.current) {
      return
    }

    gridRef.current.resetData(data)
  }, [data])

  return <div className="wms-grid" ref={containerRef} />
}

function buildSummary(summaryColumns) {
  if (summaryColumns.length === 0) {
    return undefined
  }

  const columnContent = {}

  for (const columnName of summaryColumns) {
    columnContent[columnName] = {
      template(summary) {
        return summary.sum.toLocaleString()
      },
    }
  }

  return {
    height: 32,
    position: 'bottom',
    columnContent,
  }
}
