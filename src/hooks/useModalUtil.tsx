import { useCallback, useState } from "react";

export const useModalUtil = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleModalCancel = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return {
    isModalOpen,
    showModal,
    handleModalCancel,
  };
};
