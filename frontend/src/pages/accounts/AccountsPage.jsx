import { useState } from 'react'
import { CommonGridLookupModal } from '../../components/common/LookupPopup.jsx'
import { StandardWorkPage } from '../StandardWorkPage.jsx'

const accountColumns = [
  { header: '거래처 코드', name: 'accountCode', width: 150 },
  { header: '거래처명', name: 'accountName', width: 200 },
  { header: '구분', name: 'accountTypeSubCode', width: 110, align: 'center' },
  { header: '청구거래처명', name: 'billAccountName', width: 180 },
  { header: '사업자등록번호', name: 'businessRegNo', width: 150 },
  { header: '대표자', name: 'ceoName', width: 120 },
  { header: '업태', name: 'businessType', width: 140 },
  { header: '업종', name: 'businessItem', width: 140 },
  { header: '국가', name: 'country', width: 90, align: 'center' },
  { header: '이메일', name: 'email', width: 200 },
  { header: '전화번호', name: 'phoneNo', width: 140 },
  { header: '팩스', name: 'faxNo', width: 140 },
  { header: '담당자', name: 'managerName', width: 110 },
  { header: '사용 여부', name: 'useYn', width: 90, align: 'center' },
]

const accountTypeOptions = [
  { label: '본사', value: 'HQ' },
  { label: '고객사', value: 'CUSTOMER' },
  { label: '공급사', value: 'SUPPLIER' },
]

const useYnOptions = [
  { label: 'Y', value: 'Y' },
  { label: 'N', value: 'N' },
]

const accountLookupColumns = [
  { header: '거래처 코드', name: 'accountCode', width: 200 },
  { header: '거래처명', name: 'accountName', width: 320 },
  { header: '구분', name: 'accountTypeSubCode', width: 140, align: 'center' },
]

const accountLookupSearchFields = [
  { name: 'keyword', label: '거래처', placeholder: '거래처 코드 또는 거래처명', keys: ['accountCode', 'accountName', 'accountTypeSubCode'] },
]

export function AccountsPage({ authUser, data, onRefresh, page }) {
  const [accountLookupContext, setAccountLookupContext] = useState(null)

  return (
    <>
      <StandardWorkPage
        authUser={authUser}
        buildPayload={(row) => ({
          accountCode: row.accountCode,
          accountName: row.accountName,
          accountTypeSubCode: row.accountTypeSubCode,
          useYn: row.useYn ?? 'Y',
          detailDescription: row.detailDescription,
          billAccountName: row.billAccountName,
          businessRegNo: row.businessRegNo,
          ceoName: row.ceoName,
          businessType: row.businessType,
          businessItem: row.businessItem,
          country: row.country,
          email: row.email,
          phoneNo: row.phoneNo,
          faxNo: row.faxNo,
          managerName: row.managerName,
          note: row.note,
        })}
        columns={accountColumns}
        createDefaults={{ accountTypeSubCode: 'CUSTOMER', country: 'KR', useYn: 'Y' }}
        createSuccessMessage="거래처가 등록되었습니다."
        data={data.accounts}
        detailFields={[
          { name: 'accountCode', label: '거래처 코드', section: '기본 정보', required: true, readOnlyOnEdit: true },
          { name: 'accountName', label: '거래처명', section: '기본 정보', required: true },
          { name: 'accountTypeSubCode', label: '거래처 구분', section: '기본 정보', type: 'select', options: accountTypeOptions, required: true },
          { name: 'billAccountName', label: '청구거래처명', section: '기본 정보' },
          { name: 'detailDescription', label: '상세 설명', section: '기본 정보', wide: true },
          { name: 'useYn', label: '사용 여부', section: '기본 정보', type: 'select', options: useYnOptions, required: true },
          { name: 'businessRegNo', label: '사업자등록번호', section: '사업자 정보' },
          { name: 'ceoName', label: '대표자명', section: '사업자 정보' },
          { name: 'businessType', label: '업태', section: '사업자 정보' },
          { name: 'businessItem', label: '업종', section: '사업자 정보' },
          { name: 'country', label: '국가', section: '연락처 정보' },
          { name: 'email', label: '이메일', section: '연락처 정보' },
          { name: 'phoneNo', label: '전화번호', section: '연락처 정보' },
          { name: 'faxNo', label: '팩스', section: '연락처 정보' },
          { name: 'managerName', label: '담당자', section: '연락처 정보' },
          { name: 'note', label: '비고', section: '연락처 정보', wide: true },
        ]}
        detailTabLabel="상세 목록"
        endpoint="/api/accounts"
        hideHeader
        keepDetailAfterSave
        listTabLabel="거래처 목록"
        onRefresh={onRefresh}
        page={{ ...page, eyebrow: '기준정보', title: '거래처' }}
        searchFieldAction={(field, searchParams, searchContext) => {
          if (field.name === 'accountLookup') {
            setAccountLookupContext({ setSearchParams: searchContext.setSearchParams })
          }
        }}
        searchFields={[
          { name: 'accountLookup', label: '거래처', type: 'lookup', codeField: 'accountCode', nameField: 'accountName' },
          { name: 'accountTypeSubCode', label: '거래처 구분', type: 'select', options: accountTypeOptions },
          { name: 'useYn', label: '사용 여부', type: 'select', options: useYnOptions },
        ]}
      />
      <CommonGridLookupModal
        columns={accountLookupColumns}
        data={data.accounts}
        emptyMessage="조회된 거래처가 없습니다."
        initialFilters={{ keyword: '' }}
        open={Boolean(accountLookupContext)}
        searchFields={accountLookupSearchFields}
        title="거래처 조회"
        onClose={() => setAccountLookupContext(null)}
        onSelect={(account) => {
          accountLookupContext?.setSearchParams((current) => ({
            ...current,
            accountCode: account.accountCode,
            accountName: account.accountName,
          }))
          setAccountLookupContext(null)
        }}
      />
    </>
  )
}
