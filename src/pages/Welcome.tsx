import BalanceStats from '@/components/BalanceStats';
import Coins from '@/components/CoinStats/Coins';
import TrackingChart from '@/components/TrackingChart';
import {
  downloadPayins,
  fetchMerchantAnalytics,
  fetchMerchantsList,
} from '@/services/ant-design-pro/api';
import { Column } from '@ant-design/charts';
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

const { Statistic, Divider } = StatisticCard;

function daysBetween(date1: string, date2: string): number {
  const d1: Date = new Date(date1);
  const d2: Date = new Date(date2);

  const daysDifference = (d2 - d1) / (1000 * 60 * 60 * 24);

  return Math.abs(daysDifference);
}

function dateFromMs(ms: number): string {
  return new Date(ms).toISOString().substring(0, 10);
}

function asINR(n: number): string {
  if (!n) return '₹ --';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR' }).format(n);
}

const coins = [
  {
    icon: <img src="/assets/icons/bitcoin.svg" alt=""/>,
    title: "Deposit (345)",
    description: "1617435737"
  },
  {
    icon: <img src="/assets/icons/bitcoin.svg" alt=""/>,
    title: "Deposit %",
    description: "16174"
  },
  {
    icon: <img src="/assets/icons/bitcoin.svg" alt=""/>,
    title: "Withdrawals (52)",
    description: "1617435737"
  },
  {
    icon: <img src="/assets/icons/bitcoin.svg" alt=""/>,
    title: "Withdrawals %",
    description: "16174"
  },
]

const graphData = [
  {
      name:"10:00",
      channel1: 234,
      channel2: 61,
  },
  {
      name:"10:30",
      channel1: 45,
      channel2: 672,
  },
  {
      name:"11:00",
      channel1: 221,
      channel2: 752,
  },
  {
      name:"11:30",
      channel1: 32,
      channel2: 912,
  },
  {
      name:"12:00",
      channel1: 123,
      channel2: 189,
  },
  {
      name:"12:30",
      channel1: 340,
      channel2: 95,
  },
  {
      name:"13:00",
      channel1: 21,
      channel2: 732,
  },
  {
      name:"13:30",
      channel1: 450,
      channel2: 372,
  },
  {
      name:"14:00",
      channel1: 221,
      channel2: 561,
  },
  {
      name:"14:30",
      channel1: 320,
      channel2: 238,
  },
  {
      name:"15:00",
      channel1: 620,
      channel2: 157,
  },
  {
      name:"15:30",
      channel1: 195,
      channel2: 486,
  },
]

const option = [
  {
    title: "12H",
    value: 1000 * 60 * 60 * 12,
  },
  {
    title: "1D",
    value: 1000 * 60 * 60 * 24,
  },
  {
    title: "7D",
    value: 1000 * 60 * 60 * 24 * 7,
  },
  {
    title: "15D",
    value: 1000 * 60 * 60 * 24 * 15,
  },
]

