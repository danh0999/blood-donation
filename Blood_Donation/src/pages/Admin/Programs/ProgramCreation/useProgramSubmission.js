import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addProgram } from "../../../../redux/features/programSlice";
import { addCity, deleteCityById } from "../../../../redux/features/citySlice";
import { createAddress } from "../../../../redux/features/addressSlice";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const useProgramSubmission = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitProgram = async ({
    values,
    stagingCities,
    deletedCityIds,
    selectedPlaceData,
    imageUrl
  }) => {
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
      throw error;
    }
  };

  return { submitProgram };
};

export default useProgramSubmission;
