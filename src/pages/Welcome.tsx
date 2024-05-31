import BalanceStats from '@/components/BalanceStats';
import Coins from '@/components/CoinStats/Coins';
import TrackingChart from '@/components/TrackingChart';
import {
  downloadPayins,
  fetchMerchantAnalytics,
  fetchMerchantsList,
  fetchMerchantAnalyticsSnapshot,
  fetchMerchantAnalyticsPayins,
  fetchMerchantAnalyticsPayouts
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

const option = [
  {
    title: "12H",
    value: 1000 * 60 * 60 * 12,
  },
  {
    title: "7D",
    value: 1000 * 60 * 60 * 24 * 7,
  },
  {
    title: "15D",
    value: 1000 * 60 * 60 * 24 * 14,
  },
]

const Welcome = () => {
  /* Preload merchants list */
  const [merchantsList, setMerchantsList] = useState<API.LinkedMerchantListItem[]>([]);
  const [analytics, setAnalytics] = useState<API.AnalyticsData>();
  const [deposit, setDeposit] = useState(1000 * 60 * 60 * 24 * 7);
  const [depositData, setDepositData] = useState({payins: []});
  const [withdraw, setWithdraw] = useState(1000 * 60 * 60 * 24 * 7)
  const [withdrawData, setWithdrawData] = useState({payouts: []});
  const [snapshot, setSnapshot] = useState();

  const [formValues, setFormValues] = useState({
    merchant_code: '',
    time_period: [Date.now() - 1000 * 60 * 60 * 24 * 7, Date.now()],
    time_period2: [Date.now() - 1000 * 60 * 60 * 24 * 7, Date.now()]
  });

  const coins = [
    {
      icon: <img src="/assets/icons/deposit.jpg" width="52" alt=""/>,
      title: `Deposit (${snapshot?.lifetime?.deposits?.count ?? 0})`,
      description: `${snapshot?.lifetime?.deposits?.amount ?? 0}`
    },
    {
      icon: <img src="/assets/icons/commission.jpg" width="52" alt=""/>,
      title: "Deposit %",
      description:  `${snapshot?.lifetime?.deposits?.commission ?? 0}`
    },
    {
      icon: <img src="/assets/icons/withdraw.jpg" width="52" alt=""/>,
      title: `Withdrawals (${snapshot?.lifetime?.withdrawals?.count ?? 0})`,
      description: `${snapshot?.lifetime?.withdrawals?.amount ?? 0}`
    },
    {
      icon: <img src="/assets/icons/commission.jpg" width="52" alt=""/>,
      title: "Withdrawals %",
      description: `${snapshot?.lifetime?.withdrawals?.commission ?? 0}`
    },
  ]

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

  useEffect(() => {
    handleFormSubmit("snapshot");
  }, [formValues.merchant_code])

  useEffect(() => {
    handleFormSubmit("submit");
  }, [formValues.merchant_code, formValues.time_period])

  useEffect(() => {
    handleFormSubmit("submit2");
  }, [formValues.merchant_code, formValues.time_period2])

  useEffect(() => {
    setFormValues({
      ...formValues,
      time_period: [Date.now() - deposit, Date.now()]
    })
  }, [deposit]);

  useEffect(() => {
    setFormValues({
      ...formValues,
      time_period2: [Date.now() - withdraw, Date.now()]
    })
  }, [withdraw]);

  const handleFormSubmit = async (action: string) => {
    console.log('Form values:', formValues);
    const { merchant_code, time_period, time_period2 } = formValues;

    try {
      // if (action === 'download') {
      //   await downloadPayins(merchant_code, dateFromMs(from_date), dateFromMs(to_date));
      // } else 
      if (action === 'submit') {
        const [from_date, to_date] = time_period;
        if (daysBetween(from_date, to_date) >= 15) {
          message.error('Please select a date range within 15 days');
          return;
        }
        
        const payins = await fetchMerchantAnalyticsPayins(
          merchant_code,
          dateFromMs(from_date),
          dateFromMs(to_date),
        );
        console.log("-----------payins-------------", payins)
        setDepositData(payins);
      } else if (action === 'submit2') {
        const [from_date, to_date] = time_period2;
        if (daysBetween(from_date, to_date) >= 15) {
          message.error('Please select a date range within 15 days');
          return;
        }
        const payouts = await fetchMerchantAnalyticsPayouts(
          merchant_code,
          dateFromMs(from_date),
          dateFromMs(to_date),
        );
        console.log("-----------payouts-------------", payouts)
        setWithdrawData(payouts);
      } else if (action === 'snapshot') {

        const snap = await fetchMerchantAnalyticsSnapshot(
          merchant_code,
          dateFromMs(Date.now() - 3600000 * 24 * 14),
          dateFromMs(Date.now())
        )
        console.log("---------snapshot----------", snap)
        setSnapshot(snap);
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
            value={merchantsList[0]?.label}
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
          <BalanceStats main ={{name: "Net Balance", value: `${snapshot?.lifetime?.balance ?? 0}`}} sub={[
            {name: "Deposits", value: `${snapshot?.lifetime?.deposits?.amount ?? 0}`},
            {name: "Withdrawls", value: `${snapshot?.lifetime?.withdrawals?.amount ?? 0}`},
            {name: "Commission", value: `${snapshot?.lifetime?.deposits?.commission ?? 0 + snapshot?.lifetime?.withdrawals?.commission ?? 0}`},
            {name: "Outstanding", value: `${snapshot?.lifetime?.settlements?.amount ?? 0}`},
          ]}/>

        </Col>
      </Row>
        <div style={{
          margin:"20px 0",
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}>
          <TrackingChart graphData={depositData.payins.map(item => {
            return {
              name: item.day_ist,
              channel1: item.amount,
              channel2: 0
            }
          })} title={`DEPOSIT`} amount={depositData.amount} count={depositData.count} duration={deposit} setDuration={setDeposit} options={option} />
          
          <TrackingChart graphData={withdrawData.payouts.map(item => {
            return {
              name: item.day_ist,
              channel1: item.amount,
              channel2: 0
            }
          })} title={`WITHDRAW`} amount={withdrawData.amount} count={withdrawData.count} duration={withdraw} setDuration={setWithdraw} options={option} />
        </div>
    </PageContainer>
  );
};

export default Welcome;
