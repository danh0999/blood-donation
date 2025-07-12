import { useState, useEffect } from "react";
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Upload,
  Card,
  Row,
  Col,
  Typography,
  Modal,
  Divider,
  Space
} from "antd";
import { PlusOutlined, ArrowLeftOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addProgram } from "../../../redux/features/programSlice";
import { fetchCities, addCity, deleteCityById } from "../../../redux/features/citySlice";
import { fetchSlots } from "../../../redux/features/slotSlice";
import { createAddress } from "../../../redux/features/addressSlice";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import EnhancedPlacesAutocomplete from "./EnhancedPlacesAutocomplete";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const CreateProgram = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [imageUrl, setImageUrl] = useState(null);
  const [fileList, setFileList] = useState([]);

  // Address-related states
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedPlaceData, setSelectedPlaceData] = useState(null);

  // Modal states
  const [changesModalVisible, setChangesModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [newCityName, setNewCityName] = useState("");
  const [pendingFormData, setPendingFormData] = useState(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Staging states - changes only applied when form is submitted
  const [stagingCities, setStagingCities] = useState([]);
  const [deletedCityIds, setDeletedCityIds] = useState([]);

  // Get data from Redux store
  const { data: cities, loading: citiesLoading } = useSelector(state => state.city);
  const { data: slots, loading: slotsLoading } = useSelector(state => state.slot);

  useEffect(() => {
    // Fetch required data (no longer need addresses from DB)
    dispatch(fetchCities());
    dispatch(fetchSlots());
  }, [dispatch]);

  // Initialize staging cities when cities are loaded
  useEffect(() => {
    setStagingCities(cities);
  }, [cities]);

  // Get combined cities (original + staging - deleted)
  const displayCities = stagingCities.filter(city => !deletedCityIds.includes(city.id));

  // Handle place selection from Google Places API
  const handlePlaceSelect = (placeData) => {
    setSelectedPlaceData(placeData);
    
    // Update form field with the formatted address
    form.setFieldValue('addressInput', placeData.formattedAddress);
    
    // Auto-fill program name if it's empty and we have a place name
    const currentProgramName = form.getFieldValue('proName');
    if (!currentProgramName && placeData.name) {
      form.setFieldValue('proName', `Chương trình hiến máu tại ${placeData.name}`);
    }
    
    // Auto-select city if we can find a match
    if (placeData.city) {
      const matchingCity = displayCities.find(city => 
        city.name.toLowerCase().includes(placeData.city.toLowerCase()) ||
        placeData.city.toLowerCase().includes(city.name.toLowerCase())
      );
      
      if (matchingCity) {
        form.setFieldValue('cityId', matchingCity.id);
      } else {
        // If no matching city found, add it as a new staging city
        const cityExists = stagingCities.some(city => 
          city.name.toLowerCase() === placeData.city.toLowerCase()
        );
        
        if (!cityExists) {
          const tempId = Date.now();
          const newCity = { id: tempId, name: placeData.city, isStaging: true };
          setStagingCities(prev => [...prev, newCity]);
          form.setFieldValue('cityId', tempId);
        }
      }
    }
  };

  // Handle address input change
  const handleAddressChange = (value) => {
    setSelectedAddress(value);
    form.setFieldValue('addressInput', value);
    
    // Clear place data if user manually types instead of selecting
    if (!value) {
      setSelectedPlaceData(null);
    }
  };

  const handleImageUpload = ({ fileList: newFileList }) => {
    setFileList(newFileList);

    if (newFileList.length > 0) {
      const file = newFileList[0].originFileObj;
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImageUrl(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setImageUrl(null);
    }
  };

  // Handle adding new city (staging only)
  const handleAddCity = () => {
    if (!newCityName.trim()) {
      return; // Don't show toast, just do nothing
    }

    // Add to staging with temporary ID
    const tempId = Date.now(); // Temporary ID for staging
    const newCity = { id: tempId, name: newCityName, isStaging: true };
    setStagingCities(prev => [...prev, newCity]);

    setNewCityName("");
  };

  // Handle deleting city (staging only)
  const handleDeleteCity = (cityId) => {
    const cityToDelete = stagingCities.find(city => city.id === cityId);

    if (cityToDelete?.isStaging) {
      // Remove from staging if it's a new city
      setStagingCities(prev => prev.filter(city => city.id !== cityId));
    } else {
      // Mark for deletion if it's an existing city
      setDeletedCityIds(prev => [...prev, cityId]);
    }

    // Clear form selection if the deleted city was selected
    const currentCityId = form.getFieldValue('cityId');
    if (currentCityId === cityId) {
      form.setFieldValue('cityId', undefined);
    }
  };

  // Get pending changes for modal display
  const getPendingChanges = () => {
    const newCities = stagingCities.filter(city => city.isStaging);
    const deletedCities = cities.filter(city => deletedCityIds.includes(city.id));

    return {
      newCities,
      deletedCities,
      hasChanges: newCities.length > 0 || deletedCities.length > 0
    };
  };

  // Revert specific changes
  const revertNewCity = (cityId) => {
    setStagingCities(prev => prev.filter(city => city.id !== cityId));
    // Clear form selection if the reverted city was selected
    const currentCityId = form.getFieldValue('cityId');
    if (currentCityId === cityId) {
      form.setFieldValue('cityId', undefined);
    }
  };

  const revertDeletedCity = (cityId) => {
    setDeletedCityIds(prev => prev.filter(id => id !== cityId));
  };

  // Handle form submission - show confirmation modal first
  const handleFormSubmit = (values) => {
    // Validate that address has been selected from Google Places
    if (!selectedPlaceData) {
      toast.error('Vui lòng chọn địa điểm từ danh sách gợi ý của Google Maps!');
      return;
    }
    
    setPendingFormData(values);
    setConfirmModalVisible(true);
  };

  const handleSubmit = async () => {
    const values = pendingFormData;
    try {
      // First, commit city changes
      const cityPromises = [];

      // Add new cities
      const newCities = stagingCities.filter(city => city.isStaging);
      for (const city of newCities) {
        cityPromises.push(dispatch(addCity({ name: city.name })).unwrap());
      }

      // Delete marked cities
      for (const cityId of deletedCityIds) {
        cityPromises.push(dispatch(deleteCityById(cityId)).unwrap());
      }

      // Wait for all city operations to complete
      const cityResults = await Promise.all(cityPromises);

      // Find the actual cityId if a new city was selected
      let finalCityId = values.cityId;
      if (values.cityId && stagingCities.find(city => city.id === values.cityId)?.isStaging) {
        const newCityIndex = newCities.findIndex(city => city.id === values.cityId);
        if (newCityIndex !== -1 && cityResults[newCityIndex]) {
          finalCityId = cityResults[newCityIndex].id;
        }
      }

      // Handle address - if we have place data from Google, create new address
      let finalAddressId = null;
      if (selectedPlaceData && selectedPlaceData.coordinates) {
        const addressData = {
          name: selectedPlaceData.formattedAddress,
          latitude: selectedPlaceData.coordinates.lat,
          longitude: selectedPlaceData.coordinates.lng
        };
        
        const newAddress = await dispatch(createAddress(addressData)).unwrap();
        finalAddressId = newAddress.id;
      }

      const programData = {
        proName: values.proName,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD'),
        dateCreated: dayjs().format('YYYY-MM-DD'),
        addressId: finalAddressId,
        cityId: finalCityId,
        description: values.description || null,
        contact: values.contact || null,
        imageUrl: imageUrl || null,
        adminId: 1,
        slotIds: values.slotIds || []
      };

      await dispatch(addProgram(programData)).unwrap();
      toast.success('Chương trình đã được tạo thành công!');
      navigate('/admin/programs');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tạo chương trình: ' + error);
    } finally {
      setConfirmModalVisible(false);
      setPendingFormData(null);
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
    </div>
  );

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Card>
        <div style={{ marginBottom: 24 }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/admin/programs')}
            style={{ marginBottom: 16 }}
          >
            Quay lại
          </Button>
          <Title level={2}>Tạo chương trình mới</Title>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={{
            dateCreated: dayjs()
          }}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Tên chương trình"
                name="proName"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên chương trình!' },
                  { min: 5, message: 'Tên chương trình phải có ít nhất 5 ký tự!' }
                ]}
              >
                <Input placeholder="Nhập tên chương trình" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Liên hệ"
                name="contact"
              >
                <Input placeholder="Số điện thoại hoặc email liên hệ" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Ngày bắt đầu"
                name="startDate"
                rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder="Chọn ngày bắt đầu"
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Ngày kết thúc"
                name="endDate"
                rules={[
                  { required: true, message: 'Vui lòng chọn ngày kết thúc!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || !getFieldValue('startDate')) {
                        return Promise.resolve();
                      }
                      if (value.isBefore(getFieldValue('startDate'))) {
                        return Promise.reject(new Error('Ngày kết thúc phải sau ngày bắt đầu!'));
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder="Chọn ngày kết thúc"
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Địa điểm"
                name="addressInput"
                rules={[{ required: true, message: 'Vui lòng nhập địa điểm!' }]}
              >
                <EnhancedPlacesAutocomplete
                  value={selectedAddress}
                  onChange={handleAddressChange}
                  onPlaceSelect={handlePlaceSelect}
                  placeholder="Nhập địa điểm"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Thành phố"
                name="cityId"
                rules={[{ required: true, message: 'Vui lòng chọn thành phố!' }]}
              >
                <Select
                  placeholder="Chọn thành phố"
                  loading={citiesLoading}
                  dropdownRender={menu => (
                    <>
                      {menu}
                      <Divider style={{ margin: '8px 0' }} />
                      <Space style={{ padding: '0 8px 4px', width: '100%' }}>
                        <Input
                          placeholder="Nhập tên thành phố mới"
                          value={newCityName}
                          onChange={(e) => setNewCityName(e.target.value)}
                          onPressEnter={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (isInputFocused && newCityName.trim()) {
                              handleAddCity();
                            }
                          }}
                          onFocus={() => setIsInputFocused(true)}
                          onBlur={() => setIsInputFocused(false)}
                          style={{ flex: 1 }}
                        />
                        <Button
                          type="text"
                          icon={<PlusOutlined />}
                          onClick={handleAddCity}
                          disabled={!newCityName.trim()}
                        >
                          Thêm
                        </Button>
                        {getPendingChanges().hasChanges && (
                          <Button
                            type="link"
                            size="small"
                            onClick={() => setChangesModalVisible(true)}
                          >
                            Xem thay đổi ({getPendingChanges().newCities.length + getPendingChanges().deletedCities.length})
                          </Button>
                        )}
                      </Space>
                    </>
                  )}
                >
                  {displayCities.map(city => (
                    <Option key={city.id} value={city.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{city.name}</span>
                        <DeleteOutlined
                          style={{ color: 'red', fontSize: '12px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCity(city.id);
                          }}
                        />
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                label="Khung giờ hoạt động"
                name="slotIds"
                rules={[{required: "true", message: "Vui lòng chọn khung giờ hoạt động"}]}
              >
                <Select
                  mode="multiple"
                  placeholder="Chọn khung giờ hoạt động"
                  loading={slotsLoading}
                >
                  {slots.map(slot => (
                    <Option key={slot.slotID} value={slot.slotID}>
                      {slot.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                label="Mô tả"
                name="description"
              >
                <TextArea
                  rows={4}
                  placeholder="Nhập mô tả chi tiết về chương trình..."
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="Hình ảnh chương trình">
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleImageUpload}
                  beforeUpload={() => false} // Prevent auto upload
                  showUploadList={{
                    showPreviewIcon: false
                  }}
                  maxCount={1}
                >
                  {fileList.length === 0 && uploadButton}
                </Upload>
                {imageUrl && (
                  <div style={{ marginTop: 8 }}>
                    <img
                      src={imageUrl}
                      alt="Preview"
                      style={{
                        width: '100%',
                        maxWidth: 300,
                        height: 200,
                        objectFit: 'cover',
                        borderRadius: 8
                      }}
                    />
                  </div>
                )}
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
              <Button onClick={() => navigate('/admin/programs')}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Tạo chương trình
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>

      {/* Changes Review Modal */}
      <Modal
        title="Quản lý thay đổi"
        open={changesModalVisible}
        onCancel={() => setChangesModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setChangesModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={700}
      >
        {(() => {
          const changes = getPendingChanges();
          return (
            <div>
              {changes.newCities.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <Typography.Text strong style={{ color: '#52c41a' }}>
                    Thành phố mới sẽ được thêm:
                  </Typography.Text>
                  <div style={{ marginTop: 8 }}>
                    {changes.newCities.map(city => (
                      <div key={city.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 12px',
                        margin: '4px 0',
                        backgroundColor: '#f6ffed',
                        border: '1px solid #b7eb8f',
                        borderRadius: '4px'
                      }}>
                        <span>{city.name}</span>
                        <Button
                          size="small"
                          danger
                          onClick={() => revertNewCity(city.id)}
                        >
                          Hoàn tác
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {changes.deletedCities.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <Typography.Text strong style={{ color: '#ff4d4f' }}>
                    Thành phố sẽ bị xóa:
                  </Typography.Text>
                  <div style={{ marginTop: 8 }}>
                    {changes.deletedCities.map(city => (
                      <div key={city.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 12px',
                        margin: '4px 0',
                        backgroundColor: '#fff2f0',
                        border: '1px solid #ffccc7',
                        borderRadius: '4px'
                      }}>
                        <span>{city.name}</span>
                        <Button
                          size="small"
                          onClick={() => revertDeletedCity(city.id)}
                        >
                          Hoàn tác
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!changes.hasChanges && (
                <Typography.Text>Không có thay đổi nào.</Typography.Text>
              )}

              <div style={{ marginTop: 16, padding: 12, backgroundColor: '#f6f8fa', borderRadius: 6 }}>
                <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                  💡 Các thay đổi này chỉ được áp dụng khi bạn tạo chương trình thành công.
                </Typography.Text>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Confirmation Modal with Program Info and Changes */}
      <Modal
        title="Xác nhận tạo chương trình"
        open={confirmModalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setConfirmModalVisible(false);
          setPendingFormData(null);
        }}
        okText="Tạo chương trình"
        cancelText="Hủy"
        width={800}
        okButtonProps={{ loading: false }}
      >
        {pendingFormData && (
          <div>
            <Typography.Title level={4}>Thông tin chương trình:</Typography.Title>
            <div style={{ marginBottom: 20, padding: 16, backgroundColor: '#fafafa', borderRadius: 6 }}>
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <strong>Tên chương trình:</strong> {pendingFormData.proName}
                </Col>
                <Col span={12}>
                  <strong>Liên hệ:</strong> {pendingFormData.contact || 'Không có'}
                </Col>
                <Col span={12}>
                  <strong>Ngày bắt đầu:</strong> {pendingFormData.startDate?.format('DD/MM/YYYY')}
                </Col>
                <Col span={12}>
                  <strong>Ngày kết thúc:</strong> {pendingFormData.endDate?.format('DD/MM/YYYY')}
                </Col>
                <Col span={12}>
                  <strong>Địa điểm:</strong> {selectedPlaceData?.formattedAddress || selectedAddress || 'Không xác định'}
                </Col>
                {selectedPlaceData?.coordinates && (
                  <Col span={12}>
                    <strong>Tọa độ:</strong> {selectedPlaceData.coordinates.lat.toFixed(6)}, {selectedPlaceData.coordinates.lng.toFixed(6)}
                  </Col>
                )}
                <Col span={12}>
                  <strong>Thành phố:</strong> {displayCities.find(city => city.id === pendingFormData.cityId)?.name || 'Không xác định'}
                </Col>
                <Col span={24}>
                  <strong>Khung giờ:</strong> {
                    pendingFormData.slotIds?.length > 0
                      ? slots.filter(slot => pendingFormData.slotIds.includes(slot.slotID)).map(slot => slot.label).join(', ')
                      : 'Không có'
                  }
                </Col>
                {pendingFormData.description && (
                  <Col span={24}>
                    <strong>Mô tả:</strong> {pendingFormData.description}
                  </Col>
                )}
              </Row>
              {imageUrl && (
                <div style={{ marginTop: 12 }}>
                  <strong>Hình ảnh:</strong>
                  <div style={{ marginTop: 8 }}>
                    <img
                      src={imageUrl}
                      alt="Program preview"
                      style={{
                        width: '100%',
                        maxWidth: 200,
                        height: 120,
                        objectFit: 'cover',
                        borderRadius: 4
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {(() => {
              const changes = getPendingChanges();
              if (changes.hasChanges) {
                return (
                  <div>
                    <Typography.Title level={4} style={{ color: '#fa8c16' }}>
                      Các thay đổi sẽ được áp dụng:
                    </Typography.Title>

                    {changes.newCities.length > 0 && (
                      <div style={{ marginBottom: 12 }}>
                        <Typography.Text strong style={{ color: '#52c41a' }}>
                          ✅ Thêm thành phố mới:
                        </Typography.Text>
                        <ul style={{ marginTop: 4, marginBottom: 0, paddingLeft: 20 }}>
                          {changes.newCities.map(city => (
                            <li key={city.id}>{city.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {changes.deletedCities.length > 0 && (
                      <div style={{ marginBottom: 12 }}>
                        <Typography.Text strong style={{ color: '#ff4d4f' }}>
                          ❌ Xóa thành phố:
                        </Typography.Text>
                        <ul style={{ marginTop: 4, marginBottom: 0, paddingLeft: 20 }}>
                          {changes.deletedCities.map(city => (
                            <li key={city.id}>{city.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              }
              return null;
            })()}

            <div style={{ marginTop: 16, padding: 12, backgroundColor: '#e6f7ff', borderRadius: 6, border: '1px solid #91d5ff' }}>
              <Typography.Text style={{ fontSize: '13px' }}>
                ⚠️ Sau khi nhấn "Tạo chương trình", tất cả thay đổi sẽ được lưu vào cơ sở dữ liệu và không thể hoàn tác.
              </Typography.Text>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CreateProgram;