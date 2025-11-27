import React, { useState, useEffect } from "react";
import {
   Form,
   Input,
   Button,
   Upload,
   DatePicker,
   message,
   Card,
   Spin,
   Select,
   Avatar,
   Typography,
   Row,
   Col,
} from "antd";
import {
   EditOutlined,
   SaveOutlined,
   CloseOutlined,
   UserOutlined,
   CameraOutlined,
   MailOutlined,
   PhoneOutlined,
   CalendarOutlined,
   TeamOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { apiFetch, getEmailFromToken } from "../utils/api";

const { Option } = Select;
const { Text, Title } = Typography;

export default function GestionProfile() {
   const [isEditing, setIsEditing] = useState(false);
   const [form] = Form.useForm();
   const [userData, setUserData] = useState(null);
   const [loading, setLoading] = useState(true);
   const [previewImage, setpreviewImage] = useState(null);
   const [uploading, setUploading] = useState(false);

   // Helper function to calculate Profilee completion percentage
   // eslint-disable-next-line no-unused-vars
   const calculateProfileCompletion = () => {
      if (!userData) return 0;

      const ProfileeFields = [
         userData.firstName,
         userData.lastName,
         userData.phoneNumber,
         userData.dateOfBirth,
         userData.gender,
         userData.height, // For completion: any value counts (including 0)
         userData.weight, // For completion: any value counts (including 0)
         userData.bloodType,
         userData.allergies,
         userData.chronicConditions,
         userData.profilePictureUrl, // ✅ Fixed: use ProfileePictureUrl instead of ProfileePicture
      ];

      // Debug logging to see what's missing
      const fieldNames = [
         "firstName",
         "lastName",
         "phoneNumber",
         "dateOfBirth",
         "gender",
         "height",
         "weight",
         "bloodType",
         "allergies",
         "chronicConditions",
         "profilePictureUrl",
      ];

      ProfileeFields.forEach((field, index) => {
         const isEmpty =
            field === null ||
            field === undefined ||
            field === "" ||
            (typeof field === "string" && field.trim() === "");
         console.log(`🔍 Field ${index + 1}/11: ${fieldNames[index]}`, {
            value: field,
            type: typeof field,
            isNull: field === null,
            isUndefined: field === undefined,
            isEmpty: field === "",
            isWhitespace: typeof field === "string" && field.trim() === "",
            passes: !isEmpty ? "✅" : "❌",
         });
         if (isEmpty) {
            console.log(`❌ FAILING FIELD: ${fieldNames[index]} = "${field}"`);
         }
      });

      const completedFieldsArray = ProfileeFields.filter(
         (field) =>
            field !== null &&
            field !== undefined &&
            field !== "" &&
            (typeof field !== "string" || field.trim() !== "") // ✅ Fixed: handle whitespace-only strings
      );

      const completedFields = completedFieldsArray.length;

      console.log("🔍 DETAILED CALCULATION:", {
         totalFields: ProfileeFields.length,
         totalFieldsArray: ProfileeFields,
         completedCount: completedFields,
         completedFieldsArray: completedFieldsArray,
         exactPercentage: (completedFields / ProfileeFields.length) * 100,
         roundedPercentage: Math.round(
            (completedFields / ProfileeFields.length) * 100
         ),
      });

      const completionPercentage = Math.round(
         (completedFields / ProfileeFields.length) * 100
      );
      console.log(
         `🔍 Profilee completion: ${completedFields}/${ProfileeFields.length} = ${completionPercentage}%`
      );
      console.log("🔍 All field values:", ProfileeFields);
      console.log("🔍 Raw userData for debugging:", {
         Taille: userData.height,
         Poids: userData.weight,
         heightType: typeof userData.height,
         weightType: typeof userData.weight,
         heightAsNumber: Number(userData.height),
         weightAsNumber: Number(userData.weight),
      });
      return completionPercentage;
   };

   useEffect(() => {
      const fetchUserData = async () => {
         try {
            setLoading(true);
            const email = getEmailFromToken();
            if (!email) throw new Error("User not authenticated");

            const res = await apiFetch(`/api/profile/user/by-email/${email}`);
            if (!res.ok) throw new Error("Unable to load Profilee");

            const user = await res.json();
            setUserData(user);

            form.setFieldsValue({
               firstName: user.firstName || "",
               lastName: user.lastName || "",
               email: user.email || "",
               phoneNumber: user.phoneNumber || "",
               dateOfBirth: user.dateOfBirth ? moment(user.dateOfBirth) : null,
               gender: user.gender || "",
               weight:
                  user.weight !== null && user.weight !== undefined
                     ? user.weight
                     : null,
               height:
                  user.height !== null && user.height !== undefined
                     ? user.height
                     : null,
               bloodType: user.bloodType || null,
               allergies: user.allergies || "",
               chronicConditions: user.chronicConditions || "",
               medications: user.medications || "",
            });
         } catch (err) {
            console.error(err);
            message.error(err.message);
         } finally {
            setLoading(false);
         }
      };
      fetchUserData();
   }, [form]);

   // Sync form fields whenever userData changes
   useEffect(() => {
      if (userData && form) {
         form.setFieldsValue({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
            phoneNumber: userData.phoneNumber || "",
            dateOfBirth: userData.dateOfBirth
               ? moment(userData.dateOfBirth)
               : null,
            gender: userData.gender || "",
            weight:
               userData.weight !== null && userData.weight !== undefined
                  ? userData.weight
                  : null,
            height:
               userData.height !== null && userData.height !== undefined
                  ? userData.height
                  : null,
            bloodType: userData.bloodType || null,
            allergies: userData.allergies || "",
            chronicConditions: userData.chronicConditions || "",
            medications: userData.medications || "",
         });
      }
   }, [userData, form]);

   useEffect(() => {
      return () => {
         if (previewImage && previewImage.startsWith("blob:")) {
            URL.revokeObjectURL(previewImage);
         }
      };
   }, [previewImage]);

   const handleEdit = () => setIsEditing(true);

   const handleCancel = () => {
      setIsEditing(false);
      if (previewImage && previewImage.startsWith("blob:")) {
         URL.revokeObjectURL(previewImage);
         setpreviewImage(null);
      }
      if (userData) {
         form.setFieldsValue({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
            phoneNumber: userData.phoneNumber || "",
            dateOfBirth: userData.dateOfBirth
               ? moment(userData.dateOfBirth)
               : null,
            gender: userData.gender || "",
            weight:
               userData.weight !== null && userData.weight !== undefined
                  ? userData.weight
                  : null,
            height:
               userData.height !== null && userData.height !== undefined
                  ? userData.height
                  : null,
            bloodType: userData.bloodType || null,
            allergies: userData.allergies || "",
            chronicConditions: userData.chronicConditions || "",
            medications: userData.medications || "",
         });
      }
   };

   const handleSave = async () => {
      try {
         const values = await form.validateFields();
         console.log("🔍 Form values before Enregistrer:", values);

         const payload = {
            firstName: values.firstName !== undefined ? values.firstName : "",
            lastName: values.lastName !== undefined ? values.lastName : "",
            email: values.email !== undefined ? values.email : "",
            phoneNumber:
               values.phoneNumber !== undefined ? values.phoneNumber : "",
            dateOfBirth: values.dateOfBirth
               ? values.dateOfBirth.format("YYYY-MM-DD")
               : null,
            gender: values.gender !== undefined ? values.gender : "",
            weight:
               values.weight !== undefined &&
               values.weight !== "" &&
               values.weight !== null
                  ? Number(values.weight)
                  : null,
            height:
               values.height !== undefined &&
               values.height !== "" &&
               values.height !== null
                  ? Number(values.height)
                  : null,
            bloodType: values.bloodType || null,
            allergies: values.allergies !== undefined ? values.allergies : "",
            chronicConditions:
               values.chronicConditions !== undefined
                  ? values.chronicConditions
                  : "",
            medications:
               values.medications !== undefined ? values.medications : "",
         };
         console.log("🔍 Payload being sent to API:", payload);

         const res = await apiFetch(`/api/profile/${userData.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
         });

         if (!res.ok) throw new Error("Error during update");

         const updatedUser = await res.json();
         console.log("🔍 Updated user from API:", updatedUser);

         const newUserData = {
            ...updatedUser,
            ProfileePictureUrl: updatedUser.profilePictureUrl,
         };
         console.log("🔍 Setting userData to:", newUserData);

         setUserData(newUserData);

         // Force form update immediately
         form.setFieldsValue({
            firstName: updatedUser.firstName || "",
            lastName: updatedUser.lastName || "",
            email: updatedUser.email || "",
            phoneNumber: updatedUser.phoneNumber || "",
            dateOfBirth: updatedUser.dateOfBirth
               ? moment(updatedUser.dateOfBirth)
               : null,
            gender: updatedUser.gender || "",
            weight:
               updatedUser.weight !== null && updatedUser.weight !== undefined
                  ? updatedUser.weight
                  : null,
            height:
               updatedUser.height !== null && updatedUser.height !== undefined
                  ? updatedUser.height
                  : null,
            bloodType: updatedUser.bloodType || null,
            allergies: updatedUser.allergies || "",
            chronicConditions: updatedUser.chronicConditions || "",
            medications: updatedUser.medications || "",
         });
         console.log("🔍 Form forcefully updated after Enregistrer");

         message.success("Profil updated successfully!");
         setIsEditing(false);
      } catch (err) {
         console.error(err);
         message.error(err.message || "Error saving Profilee");
      }
   };

   const handleUpload = async ({ file }) => {
      const formData = new FormData();
      formData.append("file", file);

      try {
         setUploading(true);
         const res = await apiFetch(`/api/profile/${userData.id}/photo`, {
            method: "POST",
            body: formData,
         });

         if (!res.ok) throw new Error("Error uploading photo");

         const updatedUser = await res.json();

         if (file) {
            const objectUrl = URL.createObjectURL(file);
            setpreviewImage(objectUrl);
         }

         setUserData(updatedUser);
         message.success("Photo updated successfully!");
      } catch (err) {
         console.error(err);
         message.error(err.message || "Error during upload");
      } finally {
         setUploading(false);
      }
   };

   const beforeUpload = (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
         message.error("You can only upload image files!");
         return Upload.LIST_IGNORE;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
         message.error("ImÂGE must be smaller than 5MB!");
         return Upload.LIST_IGNORE;
      }
      return true;
   };

   if (loading) {
      return (
         <div
            style={{
               display: "flex",
               justifyContent: "center",
               alignItems: "center",
               minHeight: "500px",
               background: "#1A8BB7",
               borderRadius: "24px",
               border: "2px solid #E3E8EF",
            }}
         >
            <div style={{ textAlign: "center", color: "#ffffff" }}>
               <Spin size="large" style={{ color: "#ffffff" }} />
               <div style={{ marginTop: "16px", fontSize: "18px" }}>
                  Chargement de votre profil...
               </div>
            </div>
         </div>
      );
   }

   if (!userData) {
      return (
         <Card
            style={{
               textAlign: "center",
               padding: "60px",
               borderRadius: "24px",
               background: "#ff4d4f",
               border: "2px solid #E3E8EF",
               color: "#ffffff",
            }}
         >
            <Title level={3} style={{ color: "#ffffff" }}>
               Aucune donnée disponible
            </Title>
            <Text
               style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "16px" }}
            >
               Impossible de charger les informations du profil
            </Text>
         </Card>
      );
   }

   const displayImage =
      previewImage ||
      (userData.profilePictureUrl
         ? userData.profilePictureUrl.startsWith("http://") ||
           userData.profilePictureUrl.startsWith("https://")
            ? userData.profilePictureUrl
            : `http://localhost:8081/uploads/${userData.profilePictureUrl}`
         : undefined);
   console.log("User Data:", userData);
   console.log("Profile Picture URL:", userData.profilePictureUrl);
   console.log("Display Image:", displayImage);
   return (
      <>
         <style>
            {`
               @keyframes pulse-glow {
                  0%, 100% {
                     box-shadow: 0 0 20px rgba(26, 188, 156, 0.4);
                  }
                  50% {
                     box-shadow: 0 0 30px rgba(26, 188, 156, 0.8);
                  }
               }
            `}
         </style>
         <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            {!isEditing ? (
               // View Mode - Full Screen Profilee Display
               <Card
                  style={{
                     borderRadius: "32px",
                     border: "3px solid #E3E8EF",
                     overflow: "hidden",
                     background: "#1A8BB7",
                     position: "relative",
                     boxShadow: "0 20px 60px rgba(26,139,183,0.15)",
                  }}
                  bodyStyle={{ padding: 0 }}
               >
                  {/* Subtle geometric accents */}
                  <div
                     style={{
                        position: "absolute",
                        top: "-100px",
                        right: "-100px",
                        width: "300px",
                        height: "300px",
                        background: "rgba(26,188,156,0.2)",
                        borderRadius: "50%",
                        filter: "blur(80px)",
                     }}
                  />
                  <div
                     style={{
                        position: "absolute",
                        bottom: "-80px",
                        left: "-80px",
                        width: "200px",
                        height: "200px",
                        background: "rgba(255,255,255,0.1)",
                        borderRadius: "50%",
                        filter: "blur(60px)",
                     }}
                  />

                  {/* Content */}
                  <div
                     style={{
                        position: "relative",
                        zIndex: 2,
                        padding: "32px 24px",
                        textAlign: "center",
                        color: "#ffffff",
                     }}
                  >
                     {/* Profilee Picture Section */}

                     <div
                        style={{
                           position: "absolute",
                           top: "-30%",
                           right: "-10%",
                           width: "200px",
                           height: "200px",
                           background: "rgba(26,188,156,0.3)",
                           borderRadius: "50%",
                           filter: "blur(60px)",
                        }}
                     />

                     <Row align="middle" gutter={[24, 16]}>
                        <Col xs={24} sm={12} md={10}>
                           {" "}
                           {/* Changed from md={8} to md={10} for more space */}
                           <div
                              style={{
                                 position: "relative",
                                 zIndex: 2,
                                 textAlign: "center",
                              }}
                           >
                              {/* Profilee picture with progress border */}
                              <div
                                 style={{
                                    position: "relative",
                                    display: "inline-block",
                                 }}
                              >
                                 {/* Progress circle background - made bigger */}
                                 <div
                                    style={{
                                       position: "absolute",
                                       top: "-10px", // Increased from -8px
                                       left: "-10px", // Increased from -8px
                                       width: "200px", // Increased from 156px
                                       height: "200px", // Increased from 156px
                                       borderRadius: "50%",
                                       background: `conic-gradient(
                                       #1ABC9C 0deg ${(() => {
                                          // Complete Profilee fields including health data
                                          const ProfileeFields = [
                                             // Basic Info (5 fields)
                                             userData.firstName,
                                             userData.lastName,
                                             userData.phoneNumber,
                                             userData.dateOfBirth,
                                             userData.gender,
                                             // Health Info (6 fields)
                                             userData.height &&
                                             Number(userData.height) > 0
                                                ? userData.height
                                                : null,
                                             userData.weight &&
                                             Number(userData.weight) > 0
                                                ? userData.weight
                                                : null,
                                             userData.bloodType,
                                             userData.allergies,
                                             userData.chronicConditions,
                                             userData.profilePictureUrl,
                                          ];

                                          const completedFields =
                                             ProfileeFields.filter(
                                                (field) =>
                                                   field !== null &&
                                                   field !== undefined &&
                                                   field !== ""
                                             ).length;

                                          const completionPercentÂGE =
                                             (completedFields /
                                                ProfileeFields.length) *
                                             100;
                                          return (
                                             completionPercentÂGE * 3.6
                                          ).toFixed(1);
                                       })()}deg,
                                       rgba(255, 255, 255, 0.2) ${(() => {
                                          const ProfileeFields = [
                                             userData.firstName,
                                             userData.lastName,
                                             userData.phoneNumber,
                                             userData.dateOfBirth,
                                             userData.gender,
                                             userData.height &&
                                             Number(userData.height) > 0
                                                ? userData.height
                                                : null,
                                             userData.weight &&
                                             Number(userData.weight) > 0
                                                ? userData.weight
                                                : null,
                                             userData.bloodType,
                                             userData.allergies,
                                             userData.chronicConditions,
                                             userData.profilePictureUrl,
                                          ];
                                          const completedFields =
                                             ProfileeFields.filter(
                                                (field) =>
                                                   field !== null &&
                                                   field !== undefined &&
                                                   field !== ""
                                             ).length;
                                          const completionPercentÂGE =
                                             (completedFields /
                                                ProfileeFields.length) *
                                             100;
                                          return (
                                             completionPercentÂGE * 3.6
                                          ).toFixed(1);
                                       })()}deg 360deg
                                    )`,
                                       boxShadow: `0 0 25px rgba(26, 188, 156, ${(() => {
                                          const ProfileeFields = [
                                             userData.firstName,
                                             userData.lastName,
                                             userData.phoneNumber,
                                             userData.dateOfBirth,
                                             userData.gender,
                                             userData.height &&
                                             Number(userData.height) > 0
                                                ? userData.height
                                                : null,
                                             userData.weight &&
                                             Number(userData.weight) > 0
                                                ? userData.weight
                                                : null,
                                             userData.bloodType,
                                             userData.allergies,
                                             userData.chronicConditions,
                                             userData.profilePictureUrl,
                                          ];
                                          const completedFields =
                                             ProfileeFields.filter(
                                                (field) =>
                                                   field !== null &&
                                                   field !== undefined &&
                                                   field !== ""
                                             ).length;
                                          const completionPercentÂGE =
                                             (completedFields /
                                                ProfileeFields.length) *
                                             100;
                                          return (
                                             (completionPercentÂGE / 100) *
                                             0.7
                                          ).toFixed(2); // Increased glow intensity
                                       })()})`,
                                       animation:
                                          "pulse-glow 2s ease-in-out infinite",
                                    }}
                                 />

                                 {/* Inner white circle to create border effect - made bigger */}
                                 <div
                                    style={{
                                       position: "absolute",
                                       top: "-5px", // Adjusted for new size
                                       left: "-5px", // Adjusted for new size
                                       width: "190px", // Increased from 148px
                                       height: "190px", // Increased from 148px
                                       borderRadius: "50%",
                                       background: "rgba(255, 255, 255, 0.1)",
                                    }}
                                 />

                                 {displayImage ? (
                                    <div
                                       style={{
                                          width: 180,
                                          height: 180,
                                          borderRadius: "50%",
                                          overflow: "hidden",
                                          border:
                                             "3px solid rgba(255, 255, 255, 0.3)",
                                          boxShadow:
                                             "0 15px 40px rgba(0,0,0,0.25)",
                                          backgroundColor:
                                             "rgba(255, 255, 255, 0.1)",
                                          position: "relative",
                                          zIndex: 2,
                                       }}
                                    >
                                       <img
                                          src={displayImage}
                                          alt="Profile"
                                          referrerPolicy="no-referrer"
                                          style={{
                                             width: "100%",
                                             height: "100%",
                                             objectFit: "cover",
                                          }}
                                       />
                                    </div>
                                 ) : (
                                    <Avatar
                                       size={180}
                                       icon={<UserOutlined />}
                                       style={{
                                          border:
                                             "3px solid rgba(255, 255, 255, 0.3)",
                                          boxShadow:
                                             "0 15px 40px rgba(0,0,0,0.25)",
                                          backgroundColor:
                                             "rgba(255, 255, 255, 0.1)",
                                          position: "relative",
                                          zIndex: 2,
                                       }}
                                    />
                                 )}

                                 <Upload
                                    showUploadList={false}
                                    customRequest={handleUpload}
                                    accept="imÂGE/*"
                                    beforeUpload={beforeUpload}
                                    disabled={uploading}
                                 >
                                    <Button
                                       type="primary"
                                       shape="circle"
                                       size="large"
                                       icon={<CameraOutlined />}
                                       loading={uploading}
                                       style={{
                                          position: "absolute",
                                          bottom: "8px", // Adjusted for new avatar size
                                          right: "8px", // Adjusted for new avatar size
                                          background: "#ffffff",
                                          color: "#1A8BB7",
                                          border: "none",
                                          width: "48px", // Made camera button bigger too
                                          height: "48px", // Made camera button bigger too
                                          boxShadow:
                                             "0 4px 16px rgba(0,0,0,0.2)",
                                          zIndex: 3,
                                       }}
                                    />
                                 </Upload>
                              </div>
                              {/* Status indicators below avatar */}
                              <div
                                 style={{
                                    marginTop: "20px", // Increased margin for better spacing
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "10px", // Increased gap
                                    alignItems: "center",
                                 }}
                              >
                                 {/* Profilee Completion PercentÂGE - made bigger */}
                                 <div
                                    style={{
                                       background: "rgba(255, 255, 255, 0.15)",
                                       padding: "8px 16px", // Increased padding
                                       borderRadius: "16px", // Increased border radius
                                       backdropFilter: "blur(10px)",
                                       border:
                                          "1px solid rgba(255, 255, 255, 0.2)",
                                    }}
                                 >
                                    <Text
                                       style={{
                                          color: "rgba(255, 255, 255, 0.9)",
                                          fontSize: "14px", // Increased from 12px
                                          fontWeight: 600,
                                       }}
                                    >
                                       📋 Profile{" "}
                                       {(() => {
                                          const ProfileeFields = [
                                             userData.firstName,
                                             userData.lastName,
                                             userData.phoneNumber,
                                             userData.dateOfBirth,
                                             userData.gender,
                                             userData.height &&
                                             Number(userData.height) > 0
                                                ? userData.height
                                                : null,
                                             userData.weight &&
                                             Number(userData.weight) > 0
                                                ? userData.weight
                                                : null,
                                             userData.bloodType,
                                             userData.allergies,
                                             userData.chronicConditions,
                                             userData.profilePictureUrl,
                                          ];
                                          const completedFields =
                                             ProfileeFields.filter(
                                                (field) =>
                                                   field !== null &&
                                                   field !== undefined &&
                                                   field !== ""
                                             ).length;
                                          const completionPercentÂGE =
                                             Math.round(
                                                (completedFields /
                                                   ProfileeFields.length) *
                                                   100
                                             );
                                          return completionPercentÂGE;
                                       })()}
                                       % complet
                                    </Text>
                                 </div>

                                 {/* Member since - bigger text */}
                                 <Text
                                    style={{
                                       color: "rgba(255, 255, 255, 0.7)",
                                       fontSize: "13px", // Increased from 11px
                                       fontWeight: 500,
                                    }}
                                 >
                                    Membre VitaCare depuis{" "}
                                    {userData.createdAt
                                       ? moment(userData.createdAt).format(
                                            "YYYY"
                                         )
                                       : "2025"}
                                 </Text>
                              </div>
                           </div>
                        </Col>

                        <Col xs={24} sm={12} md={14}>
                           {" "}
                           {/* Changed from md={16} to md={14} to balance */}
                           <div
                              style={{
                                 textAlign: "left",
                                 position: "relative",
                                 zIndex: 2,
                                 padding: "0 20px",
                              }}
                           >
                              {/* Main user identity */}
                              <div style={{ marginBottom: "20px" }}>
                                 <Title
                                    level={2}
                                    style={{
                                       color: "#ffffff",
                                       marginBottom: "4px",
                                       fontSize: "28px",
                                       fontWeight: 700,
                                       letterSpacing: "-0.5px",
                                    }}
                                 >
                                    {userData.firstName && userData.lastName
                                       ? `${userData.firstName} ${userData.lastName}`
                                       : "VitaCare User"}
                                 </Title>
                                 <Text
                                    style={{
                                       color: "rgba(255, 255, 255, 0.8)",
                                       fontSize: "16px",
                                       fontWeight: 500,
                                    }}
                                 >
                                    {userData.email}
                                 </Text>
                              </div>

                              {/* Key demographics row */}
                              <div
                                 style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "20px",
                                    marginBottom: "20px",
                                    padding: "16px 0",
                                    borderTop:
                                       "1px solid rgba(255, 255, 255, 0.2)",
                                    borderBottom:
                                       "1px solid rgba(255, 255, 255, 0.2)",
                                 }}
                              >
                                 {userData.dateOfBirth && (
                                    <div
                                       style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "8px",
                                       }}
                                    >
                                       <CalendarOutlined
                                          style={{
                                             color: "rgba(255, 255, 255, 0.9)",
                                             fontSize: "16px",
                                          }}
                                       />
                                       <div>
                                          <Text
                                             style={{
                                                color: "rgba(255, 255, 255, 0.7)",
                                                fontSize: "12px",
                                                display: "block",
                                             }}
                                          >
                                             ÂGE
                                          </Text>
                                          <Text
                                             style={{
                                                color: "rgba(255, 255, 255, 0.95)",
                                                fontSize: "16px",
                                                fontWeight: 600,
                                             }}
                                          >
                                             {moment().diff(
                                                moment(userData.dateOfBirth),
                                                "years"
                                             )}{" "}
                                             ans
                                          </Text>
                                       </div>
                                    </div>
                                 )}

                                 {userData.gender && (
                                    <div
                                       style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "8px",
                                       }}
                                    >
                                       <TeamOutlined
                                          style={{
                                             color: "rgba(255, 255, 255, 0.9)",
                                             fontSize: "16px",
                                          }}
                                       />
                                       <div>
                                          <Text
                                             style={{
                                                color: "rgba(255, 255, 255, 0.7)",
                                                fontSize: "12px",
                                                display: "block",
                                             }}
                                          >
                                             Genre
                                          </Text>
                                          <Text
                                             style={{
                                                color: "rgba(255, 255, 255, 0.95)",
                                                fontSize: "16px",
                                                fontWeight: 600,
                                             }}
                                          >
                                             {userData.gender === "MALE"
                                                ? "Male"
                                                : "Female"}
                                          </Text>
                                       </div>
                                    </div>
                                 )}

                                 {userData.phoneNumber && (
                                    <div
                                       style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "8px",
                                       }}
                                    >
                                       <PhoneOutlined
                                          style={{
                                             color: "rgba(255, 255, 255, 0.9)",
                                             fontSize: "16px",
                                          }}
                                       />
                                       <div>
                                          <Text
                                             style={{
                                                color: "rgba(255, 255, 255, 0.7)",
                                                fontSize: "12px",
                                                display: "block",
                                             }}
                                          >
                                             CONTACT
                                          </Text>
                                          <Text
                                             style={{
                                                color: "rgba(255, 255, 255, 0.95)",
                                                fontSize: "16px",
                                                fontWeight: 600,
                                             }}
                                          >
                                             {userData.phoneNumber}
                                          </Text>
                                       </div>
                                    </div>
                                 )}
                              </div>

                              {/* Health metrics */}
                              {((userData.height &&
                                 Number(userData.height) > 0) ||
                                 (userData.weight &&
                                    Number(userData.weight) > 0) ||
                                 userData.bloodType) && (
                                 <div style={{ marginBottom: "20px" }}>
                                    <Text
                                       style={{
                                          color: "rgba(255, 255, 255, 0.9)",
                                          fontSize: "14px",
                                          fontWeight: 600,
                                          display: "block",
                                          marginBottom: "12px",
                                          letterSpacing: "0.5px",
                                       }}
                                    >
                                       📋 DONNÉES MÉDICALES
                                    </Text>
                                    <div
                                       style={{
                                          display: "flex",
                                          flexWrap: "wrap",
                                          gap: "16px",
                                       }}
                                    >
                                       {userData.bloodType && (
                                          <div
                                             style={{
                                                background:
                                                   "rgba(255, 255, 255, 0.15)",
                                                padding: "8px 14px",
                                                borderRadius: "20px",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "6px",
                                             }}
                                          >
                                             <span style={{ fontSize: "14px" }}>
                                                🩸
                                             </span>
                                             <Text
                                                style={{
                                                   color: "rgba(255, 255, 255, 0.9)",
                                                   fontSize: "14px",
                                                   fontWeight: 500,
                                                }}
                                             >
                                                {userData.bloodType}
                                             </Text>
                                          </div>
                                       )}
                                       {userData.height &&
                                          Number(userData.height) > 0 && (
                                             <div
                                                style={{
                                                   background:
                                                      "rgba(255, 255, 255, 0.15)",
                                                   padding: "8px 14px",
                                                   borderRadius: "20px",
                                                   display: "flex",
                                                   alignItems: "center",
                                                   gap: "6px",
                                                }}
                                             >
                                                <span
                                                   style={{ fontSize: "14px" }}
                                                >
                                                   📏
                                                </span>
                                                <Text
                                                   style={{
                                                      color: "rgba(255, 255, 255, 0.9)",
                                                      fontSize: "14px",
                                                      fontWeight: 500,
                                                   }}
                                                >
                                                   {userData.height} cm
                                                </Text>
                                             </div>
                                          )}
                                       {userData.weight &&
                                          Number(userData.weight) > 0 && (
                                             <div
                                                style={{
                                                   background:
                                                      "rgba(255, 255, 255, 0.15)",
                                                   padding: "8px 14px",
                                                   borderRadius: "20px",
                                                   display: "flex",
                                                   alignItems: "center",
                                                   gap: "6px",
                                                }}
                                             >
                                                <span
                                                   style={{ fontSize: "14px" }}
                                                >
                                                   ⚖️
                                                </span>
                                                <Text
                                                   style={{
                                                      color: "rgba(255, 255, 255, 0.9)",
                                                      fontSize: "14px",
                                                      fontWeight: 500,
                                                   }}
                                                >
                                                   {userData.weight} kg
                                                </Text>
                                             </div>
                                          )}
                                       {userData.height &&
                                          Number(userData.height) > 0 &&
                                          userData.weight &&
                                          Number(userData.weight) > 0 && (
                                             <div
                                                style={{
                                                   background:
                                                      "rgba(255, 255, 255, 0.15)",
                                                   padding: "8px 14px",
                                                   borderRadius: "20px",
                                                   display: "flex",
                                                   alignItems: "center",
                                                   gap: "6px",
                                                }}
                                             >
                                                <span
                                                   style={{ fontSize: "14px" }}
                                                >
                                                   📊
                                                </span>
                                                <Text
                                                   style={{
                                                      color: "rgba(255, 255, 255, 0.95)",
                                                      fontSize: "14px",
                                                      fontWeight: 600,
                                                   }}
                                                >
                                                   IMC{" "}
                                                   {(
                                                      userData.weight /
                                                      Math.pow(
                                                         userData.height / 100,
                                                         2
                                                      )
                                                   ).toFixed(1)}
                                                </Text>
                                             </div>
                                          )}
                                    </div>
                                 </div>
                              )}

                              {/* ALERTES MÉDICALES - compact version */}
                              {(userData.allergies ||
                                 userData.chronicConditions) && (
                                 <div
                                    style={{
                                       background: "rgba(255, 255, 255, 0.15)",
                                       border:
                                          "1px solid rgba(255, 255, 255, 0.15)",
                                       padding: "12px 16px",
                                       borderRadius: "12px",
                                       marginTop: "16px",
                                    }}
                                 >
                                    <div
                                       style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "8px",
                                          marginBottom: "8px",
                                       }}
                                    >
                                       <span style={{ fontSize: "16px" }}>
                                          ⚠️
                                       </span>
                                       <Text
                                          style={{
                                             color: "rgba(255, 255, 255, 0.95)",
                                             fontSize: "14px",
                                             fontWeight: 600,
                                          }}
                                       >
                                          ALERTES MÉDICALES
                                       </Text>
                                    </div>
                                    {userData.allergies && (
                                       <Text
                                          style={{
                                             color: "rgba(255, 255, 255, 0.9)",
                                             fontSize: "13px",
                                             display: "block",
                                             marginBottom: "4px",
                                          }}
                                       >
                                          • allergies:{" "}
                                          {userData.allergies.length > 40
                                             ? userData.allergies.substring(
                                                  0,
                                                  40
                                               ) + "..."
                                             : userData.allergies}
                                       </Text>
                                    )}
                                    {userData.chronicConditions && (
                                       <Text
                                          style={{
                                             color: "rgba(255, 255, 255, 0.9)",
                                             fontSize: "13px",
                                             display: "block",
                                             marginBottom: "4px",
                                          }}
                                       >
                                          • Maladies chroniques :{" "}
                                          {userData.chronicConditions.length >
                                          40
                                             ? userData.chronicConditions.substring(
                                                  0,
                                                  40
                                               ) + "..."
                                             : userData.chronicConditions}
                                       </Text>
                                    )}
                                    {userData.medications && (
                                       <Text
                                          style={{
                                             color: "rgba(255, 255, 255, 0.9)",
                                             fontSize: "13px",
                                             display: "block",
                                          }}
                                       >
                                          • medications:{" "}
                                          {userData.medications.length > 40
                                             ? userData.medications.substring(
                                                  0,
                                                  40
                                               ) + "..."
                                             : userData.medications}
                                       </Text>
                                    )}
                                 </div>
                              )}
                           </div>
                        </Col>
                     </Row>

                     {/* Edit Button */}
                     <div
                        style={{
                           marginTop: "32px",
                           padding: "0 20px",
                        }}
                     >
                        <Button
                           type="primary"
                           size="large"
                           icon={<EditOutlined />}
                           onClick={handleEdit}
                           block
                           style={{
                              background: "#ffffff",
                              color: "#1A8BB7",
                              border: "none",
                              borderRadius: "16px",
                              padding: "8px 32px",
                              height: "56px",
                              fontSize: "16px",
                              fontWeight: 600,
                              boxShadow: "0 8px 24px rgba(255, 255, 255, 0.2)",
                              transform: "translateY(0)",
                              transition:
                                 "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                           }}
                           onMouseEnter={(e) => {
                              e.currentTarget.style.transform =
                                 "translateY(-2px)";
                              e.currentTarget.style.boxShadow =
                                 "0 12px 32px rgba(255, 255, 255, 0.3)";
                           }}
                           onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow =
                                 "0 8px 24px rgba(255, 255, 255, 0.2)";
                           }}
                        >
                           Modifier mon profil
                        </Button>
                     </div>
                  </div>
               </Card>
            ) : (
               // Edit Mode - Stacked Layout
               <div
                  style={{
                     display: "flex",
                     flexDirection: "column",
                     gap: "32px",
                  }}
               >
                  {/* Profilee Picture Section */}
                  <Card
                     style={{
                        borderRadius: "24px",
                        border: "3px solid #E3E8EF",
                        boxShadow: "0 15px 45px rgba(26,139,183,0.12)",
                        background: "#1A8BB7",
                        textAlign: "center",
                        padding: "30px 40px",
                        color: "#ffffff",
                        position: "relative",
                        overflow: "hidden",
                     }}
                  >
                     {/* Subtle background accent */}
                     <div
                        style={{
                           position: "absolute",
                           top: "-30%",
                           right: "-10%",
                           width: "200px",
                           height: "200px",
                           background: "rgba(26,188,156,0.3)",
                           borderRadius: "50%",
                           filter: "blur(60px)",
                        }}
                     />

                     <Row align="middle" gutter={[48, 24]}>
                        <Col xs={24} sm={12} md={10}>
                           <div
                              style={{
                                 position: "relative",
                                 zIndex: 2,
                                 textAlign: "center",
                              }}
                           >
                              {/* Profilee picture with progress border */}
                              <div
                                 style={{
                                    position: "relative",
                                    display: "inline-block",
                                 }}
                              >
                                 {/* Progress circle background */}
                                 <div
                                    style={{
                                       position: "absolute",
                                       top: "-10px",
                                       left: "-10px",
                                       width: "200px",
                                       height: "200px",
                                       borderRadius: "50%",
                                       background: `conic-gradient(
                                       #1ABC9C 0deg ${(() => {
                                          // Complete Profilee fields including health data
                                          const ProfileeFields = [
                                             // Basic Info (5 fields)
                                             userData.firstName,
                                             userData.lastName,
                                             userData.phoneNumber,
                                             userData.dateOfBirth,
                                             userData.gender,
                                             // Health Info (6 fields)
                                             userData.height &&
                                             Number(userData.height) > 0
                                                ? userData.height
                                                : null,
                                             userData.weight &&
                                             Number(userData.weight) > 0
                                                ? userData.weight
                                                : null,
                                             userData.bloodType,
                                             userData.allergies,
                                             userData.chronicConditions,
                                             userData.profilePictureUrl,
                                          ];

                                          const completedFields =
                                             ProfileeFields.filter(
                                                (field) =>
                                                   field !== null &&
                                                   field !== undefined &&
                                                   field !== ""
                                             ).length;

                                          const completionPercentÂGE =
                                             (completedFields /
                                                ProfileeFields.length) *
                                             100;
                                          return (
                                             completionPercentÂGE * 3.6
                                          ).toFixed(1);
                                       })()}deg,
                                       rgba(255, 255, 255, 0.2) ${(() => {
                                          const ProfileeFields = [
                                             userData.firstName,
                                             userData.lastName,
                                             userData.phoneNumber,
                                             userData.dateOfBirth,
                                             userData.gender,
                                             userData.height &&
                                             Number(userData.height) > 0
                                                ? userData.height
                                                : null,
                                             userData.weight &&
                                             Number(userData.weight) > 0
                                                ? userData.weight
                                                : null,
                                             userData.bloodType,
                                             userData.allergies,
                                             userData.chronicConditions,
                                             userData.profilePictureUrl,
                                          ];
                                          const completedFields =
                                             ProfileeFields.filter(
                                                (field) =>
                                                   field !== null &&
                                                   field !== undefined &&
                                                   field !== ""
                                             ).length;
                                          const completionPercentÂGE =
                                             (completedFields /
                                                ProfileeFields.length) *
                                             100;
                                          return (
                                             completionPercentÂGE * 3.6
                                          ).toFixed(1);
                                       })()}deg 360deg
                                    )`,
                                       boxShadow: `0 0 20px rgba(26, 188, 156, ${(() => {
                                          const ProfileeFields = [
                                             userData.firstName,
                                             userData.lastName,
                                             userData.phoneNumber,
                                             userData.dateOfBirth,
                                             userData.gender,
                                             userData.height &&
                                             Number(userData.height) > 0
                                                ? userData.height
                                                : null,
                                             userData.weight &&
                                             Number(userData.weight) > 0
                                                ? userData.weight
                                                : null,
                                             userData.bloodType,
                                             userData.allergies,
                                             userData.chronicConditions,
                                             userData.profilePictureUrl,
                                          ];
                                          const completedFields =
                                             ProfileeFields.filter(
                                                (field) =>
                                                   field !== null &&
                                                   field !== undefined &&
                                                   field !== ""
                                             ).length;
                                          const completionPercentÂGE =
                                             (completedFields /
                                                ProfileeFields.length) *
                                             100;
                                          return (
                                             (completionPercentÂGE / 100) *
                                             0.6
                                          ).toFixed(2);
                                       })()})`,
                                       animation:
                                          "pulse-glow 2s ease-in-out infinite",
                                    }}
                                 />

                                 {/* Inner white circle to create border effect */}
                                 <div
                                    style={{
                                       position: "absolute",
                                       top: "-6px",
                                       left: "-6px",
                                       width: "192px",
                                       height: "192px",
                                       borderRadius: "50%",
                                       background: "rgba(255, 255, 255, 0.1)",
                                    }}
                                 />

                                 {displayImage ? (
                                    <div
                                       style={{
                                          width: 180,
                                          height: 180,
                                          borderRadius: "50%",
                                          overflow: "hidden",
                                          border:
                                             "2px solid rgba(255, 255, 255, 0.3)",
                                          boxShadow:
                                             "0 12px 32px rgba(0,0,0,0.2)",
                                          backgroundColor:
                                             "rgba(255, 255, 255, 0.1)",
                                          position: "relative",
                                          zIndex: 2,
                                       }}
                                    >
                                       <img
                                          src={displayImage}
                                          alt="Profile"
                                          referrerPolicy="no-referrer"
                                          style={{
                                             width: "100%",
                                             height: "100%",
                                             objectFit: "cover",
                                          }}
                                       />
                                    </div>
                                 ) : (
                                    <Avatar
                                       size={180}
                                       icon={<UserOutlined />}
                                       style={{
                                          border:
                                             "2px solid rgba(255, 255, 255, 0.3)",
                                          boxShadow:
                                             "0 12px 32px rgba(0,0,0,0.2)",
                                          backgroundColor:
                                             "rgba(255, 255, 255, 0.1)",
                                          position: "relative",
                                          zIndex: 2,
                                       }}
                                    />
                                 )}

                                 <Upload
                                    showUploadList={false}
                                    customRequest={handleUpload}
                                    accept="imÂGE/*"
                                    beforeUpload={beforeUpload}
                                    disabled={uploading}
                                 >
                                    <Button
                                       type="primary"
                                       shape="circle"
                                       size="large"
                                       icon={<CameraOutlined />}
                                       loading={uploading}
                                       style={{
                                          position: "absolute",
                                          bottom: "8px",
                                          right: "8px",
                                          background: "#ffffff",
                                          color: "#1A8BB7",
                                          border: "none",
                                          width: "48px",
                                          height: "48px",
                                          boxShadow:
                                             "0 4px 16px rgba(0,0,0,0.2)",
                                          zIndex: 3,
                                       }}
                                    />
                                 </Upload>
                              </div>
                              {/* Status indicators below avatar */}
                              <div
                                 style={{
                                    marginTop: "16px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "8px",
                                    alignItems: "center",
                                 }}
                              >
                                 {/* Profilee Completion PercentÂGE */}
                                 <div
                                    style={{
                                       background: "rgba(255, 255, 255, 0.15)",
                                       padding: "6px 12px",
                                       borderRadius: "12px",
                                       backdropFilter: "blur(10px)",
                                       border:
                                          "1px solid rgba(255, 255, 255, 0.2)",
                                    }}
                                 >
                                    <Text
                                       style={{
                                          color: "rgba(255, 255, 255, 0.9)",
                                          fontSize: "12px",
                                          fontWeight: 600,
                                       }}
                                    >
                                       📋 Profile{" "}
                                       {(() => {
                                          const ProfileeFields = [
                                             userData.firstName,
                                             userData.lastName,
                                             userData.phoneNumber,
                                             userData.dateOfBirth,
                                             userData.gender,
                                             userData.height &&
                                             Number(userData.height) > 0
                                                ? userData.height
                                                : null,
                                             userData.weight &&
                                             Number(userData.weight) > 0
                                                ? userData.weight
                                                : null,
                                             userData.bloodType,
                                             userData.allergies,
                                             userData.chronicConditions,
                                             userData.profilePictureUrl,
                                          ];
                                          const completedFields =
                                             ProfileeFields.filter(
                                                (field) =>
                                                   field !== null &&
                                                   field !== undefined &&
                                                   field !== ""
                                             ).length;
                                          const completionPercentÂGE =
                                             Math.round(
                                                (completedFields /
                                                   ProfileeFields.length) *
                                                   100
                                             );
                                          return completionPercentÂGE;
                                       })()}
                                       % complet
                                    </Text>
                                 </div>

                                 {/* Member since */}
                                 <Text
                                    style={{
                                       color: "rgba(255, 255, 255, 0.7)",
                                       fontSize: "11px",
                                       fontWeight: 500,
                                    }}
                                 >
                                    Membre VitaCare depuis{" "}
                                    {userData.createdAt
                                       ? moment(userData.createdAt).format(
                                            "YYYY"
                                         )
                                       : "2025"}
                                 </Text>

                                 {/* Quick action hint */}
                              </div>
                           </div>
                        </Col>

                        <Col xs={24} sm={12} md={14}>
                           <div
                              style={{
                                 textAlign: "left",
                                 position: "relative",
                                 zIndex: 2,
                                 padding: "0 20px",
                              }}
                           >
                              {/* Main user identity */}
                              <div style={{ marginBottom: "20px" }}>
                                 <Title
                                    level={2}
                                    style={{
                                       color: "#ffffff",
                                       marginBottom: "4px",
                                       fontSize: "28px",
                                       fontWeight: 700,
                                       letterSpacing: "-0.5px",
                                    }}
                                 >
                                    {userData.firstName && userData.lastName
                                       ? `${userData.firstName} ${userData.lastName}`
                                       : "VitaCare User"}
                                 </Title>
                                 <Text
                                    style={{
                                       color: "rgba(255, 255, 255, 0.8)",
                                       fontSize: "16px",
                                       fontWeight: 500,
                                    }}
                                 >
                                    {userData.email}
                                 </Text>
                              </div>

                              {/* Key demographics row */}
                              <div
                                 style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "20px",
                                    marginBottom: "20px",
                                    padding: "16px 0",
                                    borderTop:
                                       "1px solid rgba(255, 255, 255, 0.2)",
                                    borderBottom:
                                       "1px solid rgba(255, 255, 255, 0.2)",
                                 }}
                              >
                                 {userData.dateOfBirth && (
                                    <div
                                       style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "8px",
                                       }}
                                    >
                                       <CalendarOutlined
                                          style={{
                                             color: "rgba(255, 255, 255, 0.9)",
                                             fontSize: "16px",
                                          }}
                                       />
                                       <div>
                                          <Text
                                             style={{
                                                color: "rgba(255, 255, 255, 0.7)",
                                                fontSize: "12px",
                                                display: "block",
                                             }}
                                          >
                                             ÂGE
                                          </Text>
                                          <Text
                                             style={{
                                                color: "rgba(255, 255, 255, 0.95)",
                                                fontSize: "16px",
                                                fontWeight: 600,
                                             }}
                                          >
                                             {moment().diff(
                                                moment(userData.dateOfBirth),
                                                "years"
                                             )}{" "}
                                             ans
                                          </Text>
                                       </div>
                                    </div>
                                 )}

                                 {userData.gender && (
                                    <div
                                       style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "8px",
                                       }}
                                    >
                                       <TeamOutlined
                                          style={{
                                             color: "rgba(255, 255, 255, 0.9)",
                                             fontSize: "16px",
                                          }}
                                       />
                                       <div>
                                          <Text
                                             style={{
                                                color: "rgba(255, 255, 255, 0.7)",
                                                fontSize: "12px",
                                                display: "block",
                                             }}
                                          >
                                             Genre
                                          </Text>
                                          <Text
                                             style={{
                                                color: "rgba(255, 255, 255, 0.95)",
                                                fontSize: "16px",
                                                fontWeight: 600,
                                             }}
                                          >
                                             {userData.gender === "MALE"
                                                ? "Male"
                                                : "Female"}
                                          </Text>
                                       </div>
                                    </div>
                                 )}

                                 {userData.phoneNumber && (
                                    <div
                                       style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "8px",
                                       }}
                                    >
                                       <PhoneOutlined
                                          style={{
                                             color: "rgba(255, 255, 255, 0.9)",
                                             fontSize: "16px",
                                          }}
                                       />
                                       <div>
                                          <Text
                                             style={{
                                                color: "rgba(255, 255, 255, 0.7)",
                                                fontSize: "12px",
                                                display: "block",
                                             }}
                                          >
                                             CONTACT
                                          </Text>
                                          <Text
                                             style={{
                                                color: "rgba(255, 255, 255, 0.95)",
                                                fontSize: "16px",
                                                fontWeight: 600,
                                             }}
                                          >
                                             {userData.phoneNumber}
                                          </Text>
                                       </div>
                                    </div>
                                 )}
                              </div>

                              {/* Health metrics */}
                              {((userData.height &&
                                 Number(userData.height) > 0) ||
                                 (userData.weight &&
                                    Number(userData.weight) > 0) ||
                                 userData.bloodType) && (
                                 <div style={{ marginBottom: "20px" }}>
                                    <Text
                                       style={{
                                          color: "rgba(255, 255, 255, 0.9)",
                                          fontSize: "14px",
                                          fontWeight: 600,
                                          display: "block",
                                          marginBottom: "12px",
                                          letterSpacing: "0.5px",
                                       }}
                                    >
                                       📋 DONNÉES MÉDICALES
                                    </Text>
                                    <div
                                       style={{
                                          display: "flex",
                                          flexWrap: "wrap",
                                          gap: "16px",
                                       }}
                                    >
                                       {userData.bloodType && (
                                          <div
                                             style={{
                                                background:
                                                   "rgba(255, 255, 255, 0.15)",
                                                padding: "8px 14px",
                                                borderRadius: "20px",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "6px",
                                             }}
                                          >
                                             <span style={{ fontSize: "14px" }}>
                                                🩸
                                             </span>
                                             <Text
                                                style={{
                                                   color: "rgba(255, 255, 255, 0.9)",
                                                   fontSize: "14px",
                                                   fontWeight: 500,
                                                }}
                                             >
                                                {userData.bloodType}
                                             </Text>
                                          </div>
                                       )}
                                       {userData.height &&
                                          Number(userData.height) > 0 && (
                                             <div
                                                style={{
                                                   background:
                                                      "rgba(255, 255, 255, 0.15)",
                                                   padding: "8px 14px",
                                                   borderRadius: "20px",
                                                   display: "flex",
                                                   alignItems: "center",
                                                   gap: "6px",
                                                }}
                                             >
                                                <span
                                                   style={{ fontSize: "14px" }}
                                                >
                                                   📏
                                                </span>
                                                <Text
                                                   style={{
                                                      color: "rgba(255, 255, 255, 0.9)",
                                                      fontSize: "14px",
                                                      fontWeight: 500,
                                                   }}
                                                >
                                                   {userData.height} cm
                                                </Text>
                                             </div>
                                          )}
                                       {userData.weight &&
                                          Number(userData.weight) > 0 && (
                                             <div
                                                style={{
                                                   background:
                                                      "rgba(255, 255, 255, 0.15)",
                                                   padding: "8px 14px",
                                                   borderRadius: "20px",
                                                   display: "flex",
                                                   alignItems: "center",
                                                   gap: "6px",
                                                }}
                                             >
                                                <span
                                                   style={{ fontSize: "14px" }}
                                                >
                                                   ⚖️
                                                </span>
                                                <Text
                                                   style={{
                                                      color: "rgba(255, 255, 255, 0.9)",
                                                      fontSize: "14px",
                                                      fontWeight: 500,
                                                   }}
                                                >
                                                   {userData.weight} kg
                                                </Text>
                                             </div>
                                          )}
                                       {userData.height &&
                                          Number(userData.height) > 0 &&
                                          userData.weight &&
                                          Number(userData.weight) > 0 && (
                                             <div
                                                style={{
                                                   background:
                                                      "rgba(255, 255, 255, 0.15)",
                                                   padding: "8px 14px",
                                                   borderRadius: "20px",
                                                   display: "flex",
                                                   alignItems: "center",
                                                   gap: "6px",
                                                }}
                                             >
                                                <span
                                                   style={{ fontSize: "14px" }}
                                                >
                                                   📊
                                                </span>
                                                <Text
                                                   style={{
                                                      color: "rgba(255, 255, 255, 0.95)",
                                                      fontSize: "14px",
                                                      fontWeight: 600,
                                                   }}
                                                >
                                                   IMC{" "}
                                                   {(
                                                      userData.weight /
                                                      Math.pow(
                                                         userData.height / 100,
                                                         2
                                                      )
                                                   ).toFixed(1)}
                                                </Text>
                                             </div>
                                          )}
                                    </div>
                                 </div>
                              )}

                              {/* ALERTES MÉDICALES - compact version */}
                              {(userData.allergies ||
                                 userData.chronicConditions) && (
                                 <div
                                    style={{
                                       background: "rgba(255, 255, 255, 0.15)",
                                       border:
                                          "1px solid rgba(255, 255, 255, 0.15)",
                                       padding: "12px 16px",
                                       borderRadius: "12px",
                                       marginTop: "16px",
                                    }}
                                 >
                                    <div
                                       style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "8px",
                                          marginBottom: "8px",
                                       }}
                                    >
                                       <span style={{ fontSize: "16px" }}>
                                          ⚠️
                                       </span>
                                       <Text
                                          style={{
                                             color: "rgba(255, 255, 255, 0.95)",
                                             fontSize: "14px",
                                             fontWeight: 600,
                                          }}
                                       >
                                          ALERTES MÉDICALES
                                       </Text>
                                    </div>
                                    {userData.allergies && (
                                       <Text
                                          style={{
                                             color: "rgba(255, 255, 255, 0.9)",
                                             fontSize: "13px",
                                             display: "block",
                                             marginBottom: "4px",
                                          }}
                                       >
                                          • allergies:{" "}
                                          {userData.allergies.length > 40
                                             ? userData.allergies.substring(
                                                  0,
                                                  40
                                               ) + "..."
                                             : userData.allergies}
                                       </Text>
                                    )}
                                    {userData.chronicConditions && (
                                       <Text
                                          style={{
                                             color: "rgba(255, 255, 255, 0.9)",
                                             fontSize: "13px",
                                             display: "block",
                                             marginBottom: "4px",
                                          }}
                                       >
                                          • Maladies chroniques :{" "}
                                          {userData.chronicConditions.length >
                                          40
                                             ? userData.chronicConditions.substring(
                                                  0,
                                                  40
                                               ) + "..."
                                             : userData.chronicConditions}
                                       </Text>
                                    )}
                                    {userData.medications && (
                                       <Text
                                          style={{
                                             color: "rgba(255, 255, 255, 0.9)",
                                             fontSize: "13px",
                                             display: "block",
                                          }}
                                       >
                                          • medications:{" "}
                                          {userData.medications.length > 40
                                             ? userData.medications.substring(
                                                  0,
                                                  40
                                               ) + "..."
                                             : userData.medications}
                                       </Text>
                                    )}
                                 </div>
                              )}
                           </div>
                        </Col>
                     </Row>
                  </Card>

                  {/* Form Section */}
                  <Card
                     style={{
                        borderRadius: "24px",
                        border: "1px solid rgba(0,0,0,0.08)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                     }}
                     bodyStyle={{ padding: "40px" }}
                  >
                     <div style={{ marginBottom: "32px" }}>
                        <Title
                           level={2}
                           style={{
                              marginBottom: "8px",
                              fontSize: "28px",
                              fontWeight: 700,
                           }}
                        >
                           Informations personnelles
                        </Title>
                        <Text style={{ color: "#64748b", fontSize: "16px" }}>
                           Mettez à jour vos informations de profil
                        </Text>
                     </div>

                     <Form form={form} layout="vertical" size="large">
                        <Row gutter={[24, 0]}>
                           <Col xs={24} sm={12}>
                              <Form.Item
                                 label={
                                    <Text strong style={{ fontSize: "16px" }}>
                                       Prénom
                                    </Text>
                                 }
                                 name="firstName"
                              >
                                 <Input
                                    placeholder="Your Prénom"
                                    style={{
                                       borderRadius: "12px",
                                       border: "2px solid #f1f5f9",
                                       padding: "12px 16px",
                                       fontSize: "16px",
                                    }}
                                    prefix={
                                       <UserOutlined
                                          style={{ color: "#94a3b8" }}
                                       />
                                    }
                                 />
                              </Form.Item>
                           </Col>

                           <Col xs={24} sm={12}>
                              <Form.Item
                                 label={
                                    <Text strong style={{ fontSize: "16px" }}>
                                       Nom
                                    </Text>
                                 }
                                 name="lastName"
                              >
                                 <Input
                                    placeholder="Your Nom"
                                    style={{
                                       borderRadius: "12px",
                                       border: "2px solid #f1f5f9",
                                       padding: "12px 16px",
                                       fontSize: "16px",
                                    }}
                                    prefix={
                                       <UserOutlined
                                          style={{ color: "#94a3b8" }}
                                       />
                                    }
                                 />
                              </Form.Item>
                           </Col>

                           <Col xs={24}>
                              <Form.Item
                                 label={
                                    <Text strong style={{ fontSize: "16px" }}>
                                       Adresse e-mail
                                    </Text>
                                 }
                                 name="email"
                              >
                                 <Input
                                    disabled
                                    placeholder="votre@email"
                                    style={{
                                       borderRadius: "12px",
                                       border: "2px solid #f1f5f9",
                                       padding: "12px 16px",
                                       fontSize: "16px",
                                       backgroundColor: "#f8fafc",
                                       color: "#94a3b8",
                                    }}
                                    prefix={
                                       <MailOutlined
                                          style={{ color: "#94a3b8" }}
                                       />
                                    }
                                 />
                              </Form.Item>
                           </Col>

                           <Col xs={24} sm={12}>
                              <Form.Item
                                 label={
                                    <Text strong style={{ fontSize: "16px" }}>
                                       Numéro de téléphone
                                    </Text>
                                 }
                                 name="phoneNumber"
                              >
                                 <Input
                                    placeholder="+216 12 345 678"
                                    style={{
                                       borderRadius: "12px",
                                       border: "2px solid #f1f5f9",
                                       padding: "12px 16px",
                                       fontSize: "16px",
                                    }}
                                    prefix={
                                       <PhoneOutlined
                                          style={{ color: "#94a3b8" }}
                                       />
                                    }
                                 />
                              </Form.Item>
                           </Col>

                           <Col xs={24} sm={12}>
                              <Form.Item
                                 label={
                                    <Text strong style={{ fontSize: "16px" }}>
                                       Date de naissance
                                    </Text>
                                 }
                                 name="dateOfBirth"
                              >
                                 <DatePicker
                                    style={{
                                       width: "100%",
                                       borderRadius: "12px",
                                       border: "2px solid #f1f5f9",
                                       padding: "12px 16px",
                                       fontSize: "16px",
                                    }}
                                    format="DD/MM/YYYY"
                                    suffixIcon={
                                       <CalendarOutlined
                                          style={{ color: "#94a3b8" }}
                                       />
                                    }
                                 />
                              </Form.Item>
                           </Col>

                           <Col xs={24} sm={12}>
                              <Form.Item
                                 label={
                                    <Text strong style={{ fontSize: "16px" }}>
                                       Genre
                                    </Text>
                                 }
                                 name="gender"
                              >
                                 <Select
                                    placeholder="Sélectionnez votre genre"
                                    style={{
                                       borderRadius: "12px",
                                       border: "2px solid #f1f5f9",
                                       fontSize: "16px",
                                    }}
                                 >
                                    <Option value="MALE">Homme</Option>
                                    <Option value="FEMALE">Femme</Option>
                                 </Select>
                              </Form.Item>
                           </Col>
                           {/* Groupe sanguin */}
                           <Col xs={24} sm={12}>
                              <Form.Item
                                 label={
                                    <Text strong style={{ fontSize: "16px" }}>
                                       Groupe sanguin
                                    </Text>
                                 }
                                 name="bloodType"
                              >
                                 <Select
                                    placeholder="Select your Groupe sanguin"
                                    style={{
                                       borderRadius: "12px",
                                       border: "2px solid #f1f5f9",
                                       fontSize: "16px",
                                    }}
                                 >
                                    <Option value="A+">A+</Option>
                                    <Option value="A-">A-</Option>
                                    <Option value="B+">B+</Option>
                                    <Option value="B-">B-</Option>
                                    <Option value="AB+">AB+</Option>
                                    <Option value="AB-">AB-</Option>
                                    <Option value="O+">O+</Option>
                                    <Option value="O-">O-</Option>
                                 </Select>
                              </Form.Item>
                           </Col>
                           {/* Weight */}
                           <Col xs={24} sm={12}>
                              <Form.Item
                                 label={
                                    <Text strong style={{ fontSize: "16px" }}>
                                       Poids (kg)
                                    </Text>
                                 }
                                 name="weight"
                              >
                                 <Input
                                    type="number"
                                    placeholder="Ex: 70"
                                    style={{
                                       borderRadius: "12px",
                                       border: "2px solid #f1f5f9",
                                       padding: "12px 16px",
                                       fontSize: "16px",
                                    }}
                                 />
                              </Form.Item>
                           </Col>

                           {/* Height */}
                           <Col xs={24} sm={12}>
                              <Form.Item
                                 label={
                                    <Text strong style={{ fontSize: "16px" }}>
                                       Taille (cm)
                                    </Text>
                                 }
                                 name="height"
                              >
                                 <Input
                                    type="number"
                                    placeholder="Ex: 175"
                                    style={{
                                       borderRadius: "12px",
                                       border: "2px solid #f1f5f9",
                                       padding: "12px 16px",
                                       fontSize: "16px",
                                    }}
                                 />
                              </Form.Item>
                           </Col>

                           {/* Allergies */}
                           <Col xs={24}>
                              <Form.Item
                                 label={
                                    <Text strong style={{ fontSize: "16px" }}>
                                       Allergies
                                    </Text>
                                 }
                                 name="allergies"
                              >
                                 <Input.TextArea
                                    placeholder="Listez vos allergies, le cas échéant"
                                    style={{
                                       borderRadius: "12px",
                                       border: "2px solid #f1f5f9",
                                       padding: "12px 16px",
                                       fontSize: "16px",
                                    }}
                                    rows={2}
                                 />
                              </Form.Item>
                           </Col>

                           {/* Maladies chroniques */}
                           <Col xs={24}>
                              <Form.Item
                                 label={
                                    <Text strong style={{ fontSize: "16px" }}>
                                       Maladies chroniques
                                    </Text>
                                 }
                                 name="chronicConditions"
                              >
                                 <Input.TextArea
                                    placeholder="List your Maladies chroniques, if applicable"
                                    style={{
                                       borderRadius: "12px",
                                       border: "2px solid #f1f5f9",
                                       padding: "12px 16px",
                                       fontSize: "16px",
                                    }}
                                    rows={2}
                                 />
                              </Form.Item>
                           </Col>

                           {/* Medications */}
                           <Col xs={24}>
                              <Form.Item
                                 label={
                                    <Text strong style={{ fontSize: "16px" }}>
                                       Medications
                                    </Text>
                                 }
                                 name="medications"
                              >
                                 <Input.TextArea
                                    placeholder="Listez vos médicaments actuels, le cas échéant"
                                    style={{
                                       borderRadius: "12px",
                                       border: "2px solid #f1f5f9",
                                       padding: "12px 16px",
                                       fontSize: "16px",
                                    }}
                                    rows={2}
                                 />
                              </Form.Item>
                           </Col>
                        </Row>

                        {/* Action Buttons */}
                        <div
                           style={{
                              display: "flex",
                              gap: "16px",
                              marginTop: "32px",
                           }}
                        >
                           <Button
                              type="primary"
                              icon={<SaveOutlined />}
                              onClick={handleSave}
                              style={{
                                 borderRadius: "12px",
                                 padding: "12px 32px",
                                 background: "#1A8BB7",

                                 fontWeight: 600,
                                 boxShadow: "0 4px 16px rgba(26,139,183,0.2)",
                                 transition: "all 0.3s ease",
                              }}
                              onMouseEnter={(e) => {
                                 e.currentTarget.style.background = "#1ABC9C";
                                 e.currentTarget.style.transform =
                                    "translateY(-2px)";
                              }}
                              onMouseLeave={(e) => {
                                 e.currentTarget.style.background = "#1A8BB7";
                                 e.currentTarget.style.transform =
                                    "translateY(0)";
                              }}
                           >
                              Enregistrer
                           </Button>
                           <Button
                              icon={<CloseOutlined />}
                              onClick={handleCancel}
                              style={{
                                 borderRadius: "12px",
                                 padding: "12px 32px",
                                 background: "#F8FAFC",
                                 border: "2px solid #E3E8EF",
                                 color: "#4B5C6B",
                                 fontWeight: 600,
                                 boxShadow: "0 2px 8px rgba(75,92,107,0.1)",
                                 transition: "all 0.3s ease",
                              }}
                              onMouseEnter={(e) => {
                                 e.currentTarget.style.background = "#E3E8EF";
                                 e.currentTarget.style.transform =
                                    "translateY(-1px)";
                              }}
                              onMouseLeave={(e) => {
                                 e.currentTarget.style.background = "#F8FAFC";
                                 e.currentTarget.style.transform =
                                    "translateY(0)";
                              }}
                           >
                              Annuler
                           </Button>
                        </div>
                     </Form>
                  </Card>
               </div>
            )}
         </div>
      </>
   );
}
