import { Card } from 'antd'
import { useNavigate } from 'react-router-dom'

import type { HomeQuickLink } from '../../services/types'

interface QuickEntryGridProps {
  entries: HomeQuickLink[]
}

export function QuickEntryGrid({ entries }: QuickEntryGridProps) {
  const navigate = useNavigate()

  if (!entries.length) return null

  return (
    <div className="quick-entry-grid">
      {entries.map((entry) => (
        <Card
          key={entry.id}
          hoverable
          bordered={false}
          className="quick-entry-grid__item"
          onClick={() => {
            navigate(entry.href)
          }}
        >
          <div className="quick-entry-grid__inner">
            <img
              src={entry.iconUrl}
              alt=""
              className="quick-entry-grid__icon"
              loading="lazy"
            />
            <div className="quick-entry-grid__copy">
              <span className="quick-entry-grid__title">{entry.title}</span>
              <span className="quick-entry-grid__description">{entry.description}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default QuickEntryGrid
