import Grid from 'tui-grid'
import 'tui-grid/dist/tui-grid.css'
import { useEffect, useMemo, useRef } from 'react'

const auditColumnNames = ['createdBy', 'createdAt', 'updatedBy', 'updatedAt']
const auditColumns = [
  { header: '등록자', name: 'createdBy', width: 110, align: 'center' },
  { header: '등록일자', name: 'createdAt', width: 160, align: 'center' },
  { header: '수정자', name: 'updatedBy', width: 110, align: 'center' },
  { header: '수정일자', name: 'updatedAt', width: 160, align: 'center' },
]

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
  includeAuditColumns = true,
  minBodyHeight = 300,
  onRowDoubleClick,
  rowHeaders = ['rowNum'],
  summaryColumns = [],
}) {
  const containerRef = useRef(null)
  const gridRef = useRef(null)
  const onRowDoubleClickRef = useRef(onRowDoubleClick)
  const effectiveColumns = useMemo(() => (
    includeAuditColumns ? appendAuditColumns(columns) : columns
  ), [columns, includeAuditColumns])
  const effectiveData = useMemo(() => (
    includeAuditColumns ? normalizeAuditRows(data) : data
  ), [data, includeAuditColumns])
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
      columns: effectiveColumns,
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
  }, [effectiveColumns, minBodyHeight, rowHeaders, summary])

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

    gridRef.current.resetData(effectiveData)
  }, [effectiveData])

  return <div className="wms-grid" ref={containerRef} />
}

function appendAuditColumns(columns) {
  const businessColumns = columns.filter((column) => !auditColumnNames.includes(column.name))
  return [...businessColumns, ...auditColumns]
}

function normalizeAuditRows(rows = []) {
  return rows.map((row) => ({
    ...row,
    createdBy: row.createdBy ?? row.createdByName ?? row.createdUserName ?? '시스템',
    createdAt: formatAuditDate(row.createdAt),
    updatedBy: row.updatedBy ?? row.updatedByName ?? row.updatedUserName ?? '시스템',
    updatedAt: formatAuditDate(row.updatedAt),
  }))
}

function formatAuditDate(value) {
  if (!value) {
    return ''
  }

  if (Array.isArray(value)) {
    const [year, month, day, hour = 0, minute = 0, second = 0] = value
    return `${year}-${pad(month)}-${pad(day)} ${pad(hour)}:${pad(minute)}:${pad(second)}`
  }

  const text = String(value).trim()

  if (!text) {
    return ''
  }

  const normalizedText = text.replace('T', ' ').replace(/\.\d+$/, '')

  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(normalizedText)) {
    return normalizedText.slice(0, 19)
  }

  const date = new Date(text)

  if (Number.isNaN(date.getTime())) {
    return text
  }

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join('-') + ` ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

function pad(value) {
  return String(value).padStart(2, '0')
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
