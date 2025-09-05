import React, { useState } from "react";
import {
   Input,
   Button,
   Upload,
   DatePicker,
   Form,
   Select,
   message,
   Card,
} from "antd";
import {
   UploadOutlined,
   EditOutlined,
   SaveOutlined,
   CloseOutlined,
} from "@ant-design/icons";

const { Option } = Select;

export default function GestionProfile({ userData }) {
   const [isEditing, setIsEditing] = useState(false);
   const [form] = Form.useForm();
   const [profilePic, setProfilePic] = useState(
      userData?.profilePictureUrl || ""
   );

   const handleSubmit = (values) => {
      const dataToSave = {
         ...values,
         dateOfBirth: values.dateOfBirth
            ? values.dateOfBirth.toISOString().split("T")[0]
            : null,
         profilePictureUrl: profilePic,
      };
      console.log("Profile Data to Save:", dataToSave);
      message.success("Profile updated successfully!");
      setIsEditing(false);
   };

   const handleUpload = (file) => {
      setProfilePic(URL.createObjectURL(file));
      return false;
   };

   const ProfileView = () => (
      <Card
         hoverable
         style={{
            maxWidth: 500,
            margin: "50px auto",
            borderRadius: 20,
            boxShadow: "0 15px 40px rgba(0,0,0,0.15)",
            textAlign: "center",
            padding: "40px 30px",
            background: "linear-gradient(to bottom right, #f5f7fa, #e0f0ff)",
            transition: "transform 0.3s",
         }}
         bodyStyle={{ padding: 0 }}
      >
         <div style={{ marginBottom: 20 }}>
            {profilePic ? (
               <img
                  src={profilePic}
                  alt="Profile"
                  style={{
                     width: 150,
                     height: 150,
                     borderRadius: "50%",
                     objectFit: "cover",
                     border: "4px solid #31c1e1",
                     boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                     marginBottom: 15,
                  }}
               />
            ) : (
               <div
                  style={{
                     width: 150,
                     height: 150,
                     borderRadius: "50%",
                     background: "#d0d0d0",
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                     color: "#888",
                     fontSize: 30,
                     margin: "0 auto 15px",
                  }}
               >
                  ?
               </div>
            )}
            <h2 style={{ marginBottom: 10, fontWeight: 600, color: "#333" }}>
               {userData?.firstName} {userData?.lastName}
            </h2>
            <p style={{ margin: 4 }}>
               <b>Email:</b> {userData?.email}
            </p>
            <p style={{ margin: 4 }}>
               <b>Phone:</b> {userData?.phoneNumber}
            </p>
            <p style={{ margin: 4 }}>
               <b>Gender:</b> {userData?.gender}
            </p>
            <p style={{ margin: 4 }}>
               <b>Date of Birth:</b> {userData?.dateOfBirth}
            </p>
         </div>
         <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => setIsEditing(true)}
            style={{
               backgroundColor: "#31c1e1",
               borderColor: "#31c1e1",
               fontWeight: 500,
               width: "50%",
            }}
         >
            Modify
         </Button>
      </Card>
   );

   return (
      <div>
         {isEditing ? (
            <Card
               style={{
                  maxWidth: 500,
                  margin: "50px auto",
                  borderRadius: 20,
                  boxShadow: "0 15px 40px rgba(0,0,0,0.15)",
                  padding: "40px 30px",
                  background:
                     "linear-gradient(to bottom right, #f5f7fa, #e0f0ff)",
               }}
            >
               <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  initialValues={{
                     firstName: userData?.firstName,
                     lastName: userData?.lastName,
                     email: userData?.email,
                     phoneNumber: userData?.phoneNumber,
                     gender: userData?.gender,
                     dateOfBirth: userData?.dateOfBirth
                        ? new Date(userData.dateOfBirth)
                        : null,
                  }}
               >
                  <div style={{ textAlign: "center", marginBottom: 25 }}>
                     {profilePic && (
                        <img
                           src={profilePic}
                           alt="Profile"
                           style={{
                              width: 150,
                              height: 150,
                              borderRadius: "50%",
                              objectFit: "cover",
                              border: "4px solid #31c1e1",
                              marginBottom: 10,
                           }}
                        />
                     )}
                     <Upload
                        maxCount={1}
                        beforeUpload={handleUpload}
                        showUploadList={false}
                     >
                        <Button icon={<UploadOutlined />}>Upload Photo</Button>
                     </Upload>
                  </div>

                  <Form.Item label="First Name" name="firstName">
                     <Input placeholder="Enter your first name" />
                  </Form.Item>
                  <Form.Item label="Last Name" name="lastName">
                     <Input placeholder="Enter your last name" />
                  </Form.Item>
                  <Form.Item label="Email" name="email">
                     <Input type="email" placeholder="Enter your email" />
                  </Form.Item>
                  <Form.Item label="Phone Number" name="phoneNumber">
                     <Input placeholder="Enter your phone number" />
                  </Form.Item>
                  <Form.Item label="Gender" name="gender">
                     <Select placeholder="Select your gender">
                        <Option value="MALE">Male</Option>
                        <Option value="FEMALE">Female</Option>
                        <Option value="OTHER">Other</Option>
                     </Select>
                  </Form.Item>
                  <Form.Item label="Date of Birth" name="dateOfBirth">
                     <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                  <Form.Item style={{ textAlign: "center", marginTop: 25 }}>
                     <Button
                        type="primary"
                        htmlType="submit"
                        icon={<SaveOutlined />}
                        style={{
                           backgroundColor: "#31c1e1",
                           borderColor: "#31c1e1",
                           fontWeight: 500,
                           width: "45%",
                        }}
                     >
                        Save
                     </Button>
                     <Button
                        icon={<CloseOutlined />}
                        style={{ marginLeft: 15, width: "45%" }}
                        onClick={() => setIsEditing(false)}
                     >
                        Cancel
                     </Button>
                  </Form.Item>
               </Form>
            </Card>
         ) : (
            <ProfileView />
         )}
      </div>
   );
}
