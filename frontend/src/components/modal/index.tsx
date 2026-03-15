import React from 'react';
import { Modal, Spinner } from 'react-bootstrap';

// Định nghĩa Props cho Modal
interface CommonModalProps {
  show: boolean;
  onHide: () => void;
  title: string;
  children: React.ReactNode;
  isLoading?: boolean;
  size?: 'sm' | 'lg' | 'xl';
  scrollable?: boolean;
  className?: string;
}

const CommonModal: React.FC<CommonModalProps> = ({
  show,
  onHide,
  title,
  children,
  isLoading = false,
  size = 'lg',
  scrollable = true,
  className = '',
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size={size}
      scrollable={scrollable}
      className={className}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center py-4">
            <Spinner animation="border" variant="primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          children
        )}
      </Modal.Body>
    </Modal>
  );
};

export default CommonModal;