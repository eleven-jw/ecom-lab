import { Skeleton, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

import { BannerCarousel } from '../components/home/BannerCarousel'
import { CategoryRail } from '../components/home/CategoryRail'
import { FlashSaleSection } from '../components/home/FlashSaleSection'
import { FeaturedBrands } from '../components/home/FeaturedBrands'
import { HotEventsCard } from '../components/home/HotEventsCard'
import { ProductFloor } from '../components/home/ProductFloor'
import { QuickEntryGrid } from '../components/home/QuickEntryGrid'
import { UserGreetingCard } from '../components/home/UserGreetingCard'
import { useGetHomeContentQuery } from '../services/api'
import './HomePage.css'

export default function HomePage() {
  const { t } = useTranslation()
  const { data, isLoading } = useGetHomeContentQuery()

  const isHydrating = isLoading && !data

  return (
    <div className="home-page">
      <Typography.Title level={3}>{t('pages.home.title')}</Typography.Title>
      <Typography.Paragraph>{t('pages.home.description')}</Typography.Paragraph>

      <div className="home-hero">
        <div className="home-hero__aside">
          {isHydrating ? (
            <Skeleton active paragraph={{ rows: 9 }} />
          ) : data ? (
            <CategoryRail categories={data.categories} />
          ) : null}
        </div>

        <div className="home-hero__main">
          <div className="home-hero__banner">
            <BannerCarousel />
          </div>
          <div className="home-hero__quick-links">
            {isHydrating ? (
              <Skeleton active paragraph={{ rows: 2 }} />
            ) : data ? (
              <QuickEntryGrid entries={data.quickLinks} />
            ) : null}
          </div>
        </div>

        <div className="home-hero__sidebar">
          <UserGreetingCard />
          {isHydrating ? (
            <Skeleton active paragraph={{ rows: 5 }} style={{ marginTop: 16 }} />
          ) : data ? (
            <HotEventsCard events={data.brands.slice(0, 2)} />
          ) : null}
        </div>
      </div>

      {isHydrating ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : data ? (
        <>
          <FlashSaleSection flashSale={data.flashSale} />
          <FeaturedBrands brands={data.brands} />
          {data.floors.map((floor) => (
            <ProductFloor key={floor.id} floor={floor} />
          ))}
        </>
      ) : null}
    </div>
  )
}
