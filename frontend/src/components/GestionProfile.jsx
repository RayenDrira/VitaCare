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
   const [previewImage, setPreviewImage] = useState(null);
   const [uploading, setUploading] = useState(false);

   // Helper function to calculate profile completion percentage
   const calculateProfileCompletion = () => {
      if (!userData) return 0;

      const profileFields = [
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
         userData.profilePictureUrl, // ✅ Fixed: use profilePictureUrl instead of profilePicture
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

      profileFields.forEach((field, index) => {
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

      const completedFieldsArray = profileFields.filter(
         (field) =>
            field !== null &&
            field !== undefined &&
            field !== "" &&
            (typeof field !== "string" || field.trim() !== "") // ✅ Fixed: handle whitespace-only strings
      );

      const completedFields = completedFieldsArray.length;

      console.log("🔍 DETAILED CALCULATION:", {
         totalFields: profileFields.length,
         totalFieldsArray: profileFields,
         completedCount: completedFields,
         completedFieldsArray: completedFieldsArray,
         exactPercentage: (completedFields / profileFields.length) * 100,
         roundedPercentage: Math.round(
            (completedFields / profileFields.length) * 100
         ),
      });

      const completionPercentage = Math.round(
         (completedFields / profileFields.length) * 100
      );
      console.log(
         `🔍 Profile completion: ${completedFields}/${profileFields.length} = ${completionPercentage}%`
      );
      console.log("🔍 All field values:", profileFields);
      console.log("🔍 Raw userData for debugging:", {
         height: userData.height,
         weight: userData.weight,
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
            if (!email) throw new Error("Utilisateur non authentifié");

            const res = await apiFetch(`/api/profile/user/by-email/${email}`);
            if (!res.ok) throw new Error("Impossible de charger le profil");

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
         setPreviewImage(null);
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
         });
      }
   };

   const handleSave = async () => {
      try {
         const values = await form.validateFields();
         console.log("🔍 Form values before save:", values);

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
         };
         console.log("🔍 Payload being sent to API:", payload);

         const res = await apiFetch(`/api/profile/${userData.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
         });

         if (!res.ok) throw new Error("Erreur lors de la mise à jour");

         const updatedUser = await res.json();
         console.log("🔍 Updated user from API:", updatedUser);

         const newUserData = {
            ...updatedUser,
            profilePictureUrl: updatedUser.profilePictureUrl,
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
         });
         console.log("🔍 Form forcefully updated after save");

         message.success("Profil mis à jour avec succès !");
         setIsEditing(false);
      } catch (err) {
         console.error(err);
         message.error(err.message || "Erreur lors de la sauvegarde");
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

         if (!res.ok)
            throw new Error("Erreur lors du téléchargement de la photo");

         const updatedUser = await res.json();

         if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreviewImage(objectUrl);
         }

         setUserData(updatedUser);
         message.success("Photo mise à jour avec succès !");
      } catch (err) {
         console.error(err);
         message.error(err.message || "Erreur lors du téléchargement");
      } finally {
         setUploading(false);
      }
   };

   const beforeUpload = (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
         message.error("Vous ne pouvez télécharger que des fichiers image !");
         return Upload.LIST_IGNORE;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
         message.error("L'image doit faire moins de 5MB !");
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
         ? userData.profilePictureUrl.startsWith("https")
            ? userData.profilePictureUrl
            : `http://localhost:8081/uploads/${userData.profilePictureUrl}`
         : undefined);
   console.log("User Data:", userData);
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
               // View Mode - Full Screen Profile Display
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
                     {/* Profile Picture Section */}

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
                        <Col xs={24} sm={12} md={8}>
                           <div
                              style={{
                                 position: "relative",
                                 zIndex: 2,
                                 textAlign: "center",
                              }}
                           >
                              {/* Profile picture with progress border */}
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
                                       top: "-8px",
                                       left: "-8px",
                                       width: "156px",
                                       height: "156px",
                                       borderRadius: "50%",
                                       background: `conic-gradient(
                                       #1ABC9C 0deg ${(() => {
                                          // Complete profile fields including health data
                                          const profileFields = [
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
                                             profileFields.filter(
                                                (field) =>
                                                   field !== null &&
                                                   field !== undefined &&
                                                   field !== ""
                                             ).length;

                                          const completionPercentage =
                                             (completedFields /
                                                profileFields.length) *
                                             100;
                                          return (
                                             completionPercentage * 3.6
                                          ).toFixed(1);
                                       })()}deg,
                                       rgba(255, 255, 255, 0.2) ${(() => {
                                          const profileFields = [
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
                                             profileFields.filter(
                                                (field) =>
                                                   field !== null &&
                                                   field !== undefined &&
                                                   field !== ""
                                             ).length;
                                          const completionPercentage =
                                             (completedFields /
                                                profileFields.length) *
                                             100;
                                          return (
                                             completionPercentage * 3.6
                                          ).toFixed(1);
                                       })()}deg 360deg
                                    )`,
                                       boxShadow: `0 0 20px rgba(26, 188, 156, ${(() => {
                                          const profileFields = [
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
                                             profileFields.filter(
                                                (field) =>
                                                   field !== null &&
                                                   field !== undefined &&
                                                   field !== ""
                                             ).length;
                                          const completionPercentage =
                                             (completedFields /
                                                profileFields.length) *
                                             100;
                                          return (
                                             (completionPercentage / 100) *
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
                                       top: "-4px",
                                       left: "-4px",
                                       width: "148px",
                                       height: "148px",
                                       borderRadius: "50%",
                                       background: "rgba(255, 255, 255, 0.1)",
                                    }}
                                 />

                                 <Avatar
                                    size={140}
                                    src={displayImage}
                                    icon={<UserOutlined />}
                                    style={{
                                       border:
                                          "2px solid rgba(255, 255, 255, 0.3)",
                                       boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
                                       backgroundColor:
                                          "rgba(255, 255, 255, 0.1)",
                                       position: "relative",
                                       zIndex: 2,
                                    }}
                                 />

                                 <Upload
                                    showUploadList={false}
                                    customRequest={handleUpload}
                                    accept="image/*"
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
                                          bottom: "5px",
                                          right: "5px",
                                          background: "#ffffff",
                                          color: "#1A8BB7",
                                          border: "none",
                                          width: "40px",
                                          height: "40px",
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
                                 {/* Profile Completion Percentage */}
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
                                       📋 Profil{" "}
                                       {(() => {
                                          const profileFields = [
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
                                             profileFields.filter(
                                                (field) =>
                                                   field !== null &&
                                                   field !== undefined &&
                                                   field !== ""
                                             ).length;
                                          const completionPercentage =
                                             Math.round(
                                                (completedFields /
                                                   profileFields.length) *
                                                   100
                                             );
                                          return completionPercentage;
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
                                    Membre VitaCare depuis 2024
                                 </Text>

                                 {/* Quick action hint */}
                              </div>
                           </div>
                        </Col>

                        <Col xs={24} sm={12} md={16}>
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
                                       : "Utilisateur VitaCare"}
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
                                             GENRE
                                          </Text>
                                          <Text
                                             style={{
                                                color: "rgba(255, 255, 255, 0.95)",
                                                fontSize: "16px",
                                                fontWeight: 600,
                                             }}
                                          >
                                             {userData.gender === "MALE"
                                                ? "Homme"
                                                : "Femme"}
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

                              {/* Medical alerts - compact version */}
                              {(userData.allergies ||
                                 userData.chronicConditions) && (
                                 <div
                                    style={{
                                       background: "rgba(255, 255, 255, 0.15)",
                                       border:
                                          "1px solid rgba(255, 69, 58, 0.4)",
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
                                          • Allergies:{" "}
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
                                          }}
                                       >
                                          • Conditions chroniques:{" "}
                                          {userData.chronicConditions.length >
                                          40
                                             ? userData.chronicConditions.substring(
                                                  0,
                                                  40
                                               ) + "..."
                                             : userData.chronicConditions}
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
                  {/* Profile Picture Section */}
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
                        <Col xs={24} sm={12} md={8}>
                           <div
                              style={{
                                 position: "relative",
                                 zIndex: 2,
                                 textAlign: "center",
                              }}
                           >
                              {/* Profile picture with progress border */}
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
                                       top: "-8px",
                                       left: "-8px",
                                       width: "156px",
                                       height: "156px",
                                       borderRadius: "50%",
                                       background: `conic-gradient(
                                       #1ABC9C 0deg ${(() => {
                                          // Complete profile fields including health data
                                          const profileFields = [
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
                                             profileFields.filter(
                                                (field) =>
                                                   field !== null &&
                                                   field !== undefined &&
                                                   field !== ""
                                             ).length;

                                          const completionPercentage =
                                             (completedFields /
                                                profileFields.length) *
                                             100;
                                          return (
                                             completionPercentage * 3.6
                                          ).toFixed(1);
                                       })()}deg,
                                       rgba(255, 255, 255, 0.2) ${(() => {
                                          const profileFields = [
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
                                             profileFields.filter(
                                                (field) =>
                                                   field !== null &&
                                                   field !== undefined &&
                                                   field !== ""
                                             ).length;
                                          const completionPercentage =
                                             (completedFields /
                                                profileFields.length) *
                                             100;
                                          return (
                                             completionPercentage * 3.6
                                          ).toFixed(1);
                                       })()}deg 360deg
                                    )`,
                                       boxShadow: `0 0 20px rgba(26, 188, 156, ${(() => {
                                          const profileFields = [
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
                                             profileFields.filter(
                                                (field) =>
                                                   field !== null &&
                                                   field !== undefined &&
                                                   field !== ""
                                             ).length;
                                          const completionPercentage =
                                             (completedFields /
                                                profileFields.length) *
                                             100;
                                          return (
                                             (completionPercentage / 100) *
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
                                       top: "-4px",
                                       left: "-4px",
                                       width: "148px",
                                       height: "148px",
                                       borderRadius: "50%",
                                       background: "rgba(255, 255, 255, 0.1)",
                                    }}
                                 />

                                 <Avatar
                                    size={140}
                                    src={displayImage}
                                    icon={<UserOutlined />}
                                    style={{
                                       border:
                                          "2px solid rgba(255, 255, 255, 0.3)",
                                       boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
                                       backgroundColor:
                                          "rgba(255, 255, 255, 0.1)",
                                       position: "relative",
                                       zIndex: 2,
                                    }}
                                 />

                                 <Upload
                                    showUploadList={false}
                                    customRequest={handleUpload}
                                    accept="image/*"
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
                                          bottom: "5px",
                                          right: "5px",
                                          background: "#ffffff",
                                          color: "#1A8BB7",
                                          border: "none",
                                          width: "40px",
                                          height: "40px",
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
                                 {/* Profile Completion Percentage */}
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
                                       📋 Profil{" "}
                                       {(() => {
                                          const profileFields = [
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
                                             profileFields.filter(
                                                (field) =>
                                                   field !== null &&
                                                   field !== undefined &&
                                                   field !== ""
                                             ).length;
                                          const completionPercentage =
                                             Math.round(
                                                (completedFields /
                                                   profileFields.length) *
                                                   100
                                             );
                                          return completionPercentage;
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
                                    Membre VitaCare depuis 2024
                                 </Text>

                                 {/* Quick action hint */}
                              </div>
                           </div>
                        </Col>

                        <Col xs={24} sm={12} md={16}>
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
                                       : "Utilisateur VitaCare"}
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
                                             GENRE
                                          </Text>
                                          <Text
                                             style={{
                                                color: "rgba(255, 255, 255, 0.95)",
                                                fontSize: "16px",
                                                fontWeight: 600,
                                             }}
                                          >
                                             {userData.gender === "MALE"
                                                ? "Homme"
                                                : "Femme"}
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
                                                      "rgba(26, 188, 156, 0.3)",
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

                              {/* Medical alerts - compact version */}
                              {(userData.allergies ||
                                 userData.chronicConditions) && (
                                 <div
                                    style={{
                                       background: "rgba(255, 69, 58, 0.2)",
                                       border:
                                          "1px solid rgba(255, 69, 58, 0.4)",
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
                                          • Allergies:{" "}
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
                                          }}
                                       >
                                          • Conditions chroniques:{" "}
                                          {userData.chronicConditions.length >
                                          40
                                             ? userData.chronicConditions.substring(
                                                  0,
                                                  40
                                               ) + "..."
                                             : userData.chronicConditions}
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
                                    placeholder="Votre prénom"
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
                                    placeholder="Votre nom"
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
                           {/* Blood Type */}
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
                                    placeholder="Sélectionnez votre groupe sanguin"
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
                                    placeholder="Listez vos allergies, si applicable"
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

                           {/* Chronic Conditions */}
                           <Col xs={24}>
                              <Form.Item
                                 label={
                                    <Text strong style={{ fontSize: "16px" }}>
                                       Conditions chroniques
                                    </Text>
                                 }
                                 name="chronicConditions"
                              >
                                 <Input.TextArea
                                    placeholder="Listez vos conditions médicales chroniques, si applicable"
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
                              Sauvegarder
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
