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
   Space,
   Typography,
   Row,
   Col,
   Divider,
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
               weight: user.weight || null,
               height: user.height || null,
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
            weight: userData.weight || null,
            height: userData.height || null,
            bloodType: userData.bloodType || null,
            allergies: userData.allergies || "",
            chronicConditions: userData.chronicConditions || "",
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
            weight: values.weight || null,
            height: values.height || null,
            bloodType: values.bloodType || null,
            allergies: values.allergies || null,
            chronicConditions: values.chronicConditions || null,
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
               background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
               borderRadius: "24px",
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
               background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
               border: "none",
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
         ? userData.profilePictureUrl.startsWith("http")
            ? userData.profilePictureUrl
            : `http://localhost:8081/uploads/${userData.profilePictureUrl}`
         : undefined);

   return (
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
         {!isEditing ? (
            // View Mode - Full Screen Profile Display
            <Card
               style={{
                  borderRadius: "32px",
                  border: "none",
                  overflow: "hidden",
                  background:
                     "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",

                  height: "80vh",
                  position: "relative",
               }}
               bodyStyle={{ padding: 0 }}
            >
               {/* Background Pattern */}
               <div
                  style={{
                     position: "absolute",
                     top: 0,
                     left: 0,
                     right: 0,
                     bottom: 0,
                     backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}
               />

               {/* Content */}
               <div
                  style={{
                     position: "relative",
                     zIndex: 2,
                     padding: "80px 60px",
                     textAlign: "center",
                     color: "#ffffff",
                  }}
               >
                  {/* Profile Image */}
                  <div
                     style={{
                        position: "relative",
                        display: "inline-block",
                        marginBottom: "32px",
                     }}
                  >
                     <Avatar
                        size={200}
                        src={displayImage}
                        icon={<UserOutlined />}
                        style={{
                           border: "6px solid rgba(255, 255, 255, 0.2)",
                           boxShadow: "0 16px 48px rgba(0,0,0,0.2)",
                           backgroundColor: "rgba(255, 255, 255, 0.1)",
                        }}
                     />

                     {/* Online indicator */}
                     <div
                        style={{
                           position: "absolute",
                           bottom: "10px",
                           right: "10px",
                           width: "24px",
                           height: "24px",
                           background: "#48bb78",
                           border: "4px solid #ffffff",
                           borderRadius: "50%",
                           boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                        }}
                     />
                  </div>

                  {/* User Info */}
                  <div style={{ marginBottom: "40px" }}>
                     <Title
                        level={1}
                        style={{
                           color: "#ffffff",
                           fontSize: "36px",
                           fontWeight: 700,
                           marginBottom: "8px",
                           letterSpacing: "-1px",
                        }}
                     >
                        {userData.firstName && userData.lastName
                           ? `${userData.firstName} ${userData.lastName}`
                           : "Utilisateur VitaCare"}
                     </Title>

                     <Text
                        style={{
                           color: "rgba(255, 255, 255, 0.8)",
                           fontSize: "18px",
                           display: "block",
                           marginBottom: "24px",
                        }}
                     >
                        {userData.email}
                     </Text>

                     {/* Quick Stats */}
                     <div
                        style={{
                           display: "flex",
                           justifyContent: "center",
                           gap: "48px",
                           marginBottom: "32px",
                           flexWrap: "wrap",
                        }}
                     >
                        {userData.phoneNumber && (
                           <div style={{ textAlign: "center" }}>
                              <PhoneOutlined
                                 style={{
                                    fontSize: "24px",
                                    marginBottom: "8px",
                                 }}
                              />
                              <div style={{ fontSize: "14px", opacity: 0.8 }}>
                                 {userData.phoneNumber}
                              </div>
                           </div>
                        )}

                        {userData.dateOfBirth && (
                           <div style={{ textAlign: "center" }}>
                              <CalendarOutlined
                                 style={{
                                    fontSize: "24px",
                                    marginBottom: "8px",
                                 }}
                              />
                              <div style={{ fontSize: "14px", opacity: 0.8 }}>
                                 {moment(userData.dateOfBirth).format(
                                    "DD/MM/YYYY"
                                 )}
                              </div>
                           </div>
                        )}

                        {userData.gender && (
                           <div style={{ textAlign: "center" }}>
                              <TeamOutlined
                                 style={{
                                    fontSize: "24px",
                                    marginBottom: "8px",
                                 }}
                              />
                              <div style={{ fontSize: "14px", opacity: 0.8 }}>
                                 {userData.gender === "MALE"
                                    ? "Homme"
                                    : "Femme"}
                              </div>
                           </div>
                        )}
                     </div>
                  </div>

                  {/* Edit Button */}
                  <Button
                     type="primary"
                     size="large"
                     icon={<EditOutlined />}
                     onClick={handleEdit}
                     style={{
                        background: "#ffffff",
                        color: "#667eea",
                        border: "none",
                        borderRadius: "16px",
                        padding: "8px 32px",
                        height: "56px",
                        fontSize: "16px",
                        fontWeight: 600,
                        boxShadow: "0 8px 24px rgba(255, 255, 255, 0.2)",
                        transform: "translateY(0)",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                     }}
                     onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
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
            </Card>
         ) : (
            // Edit Mode - Form Layout
            <Row gutter={[32, 32]}>
               {/* Left Column - Profile Picture */}
               <Col xs={24} lg={8}>
                  <Card
                     style={{
                        borderRadius: "24px",
                        border: "1px solid rgba(0,0,0,0.08)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                        background:
                           "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                        textAlign: "center",
                        padding: "40px 20px",
                        color: "#ffffff",
                        minHeight: "400px",
                     }}
                  >
                     <div
                        style={{
                           position: "relative",
                           display: "inline-block",
                           marginBottom: "32px",
                        }}
                     >
                        <Avatar
                           size={180}
                           src={displayImage}
                           icon={<UserOutlined />}
                           style={{
                              border: "4px solid rgba(255, 255, 255, 0.3)",
                              boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
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
                                 bottom: "10px",
                                 right: "10px",
                                 background: "#ffffff",
                                 color: "#6366f1",
                                 border: "none",
                                 width: "48px",
                                 height: "48px",
                                 boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                              }}
                           />
                        </Upload>
                     </div>

                     <Title
                        level={3}
                        style={{ color: "#ffffff", marginBottom: "8px" }}
                     >
                        Photo de profil
                     </Title>
                     <Text style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                        Cliquez sur l'icône appareil photo pour changer votre
                        photo
                     </Text>
                  </Card>
               </Col>

               {/* Right Column - Form */}
               <Col xs={24} lg={16}>
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
                                 background:
                                    "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                                 border: "none",
                                 fontWeight: 600,
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
                                 background: "#f1f5f9",
                                 border: "none",
                                 color: "#475569",
                                 fontWeight: 600,
                              }}
                           >
                              Annuler
                           </Button>
                        </div>
                     </Form>
                  </Card>
               </Col>
            </Row>
         )}
      </div>
   );
}
