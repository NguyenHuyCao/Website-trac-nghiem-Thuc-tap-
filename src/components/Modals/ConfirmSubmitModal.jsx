import { Modal } from "antd";

const ConfirmSubmitModal = (isModalVisible, onConfirm, onCancel) => {
  return (
    <Modal
      title="Xác nhận nộp bài"
      open={isModalVisible}
      onOk={onConfirm}
      onCancel={onCancel}
    >
      <p>Bạn vẫn còn câu hỏi chưa trả lời. Bạn có chắc chắn muốn nộp bài?</p>
    </Modal>
  );
};

export default ConfirmSubmitModal;
