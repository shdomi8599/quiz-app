import { Dispatch, SetStateAction, useCallback, useState } from "react";

type Props = {
  setMistakeContent?: Dispatch<SetStateAction<string>>;
};

export const useModalUtil = ({ setMistakeContent }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleModalCancel = useCallback(() => {
    setIsModalOpen(false);
    setMistakeContent && setMistakeContent("");
  }, []);

  return {
    isModalOpen,
    showModal,
    handleModalCancel,
  };
};
