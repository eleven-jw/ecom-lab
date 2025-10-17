import { Card, Col, Row, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

import { BannerCarousel } from '../components/home/BannerCarousel'
import { useGetCategoriesQuery } from '../services/api'

export default function HomePage() {
  const { t } = useTranslation()
  const { data: categories, isLoading } = useGetCategoriesQuery()

  return (
    <div className="page-container">
      <Typography.Title level={3}>{t('pages.home.title')}</Typography.Title>
      <Typography.Paragraph>{t('pages.home.description')}</Typography.Paragraph>

      <BannerCarousel />

      <Typography.Title level={4} style={{ marginTop: 32 }}>
        {t('pages.home.categoriesTitle')}
      </Typography.Title>

      <Row gutter={[16, 16]}>
        {(categories ?? Array.from({ length: 3 })).map((category, index) => (
          <Col xs={24} sm={12} md={8} key={category?.id ?? `placeholder-${index}`}>
            <Card
              loading={isLoading}
              cover={
                category?.imageUrl ? (
                  <div
                    style={{
                      height: 160,
                      backgroundImage: `url(${category.imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                ) : undefined
              }
            >
              <Card.Meta
                title={category?.name ?? 'Loading...'}
                description={
                  category ? t('pages.home.categoriesDescription') : ' '
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}
