import { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCities } from "../../../redux/features/citySlice";
import { fetchSlots } from "../../../redux/features/slotSlice";
import { toast } from "react-toastify";
import dayjs from "dayjs";

// Import custom components and hooks
import ProgramFormFields from "./ProgramCreation/ProgramFormFields";
import ImageUpload from "./ProgramCreation/ImageUpload";
import ConfirmationModal from "./ProgramCreation/ConfirmationModal";
import useCityManagement from "./ProgramCreation/useCityManagement";
import useProgramSubmission from "./ProgramCreation/useProgramSubmission";

const { Title } = Typography;

const CreateProgram = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Basic form states
  const [imageUrl, setImageUrl] = useState(null); // Local preview URL
  const [firebaseImageUrl, setFirebaseImageUrl] = useState(null); // Firebase storage URL
  const [fileList, setFileList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedPlaceData, setSelectedPlaceData] = useState(null);
  
  // Modal states
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Get data from Redux store
  const { data: cities, loading: citiesLoading } = useSelector(state => state.city);
  const { data: slots, loading: slotsLoading } = useSelector(state => state.slot);

  // Custom hooks
  const cityManagement = useCityManagement(cities);
  const { submitProgram } = useProgramSubmission();

  useEffect(() => {
    dispatch(fetchCities());
    dispatch(fetchSlots());
  }, [dispatch]);

  // Handle Firebase image upload
  const handleFirebaseUpload = (url) => {
    setFirebaseImageUrl(url);
  };

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
      const matchingCity = cityManagement.displayCities.find(city => 
        city.name.toLowerCase().includes(placeData.city.toLowerCase()) ||
        placeData.city.toLowerCase().includes(city.name.toLowerCase())
      );
      
      if (matchingCity) {
        form.setFieldValue('cityId', matchingCity.id);
      } else {
        // If no matching city found, add it as a new staging city
        const cityExists = cityManagement.stagingCities.some(city => 
          city.name.toLowerCase() === placeData.city.toLowerCase()
        );
        
        if (!cityExists) {
          const tempId = Date.now();
          const newCity = { id: tempId, name: placeData.city, isStaging: true };
          cityManagement.setStagingCities(prev => [...prev, newCity]);
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

  // Handle form submission - show confirmation modal first
  const handleFormSubmit = (values) => {
    // Validate that address has been selected from Google Places
    if (!selectedPlaceData) {
      toast.error('Vui lòng chọn địa điểm từ danh sách gợi ý của Google Maps!');
      return;
    }
    
    // Check if image was uploaded to Firebase (optional warning)
    if (imageUrl && !firebaseImageUrl) {
      toast.warning('Bạn có ảnh nhưng chưa tải lên Firebase. Ảnh sẽ không được lưu trong chương trình.');
    }
    
    setPendingFormData(values);
    setConfirmModalVisible(true);
  };

  // Handle final submission
  const handleSubmit = async () => {
    setSubmitLoading(true);
    try {
      await submitProgram({
        values: pendingFormData,
        stagingCities: cityManagement.stagingCities,
        deletedCityIds: cityManagement.deletedCityIds,
        selectedPlaceData,
        imageUrl: firebaseImageUrl // Use Firebase URL instead of local preview
      });
    } catch {
      // Error handling is done in the hook
    } finally {
      setSubmitLoading(false);
      setConfirmModalVisible(false);
      setPendingFormData(null);
    }
  };

  // Enhanced revert functions that also clear form selection
  const revertNewCity = (cityId) => {
    cityManagement.revertNewCity(cityId);
    const currentCityId = form.getFieldValue('cityId');
    if (currentCityId === cityId) {
      form.setFieldValue('cityId', undefined);
    }
  };

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
          <ProgramFormFields
            selectedAddress={selectedAddress}
            handleAddressChange={handleAddressChange}
            handlePlaceSelect={handlePlaceSelect}
            citiesLoading={citiesLoading}
            stagingCities={cityManagement.stagingCities}
            setStagingCities={cityManagement.setStagingCities}
            setDeletedCityIds={cityManagement.setDeletedCityIds}
            displayCities={cityManagement.displayCities}
            form={form}
            getPendingChanges={cityManagement.getPendingChanges}
            revertNewCity={revertNewCity}
            revertDeletedCity={cityManagement.revertDeletedCity}
            slots={slots}
            slotsLoading={slotsLoading}
          />

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="Hình ảnh chương trình">
                <ImageUpload
                  imageUrl={imageUrl}
                  setImageUrl={setImageUrl}
                  fileList={fileList}
                  setFileList={setFileList}
                  onFirebaseUpload={handleFirebaseUpload}
                />
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

      <ConfirmationModal
        visible={confirmModalVisible}
        onConfirm={handleSubmit}
        onCancel={() => {
          setConfirmModalVisible(false);
          setPendingFormData(null);
        }}
        loading={submitLoading}
        pendingFormData={pendingFormData}
        selectedPlaceData={selectedPlaceData}
        selectedAddress={selectedAddress}
        displayCities={cityManagement.displayCities}
        slots={slots}
        imageUrl={firebaseImageUrl || imageUrl} // Show Firebase URL if available, fallback to local preview
        getPendingChanges={cityManagement.getPendingChanges}
      />
    </div>
  );
};

export default CreateProgram;
