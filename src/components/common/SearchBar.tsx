import { Input } from 'antd'

interface SearchBarProps {
  placeholder: string
  buttonText: string
  onSearch: (value: string) => void
  className?: string
}

export function SearchBar({ placeholder, buttonText, onSearch, className }: SearchBarProps) {
  return (
    <div className={className}>
      <Input.Search
        size="large"
        placeholder={placeholder}
        enterButton={buttonText}
        allowClear
        onSearch={(raw) => {
          onSearch(raw.trim())
        }}
      />
    </div>
  )
}

export default SearchBar
