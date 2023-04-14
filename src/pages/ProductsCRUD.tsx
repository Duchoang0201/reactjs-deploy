import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Space,
  Table,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface IProducts {
  id: number;
  name: string;
  price: number;
  discount: number;
  stock: number;
}
const ProductsCRUD = () => {
  const API_URL = "http://localhost:9000/products";
  const [products, setProducts] = useState<Array<IProducts>>([]);
  const [open, setOpen] = useState(false);
  const [updateId, setUpdateId] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  //Create a Data
  const handleCreate = (record: any) => {
    // console.log(record);
    axios
      .post(API_URL, record)
      .then((res) => {
        console.log(res);
        setRefresh((f) => f + 1);
        createForm.resetFields();
        message.success("Create a product successFully!!", 1.5);
      })
      .catch((err) => {
        console.log(err.response.data.message);
        err.response.data.errors.map((item: any, index: any) => {
          message.error(`${item}`, 5);
        });
      });
  };
  //Delete a data
  const handleDelete = (recordId: any) => {
    console.log(recordId);
    axios
      .delete(API_URL + "/" + recordId)
      .then((res) => {
        console.log(res);
        setRefresh((f) => f + 1);
        message.success("Delete a product successFully!!", 1.5);
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
        message.success(`Update product ${updateId} successFully!!`, 1.5);
        setOpen(false);
      })
      .catch((err) => {
        message.error(err.response.data.message);
      });
  };
  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        console.log(res.data);
        setProducts(res.data);
      })
      .catch((err) => console.log(err));
  }, [refresh]);
  useEffect(() => {
    axios
      .get("http://localhost:9000/categories")
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => console.log(err));
  }, [refresh]);
  useEffect(() => {
    axios
      .get("http://localhost:9000/suppliers")
      .then((res) => {
        setSuppliers(res.data);
      })
      .catch((err) => console.log(err));
  }, [refresh]);
  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      render: (text: any, record: any, index: any) => {
        return <div>{index + 1}</div>;
      },
    },
    {
      title: "Category",
      dataIndex: "category.name",
      key: "category.name",
      render: (text: any, record: any) => {
        return <span>{record.category?.name}</span>;
      },
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplier.name",
      key: "supplier.name",
      render: (text: any, record: any, index: any) => {
        return <span>{record.supplier?.name}</span>;
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
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
      ),
    },
  ];

  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const onChangeCategory = (value: string) => {
    console.log(`selected ${value}`);
  };

  const onSearchCategory = (value: string) => {
    console.log("search:", value);
  };

  return (
    <>
      <Form
        className="container px-5"
        form={createForm}
        name="createForm"
        onFinish={handleCreate}
      >
        <Form.Item
          hasFeedback
          label="Category"
          name="categoryId"
          rules={[
            {
              required: true,
              message: "Please enter Category Name",
            },
          ]}
        >
          <Select
            showSearch
            placeholder="Select a person"
            optionFilterProp="children"
            onChange={onChangeCategory}
            onSearch={onSearchCategory}
            filterOption={(input: any, option: any) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={categories.map((item: any, index: any) => {
              return {
                label: `${item.name}`,
                value: item._id,
              };
            })}
          />
        </Form.Item>{" "}
        <Form.Item
          hasFeedback
          label="Suppliers"
          name="supplierId"
          rules={[
            {
              required: true,
              message: "Please enter Category Name",
            },
          ]}
        >
          <Select
            showSearch
            placeholder="Select a person"
            optionFilterProp="children"
            onChange={onChangeCategory}
            onSearch={onSearchCategory}
            filterOption={(input: any, option: any) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={suppliers.map((item: any, index: any) => {
              return {
                label: `${item.name}`,
                value: item._id,
              };
            })}
          />
        </Form.Item>
        <Form.Item
          hasFeedback
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please enter Product Name",
            },
          ]}
        >
          <Input />
        </Form.Item>{" "}
        <Form.Item
          hasFeedback
          name="price"
          label="Price"
          rules={[{ required: true, message: "Please enter Price" }]}
        >
          <InputNumber min={1} />
        </Form.Item>{" "}
        <Form.Item
          hasFeedback
          name="discount"
          label="Discount"
          rules={[
            {
              required: true,
              message: "Please enter Discount",
            },
          ]}
        >
          <InputNumber min={1} max={75} />
        </Form.Item>{" "}
        <Form.Item
          hasFeedback
          name="stock"
          label="Stock"
          rules={[{ required: true, message: "Please enter Stock" }]}
        >
          <InputNumber min={1} />
        </Form.Item>{" "}
        <Form.Item className="text-center">
          <Button type="primary" htmlType="submit">
            {" "}
            Submit
          </Button>
        </Form.Item>
      </Form>
      <Table
        className="container"
        rowKey="id"
        columns={columns}
        dataSource={products}
        pagination={false}
      >
        {" "}
      </Table>

      <Modal
        title={`Update Product `}
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        onOk={() => {
          updateForm.submit();
        }}
      >
        <Form
          className="container px-5"
          form={updateForm}
          name="updateForm"
          onFinish={handleUpdate}
        >
          <Form.Item
            hasFeedback
            label="Category"
            name="categoryId"
            rules={[
              {
                required: true,
                message: "Please enter Category Name",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Select a person"
              optionFilterProp="children"
              onChange={onChangeCategory}
              onSearch={onSearchCategory}
              filterOption={(input: any, option: any) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={categories.map((item: any, index: any) => {
                return {
                  label: `${item.name}`,
                  value: item._id,
                };
              })}
            />
          </Form.Item>{" "}
          <Form.Item
            hasFeedback
            label="Suppliers"
            name="supplierId"
            rules={[
              {
                required: true,
                message: "Please enter Category Name",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Select a person"
              optionFilterProp="children"
              onChange={onChangeCategory}
              onSearch={onSearchCategory}
              filterOption={(input: any, option: any) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={suppliers.map((item: any, index: any) => {
                return {
                  label: `${item.name}`,
                  value: item._id,
                };
              })}
            />
          </Form.Item>
          <Form.Item
            hasFeedback
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please enter Product Name",
              },
            ]}
          >
            <Input />
          </Form.Item>{" "}
          <Form.Item
            hasFeedback
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please enter Price" }]}
          >
            <InputNumber min={1} />
          </Form.Item>{" "}
          <Form.Item
            hasFeedback
            name="discount"
            label="Discount"
            rules={[
              {
                required: true,
                message: "Please enter Discount",
              },
            ]}
          >
            <InputNumber min={1} max={75} />
          </Form.Item>{" "}
          <Form.Item
            hasFeedback
            name="stock"
            label="Stock"
            rules={[{ required: true, message: "Please enter Stock" }]}
          >
            <InputNumber min={1} />
          </Form.Item>{" "}
        </Form>
      </Modal>
    </>
  );
};

export default ProductsCRUD;
