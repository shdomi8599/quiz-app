import { useCallback, useState } from "react";

type Props = {
  changeMistakeContent?: (content: string) => void;
};

export const useModalUtil = ({ changeMistakeContent }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleModalCancel = useCallback(() => {
    setIsModalOpen(false);
    changeMistakeContent && changeMistakeContent("");
  }, []);

  return {
    isModalOpen,
    showModal,
    handleModalCancel,
  };
};
