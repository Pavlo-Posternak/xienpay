import React from 'react';
import {
  downloadPayouts,
  fetchMerchantsList
} from '@/services/ant-design-pro/api';
import { DownloadOutlined } from '@ant-design/icons';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormDateRangePicker,
  ProFormSelect,
  StatisticCard,
} from '@ant-design/pro-components';
import { Button, Col, Row, message } from 'antd';
import { useEffect, useState } from 'react';

function dateFromMs(ms: number): string {
  return new Date(ms).toISOString().substring(0, 10);
}

const Reports: React.FC = () => {
  const [merchantsList, setMerchantsList] = useState<API.LinkedMerchantListItem[]>([]);

  const [formValues, setFormValues] = useState({
    merchant_code: '',
    time_period: [Date.now() - 1000 * 3600 * 24 * 15, Date.now()],
  });

  const handleMerchantChange = (value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      merchant_code: value,
    }));
  };

  const handleDateChange = (value) => {
    setFormValues((prev) => ({
      ...prev,
      time_period: value
    }))
  }

  const handleDownload = async () => {
    
    const { merchant_code, time_period } = formValues;
    const [from_date, to_date] = time_period;

    await downloadPayouts(merchant_code, dateFromMs(from_date), dateFromMs(to_date));
  }

  useEffect(() => {
    (async () => {
      try {
        const fetchedMerchants = await fetchMerchantsList('');
        setMerchantsList(fetchedMerchants);
        handleMerchantChange(fetchedMerchants[0]?.label)
      } catch (error) {
        console.error('Error fetching merchants:', error);
      }
    })();
  }, []);

    return (
      <PageContainer>
        <Row gutter={[16, 16]}>
          <ProForm layout="horizontal" submitter={false}>
            <ProFormSelect
              width="lg"
              labelCol={{ span: 6 }}
              options={merchantsList.map((merchant) => merchant.label)}
              name="merchant_code"
              label="Merchant Code"
              required
              onChange={handleMerchantChange}
            />
          </ProForm>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={10}>
            <ProCard boxShadow>
              <ProForm
                layout="horizontal"
                initialValues={formValues}
                onValuesChange={(_, values) => handleDateChange(values.time_period)}
                submitter={{
                  render: (props, x) => (
                    <Row gutter={8} align="middle">
                      <Col>
                        <Button
                          key="download"
                          icon={<DownloadOutlined />}
                          style={{ backgroundColor: '#639f52', borderColor: '#639f52', color: "white" }}
                          onClick={async () => {
                            const values = await props.form?.validateFields();
                            console.log(values);
                            handleDownload();
                          }}
                        >
                          Download
                        </Button>
                      </Col>
                    </Row>
                  ),
                  searchConfig: {
                    submitText: 'Search',
                  },
                }}
                style={{
                  padding: "24px 32px"
                }}
              >
                <ProFormDateRangePicker
                  labelCol={{ span: 5 }}
                  width="md"
                  name="time_period"
                  label="Select Duration"
                  fieldProps={{
                    format: (value) => value.format('YYYY-MM-DD'),
                  }}
                  required
                />
              </ProForm>
            </ProCard>
          </Col>
        </Row>
      </PageContainer>
    );
  };
  
  export default Reports;