import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  message,
  Modal,
  Space,
  Table,
} from "antd";
// import FormItemLabel from "antd/es/form/FormItemLabel";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface ICustomers {
  fisrtName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  email: string;
  birthday: string;
}
const CustomerCRUD = () => {
  const API_URL = "http://localhost:9000/customers";
  const [customers, setCustomer] = useState<Array<ICustomers>>([]);
  const [refresh, setRefresh] = useState(0);
  const [open, setOpen] = useState(false);
  const [updateId, setUpdateId] = useState(0);
  const [updateForm] = Form.useForm();
  const [createForm] = Form.useForm();
  //Get DATA
  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        setCustomer(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refresh]);

  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };

  //Create a Data
  const handleCreate = (record: any) => {
    const newData = {
      ...record,
      birthday: `${record.birthday.$y}-${record.birthday.$M + 1}-${
        record.birthday.$D
      } `,
    };
    console.log(record);
    axios
      .post(API_URL, newData)
      .then((res) => {
        message.success("Create new data sucessfully!!", 1.5);
        setRefresh((f) => f + 1);
      })
      .catch((res) => {
        message.success("Create new data unsucessfully!!", 1.5);
      });
  };
  //Delete a data
  const handleDelte = (recordID: any) => {
    axios
      .delete(API_URL + "/" + recordID)
      .then((res) => {
        console.log(res);
        setRefresh((f) => f + 1);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //Update a data
  const handleUpdate = (data: any) => {
    axios
      .patch(API_URL + "/" + updateId, data)
      .then((res) => {
        setRefresh((f) => f + 1);
        setOpen(false);
        message.success("Updated sucessfully!!", 1.5);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //Format colums
  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "First name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Phone number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Birthday",
      dataIndex: "birthday",
      key: "birthday",
    },
    {
      title: "Function",
      dataIndex: "function",
      key: "id",
      render: (text: any, record: any) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setOpen(true);
              console.log(record);
              setUpdateId(record.id);
              updateForm.setFieldsValue(record);
            }}
          ></Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelte(record.id)}
          ></Button>
        </Space>
      ),
    },
  ];
  return (
    <>
      <Form
        className="container"
        form={createForm}
        name="createForm"
        onFinish={handleCreate}
      >
        <div className="row">
          <Form.Item
            label="Firstname"
            name="firstname"
            className="col-4"
            hasFeedback
            rules={[{ required: true, message: "Please input Firstname!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Lastname"
            name="lastname"
            className="col-4"
            hasFeedback
            rules={[{ required: true, message: "Please input Lastname!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phonenumber"
            name="phonenumber"
            className="col-4"
            hasFeedback
          >
            <Input />
          </Form.Item>
        </div>
        <div className="row">
          <Form.Item
            label="Address"
            name="address"
            className="col-4"
            hasFeedback
            rules={[{ required: true, message: "Please input Address!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            className="col-4"
            hasFeedback
            rules={[{ required: true, message: "Please input Email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Birthday"
            name="birthday"
            className="col-4"
            hasFeedback
            rules={[{ required: true, message: "Please input Birthday!" }]}
          >
            {/* <Input /> */}
            <DatePicker />
          </Form.Item>
        </div>

        <Form.Item className="text-end">
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>

      <Table
        className="container"
        rowKey="id"
        columns={columns}
        dataSource={customers}
        pagination={false}
      ></Table>

      <Modal
        title={`Update Customers ${updateId}`}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => {
          updateForm.submit();
        }}
      >
        <Form form={updateForm} name="updateForm" onFinish={handleUpdate}>
          <div className="row">
            <Form.Item
              label="Firstname"
              name="firstname"
              className="col-6"
              hasFeedback
              rules={[{ required: true, message: "Please input Firstname!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Lastname"
              name="lastname"
              className="col-6"
              hasFeedback
              rules={[{ required: true, message: "Please input Lastname!" }]}
            >
              <Input />
            </Form.Item>
          </div>
          <div className="row">
            <Form.Item
              label="Phonenumber"
              name="phonenumber"
              className="col-6"
              hasFeedback
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Address"
              name="address"
              className="col-6"
              hasFeedback
              rules={[{ required: true, message: "Please input Address!" }]}
            >
              <Input />
            </Form.Item>
          </div>
          <div className="row">
            <Form.Item
              label="Email"
              name="email"
              className="col-6"
              hasFeedback
              rules={[{ required: true, message: "Please input Email!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Birthday"
              name="birthday"
              className="col-6"
              hasFeedback
              rules={[{ required: true, message: "Please input Birthday!" }]}
            >
              <Input />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default CustomerCRUD;
