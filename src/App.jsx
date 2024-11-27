import { Breadcrumb } from "antd";

const App = () => (
  <>
    <Breadcrumb
      items={[
        {
          title: "Trang chủ",
        },
        {
          title: <a href="">Cập nhật câu hỏi</a>,
        },
        {
          title: <a href="">Application List</a>,
        },
      ]}
    />
  </>
);

export default App;
