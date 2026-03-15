import { Container, Image, type ImageProps } from 'react-bootstrap';
import './HeaderTop.scss';
import imgLeft from '@/assets/images/background/header-left-bg.png';
import imgRight from '@/assets/images/background/header-right-bg.png';
import { useNavigate } from 'react-router-dom';
export interface HeaderTopProps {
  image: ImageProps;
  imageRight?: ImageProps;
  title: string;
  minister?: boolean;
  nqtw4?: boolean;
}
export const HeaderTop = ({ minister, nqtw4, image, imageRight, title }: HeaderTopProps) => {
  const navigation = useNavigate();
  return (
    <div
      className={`mh-header-top ${minister ? 'mh-header-top-minister' : nqtw4 ? 'mh-header-top-nqtw4' : ''}`}
      onClick={() => {
        navigation('/');
      }}
    >
      <div style={{width: "100%", height: "auto", overflow: "hidden"}}>
        <Container>
          <div className="mh-header-top-inner">
            <div className={`mh-header-top-img`}>
              {minister ? <></> : <Image src={imgLeft} className="bg" />}
              <Image src={image.src} alt={image.alt} className={nqtw4 ? 'mh-header-top-img-left' : ''} />
            </div>
            <h1
              className="mh-header-top-title"
              dangerouslySetInnerHTML={{ __html: title.replace(/(?:\r\n|\r|\n)/g, '<br>') }}
            ></h1>
            {imageRight ? (
              <div className="mh-header-top-img">
                {minister ? <></> : <Image src={imgRight} className="bg bg-right" />}
                <Image src={imageRight.src} alt={imageRight.alt} />
              </div>
            ) : (
              <></>
            )}
          </div>
        </Container>
      </div>
    </div>
  );
};
