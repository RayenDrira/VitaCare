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
   Divider,
   Space,
   Typography,
} from "antd";
import {
   EditOutlined,
   SaveOutlined,
   CloseOutlined,
   UserOutlined,
   CameraOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { apiFetch, getEmailFromToken } from "../utils/api";

const { Option } = Select;
const { Text } = Typography;

export default function GestionProfile() {
   const [isEditing, setIsEditing] = useState(false);
   const [form] = Form.useForm();
   const [userData, setUserData] = useState(null);
   const [loading, setLoading] = useState(true);
   const [previewImage, setPreviewImage] = useState(null);
   const [uploading, setUploading] = useState(false);

   // Fetch user data
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

   // Cleanup preview image URL
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
         });
      }
   };

   const handleSave = async () => {
      try {
         const values = await form.validateFields();

         const payload = {
            firstName: values.firstName || null,
            lastName: values.lastName || null,
            email: values.email || null,
            phoneNumber: values.phoneNumber || null,
            dateOfBirth: values.dateOfBirth
               ? values.dateOfBirth.format("YYYY-MM-DD")
               : null,
            gender: values.gender || null,
         };

         const res = await apiFetch(`/api/profile/${userData.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
         });

         if (!res.ok) throw new Error("Erreur lors de la mise à jour");

         const updatedUser = await res.json();

         setUserData({
            ...updatedUser,
            profilePictureUrl: updatedUser.profilePictureUrl,
         });

         message.success("Profil mis à jour avec succès !");
         setIsEditing(false);
      } catch (err) {
         console.error(err);
         message.error(err.message || "Erreur lors de la sauvegarde");
      }
   };

   // Upload profile photo
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
               minHeight: "400px",
            }}
         >
            <Spin size="large" tip="Chargement de votre profil..." />
         </div>
      );
   }

   if (!userData) {
      return (
         <div style={{ textAlign: "center", marginTop: 50, padding: 20 }}>
            <Text type="secondary">Aucune donnée disponible</Text>
         </div>
      );
   }

   const displayImage =
      previewImage ||
      (userData.profilePictureUrl
         ? userData.profilePictureUrl.startsWith("http")
            ? userData.profilePictureUrl
            : `http://localhost:8081/uploads/${userData.profilePictureUrl}`
         : undefined);

   return (
      <div
         style={{
            padding: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
         }}
      >
         <Card
            style={{
               borderRadius: 24,
               boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
               border: "none",
               display: "flex",
               overflow: "hidden",
            }}
            bodyStyle={{ padding: 0 }}
         >
            <div style={{ display: "flex", gap: "40px", width: "100%" }}>
               {/* Left Section */}
               <div
                  style={{
                     background:
                        "linear-gradient(135deg, #31c1e1 0%, #31e1cf 100%)",
                     color: "white",
                     padding: "0px",
                     width: isEditing ? "50%" : "100%", // expand if not editing
                     textAlign: "center",
                     display: "flex",
                     flexDirection: "column",
                     alignItems: "center",
                     justifyContent: "center",
                  }}
               >
                  {/* Show big full photo when not editing */}
                  {!isEditing ? (
                     <div
                        style={{
                           position: "relative",
                           width: "100%",
                           height: "100%",
                           borderRadius: "24px",
                           overflow: "hidden",
                        }}
                     >
                        <img
                           src={displayImage}
                           alt="profile"
                           style={{
                              width: "auto",
                              height: "60vh",

                              objectFit: "cover",
                           }}
                        />

                        {/* Glass overlay with user info + button */}
                        <div
                           style={{
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              width: "100%",
                              padding: "20px",
                              background:
                                 "linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0))",
                              color: "white",
                              textAlign: "center",
                           }}
                        >
                           <h3 style={{ margin: 0 }}>
                              {userData.firstName && userData.lastName
                                 ? `${userData.firstName} ${userData.lastName}`
                                 : userData.email}
                           </h3>
                           <Text style={{ color: "rgba(255,255,255,0.85)" }}>
                              {userData.email}
                           </Text>

                           {/* Animated Modify button */}
                           <div style={{ marginTop: "15px" }}>
                              <Button
                                 icon={<EditOutlined />}
                                 onClick={handleEdit}
                                 size="large"
                                 style={{
                                    borderRadius: "8px",
                                    background: "rgba(255,255,255,0.2)",
                                    border: "none",
                                    color: "white",
                                    backdropFilter: "blur(8px)",
                                    padding: "0 32px",
                                    opacity: 0.8,
                                    transition: "all 0.3s ease",
                                 }}
                                 onMouseEnter={(e) => {
                                    e.currentTarget.style.transform =
                                       "scale(1.05)";
                                    e.currentTarget.style.opacity = 1;
                                    e.currentTarget.style.boxShadow =
                                       "0 6px 20px rgba(255,255,255,0.3)";
                                 }}
                                 onMouseLeave={(e) => {
                                    e.currentTarget.style.transform =
                                       "scale(1)";
                                    e.currentTarget.style.opacity = 0.8;
                                    e.currentTarget.style.boxShadow = "none";
                                 }}
                                 onMouseDown={(e) =>
                                    (e.currentTarget.style.transform =
                                       "scale(0.95)")
                                 }
                                 onMouseUp={(e) =>
                                    (e.currentTarget.style.transform =
                                       "scale(1.05)")
                                 }
                              >
                                 Modifier mon profil
                              </Button>
                           </div>
                        </div>
                     </div>
                  ) : (
                     /* Keep your old avatar + upload button for editing */

                     <div
                        style={{
                           position: "relative",
                           display: "inline-block",
                        }}
                     >
                        <Avatar
                           size={280}
                           style={{
                              borderRadius: "15%",
                           }}
                           src={displayImage}
                           icon={<UserOutlined />}
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
                              icon={<CameraOutlined />}
                              loading={uploading}
                              style={{
                                 position: "absolute",
                                 bottom: 0,
                                 right: 0,
                                 boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                              }}
                           />
                        </Upload>
                     </div>
                  )}
               </div>

               {/* Right Section - Form (only when editing) */}
               {isEditing && (
                  <div style={{ padding: "30px 40px 30px 0", width: "50%" }}>
                     <Form form={form} layout="vertical" size="large">
                        <div
                           style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: "16px",
                           }}
                        >
                           <Form.Item
                              label={<Text strong>Prénom</Text>}
                              name="firstName"
                           >
                              <Input
                                 disabled={!isEditing}
                                 placeholder="Votre prénom"
                                 style={{ borderRadius: "8px" }}
                              />
                           </Form.Item>

                           <Form.Item
                              label={<Text strong>Nom</Text>}
                              name="lastName"
                           >
                              <Input
                                 disabled={!isEditing}
                                 placeholder="Votre nom"
                                 style={{ borderRadius: "8px" }}
                              />
                           </Form.Item>
                        </div>

                        <Form.Item
                           label={<Text strong>Adresse e-mail</Text>}
                           name="email"
                        >
                           <Input
                              disabled={true}
                              placeholder="votre@email.com"
                              style={{ borderRadius: "8px" }}
                              type="email"
                           />
                        </Form.Item>

                        <div
                           style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: "16px",
                           }}
                        >
                           <Form.Item
                              label={<Text strong>Téléphone</Text>}
                              name="phoneNumber"
                           >
                              <Input
                                 disabled={!isEditing}
                                 placeholder="+216 XX XXX XXX"
                                 style={{ borderRadius: "8px" }}
                              />
                           </Form.Item>

                           <Form.Item
                              label={<Text strong>Genre</Text>}
                              name="gender"
                           >
                              <Select
                                 disabled={!isEditing}
                                 placeholder="Sélectionner"
                                 style={{ borderRadius: "8px" }}
                              >
                                 <Option value="MALE">🚹 Homme</Option>
                                 <Option value="FEMALE">🚺 Femme</Option>
                              </Select>
                           </Form.Item>
                        </div>

                        <Form.Item
                           label={<Text strong>Date de naissance</Text>}
                           name="dateOfBirth"
                        >
                           <DatePicker
                              disabled={!isEditing}
                              style={{ width: "100%", borderRadius: "8px" }}
                              placeholder="Sélectionner une date"
                              format="DD/MM/YYYY"
                           />
                        </Form.Item>

                        <Divider />

                        <Space
                           size="middle"
                           style={{ display: "flex", justifyContent: "center" }}
                        >
                           <Button
                              type="primary"
                              icon={<SaveOutlined />}
                              onClick={handleSave}
                              size="large"
                              style={{
                                 borderRadius: "8px",
                                 background:
                                    "linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)",
                                 border: "none",
                                 boxShadow: "0 4px 15px rgba(0, 147, 233, 0.4)",
                              }}
                           >
                              Sauvegarder
                           </Button>
                           <Button
                              icon={<CloseOutlined />}
                              onClick={handleCancel}
                              size="large"
                              style={{ borderRadius: "8px" }}
                           >
                              Annuler
                           </Button>
                        </Space>
                     </Form>
                  </div>
               )}
            </div>
         </Card>
      </div>
   );
}
