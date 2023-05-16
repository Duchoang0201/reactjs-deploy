import {
  CheckCircleOutlined,
  ClearOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  UnorderedListOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Select,
  Space,
  Table,
  Upload,
  Image,
} from "antd";
import Search from "antd/es/input/Search";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "../../hooks/useAuthStore";

interface Product {
  _id: string;
  id: string;
  name: string;
  price: number;
  description: string;
  category: {
    _id: string;
    name: string;
    description: string;
    id: number;
  };
  image: string;
  discount: number;
  stock: number;
  categoryId: string;
  supplierId: string;
  supplier: {
    _id: string;
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
  };
  total: number;
}
const ProductsCRUD = () => {
  const [refresh, setRefresh] = useState(0);
  const { auth } = useAuthStore((state: any) => state);

  //File to upload (createProduct)
  const [file, setFile] = useState<any>();

  //API_URL
  const API_URL = "http://localhost:9000/products";
  const [categories, setCategories] = useState<Array<any>>([]);
  const [suppliers, setSuppliers] = useState([]);

  //For FILLTER
  // const [products, setProducts] = useState<Array<any>>([]);
  const [productsTEST, setProductsTEST] = useState<Array<any>>([]);

  // const [productsFilter, setProductsFilter] = useState(API_URL);

  const [loadingTable, setLoadingTable] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoadingTable(false);
    }, 1000); // 5000 milliseconds = 5 seconds
  }, []);

  const [open, setOpen] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Product>();

  const [updateId, setUpdateId] = useState<any>();

  const [pictureForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [createForm] = Form.useForm();

  /// Open detail PICTURE:

  const [openDetailPicture, setOpenDetailPicture] = useState(false);

  //Search on SupplierID
  const [supplierId, setSupplierId] = useState("");

  //SEARCH DEPEN ON NAME
  const [productName, setProductName] = useState("");

  //Search on Price
  const [inforPrice] = Form.useForm();

  const [fromPrice, setFromPrice] = useState("");
  const [toPrice, setToPrice] = useState("");

  //Search on Discount
  const [inforDiscount] = Form.useForm();

  const [fromDiscount, setFromDiscount] = useState("");
  const [toDiscount, setToDiscount] = useState("");

  //Search on Stock
  const [inforStock] = Form.useForm();

  const [fromStock, setFromStock] = useState("");
  const [toStock, setToStock] = useState("");

  // const [limit, setLimit] = useState(10);
  const [skip, setSkip] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  //SEARCH ISDELETE , ACTIVE, UNACTIVE ITEM

  const [isDelete, setIsDelete] = useState("");
  const [isActive, setIsActive] = useState("");
  const onSearchIsDelete = useCallback((value: any) => {
    if (value === "active") {
      setIsActive("true");
      setIsDelete("");
    }
    if (value === "unActive") {
      setIsActive("false");
      setIsDelete("");
    }
    if (value === "Deleted") {
      setIsDelete("true");
      setIsActive("");
    }
    if (value !== "active" && value !== "unActive" && value !== "Deleted") {
      setIsActive("");
      setIsDelete("");
    }
  }, []);

  useEffect(() => {
    // Check if the selected order exists in the updated dataResource
    const updatedSelectedOrder = productsTEST.find(
      (product: any) => product._id === updateId?._id
    );
    setUpdateId(updatedSelectedOrder || null);
  }, [productsTEST]);

  //Columns of TABLE ANT_DESIGN
  const columns = [
    //No
    {
      title: () => {
        return (
          <div>
            {isActive || isDelete ? (
              <div className="text-danger">No</div>
            ) : (
              <div className="secondary">No</div>
            )}
          </div>
        );
      },
      dataIndex: "id",
      key: "id",
      render: (text: string, record: any, index: number) => {
        return (
          <div>
            <Space>
              {currentPage === 1 ? index + 1 : index + currentPage * 10 - 9}
              {record.active === true && !record.isDeleted && (
                <span style={{ fontSize: "16px", color: "#08c" }}>
                  <CheckCircleOutlined /> Active
                </span>
              )}
              {record.active === false && !record.isDeleted && (
                <span className="text-danger">
                  <CloseCircleOutlined
                    style={{ fontSize: "16px", color: "#dc3545" }}
                  />{" "}
                  Unactive
                </span>
              )}

              {record.isDeleted === true && (
                <span className="text-danger">
                  <CloseCircleOutlined
                    style={{ fontSize: "16px", color: "#dc3545" }}
                  />{" "}
                  Deleted
                </span>
              )}
            </Space>
          </div>
        );
      },
      filterDropdown: () => {
        return (
          <>
            <div>
              <Select
                allowClear
                onClear={() => {
                  setIsDelete("");
                }}
                style={{ width: "125px" }}
                placeholder="Select a supplier"
                optionFilterProp="children"
                showSearch
                onChange={onSearchIsDelete}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={[
                  {
                    value: "active",
                    label: "Active",
                  },
                  {
                    value: "unActive",
                    label: "Unactive",
                  },
                  {
                    value: "Deleted",
                    label: "Deleted",
                  },
                ]}
              />
            </div>
          </>
        );
      },
      width: "1%",
    },
    //IMAGE
    {
      width: "1%",

      title: "Picture",
      key: "imageUrl",
      dataIndex: "imageUrl",
      render: (text: any, record: any, index: any) => {
        return (
          <div>
            {record.imageUrl && (
              <div className="d-flex justify-content-between">
                <img
                  src={"http://localhost:9000" + record.imageUrl}
                  style={{ height: 60 }}
                  alt="record.imageUrl"
                />
                <Button
                  onClick={() => {
                    setUpdateId(record);
                    setOpenDetailPicture(true);
                    pictureForm.setFieldsValue(record);
                  }}
                  icon={<UnorderedListOutlined />}
                />
              </div>
            )}
          </div>
        );
      },
    },
    //Category
    {
      width: "1%",

      title: () => {
        return (
          <div>
            {categoryId ? (
              <div className="text-danger">Category</div>
            ) : (
              <div className="secondary">Category</div>
            )}
          </div>
        );
      },
      dataIndex: ["category", "name"],
      key: "category",

      filterDropdown: (clearFilters: any) => {
        return (
          <div style={{ width: "150px" }}>
            <Select
              allowClear
              autoClearSearchValue={!categoryId ? true : false}
              showSearch
              style={{ width: "100%" }}
              placeholder="Select a product"
              optionFilterProp="children"
              onChange={onSearchCategory}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              options={categories.map((item: any, index: any) => ({
                label: item.name,
                value: item._id,
              }))}
            />
          </div>
        );
      },
    },
    //Supplier
    {
      width: "1%",

      title: () => {
        return (
          <div>
            {supplierId ? (
              <div className="text-danger">Supplier</div>
            ) : (
              <div className="secondary">Supplier</div>
            )}
          </div>
        );
      },
      dataIndex: ["supplier", "name"],
      key: "supplier",
      filterDropdown: () => {
        return (
          <>
            <div>
              <Select
                allowClear
                onClear={() => {
                  setSupplierId("");
                }}
                style={{ width: "125px" }}
                placeholder="Select a supplier"
                optionFilterProp="children"
                onChange={onSearchSupplier}
                showSearch
                filterOption={(input, option) =>
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
            </div>
          </>
        );
      },
      render: (text: string, record: any) => {
        return <span>{record.supplier?.name}</span>;
      },
      height: "auto",
    },
    //Name
    {
      width: "5%",

      title: () => {
        return (
          <div>
            {productName ? (
              <div className="text-danger">Product Name</div>
            ) : (
              <div className="secondary">Product Name</div>
            )}
          </div>
        );
      },
      dataIndex: "name",
      key: "name",
      filterDropdown: () => {
        return (
          <div style={{ padding: 8 }}>
            <Search
              allowClear
              placeholder="input search text"
              onSearch={onSearchProductName}
              style={{ width: 200 }}
            />
          </div>
        );
      },
    },
    //Price
    {
      width: "1%",

      title: () => {
        return (
          <div>
            {fromPrice || toPrice ? (
              <div className="text-danger">Price</div>
            ) : (
              <div className="secondary">Price</div>
            )}
          </div>
        );
      },
      dataIndex: "price",
      key: "price",
      filterDropdown: () => {
        return (
          <Form
            form={inforPrice}
            name="inforPrice"
            onFinish={submitSearchPrice}
            style={{
              padding: "5px",
              width: fromPrice || toPrice ? "350px" : "300px",
              height: "50px",
            }}
          >
            <Space>
              <Form.Item hasFeedback label="from" name="fromPrice">
                <InputNumber placeholder="Enter From" min={1} />
              </Form.Item>
              <Form.Item hasFeedback label="to" name="toPrice">
                <InputNumber placeholder="Enter to" min={1} />
              </Form.Item>
              <span>
                <Form.Item>
                  <Button
                    style={{ width: "30px", right: "-10px" }}
                    type="primary"
                    htmlType="submit"
                    icon={<SearchOutlined />}
                  />
                </Form.Item>
              </span>
              <span>
                {fromPrice || toPrice ? (
                  <Form.Item>
                    <Button
                      style={{ width: "30px", right: "-8px" }}
                      type="primary"
                      onClick={() => {
                        // setFromPrice("");
                        // setToPrice("");
                        inforPrice.resetFields();
                      }}
                      icon={<ClearOutlined />}
                    />
                  </Form.Item>
                ) : (
                  ""
                )}
              </span>
            </Space>
          </Form>
        );
      },
    },

    //Stock
    {
      width: "1%",

      title: () => {
        return (
          <div>
            {fromStock || toStock ? (
              <div className="text-danger">Stock</div>
            ) : (
              <div className="secondary">Stock</div>
            )}
          </div>
        );
      },
      dataIndex: "stock",
      key: "stock",
      filterDropdown: () => {
        return (
          <Form
            form={inforStock}
            name="inforStock"
            onFinish={submitSearchStock}
            style={{
              padding: "5px",
              width: fromStock || toStock ? "350px" : "300px",
              height: "50px",
            }}
          >
            <Space>
              <Form.Item hasFeedback label="from" name="fromStock">
                <InputNumber min={1} placeholder="Enter From" />
              </Form.Item>
              <Form.Item hasFeedback label="to" name="toStock">
                <InputNumber min={1} placeholder="Enter To" />
              </Form.Item>
              <span style={{ width: "20%" }}>
                <Form.Item>
                  <Button
                    style={{ width: "30px", right: "-4px" }}
                    type="primary"
                    htmlType="submit"
                    icon={<SearchOutlined />}
                  />
                </Form.Item>
              </span>
              <span>
                {fromStock || toStock ? (
                  <Form.Item>
                    <Button
                      style={{ width: "30px", right: "-8px" }}
                      type="primary"
                      onClick={() => {
                        setFromStock("");
                        setToStock("");
                        inforStock.resetFields();
                      }}
                      icon={<ClearOutlined />}
                    />
                  </Form.Item>
                ) : (
                  ""
                )}
              </span>
            </Space>
          </Form>
        );
      },
    },
    //Discount
    {
      width: "1%",

      title: () => {
        return (
          <div>
            {fromDiscount || toDiscount ? (
              <div className="text-danger">Discount</div>
            ) : (
              <div className="secondary">Discount</div>
            )}
          </div>
        );
      },
      dataIndex: "discount",
      key: "discount",
      filterDropdown: () => {
        return (
          <Form
            form={inforDiscount}
            name="inforDiscount"
            onFinish={submitSearchDiscount}
            style={{
              padding: "5px",
              width: fromDiscount || toDiscount ? "350px" : "300px",
              height: "50px",
            }}
          >
            <Space>
              <Form.Item hasFeedback label="from" name="fromDiscount">
                <InputNumber placeholder="Enter From" min={1} />
              </Form.Item>
              <Form.Item hasFeedback label="to" name="toDiscount">
                <InputNumber placeholder="Enter To" min={1} />
              </Form.Item>
              <span style={{ width: "20%" }}>
                <Form.Item>
                  <Button
                    style={{ width: "30px", right: "-10px" }}
                    type="primary"
                    htmlType="submit"
                    icon={<SearchOutlined />}
                  />
                </Form.Item>
              </span>
              <span>
                {fromDiscount || toDiscount ? (
                  <Form.Item>
                    <Button
                      style={{ width: "30px", right: "-8px" }}
                      type="primary"
                      onClick={() => {
                        setFromDiscount("");
                        setToDiscount("");
                        inforDiscount.resetFields();
                      }}
                      icon={<ClearOutlined />}
                    />
                  </Form.Item>
                ) : (
                  ""
                )}
              </span>
            </Space>
          </Form>
        );
      },
    },
    //Note

    { title: "Note", dataIndex: "note", key: "note", width: "1%" },

    //Function
    {
      width: "1%",

      title: "Function",
      dataIndex: "function",
      key: "function",
      render: (text: string, record: any) => (
        <Space>
          <Popconfirm
            okText="Delete"
            okType="danger"
            onConfirm={() => handleDelete(deleteItem)}
            title={"Are you sure to delete this product?"}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                setDeleteItem(record);
              }}
            ></Button>
          </Popconfirm>
          <Button
            type="dashed"
            icon={<EditOutlined />}
            onClick={() => {
              setOpen(true);
              setUpdateId(record);
              updateForm.setFieldsValue(record);
            }}
          />
          <Upload
            showUploadList={false}
            name="file"
            action={`http://localhost:9000/upload/products/${record._id}/images`}
            headers={{ authorization: "authorization-text" }}
            onChange={(info) => {
              if (info.file.status !== "uploading") {
                console.log(info.file);
              }

              if (info.file.status === "done") {
                message.success(`${info.file.name} file uploaded successfully`);

                setTimeout(() => {
                  setRefresh(refresh + 1);
                }, 1000);
              } else if (info.file.status === "error") {
                message.error(`${info.file.name} file upload failed.`);
              }
            }}
          >
            <Button icon={<UploadOutlined />} />
          </Upload>
        </Space>
      ),
      filterDropdown: () => {
        return (
          <>
            <Space direction="vertical">
              <Button
                style={{ width: "150px" }}
                onClick={handleClearFillter}
                icon={<ClearOutlined />}
              >
                Clear filter
              </Button>
              <Button
                style={{ width: "150px" }}
                onClick={() => {
                  setOpenCreate(true);
                }}
                icon={<PlusCircleOutlined />}
              >
                Add Product
              </Button>
            </Space>
          </>
        );
      },
    },
  ];

  //CALL API CATEGORY
  useEffect(() => {
    axios
      .get("http://localhost:9000/categories")
      .then((res) => {
        setCategories(res.data.results);
      })
      .catch((err) => console.log(err));
  }, []);

  //CALL API SUPPLIER
  useEffect(() => {
    axios
      .get("http://localhost:9000/suppliers")
      .then((res) => {
        setSuppliers(res.data.results);
      })
      .catch((err) => console.log(err));
  }, []);

  //Handle Create a Data
  const handleCreate = (record: any) => {
    record.createdBy = auth.payload;
    record.createdDate = new Date().toISOString();
    if (record.active === undefined) {
      record.active = false;
    }
    record.isDeleted = false;
    axios
      .post(API_URL, record)
      .then((res) => {
        // UPLOAD FILE
        const { _id } = res.data.results;

        const formData = new FormData();
        formData.append("file", file);

        axios
          .post(API_URL + "/upload/products/" + _id, formData)
          .then((respose) => {
            message.success("Create a product successFully!!", 1.5);
            createForm.resetFields();
            setRefresh((f) => f + 1);
          })
          .catch((err) => {
            message.error("Upload file bị lỗi!");
          });
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
  };

  //handle Delete Data
  const handleDelete = useCallback((record: any) => {
    axios
      .delete(API_URL + "/" + record._id)
      .then((res) => {
        setRefresh((f) => f + 1);
        message.success("Delete a product successFully!!", 3);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //Update a data
  const handleUpdate = (record: any) => {
    record.updatedBy = auth.payload;
    record.updatedDate = new Date().toISOString();
    if (record.active === undefined) {
      record.active = false;
    }
    if (record.isDeleted === undefined) {
      record.isDeleted = false;
    }
    axios
      .patch(API_URL + "/" + updateId._id, record)
      .then((res) => {
        setRefresh((f) => f + 1);
        message.success(`Update product ${record.name} successFully!!`, 3);
        setOpen(false);
      })
      .catch((err) => {
        message.error(err.response.data.message);
      });
  };

  // UPLOAD

  //Handle Change Picture:
  // const handleChangeListPicture =
  //Search DEPEN ON CATEGORY
  //Search on CategoryID
  const [categoryId, setCategoryId] = useState("");

  const onSearchCategory = useCallback((value: any) => {
    if (value) {
      setCategoryId(value);
    } else {
      setCategoryId("");
    }
  }, []);

  // SEARCH DEPEND ON SUPPLIER

  const onSearchSupplier = useCallback((value: any) => {
    if (value) {
      setSupplierId(value);
    } else {
      setSupplierId("");
    }
  }, []);

  //SEARCH DEPEN ON NAME

  const onSearchProductName = (record: any) => {
    setProductName(record);
  };

  //Search on Price

  const submitSearchPrice = (value: any) => {
    setFromPrice(value.fromPrice ? value.fromPrice : "");
    setToPrice(value.toPrice ? value.toPrice : "");
  };
  //Search on Discount

  const submitSearchDiscount = (value: any) => {
    setFromDiscount(value.fromDiscount ? value.fromDiscount : "");
    setToDiscount(value.toDiscount ? value.toDiscount : "");
  };

  //Search on Stock

  const submitSearchStock = (value: any) => {
    setFromStock(value.fromStock ? value.fromStock : "");
    setToStock(value.toStock ? value.toStock : "");
  };

  //Search on Skip and Limit

  // const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState();

  const slideCurrent = (value: any) => {
    setSkip(value * 10 - 10);
    setCurrentPage(value);
  };
  // Clear all Filter

  const handleClearFillter = () => {
    setSupplierId("");
    setProductName("");
    setCategoryId("");
    //Price
    setFromPrice("");
    setToPrice("");
    inforPrice.resetFields();
    //Discount
    setFromDiscount("");
    setToDiscount("");
    inforDiscount.resetFields();
    //Stock
    setFromStock("");
    setToStock("");
    inforStock.resetFields();
  };
  //CALL API PRODUCT FILLTER
  const queryParams = [
    productName && `productName=${productName}`,
    supplierId && `supplierId=${supplierId}`,
    categoryId && `categoryId=${categoryId}`,
    fromPrice && `fromPrice=${fromPrice}`,
    toPrice && `toPrice=${toPrice}`,
    fromDiscount && `fromDiscount=${fromDiscount}`,
    toDiscount && `toDiscount=${toDiscount}`,
    fromStock && `fromStock=${fromStock}`,
    toStock && `toStock=${toStock}`,
    skip && `skip=${skip}`,
    isActive && `active=${isActive}`,
    isDelete && `isDeleted=${isDelete}`,
  ]
    .filter(Boolean)
    .join("&");

  let URL_FILTER = `http://localhost:9000/products?${queryParams}&limit=10`;
  // CALL API FILTER PRODUCT DEPEND ON QUERY
  useEffect(() => {
    axios
      .get(URL_FILTER)
      .then((res) => {
        setProductsTEST(res.data.results);
        setPages(res.data.amountResults);
      })
      .catch((err) => console.log(err));
  }, [refresh, URL_FILTER]);

  return (
    <>
      {/* Modal Create A product */}
      <Modal
        title={`Create Product `}
        open={openCreate}
        onCancel={() => {
          setOpenCreate(false);
        }}
        onOk={() => {
          createForm.submit();
          setRefresh((f) => f + 1);
        }}
        okText="Submit"
      >
        <Form
          className="container px-5"
          form={createForm}
          name="createForm"
          onFinish={handleCreate}
        >
          <Form.Item
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
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
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
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
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
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
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            hasFeedback
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please enter Price" }]}
          >
            <InputNumber min={1} />
          </Form.Item>{" "}
          <Form.Item
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
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
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            hasFeedback
            name="stock"
            label="Stock"
            rules={[{ required: true, message: "Please enter Stock" }]}
          >
            <InputNumber min={1} />
          </Form.Item>{" "}
          <Form.Item
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            hasFeedback
            label="active"
            name="active"
            valuePropName="checked"
          >
            <Checkbox />
          </Form.Item>
          <Form.Item
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            hasFeedback
            label="PromotionPosition"
            name="promotionPosition"
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            hasFeedback
            label="Note"
            name="note"
          >
            <Input />
          </Form.Item>
          <Form.Item
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            label="Hình minh họa"
            name="file"
          >
            <Upload
              showUploadList={true}
              beforeUpload={(file) => {
                setFile(file);
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      {/* List and function Product */}
      <Table
        loading={loadingTable}
        tableLayout="auto"
        rowKey="id"
        columns={columns}
        dataSource={productsTEST}
        pagination={false}
        scroll={{ x: "max-content", y: 600 }}
        rowClassName={(record) => {
          if (record.active === false && record.isDeleted === false) {
            return "bg-dark-subtle";
          } else if (record.isDeleted) {
            return "text-danger bg-success-subtle";
          } else {
            return "";
          }
        }}
        // dataSource={filterOn ? suppliersFilter : products}
      >
        {" "}
      </Table>

      {/* Modal Update */}
      <Modal
        title={`Update Product:  `}
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        onOk={() => {
          updateForm.submit();
          setRefresh((f) => f + 1);
        }}
      >
        <Form
          className="container px-5"
          form={updateForm}
          name="updateForm"
          onFinish={handleUpdate}
        >
          <Form.Item
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
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
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
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
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
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
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            hasFeedback
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please enter Price" }]}
          >
            <InputNumber min={1} />
          </Form.Item>{" "}
          <Form.Item
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
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
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            hasFeedback
            name="stock"
            label="Stock"
            rules={[{ required: true, message: "Please enter Stock" }]}
          >
            <InputNumber min={1} />
          </Form.Item>{" "}
          <Form.Item
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            hasFeedback
            label="active"
            name="active"
            valuePropName="checked"
          >
            <Checkbox />
          </Form.Item>
          <Form.Item
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            hasFeedback
            label="PromotionPosition"
            name="promotionPosition"
          >
            <Select
              mode="multiple"
              allowClear
              showSearch
              placeholder="Select promotion"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={[
                {
                  value: "TOP-MONTH",
                  label: "TOP-MONTH",
                },
                {
                  value: "DEAL",
                  label: "DEAL",
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            hasFeedback
            label="isDeleted"
            name="isDeleted"
            valuePropName="checked"
          >
            <Checkbox />
          </Form.Item>
          <Form.Item
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            hasFeedback
            label="Note"
            name="note"
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Model Detail Picture */}

      <Modal
        open={openDetailPicture}
        onCancel={() => setOpenDetailPicture(false)}
      >
        {updateId && (
          <div>
            {" "}
            Avatar:
            <Image
              width={200}
              height={200}
              src={`http://localhost:9000${updateId?.imageUrl}`}
            />
            <Upload
              showUploadList={false}
              name="file"
              action={`http://localhost:9000/upload/products/${updateId?._id}/image`}
              headers={{ authorization: "authorization-text" }}
              onChange={(info) => {
                if (info.file.status !== "uploading") {
                  console.log(info.file);
                }

                if (info.file.status === "done") {
                  message.success(
                    `${info.file.name} file uploaded successfully`
                  );

                  setTimeout(() => {
                    setRefresh(refresh + 1);
                  }, 1000);
                } else if (info.file.status === "error") {
                  message.error(`${info.file.name} file upload failed.`);
                }
              }}
            >
              <Button icon={<EditOutlined />} />
            </Upload>
          </div>
        )}
        <div className="listofproduct">
          <Space>
            {/* {updateId &&
              updateId?.images?.map((item: any, index: any) => (
                <Image
                
                  key={index}
                  width={200}
                  height={200}
                  src={`http://localhost:9000${item}`}
                />
              ))} */}
            {updateId && (
              <Upload
                name="file"
                action={`http://localhost:9000/upload/products/${updateId?._id}/images`}
                listType="picture-card"
                fileList={updateId?.images?.map((item: any, index: any) => ({
                  uid: `${-index}`,
                  name: `image${index}.png`,
                  status: "done",
                  url: `http://localhost:9000${item}`,
                }))}
                onChange={(record: any) => {
                  if (record.file.status !== "uploading") {
                    console.log(record.file);
                  }
                  if (record.file.status === "removed") {
                    const newlistPicture = updateId?.images?.filter(
                      (item: any) =>
                        `http://localhost:9000${item}` !== record.file.url
                    );
                    console.log("««««« newlistPicture »»»»»", newlistPicture);
                    axios
                      .patch(API_URL + "/" + updateId._id, {
                        images: newlistPicture,
                      })
                      .then((res) => {
                        message.success(
                          `Delete Picture product successfully!!`,
                          3
                        );
                        setTimeout(() => {
                          setRefresh(refresh + 1);
                        }, 500);
                      });
                  }
                  if (record.file.status === "done") {
                    updateId?.images?.push({ images: record.file.url });
                    message.success(
                      `${record.file.name} file uploaded successfully`
                    );
                    setTimeout(() => {
                      setRefresh(refresh + 1);
                    }, 3000);
                  } else if (record.file.status === "error") {
                    message.error(`${record.file.name} file upload failed.`);
                  }
                  setTimeout(() => {
                    setRefresh(refresh + 1);
                  }, 3000);
                }}
              >
                {updateId?.images?.length >= 5 ? null : <UploadOutlined />}
              </Upload>
            )}
          </Space>
        </div>
      </Modal>

      {/* Pagination */}
      <Pagination
        className="py-4 container text-end "
        onChange={(e) => slideCurrent(e)}
        defaultCurrent={1}
        total={pages}
      />
    </>
  );
};

export default ProductsCRUD;
