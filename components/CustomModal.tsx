import React from 'react';
import { Modal, Button } from 'antd';
import { FaExclamationTriangle, FaTrash, FaCheckCircle } from 'react-icons/fa';

interface CustomModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  subtitle: string;
  confirmText: string;
  cancelText: string;
  iconType: 'warning' | 'delete' | 'confirm';
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  title,
  subtitle,
  confirmText,
  cancelText,
  iconType,
}) => {
  const getIcon = () => {
    switch (iconType) {
      case 'warning':
        return <FaExclamationTriangle className="w-11 h-11 fill-current text-warning" />;
      case 'delete':
        return <FaTrash className="w-10 h-10 fill-current text-danger" />;
      case 'confirm':
        return <FaCheckCircle className="w-11 h-11 fill-current text-success" />;
      default:
        return null;
    }
  };

  const getBgColor = () => {
    switch (iconType) {
      case 'warning':
        return 'bg-warning-soft';
      case 'delete':
        return 'bg-danger-soft';
      case 'confirm':
        return 'bg-success-soft';
      default:
        return 'bg-sunken';
    }
  };

  const getButtonColor = () => {
    switch (iconType) {
      case 'delete':
        return 'bg-danger hover:opacity-90';
      case 'confirm':
        return 'bg-success hover:opacity-90';
      case 'warning':
      default:
        return 'bg-accent hover:bg-accent-hover';
    }
  };

  return (
    <Modal
      visible={visible}
      footer={null}
      onCancel={onCancel}
      centered
      className="font-sans"
    >
      <div className={`flex flex-col items-center rounded-2xl p-6 text-center ${getBgColor()}`}>
        <div className="inline-block p-3">{getIcon()}</div>
        <h2 className="mt-2 font-serif text-lg font-medium text-ink">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{subtitle}</p>
        <div className="mt-4 flex w-full items-center gap-2">
          <Button className="flex-1 rounded-full border border-line bg-raised px-4 py-2 text-sm font-medium text-ink-soft hover:text-ink" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button className={`flex-1 rounded-full px-4 py-2 text-sm font-medium text-ink-invert ${getButtonColor()}`} onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CustomModal;
