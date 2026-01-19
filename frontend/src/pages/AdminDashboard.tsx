import React, { useState } from 'react'
import { Layout, Tabs, Card, Statistic, Row, Col, Button, Form, Input, Select, DatePicker, Upload, message } from 'antd'
import { VideoCameraAddOutlined, CalendarOutlined, TimerOutlined, SchoolOutlined, HospitalOutlined, BookOutlined, GlobalOutlined } from '@ant-design/icons'

const { Header, Content } = Layout
const { TabPane } = Tabs
const { Option } = Select
const { RangePicker } = DatePicker

const AdminDashboard = () => {
  const [activeKey, setActiveKey] = useState('overview')

  // Données mockées - à remplacer par tes API backend
  const stats = {
    enseignants: 1245,
    hopitaux: 42,
    ecoles: 156,
    cotisations: '2.4M CDF',
    videosPubliees: 23
  }

  const handleSubmitMESP = (values: any) => {
    // TODO: Appel API backend /api/admin/mesp
    message.success('MESP mise à jour avec succès!')
  }

  const handleAddHopital = (values: any) => {
    message.success('Hôpital ajouté!')
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="site-layout-background" style={{ padding: 0, background: '#001529' }}>
        <div className="logo" style={{ color: 'white', padding: '0 24px', fontSize: '18px' }}>
          MESP-RDC Admin v5.0
        </div>
      </Header>

      <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
        <h1 style={{ fontSize: '28px', marginBottom: 24 }}>Tableau de Bord Administrateur Principal</h1>

        <Tabs activeKey={activeKey} onChange={setActiveKey} tabPosition="left" style={{ height: '80vh' }}>
          
          {/* 1. Vue d'ensemble */}
          <TabPane tab={<span><GlobalOutlined /> Vue d'ensemble</span>} key="overview">
            <Row gutter={16}>
              <Col span={6}>
                <Card>
                  <Statistic title="Enseignants MESP" value={stats.enseignants} valueStyle={{ color: '#3f8600' }} />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic title="Hôpitaux partenaires" value={stats.hopitaux} valueStyle={{ color: '#1890ff' }} />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic title="Écoles partenaires" value={stats.ecoles} valueStyle={{ color: '#cf1322' }} />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic title="Cotisations Mois" value={stats.cotisations} prefix="CDF" />
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* 2. Gestion MESP & Structures */}
          <TabPane tab={<span><HospitalOutlined /> MESP & Structures</span>} key="structures">
            <Tabs defaultActiveKey="mesp" tabPosition="top">
              <TabPane tab="MESP" key="mesp">
                <Form onFinish={handleSubmitMESP} layout="vertical" style={{ maxWidth: 800 }}>
                  <Form.Item label="Nom complet" name="nomComplet" rules={[{ required: true }]}>
                    <Input placeholder="Mutuelle de Santé des Enseignants du Primaire..." />
                  </Form.Item>
                  <Form.Item label="Sigle" name="sigle">
                    <Input placeholder="MESP-RDC" />
                  </Form.Item>
                  <Form.Item label="Site web" name="site">
                    <Input placeholder="https://mesprdc.org" />
                  </Form.Item>
                  <Form.Item label="Téléphone" name="telephone">
                    <Input placeholder="+243 81 123 4567" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" icon={<GlobalOutlined />}>
                      Mettre à jour MESP
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>

              <TabPane tab="Hôpitaux" key="hopitaux">
                <Button type="dashed" icon={<HospitalOutlined />} style={{ marginBottom: 16 }}>
                  + Ajouter un hôpital
                </Button>
                {/* TODO: Tableau des hôpitaux */}
              </TabPane>

              <TabPane tab="Écoles" key="ecoles">
                <Button type="dashed
