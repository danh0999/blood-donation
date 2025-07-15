import { useState, useEffect } from "react";
import { Table, Button, Space, Modal } from "antd";
import dayjs from "dayjs";
import ProgramSearchBar from "./ProgramSearchBar";
import { FileSearchOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { deleteProgramById } from "../../../redux/features/programSlice";
import { deleteAddress } from "../../../redux/features/addressSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { storage } from "../../../firebase"; // Adjust the import based on your project structure
import { ref, deleteObject } from "firebase/storage";

const ProgramTablePanel = ({ selectedProgram, onSelectProgram, programs, programsLoading, addresses, addressesLoading }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Search/filter state
  const [category, setCategory] = useState("name"); // default to "name" to match dropdown
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState([null, null]); // use null for moment compatibility

  // State for delete modal and countdown
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [deleteBtnDisabled, setDeleteBtnDisabled] = useState(true);

  // Countdown logic for delete button
  useEffect(() => {
    let timer;
    if (deleteModalVisible && deleteBtnDisabled) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setDeleteBtnDisabled(false);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [deleteModalVisible, deleteBtnDisabled]);

  const showDeleteModal = (record) => {
    setDeleteTarget(record);
    setDeleteModalVisible(true);
    setCountdown(3);
    setDeleteBtnDisabled(true);
  };

  // delete program and it associated data (address, image)
  const handleDelete = async () => {
    try {
      let deleteTargetAddress = null;

      if (deleteTarget) {
        // Delete image from Firebase if exists
        if (deleteTarget.imageUrl) {
          try {
            // Get the file name from the firebase URL
            const imagePath = decodeURIComponent(deleteTarget.imageUrl.split('/o/')[1].split('?')[0]);
            const imageRef = ref(storage, imagePath);
            await deleteObject(imageRef);
          } catch (error) {
            console.error("Failed to delete image:", error);
            // Continue with program deletion even if image deletion fails
            // will probably fail if image is not from firebase
          }
        }

        // Delete program
        if (deleteTarget.addressId) {
          deleteTargetAddress = deleteTarget.addressId;
          await dispatch(deleteProgramById(deleteTarget.id));
        }

        // Delete address
        await dispatch(deleteAddress(deleteTargetAddress));
        
        toast.success('Xóa chương trình thành công');
        setDeleteModalVisible(false);
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa chương trình');
      console.error("Delete error:", error);
    }
  };

  const columns = [
    {
      title: "ProgramID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên chương trình",
      dataIndex: "proName",
      key: "proName",
      width: 300,

      //set the Name column to be scrollable
      render: (text) => (
        <div style={{ 
          maxWidth: '300px',
          overflowX: 'auto',
          whiteSpace: 'nowrap',

          /* Hide scrollbar */
          msOverflowStyle: 'none',  /* IE and Edge */
          scrollbarWidth: 'none',   /* Firefox */
          '&::WebkitScrollbar': {
            display: 'none'         /* Chrome, Safari and Opera */
          }
        }}>
          {text}
        </div>
      ),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
            <FileSearchOutlined
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/admin/programs/${record.id}`)}
            />
            
            <DeleteOutlined
              style={{ color: "red", cursor: "pointer" }}
              onClick={() => showDeleteModal(record)}
            />
          </Space>
      ),
    },
  ];

  // Map addressId to address name for display
  const getAddressName = (addressId) => {
    const address = addresses.find(addr => addr.id === addressId);
    return address ? address.name : "";
  };

  // Enrich program data with address name
  const enrichedPrograms = programs.map(program => ({
    ...program,
    addressName: getAddressName(program.addressId)
  }));

  // Filtering logic
  const filteredData = enrichedPrograms.filter((item) => {
    if (category === "name") {
      // If search text is present, filter the list based on searchText  
      return searchText ? item.proName?.toLowerCase().includes(searchText.toLowerCase()) : true;
    } else if (category === "date") {
      if (!dateRange || !dateRange[0] || !dateRange[1]) return true;
      // Show programs whose startDate is within the selected range
      const startDate = dayjs(item.startDate);
      return (
        startDate.isAfter(dateRange[0].startOf('day')) &&
        startDate.isBefore(dateRange[1].endOf('day'))
      );
    }
    return true;
  });

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "0.5rem", justifyContent: "space-between" }}>
        <ProgramSearchBar
          category={category}
          onCategoryChange={setCategory}
          searchText={searchText}
          onSearchTextChange={setSearchText}
          dateRange={dateRange}
          onDateRangeChange={(dates) => setDateRange(dates)}
        />
        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Button 
            type="primary"
            onClick={() => navigate('/admin/programs/create')}
          >
            Thêm chương trình
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        loading={programsLoading || addressesLoading}
        pagination={true}
        onRow={(record) => ({
          onClick: () => onSelectProgram(record),
          style: selectedProgram && selectedProgram.id === record.id ? { background: '#e6f7ff' } : {},
        })}
      />

      {/* Delete Program Modal */}
      <Modal
        title="Xác nhận xóa chương trình"
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setDeleteModalVisible(false)}>
            Hủy
          </Button>,
          <Button
            key="delete"
            type="primary"
            danger
            disabled={deleteBtnDisabled}
            onClick={handleDelete}
          >
            {deleteBtnDisabled ? `Xóa (${countdown})` : "Xóa"}
          </Button>,
        ]}
      >
        {deleteTarget && (
          <>
            Bạn có chắc chắn muốn xóa chương trình <b>{deleteTarget.proName}</b> (ID: {deleteTarget.id}) và các thông tin liên quan? Hành động này không thể hoàn tác.
          </>
        )}
      </Modal>
    </div>
  );
};

export default ProgramTablePanel;
