import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Space,
  Table,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

type IEmployees = {
  firstname: string;
  lastname: string;
  phonenumber: string;
  address: string;
  email: string;
  birthday: string;
};

const EmployeesCRUD = () => {
  const API_URL = "http://localhost:9000/employees";

  const [employees, setEmployees] = useState<Array<IEmployees>>([]);
  const [refresh, setRefresh] = useState(0);
  const [open, setOpen] = useState(false);
  const [updateId, setUpdateId] = useState(0);
  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  //Get data
  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        console.log(res.data);
        setEmployees(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refresh]);

  //Create a data
  const handleCreate = (record: any) => {
    const newData = {
      ...record,
      birthday: `${record.birthday.$y}-${record.birthday.$M + 1}-${
        record.birthday.$D
      }`,
    };
    // console.log(birthdayCreate)
    axios
      .post(API_URL, newData)
      .then((res) => {
        console.log(res);
        setRefresh((f) => f + 1);
        message.success("Create a new Employee successfully!!", 1.5);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //Delete a data
  const handleDelete = (recordId: any) => {
    axios
      .delete(API_URL + "/" + recordId)
      .then((res) => {
        console.log(res);
        setRefresh((f) => f + 1);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //Update a data
  const handleUpdate = (record: any) => {
    axios
      .patch(API_URL + "/" + updateId, record)
      .then((res) => {
        console.log(res);
        setRefresh((f) => f + 1);
        setOpen(false);
        setRefresh((f) => f + 1);
        message.success("Update a data successFully!!", 1.5);
      })
      .catch((err) => console.log(err));
  };
  //Setting columns
  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Firstname",
      dataIndex: "firstname",
      key: "firstname",
    },
    {
      title: "Lastname",
      dataIndex: "lastname",
      key: "lastname",
    },
    {
      title: "Phonenumber",
      dataIndex: "phonenumber",
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
      key: "function",
      render: (text: any, record: any) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setOpen(true);
              setUpdateId(record.id);
              updateForm.setFieldsValue(record);
            }}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
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
            hasFeedback
            className="col-4"
            label="Firstname"
            name="firstname"
            rules={[{ required: true, message: "Please enter Firstname" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            hasFeedback
            className="col-4"
            label="Lastname "
            name="lastname"
            rules={[{ required: true, message: "Please enter Lastname" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            hasFeedback
            className="col-4"
            label="Phonenumber"
            name="phonenumber"
          >
            <Input />
          </Form.Item>
        </div>
        <div className="row">
          <Form.Item
            hasFeedback
            className="col-4"
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please enter Address" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            hasFeedback
            className="col-4"
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter Email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            hasFeedback
            className="col-4"
            label="Birthday"
            name="birthday"
            rules={[{ required: true, message: "Please enter Birthday" }]}
          >
            <DatePicker />
            {/* <Input /> */}
          </Form.Item>
        </div>
        <Form.Item className="text-end">
          <Button type="primary" htmlType="submit">
            Sumbit
          </Button>
        </Form.Item>
      </Form>
      <Table
        className="container"
        rowKey="id"
        columns={columns}
        dataSource={employees}
        pagination={false}
      ></Table>
      <Modal
        title={`Update employee ${updateId}`}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => {
          updateForm.submit();
        }}
      >
        <Form
          className="container"
          form={updateForm}
          name="updateForm"
          onFinish={handleUpdate}
        >
          <div className="row">
            <Form.Item className="col-6" label="Firstname" name="firstname">
              <Input />
            </Form.Item>
            <Form.Item className="col-6" label="Lastname " name="lastname">
              <Input />
            </Form.Item>
          </div>
          <div className="row">
            <Form.Item className="col-6" label="Phonenumber" name="phonenumber">
              <Input />
            </Form.Item>
            <Form.Item className="col-6" label="Address" name="address">
              <Input />
            </Form.Item>
          </div>
          <div className="row">
            <Form.Item className="col-6" label="Email" name="email">
              <Input />
            </Form.Item>
            <Form.Item className="col-6" label="Birthday" name="birthday">
              {/* <DatePicker /> */}
              <Input />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default EmployeesCRUD;
