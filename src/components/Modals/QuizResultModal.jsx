import { Modal } from "antd";

const QuizResultModal = (quizResult, isModalVisible, onCancel) => {
  return (
    <Modal
      title="Kết quả bài thi"
      open={isModalVisible}
      onOk={onCancel}
      cancelButtonProps={{ style: { display: "none" } }}
    >
      <p>
        Số câu đúng: {quizResult.correctCount} <br />
        Số câu sai: {quizResult.incorrectCount} <br />
        Điểm của bạn: {quizResult.score} / 100
      </p>
    </Modal>
  );
};

export default QuizResultModal;
