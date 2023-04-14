import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Modal, Space, Table } from "antd";
import FormItem from "antd/es/form/FormItem";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface ISupplier {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
}
function SupperliersCRUD() {
  const [suppliers, setSuppliers] = useState<Array<ISupplier>>([]);
  const [refresh, setRefresh] = useState(0);
  const [open, setOpen] = useState(false);
  const [updateId, setUpdateId] = useState(0);
  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const API_URL = "http://localhost:9000/suppliers";

  //Get Data
  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        console.log(res.data);
        setSuppliers(res.data);
      })
      .catch((err) => console.log(err));
  }, [refresh]);

  //Create data
  const handleCreate = (record: any) => {
    axios
      .post(API_URL, record)
      .then((res) => {
        console.log(res.data);
        setRefresh((f) => f + 1);
        message.success(" Add new Suppliers sucessfully!", 1.5);
        createForm.resetFields();
      })
      .catch((err) => {
        console.log(err);
        message.error(err.response.data.message);
      });
  };
  //Delete a Data
  const handleDelete = (record: any) => {
    axios
      .delete(API_URL + "/" + record)
      .then((res) => {
        console.log(res.statusText);
        message.success(" Delete item sucessfully!!", 1.5);
        setRefresh((f) => f + 1);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //Update a Data
  const handleUpdate = (record: any) => {
    console.log(record);
    axios
      .patch(API_URL + "/" + updateId, record)
      .then((res) => {
        console.log(res);
        setRefresh((f) => f + 1);
        setOpen(false);
        message.success("Updated sucessfully!!", 1.5);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //Setting column
  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Function",
      dataIndex: "function",
      key: "function",
      render: (text: any, record: any) => (
        <div>
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setOpen(true);
                setUpdateId(record._id);
                updateForm.setFieldsValue(record);
              }}
            ></Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record._id)}
            ></Button>
          </Space>
        </div>
      ),
    },
  ];
  return (
    <div className="container">
      <div className="container d-flex flex-row ">
        <Form form={createForm} name="createForm" onFinish={handleCreate}>
          <div className="row">
            <FormItem
              className="col-6"
              hasFeedback
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input Name!" }]}
            >
              <Input />
            </FormItem>
            <FormItem
              className="col-6"
              hasFeedback
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input Email!" }]}
            >
              <Input />
            </FormItem>
          </div>
          <div className="row">
            {" "}
            <FormItem
              hasFeedback
              label="Phone"
              name="phoneNumber"
              className="col-6"
            >
              <Input />
            </FormItem>
            <FormItem
              className="col-6"
              hasFeedback
              label="Address"
              name="address"
              rules={[{ required: true, message: "Please input Email!" }]}
            >
              <Input />
            </FormItem>
          </div>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={suppliers}
        pagination={false}
      >
        {" "}
      </Table>
      <Modal
        open={open}
        title="Update supplier"
        onCancel={() => setOpen(false)}
        onOk={() => {
          updateForm.submit();
        }}
      >
        <Form form={updateForm} name="updateForm" onFinish={handleUpdate}>
          <div className="row">
            <FormItem
              className="col-6"
              hasFeedback
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input Name!" }]}
            >
              <Input />
            </FormItem>
            <FormItem
              className="col-6"
              hasFeedback
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input Email!" }]}
            >
              <Input />
            </FormItem>
          </div>
          <div className="row">
            {" "}
            <FormItem
              hasFeedback
              label="Phone"
              name="phoneNumber"
              className="col-6"
            >
              <Input />
            </FormItem>
            <FormItem
              className="col-6"
              hasFeedback
              label="Address"
              name="address"
              rules={[{ required: true, message: "Please input Email!" }]}
            >
              <Input />
            </FormItem>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default SupperliersCRUD;
