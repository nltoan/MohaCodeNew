import { IconZalo } from '@/components/icons';
import { useState, type ReactNode, type MouseEvent } from 'react';
import { Container, Image, Modal } from 'react-bootstrap';
import './Footer.scss';
import { APP_CONFIG } from '@/configs';
import { useTranslation } from 'react-i18next';

interface SocialsProps {
  items: { url: string; title?: string; icon: string | ReactNode }[];
}

export const Footer = () => {
  const { t } = useTranslation();
  const [showQRModal, setShowQRModal] = useState(false);
  const qr = {
    src: `https://api.qrserver.com/v1/create-qr-code/?size=48x48&data=${window.location.href}`,
    alt: 'QR trang',
  };
  const bigqr = {
    src: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${window.location.href}`,
    alt: 'QR trang',
  };
  const certificate = APP_CONFIG.footer.certificate;
  const SOCIALS_CONFIG: SocialsProps = {
    items: [
      // { icon: <IconMessageQuestion />, title: 'Message', url: '/1' },
      { icon: <IconZalo />, title: 'Zalo', url: APP_CONFIG.footer.zalo ?? '' },
    ],
  };
  const handleGoToTop = (e: MouseEvent) => {
    e.preventDefault();
    window.scrollTo(0, 0);
  };
  return (
    <>
      <footer className="mh-footer">
        <Container>
          <div className="mh-footer-inner">
            <div className="mh-footer-left">
              {certificate ? <Image loading="lazy" {...certificate} /> : <></>}
            </div>
            <div className="mh-footer-center">
              <h4>{t('footer.title')}</h4>
              <p>
                {t('footer.description.license')}
                <br />
                {t('footer.description.responsible')}
                <br />
                {t('footer.description.unit')}
                <br />
                {t('footer.description.copyright')}
                <br />
                {t('footer.description.contact')}
                <br />
              </p>
            </div>
            <div style={{order:3,display:"flex"}}>
              {qr ? <Image loading="lazy" {...qr} onClick={() => setShowQRModal(true)} /> : <></>}
              {SOCIALS_CONFIG.items.map((item) => (
                <a key={item.url} href={item.url} title={item.title} target="_blank">
                  {typeof item.icon === 'string' ? <Image src={item.icon} alt={item.title} /> : item.icon}
                </a>
              ))}
            </div>
            <div className="mh-socials">
              <a href="#" title="Go to top" onClick={handleGoToTop}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M18.07 9.57L12 3.5L5.92999 9.57"
                    stroke="var(--mh-primary-icon-color, #903315)"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 20.4999V3.66992"
                    stroke="var(--mh-primary-icon-color, #903315)"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>
        </Container>
      </footer>

      <Modal centered show={showQRModal} onHide={() => setShowQRModal(false)}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>{qr ? <Image loading="lazy" {...bigqr} width="100%" /> : <></>}</Modal.Body>
      </Modal>
    </>
  );
};
