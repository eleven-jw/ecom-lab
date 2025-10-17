import { Carousel, Skeleton, Typography } from 'antd'
import type { CarouselProps } from 'antd/es/carousel'

import { useGetBannersQuery } from '../../services/api'

const carouselSettings: CarouselProps = {
  autoplay: true,
  autoplaySpeed: 5000,
  dots: true,
  draggable: true,
  pauseOnHover: true,
  adaptiveHeight: true,
}

export function BannerCarousel() {
  const { data = [], isLoading, isError } = useGetBannersQuery()


  if (isLoading) {
    return <Skeleton.Image active style={{ width: '100%', height: 280 }} />
  }

  if (isError) {
    return (
      <div className="page-container" style={{ textAlign: 'center' }}>
        <Typography.Text type="danger">
          Unable to load featured campaigns right now.
        </Typography.Text>
      </div>
    )
  }

  if (!data.length) {
    return null
  }

  return (
    <Carousel {...carouselSettings} style={{ borderRadius: 16, overflow: 'hidden' }}>
      {data.map((banner) => (
        <div key={banner.id}>
          <div
            style={{
              position: 'relative',
              height: 320,
              display: 'flex',
              alignItems: 'flex-end',
              backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.85)), url(${banner.imageUrl})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              padding: '2rem 2.5rem',
              color: '#ffffff',
            }}
          >
            <div>
              <Typography.Title level={2} style={{ color: '#ffffff', marginBottom: 4 }}>
                {banner.title}
              </Typography.Title>
              {banner.description ? (
                <Typography.Paragraph style={{ color: '#f8fafc', maxWidth: 520 }}>
                  {banner.description}
                </Typography.Paragraph>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  )
}

export default BannerCarousel
