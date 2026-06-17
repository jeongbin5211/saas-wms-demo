export function matchesSearchFields(row, fields, filters) {
  return fields.every((field) => {
    const value = String(filters[field.name] ?? '').trim().toLowerCase()
    if (!value) return true
    if (field.match) return field.match(row, value)

    const keys = field.keys ?? [field.name]
    return keys.some((key) => String(row[key] ?? '').toLowerCase().includes(value))
  })
}
