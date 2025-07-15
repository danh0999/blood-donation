import { useState } from "react";
import { Upload, Button, Progress, message } from "antd";
import { PlusOutlined, CloudUploadOutlined } from "@ant-design/icons";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../firebase";

const ImageUpload = ({ imageUrl, setImageUrl, fileList, setFileList, onFirebaseUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [firebaseUrl, setFirebaseUrl] = useState(null);
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
        
        // Reset Firebase upload state when new file is selected
        setFirebaseUrl(null);
        setUploadProgress(0);
      }
    } else {
      setImageUrl(null);
      setFirebaseUrl(null);
      setUploadProgress(0);
    }
  };

  const handleFirebaseUpload = async () => {
    if (fileList.length === 0) {
      message.error("Vui lòng chọn ảnh trước khi tải lên!");
      return;
    }

    const file = fileList[0].originFileObj;
    if (!file) {
      message.error("Không tìm thấy file để tải lên!");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Create unique filename with timestamp
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `images/donation-programs/${fileName}`);
      
      // Create upload task for progress tracking (from your experimental uploader)
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Handle upload progress and completion
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Update progress
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setUploadProgress(progress);
        },
        (error) => {
          // Handle error
          setUploading(false);
          message.error("Lỗi khi tải ảnh lên Firebase: " + error.message);
        },
        () => {
          // Handle successful completion
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setFirebaseUrl(url);
            setUploading(false);
            
            // Notify parent component about the Firebase URL
            if (onFirebaseUpload) {
              onFirebaseUpload(url);
            }
            
            message.success("Ảnh đã được tải lên Firebase thành công!");
          });
        }
      );
    } catch (error) {
      setUploading(false);
      message.error("Lỗi khi tải ảnh lên Firebase: " + error.message);
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Chọn ảnh</div>
    </div>
  );

  return (
    <div>
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
          
          {/* Upload to Firebase Button */}
          <div style={{ marginTop: 12 }}>
            <Button
              type="primary"
              icon={<CloudUploadOutlined />}
              onClick={handleFirebaseUpload}
              loading={uploading}
              disabled={uploading || firebaseUrl}
              style={{ width: '100%' }}
            >
              {uploading ? 'Đang tải lên...' : firebaseUrl ? 'Đã tải lên Firebase' : 'Tải ảnh lên Firebase'}
            </Button>
            
            {uploading && (
              <Progress 
                percent={uploadProgress} 
                size="small" 
                style={{ marginTop: 8 }}
                status="active"
              />
            )}
            
            {firebaseUrl && (
              <div style={{ marginTop: 8, padding: 8, backgroundColor: '#f6ffed', borderRadius: 4 }}>
                <div style={{ fontSize: '12px', color: '#52c41a', fontWeight: 'bold' }}>
                  ✅ Ảnh đã được lưu trên Firebase
                </div>
                <div style={{ fontSize: '11px', color: '#666', wordBreak: 'break-all' }}>
                  URL: {firebaseUrl.substring(0, 50)}...
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
