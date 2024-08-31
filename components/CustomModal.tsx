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
        return <FaExclamationTriangle className="w-12 h-12 fill-current text-yellow-500" />;
      case 'delete':
        return <FaTrash className="w-12 h-12 fill-current text-red-500" />;
      case 'confirm':
        return <FaCheckCircle className="w-12 h-12 fill-current text-green-500" />;
      default:
        return null;
    }
  };

  const getBgColor = () => {
    switch (iconType) {
      case 'warning':
        return 'bg-yellow-50';
      case 'delete':
        return 'bg-red-50';
      case 'confirm':
        return 'bg-green-50';
      default:
        return 'bg-gray-50';
    }
  };

  const getButtonColor = () => {
    switch (iconType) {
      case 'warning':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'delete':
        return 'bg-red-500 hover:bg-red-600';
      case 'confirm':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <Modal
      visible={visible}
      footer={null}
      onCancel={onCancel}
      centered
      className="font-kanit"
    >
      <div className={`flex flex-col items-center text-center p-5 rounded-lg ${getBgColor()}`}>
        <div className="inline-block p-4 rounded-full">
          {getIcon()}
        </div>
        <h2 className="mt-2 font-semibold text-gray-800">{title}</h2>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">{subtitle}</p>
        <div className="flex items-center mt-3 w-full">
          <Button className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button className={`flex-1 px-4 py-2 ml-2 text-white text-sm font-medium rounded-md ${getButtonColor()}`} onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CustomModal;