const Welcome = () => {
  /* Preload merchants list */
  const [merchantsList, setMerchantsList] = useState<API.LinkedMerchantListItem[]>([]);
  const [analytics, setAnalytics] = useState<API.AnalyticsData>();
  const [deposit, setDeposit] = useState(1000 * 60 * 60 * 24);
  const [depositData, setDepositData] = useState();

  const [formValues, setFormValues] = useState({
    merchant_code: '',
    time_period: [Date.now() - 1000 * 60 * 60 * 15, Date.now()],
  });

  useEffect(() => {
    (async () => {
      try {
        const fetchedMerchants = await fetchMerchantsList('');
        setMerchantsList(fetchedMerchants);
      } catch (error) {
        console.error('Error fetching merchants:', error);
      }
    })();
  }, []);

  useEffect(() => {
    handleFormSubmit("submit");
  }, [formValues])

  const handleFormSubmit = async (action) => {
    console.log('Form values:', formValues);
    const { merchant_code, time_period } = formValues;
    const [from_date, to_date] = time_period;

    if (daysBetween(from_date, to_date) >= 15) {
      message.error('Please select a date range within 15 days');
      return;
    }

    try {
      if (action === 'download') {
        await downloadPayins(merchant_code, dateFromMs(from_date), dateFromMs(to_date));
      } else if (action === 'submit') {
        console.log("analytics", action)
        const data = await fetchMerchantAnalytics(
          merchant_code,
          dateFromMs(from_date),
          dateFromMs(to_date),
        );
        console.log("analytics", data)
        setAnalytics(data);
      }
    } catch (error) {
      message.error(`Failed to ${action}`);
    }
  };

  const handleMerchantChange = (value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      merchant_code: value,
    }));
  };

  const handleDateChange = (value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      time_period: value,
    }));
  };

  const { balance, lastHour, lastDay, lastWeek } = analytics || {
    lastHour: { deposit_count: '--' },
    lastDay: { deposit_count: '--', histogram: [] },
    lastWeek: { deposit_count: '--', histogram: [] },
  };

  const hourlyDataConfig = {
    data: lastDay.histogram.map((value) => ({
      hour_ist: value.hour_ist.split(' ')[1].split(':')[0] + ':00',
      amount: value.amount,
    })),
    xField: 'hour_ist',
    yField: 'amount',
    colorField: 'hour_ist',
  };

  const dailyDataConfig = {
    data: lastWeek.histogram,
    xField: 'day_ist',
    yField: 'amount',
    colorField: 'day_ist',
  };

  const lh_dc = `${lastHour.deposit_count} #`;
  const ld_dc = `${lastDay.deposit_count} #`;

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
        <Col span = {14}>
          <Coins data = {coins}/>
        </Col>
        <Col span = {10}>
          <BalanceStats main ={{name: "Net Balance", value: "73846804"}} sub={[
            {name: "Deposits", value: "12345667"},
            {name: "Withdrawls", value: "1243189"},
            {name: "Commission", value: "8372"},
            {name: "Outstanding", value: "835248949"},
          ]}/>

        </Col>
      </Row>
        <div style={{
          margin:"20px 0",
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}>
          <TrackingChart graphData={graphData} duration={deposit} setDuration={setDeposit} options={option} />
          {/* <TrackingChart /> */}
        </div>
      {/* <Row gutter={[16, 16]}>
        // Left Half
        <Col span={12}>
          <StatisticCard.Group direction="row" boxShadow>
            <StatisticCard
              statistic={{
                title: 'This Hour Deposits',
                value: `${asINR(lastHour.deposit_amount)}`,
                description: <Statistic title="Count" value={lh_dc} />,
              }}
              chart={
                <img
                  src="https://gw.alipayobjects.com/zos/alicdn/ShNDpDTik/huan.svg"
                  alt="百分比"
                  width="100%"
                />
              }
              chartPlacement="left"
            />
            <Divider type="vertical" />
            <StatisticCard
              statistic={{
                title: "Today's Deposits",
                value: `${asINR(lastDay.deposit_amount)}`,
                description: <Statistic title="Count" value={ld_dc} />,
              }}
              chart={
                <img
                  src="https://gw.alipayobjects.com/zos/alicdn/6YR18tCxJ/huanlv.svg"
                  alt="百分比"
                  width="100%"
                />
              }
              chartPlacement="left"
            />
            <Divider type="vertical" />
            <StatisticCard
              statistic={{
                title: 'Balance',
                value: `${asINR(balance)}`,
              }}
              chartPlacement="left"
            />
          </StatisticCard.Group>
          <Divider type="horizontal" />
          <StatisticCard
            boxShadow
            statistic={{
              title: "Today's Deposits",
              value: `${asINR(lastDay.deposit_amount)}`,
            }}
            chart={<Column height={400} {...hourlyDataConfig} />}
          />
        </Col>

        // Right Half
        <Col span={12}>
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
                        key="submit"
                        type="primary"
                        onClick={async () => {
                          const values = await props.form?.validateFields();
                          console.log(values, x);
                          handleFormSubmit('submit');
                        }}
                      >
                        Submit
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        key="download"
                        icon={<DownloadOutlined />}
                        style={{ backgroundColor: '#fa8c16', borderColor: '#fa8c16' }}
                        onClick={async () => {
                          const values = await props.form?.validateFields();
                          console.log(values);
                          handleFormSubmit('download');
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
            >
              <ProFormDateRangePicker
                labelCol={{ span: 4 }}
                width="sm"
                name="time_period"
                label="Select Duration"
                fieldProps={{
                  format: (value) => value.format('YYYY-MM-DD'),
                }}
                required
              />
            </ProForm>
          </ProCard>
          <Divider type="horizontal" />
          <StatisticCard
            boxShadow
            statistic={{
              title: "Duration's Deposits",
              value: `${asINR(lastWeek.deposit_amount)}`,
            }}
            chart={<Column height={400} {...dailyDataConfig} />}
          />
        </Col>
      </Row> */}
    </PageContainer>
  );
};

export default Welcome;
