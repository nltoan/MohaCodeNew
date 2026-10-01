import { Col, Container, Row } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import './AboutPage.scss';
import { AboutSidebar, type AboutSidebarProps } from './components/sidebar/SideBar';
import buttonBg1 from '../../assets/images/background/button-1-bg.png';
import buttonBg2 from '../../assets/images/background/button-2-bg.png';
import buttonBg3 from '../../assets/images/background/button-3-bg.png';
import image1 from '../../assets/images/trang-tin-bo-truong-2.png';
import image2 from '../../assets/images/hoi-quy.png';
import { IconCalendarTick } from '@/components/icons';

export const AboutPage = () => {
  const SIDEBAR_CONFIG: AboutSidebarProps = {
    ctaImage: {
      image: { src: image1, alt: '' },
      linkProps: { to: '/#' },
    },
    ctaButton: {
      icon: <IconCalendarTick height={40} width={40} />,
      label: 'Lịch tiếp công dân của bộ trưởng',
      linkProps: { to: '/#' },
    },
    ctaButton2: {
      label: 'ĐẢNG BỘ BỘ NỘI VỤ',
      to: '/#',
    },
    notice: {
      title: 'Thông báo'
    },
    ctaImage2: {
      image: { src: image2, alt: 'Tra cứu Hội và Quỹ Trung ương' },
      linkProps: { to: '/tra-cuu-hoi-quy' },
    },
    buttons: [
      { linkProps: { to: '/#' }, style: { backgroundImage: `url(${buttonBg1}` }, label: 'CHUYỂN ĐỔI SỐ' },
      { linkProps: { to: '/#' }, style: { backgroundImage: `url(${buttonBg2}` }, label: 'Chương trình, đề án, dự án' },
      { linkProps: { to: '/#' }, style: { backgroundImage: `url(${buttonBg3}` }, label: 'Công ước quốc tế' },
    ],
  };

  return (
    <div className="mh-about">
      <Container>
        <Row>
          <Col xl={8}>
            <div className="mh-about-content">
              <Outlet />
            </div>
          </Col>
          <Col xl={4}>
            <AboutSidebar {...SIDEBAR_CONFIG} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};
