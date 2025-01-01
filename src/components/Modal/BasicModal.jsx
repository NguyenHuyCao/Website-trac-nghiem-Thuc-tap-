import Modal from "react-modal";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// eslint-disable-next-line react/prop-types
const BasicModal = ({ isOpen, onRequestClose, children }) => {
  Modal.setAppElement("#root");
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="fixed inset-0 flex items-center justify-center p-4"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50  z-[99999]"
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
    >
      <div className="mt-10 bg-white rounded-lg shadow-md max-w-3xl w-full p-6 relative max-h-[80vh] overflow-y-auto">
        {/* Nút đóng modal */}
        <button
          onClick={onRequestClose}
          className="absolute top-2 right-2 w-7 text-red-500 hover:text-red-700 focus:outline-none bg-transparent border-none rounded-lg text-xl font-bold transition duration-200 ease-in-out transform hover:bg-gray-200"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        {/* Nội dung modal */}
        {children}
      </div>
    </Modal>
  );
};

export default BasicModal;
