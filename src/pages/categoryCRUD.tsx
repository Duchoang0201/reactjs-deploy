import React, { useEffect, useState } from "react";
import "./App.css";
import { Button, Form, Input, message, Modal, Space, Table } from "antd";
import axios from "axios";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

interface DataType {
  id: number;
  name: string;
  description: string;
}

function CategoryCRUD() {
  const API_URL = "http://localhost:9000/categories";
  const [categories, setCategories] = useState<Array<DataType>>([]);
  const [refresh, setrefresh] = useState(0);
  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [updateId, setUpdateId] = useState(0);
  useEffect(() => {
    axios
      .get(API_URL)
      .then((res: any) => {
        setCategories(res.data);
      })
      .catch((error) => {
        console.log("Error:", error);
        alert("Something went wrong!");
      });
  }, [refresh]);

  // Create new Item
  const handleSumbit = (data: any) => {
    console.log(data);
    axios
      .post(API_URL, data)
      .then((res) => {
        console.log(res);
        message.success("Thêm mới danh mục thành công", 1.5);
        setrefresh((f) => f + 1);
        createForm.resetFields();
      })
      .catch((err) => console.log(err));
  };
  // Patch Item
  const handleUpdate = (record: any) => {
    console.log(updateId, record);
    // axios
    //   .patch(API_URL + "/" + updateId, record)
    //   .then((res) => {
    //     console.log(res);
    //     message.success("Sửa danh mục thành công", 1.5);
    //     setrefresh((f) => f + 1);
    //     updateForm.resetFields();
    //     setOpen(false);
    //   })
    //   .catch((err) => console.log(err));
  };
  //Delte Item
  const handleDelete = (data: any) => {
    console.log(data);
    axios
      .delete(API_URL + "/" + data)
      .then((res) => {
        console.log(res.data);
        message.success("Xóa danh mục thành công", 1.5);
        setrefresh((f) => f + 1);
      })
      .catch((err) => console.log(err));
  };

  //Patch Item

  const columns = [
    {
      title: "Id",
      key: "id",
      width: "1%",
      render: (text: any, record: any, index: any) => (
        <div key={index}> {index + 1}</div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "id",
    },
    {
      title: "Function",
      dataIndex: "function",
      key: "id",
      render: (text: string, record: any) => (
        <div>
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setOpen(true);
                setUpdateId(record._id);
                updateForm.setFieldsValue(record);
              }}
            />
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record._id)}
            />
          </Space>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="container d-flex flex-row justify-content-center">
        <Form
          form={createForm}
          // labelCol={{ span: 8 }}
          // wrapperCol={{ span: 16 }}
          // style={{ maxWidth: 600 }}
          // initialValues={{ remember: true }}
          onFinish={handleSumbit}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            hasFeedback
            label="Username"
            name="name"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            hasFeedback
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please input your description!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>

      <div className="container">
        <Table
          rowKey="id"
          dataSource={categories}
          columns={columns}
          pagination={false}
        ></Table>
      </div>

      <Modal
        open={open}
        title="Update cateroty"
        onCancel={() => setOpen(false)}
        onOk={() => {
          updateForm.submit();
        }}
      >
        <Form form={updateForm} onFinish={handleUpdate} autoComplete="off">
          <Form.Item
            hasFeedback
            label="Username"
            name="name"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            hasFeedback
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please input your description!" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CategoryCRUD;
